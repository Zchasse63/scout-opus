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
    const { photoName, maxWidth, maxHeight } = await req.json();

    if (!photoName) {
      throw new Error('photoName is required');
    }

    // Get Google Places API key from environment
    const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
    if (!apiKey) {
      throw new Error('Google Places API key not configured');
    }

    // Build photo URL
    // photoName format: places/{place_id}/photos/{photo_id}
    const width = maxWidth || 800;
    const height = maxHeight || 600;

    // Call Google Places API (New) - Get Photo
    const photoUrl = `https://places.googleapis.com/v1/${photoName}/media?key=${apiKey}&maxWidthPx=${width}&maxHeightPx=${height}`;

    // Fetch the photo
    const response = await fetch(photoUrl, {
      method: 'GET',
      headers: {
        'X-Goog-Api-Key': apiKey,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Places Photo API error: ${error}`);
    }

    // Get photo data
    const photoData = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Return photo with appropriate headers
    return new Response(photoData, {
      headers: {
        ...corsHeaders,
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching photo:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to fetch photo',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
