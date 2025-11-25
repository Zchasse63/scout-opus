import { serve } from "https://deno.land/std@0.132.0/http/server.ts";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");

interface CreatePaymentIntentRequest {
  gymId: string;
  passType: "day" | "week" | "month";
  amount: number;
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { gymId, passType, amount } = await req.json() as CreatePaymentIntentRequest;

    // Validate input
    if (!gymId || !passType || !amount) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Calculate amounts
    const totalAmountCents = Math.round(amount * 100);
    const platformFeeCents = Math.round(totalAmountCents * 0.15);

    // TODO: Get gym's Stripe connected account ID from database
    const gymStripeAccountId = `acct_${gymId}`; // Placeholder

    // TODO: Create PaymentIntent with Stripe
    // This is a placeholder - actual implementation requires Stripe SDK

    return new Response(
      JSON.stringify({
        clientSecret: "pi_test_secret",
        totalAmount: amount,
        platformFee: platformFeeCents / 100,
        gymPayout: (totalAmountCents - platformFeeCents) / 100,
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
