import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';
import { supabase } from '../lib/supabase';

export interface CalendarEvent {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  notes?: string;
}

export interface ParsedTrip {
  destinationCity: string;
  destinationState: string;
  destinationCountry: string;
  destinationLat: number;
  destinationLng: number;
  startDate: string;
  endDate: string;
  confidenceScore: number;
  sourceEventId: string;
}

/**
 * Request calendar permissions
 * Returns true if permission is granted
 */
export async function requestCalendarPermissions(): Promise<boolean> {
  if (Platform.OS !== 'ios') {
    return false;
  }

  const { status } = await Calendar.requestCalendarPermissionsAsync();
  return status === 'granted';
}

/**
 * Fetch calendar events from iOS Calendar
 * Looks for events in the next 6 months that might indicate travel
 */
export async function fetchCalendarEvents(): Promise<CalendarEvent[]> {
  if (Platform.OS !== 'ios') {
    return [];
  }

  try {
    const hasPermission = await requestCalendarPermissions();
    if (!hasPermission) {
      throw new Error('Calendar permission not granted');
    }

    // Get calendars
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    if (calendars.length === 0) {
      return [];
    }

    // Fetch events for the next 6 months
    const now = new Date();
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

    const events = await Calendar.getEventsAsync(
      calendars.map((c) => c.id),
      now,
      sixMonthsLater
    );

    // Filter events that might indicate travel (multi-day, has location, or travel keywords)
    const travelKeywords = ['flight', 'hotel', 'trip', 'travel', 'vacation', 'conference'];

    return events
      .filter((event) => {
        const title = event.title?.toLowerCase() || '';
        const notes = event.notes?.toLowerCase() || '';
        const hasLocation = !!event.location;
        const hasKeyword = travelKeywords.some(
          (keyword) => title.includes(keyword) || notes.includes(keyword)
        );

        // Include if it has a location or travel keywords
        return hasLocation || hasKeyword;
      })
      .map((event) => ({
        id: event.id,
        title: event.title,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
        location: event.location ?? undefined,
        notes: event.notes ?? undefined,
      }));
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw error;
  }
}

/**
 * Parse calendar events to extract travel destinations
 * Uses Supabase Edge Function to call AI for parsing
 */
export async function parseCalendarEventsToTrips(
  events: CalendarEvent[]
): Promise<ParsedTrip[]> {
  if (events.length === 0) {
    return [];
  }

  try {
    // Call Edge Function to parse calendar events
    // The Edge Function will use AI to extract destination information
    const { data, error } = await supabase.functions.invoke('parse-calendar-events', {
      body: {
        events: events.map((e) => ({
          id: e.id,
          title: e.title,
          startDate: e.startDate.toISOString(),
          endDate: e.endDate.toISOString(),
          location: e.location,
          notes: e.notes,
        })),
      },
    });

    if (error) {
      throw new Error(`Failed to parse calendar events: ${error.message}`);
    }

    return data.trips || [];
  } catch (error) {
    console.error('Error parsing calendar events:', error);
    throw error;
  }
}

/**
 * Sync calendar events to travel periods in Supabase
 * Returns the number of trips created/updated
 */
export async function syncCalendarToTrips(): Promise<number> {
  try {
    // 1. Fetch calendar events
    const events = await fetchCalendarEvents();
    if (events.length === 0) {
      return 0;
    }

    // 2. Parse events to extract trip information
    const parsedTrips = await parseCalendarEventsToTrips(events);
    if (parsedTrips.length === 0) {
      return 0;
    }

    // 3. Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    // 4. For each parsed trip, upsert to database
    let createdCount = 0;
    const tripsToAlert: ParsedTrip[] = [];

    for (const trip of parsedTrips) {
      const { data, error } = await supabase.from('travel_periods').upsert(
        {
          user_id: user.id,
          destination_city: trip.destinationCity,
          destination_state: trip.destinationState,
          destination_country: trip.destinationCountry,
          destination_lat: trip.destinationLat,
          destination_lng: trip.destinationLng,
          start_date: trip.startDate,
          end_date: trip.endDate,
          confidence_score: trip.confidenceScore,
          source: 'ios_calendar',
          source_event_id: trip.sourceEventId,
        },
        {
          onConflict: 'user_id,source_event_id',
        }
      ).select();

      if (!error && data) {
        createdCount++;
        tripsToAlert.push(trip);
      }
    }

    // 5. Check for trips that warrant proactive alerts
    if (tripsToAlert.length > 0) {
      await checkAndSendTravelAlerts(user.id, tripsToAlert);
    }

    return createdCount;
  } catch (error) {
    console.error('Error syncing calendar to trips:', error);
    throw error;
  }
}

/**
 * Check upcoming trips and send proactive alerts
 * Sends alerts for trips that are 7 days or 1 day away
 */
async function checkAndSendTravelAlerts(userId: string, trips: ParsedTrip[]): Promise<void> {
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  for (const trip of trips) {
    const tripStart = new Date(trip.startDate);
    const daysUntilTrip = Math.ceil((tripStart.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Only send alerts for trips 7 days or 1 day away
    if (daysUntilTrip !== 7 && daysUntilTrip !== 1) {
      continue;
    }

    // Check if we already sent an alert for this trip/timing combo
    const alertKey = `${trip.sourceEventId}_${daysUntilTrip}d`;
    const { data: existingAlert } = await supabase
      .from('sent_alerts')
      .select('id')
      .eq('user_id', userId)
      .eq('alert_key', alertKey)
      .single();

    if (existingAlert) {
      continue; // Already sent this alert
    }

    // Count gyms near destination
    const { count: gymCount } = await supabase.rpc('search_gyms_nearby', {
      lat: trip.destinationLat,
      lng: trip.destinationLng,
      radius_meters: 10000, // 10km radius
    });

    // Send the travel alert notification
    try {
      await supabase.functions.invoke('notifications-travel-alert', {
        body: {
          userId,
          destination: `${trip.destinationCity}, ${trip.destinationState || trip.destinationCountry}`,
          daysUntilTrip,
          gymCount: gymCount || 0,
        },
      });

      // Record that we sent this alert
      await supabase.from('sent_alerts').insert({
        user_id: userId,
        alert_key: alertKey,
        alert_type: 'travel_alert',
        sent_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Failed to send travel alert:', err);
    }
  }
}
