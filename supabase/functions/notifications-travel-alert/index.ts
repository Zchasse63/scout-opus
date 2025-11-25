import { serve } from "https://deno.land/std@0.132.0/http/server.ts";

const ONESIGNAL_APP_ID = Deno.env.get("ONESIGNAL_APP_ID");
const ONESIGNAL_API_KEY = Deno.env.get("ONESIGNAL_API_KEY");

interface TravelAlertRequest {
  userId: string;
  destination: string;
  daysUntilTrip: number;
  gymCount: number;
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { userId, destination, daysUntilTrip, gymCount } = await req.json() as TravelAlertRequest;

    if (!userId || !destination) {
      return new Response(
        JSON.stringify({ error: "userId and destination are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    let title = "";
    let content = "";

    if (daysUntilTrip === 7) {
      title = `${destination} Trip Coming Up! 🏋️`;
      content = `${gymCount} gyms found near your destination. Browse and book ahead?`;
    } else if (daysUntilTrip === 1) {
      title = `Arriving in ${destination} Tomorrow!`;
      content = `Book a gym now and never skip a workout 💪`;
    }

    // Send via OneSignal
    const notificationResponse = await fetch(
      "https://onesignal.com/api/v1/notifications",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${ONESIGNAL_API_KEY}`,
        },
        body: JSON.stringify({
          app_id: ONESIGNAL_APP_ID,
          include_external_user_ids: [userId],
          headings: { en: title },
          contents: { en: content },
          data: {
            type: "travel_alert",
            destination,
            daysUntilTrip,
          },
        }),
      }
    );

    if (!notificationResponse.ok) {
      throw new Error(`OneSignal API error: ${notificationResponse.status}`);
    }

    const result = await notificationResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        notificationId: result.id,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
