import { serve } from "https://deno.land/std@0.132.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@13.10.0?target=deno";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Platform fee percentage (15%)
const PLATFORM_FEE_PERCENT = 0.15;

interface CreatePaymentIntentRequest {
  gymId: string;
  userId: string;
  passType: "day" | "week" | "month";
  amount: number;
  bookingDate: string;
  customerEmail?: string;
  customerName?: string;
}

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const {
      gymId,
      userId,
      passType,
      amount,
      bookingDate,
      customerEmail,
      customerName
    } = await req.json() as CreatePaymentIntentRequest;

    // Validate input
    if (!gymId || !userId || !passType || !amount || !bookingDate) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: gymId, userId, passType, amount, bookingDate" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get gym's partner info including Stripe account
    const { data: partner, error: partnerError } = await supabase
      .from("partners")
      .select("id, stripe_account_id, stripe_onboarding_complete, business_name")
      .eq("gym_id", gymId)
      .eq("status", "active")
      .single();

    if (partnerError || !partner) {
      return new Response(
        JSON.stringify({ error: "Gym partner not found or not active" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!partner.stripe_account_id || !partner.stripe_onboarding_complete) {
      return new Response(
        JSON.stringify({ error: "This gym has not completed payment setup" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate amounts (all in cents)
    const totalAmountCents = Math.round(amount * 100);
    const platformFeeCents = Math.round(totalAmountCents * PLATFORM_FEE_PERCENT);
    const gymPayoutCents = totalAmountCents - platformFeeCents;

    // Create a booking record with pending status
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        user_id: userId,
        gym_id: gymId,
        partner_id: partner.id,
        pass_type: passType,
        booking_date: bookingDate,
        amount: amount,
        platform_fee: platformFeeCents / 100,
        gym_payout: gymPayoutCents / 100,
        status: "pending",
      })
      .select()
      .single();

    if (bookingError || !booking) {
      console.error("Failed to create booking:", bookingError);
      return new Response(
        JSON.stringify({ error: "Failed to create booking record" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Stripe PaymentIntent with application fee and destination
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmountCents,
      currency: "usd",
      payment_method_types: ["card", "apple_pay"],
      application_fee_amount: platformFeeCents,
      transfer_data: {
        destination: partner.stripe_account_id,
      },
      metadata: {
        booking_id: booking.id,
        gym_id: gymId,
        user_id: userId,
        pass_type: passType,
        booking_date: bookingDate,
      },
      receipt_email: customerEmail,
      description: `${passType} pass for ${partner.business_name}`,
    });

    // Update booking with Stripe payment intent ID
    await supabase
      .from("bookings")
      .update({ stripe_payment_intent_id: paymentIntent.id })
      .eq("id", booking.id);

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        bookingId: booking.id,
        totalAmount: amount,
        platformFee: platformFeeCents / 100,
        gymPayout: gymPayoutCents / 100,
        gymName: partner.business_name,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Payment intent creation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
