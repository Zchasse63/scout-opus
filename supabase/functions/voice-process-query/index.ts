import { serve } from "https://deno.land/std@0.132.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

interface VoiceProcessRequest {
  transcript: string;
  userLocation?: { latitude: number; longitude: number };
  conversationHistory?: Array<{ role: string; content: string }>;
}

const INTENT_PROMPT = `You are Scout's voice search assistant. Parse this fitness facility search query and extract structured parameters.

Extract as JSON:
{
  "intent": "search_gyms" | "get_details" | "book_pass" | "check_schedule",
  "location": { "query": string, "use_current": boolean },
  "facility_types": string[],
  "required_amenities": string[],
  "time_constraint": string | null,
  "price_constraint": { "max": number } | null,
  "confidence": 0.0-1.0
}

Respond with valid JSON only.`;

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { transcript, userLocation, conversationHistory } = await req.json() as VoiceProcessRequest;

    if (!transcript) {
      return new Response(
        JSON.stringify({ error: "transcript is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Build request to Gemini API
    const messages = [
      ...(conversationHistory || []),
      {
        role: "user",
        content: `${INTENT_PROMPT}\n\nUser query: "${transcript}"\nUser location: ${
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
