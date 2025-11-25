import { serve } from "https://deno.land/std@0.132.0/http/server.ts";

const GOOGLE_PLACES_API_KEY = Deno.env.get("GOOGLE_PLACES_API_KEY");

interface PlacesSearchRequest {
  textQuery: string;
  locationBias?: {
    circle: {
      center: { latitude: number; longitude: number };
      radius: number;
    };
  };
  includedType?: string;
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { textQuery, locationBias, includedType } = await req.json() as PlacesSearchRequest;

    if (!textQuery) {
      return new Response(
        JSON.stringify({ error: "textQuery is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Call Google Places API (New)
    const requestBody = {
      textQuery,
      locationBias,
      includedType: includedType || "gym",
      maxResultCount: 20,
      fields: [
        "places.id",
        "places.displayName",
        "places.formattedAddress",
        "places.location",
        "places.rating",
        "places.userRatingCount",
        "places.regularOpeningHours",
        "places.generativeSummary",
        "places.photos",
      ],
      languageCode: "en",
    };

    const response = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY || "",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status}`);
    }

    const data = await response.json();

    return new Response(
      JSON.stringify(data),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
