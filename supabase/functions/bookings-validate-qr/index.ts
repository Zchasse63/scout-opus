import { serve } from "https://deno.land/std@0.132.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface ValidateQRRequest {
  bookingId: string;
  signature?: string; // Optional HMAC signature for extra security
}

interface BookingRecord {
  id: string;
  user_id: string;
  gym_id: string;
  booking_date: string;
  status: 'pending' | 'confirmed' | 'used' | 'cancelled' | 'expired';
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  gym: {
    name: string;
  };
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
    const { bookingId, signature } = await req.json() as ValidateQRRequest;

    if (!bookingId) {
      return new Response(
        JSON.stringify({
          isValid: false,
          error: "Booking ID is required"
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch the booking with user and gym details
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select(`
        id,
        user_id,
        gym_id,
        booking_date,
        status,
        user:users!bookings_user_id_fkey (
          first_name,
          last_name,
          email
        ),
        gym:gyms!bookings_gym_id_fkey (
          name
        )
      `)
      .eq("id", bookingId)
      .single();

    if (fetchError || !booking) {
      return new Response(
        JSON.stringify({
          isValid: false,
          message: "Booking not found",
          error: fetchError?.message,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const typedBooking = booking as unknown as BookingRecord;
    const today = new Date().toISOString().split("T")[0];

    // Validate booking conditions
    if (typedBooking.status === "used") {
      return new Response(
        JSON.stringify({
          isValid: false,
          message: "This pass has already been used",
          userName: `${typedBooking.user.first_name} ${typedBooking.user.last_name}`,
          gymName: typedBooking.gym.name,
          usedAt: "Previously used",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (typedBooking.status === "cancelled") {
      return new Response(
        JSON.stringify({
          isValid: false,
          message: "This booking has been cancelled",
          userName: `${typedBooking.user.first_name} ${typedBooking.user.last_name}`,
          gymName: typedBooking.gym.name,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (typedBooking.status === "pending") {
      return new Response(
        JSON.stringify({
          isValid: false,
          message: "Payment not confirmed for this booking",
          userName: `${typedBooking.user.first_name} ${typedBooking.user.last_name}`,
          gymName: typedBooking.gym.name,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (typedBooking.booking_date !== today) {
      return new Response(
        JSON.stringify({
          isValid: false,
          message: `This pass is valid for ${typedBooking.booking_date}, not today (${today})`,
          userName: `${typedBooking.user.first_name} ${typedBooking.user.last_name}`,
          gymName: typedBooking.gym.name,
          validDate: typedBooking.booking_date,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update booking status to 'used' and record check-in time
    const { error: updateError } = await supabase
      .from("bookings")
      .update({
        status: "used",
        checked_in_at: new Date().toISOString(),
      })
      .eq("id", bookingId);

    if (updateError) {
      console.error("Failed to update booking status:", updateError);
      // Still return valid, but log the error
    }

    // Return success response
    return new Response(
      JSON.stringify({
        isValid: true,
        message: "✅ Pass validated successfully!",
        userName: `${typedBooking.user.first_name} ${typedBooking.user.last_name}`,
        gymName: typedBooking.gym.name,
        checkedInAt: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("QR validation error:", error);
    return new Response(
      JSON.stringify({
        isValid: false,
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
