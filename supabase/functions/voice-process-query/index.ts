import { serve } from "https://deno.land/std@0.132.0/http/server.ts";
import { requireAuth } from "../_shared/auth.ts";
import { validateRequest, schemas } from "../_shared/validation.ts";
import { checkRateLimit, RATE_LIMITS, rateLimitResponse, rateLimitHeaders, getIdentifier } from "../_shared/rateLimit.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

const INTENT_PROMPT = `You are Scout's voice search assistant for finding gyms and fitness facilities.

TASK: Parse the user's query and extract structured search parameters. Consider the full conversation context.

REFINEMENT RULES:
- If user says "only ones with [amenity]" or "just show [filter]", ADD to existing filters
- If user says "cheaper" or "under $X", ADD price constraint
- If user says "closer" or "nearer", keep existing filters but prioritize distance
- If user says "forget that" or "start over", CLEAR previous context
- If user asks "which is cheapest/closest/best rated", set intent to "compare" with sort criteria

Extract as JSON:
{
  "intent": "search_gyms" | "refine_search" | "compare" | "get_details" | "book_pass",
  "location": { "query": string, "use_current": boolean },
  "facility_types": string[],
  "required_amenities": string[],
  "time_constraint": string | null,
  "price_constraint": { "max": number } | null,
  "sort_by": "distance" | "price" | "rating" | null,
  "is_refinement": boolean,
  "confidence": 0.0-1.0
}

Respond with valid JSON only.`;

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // Validate JWT authentication
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  // Rate limit check (AI endpoint - stricter limits)
  const rateLimitResult = checkRateLimit(
    getIdentifier(req, authResult.id),
    RATE_LIMITS.AI
  );
  if (!rateLimitResult.allowed) {
    return rateLimitResponse(rateLimitResult);
  }

  try {
    // Validate request body with Zod schema
    const validation = await validateRequest(req, schemas.voiceProcess);
    if (!validation.success) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const { transcript, userLocation, conversationHistory, previousIntent } = validation.data;

    // Build context string for follow-up queries
    let contextString = "";
    if (previousIntent && Object.keys(previousIntent).length > 0) {
      contextString = `\n\nPREVIOUS SEARCH CONTEXT (merge refinements with this):
${JSON.stringify(previousIntent, null, 2)}`;
    }

    // Build request to Gemini API
    const messages = [
      ...(conversationHistory || []),
      {
        role: "user",
        content: `${INTENT_PROMPT}${contextString}\n\nUser query: "${transcript}"\nUser location: ${
          userLocation ? JSON.stringify(userLocation) : "unknown"
        }`,
      },
    ];

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY || "",
        },
        body: JSON.stringify({
          contents: messages.map((msg) => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
          })),
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error("No response from Gemini");
    }

    // Parse JSON from response
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    const parsedIntent = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Could not parse intent" };

    return new Response(
      JSON.stringify({
        transcript,
        parsedIntent,
        rawResponse: generatedText,
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
