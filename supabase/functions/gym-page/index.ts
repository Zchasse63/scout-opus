import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

/**
 * Public Gym Page Generator
 * Generates SEO-optimized HTML pages for gyms
 */

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Extract gym slug from URL
    const url = new URL(req.url);
    const gymSlug = url.searchParams.get('slug');

    if (!gymSlug) {
      throw new Error('Gym slug is required');
    }

    // Initialize Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch gym data
    const { data: gym, error } = await supabase
      .from('gyms')
      .select(`
        *,
        reviews(count),
        photos:gym_photos(*)
      `)
      .eq('slug', gymSlug)
      .single();

    if (error || !gym) {
      return new Response(generateErrorPage('Gym not found'), {
        headers: { ...corsHeaders, 'Content-Type': 'text/html' },
        status: 404,
      });
    }

    // Generate SEO-optimized HTML
    const html = generateGymPageHTML(gym);

    return new Response(html, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
      status: 200,
    });
  } catch (error) {
    console.error('Error generating gym page:', error);
    return new Response(generateErrorPage('Error loading gym page'), {
      headers: { ...corsHeaders, 'Content-Type': 'text/html' },
      status: 500,
    });
  }
});

function generateGymPageHTML(gym: any): string {
  const title = `${gym.name} - ${gym.city}, ${gym.state} | Scout Fitness`;
  const description = gym.description || `Find and book day passes at ${gym.name} in ${gym.city}. View amenities, pricing, and reviews on Scout Fitness.`;
  const url = `https://scoutfitness.app/gym/${gym.slug}`;
  const imageUrl = gym.primary_photo || 'https://scoutfitness.app/og-image.jpg';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Primary Meta Tags -->
  <title>${escapeHtml(title)}</title>
  <meta name="title" content="${escapeHtml(title)}">
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="keywords" content="${gym.name}, gym, fitness, day pass, ${gym.city}, ${gym.state}, workout">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${imageUrl}">

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="${url}">
  <meta property="twitter:title" content="${escapeHtml(title)}">
  <meta property="twitter:description" content="${escapeHtml(description)}">
  <meta property="twitter:image" content="${imageUrl}">

  <!-- Structured Data / JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "${escapeHtml(gym.name)}",
    "description": "${escapeHtml(description)}",
    "image": "${imageUrl}",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "${escapeHtml(gym.address)}",
      "addressLocality": "${escapeHtml(gym.city)}",
      "addressRegion": "${escapeHtml(gym.state)}",
      "postalCode": "${escapeHtml(gym.zip_code)}",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": ${gym.latitude},
      "longitude": ${gym.longitude}
    },
    "telephone": "${escapeHtml(gym.phone || '')}",
    "url": "${escapeHtml(gym.website || url)}",
    "priceRange": "$${gym.day_pass_price || '20'}",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "${gym.rating || '4.5'}",
      "reviewCount": "${gym.review_count || '0'}"
    }
  }
  </script>

  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; line-height: 1.6; }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    header { background: #6C5CE7; color: white; padding: 20px 0; margin-bottom: 40px; }
    .header-content { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    h1 { font-size: 2rem; margin-bottom: 10px; }
    .subtitle { font-size: 1rem; opacity: 0.9; }
    .hero-image { width: 100%; height: 400px; object-fit: cover; border-radius: 16px; margin-bottom: 30px; }
    .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 40px; }
    .info-card { background: #f5f5f5; padding: 20px; border-radius: 12px; }
    .info-label { font-size: 0.875rem; color: #666; margin-bottom: 5px; }
    .info-value { font-size: 1.125rem; font-weight: 600; }
    .amenities { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; }
    .amenity { background: #e0e0e0; padding: 8px 16px; border-radius: 20px; font-size: 0.875rem; }
    .cta { display: inline-block; background: #6C5CE7; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; margin-top: 20px; }
    .cta:hover { background: #5b4bc5; }
  </style>
</head>
<body>
  <header>
    <div class="header-content">
      <h1>${escapeHtml(gym.name)}</h1>
      <p class="subtitle">${escapeHtml(gym.address)}, ${escapeHtml(gym.city)}, ${escapeHtml(gym.state)}</p>
    </div>
  </header>

  <div class="container">
    ${gym.primary_photo ? `<img src="${imageUrl}" alt="${escapeHtml(gym.name)}" class="hero-image">` : ''}

    <div class="info-grid">
      <div class="info-card">
        <div class="info-label">Day Pass</div>
        <div class="info-value">$${gym.day_pass_price || '20'}</div>
      </div>
      <div class="info-card">
        <div class="info-label">Rating</div>
        <div class="info-value">⭐ ${gym.rating || '4.5'} (${gym.review_count || '0'} reviews)</div>
      </div>
      <div class="info-card">
        <div class="info-label">Phone</div>
        <div class="info-value">${escapeHtml(gym.phone || 'N/A')}</div>
      </div>
      ${gym.website ? `
      <div class="info-card">
        <div class="info-label">Website</div>
        <div class="info-value"><a href="${escapeHtml(gym.website)}" target="_blank" rel="noopener">Visit Website</a></div>
      </div>
      ` : ''}
    </div>

    ${gym.description ? `
    <section>
      <h2>About</h2>
      <p>${escapeHtml(gym.description)}</p>
    </section>
    ` : ''}

    ${gym.amenities && gym.amenities.length > 0 ? `
    <section>
      <h2>Amenities</h2>
      <div class="amenities">
        ${gym.amenities.map((a: string) => `<span class="amenity">${escapeHtml(a)}</span>`).join('')}
      </div>
    </section>
    ` : ''}

    <a href="scoutfitness://gym/${gym.id}" class="cta">Open in Scout App</a>
    <a href="https://apps.apple.com/app/scout-fitness" class="cta" style="margin-left: 10px;">Download Scout</a>
  </div>
</body>
</html>
  `.trim();
}

function generateErrorPage(message: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error | Scout Fitness</title>
</head>
<body>
  <h1>${message}</h1>
  <p><a href="https://scoutfitness.app">Return to Scout Fitness</a></p>
</body>
</html>
  `.trim();
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
