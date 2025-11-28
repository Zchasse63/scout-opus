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
  page?: number;
  pageSize?: number;
  pageToken?: string;
}

interface PlacesSearchResponse {
  places: unknown[];
  nextPageToken?: string;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { textQuery, locationBias, includedType, page = 1, pageSize = 20, pageToken } = await req.json() as PlacesSearchRequest;

    if (!textQuery) {
      return new Response(
        JSON.stringify({ error: "textQuery is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate pagination params
    const validPageSize = Math.min(Math.max(1, pageSize), 20); // Google Places max is 20

    // Call Google Places API (New)
    const requestBody: Record<string, unknown> = {
      textQuery,
      locationBias,
      includedType: includedType || "gym",
      maxResultCount: validPageSize,
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
        "places.accessibilityOptions",
        "places.parkingOptions",
        "places.paymentOptions",
        "places.reviewSummary",
        "places.addressDescriptor",
      ],
      languageCode: "en",
    };

    // Add page token for pagination if provided
    if (pageToken) {
      requestBody.pageToken = pageToken;
    }

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

    // Return paginated response
    const paginatedResponse: PlacesSearchResponse = {
      places: data.places || [],
      nextPageToken: data.nextPageToken,
      page,
      pageSize: validPageSize,
      hasMore: !!data.nextPageToken,
    };

    return new Response(
      JSON.stringify(paginatedResponse),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
