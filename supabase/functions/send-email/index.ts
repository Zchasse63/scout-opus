import { serve } from "https://deno.land/std@0.132.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "Scout <noreply@scoutfitness.app>";

type EmailType = 
  | "partner_approved"
  | "partner_rejected"
  | "booking_confirmed"
  | "booking_cancelled"
  | "refund_processed"
  | "support_reply"
  | "welcome";

interface EmailRequest {
  to: string;
  type: EmailType;
  data: Record<string, string | number>;
}

interface EmailTemplate {
  subject: string;
  html: string;
}

function getEmailTemplate(type: EmailType, data: Record<string, string | number>): EmailTemplate {
  switch (type) {
    case "partner_approved":
      return {
        subject: "🎉 Welcome to Scout Partner Network!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #10B981;">Congratulations, ${data.gymName}!</h1>
            <p>Your application to join the Scout Partner Network has been approved!</p>
            <p>You can now:</p>
            <ul>
              <li>Access your Partner Dashboard</li>
              <li>Set your day pass pricing</li>
              <li>Start receiving bookings from travelers</li>
            </ul>
            <p><a href="https://partner.scoutfitness.app" style="background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Open Partner Dashboard</a></p>
            <p>Welcome aboard!<br/>The Scout Team</p>
          </div>
        `,
      };

    case "partner_rejected":
      return {
        subject: "Scout Partner Application Update",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Application Update</h1>
            <p>Thank you for your interest in joining the Scout Partner Network.</p>
            <p>After careful review, we're unable to approve your application at this time.</p>
            ${data.reason ? `<p><strong>Reason:</strong> ${data.reason}</p>` : ""}
            <p>If you have questions or would like to discuss this further, please contact us at partners@scoutfitness.app</p>
            <p>Best regards,<br/>The Scout Team</p>
          </div>
        `,
      };

    case "booking_confirmed":
      return {
        subject: `✅ Booking Confirmed - ${data.gymName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #10B981;">Booking Confirmed!</h1>
            <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0;">${data.gymName}</h2>
              <p><strong>Date:</strong> ${data.bookingDate}</p>
              <p><strong>Pass Type:</strong> ${data.passType}</p>
              <p><strong>Amount:</strong> $${data.amount}</p>
            </div>
            <p>Your QR code pass is ready in the Scout app. Just show it at check-in!</p>
            <p><a href="scoutfitness://passes" style="background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Pass</a></p>
            <p>Enjoy your workout!<br/>The Scout Team</p>
          </div>
        `,
      };

    case "booking_cancelled":
      return {
        subject: `Booking Cancelled - ${data.gymName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Booking Cancelled</h1>
            <p>Your booking has been cancelled.</p>
            <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Gym:</strong> ${data.gymName}</p>
              <p><strong>Date:</strong> ${data.bookingDate}</p>
            </div>
            ${data.refundAmount ? `<p>A refund of $${data.refundAmount} will be processed within 5-10 business days.</p>` : ""}
            <p>Questions? Contact support@scoutfitness.app</p>
          </div>
        `,
      };

    case "refund_processed":
      return {
        subject: "💰 Your Refund Has Been Processed",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Refund Processed</h1>
            <p>We've processed your refund for ${data.gymName}.</p>
            <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Amount:</strong> $${data.refundAmount}</p>
              <p><strong>Original Booking:</strong> ${data.bookingDate}</p>
            </div>
            <p>The refund should appear in your account within 5-10 business days, depending on your bank.</p>
            <p>Best regards,<br/>The Scout Team</p>
          </div>
        `,
      };

    case "support_reply":
      return {
        subject: `Re: ${data.ticketSubject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Support Response</h1>
            <p>Hi ${data.userName},</p>
            <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p>${data.replyMessage}</p>
            </div>
            <p>If you have any more questions, just reply to this email.</p>
            <p>Best regards,<br/>Scout Support</p>
          </div>
        `,
      };

    case "welcome":
      return {
        subject: "Welcome to Scout! 🏋️",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #10B981;">Welcome to Scout!</h1>
            <p>Hi ${data.firstName || "there"},</p>
            <p>Thanks for joining Scout - your passport to gyms everywhere!</p>
            <h2>What you can do:</h2>
            <ul>
              <li>🔍 Search gyms by voice or text</li>
              <li>📍 Find gyms near you or your travel destination</li>
              <li>📱 Book day passes instantly with QR codes</li>
              <li>✈️ Connect your calendar for smart travel alerts</li>
            </ul>
            <p><a href="scoutfitness://explore" style="background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Start Exploring</a></p>
            <p>Happy workouts!<br/>The Scout Team</p>
          </div>
        `,
      };

    default:
      throw new Error(`Unknown email type: ${type}`);
  }
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { to, type, data } = await req.json() as EmailRequest;

    if (!to || !type) {
      return new Response(
        JSON.stringify({ error: "to and type are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const template = getEmailTemplate(type, data || {});

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject: template.subject,
        html: template.html,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Resend API error: ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();

    return new Response(
      JSON.stringify({ success: true, emailId: result.id }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Email send error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

