import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

interface FirecrawlResult {
  url: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  amenities?: string[];
  hours?: Record<string, string>;
  pricing?: {
    dayPass?: number;
    weekPass?: number;
    monthPass?: number;
  };
  photos?: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { url, gymId } = await req.json();

    if (!url) {
      throw new Error('URL is required');
    }

    // Get Firecrawl API key from environment
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlApiKey) {
      throw new Error('Firecrawl API key not configured');
    }

    // Call Firecrawl API to scrape the gym website
    const firecrawlResponse = await fetch('https://api.firecrawl.dev/v0/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${firecrawlApiKey}`,
      },
      body: JSON.stringify({
        url,
        pageOptions: {
          onlyMainContent: true,
          includeHtml: false,
        },
        extractorOptions: {
          mode: 'llm-extraction',
          extractionPrompt: `Extract the following information about this gym/fitness center:
            - Name
            - Address
            - Phone number
            - Email address
            - Website URL
            - Description/About
            - List of amenities (showers, lockers, parking, wifi, etc.)
            - Operating hours (if available)
            - Pricing information (day pass, week pass, month pass)
            - Any photo URLs

            Return as JSON.`,
        },
      }),
    });

    if (!firecrawlResponse.ok) {
      const error = await firecrawlResponse.text();
      throw new Error(`Firecrawl API error: ${error}`);
    }

    const firecrawlData = await firecrawlResponse.json();
    const extractedData = firecrawlData.data?.llm_extraction || {};

    // Transform to our format
    const gymData: FirecrawlResult = {
      url,
      name: extractedData.name || '',
      address: extractedData.address || '',
      phone: extractedData.phone,
      email: extractedData.email,
      website: extractedData.website,
      description: extractedData.description,
      amenities: extractedData.amenities || [],
      hours: extractedData.hours || {},
      pricing: extractedData.pricing || {},
      photos: extractedData.photos || [],
    };

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Update gym record if gymId provided
    if (gymId) {
      const { error: updateError } = await supabase
        .from('gyms')
        .update({
          scraped_data: gymData,
          scraped_at: new Date().toISOString(),
          data_source: 'firecrawl',
        })
        .eq('id', gymId);

      if (updateError) {
        console.error('Error updating gym:', updateError);
      }
    }

    // Store in scraping queue for review
    await supabase.from('scraping_queue').insert({
      url,
      gym_id: gymId,
      scraped_data: gymData,
      status: 'pending_review',
      created_at: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: gymData,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error scraping gym data:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to scrape gym data',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
