import { serve } from "https://deno.land/std@0.132.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { requireAuth } from "../_shared/auth.ts";
import { checkRateLimit, RATE_LIMITS, rateLimitResponse, getIdentifier } from "../_shared/rateLimit.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

interface PersonalizeRequest {
  gymIds: string[];
}

const PROMPT = `Generate personalized "Why this gym" reasons based on user history.
Return JSON array: [{ "gymId": "123", "matchScore": 85, "reasons": ["Has sauna (you love saunas)"] }]
Max 3 reasons per gym, each under 50 chars. Be specific and reference their history.`;

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // Validate JWT authentication
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;
  const { user } = authResult;

  // Rate limit check (AI endpoint - stricter limits)
  const rateLimitResult = checkRateLimit(
    getIdentifier(req, user?.id),
    RATE_LIMITS.AI
  );
  if (!rateLimitResult.allowed) {
    return rateLimitResponse(rateLimitResult);
  }

  try {
    const { gymIds } = (await req.json()) as PersonalizeRequest;

    if (!gymIds?.length) {
      return new Response(
        JSON.stringify({ error: "gymIds required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Use authenticated user's ID instead of accepting it from request
    const userId = user!.id;
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Fetch user's booking history
    const { data: bookings } = await supabase
      .from("bookings")
      .select("gym_id, amount_paid, gyms(name)")
      .eq("user_id", userId)
      .eq("status", "used")
      .limit(20);

    // Fetch user's high ratings
    const { data: reviews } = await supabase
      .from("reviews")
      .select("gym_id, rating")
      .eq("user_id", userId)
      .gte("rating", 4);

    // Fetch target gyms
    const { data: gyms } = await supabase
      .from("gyms")
      .select("id, name, day_pass_price, gym_amenities(amenities(name))")
      .in("id", gymIds.map((id) => parseInt(id)));

    if (!gyms?.length) {
      return new Response(
        JSON.stringify({ personalizations: [] }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // Build context
    const avgPrice = bookings?.length
      ? bookings.reduce((sum, b) => sum + (b.amount_paid || 0), 0) / bookings.length
      : 0;

    const context = {
      avgPrice,
      bookedGyms: bookings?.map((b) => (b.gyms as { name: string })?.name) || [],
      highRatedGymIds: reviews?.map((r) => r.gym_id) || [],
    };

    const gymData = gyms.map((g) => ({
      id: g.id,
      name: g.name,
      price: g.day_pass_price,
      amenities: (g.gym_amenities as { amenities: { name: string } }[])
        ?.map((a) => a.amenities?.name)
        .filter(Boolean) || [],
    }));

    // Call Gemini
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY || "",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${PROMPT}\n\nUser context:\n${JSON.stringify(context)}\n\nGyms:\n${JSON.stringify(gymData)}`,
                },
              ],
            },
          ],
          generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let personalizations = [];
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        personalizations = JSON.parse(jsonMatch[0]);
      } catch {
        console.error("Failed to parse Gemini response");
      }
    }

    return new Response(
      JSON.stringify({ personalizations }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
