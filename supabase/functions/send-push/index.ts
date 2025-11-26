import { serve } from "https://deno.land/std@0.132.0/http/server.ts";

const EXPO_ACCESS_TOKEN = Deno.env.get("EXPO_ACCESS_TOKEN");

type PushType = 
  | "booking_confirmed"
  | "booking_reminder"
  | "payment_received"
  | "support_update"
  | "travel_alert"
  | "streak_reminder"
  | "badge_earned";

interface PushRequest {
  pushTokens: string[];
  type: PushType;
  data: Record<string, string | number>;
}

interface ExpoPushMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  sound?: "default";
  badge?: number;
  categoryId?: string;
}

function getPushContent(type: PushType, data: Record<string, string | number>): { title: string; body: string; categoryId?: string } {
  switch (type) {
    case "booking_confirmed":
      return {
        title: "✅ Booking Confirmed!",
        body: `Your pass for ${data.gymName} is ready. Show the QR code at check-in.`,
        categoryId: "booking",
      };

    case "booking_reminder":
      return {
        title: `🏋️ Workout Today at ${data.gymName}`,
        body: "Don't forget your gym session! Your QR pass is ready.",
        categoryId: "booking",
      };

    case "payment_received":
      return {
        title: "💰 Payment Received",
        body: `You received $${data.amount} for a ${data.passType} pass booking.`,
        categoryId: "payment",
      };

    case "support_update":
      return {
        title: "📬 Support Response",
        body: "We've replied to your support request. Tap to view.",
        categoryId: "support",
      };

    case "travel_alert":
      return {
        title: `✈️ Trip to ${data.destination} Coming Up!`,
        body: `${data.gymCount} gyms found near your destination. Book ahead?`,
        categoryId: "travel",
      };

    case "streak_reminder":
      return {
        title: "🔥 Keep Your Streak Alive!",
        body: `You're on a ${data.currentStreak}-day streak. Don't break it!`,
        categoryId: "gamification",
      };

    case "badge_earned":
      return {
        title: "🏆 Badge Unlocked!",
        body: `You earned the "${data.badgeName}" badge! +${data.points} points.`,
        categoryId: "gamification",
      };

    default:
      throw new Error(`Unknown push type: ${type}`);
  }
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { pushTokens, type, data } = await req.json() as PushRequest;

    if (!pushTokens || !pushTokens.length || !type) {
      return new Response(
        JSON.stringify({ error: "pushTokens array and type are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const content = getPushContent(type, data || {});

    // Build Expo push messages
    const messages: ExpoPushMessage[] = pushTokens
      .filter((token) => token.startsWith("ExponentPushToken"))
      .map((token) => ({
        to: token,
        title: content.title,
        body: content.body,
        sound: "default" as const,
        data: { type, ...data },
        categoryId: content.categoryId,
      }));

    if (messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "No valid Expo push tokens provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Send to Expo Push API
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
      throw new Error(`Expo Push API error: ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();

    // Check for individual ticket errors
    const tickets = result.data || [];
    const errors = tickets.filter((t: { status: string }) => t.status === "error");

    return new Response(
      JSON.stringify({
        success: true,
        sent: tickets.length - errors.length,
        failed: errors.length,
        tickets,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Push send error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

