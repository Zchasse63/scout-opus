import { serve } from "https://deno.land/std@0.132.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const EXPO_ACCESS_TOKEN = Deno.env.get("EXPO_ACCESS_TOKEN");

interface TravelPeriod {
  id: number;
  user_id: string;
  destination_city: string;
  destination_state: string | null;
  destination_country: string;
  destination_lat: number;
  destination_lng: number;
  start_date: string;
  dismissed: boolean;
}

interface UserWithToken {
  id: string;
  raw_user_meta_data: {
    push_token?: string;
  };
}

interface ExpoPushMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  sound?: "default";
  categoryId?: string;
}

serve(async (req) => {
  // Allow both POST (from pg_cron/external scheduler) and GET (for manual testing)
  if (req.method !== "POST" && req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  try {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    // Calculate dates 7 days and 1 day from now
    const sevenDaysFromNow = new Date(now);
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const sevenDaysDate = sevenDaysFromNow.toISOString().split('T')[0];
    
    const oneDayFromNow = new Date(now);
    oneDayFromNow.setDate(oneDayFromNow.getDate() + 1);
    const oneDayDate = oneDayFromNow.toISOString().split('T')[0];

    // Query travel periods starting in 7 days or 1 day
    const { data: trips, error: tripsError } = await supabase
      .from('travel_periods')
      .select('*')
      .eq('dismissed', false)
      .or(`start_date.eq.${sevenDaysDate},start_date.eq.${oneDayDate}`)
      .returns<TravelPeriod[]>();

    if (tripsError) {
      throw new Error(`Failed to fetch travel periods: ${tripsError.message}`);
    }

    if (!trips || trips.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: "No upcoming trips found", processed: 0 }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    const results = { sent: 0, skipped: 0, failed: 0, errors: [] as string[] };
    const messages: ExpoPushMessage[] = [];

    for (const trip of trips) {
      const tripStart = new Date(trip.start_date);
      const daysUntilTrip = Math.ceil((tripStart.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      // Only process 7-day or 1-day alerts
      if (daysUntilTrip !== 7 && daysUntilTrip !== 1) {
        continue;
      }

      const alertKey = `trip_${trip.id}_${daysUntilTrip}d`;

      // Check if already sent
      const { data: existingAlert } = await supabase
        .from('sent_alerts')
        .select('id')
        .eq('user_id', trip.user_id)
        .eq('alert_key', alertKey)
        .single();

      if (existingAlert) {
        results.skipped++;
        continue;
      }

      // Check user notification preferences
      const { data: userData } = await supabase
        .from('users')
        .select('preferences')
        .eq('id', trip.user_id)
        .single();

      if (userData?.preferences?.notifications?.travel_alerts === false) {
        results.skipped++;
        continue;
      }

      // Get user's push token from auth metadata
      const { data: authUser } = await supabase.auth.admin.getUserById(trip.user_id);
      const pushToken = authUser?.user?.user_metadata?.push_token;

      if (!pushToken || !pushToken.startsWith('ExponentPushToken')) {
        results.skipped++;
        continue;
      }

      // Count nearby gyms
      const { data: gymCount } = await supabase.rpc('count_gyms_in_radius', {
        lat: trip.destination_lat,
        lng: trip.destination_lng,
        radius_km: 10
      });

      const destination = trip.destination_state 
        ? `${trip.destination_city}, ${trip.destination_state}`
        : `${trip.destination_city}, ${trip.destination_country}`;

      // Build notification
      const title = daysUntilTrip === 7
        ? `${destination} Trip Coming Up! 🏋️`
        : `Arriving in ${destination} Tomorrow!`;
      
      const body = daysUntilTrip === 7
        ? `${gymCount || 0} gyms found near your destination. Browse and book ahead?`
        : `Book a gym now and never skip a workout 💪`;

      messages.push({
        to: pushToken,
        title,
        body,
        sound: "default",
        data: { type: "travel_alert", tripId: trip.id, destination, daysUntilTrip },
        categoryId: "travel",
      });

      // Record sent alert
      await supabase.from('sent_alerts').insert({
        user_id: trip.user_id,
        alert_key: alertKey,
        alert_type: 'travel_alert',
      });

      results.sent++;
    }

    // Send all notifications via Expo Push API
    if (messages.length > 0) {
      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(EXPO_ACCESS_TOKEN && { Authorization: `Bearer ${EXPO_ACCESS_TOKEN}` }),
        },
        body: JSON.stringify(messages),
      });

      if (!response.ok) {
        const errorData = await response.json();
        results.errors.push(`Expo Push API error: ${JSON.stringify(errorData)}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: trips.length,
        ...results,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Travel alerts scheduler error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

