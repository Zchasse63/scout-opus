import { useState, useEffect, useCallback } from 'react';
import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';

interface CalendarEvent {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  notes?: string;
}

interface DetectedTrip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  source: 'calendar';
  calendarEventId: string;
  calendarTitle: string;
}

export const useCalendarSync = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [calendars, setCalendars] = useState<Calendar.Calendar[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([]);

  // Check permission status
  const checkPermission = useCallback(async () => {
    try {
      const { status } = await Calendar.getCalendarPermissionsAsync();
      setHasPermission(status === 'granted');
      return status === 'granted';
    } catch (error) {
      console.error('Error checking calendar permission:', error);
      return false;
    }
  }, []);

  // Request permission
  const requestPermission = useCallback(async () => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      setHasPermission(status === 'granted');
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting calendar permission:', error);
      return false;
    }
  }, []);

  // Load calendars
  const loadCalendars = useCallback(async () => {
    if (!hasPermission) return;

    try {
      const deviceCalendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );
      setCalendars(deviceCalendars);
    } catch (error) {
      console.error('Error loading calendars:', error);
    }
  }, [hasPermission]);

  // Fetch upcoming events
  const fetchUpcomingEvents = useCallback(
    async (daysAhead: number = 90) => {
      if (!hasPermission) return [];

      setIsLoading(true);
      try {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + daysAhead);

        const events = await Calendar.getEventsAsync(
          calendars.map((cal) => cal.id),
          startDate,
          endDate
        );

        const formattedEvents: CalendarEvent[] = events.map((event) => ({
          id: event.id,
          title: event.title,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate),
          location: event.location ?? undefined,
          notes: event.notes ?? '',
        }));

        setUpcomingEvents(formattedEvents);
        return formattedEvents;
      } catch (error) {
        console.error('Error fetching calendar events:', error);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [hasPermission, calendars]
  );

  // Detect potential trips from calendar events
  const detectTrips = useCallback(
    async (): Promise<DetectedTrip[]> => {
      if (!hasPermission) return [];

      try {
        const events = await fetchUpcomingEvents();
        const detectedTrips: DetectedTrip[] = [];

        // Keywords that indicate travel
        const travelKeywords = [
          'trip',
          'travel',
          'flight',
          'hotel',
          'vacation',
          'conference',
          'meeting',
          'visit',
        ];

        for (const event of events) {
          // Check if event is multi-day (at least 1 full day)
          const durationMs = event.endDate.getTime() - event.startDate.getTime();
          const durationDays = durationMs / (1000 * 60 * 60 * 24);

          if (durationDays < 1) continue;

          // Check if title or notes contain travel keywords
          const titleLower = event.title.toLowerCase();
          const notesLower = event.notes?.toLowerCase() || '';
          const hasTravelKeyword = travelKeywords.some(
            (keyword) =>
              titleLower.includes(keyword) || notesLower.includes(keyword)
          );

          // Check if event has a location that's not local
          const hasDistantLocation = event.location && event.location.length > 0;

          if (hasTravelKeyword || hasDistantLocation) {
            detectedTrips.push({
              id: `cal_${event.id}`,
              destination: event.location || event.title,
              startDate: event.startDate.toISOString(),
              endDate: event.endDate.toISOString(),
              source: 'calendar',
              calendarEventId: event.id,
              calendarTitle: event.title,
            });
          }
        }

        return detectedTrips;
      } catch (error) {
        console.error('Error detecting trips:', error);
        return [];
      }
    },
    [hasPermission, fetchUpcomingEvents]
  );

  // Add event to calendar
  const addEventToCalendar = useCallback(
    async (
      title: string,
      startDate: Date,
      endDate: Date,
      location?: string,
      notes?: string
    ): Promise<string | null> => {
      if (!hasPermission) {
        console.error('Calendar permission not granted');
        return null;
      }

      try {
        // Get default calendar
        const defaultCalendar = calendars.find(
          (cal) =>
            cal.allowsModifications &&
            (Platform.OS === 'ios' ? cal.allowsModifications : true)
        );

        if (!defaultCalendar) {
          console.error('No suitable calendar found');
          return null;
        }

        const eventId = await Calendar.createEventAsync(defaultCalendar.id, {
          title,
          startDate,
          endDate,
          location,
          notes,
          timeZone: 'GMT',
        });

        return eventId;
      } catch (error) {
        console.error('Error adding event to calendar:', error);
        return null;
      }
    },
    [hasPermission, calendars]
  );

  // Initialize
  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  useEffect(() => {
    if (hasPermission) {
      loadCalendars();
    }
  }, [hasPermission, loadCalendars]);

  return {
    hasPermission,
    isLoading,
    calendars,
    upcomingEvents,
    checkPermission,
    requestPermission,
    loadCalendars,
    fetchUpcomingEvents,
    detectTrips,
    addEventToCalendar,
  };
};
