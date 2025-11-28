import { serve } from "https://deno.land/std@0.132.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const EXPO_ACCESS_TOKEN = Deno.env.get("EXPO_ACCESS_TOKEN");

interface TravelAlertRequest {
  userId: string;
  destination: string;
  daysUntilTrip: number;
  gymCount: number;
  pushToken?: string; // Optional - will fetch from user metadata if not provided
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
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // Validate service role key (this function is called by server-side processes)
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.includes(SUPABASE_SERVICE_ROLE_KEY)) {
    return new Response(
      JSON.stringify({ error: "Unauthorized - service role key required" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { userId, destination, daysUntilTrip, gymCount, pushToken: providedToken } = await req.json() as TravelAlertRequest;

    if (!userId || !destination) {
      return new Response(
        JSON.stringify({ error: "userId and destination are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get push token from user metadata if not provided
    let pushToken = providedToken;
    if (!pushToken) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { autoRefreshToken: false, persistSession: false }
      });

      const { data: authUser } = await supabase.auth.admin.getUserById(userId);
      pushToken = authUser?.user?.user_metadata?.push_token;
    }

    if (!pushToken || !pushToken.startsWith('ExponentPushToken')) {
      return new Response(
        JSON.stringify({ error: "No valid Expo push token found for user" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Build notification content
    let title = "";
    let body = "";

    if (daysUntilTrip === 7) {
      title = `${destination} Trip Coming Up! 🏋️`;
      body = `${gymCount} gyms found near your destination. Browse and book ahead?`;
    } else if (daysUntilTrip === 1) {
      title = `Arriving in ${destination} Tomorrow!`;
      body = `Book a gym now and never skip a workout 💪`;
    } else {
      title = `Trip to ${destination}`;
      body = `${gymCount} gyms available near your destination.`;
    }

    // Build Expo push message
    const message: ExpoPushMessage = {
      to: pushToken,
      title,
      body,
      sound: "default",
      data: {
        type: "travel_alert",
        destination,
        daysUntilTrip,
        gymCount,
      },
      categoryId: "travel",
    };

    // Send via Expo Push API
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(EXPO_ACCESS_TOKEN && { Authorization: `Bearer ${EXPO_ACCESS_TOKEN}` }),
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Expo Push API error: ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();
    const ticket = result.data;

    return new Response(
      JSON.stringify({
        success: true,
        ticket,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Travel alert notification error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
