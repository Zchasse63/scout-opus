import { serve } from "https://deno.land/std@0.132.0/http/server.ts";

interface ValidateQRRequest {
  bookingId: string;
  currentDate: string;
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { bookingId, currentDate } = await req.json() as ValidateQRRequest;

    if (!bookingId || !currentDate) {
      return new Response(
        JSON.stringify({ error: "bookingId and currentDate are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // TODO: Call Supabase function to validate QR
    // For now, return a placeholder response

    return new Response(
      JSON.stringify({
        isValid: true,
        message: "Valid pass",
        userName: "John Doe",
        gymName: "Iron Temple Fitness",
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
