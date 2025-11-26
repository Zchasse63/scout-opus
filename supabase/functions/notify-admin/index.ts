import { serve } from "https://deno.land/std@0.132.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SLACK_WEBHOOK_URL = Deno.env.get("SLACK_ADMIN_WEBHOOK_URL");
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") || "admin@scoutfitness.app";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

type AlertType = 
  | "new_partner_application"
  | "high_priority_ticket"
  | "content_moderation"
  | "payment_dispute"
  | "daily_summary";

interface AlertRequest {
  type: AlertType;
  data: Record<string, string | number>;
  priority?: "low" | "medium" | "high" | "urgent";
}

interface SlackBlock {
  type: string;
  text?: { type: string; text: string; emoji?: boolean };
  fields?: Array<{ type: string; text: string }>;
}

function getAlertContent(type: AlertType, data: Record<string, string | number>): { 
  subject: string; 
  message: string;
  slackBlocks: SlackBlock[];
  emoji: string;
} {
  switch (type) {
    case "new_partner_application":
      return {
        subject: "🏋️ New Partner Application",
        message: `New gym application: ${data.gymName} in ${data.city}, ${data.state}`,
        emoji: "🏋️",
        slackBlocks: [
          { type: "header", text: { type: "plain_text", text: "New Partner Application", emoji: true } },
          { type: "section", fields: [
            { type: "mrkdwn", text: `*Gym Name:*\n${data.gymName}` },
            { type: "mrkdwn", text: `*Location:*\n${data.city}, ${data.state}` },
            { type: "mrkdwn", text: `*Contact:*\n${data.contactEmail}` },
            { type: "mrkdwn", text: `*Phone:*\n${data.phone || "N/A"}` },
          ]},
        ],
      };

    case "high_priority_ticket":
      return {
        subject: "🚨 High Priority Support Ticket",
        message: `Urgent ticket from ${data.userName}: ${data.subject}`,
        emoji: "🚨",
        slackBlocks: [
          { type: "header", text: { type: "plain_text", text: "🚨 High Priority Ticket", emoji: true } },
          { type: "section", fields: [
            { type: "mrkdwn", text: `*User:*\n${data.userName}` },
            { type: "mrkdwn", text: `*Subject:*\n${data.subject}` },
            { type: "mrkdwn", text: `*Category:*\n${data.category}` },
            { type: "mrkdwn", text: `*Ticket ID:*\n${data.ticketId}` },
          ]},
        ],
      };

    case "content_moderation":
      return {
        subject: "⚠️ Content Needs Review",
        message: `Flagged content: ${data.contentType} from ${data.userName}`,
        emoji: "⚠️",
        slackBlocks: [
          { type: "header", text: { type: "plain_text", text: "Content Moderation Alert", emoji: true } },
          { type: "section", fields: [
            { type: "mrkdwn", text: `*Content Type:*\n${data.contentType}` },
            { type: "mrkdwn", text: `*Submitted By:*\n${data.userName}` },
            { type: "mrkdwn", text: `*Gym:*\n${data.gymName}` },
            { type: "mrkdwn", text: `*Reason:*\n${data.flagReason || "Auto-flagged"}` },
          ]},
        ],
      };

    case "payment_dispute":
      return {
        subject: "💳 Payment Dispute Filed",
        message: `Dispute for $${data.amount} on booking ${data.bookingId}`,
        emoji: "💳",
        slackBlocks: [
          { type: "header", text: { type: "plain_text", text: "💳 Payment Dispute", emoji: true } },
          { type: "section", fields: [
            { type: "mrkdwn", text: `*Amount:*\n$${data.amount}` },
            { type: "mrkdwn", text: `*Booking ID:*\n${data.bookingId}` },
            { type: "mrkdwn", text: `*User:*\n${data.userName}` },
            { type: "mrkdwn", text: `*Gym:*\n${data.gymName}` },
          ]},
        ],
      };

    case "daily_summary":
      return {
        subject: "📊 Scout Daily Summary",
        message: `${data.newBookings} bookings, ${data.newUsers} new users, $${data.revenue} revenue`,
        emoji: "📊",
        slackBlocks: [
          { type: "header", text: { type: "plain_text", text: "📊 Daily Summary", emoji: true } },
          { type: "section", fields: [
            { type: "mrkdwn", text: `*Bookings:*\n${data.newBookings}` },
            { type: "mrkdwn", text: `*New Users:*\n${data.newUsers}` },
            { type: "mrkdwn", text: `*Revenue:*\n$${data.revenue}` },
            { type: "mrkdwn", text: `*Active Partners:*\n${data.activePartners}` },
          ]},
        ],
      };

    default:
      throw new Error(`Unknown alert type: ${type}`);
  }
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { type, data, priority = "medium" } = await req.json() as AlertRequest;

    if (!type || !data) {
      return new Response(
        JSON.stringify({ error: "type and data are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const content = getAlertContent(type, data);
    const results: { slack?: boolean; email?: boolean } = {};

    // Send to Slack if webhook configured
    if (SLACK_WEBHOOK_URL) {
      const slackResponse = await fetch(SLACK_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocks: content.slackBlocks }),
      });
      results.slack = slackResponse.ok;
    }

    // Send email for high/urgent priority
    if ((priority === "high" || priority === "urgent") && RESEND_API_KEY) {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Scout Alerts <alerts@scoutfitness.app>",
          to: [ADMIN_EMAIL],
          subject: `[${priority.toUpperCase()}] ${content.subject}`,
          html: `<h2>${content.emoji} ${content.subject}</h2><p>${content.message}</p>`,
        }),
      });
      results.email = emailResponse.ok;
    }

    return new Response(
      JSON.stringify({ success: true, ...results }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Admin notification error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

