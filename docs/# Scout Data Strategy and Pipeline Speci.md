# Scout Data Strategy and Pipeline Specification
## Proprietary Fitness Facility Database Architecture

**Version:** 1.0  
**Date:** November 25, 2025  
**Status:** Draft for Review

---

## Table of Contents

1. [Data Strategy Overview](#1-data-strategy-overview)
2. [Data Sources & Hierarchy](#2-data-sources--hierarchy)
3. [Web Scraping Pipeline](#3-web-scraping-pipeline)
4. [Outreach & Form System](#4-outreach--form-system)
5. [User-Generated Content](#5-user-generated-content)
6. [Gamification System](#6-gamification-system)
7. [Data Model & Schema](#7-data-model--schema)
8. [Geographic Rollout Strategy](#8-geographic-rollout-strategy)
9. [Photo Management & Moderation](#9-photo-management--moderation)
10. [SEO & Public Pages](#10-seo--public-pages)
11. [Equipment Search Feature](#11-equipment-search-feature)
12. [Market Waitlist System](#12-market-waitlist-system)
13. [Implementation Timeline](#13-implementation-timeline)

---

## MVP vs Future Features

This document covers Scout's data strategy. Here's what's included in MVP vs planned for later:

### ✅ MVP (Launch)

| Feature | Description | Section |
|---------|-------------|---------|
| **Scraping Pipeline** | Firecrawl integration for Tampa/Miami gyms | Section 3 |
| **Verification Forms** | Outreach to gyms with Tally forms | Section 4 |
| **User Reviews** | Post-visit surveys with voice support | Section 5 |
| **User Photos** | Upload with AI moderation | Section 9 |
| **Badges & Streaks** | Core gamification system | Section 6 |
| **Public Gym Pages** | SEO-optimized web pages for each gym | Section 10 |
| **Equipment Search** | Filter gyms by equipment brand/type | Section 11 |
| **Market Waitlist** | Capture demand in unsupported areas | Section 12 |
| **Tampa/Miami Coverage** | Full data coverage in launch markets | Section 8 |

### ⏳ Post-MVP (See Future Plans Document)

| Feature | Description | Timeline |
|---------|-------------|----------|
| Gym Comparison | Side-by-side compare 2-3 gyms | Phase 2 |
| Referral Program | Invite friends, earn passes | Phase 2 |
| Class Schedules | Display class times from partners | Phase 2 |
| Gym Matching Quiz | Personalized recommendations | Phase 3 |
| Price Alerts | Notifications when prices drop | Phase 3 |
| Light Social | Activity counts, friend feeds | Phase 3 |
| Corporate Accounts | B2B for business travel | Phase 4 |
| Partner Referrals | Gyms refer other gyms | Phase 4 |
| Data Licensing | API access for third parties | Year 2+ |
| Real-Time Occupancy | How crowded is it now? | Year 2+ |

---

## 1. Data Strategy Overview

### The Vision

Scout's competitive moat is **data quality**, not just API access. While competitors rely on Google Places or gym self-reporting, Scout builds a comprehensive, verified database through multiple sources:

```
┌─────────────────────────────────────────────────────────────────┐
│                    SCOUT DATA ECOSYSTEM                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐          │
│   │  SCRAPED    │   │  VERIFIED   │   │    USER     │          │
│   │   DATA      │ + │   (Forms)   │ + │  GENERATED  │          │
│   │ (Firecrawl) │   │             │   │  (Reviews,  │          │
│   │             │   │             │   │   Photos)   │          │
│   └──────┬──────┘   └──────┬──────┘   └──────┬──────┘          │
│          │                 │                 │                  │
│          └────────────┬────┴────────────────┘                  │
│                       ▼                                         │
│          ┌─────────────────────────┐                           │
│          │   SCOUT PROPRIETARY     │                           │
│          │       DATABASE          │                           │
│          │                         │                           │
│          │  • 50+ amenity fields   │                           │
│          │  • Equipment brands     │                           │
│          │  • Verified badges      │                           │
│          │  • User reviews/photos  │                           │
│          └───────────┬─────────────┘                           │
│                      │                                          │
│                      │ Fallback/Supplement                      │
│                      ▼                                          │
│          ┌─────────────────────────┐                           │
│          │   GOOGLE PLACES API     │                           │
│          │                         │                           │
│          │  • Basic info           │                           │
│          │  • Hours, ratings       │                           │
│          │  • Google reviews       │                           │
│          │  • Photos               │                           │
│          └─────────────────────────┘                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Data Completeness Tiers

| Tier | Description | Data Sources | User Experience |
|------|-------------|--------------|-----------------|
| **Tier 1: Premium** | Partner gyms with full Scout integration | Verified form + Owner uploads + User content + API | Full filters, booking, verified badge |
| **Tier 2: Verified** | Non-partner gyms that completed verification form | Verified form + Scraped + User content + API | Full filters, no booking, verified badge |
| **Tier 3: Enriched** | Scraped gyms with user content | Scraped + User content + API | Partial filters, no booking |
| **Tier 4: Basic** | API-only data (outside launch markets) | Google Places API only | Basic filters, no booking |

### Key Differentiators (Data Points Competitors Don't Have)

| Category | Scout Exclusive Data |
|----------|---------------------|
| **Equipment** | Brand (Rogue, Hammer Strength, Life Fitness), specialized equipment (sleds, atlas stones, GHD) |
| **Women's Focus** | Women-only gym, women-only section, women-only classes, childcare |
| **Accessibility** | Wheelchair accessible equipment, visual/hearing accommodations, parking details |
| **Locker Rooms** | Private showers, day lockers, rental lockers, toiletries provided |
| **Recovery** | Sauna type (dry/infrared/steam), cold plunge temp, cryotherapy, compression boots |
| **Atmosphere** | Music volume/type, staff helpfulness, cleanliness ratings, crowd levels by time |
| **Policies** | Guest policy, day pass availability, contract requirements, cancellation terms |

---

## 2. Data Sources & Hierarchy

### Source Priority (When Data Conflicts)

```
1. Owner-Verified (highest trust)
   └── Data submitted via verification form or partner portal
   
2. Scout-Verified  
   └── Data verified by Scout team (staff visit, phone call)
   
3. User-Verified
   └── Multiple users confirmed same data point
   
4. User-Submitted
   └── Single user submitted (pending verification)
   
5. Scraped
   └── Extracted from gym website via Firecrawl
   
6. Google Places API (lowest trust for detailed data)
   └── Basic info only; known to have inaccuracies
```

### Confidence Scoring

Each data field has a confidence score:

```typescript
interface DataField {
  value: any;
  source: 'owner' | 'scout' | 'user_verified' | 'user' | 'scraped' | 'api';
  confidence: number;  // 0.0 - 1.0
  last_updated: Date;
  verified_count?: number;  // For user-verified data
}

// Example
{
  has_sauna: {
    value: true,
    source: 'owner',
    confidence: 1.0,
    last_updated: '2025-11-20'
  },
  has_towel_service: {
    value: true,
    source: 'scraped',
    confidence: 0.7,
    last_updated: '2025-11-15'
  }
}
```

### Data Refresh Strategy

| Source | Refresh Frequency | Trigger |
|--------|-------------------|---------|
| Owner-Verified | On-demand (owner updates) | Partner portal changes |
| Scraped | Monthly | Scheduled Firecrawl job |
| User-Submitted | Real-time | User submission |
| Google Places | Weekly | API poll for changes |

---

## 3. Web Scraping Pipeline

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     SCRAPING PIPELINE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  STEP 1: DISCOVERY                                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Google Places API Text Search                            │   │
│  │ Query: "gym" + "fitness" + "yoga" + "crossfit" etc.     │   │
│  │ Location: Tampa, FL (20 mile radius)                     │   │
│  │ Output: List of place_ids + websites                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          ↓                                      │
│  STEP 2: WEBSITE SCRAPING                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Firecrawl API                                            │   │
│  │ Input: Gym website URL                                   │   │
│  │ Mode: "scrape" with LLM extraction                       │   │
│  │ Output: Structured JSON (name, hours, amenities, etc.)   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          ↓                                      │
│  STEP 3: AI ENRICHMENT                                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Gemini 2.5 Flash                                         │   │
│  │ • Analyze scraped content for amenities                  │   │
│  │ • Extract contact email for outreach                     │   │
│  │ • Identify data gaps needing form verification           │   │
│  │ • Categorize gym type (CrossFit, yoga, traditional, etc) │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          ↓                                      │
│  STEP 4: DATABASE INSERT                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Supabase PostgreSQL                                      │   │
│  │ • Insert gym record with source='scraped'                │   │
│  │ • Set confidence scores per field                        │   │
│  │ • Flag for outreach if email found                       │   │
│  │ • Queue for form verification                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Firecrawl Integration

**Firecrawl** is an API that crawls websites and returns structured data. It handles JavaScript rendering, rate limiting, and can use LLMs to extract specific fields.

```typescript
// Example Firecrawl API call
import Firecrawl from '@mendable/firecrawl-js';

const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY });

const result = await firecrawl.scrapeUrl('https://example-gym.com', {
  formats: ['markdown', 'extract'],
  extract: {
    schema: {
      type: 'object',
      properties: {
        gym_name: { type: 'string' },
        address: { type: 'string' },
        phone: { type: 'string' },
        email: { type: 'string' },
        hours: { 
          type: 'object',
          properties: {
            monday: { type: 'string' },
            tuesday: { type: 'string' },
            // ... etc
          }
        },
        amenities: { 
          type: 'array',
          items: { type: 'string' }
        },
        day_pass_price: { type: 'number' },
        membership_price: { type: 'number' },
        class_types: {
          type: 'array',
          items: { type: 'string' }
        }
      }
    },
    prompt: `Extract gym information from this fitness facility website. 
             Look for amenities like sauna, pool, towel service, WiFi, 
             locker rooms, showers, parking. Extract any pricing information
             for day passes or memberships. Find contact email if available.`
  }
});
```

### Firecrawl Pricing & Volume

| Plan | Price | Credits/Month | Cost per Gym |
|------|-------|---------------|--------------|
| Free | $0 | 500 | N/A |
| Hobby | $19/mo | 3,000 | ~$0.006 |
| Standard | $99/mo | 100,000 | ~$0.001 |
| Growth | $399/mo | 500,000 | ~$0.0008 |

**For Tampa + Miami launch (~2,000 gyms):** Hobby plan is sufficient ($19/month)

**For Florida-wide (~10,000 gyms):** Standard plan ($99/month)

### Scraping Job Implementation

```typescript
// Supabase Edge Function: scrape-gyms
import { createClient } from '@supabase/supabase-js';
import Firecrawl from '@mendable/firecrawl-js';

export async function scrapeGymsInCity(city: string, state: string) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const firecrawl = new Firecrawl({ apiKey: FIRECRAWL_API_KEY });
  
  // Step 1: Get gym websites from Google Places
  const placesResponse = await fetch(
    `https://places.googleapis.com/v1/places:searchText`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.websiteUri,places.formattedAddress'
      },
      body: JSON.stringify({
        textQuery: `gyms and fitness centers in ${city}, ${state}`,
        maxResultCount: 60  // Max per request
      })
    }
  );
  
  const places = await placesResponse.json();
  
  // Step 2: Scrape each website
  for (const place of places.places) {
    if (!place.websiteUri) continue;
    
    try {
      const scraped = await firecrawl.scrapeUrl(place.websiteUri, {
        formats: ['extract'],
        extract: { schema: GYM_EXTRACTION_SCHEMA }
      });
      
      // Step 3: Insert into database
      await supabase.from('gyms').upsert({
        google_place_id: place.id,
        name: scraped.extract.gym_name || place.displayName.text,
        address: scraped.extract.address || place.formattedAddress,
        website: place.websiteUri,
        email: scraped.extract.email,
        phone: scraped.extract.phone,
        hours: scraped.extract.hours,
        amenities_scraped: scraped.extract.amenities,
        day_pass_price: scraped.extract.day_pass_price,
        data_source: 'scraped',
        scraped_at: new Date().toISOString(),
        needs_verification: true,
        outreach_status: scraped.extract.email ? 'pending' : 'no_email'
      });
      
    } catch (error) {
      console.error(`Failed to scrape ${place.websiteUri}:`, error);
    }
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}
```

### Handling Chain Gyms (Crunch, Planet Fitness, etc.)

Chain gyms often have template websites with inaccurate data. Special handling:

```typescript
// Known chains with template websites
const CHAIN_GYMS = {
  'crunch': { 
    requires_verification: true,
    default_amenities: ['locker_rooms', 'showers'],  // Always have these
    variable_amenities: ['pool', 'sauna', 'hydromassage']  // Location-specific
  },
  'planet_fitness': {
    requires_verification: true,
    default_amenities: ['locker_rooms', 'showers', 'wifi'],
    variable_amenities: ['hydromassage', 'tanning', 'total_body_enhancement']
  },
  'la_fitness': {
    requires_verification: true,
    default_amenities: ['locker_rooms', 'showers', 'pool'],  // Most have pool
    variable_amenities: ['basketball', 'racquetball', 'sauna']
  }
  // ... etc
};

function processChainGym(gym: ScrapedGym) {
  const chain = detectChain(gym.name);
  if (chain && CHAIN_GYMS[chain]) {
    // Apply known defaults
    gym.amenities = [
      ...CHAIN_GYMS[chain].default_amenities,
      // Keep scraped amenities that are in the "variable" list
      ...gym.amenities.filter(a => 
        CHAIN_GYMS[chain].variable_amenities.includes(a)
      )
    ];
    // Mark variable amenities as low confidence
    gym.confidence_notes = `Chain gym - ${chain}. Variable amenities need verification.`;
    gym.priority_verification = true;
  }
  return gym;
}
```

---

## 4. Outreach & Form System

### Outreach Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      OUTREACH PIPELINE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 1. EMAIL TEMPLATE                                        │   │
│  │                                                          │   │
│  │ Subject: Verify Your Gym's Info on Scout Fitness 🏋️      │   │
│  │                                                          │   │
│  │ Hi [Gym Name] Team,                                      │   │
│  │                                                          │   │
│  │ We're Scout, a new fitness discovery app helping         │   │
│  │ travelers find gyms like yours.                          │   │
│  │                                                          │   │
│  │ We've added [Gym Name] to our platform! To ensure        │   │
│  │ accuracy, we'd love for you to verify your info:         │   │
│  │                                                          │   │
│  │ 👉 [VERIFY YOUR GYM INFO] (2 minutes)                    │   │
│  │                                                          │   │
│  │ What you get:                                            │   │
│  │ ✓ "Verified" badge on your listing                       │   │
│  │ ✓ Accurate amenity information                           │   │
│  │ ✓ Priority in search results                             │   │
│  │                                                          │   │
│  │ Interested in selling day passes through Scout?          │   │
│  │ Reply to this email and we'll set up a quick call.       │   │
│  │                                                          │   │
│  │ Best,                                                    │   │
│  │ The Scout Team                                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          ↓                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 2. GYM CLICKS VERIFY LINK                                │   │
│  │    → Opens Tally form pre-filled with scraped data       │   │
│  │    → Gym confirms/corrects/adds information              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          ↓                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 3. FORM SUBMITTED                                        │   │
│  │    → Webhook fires to Supabase Edge Function             │   │
│  │    → Data imported with source='owner'                   │   │
│  │    → "Verified" badge applied                            │   │
│  │    → Confirmation email sent to gym                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          ↓                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 4. FOLLOW-UP SEQUENCE (if no response)                   │   │
│  │    Day 3: Reminder email                                 │   │
│  │    Day 7: Final reminder with different subject line     │   │
│  │    Day 14: Mark as "unresponsive" - rely on scraped data │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 5. PARTNERSHIP INTEREST (if gym replies)                 │   │
│  │    → Route to sales pipeline                             │   │
│  │    → Schedule call                                       │   │
│  │    → Convert to Partner tier                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Verification Form Design

**Tool:** Tally (free tier) or custom Scout form  
**Key principle:** Structured fields wherever possible for easy parsing

```
┌─────────────────────────────────────────────────────────────────┐
│                 VERIFY YOUR GYM ON SCOUT                        │
│                                                                 │
│  We found [GYM NAME] and want to make sure travelers           │
│  have accurate information about your facility.                 │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  BASIC INFO (Pre-filled from our records)                       │
│                                                                 │
│  Gym Name: [Iron Temple Fitness____________]                    │
│  Address:  [123 Main St, Tampa, FL 33601___]                    │
│  Phone:    [(813) 555-1234________________]                     │
│  Website:  [https://irontemple.com_________]                    │
│                                                                 │
│  Hours of Operation:                                            │
│  Monday:    [5:00 AM] to [11:00 PM]                            │
│  Tuesday:   [5:00 AM] to [11:00 PM]                            │
│  ...                                                            │
│  24/7 Access? ( ) Yes  (•) No                                  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  AMENITIES (Select all that apply)                              │
│                                                                 │
│  Basics:                                                        │
│  [✓] Locker Rooms    [✓] Showers    [✓] WiFi                   │
│  [✓] Towel Service   [ ] Parking    [ ] EV Charging            │
│                                                                 │
│  Recovery & Wellness:                                           │
│  [✓] Sauna           [ ] Steam Room  [ ] Cold Plunge           │
│  [ ] Cryotherapy     [ ] Massage     [ ] Stretching Area       │
│                                                                 │
│  Pool & Aquatics:                                               │
│  [ ] Lap Pool        [ ] Hot Tub     [ ] Aqua Classes          │
│                                                                 │
│  Additional:                                                    │
│  [ ] Childcare       [ ] Cafe/Juice Bar  [ ] Pro Shop          │
│  [ ] Tanning         [ ] Co-working Space                       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  EQUIPMENT (Select all that apply)                              │
│                                                                 │
│  Cardio:                                                        │
│  [✓] Treadmills      [✓] Ellipticals  [✓] Bikes                │
│  [✓] Rowing Machines [ ] Stair Climbers                        │
│                                                                 │
│  Strength:                                                      │
│  [✓] Free Weights (Dumbbells)    [✓] Barbells & Plates         │
│  [✓] Cable Machines              [✓] Smith Machine             │
│  [✓] Squat Racks                 [ ] Power Racks               │
│  [ ] Leg Press                   [ ] Hack Squat                │
│                                                                 │
│  Equipment Brand (if known):                                    │
│  [▼ Select brand ]                                              │
│    - Rogue Fitness                                              │
│    - Hammer Strength                                            │
│    - Life Fitness                                               │
│    - Precor                                                     │
│    - Cybex                                                      │
│    - Technogym                                                  │
│    - Other: [____________]                                      │
│                                                                 │
│  Specialized Equipment:                                         │
│  [ ] Sleds/Prowlers  [ ] Atlas Stones  [ ] Tire Flip           │
│  [ ] Battle Ropes    [ ] Plyo Boxes    [ ] Kettlebells         │
│  [ ] TRX/Suspension  [ ] GHD Machine   [ ] Reverse Hyper       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  WOMEN'S FACILITIES                                             │
│                                                                 │
│  Is this gym women-only?  ( ) Yes  (•) No                      │
│                                                                 │
│  Do you have a women-only section?  ( ) Yes  (•) No            │
│                                                                 │
│  Do you offer women-only classes?  (•) Yes  ( ) No             │
│  If yes, which? [Yoga, Pilates, Self-defense______________]    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ACCESSIBILITY                                                  │
│                                                                 │
│  [✓] Wheelchair accessible entrance                             │
│  [✓] Wheelchair accessible equipment                            │
│  [ ] Accessible locker rooms/showers                            │
│  [ ] Visual/hearing accommodations                              │
│  [ ] Handicap parking available                                 │
│                                                                 │
│  Parking Details:                                               │
│  [▼ Select parking type ]                                       │
│    - Free lot                                                   │
│    - Paid lot                                                   │
│    - Street parking                                             │
│    - Garage (validated)                                         │
│    - No dedicated parking                                       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PRICING                                                        │
│                                                                 │
│  Do you offer day passes? (•) Yes  ( ) No                      │
│  Day pass price: [$_25__]                                       │
│                                                                 │
│  Do you offer week passes? (•) Yes  ( ) No                     │
│  Week pass price: [$_75__]                                      │
│                                                                 │
│  Monthly membership starting at: [$_50__]                       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CLASSES OFFERED (Select all that apply)                        │
│                                                                 │
│  [✓] Yoga            [✓] Pilates      [ ] Barre                │
│  [✓] Cycling/Spin    [ ] HIIT         [✓] Strength Training    │
│  [ ] Boxing          [ ] Kickboxing   [ ] MMA                  │
│  [ ] Dance           [ ] Zumba        [ ] CrossFit             │
│  [ ] Swimming        [ ] Aqua Aerobics                         │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ANYTHING ELSE?                                                 │
│                                                                 │
│  Is there anything unique about your gym that travelers         │
│  should know?                                                   │
│                                                                 │
│  [We have the largest free weight section in Tampa with       ] │
│  [over 150 dumbbells up to 200lbs. We also host powerlifting ] │
│  [competitions and have competition-grade equipment.          ] │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  INTERESTED IN PARTNERING?                                      │
│                                                                 │
│  Would you like to sell day passes directly through Scout?      │
│  (•) Yes, I'd like to learn more                               │
│  ( ) Maybe later                                                │
│  ( ) No thanks                                                  │
│                                                                 │
│  If yes, best email for partnership discussion:                 │
│  [owner@irontemple.com__________________________]               │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                    [SUBMIT VERIFICATION]                        │
│                                                                 │
│  By submitting, you confirm this information is accurate.       │
│  Your listing will receive a "Verified by Owner" badge.         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Form Webhook → Database

```typescript
// Supabase Edge Function: handle-verification-form
export async function handleVerificationWebhook(request: Request) {
  const formData = await request.json();
  
  // Map Tally fields to database schema
  const gymUpdate = {
    name: formData.gym_name,
    address: formData.address,
    phone: formData.phone,
    website: formData.website,
    
    // Hours
    hours: {
      monday: { open: formData.monday_open, close: formData.monday_close },
      tuesday: { open: formData.tuesday_open, close: formData.tuesday_close },
      // ... etc
    },
    is_24_hours: formData.is_24_hours === 'Yes',
    
    // Amenities (structured)
    amenities: {
      locker_rooms: formData.amenities.includes('locker_rooms'),
      showers: formData.amenities.includes('showers'),
      wifi: formData.amenities.includes('wifi'),
      towel_service: formData.amenities.includes('towel_service'),
      sauna: formData.amenities.includes('sauna'),
      steam_room: formData.amenities.includes('steam_room'),
      cold_plunge: formData.amenities.includes('cold_plunge'),
      pool: formData.amenities.includes('pool'),
      // ... etc
    },
    
    // Equipment
    equipment: {
      cardio: formData.cardio_equipment,
      strength: formData.strength_equipment,
      brand: formData.equipment_brand,
      specialized: formData.specialized_equipment
    },
    
    // Women's facilities
    is_womens_only: formData.womens_only === 'Yes',
    has_womens_section: formData.womens_section === 'Yes',
    has_womens_classes: formData.womens_classes === 'Yes',
    womens_class_types: formData.womens_class_details,
    
    // Accessibility
    accessibility: {
      wheelchair_entrance: formData.accessibility.includes('wheelchair_entrance'),
      wheelchair_equipment: formData.accessibility.includes('wheelchair_equipment'),
      accessible_locker: formData.accessibility.includes('accessible_locker'),
      visual_hearing: formData.accessibility.includes('visual_hearing'),
      handicap_parking: formData.accessibility.includes('handicap_parking')
    },
    parking_type: formData.parking_type,
    
    // Pricing
    has_day_pass: formData.day_pass === 'Yes',
    day_pass_price: parseFloat(formData.day_pass_price),
    has_week_pass: formData.week_pass === 'Yes',
    week_pass_price: parseFloat(formData.week_pass_price),
    monthly_price: parseFloat(formData.monthly_price),
    
    // Classes
    class_types: formData.classes,
    
    // Unique description
    unique_features: formData.anything_else,
    
    // Metadata
    data_source: 'owner',
    verified_at: new Date().toISOString(),
    verified_by: 'owner_form',
    partnership_interest: formData.partnership_interest
  };
  
  // Update database
  const { error } = await supabase
    .from('gyms')
    .update(gymUpdate)
    .eq('id', formData.gym_id);
  
  if (!error) {
    // Send confirmation email
    await sendConfirmationEmail(formData.email, formData.gym_name);
    
    // If partnership interest, create sales lead
    if (formData.partnership_interest === 'Yes') {
      await supabase.from('partnership_leads').insert({
        gym_id: formData.gym_id,
        contact_email: formData.partnership_email,
        source: 'verification_form',
        status: 'new'
      });
    }
  }
  
  return new Response(JSON.stringify({ success: true }));
}
```

### Email Automation

**Tool:** SendGrid (already in stack for partner marketing)

```typescript
// Scheduled job: send-verification-emails
export async function sendVerificationEmails() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  
  // Get gyms that need outreach
  const { data: gyms } = await supabase
    .from('gyms')
    .select('*')
    .eq('outreach_status', 'pending')
    .not('email', 'is', null)
    .limit(50);  // Batch size
  
  for (const gym of gyms) {
    // Generate pre-filled form URL
    const formUrl = generatePrefilledFormUrl(gym);
    
    // Send email via SendGrid
    await sendgrid.send({
      to: gym.email,
      from: 'hello@scoutfitness.com',
      templateId: 'd-verification-request-template',
      dynamicTemplateData: {
        gym_name: gym.name,
        verify_url: formUrl
      }
    });
    
    // Update outreach status
    await supabase
      .from('gyms')
      .update({ 
        outreach_status: 'sent',
        outreach_sent_at: new Date().toISOString()
      })
      .eq('id', gym.id);
    
    // Rate limit
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}
```

---

## 5. User-Generated Content

### Post-Visit Survey (Voice + Text)

When a user completes a visit (checked in via QR code), they receive a survey prompt 24 hours later.

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   How was your workout at Iron Temple? 🏋️                       │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │                                                         │  │
│   │   ⭐⭐⭐⭐⭐                                              │  │
│   │   Tap to rate                                           │  │
│   │                                                         │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   Quick Questions (optional):                                   │
│                                                                 │
│   Was the gym clean?                                            │
│   [😊 Yes]  [😐 Okay]  [😞 No]                                  │
│                                                                 │
│   Was equipment available?                                      │
│   [😊 Yes]  [😐 Mostly]  [😞 Crowded]                           │
│                                                                 │
│   Was staff helpful?                                            │
│   [😊 Yes]  [😐 N/A]  [😞 No]                                   │
│                                                                 │
│   ─────────────────────────────────────────────────────────    │
│                                                                 │
│   Tell us more (voice or text):                                 │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │                                                         │  │
│   │  "The free weight section was amazing. Way more         │  │
│   │   dumbbells than I expected. The sauna was closed       │  │
│   │   for maintenance though, which was disappointing."     │  │
│   │                                                         │  │
│   │   🎤 [Tap to record]    ⌨️ [Type instead]               │  │
│   │                                                         │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│   Did you notice these amenities? (Help verify our data)        │
│   [✓] Sauna     [✓] Towels    [ ] Pool                         │
│   [ ] WiFi      [✓] Showers   [ ] Cafe                         │
│                                                                 │
│   ─────────────────────────────────────────────────────────    │
│                                                                 │
│   📸 Add photos to earn a FREE day pass!                        │
│                                                                 │
│   [+ Add Photos]                                                │
│                                                                 │
│   ─────────────────────────────────────────────────────────    │
│                                                                 │
│                     [Submit Review]                             │
│                                                                 │
│   🎁 Thanks! Your feedback helps other travelers.               │
│      Complete with photos = FREE day pass at any partner gym!   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Voice Review Processing

```typescript
// Process voice review
async function processVoiceReview(audioBlob: Blob, gymId: string, userId: string) {
  // 1. Transcribe with Whisper (or Apple SpeechAnalyzer on iOS)
  const transcript = await transcribeAudio(audioBlob);
  
  // 2. Extract structured data with Gemini
  const extraction = await extractReviewData(transcript);
  
  // Example extraction prompt
  const prompt = `
    Analyze this gym review and extract:
    1. Overall sentiment (positive/neutral/negative)
    2. Specific amenities mentioned (positive or negative)
    3. Equipment mentioned
    4. Staff experience
    5. Cleanliness impression
    6. Any issues or problems mentioned
    
    Review: "${transcript}"
    
    Return JSON:
    {
      "sentiment": "positive",
      "amenities_mentioned": {
        "sauna": { "mentioned": true, "sentiment": "negative", "detail": "closed for maintenance" },
        "free_weights": { "mentioned": true, "sentiment": "positive", "detail": "more than expected" }
      },
      "equipment_quality": "positive",
      "staff_rating": null,
      "cleanliness": null,
      "issues": ["sauna closed for maintenance"]
    }
  `;
  
  // 3. Store review with extracted data
  await supabase.from('reviews').insert({
    gym_id: gymId,
    user_id: userId,
    rating: userProvidedRating,
    text: transcript,
    is_voice_review: true,
    extracted_data: extraction,
    verified_visit: true
  });
  
  // 4. Update gym data confidence based on user verification
  await updateAmenityConfidence(gymId, extraction.amenities_mentioned);
}
```

### Photo Upload & Categorization

```typescript
interface UserPhoto {
  id: string;
  gym_id: string;
  user_id: string;
  url: string;
  thumbnail_url: string;
  
  // User-provided tags
  category: 'exterior' | 'equipment' | 'locker_room' | 'pool' | 
            'class' | 'amenity' | 'other';
  tags: string[];  // ['free weights', 'dumbbells', 'squat rack']
  
  // AI-detected tags (for verification)
  ai_tags: string[];
  ai_confidence: number;
  
  // Moderation
  moderation_status: 'pending' | 'approved' | 'rejected';
  moderation_flags: string[];  // ['blur', 'face_detected', 'nsfw']
  
  // Metadata
  uploaded_at: Date;
  approved_at?: Date;
}
```

### Incentive System for User Content

| Action | Reward | Limit |
|--------|--------|-------|
| Complete post-visit survey | 50 Scout Points | Once per visit |
| Upload 3+ photos with tags | 100 Scout Points + FREE day pass | Once per gym |
| First review at a gym | "Pioneer" badge + 75 Scout Points | Once per gym |
| Review verified as helpful (10+ upvotes) | 50 Scout Points | Unlimited |
| Photo used as gym's featured image | 200 Scout Points | Unlimited |

**Scout Points Redemption:**
- 500 points = $5 off any booking
- 1000 points = Free day pass at partner gym
- 2500 points = Free week pass at partner gym

---

## 6. Gamification System

### Badges

```typescript
interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'achievement' | 'streak' | 'explorer' | 'contributor' | 'loyalty';
  criteria: BadgeCriteria;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  points_value: number;
}

const BADGES: Badge[] = [
  // Achievement Badges
  {
    id: 'first_workout',
    name: 'First Rep',
    description: 'Completed your first Scout workout',
    icon: '🎯',
    category: 'achievement',
    criteria: { bookings_completed: 1 },
    rarity: 'common',
    points_value: 50
  },
  {
    id: 'ten_workouts',
    name: 'Getting Serious',
    description: 'Completed 10 workouts through Scout',
    icon: '💪',
    category: 'achievement',
    criteria: { bookings_completed: 10 },
    rarity: 'uncommon',
    points_value: 100
  },
  {
    id: 'fifty_workouts',
    name: 'Fitness Fanatic',
    description: 'Completed 50 workouts through Scout',
    icon: '🏆',
    category: 'achievement',
    criteria: { bookings_completed: 50 },
    rarity: 'rare',
    points_value: 500
  },
  {
    id: 'hundred_workouts',
    name: 'Scout Legend',
    description: 'Completed 100 workouts through Scout',
    icon: '👑',
    category: 'achievement',
    criteria: { bookings_completed: 100 },
    rarity: 'legendary',
    points_value: 1000
  },
  
  // Streak Badges
  {
    id: 'streak_7',
    name: '7-Day Warrior',
    description: 'Worked out 7 days in a row',
    icon: '🔥',
    category: 'streak',
    criteria: { consecutive_days: 7 },
    rarity: 'uncommon',
    points_value: 150
  },
  {
    id: 'streak_30',
    name: 'Month of Iron',
    description: 'Worked out 30 days in a row',
    icon: '⚡',
    category: 'streak',
    criteria: { consecutive_days: 30 },
    rarity: 'rare',
    points_value: 500
  },
  
  // Explorer Badges
  {
    id: 'explorer_5',
    name: 'Gym Hopper',
    description: 'Visited 5 different gyms',
    icon: '🗺️',
    category: 'explorer',
    criteria: { unique_gyms: 5 },
    rarity: 'common',
    points_value: 100
  },
  {
    id: 'explorer_25',
    name: 'Fitness Nomad',
    description: 'Visited 25 different gyms',
    icon: '🌎',
    category: 'explorer',
    criteria: { unique_gyms: 25 },
    rarity: 'rare',
    points_value: 500
  },
  {
    id: 'city_explorer',
    name: 'City Sweat',
    description: 'Worked out in 5 different cities',
    icon: '✈️',
    category: 'explorer',
    criteria: { unique_cities: 5 },
    rarity: 'uncommon',
    points_value: 200
  },
  
  // Category Badges
  {
    id: 'yoga_devotee',
    name: 'Yoga Devotee',
    description: 'Completed 10 yoga sessions',
    icon: '🧘',
    category: 'achievement',
    criteria: { category_visits: { yoga: 10 } },
    rarity: 'uncommon',
    points_value: 150
  },
  {
    id: 'iron_addict',
    name: 'Iron Addict',
    description: 'Completed 10 traditional gym sessions',
    icon: '🏋️',
    category: 'achievement',
    criteria: { category_visits: { gym: 10 } },
    rarity: 'uncommon',
    points_value: 150
  },
  {
    id: 'variety_seeker',
    name: 'Variety Seeker',
    description: 'Tried 5 different workout types',
    icon: '🎨',
    category: 'explorer',
    criteria: { unique_categories: 5 },
    rarity: 'uncommon',
    points_value: 200
  },
  
  // Contributor Badges
  {
    id: 'pioneer',
    name: 'Pioneer',
    description: 'First Scout user to review this gym',
    icon: '🚀',
    category: 'contributor',
    criteria: { first_review_at_gym: true },
    rarity: 'rare',
    points_value: 200
  },
  {
    id: 'photographer',
    name: 'Gym Photographer',
    description: 'Uploaded 10 approved photos',
    icon: '📸',
    category: 'contributor',
    criteria: { approved_photos: 10 },
    rarity: 'uncommon',
    points_value: 150
  },
  {
    id: 'reviewer',
    name: 'Trusted Reviewer',
    description: '10 of your reviews marked helpful',
    icon: '✍️',
    category: 'contributor',
    criteria: { helpful_reviews: 10 },
    rarity: 'rare',
    points_value: 300
  },
  
  // Loyalty Badges
  {
    id: 'regular',
    name: 'Regular',
    description: 'Visited the same gym 5 times',
    icon: '🏠',
    category: 'loyalty',
    criteria: { same_gym_visits: 5 },
    rarity: 'common',
    points_value: 100
  },
  {
    id: 'vip',
    name: 'VIP Member',
    description: 'Visited the same gym 20 times',
    icon: '⭐',
    category: 'loyalty',
    criteria: { same_gym_visits: 20 },
    rarity: 'rare',
    points_value: 400
  }
];
```

### Streaks

```typescript
interface UserStreak {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_workout_date: Date;
  streak_freeze_available: boolean;  // Can skip one day
}

// Check and update streak after workout
async function updateStreak(userId: string) {
  const streak = await getStreak(userId);
  const today = new Date();
  const lastWorkout = new Date(streak.last_workout_date);
  const daysSinceLastWorkout = differenceInDays(today, lastWorkout);
  
  if (daysSinceLastWorkout === 1) {
    // Continued streak
    streak.current_streak += 1;
    streak.longest_streak = Math.max(streak.longest_streak, streak.current_streak);
    
    // Check for streak badges
    if (streak.current_streak === 7) {
      await awardBadge(userId, 'streak_7');
    } else if (streak.current_streak === 30) {
      await awardBadge(userId, 'streak_30');
    }
    
  } else if (daysSinceLastWorkout === 2 && streak.streak_freeze_available) {
    // Used streak freeze
    streak.current_streak += 1;  // Still count today
    streak.streak_freeze_available = false;
    
  } else if (daysSinceLastWorkout > 1) {
    // Streak broken
    streak.current_streak = 1;  // Start new streak
  }
  
  streak.last_workout_date = today;
  await saveStreak(streak);
}
```

### Membership Savings Notification

```typescript
// Check after each booking if user should consider membership
async function checkMembershipSuggestion(userId: string, gymId: string) {
  // Get user's booking history at this gym
  const { data: bookings } = await supabase
    .from('bookings')
    .select('amount, created_at')
    .eq('user_id', userId)
    .eq('gym_id', gymId)
    .eq('status', 'completed');
  
  if (bookings.length < 3) return;  // Wait until they've visited 3+ times
  
  const totalSpent = bookings.reduce((sum, b) => sum + b.amount, 0);
  const daysSinceFirst = differenceInDays(new Date(), new Date(bookings[0].created_at));
  
  // Get gym's membership price
  const gym = await getGym(gymId);
  if (!gym.monthly_price) return;
  
  // Calculate savings
  const monthsSpan = Math.ceil(daysSinceFirst / 30);
  const membershipCost = gym.monthly_price * monthsSpan;
  const savings = totalSpent - membershipCost;
  
  if (savings > 0) {
    // User would have saved money with membership
    await sendNotification(userId, {
      type: 'membership_suggestion',
      title: `Save money at ${gym.name}!`,
      body: `You've spent $${totalSpent} on ${bookings.length} visits. A membership would have cost $${membershipCost}. That's $${savings} in savings!`,
      data: {
        gym_id: gymId,
        offer: {
          type: 'membership_discount',
          discount_percent: 10,
          message: 'Get 10% off your first month when you sign up through Scout!'
        }
      }
    });
  }
}
```

### Social Sharing

```typescript
// Generate shareable card for badge
function generateBadgeShareCard(badge: Badge, user: User): ShareableContent {
  return {
    title: `I earned the "${badge.name}" badge on Scout! ${badge.icon}`,
    description: badge.description,
    image: generateBadgeImage(badge, user),  // Dynamic OG image
    url: `https://scoutfitness.com/badges/${badge.id}?ref=${user.id}`,
    platforms: ['instagram_story', 'twitter', 'facebook', 'linkedin']
  };
}

// Generate shareable card for streak
function generateStreakShareCard(streak: number, user: User): ShareableContent {
  return {
    title: `${streak} days strong! 🔥`,
    description: `I'm on a ${streak}-day workout streak with Scout Fitness`,
    image: generateStreakImage(streak, user),
    url: `https://scoutfitness.com/streaks?ref=${user.id}`,
    platforms: ['instagram_story', 'twitter', 'facebook']
  };
}
```

---

## 7. Data Model & Schema

### Core Tables

```sql
-- Gyms table with comprehensive data
CREATE TABLE gyms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic info
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  
  -- Location
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  country TEXT DEFAULT 'US',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Contact
  phone TEXT,
  email TEXT,
  website TEXT,
  
  -- Hours
  hours JSONB,  -- { monday: { open: "05:00", close: "23:00" }, ... }
  is_24_hours BOOLEAN DEFAULT FALSE,
  
  -- Type & Category
  gym_type TEXT,  -- 'traditional_gym', 'crossfit', 'yoga_studio', etc.
  categories TEXT[],  -- ['gym', 'yoga', 'pilates']
  
  -- Pricing
  has_day_pass BOOLEAN DEFAULT FALSE,
  day_pass_price DECIMAL(10, 2),
  has_week_pass BOOLEAN DEFAULT FALSE,
  week_pass_price DECIMAL(10, 2),
  monthly_price DECIMAL(10, 2),
  
  -- Amenities (structured)
  amenities JSONB,  -- See amenities schema below
  
  -- Equipment
  equipment JSONB,  -- See equipment schema below
  
  -- Women's facilities
  is_womens_only BOOLEAN DEFAULT FALSE,
  has_womens_section BOOLEAN DEFAULT FALSE,
  has_womens_classes BOOLEAN DEFAULT FALSE,
  womens_class_types TEXT[],
  
  -- Accessibility
  accessibility JSONB,  -- See accessibility schema below
  parking_type TEXT,
  
  -- Unique features
  unique_features TEXT,
  
  -- Data source & verification
  data_source TEXT,  -- 'owner', 'scout', 'user_verified', 'scraped', 'api'
  google_place_id TEXT,
  verification_status TEXT DEFAULT 'unverified',  -- 'verified', 'unverified', 'pending'
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by TEXT,
  
  -- Ratings
  scout_rating DECIMAL(2, 1),
  scout_review_count INTEGER DEFAULT 0,
  google_rating DECIMAL(2, 1),
  google_review_count INTEGER,
  
  -- Partner status
  tier TEXT DEFAULT 'basic',  -- 'basic', 'claimed', 'partner', 'premium'
  partner_since TIMESTAMP WITH TIME ZONE,
  stripe_account_id TEXT,
  
  -- Scraping metadata
  scraped_at TIMESTAMP WITH TIME ZONE,
  outreach_status TEXT,  -- 'pending', 'sent', 'responded', 'unresponsive'
  outreach_sent_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_gyms_location ON gyms USING GIST (
  ll_to_earth(latitude, longitude)
);
CREATE INDEX idx_gyms_city_state ON gyms (city, state);
CREATE INDEX idx_gyms_type ON gyms (gym_type);
CREATE INDEX idx_gyms_tier ON gyms (tier);
CREATE INDEX idx_gyms_verification ON gyms (verification_status);
```

### Amenities Schema

```typescript
// JSONB structure for amenities field
interface GymAmenities {
  // Basics
  locker_rooms: boolean;
  showers: boolean;
  private_showers: boolean;
  toiletries_provided: boolean;
  day_lockers: boolean;
  rental_lockers: boolean;
  towel_service: boolean;
  wifi: boolean;
  
  // Recovery & Wellness
  sauna: boolean;
  sauna_type?: 'dry' | 'infrared' | 'steam';
  steam_room: boolean;
  cold_plunge: boolean;
  cold_plunge_temp?: number;  // Fahrenheit
  hot_tub: boolean;
  massage_chairs: boolean;
  massage_service: boolean;
  cryotherapy: boolean;
  compression_boots: boolean;
  stretching_area: boolean;
  foam_rollers: boolean;
  
  // Pool & Aquatics
  pool: boolean;
  pool_type?: 'lap' | 'recreational' | 'outdoor';
  pool_length?: number;  // meters
  aqua_classes: boolean;
  
  // Additional
  childcare: boolean;
  cafe: boolean;
  juice_bar: boolean;
  pro_shop: boolean;
  tanning: boolean;
  hydromassage: boolean;
  coworking_space: boolean;
  
  // Classes included
  group_classes_included: boolean;
  personal_training_available: boolean;
}
```

### Equipment Schema

```typescript
interface GymEquipment {
  // Cardio
  treadmills: boolean;
  treadmill_count?: number;
  ellipticals: boolean;
  stationary_bikes: boolean;
  spin_bikes: boolean;
  rowing_machines: boolean;
  stair_climbers: boolean;
  assault_bikes: boolean;
  ski_ergs: boolean;
  
  // Strength - Machines
  cable_machines: boolean;
  smith_machine: boolean;
  leg_press: boolean;
  hack_squat: boolean;
  leg_curl: boolean;
  leg_extension: boolean;
  lat_pulldown: boolean;
  chest_press: boolean;
  shoulder_press: boolean;
  
  // Strength - Free Weights
  dumbbells: boolean;
  dumbbell_max_weight?: number;  // lbs
  barbells: boolean;
  olympic_barbells: boolean;
  weight_plates: boolean;
  bumper_plates: boolean;
  squat_racks: boolean;
  squat_rack_count?: number;
  power_racks: boolean;
  power_rack_count?: number;
  bench_press: boolean;
  adjustable_benches: boolean;
  
  // Specialized
  kettlebells: boolean;
  kettlebell_max_weight?: number;
  battle_ropes: boolean;
  plyo_boxes: boolean;
  medicine_balls: boolean;
  trx_suspension: boolean;
  resistance_bands: boolean;
  
  // CrossFit / Functional
  pull_up_bars: boolean;
  rings: boolean;
  climbing_rope: boolean;
  sleds: boolean;
  prowler: boolean;
  atlas_stones: boolean;
  tire_flip: boolean;
  farmers_carry: boolean;
  yoke: boolean;
  ghd_machine: boolean;
  reverse_hyper: boolean;
  
  // Brand
  primary_brand?: string;  // 'rogue', 'hammer_strength', 'life_fitness', etc.
  
  // Quality rating (user-reported average)
  equipment_quality?: number;  // 1-5
  equipment_modernity?: number;  // 1-5, how new/updated
}
```

### User Content Tables

```sql
-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID REFERENCES gyms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id),  -- Link to verified visit
  
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  text TEXT,
  is_voice_review BOOLEAN DEFAULT FALSE,
  
  -- Quick ratings
  cleanliness_rating INTEGER CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
  equipment_rating INTEGER CHECK (equipment_rating >= 1 AND equipment_rating <= 5),
  staff_rating INTEGER CHECK (staff_rating >= 1 AND staff_rating <= 5),
  value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
  
  -- AI-extracted data from voice/text
  extracted_data JSONB,
  
  -- Verification
  verified_visit BOOLEAN DEFAULT FALSE,
  
  -- Engagement
  helpful_count INTEGER DEFAULT 0,
  
  -- Owner response
  owner_response TEXT,
  owner_response_at TIMESTAMP WITH TIME ZONE,
  
  -- Moderation
  status TEXT DEFAULT 'published',  -- 'pending', 'published', 'hidden', 'removed'
  flagged_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, gym_id, booking_id)  -- One review per visit
);

-- Photos
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id UUID REFERENCES gyms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),  -- NULL if owner-uploaded
  
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  
  -- Source
  source TEXT NOT NULL,  -- 'owner', 'user', 'scraped', 'google'
  
  -- Categorization
  category TEXT,  -- 'exterior', 'equipment', 'locker_room', 'pool', 'class', 'amenity'
  tags TEXT[],
  ai_tags TEXT[],
  ai_confidence DECIMAL(3, 2),
  
  -- Display
  is_primary BOOLEAN DEFAULT FALSE,
  display_order INTEGER,
  
  -- Moderation
  moderation_status TEXT DEFAULT 'pending',  -- 'pending', 'approved', 'rejected'
  moderation_flags TEXT[],
  moderated_at TIMESTAMP WITH TIME ZONE,
  moderated_by TEXT,
  
  -- Metadata
  width INTEGER,
  height INTEGER,
  file_size INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Badges
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,  -- References badge definition
  
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Context (e.g., which gym for 'pioneer' badge)
  context JSONB,
  
  -- Sharing
  shared_to TEXT[],  -- ['instagram', 'twitter']
  
  UNIQUE(user_id, badge_id)
);

-- Streaks
CREATE TABLE user_streaks (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_workout_date DATE,
  streak_freeze_available BOOLEAN DEFAULT TRUE,
  streak_freeze_used_at DATE,
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Points
CREATE TABLE user_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  amount INTEGER NOT NULL,
  type TEXT NOT NULL,  -- 'earned', 'redeemed', 'expired', 'bonus'
  source TEXT NOT NULL,  -- 'review', 'photo', 'badge', 'referral', 'booking'
  source_id UUID,  -- ID of the review, photo, badge, etc.
  
  description TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User points balance view
CREATE VIEW user_points_balance AS
SELECT 
  user_id,
  SUM(CASE WHEN type IN ('earned', 'bonus') THEN amount ELSE 0 END) as total_earned,
  SUM(CASE WHEN type = 'redeemed' THEN amount ELSE 0 END) as total_redeemed,
  SUM(CASE WHEN type = 'expired' THEN amount ELSE 0 END) as total_expired,
  SUM(CASE 
    WHEN type IN ('earned', 'bonus') THEN amount 
    WHEN type IN ('redeemed', 'expired') THEN -amount 
    ELSE 0 
  END) as current_balance
FROM user_points
GROUP BY user_id;
```

---

## 8. Geographic Rollout Strategy

### Phase 1: Launch Markets (Months 1-3)

```
┌─────────────────────────────────────────────────────────────────┐
│                     PHASE 1: FLORIDA CORE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                          JACKSONVILLE                           │
│                              •                                  │
│                                                                 │
│                                                                 │
│                                                                 │
│                  ORLANDO                                        │
│                     •                                           │
│                                      SPACE COAST                │
│         TAMPA ★                         •                       │
│           Primary                                               │
│                                                                 │
│                                                                 │
│                                                                 │
│                           MIAMI ★                               │
│                           Secondary                             │
│                                                                 │
│  ★ = Full coverage (scraped + verified + partners)              │
│  • = Basic coverage (scraped + API fallback)                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Tampa (Primary):**
- Scrape ALL fitness facilities (~800-1000)
- Outreach to 100% of scraped gyms
- Target 30-50 partner gyms at launch
- Full amenity data coverage

**Miami (Secondary):**
- Scrape ALL fitness facilities (~1500-2000)
- Outreach to top 200 gyms initially
- Target 20-30 partner gyms at launch
- Full amenity data coverage

**Orlando, Jacksonville, Space Coast:**
- Scrape major gyms only (~200 each)
- Outreach to top 50 each
- API fallback for rest

### Phase 2: Florida Complete + Southeast Expansion (Months 4-6)

- Complete Florida coverage (all cities)
- Add Atlanta, GA (~1500 gyms)
- Add Nashville, TN (~800 gyms)
- Add Charlotte, NC (~600 gyms)

### Phase 3: Major Metros (Months 7-12)

Priority based on:
1. **User demand signals** (searches in unsupported areas)
2. **Business traveler hubs** (airports, convention cities)
3. **Gym density** (ROI on scraping effort)

**Likely targets:**
- Austin, TX
- Dallas, TX
- Houston, TX
- Denver, CO
- Phoenix, AZ
- San Diego, CA
- Las Vegas, NV

### Waitlist & Demand Tracking

```typescript
// Track when users search in unsupported areas
async function trackUnsupportedSearch(query: string, location: {lat, lng}) {
  const city = await reverseGeocode(location);
  const coverage = await getCoverageLevel(city);
  
  if (coverage === 'none' || coverage === 'api_only') {
    await supabase.from('expansion_demand').upsert({
      city: city.name,
      state: city.state,
      search_count: 1,
      last_searched: new Date().toISOString()
    }, {
      onConflict: 'city,state',
      count: 'increment'
    });
    
    // Show waitlist prompt to user
    return {
      limited_coverage: true,
      message: `We're expanding to ${city.name} soon! Want us to notify you?`,
      waitlist_cta: true
    };
  }
}

// Weekly report: Top requested cities
SELECT city, state, search_count, 
       (SELECT COUNT(*) FROM expansion_waitlist WHERE city = ed.city) as waitlist_signups
FROM expansion_demand ed
WHERE coverage_level IN ('none', 'api_only')
ORDER BY search_count DESC
LIMIT 20;
```

### Data Coverage Indicators

Don't call attention to gaps, but provide subtle indicators:

```
┌─────────────────────────────────────────────────────────────────┐
│  Iron Temple Fitness                                            │
│  ⭐ 4.8 (124 reviews)  •  📍 Tampa, FL                          │
│                                                                 │
│  ✓ Verified by Owner                     ← Shows for verified   │
│                                                                 │
│  Amenities: Sauna • Pool • Towels • WiFi • 24/7                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Random Gym Chicago                                             │
│  ⭐ 4.2 (Google)  •  📍 Chicago, IL                             │
│                                                                 │
│  [No badge - gym is API-only]                                   │
│                                                                 │
│  Amenities: Locker Rooms • Showers                              │
│  [Fewer amenities shown because we only have API data]          │
│                                                                 │
│  📷 Be the first to add photos!          ← Encourage UGC        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Photo Management & Moderation

### Photo Sources & Hierarchy

```
Display Priority (top to bottom):
1. Owner-uploaded photos (verified)
2. User-uploaded photos (approved)
3. Scraped photos from gym website
4. Google Places API photos
```

### AI Moderation Pipeline

```typescript
import { ImageAnnotatorClient } from '@google-cloud/vision';

const visionClient = new ImageAnnotatorClient();

async function moderatePhoto(imageUrl: string): Promise<ModerationResult> {
  // 1. Run Google Cloud Vision SafeSearch
  const [result] = await visionClient.safeSearchDetection(imageUrl);
  const safe = result.safeSearchAnnotation;
  
  const flags: string[] = [];
  let autoApprove = true;
  let autoReject = false;
  
  // Check for inappropriate content
  if (safe.adult === 'LIKELY' || safe.adult === 'VERY_LIKELY') {
    flags.push('adult_content');
    autoReject = true;
  }
  if (safe.violence === 'LIKELY' || safe.violence === 'VERY_LIKELY') {
    flags.push('violence');
    autoReject = true;
  }
  if (safe.racy === 'LIKELY' || safe.racy === 'VERY_LIKELY') {
    flags.push('racy');
    autoApprove = false;  // Human review
  }
  
  // 2. Run label detection to verify it's a gym photo
  const [labels] = await visionClient.labelDetection(imageUrl);
  const labelNames = labels.labelAnnotations.map(l => l.description.toLowerCase());
  
  const gymRelatedLabels = ['gym', 'fitness', 'exercise', 'weight', 'dumbbell', 
    'treadmill', 'yoga', 'sports', 'workout', 'training', 'locker room', 
    'swimming pool', 'sauna'];
  
  const isGymRelated = gymRelatedLabels.some(label => 
    labelNames.some(l => l.includes(label))
  );
  
  if (!isGymRelated) {
    flags.push('not_gym_related');
    autoApprove = false;  // Human review
  }
  
  // 3. Check for faces (privacy concern)
  const [faces] = await visionClient.faceDetection(imageUrl);
  if (faces.faceAnnotations && faces.faceAnnotations.length > 0) {
    flags.push('faces_detected');
    autoApprove = false;  // Human review for privacy
  }
  
  // 4. Check image quality
  const [properties] = await visionClient.imageProperties(imageUrl);
  // Could check for blur, brightness, etc.
  
  // 5. Determine status
  let status: 'approved' | 'pending' | 'rejected';
  let confidence: number;
  
  if (autoReject) {
    status = 'rejected';
    confidence = 0.95;
  } else if (autoApprove && flags.length === 0) {
    status = 'approved';
    confidence = 0.90;
  } else {
    status = 'pending';  // Human review queue
    confidence = 0.50;
  }
  
  return {
    status,
    flags,
    confidence,
    ai_tags: labelNames.slice(0, 10),  // Top 10 labels
    requires_human_review: status === 'pending'
  };
}
```

### Storage & CDN

```typescript
// Supabase Storage bucket configuration
const PHOTO_BUCKET = 'gym-photos';

async function uploadPhoto(file: File, gymId: string, userId?: string): Promise<PhotoUploadResult> {
  // 1. Generate unique filename
  const ext = file.name.split('.').pop();
  const filename = `${gymId}/${userId || 'owner'}/${Date.now()}.${ext}`;
  
  // 2. Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(filename, file, {
      cacheControl: '31536000',  // 1 year cache
      contentType: file.type,
      upsert: false
    });
  
  // 3. Get public URL (CDN-backed)
  const { data: { publicUrl } } = supabase.storage
    .from(PHOTO_BUCKET)
    .getPublicUrl(filename);
  
  // 4. Generate thumbnail (via Edge Function)
  const thumbnailUrl = await generateThumbnail(publicUrl);
  
  // 5. Run moderation
  const moderation = await moderatePhoto(publicUrl);
  
  // 6. Insert photo record
  const { data: photo } = await supabase.from('photos').insert({
    gym_id: gymId,
    user_id: userId,
    url: publicUrl,
    thumbnail_url: thumbnailUrl,
    source: userId ? 'user' : 'owner',
    moderation_status: moderation.status,
    moderation_flags: moderation.flags,
    ai_tags: moderation.ai_tags,
    ai_confidence: moderation.confidence
  }).select().single();
  
  return {
    photo,
    moderation,
    requires_review: moderation.requires_human_review
  };
}
```

### Photo Watermarking

```typescript
// Add subtle Scout watermark to user photos
async function addWatermark(imageUrl: string, source: 'user' | 'owner'): Promise<string> {
  // Only watermark user photos, not owner photos
  if (source !== 'user') return imageUrl;
  
  // Use Sharp or similar library
  const image = sharp(await fetch(imageUrl).then(r => r.buffer()));
  
  // Add small "📍 Scout" watermark in corner
  const watermarked = await image
    .composite([{
      input: Buffer.from(WATERMARK_SVG),
      gravity: 'southeast',
      blend: 'over'
    }])
    .toBuffer();
  
  // Upload watermarked version
  const watermarkedUrl = await uploadBuffer(watermarked, 'watermarked');
  
  return watermarkedUrl;
}
```

---

## 10. SEO & Public Pages

### Public Gym Pages

Every gym gets a public, SEO-optimized page:

**URL Structure:**
```
https://scoutfitness.com/gyms/tampa-fl/iron-temple-fitness
https://scoutfitness.com/gyms/miami-fl/equinox-brickell
https://scoutfitness.com/gyms/[city-state]/[gym-slug]
```

**Page Content:**
```html
<title>Iron Temple Fitness - Day Pass & Reviews | Tampa, FL | Scout</title>
<meta name="description" content="Book a day pass at Iron Temple Fitness in Tampa, FL. 
  4.8★ rating, 124 reviews. Amenities: Sauna, Pool, 24/7 access, Towel service. 
  From $25/day." />

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ExerciseGym",
  "name": "Iron Temple Fitness",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main St",
    "addressLocality": "Tampa",
    "addressRegion": "FL",
    "postalCode": "33601"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "124"
  },
  "priceRange": "$$"
}
</script>
```

### Category Pages (SEO Landing Pages)

```
https://scoutfitness.com/gyms/tampa-fl?amenity=sauna
→ "Gyms with Sauna in Tampa, FL"

https://scoutfitness.com/gyms/tampa-fl?type=crossfit
→ "CrossFit Gyms in Tampa, FL"

https://scoutfitness.com/gyms/tampa-fl?amenity=womens-section
→ "Women-Friendly Gyms in Tampa, FL"
```

### Blog Content Strategy

To drive organic traffic:

1. **City Guides:** "Best Gyms in Tampa for Travelers (2025)"
2. **Amenity Guides:** "Gyms with Saunas Near You"
3. **Category Guides:** "CrossFit Drop-in Guide: What to Know"
4. **Travel Content:** "How to Maintain Your Fitness Routine While Traveling"

---

## 11. Equipment Search Feature

### Overview

**Priority:** MVP  
**Unique Value:** No other platform lets users search by equipment brand or specialized equipment type.

Equipment search is a key differentiator because fitness enthusiasts have strong preferences about equipment. A powerlifter wants to know if a gym has Rogue equipment. A bodybuilder wants to know the dumbbell max weight. A CrossFitter needs to know about Olympic platforms and bumper plates.

### Searchable Equipment Categories

#### By Brand

| Brand | Known For | Typical Users |
|-------|-----------|---------------|
| **Rogue Fitness** | Premium barbells, racks, CrossFit | Powerlifters, CrossFitters, serious lifters |
| **Hammer Strength** | Plate-loaded machines | Bodybuilders, commercial gyms |
| **Life Fitness** | Cardio, selectorized machines | General fitness, hotel gyms |
| **Precor** | Ellipticals, commercial cardio | Cardio enthusiasts, hotels |
| **Cybex** | Functional trainers, machines | Commercial gyms, physical therapy |
| **Technogym** | Luxury equipment, connected fitness | Premium/boutique gyms |
| **Eleiko** | Competition barbells, plates | Olympic lifters, competition gyms |
| **Kabuki Strength** | Specialty bars (squat bar, deadlift bar) | Powerlifters |
| **REP Fitness** | Value equipment, racks | Budget home/garage gyms |

#### By Specialized Equipment

| Equipment | Description | Target User |
|-----------|-------------|-------------|
| **Sleds/Prowlers** | Push/pull conditioning | Athletes, HIIT |
| **Atlas Stones** | Strongman training | Strongman competitors |
| **Tire Flip** | Heavy tire for conditioning | Strongman, functional |
| **Farmers Carry Handles** | Loaded carries | Grip strength, strongman |
| **Yoke** | Walk with heavy bar on back | Strongman |
| **GHD Machine** | Glute-ham developer | CrossFit, posterior chain |
| **Reverse Hyper** | Lower back, invented by Louie Simmons | Powerlifters, rehab |
| **Competition Bench** | Meets IPF/USAPL specs | Competitive powerlifters |
| **Deadlift Platform** | Platform with rubber and wood | Deadlifters, Olympic lifters |
| **Calibrated Plates** | Exact weight for competition | Powerlifters, Olympic lifters |
| **Assault Bike/Echo Bike** | Air resistance bike | CrossFit, HIIT |
| **Ski Erg** | Upper body cardio | CrossFit, rowing supplement |
| **Belt Squat** | Squat without spinal loading | Those with back issues |
| **Leg Press (45 degree)** | Angled leg press | Bodybuilders |
| **Hack Squat** | Machine squat variation | Bodybuilders |

### Filter UI Design

```
┌─────────────────────────────────────────────────────────────────┐
│  EQUIPMENT FILTERS                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  EQUIPMENT BRAND                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ [▼ Select brand]                                        │   │
│  │   • Any brand                                           │   │
│  │   • Rogue Fitness                                       │   │
│  │   • Hammer Strength                                     │   │
│  │   • Life Fitness                                        │   │
│  │   • Eleiko                                              │   │
│  │   • Technogym                                           │   │
│  │   • Other premium                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  FREE WEIGHTS                                                   │
│  Dumbbell Max: [Any ▼] [50lb] [75lb] [100lb] [125lb] [150lb+] │
│                                                                 │
│  [ ] Squat Racks (3+)                                          │
│  [ ] Power Racks                                                │
│  [ ] Olympic Platforms                                          │
│  [ ] Bumper Plates                                              │
│  [ ] Competition Bench                                          │
│                                                                 │
│  SPECIALIZED EQUIPMENT                                          │
│  [ ] Sleds/Prowlers        [ ] GHD Machine                     │
│  [ ] Atlas Stones          [ ] Reverse Hyper                   │
│  [ ] Tire Flip             [ ] Belt Squat                      │
│  [ ] Assault/Echo Bike     [ ] Ski Erg                         │
│                                                                 │
│  CARDIO                                                         │
│  [ ] Treadmills (10+)      [ ] Rowing Machines                 │
│  [ ] Stair Climbers        [ ] Assault Bikes                   │
│                                                                 │
│  [Apply Filters]                                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Search Examples

**Voice search integration:**
- "Find gyms with Rogue equipment near me"
- "Gyms with heavy dumbbells over 150 pounds"
- "CrossFit boxes with GHD machines and assault bikes"
- "Powerlifting gyms with competition bench and calibrated plates"

**Query processing:**
```typescript
// Voice query: "Find gyms with Rogue equipment and heavy dumbbells"
// Extracted filters:
{
  equipment_brand: 'rogue',
  dumbbell_min_weight: 100,  // "heavy" interpreted as 100+
  location: user_current_location
}

// SQL query:
SELECT * FROM gyms 
WHERE equipment->>'primary_brand' = 'rogue'
  AND (equipment->>'dumbbell_max_weight')::int >= 100
  AND ST_DWithin(location, user_location, 10000)  -- 10km radius
ORDER BY distance;
```

### Data Collection for Equipment

**From Verification Form:**
- Checkbox for specialized equipment
- Dropdown for primary equipment brand
- Number input for dumbbell max weight
- Number input for squat rack count

**From User Reviews (AI extraction):**
```typescript
// Review: "Loved the Rogue racks and they have dumbbells up to 200lbs!"
// AI extracts:
{
  equipment_brand_mentioned: 'rogue',
  dumbbell_weight_mentioned: 200,
  sentiment: 'positive'
}
```

**Confidence Building:**
- Owner-verified: 100% confidence
- Multiple users confirm: 90% confidence
- Single user mention: 70% confidence
- Scraped from website: 50% confidence

---

## 12. Market Waitlist System

### Overview

**Priority:** MVP  
**Purpose:** Capture demand in unsupported areas to prioritize expansion.

When users search in areas where Scout doesn't have full coverage, we:
1. Show them what we have (API data)
2. Capture their interest for future expansion
3. Use aggregate demand to prioritize which cities to expand to

### User Experience

**When searching in unsupported area:**

```
┌─────────────────────────────────────────────────────────────────┐
│  Gyms in Chicago, IL                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 📍 We're not fully in Chicago yet!                      │   │
│  │                                                         │   │
│  │ We found 45 gyms from Google, but Scout's detailed     │   │
│  │ amenity data and verified info isn't available here.   │   │
│  │                                                         │   │
│  │ Want us to expand to Chicago?                          │   │
│  │                                                         │   │
│  │ [Yes, notify me when Chicago launches!]                │   │
│  │                                                         │   │
│  │ 🔥 127 other people have requested Chicago             │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  SHOWING BASIC RESULTS (limited data)                           │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🏋️ Chicago Athletic Clubs                               │   │
│  │ ⭐ 4.2 (Google)  •  📍 123 Michigan Ave                 │   │
│  │                                                         │   │
│  │ Basic info only • No booking available                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Waitlist Data Model

```sql
-- Track demand by city
CREATE TABLE expansion_demand (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT DEFAULT 'US',
  
  -- Aggregate metrics
  search_count INTEGER DEFAULT 0,
  unique_users INTEGER DEFAULT 0,
  waitlist_signups INTEGER DEFAULT 0,
  
  -- Timing
  first_search_at TIMESTAMP WITH TIME ZONE,
  last_search_at TIMESTAMP WITH TIME ZONE,
  
  -- Status
  coverage_level TEXT DEFAULT 'none',  -- 'none', 'api_only', 'partial', 'full'
  expansion_priority TEXT,  -- 'low', 'medium', 'high', 'in_progress'
  target_launch_date DATE,
  
  UNIQUE(city, state, country)
);

-- Individual waitlist signups
CREATE TABLE expansion_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  email TEXT,  -- For non-registered users
  
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  
  -- What they're looking for
  gym_types TEXT[],  -- ['crossfit', 'yoga', 'traditional']
  amenities_wanted TEXT[],  -- ['sauna', 'pool']
  
  signed_up_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notified_at TIMESTAMP WITH TIME ZONE,  -- When we launched and notified them
  
  UNIQUE(COALESCE(user_id::text, email), city, state)
);
```

### Demand Tracking Logic

```typescript
// Track when users search in unsupported areas
async function trackSearch(query: string, location: {lat: number, lng: number}, userId?: string) {
  // Reverse geocode to get city
  const city = await reverseGeocode(location);
  
  // Check coverage level
  const coverage = await getCoverageLevel(city.name, city.state);
  
  if (coverage === 'none' || coverage === 'api_only') {
    // Increment demand counter
    await supabase.rpc('increment_expansion_demand', {
      p_city: city.name,
      p_state: city.state,
      p_user_id: userId
    });
    
    // Return limited coverage notice
    return {
      limited_coverage: true,
      coverage_level: coverage,
      waitlist_count: await getWaitlistCount(city.name, city.state),
      show_waitlist_prompt: true
    };
  }
  
  return { limited_coverage: false };
}

// PostgreSQL function for atomic increment
CREATE OR REPLACE FUNCTION increment_expansion_demand(
  p_city TEXT,
  p_state TEXT,
  p_user_id UUID DEFAULT NULL
) RETURNS void AS $$
BEGIN
  INSERT INTO expansion_demand (city, state, search_count, unique_users, first_search_at, last_search_at)
  VALUES (p_city, p_state, 1, 1, NOW(), NOW())
  ON CONFLICT (city, state, country) DO UPDATE SET
    search_count = expansion_demand.search_count + 1,
    unique_users = CASE 
      WHEN p_user_id IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM expansion_waitlist 
        WHERE city = p_city AND state = p_state AND user_id = p_user_id
      ) THEN expansion_demand.unique_users + 1
      ELSE expansion_demand.unique_users
    END,
    last_search_at = NOW();
END;
$$ LANGUAGE plpgsql;
```

### Expansion Priority Dashboard (Admin)

```
┌─────────────────────────────────────────────────────────────────┐
│  EXPANSION DEMAND                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  HIGHEST DEMAND (Not Yet Covered)                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Rank │ City          │ Searches │ Waitlist │ Priority    │  │
│  ├──────┼───────────────┼──────────┼──────────┼─────────────┤  │
│  │ 1    │ Chicago, IL   │ 2,456    │ 127      │ High        │  │
│  │ 2    │ Austin, TX    │ 1,823    │ 98       │ High        │  │
│  │ 3    │ Denver, CO    │ 1,567    │ 76       │ Medium      │  │
│  │ 4    │ Seattle, WA   │ 1,234    │ 54       │ Medium      │  │
│  │ 5    │ Boston, MA    │ 987      │ 43       │ Medium      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  [Start Chicago Expansion]  [Export Data]                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Launch Notification

When a city launches, notify waitlist:

```typescript
async function notifyWaitlistOfLaunch(city: string, state: string) {
  // Get all waitlist signups for this city
  const { data: waitlist } = await supabase
    .from('expansion_waitlist')
    .select('*')
    .eq('city', city)
    .eq('state', state)
    .is('notified_at', null);
  
  for (const signup of waitlist) {
    // Send push notification if registered user
    if (signup.user_id) {
      await sendPushNotification(signup.user_id, {
        title: `Scout is now in ${city}! 🎉`,
        body: `We've added 500+ gyms with full amenity data. Start exploring!`,
        data: { action: 'open_search', city, state }
      });
    }
    
    // Send email
    const email = signup.email || (await getUserEmail(signup.user_id));
    await sendEmail(email, {
      template: 'city_launch',
      data: { city, state, gym_count: await getGymCount(city, state) }
    });
    
    // Mark as notified
    await supabase
      .from('expansion_waitlist')
      .update({ notified_at: new Date() })
      .eq('id', signup.id);
  }
  
  // Update expansion_demand status
  await supabase
    .from('expansion_demand')
    .update({ coverage_level: 'full' })
    .eq('city', city)
    .eq('state', state);
}
```

---

## 13. Implementation Timeline

### Phase 1: Data Foundation (Weeks 1-4)

| Week | Tasks |
|------|-------|
| 1 | Set up Firecrawl integration, create scraping jobs |
| 1 | Define data schema, create database tables (including equipment fields) |
| 2 | Scrape Tampa + Miami gyms (~3000 total) |
| 2 | Set up Google Cloud Vision for photo moderation |
| 3 | Build verification form (Tally or custom) with equipment section |
| 3 | Set up SendGrid email automation |
| 4 | Launch outreach to Tampa gyms (batch 1: 200) |
| 4 | Build admin review queue for form responses |
| 4 | **Implement market waitlist system** |

### Phase 2: User Content & MVP Features (Weeks 5-8)

| Week | Tasks |
|------|-------|
| 5 | Build review submission flow (post-visit survey) |
| 5 | Integrate voice review with AI extraction |
| 5 | **Build equipment search filters** |
| 6 | Build photo upload with moderation pipeline |
| 6 | Create photo categorization UI |
| 7 | Implement gamification (badges, streaks, points) |
| 7 | Build shareable cards for social |
| 8 | Create membership savings notification logic |
| 8 | Launch outreach to Miami gyms |

### Phase 3: Web & Expansion (Weeks 9-12)

| Week | Tasks |
|------|-------|
| 9 | **Build public SEO pages (gym detail pages)** |
| 9 | **Create city/category landing pages** |
| 10 | Expand scraping to rest of Florida |
| 10 | **Build expansion demand dashboard (admin)** |
| 11 | Optimize moderation pipeline (reduce human review) |
| 11 | Launch waitlist notification system |
| 12 | Launch Orlando, Jacksonville coverage |
| 12 | Begin Atlanta scraping |

### MVP Features Checklist

| Feature | Status | Week |
|---------|--------|------|
| Firecrawl scraping pipeline | 🔲 | 1-2 |
| Verification form + outreach | 🔲 | 3-4 |
| User reviews (voice + text) | 🔲 | 5-6 |
| User photo uploads + moderation | 🔲 | 6 |
| Badges & streaks | 🔲 | 7 |
| Equipment search filters | 🔲 | 5 |
| Market waitlist system | 🔲 | 4 |
| Public gym pages (SEO) | 🔲 | 9 |
| Tampa/Miami full coverage | 🔲 | 2-4 |

---

## Summary

This specification establishes Scout's **data-first competitive moat**:

1. **Multi-Source Data Pipeline:** Scraped → AI-enriched → Form-verified → User-contributed
2. **50+ Unique Data Points:** Equipment brands, women's facilities, accessibility, recovery details
3. **Verification Badges:** Trust signals for owner-verified and user-verified data
4. **Gamification:** Badges, streaks, and points to incentivize user contributions
5. **Smart Expansion:** Data-driven rollout based on user demand signals (via Market Waitlist)
6. **AI-Powered Moderation:** Efficient photo/content review at scale
7. **SEO Foundation:** Public gym pages to drive organic discovery
8. **Equipment Search:** Unique filter by brand (Rogue, Hammer Strength) and specialized equipment
9. **Market Waitlist:** Capture demand in unsupported areas to prioritize expansion

### MVP Features (Launch)

- ✅ Firecrawl scraping pipeline
- ✅ Verification forms + email outreach
- ✅ User reviews (voice + text with AI extraction)
- ✅ User photo uploads with AI moderation
- ✅ Badges, streaks, and points system
- ✅ Equipment search filters
- ✅ Market waitlist system
- ✅ Public gym pages (SEO)

### Post-MVP Features (See Future Plans Document)

- ⏳ Gym Comparison
- ⏳ Referral Program
- ⏳ Class Schedules
- ⏳ Gym Matching Quiz
- ⏳ Price Alerts
- ⏳ Light Social
- ⏳ Corporate Accounts
- ⏳ Partner Referrals
- ⏳ Data Licensing
- ⏳ Real-Time Occupancy

This transforms Scout from "another booking app" into "the most comprehensive fitness facility database" — a defensible advantage that compounds over time as more data is collected and verified.