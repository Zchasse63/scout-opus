import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { placeId } = await req.json();

    if (!placeId) {
      throw new Error('placeId is required');
    }

    // Get Google Places API key from environment
    const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
    if (!apiKey) {
      throw new Error('Google Places API key not configured');
    }

    // Call Google Places API (New) - Place Details
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask':
            'id,displayName,formattedAddress,location,rating,userRatingCount,' +
            'googleMapsUri,websiteUri,regularOpeningHours,phoneNumber,' +
            'currentOpeningHours,photos,reviews,types,priceLevel',
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Places API error: ${error}`);
    }

    const placeDetails = await response.json();

    // Transform to our format
    const transformedDetails = {
      id: placeDetails.id,
      name: placeDetails.displayName?.text || '',
      address: placeDetails.formattedAddress || '',
      latitude: placeDetails.location?.latitude || 0,
      longitude: placeDetails.location?.longitude || 0,
      rating: placeDetails.rating || 0,
      reviewCount: placeDetails.userRatingCount || 0,
      phoneNumber: placeDetails.phoneNumber || null,
      website: placeDetails.websiteUri || null,
      googleMapsUri: placeDetails.googleMapsUri || null,
      priceLevel: placeDetails.priceLevel || null,
      types: placeDetails.types || [],
      regularHours: placeDetails.regularOpeningHours?.weekdayDescriptions || [],
      currentOpeningHours: placeDetails.currentOpeningHours || null,
      photos: placeDetails.photos?.map((photo: any) => ({
        name: photo.name,
        widthPx: photo.widthPx,
        heightPx: photo.heightPx,
      })) || [],
      reviews: placeDetails.reviews?.map((review: any) => ({
        author: review.authorAttribution?.displayName || 'Anonymous',
        rating: review.rating || 0,
        text: review.text?.text || '',
        publishTime: review.publishTime || null,
      })) || [],
    };

    return new Response(
      JSON.stringify(transformedDetails),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error fetching place details:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to fetch place details',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
