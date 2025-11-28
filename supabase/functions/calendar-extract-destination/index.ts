import { serve } from "https://deno.land/std@0.132.0/http/server.ts";
import { requireAuth } from "../_shared/auth.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

interface ExtractDestinationRequest {
  title: string;
  location?: string;
  description?: string;
  startDate: string;
  endDate: string;
}

const DESTINATION_PROMPT = `Extract travel destination from this calendar event.

If this appears to be travel, extract:
{
  "is_travel": true,
  "destination": {
    "city": string,
    "state": string,
    "country": string
  },
  "confidence": 0.0-1.0
}

If not travel:
{ "is_travel": false, "confidence": 0.0-1.0 }

Respond with valid JSON only.`;

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // Validate JWT authentication
  const authResult = await requireAuth(req);
  if (authResult instanceof Response) return authResult;

  try {
    const { title, location, description, startDate, endDate } = await req.json() as ExtractDestinationRequest;

    if (!title) {
      return new Response(
        JSON.stringify({ error: "title is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

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
                  text: `${DESTINATION_PROMPT}\n\nEvent title: "${title}"\nEvent location: "${
                    location || "N/A"
                  }"\nEvent description: "${description || "N/A"}"\nDates: ${startDate} to ${endDate}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 256,
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
    const extraction = jsonMatch ? JSON.parse(jsonMatch[0]) : { is_travel: false, confidence: 0 };

    return new Response(
      JSON.stringify(extraction),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
