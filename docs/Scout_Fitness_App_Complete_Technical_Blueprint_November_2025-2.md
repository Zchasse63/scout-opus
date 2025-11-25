# Scout Fitness App: Complete Technical Blueprint
## November 2025 Edition

**Version:** 1.1  
**Last Updated:** November 25, 2025  
**Author:** Scout Development Team  
**Status:** Ready for Development  
**Revision Notes:** Updated UI/UX architecture — removed Voice tab, implemented floating search tray pattern, unified Explore/Map view

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision & Positioning](#2-product-vision--positioning)
3. [Technology Stack](#3-technology-stack)
4. [AI Architecture](#4-ai-architecture)
5. [UI/UX Design System](#5-uiux-design-system)
6. [Database Schema](#6-database-schema)
7. [API Architecture](#7-api-architecture)
8. [Feature Specifications](#8-feature-specifications)
9. [Development Timeline](#9-development-timeline)
10. [Cost Projections](#10-cost-projections)
11. [Launch Strategy](#11-launch-strategy)
12. [Risk Mitigation](#12-risk-mitigation)

---

## 1. Executive Summary

### What is Scout?

Scout is a **travel-focused fitness discovery and booking platform** — think "Airbnb for gyms." It enables business travelers, digital nomads, and fitness enthusiasts to discover, evaluate, and book day passes or memberships at fitness facilities anywhere.

### Why Now?

The convergence of several November 2025 technologies creates an optimal window:

- **Apple SpeechAnalyzer** (iOS 26) now has production-ready React Native integration via `@react-native-ai/apple`
- **Expo SDK 54** with React Native 0.81 delivers 10x faster iOS build times with precompiled XCFrameworks
- **Gemini 2.5 Flash** pricing stabilized at $0.15/$0.60 per million tokens (non-thinking) — 80% cheaper than October projections
- **Google Places API AI Summaries** are now Generally Available in the US with Gemini-powered descriptions

### Core Differentiators

| Scout | ClassPass (Competitor) |
|-------|----------------------|
| 15% commission to gyms | 20-30% commission |
| Transparent pricing | Confusing credit system |
| Voice search core feature | No voice capability |
| Calendar-aware recommendations | Manual search only |
| Fair gym partnerships | Adversarial relationships |
| 1.2/5 TrustScore opportunity | ClassPass: 1.2/5 TrustScore |

### Target Users

**Primary:** Business travelers (35% say gym access is "very important" when booking travel)  
**Secondary:** Digital nomads, fitness enthusiasts traveling for leisure  
**Geographic Focus:** Miami and Tampa (Phase 1), expanding to 10 US cities (Phase 2)

### MVP Scope

- User app (iOS, Android, Web)
- Gym owner dashboard
- Admin dashboard
- Voice search with natural language understanding
- Calendar integration for travel detection
- AI-powered recommendations
- QR code digital passes
- Comprehensive amenity filtering (50+ attributes)

---

## 2. Product Vision & Positioning

### The Anti-ClassPass Positioning

ClassPass has a catastrophic 1.2/5 TrustScore with 33% one-star reviews. The top complaints:

1. **Customer service disaster** — 4+ day response times, AI chatbot only
2. **Billing nightmares** — incorrect charges, missing credits
3. **Gym relationship damage** — studios receive $7-12 per class vs $25-35 drop-in rates

Scout wins by being the opposite:

| Pain Point | Scout Solution |
|------------|----------------|
| Poor customer service | Phone + chat, <1hr response time |
| Confusing credits | Transparent pricing, no credits |
| Low gym payouts | Minimum 85% to gyms (15% commission) |
| Limited availability | Focus on day passes, not class limits |
| No travel features | Calendar integration, proactive recommendations |

### User Journey Vision

```
Day -7: Calendar detects upcoming Miami trip
        → Scout sends push: "5 gyms near your hotel. Book ahead?"
        
Day -1: User opens app, speaks: "Find a gym with sauna 
        and free weights near South Beach"
        → AI processes, shows 3 matches with AI summaries
        
Day 0:  User books $25 day pass
        → QR code generated, saved to Apple Wallet
        
Day 0:  User arrives at gym
        → Scans QR code, check-in complete
        → No paperwork, waiver already signed
        
Day +1: Review prompt
        → User rates experience, Scout improves recommendations
```

### Facility Categories

Scout covers the full fitness spectrum:

**Traditional Fitness**
- Gyms (commercial, boutique)
- CrossFit boxes
- Personal training studios

**Mind-Body**
- Yoga studios
- Pilates studios
- Barre studios
- Meditation centers

**Sports & Recreation**
- Climbing gyms
- Martial arts dojos
- Dance studios
- Cycling studios (spin)
- Rowing studios
- Basketball courts
- Tennis/pickleball courts
- Squash courts
- Swimming pools

**Recovery & Wellness**
- Sauna/steam facilities
- Cold plunge locations
- Cryotherapy centers
- Hyperbaric chambers
- Float tanks
- Massage/spa

### Amenity Taxonomy (50+ Attributes)

**Core Amenities**
- WiFi
- Locker rooms (men's, women's, gender-neutral)
- Showers
- Towel service
- Water fountain/bottle fill

**Premium Amenities**
- Sauna (dry, infrared)
- Steam room
- Pool (lap, leisure)
- Hot tub
- Cold plunge
- Cafe/smoothie bar
- Pro shop
- Childcare

**Equipment Categories**
- Free weights
- Machines (strength)
- Cardio equipment
- Olympic lifting platforms
- Functional training area
- Stretching area
- Turf/sprint track

**Accessibility**
- Wheelchair accessible entrance
- Accessible locker rooms
- Accessible equipment
- Service animal friendly
- Hearing loop

**Parking & Access**
- Free parking
- Paid parking
- Street parking
- EV charging
- Bike storage
- 24/7 access

---

## 3. Technology Stack

### Core Framework

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| **Mobile** | Expo + React Native | SDK 54 / RN 0.81 | 10x faster iOS builds, New Architecture mandatory |
| **Web** | React + Vite | React 19.1 | Shared components with mobile |
| **Navigation** | Expo Router | v4 | File-based routing, universal |
| **State** | Zustand + TanStack Query | 5.x / 5.x | Minimal boilerplate, AI-friendly |

### Backend Infrastructure

| Service | Technology | Tier | Monthly Cost |
|---------|-----------|------|--------------|
| **Database** | Supabase (PostgreSQL) | Pro | $25 |
| **Auth** | Supabase Auth | Included | $0 |
| **Storage** | Supabase Storage | Included | $0 |
| **Edge Functions** | Supabase Edge | 2M invocations included | $0 |
| **Realtime** | Supabase Realtime | Included | $0 |

### AI & Voice Stack

| Capability | Technology | Cost Estimate (100K users) |
|------------|-----------|---------------------------|
| **Voice Transcription (iOS)** | Apple SpeechAnalyzer | $0 (on-device) |
| **Voice Transcription (Android/fallback)** | OpenAI Whisper | ~$500/month |
| **Natural Language Understanding** | Gemini 2.5 Flash | ~$800/month |
| **Recommendations** | Gemini 2.5 Flash | Included above |
| **Calendar Analysis** | Gemini 2.5 Flash | Included above |

### External APIs

| API | Purpose | Tier | Cost Estimate |
|-----|---------|------|---------------|
| **Google Places API (New)** | Gym discovery | Enterprise | ~$15,000/month at scale |
| **Stripe Connect** | Payments | Standard | 2.9% + $0.30 per transaction |
| **OneSignal** | Push notifications | Growth | $0-99/month |

### Development Tools

| Tool | Purpose |
|------|---------|
| **Cursor / Windsurf** | AI code generation |
| **EAS Build** | Cloud builds (iOS without Mac) |
| **EAS Update** | OTA updates |
| **GitHub** | Version control |
| **Supabase Studio** | Database management |

### Package Dependencies

```json
{
  "dependencies": {
    "expo": "^54.0.0",
    "react-native": "~0.81.0",
    "react": "^19.1.0",
    
    "expo-router": "^4.0.0",
    "expo-location": "^18.0.0",
    "expo-calendar": "^14.0.0",
    "expo-av": "^15.0.0",
    "expo-secure-store": "^14.0.0",
    "expo-local-authentication": "^15.0.0",
    
    "@react-native-ai/apple": "^1.0.0",
    "@supabase/supabase-js": "^2.45.0",
    "@stripe/stripe-react-native": "^0.45.0",
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^5.0.0",
    
    "react-native-maps": "^1.21.0",
    "react-native-reanimated": "^4.0.0",
    "react-native-gesture-handler": "^2.22.0",
    
    "onesignal-expo-plugin": "^2.0.0"
  }
}
```

---

## 4. AI Architecture

### Voice Search Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                    VOICE SEARCH FLOW                            │
└─────────────────────────────────────────────────────────────────┘

User speaks: "Find a gym near South Beach with sauna and free weights"
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: AUDIO CAPTURE                                          │
│  - expo-av for recording (16kHz, mono)                          │
│  - Visual feedback: animated waveform                           │
│  - Voice Activity Detection (VAD) for auto-stop                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 2: TRANSCRIPTION                                          │
│                                                                 │
│  iOS 26+: Apple SpeechAnalyzer (@react-native-ai/apple)         │
│  ├─ On-device processing (zero latency, zero cost)              │
│  ├─ 2.2x faster than Whisper                                    │
│  └─ Supports 10+ languages                                      │
│                                                                 │
│  Android / iOS <26: OpenAI Whisper API                          │
│  ├─ $0.006 per minute                                           │
│  └─ ~95% accuracy                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 3: INTENT EXTRACTION (Gemini 2.5 Flash)                   │
│                                                                 │
│  Input: "Find a gym near South Beach with sauna and free weights"│
│                                                                 │
│  Output (structured JSON):                                      │
│  {                                                              │
│    "intent": "search_gyms",                                     │
│    "location": {                                                │
│      "query": "South Beach",                                    │
│      "type": "neighborhood"                                     │
│    },                                                           │
│    "facility_types": ["gym"],                                   │
│    "required_amenities": ["sauna", "free_weights"],             │
│    "optional_amenities": [],                                    │
│    "constraints": {}                                            │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 4: PLACES API QUERY                                       │
│                                                                 │
│  Text Search (New) request:                                     │
│  - textQuery: "gym near South Beach Miami"                      │
│  - includedType: "gym"                                          │
│  - fieldMask: id, displayName, location, rating,                │
│               generativeSummary, regularOpeningHours            │
│                                                                 │
│  Returns: 5-10 gym results with AI summaries                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 5: AMENITY FILTERING                                      │
│                                                                 │
│  Cross-reference Places results with Scout's proprietary DB:    │
│  - Check which gyms have "sauna" amenity                        │
│  - Check which gyms have "free_weights" amenity                 │
│  - Filter to only matching results                              │
│  - If no Scout data, show Places results with "unverified" tag  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 6: RESPONSE GENERATION (Gemini 2.5 Flash)                 │
│                                                                 │
│  Generate natural language response:                            │
│  "I found 3 gyms near South Beach with saunas and free weights. │
│   The top match is Iron Temple Fitness, rated 4.8 stars.        │
│   Would you like me to show you details?"                       │
│                                                                 │
│  Optional: Text-to-speech for audio response                    │
└─────────────────────────────────────────────────────────────────┘
```

### Apple SpeechAnalyzer Integration

```typescript
// Voice transcription using @react-native-ai/apple
import { SpeechTranscriber } from '@react-native-ai/apple';

export async function transcribeAudio(audioUri: string): Promise<string> {
  // Check if running on iOS 26+
  const isSupported = await SpeechTranscriber.isSupported();
  
  if (isSupported) {
    // Use on-device Apple SpeechAnalyzer (free, fast, private)
    const transcriber = new SpeechTranscriber({
      locale: 'en-US',
      reportingOptions: ['volatileResults'],
      attributeOptions: ['audioTimeRange']
    });
    
    const result = await transcriber.transcribe(audioUri);
    return result.text;
  } else {
    // Fallback to Whisper API
    return await transcribeWithWhisper(audioUri);
  }
}
```

### Gemini Integration for NLU

```typescript
// Supabase Edge Function: process-voice-query
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY'));

interface VoiceQueryResult {
  intent: 'search_gyms' | 'get_details' | 'book_pass' | 'check_schedule';
  location?: { query: string; type: string };
  facility_types?: string[];
  required_amenities?: string[];
  constraints?: Record<string, any>;
}

export async function processVoiceQuery(transcript: string): Promise<VoiceQueryResult> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  
  const prompt = `
    You are Scout's voice search assistant. Parse this fitness facility search query 
    and extract structured parameters.
    
    User query: "${transcript}"
    
    Extract:
    - intent: The user's goal (search_gyms, get_details, book_pass, check_schedule)
    - location: Where they want to search (city, neighborhood, or "near me")
    - facility_types: Types of facilities (gym, yoga_studio, crossfit, etc.)
    - required_amenities: Must-have features (sauna, pool, free_weights, etc.)
    - constraints: Time, price, or other filters
    
    Respond with valid JSON only, no explanation.
  `;
  
  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
}
```

### Calendar Intelligence System

```
┌─────────────────────────────────────────────────────────────────┐
│                 CALENDAR INTEGRATION FLOW                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────┐     ┌─────────────────────┐
│   iOS EventKit      │     │  Google Calendar    │
│   (expo-calendar)   │     │      API            │
└─────────┬───────────┘     └──────────┬──────────┘
          │                            │
          └──────────┬─────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  ON-DEVICE TRAVEL DETECTION                                     │
│                                                                 │
│  Scoring Algorithm:                                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Keywords (35%):                                          │   │
│  │ vacation, flight, hotel, airbnb, trip, travel, OOO      │   │
│  │                                                         │   │
│  │ Location Indicators (30%):                              │   │
│  │ Airport codes (JFK, MIA, TPA), hotel names, distances   │   │
│  │                                                         │   │
│  │ Multi-day Events (20%):                                 │   │
│  │ 2+ consecutive days = likely travel                     │   │
│  │                                                         │   │
│  │ All-Day Events (10%):                                   │   │
│  │ All-day events correlate with travel                    │   │
│  │                                                         │   │
│  │ Busy Status (5%):                                       │   │
│  │ Marked as "busy" or "out of office"                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Score ≥ 0.5 → Flag as travel period                           │
└─────────────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  DESTINATION EXTRACTION (Gemini 2.5 Flash)                      │
│                                                                 │
│  Input: Event title "Flight to Miami MIA", location "Miami, FL" │
│                                                                 │
│  Output: { city: "Miami", state: "FL", dates: [...] }           │
└─────────────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│  PROACTIVE NOTIFICATION                                         │
│                                                                 │
│  7 days before trip:                                            │
│  "You're traveling to Miami in a week! 🏋️                       │
│   12 gyms found near your hotel. Want to browse?"               │
│                                                                 │
│  1 day before:                                                  │
│  "Arriving in Miami tomorrow. Book a gym now to guarantee       │
│   your spot at Iron Temple Fitness."                            │
└─────────────────────────────────────────────────────────────────┘
```

### AI Recommendation Engine

```typescript
// Personalized gym recommendations based on user history
interface UserPreferences {
  preferred_amenities: string[];
  preferred_facility_types: string[];
  price_sensitivity: 'low' | 'medium' | 'high';
  typical_workout_times: string[];
  past_ratings: { gym_id: string; rating: number }[];
}

async function generateRecommendations(
  user: UserPreferences,
  location: { lat: number; lng: number },
  availableGyms: Gym[]
): Promise<Gym[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  
  const prompt = `
    You are Scout's recommendation engine. Rank these gyms for this user.
    
    User preferences:
    - Favorite amenities: ${user.preferred_amenities.join(', ')}
    - Facility types they like: ${user.preferred_facility_types.join(', ')}
    - Price sensitivity: ${user.price_sensitivity}
    - Usually works out: ${user.typical_workout_times.join(', ')}
    - Past highly-rated gyms: ${JSON.stringify(user.past_ratings.filter(r => r.rating >= 4))}
    
    Available gyms:
    ${JSON.stringify(availableGyms.map(g => ({
      id: g.id,
      name: g.name,
      amenities: g.amenities,
      type: g.type,
      price: g.day_pass_price,
      rating: g.rating
    })))}
    
    Return a JSON array of gym IDs ordered by best match, with a match_reason for each.
  `;
  
  const result = await model.generateContent(prompt);
  const rankings = JSON.parse(result.response.text());
  
  return rankings.map(r => ({
    ...availableGyms.find(g => g.id === r.id),
    match_reason: r.match_reason
  }));
}
```

---

## 5. UI/UX Design System

### Design Philosophy: Airbnb-Inspired

Scout draws heavy inspiration from Airbnb's UI/UX because:

1. **Native feel** — Airbnb feels like it came pre-installed on the iPhone
2. **Visual browsing** — Large images, minimal text clutter
3. **Filter carousel** — Horizontal category chips for quick filtering
4. **Map integration** — Seamless toggle between list and map views
5. **Trust signals** — Reviews, ratings, and verification badges front and center

### Color System

```css
/* Scout Color Palette */
:root {
  /* Primary - Energetic Orange */
  --scout-primary: #FF5A1F;
  --scout-primary-light: #FF7A45;
  --scout-primary-dark: #E04A10;
  
  /* Secondary - Trust Blue */
  --scout-secondary: #0066FF;
  --scout-secondary-light: #3385FF;
  --scout-secondary-dark: #0052CC;
  
  /* Neutrals */
  --scout-black: #1A1A1A;
  --scout-gray-900: #2D2D2D;
  --scout-gray-700: #4A4A4A;
  --scout-gray-500: #7A7A7A;
  --scout-gray-300: #B0B0B0;
  --scout-gray-100: #F0F0F0;
  --scout-white: #FFFFFF;
  
  /* Semantic */
  --scout-success: #00C853;
  --scout-warning: #FFB300;
  --scout-error: #FF3D00;
  
  /* Gradients */
  --scout-gradient-primary: linear-gradient(135deg, #FF5A1F 0%, #FF7A45 100%);
  --scout-gradient-hero: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%);
}
```

### Typography

```css
/* Scout Typography Scale */
:root {
  /* Font Family */
  --font-primary: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'SF Mono', 'Fira Code', monospace;
  
  /* Font Sizes */
  --text-xs: 11px;
  --text-sm: 13px;
  --text-base: 15px;
  --text-lg: 17px;
  --text-xl: 20px;
  --text-2xl: 24px;
  --text-3xl: 30px;
  --text-4xl: 36px;
  
  /* Font Weights */
  --font-regular: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  
  /* Line Heights */
  --leading-tight: 1.2;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
}
```

### Screen Flow Architecture

Scout uses a **4-tab navigation** with a **floating search tray** pattern inspired by Google Maps, Apple Maps, and Airbnb. This eliminates tab-switching friction and keeps voice search always accessible.

#### Navigation Architecture

```
┌───────────────────────────────────────────────────────────────────┐
│                      MAIN TAB NAVIGATION (4 Tabs)                 │
├─────────────────┬─────────────────┬─────────────────┬─────────────┤
│     Explore     │     Passes      │     Trips       │   Profile   │
│       🏠        │       🎫        │       ✈️        │      👤     │
└─────────────────┴─────────────────┴─────────────────┴─────────────┘

Key Design Decisions:
• Voice search is NOT a separate tab — it's a mic button in the floating search tray
• Map view is NOT a separate tab — it's a toggle button on the Explore tab
• Trips tab is NEW — dedicated space for travel detection & trip-based recommendations
```

#### The Floating Search Tray Pattern

The search tray is a **persistent, draggable bottom sheet** that works on both list and map views:

```
COLLAPSED STATE (~20% of screen)
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    MAP VIEW (or LIST VIEW)                      │
│                                                                 │
│                   [Gym pins / Gym cards]                        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  ════════════════  (Drag Handle)  ════════════════              │
│                                                                 │
│  ┌─────────────────────────────────────┐  ┌────┐               │
│  │ 🔍 Search gyms, yoga, CrossFit...   │  │ 🎤 │               │
│  └─────────────────────────────────────┘  └────┘               │
│                                                                 │
│  [📍 Map]  [🏋️ Gym]  [🧘 Yoga]  [💪 CrossFit]  [🧖 Sauna] ...  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
         ↑
         Tap search field → keyboard + expanded state
         Tap mic icon → voice recording starts
         Tap filter chip → applies filter instantly
```

#### Expanded Search State

When user taps the search field OR pulls up the tray:

```
EXPANDED STATE (~70% of screen)
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│            MAP (dimmed, still visible behind)                   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  ════════════════  (Drag Handle)  ════════════════              │
│                                                                 │
│  ┌─────────────────────────────────────┐  ┌────┐               │
│  │ Find gyms near South Beach...  |    │  │ 🎤 │               │
│  └─────────────────────────────────────┘  └────┘               │
│                                                                 │
│  RECENT SEARCHES                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🕐  "gym with sauna Tampa"                              │   │
│  │ 🕐  "yoga studio downtown Miami"                        │   │
│  │ 🕐  "24 hour gym near airport"                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  QUICK FILTERS                                                  │
│  [🏋️ Gym] [🧘 Yoga] [💪 CrossFit] [🚴 Cycling] [🥊 Boxing]     │
│  [🧖 Sauna] [🏊 Pool] [⏰ 24hr] [🧴 Towels] [📶 WiFi]          │
│                                                                 │
│  AMENITIES                                            [See All] │
│  [ ] Sauna        [ ] Pool         [ ] Steam Room              │
│  [ ] Free Weights [ ] Cold Plunge  [ ] Towel Service           │
│                                                                 │
│  PRICE RANGE                                                    │
│  $5 ════════●════════════ $50                                   │
│              $25/day                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Voice Recording State

When user taps the microphone button:

```
VOICE RECORDING STATE (~40% of screen)
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                     MAP (visible behind)                        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  ════════════════  (Drag Handle)  ════════════════              │
│                                                                 │
│                         ╭────────╮                              │
│                         │        │                              │
│                         │   🎤   │  ← Pulsing animation         │
│                         │        │                              │
│                         ╰────────╯                              │
│                                                                 │
│            "Find me a gym with sauna..."                        │
│                    ↑ Real-time transcription                    │
│                                                                 │
│      ┌──────────────────────────────────────────────┐          │
│      │  ∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿  │          │
│      │         Audio waveform visualization          │          │
│      └──────────────────────────────────────────────┘          │
│                                                                 │
│                      [Cancel]    [Done]                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
         ↑
         Large mic button with pulse animation
         Real-time transcription appears as user speaks
         Waveform shows audio levels
         Auto-stops on silence (VAD)
```

#### Map/List Toggle (Airbnb Pattern)

**List View (Default on Explore Tab):**

```
┌─────────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🔍 Search Miami Beach                              🎤   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [🏋️ Gym] [🧘 Yoga] [💪 CrossFit] [🧖 Sauna] [🏊 Pool] →      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  [═══════════════════════════════════════════════════]   │  │
│  │  │                  GYM PHOTO                        │   │  │
│  │  [═══════════════════════════════════════════════════]   │  │
│  │                                                          │  │
│  │  Iron Temple Fitness            ❤️                       │  │
│  │  ⭐ 4.8 (234 reviews) · 0.8 mi                           │  │
│  │  🧖 Sauna · 💪 Free weights · 📶 WiFi                    │  │
│  │  $25/day                                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  [GYM CARD 2...]                                         │  │
│  ...                                                           │
│                                                                 │
│                    ╭─────────────╮                              │
│                    │  🗺️  Map   │  ← Floating toggle button    │
│                    ╰─────────────╯                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Map View (After Toggle):**

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│               📍        📍                                      │
│                    📍                                           │
│          📍                  📍                                 │
│                                         📍                      │
│     📍            📍                                            │
│                         📍                                      │
│                                    📍                           │
│          📍                                                     │
│                    ╭─────────────╮                              │
│                    │  📋  List  │  ← Floating toggle button    │
│                    ╰─────────────╯                              │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  ════════════════  (Drag Handle)  ════════════════              │
│                                                                 │
│  ┌─────────────────────────────────────┐  ┌────┐               │
│  │ 🔍 Search gyms, yoga, CrossFit...   │  │ 🎤 │               │
│  └─────────────────────────────────────┘  └────┘               │
│                                                                 │
│  [🏋️ Gym] [🧘 Yoga] [💪 CrossFit] [🧖 Sauna] [🏊 Pool] →      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Map Pin Selection → Bottom Sheet Preview:**

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│               📍        📍                                      │
│                    📍                                           │
│          📍                  🔵  ← Selected pin (highlighted)  │
│                                         📍                      │
│     📍            📍                                            │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  ════════════════  (Drag Handle)  ════════════════              │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ [GYM PHOTO]  │  Iron Temple Fitness           ❤️       │    │
│  │              │  ⭐ 4.8 (234) · 0.8 mi                  │    │
│  │              │  $25/day                                │    │
│  │              │                                         │    │
│  │              │  [  View Details  ] [  Book Now  ]      │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                 │
│  🧖 Sauna  💪 Free weights  📶 WiFi  🚿 Showers  🧴 Towels     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
         ↑
         Swipe up for full details modal
         Tap "View Details" for full screen
         Tap "Book Now" to start booking flow
```

#### All Screen Layouts

**GYM DETAIL MODAL (Full Screen)**
```
┌────────────────────────┐
│ ┌────────────────────┐ │
│ │                    │ │
│ │   Hero Image       │ │
│ │   Gallery          │ │
│ │                    │ │
│ └────────────────────┘ │
│                        │
│ Iron Temple Fitness    │
│ ⭐ 4.8 (234 reviews)   │
│ 📍 1.2 mi away         │
│                        │
│ ┌─ Amenities ─────────┐│
│ │ 🧖 Sauna  🏊 Pool   ││
│ │ 💪 Free weights     ││
│ │ 🚿 Showers  🧴 Towels│
│ └─────────────────────┘│
│                        │
│ ┌─ AI Summary ────────┐│
│ │ "Members love the   ││
│ │ spacious weight room││
│ │ and friendly staff."││
│ └─────────────────────┘│
│                        │
│ [  Book Day Pass $25  ]│
└────────────────────────┘
```

**PASSES TAB**
```
┌────────────────────────┐
│        My Passes       │
├────────────────────────┤
│                        │
│ ACTIVE PASSES          │
│                        │
│ ╭─────────────────────╮│
│ │ [QR CODE]           ││
│ │ Iron Temple Fitness ││
│ │ Day Pass - Nov 28   ││
│ │ Valid: 5am - 11pm   ││
│ │                     ││
│ │ [Add to Wallet]     ││
│ ╰─────────────────────╯│
│                        │
│ UPCOMING               │
│                        │
│ ╭─────────────────────╮│
│ │ [QR CODE]           ││
│ │ Yoga Flow Studio    ││
│ │ Day Pass - Dec 2    ││
│ ╰─────────────────────╯│
│                        │
│ PAST VISITS      [All] │
│ Beach Body Gym · Nov 20│
│ CrossFit MIA · Nov 15  │
│                        │
└────────────────────────┘
```

**TRIPS TAB (NEW)**
```
┌────────────────────────┐
│         Trips          │
├────────────────────────┤
│                        │
│ UPCOMING TRIPS         │
│                        │
│ ┌──────────────────────┐
│ │ ✈️  Miami, FL        │
│ │ Dec 5-8, 2025        │
│ │ Detected from calendar
│ │                      │
│ │ 12 gyms found near   │
│ │ your hotel           │
│ │                      │
│ │ [Browse] [Dismiss]   │
│ └──────────────────────┘
│                        │
│ ┌──────────────────────┐
│ │ ✈️  Austin, TX       │
│ │ Dec 15-18, 2025      │
│ │ Detected from calendar
│ │                      │
│ │ 8 gyms found nearby  │
│ │                      │
│ │ [Browse] [Dismiss]   │
│ └──────────────────────┘
│                        │
│ ┌──────────────────────┐
│ │  + Add Trip Manually │
│ └──────────────────────┘
│                        │
│ PAST TRIPS             │
│ Tampa · Nov 10-12      │
│   2 gyms visited       │
│ NYC · Oct 22-25        │
│   4 gyms visited       │
│                        │
└────────────────────────┘
```

**PROFILE TAB**
```
┌────────────────────────┐
│ ┌────────────────────┐ │
│ │  👤 John Smith     │ │
│ │  Member since 2025 │ │
│ └────────────────────┘ │
│                        │
│ > Saved Gyms           │
│ > Visit History        │
│ > Payment Methods      │
│ > Calendar Settings    │
│ > Preferences          │
│ > Notifications        │
│ > Help & Support       │
│ > Sign Out             │
│                        │
└────────────────────────┘
```

### Component Library

```typescript
// Core UI Components for Scout (Updated for Floating Search Tray Architecture)

// ═══════════════════════════════════════════════════════════════
// SEARCH TRAY COMPONENTS
// ═══════════════════════════════════════════════════════════════

// 1. SearchTray - Persistent draggable bottom sheet (CORE COMPONENT)
interface SearchTrayProps {
  state: 'collapsed' | 'expanded' | 'voice-recording';
  onStateChange: (state: SearchTrayProps['state']) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: () => void;
  onVoiceStart: () => void;
  activeFilters: string[];
  onFilterToggle: (filterId: string) => void;
  recentSearches: string[];
}

// SearchTray height constants
const SEARCH_TRAY_HEIGHTS = {
  COLLAPSED: 180,      // ~20% of screen - search bar + filters visible
  EXPANDED: 500,       // ~70% of screen - full search UI
  VOICE_RECORDING: 320, // ~40% of screen - mic + transcription
  SNAP_THRESHOLD: 100,  // Drag distance to trigger snap
  VELOCITY_THRESHOLD: 500, // Velocity to trigger snap
};

// 2. VoiceRecordingView - Recording interface within SearchTray
interface VoiceRecordingViewProps {
  isRecording: boolean;
  transcript: string;           // Real-time transcription
  volatileTranscript: string;   // Interim results (grayed out)
  audioLevel: number;           // 0-1 for waveform visualization
  onCancel: () => void;
  onDone: () => void;
}

// 3. ViewToggleFAB - Floating list/map toggle button
interface ViewToggleFABProps {
  currentView: 'list' | 'map';
  onToggle: () => void;
}

// ViewToggleFAB styling
const VIEW_TOGGLE_STYLES = {
  position: 'absolute',
  bottom: 100, // Above tab bar
  alignSelf: 'center',
  backgroundColor: '#1A1A1A',
  paddingHorizontal: 16,
  paddingVertical: 10,
  borderRadius: 24,
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
  // Shadow
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 8,
};

// 4. FilterCarousel - Horizontal scrolling chips
interface FilterCarouselProps {
  filters: Filter[];
  activeFilters: string[];
  onFilterToggle: (filterId: string) => void;
  variant: 'compact' | 'expanded'; // compact for collapsed tray
}

interface Filter {
  id: string;
  label: string;
  icon: string; // Emoji or icon name
  category: 'facility_type' | 'amenity' | 'feature';
}

// Default filter chips
const DEFAULT_FILTERS: Filter[] = [
  { id: 'gym', label: 'Gym', icon: '🏋️', category: 'facility_type' },
  { id: 'yoga', label: 'Yoga', icon: '🧘', category: 'facility_type' },
  { id: 'crossfit', label: 'CrossFit', icon: '💪', category: 'facility_type' },
  { id: 'cycling', label: 'Cycling', icon: '🚴', category: 'facility_type' },
  { id: 'boxing', label: 'Boxing', icon: '🥊', category: 'facility_type' },
  { id: 'sauna', label: 'Sauna', icon: '🧖', category: 'amenity' },
  { id: 'pool', label: 'Pool', icon: '🏊', category: 'amenity' },
  { id: '24hr', label: '24hr', icon: '⏰', category: 'feature' },
  { id: 'towels', label: 'Towels', icon: '🧴', category: 'amenity' },
  { id: 'wifi', label: 'WiFi', icon: '📶', category: 'amenity' },
];

// 5. SearchInput - Search field with mic button
interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  onFocus: () => void;
  onMicPress: () => void;
  placeholder?: string;
}

// ═══════════════════════════════════════════════════════════════
// GYM DISPLAY COMPONENTS
// ═══════════════════════════════════════════════════════════════

// 6. GymCard - Primary browsing component (list view)
interface GymCardProps {
  gym: Gym;
  variant: 'full' | 'compact' | 'map-preview';
  onPress: () => void;
  onSave: () => void;
  isSaved: boolean;
}

// 7. GymMapPin - Custom map marker
interface GymMapPinProps {
  gym: Gym;
  isSelected: boolean;
  priceLabel: string; // "$25"
  onPress: () => void;
}

// GymMapPin styling
const MAP_PIN_STYLES = {
  default: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selected: {
    backgroundColor: '#1A1A1A',
    borderColor: '#1A1A1A',
  },
  priceText: {
    fontSize: 13,
    fontWeight: '600',
  },
  priceTextSelected: {
    color: '#FFFFFF',
  },
};

// 8. GymPreviewSheet - Bottom sheet for map pin selection
interface GymPreviewSheetProps {
  gym: Gym;
  onViewDetails: () => void;
  onBookNow: () => void;
  onDismiss: () => void;
}

// ═══════════════════════════════════════════════════════════════
// TRIPS TAB COMPONENTS
// ═══════════════════════════════════════════════════════════════

// 9. TripCard - Detected or manual trip display
interface TripCardProps {
  trip: Trip;
  onBrowseGyms: () => void;
  onDismiss: () => void;
  onEdit: () => void;
}

interface Trip {
  id: string;
  destination: {
    city: string;
    state: string;
    country?: string;
  };
  startDate: Date;
  endDate: Date;
  source: 'calendar_detected' | 'manual';
  gymCount: number; // Gyms found near destination
  status: 'upcoming' | 'active' | 'past';
}

// 10. AddTripButton - Manual trip creation
interface AddTripButtonProps {
  onPress: () => void;
}

// ═══════════════════════════════════════════════════════════════
// PASSES & BOOKING COMPONENTS
// ═══════════════════════════════════════════════════════════════

// 11. QRPass - Digital pass with wallet integration
interface QRPassProps {
  booking: Booking;
  onAddToWallet: () => void;
  onViewDetails: () => void;
  variant: 'full' | 'compact';
}

// 12. BookingCTA - Primary booking button
interface BookingCTAProps {
  price: number;
  onPress: () => void;
  isLoading: boolean;
  disabled: boolean;
}

// ═══════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════

// 13. AmenityGrid - Icon grid for amenities
interface AmenityGridProps {
  amenities: Amenity[];
  variant: 'compact' | 'expanded' | 'chips'; // chips for preview sheet
  verificationStatus: 'verified' | 'unverified' | 'user-reported';
  maxVisible?: number; // For compact view
}

// 14. RatingStars - Star display with count
interface RatingStarsProps {
  rating: number;
  reviewCount: number;
  size: 'sm' | 'md' | 'lg';
}

// 15. PriceTag - Day pass pricing
interface PriceTagProps {
  price: number;
  originalPrice?: number; // For discounts
  period: 'day' | 'week' | 'month';
}

// 16. DistanceBadge - Distance from user
interface DistanceBadgeProps {
  distanceMiles: number;
  walkingMinutes?: number;
}
```

### Tab Bar Configuration

```typescript
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { 
  SearchIcon, 
  TicketIcon, 
  PlaneIcon, 
  UserIcon 
} from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF5A1F', // Scout primary orange
        tabBarInactiveTintColor: '#7A7A7A',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
          // Shadow
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <SearchIcon color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="passes"
        options={{
          title: 'Passes',
          tabBarIcon: ({ color, size }) => (
            <TicketIcon color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: 'Trips',
          tabBarIcon: ({ color, size }) => (
            <PlaneIcon color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <UserIcon color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
```

### Animation Patterns

```typescript
// Using react-native-reanimated v4 + react-native-gesture-handler

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

// ═══════════════════════════════════════════════════════════════
// 1. SEARCH TRAY EXPAND/COLLAPSE ANIMATION
// ═══════════════════════════════════════════════════════════════

const COLLAPSED_HEIGHT = 180;
const EXPANDED_HEIGHT = 500;
const VOICE_HEIGHT = 320;
const SNAP_THRESHOLD = 100;
const VELOCITY_THRESHOLD = 500;

const SearchTrayAnimation = () => {
  const translateY = useSharedValue(0); // 0 = collapsed
  const context = useSharedValue({ y: 0 });
  
  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      // Clamp between collapsed and expanded
      const newY = context.value.y + event.translationY;
      translateY.value = Math.max(
        -(EXPANDED_HEIGHT - COLLAPSED_HEIGHT), // Max expand (negative = up)
        Math.min(0, newY) // Min collapse (0)
      );
    })
    .onEnd((event) => {
      // Snap based on velocity or position
      const shouldExpand = 
        event.velocityY < -VELOCITY_THRESHOLD || 
        translateY.value < -(SNAP_THRESHOLD);
      
      if (shouldExpand) {
        translateY.value = withSpring(-(EXPANDED_HEIGHT - COLLAPSED_HEIGHT), {
          damping: 20,
          stiffness: 90,
        });
      } else {
        translateY.value = withSpring(0, {
          damping: 20,
          stiffness: 90,
        });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    height: COLLAPSED_HEIGHT - translateY.value, // Grows as translateY goes negative
  }));

  // Background overlay opacity (dims content behind expanded tray)
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateY.value,
      [0, -(EXPANDED_HEIGHT - COLLAPSED_HEIGHT)],
      [0, 0.5]
    ),
    pointerEvents: translateY.value < -50 ? 'auto' : 'none',
  }));

  return { gesture, animatedStyle, overlayStyle, translateY };
};

// ═══════════════════════════════════════════════════════════════
// 2. VOICE RECORDING PULSE ANIMATION
// ═══════════════════════════════════════════════════════════════

const VoiceRecordingPulse = ({ isRecording }: { isRecording: boolean }) => {
  // Two concentric pulse rings
  const scale1 = useSharedValue(1);
  const scale2 = useSharedValue(1);
  const opacity1 = useSharedValue(0.3);
  const opacity2 = useSharedValue(0.3);
  
  useEffect(() => {
    if (isRecording) {
      // First ring
      scale1.value = withRepeat(
        withTiming(1.8, { duration: 1000, easing: Easing.out(Easing.ease) }),
        -1, // Infinite
        false // Don't reverse
      );
      opacity1.value = withRepeat(
        withTiming(0, { duration: 1000, easing: Easing.out(Easing.ease) }),
        -1,
        false
      );
      
      // Second ring (offset by 500ms for staggered effect)
      setTimeout(() => {
        scale2.value = withRepeat(
          withTiming(1.8, { duration: 1000, easing: Easing.out(Easing.ease) }),
          -1,
          false
        );
        opacity2.value = withRepeat(
          withTiming(0, { duration: 1000, easing: Easing.out(Easing.ease) }),
          -1,
          false
        );
      }, 500);
    } else {
      // Reset to idle state
      scale1.value = withSpring(1);
      scale2.value = withSpring(1);
      opacity1.value = withTiming(0.3);
      opacity2.value = withTiming(0.3);
    }
  }, [isRecording]);
  
  const ring1Style = useAnimatedStyle(() => ({
    transform: [{ scale: scale1.value }],
    opacity: opacity1.value,
  }));
  
  const ring2Style = useAnimatedStyle(() => ({
    transform: [{ scale: scale2.value }],
    opacity: opacity2.value,
  }));
  
  return (
    <View style={styles.pulseContainer}>
      <Animated.View style={[styles.pulseRing, ring1Style]} />
      <Animated.View style={[styles.pulseRing, ring2Style]} />
      <View style={styles.micButton}>
        <MicIcon color="#FFFFFF" size={32} />
      </View>
    </View>
  );
};

const pulseStyles = StyleSheet.create({
  pulseContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF5A1F', // Scout orange
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF5A1F',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});

// ═══════════════════════════════════════════════════════════════
// 3. MAP/LIST TOGGLE ANIMATION (Airbnb-style)
// ═══════════════════════════════════════════════════════════════

const ViewToggleFAB = ({ 
  currentView, 
  onToggle 
}: { 
  currentView: 'list' | 'map';
  onToggle: () => void;
}) => {
  const scale = useSharedValue(1);
  const rotateY = useSharedValue(0);
  
  const handlePress = () => {
    // Playful bounce sequence
    scale.value = withSequence(
      withTiming(0.9, { duration: 80 }),
      withSpring(1.1, { damping: 8, stiffness: 400 }),
      withSpring(1, { damping: 10, stiffness: 300 })
    );
    
    // Flip animation
    rotateY.value = withTiming(
      rotateY.value + 180,
      { duration: 300, easing: Easing.inOut(Easing.ease) }
    );
    
    // Trigger state change
    runOnJS(onToggle)();
  };
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { perspective: 1000 },
      { rotateY: `${rotateY.value}deg` },
    ],
  }));
  
  // Text needs counter-rotation to stay readable
  const textStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${-rotateY.value}deg` }],
  }));
  
  return (
    <Pressable onPress={handlePress}>
      <Animated.View style={[styles.toggleButton, animatedStyle]}>
        <Animated.View style={[styles.toggleContent, textStyle]}>
          {currentView === 'list' ? (
            <>
              <MapIcon color="#FFFFFF" size={16} />
              <Text style={styles.toggleText}>Map</Text>
            </>
          ) : (
            <>
              <ListIcon color="#FFFFFF" size={16} />
              <Text style={styles.toggleText}>List</Text>
            </>
          )}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

const toggleStyles = StyleSheet.create({
  toggleButton: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  toggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  toggleText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

// ═══════════════════════════════════════════════════════════════
// 4. CARD PRESS ANIMATION (Airbnb-style)
// ═══════════════════════════════════════════════════════════════

const CardPressAnimation = ({ children, onPress }) => {
  const scale = useSharedValue(1);
  
  const gesture = Gesture.Tap()
    .onBegin(() => {
      scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
    })
    .onFinalize(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    })
    .onEnd(() => {
      runOnJS(onPress)();
    });
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={animatedStyle}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

// ═══════════════════════════════════════════════════════════════
// 5. GYM PREVIEW SHEET ANIMATION (Map pin selection)
// ═══════════════════════════════════════════════════════════════

const GymPreviewSheet = ({ gym, isVisible }) => {
  const translateY = useSharedValue(200); // Start offscreen
  
  useEffect(() => {
    if (isVisible) {
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 90,
      });
    } else {
      translateY.value = withTiming(200, { duration: 200 });
    }
  }, [isVisible]);
  
  // Gesture for swipe up to expand / swipe down to dismiss
  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) {
        // Swiping down - follow finger with resistance
        translateY.value = e.translationY * 0.5;
      } else {
        // Swiping up - could expand to full details
        translateY.value = e.translationY * 0.3;
      }
    })
    .onEnd((e) => {
      if (e.translationY > 80 || e.velocityY > 500) {
        // Dismiss
        translateY.value = withTiming(200, { duration: 200 });
        runOnJS(onDismiss)();
      } else if (e.translationY < -50 || e.velocityY < -500) {
        // Expand to full details
        runOnJS(onExpandToFullDetails)();
      } else {
        // Snap back
        translateY.value = withSpring(0);
      }
    });
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
  
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.previewSheet, animatedStyle]}>
        {/* Sheet content */}
      </Animated.View>
    </GestureDetector>
  );
};

// ═══════════════════════════════════════════════════════════════
// 6. AUDIO WAVEFORM VISUALIZATION
// ═══════════════════════════════════════════════════════════════

const AudioWaveform = ({ audioLevel }: { audioLevel: number }) => {
  const bars = 20;
  const barHeights = Array.from({ length: bars }, () => useSharedValue(4));
  
  useEffect(() => {
    // Update bar heights based on audio level
    barHeights.forEach((height, index) => {
      const randomFactor = Math.random() * 0.5 + 0.5;
      const targetHeight = 4 + (audioLevel * 30 * randomFactor);
      height.value = withSpring(targetHeight, { damping: 10, stiffness: 200 });
    });
  }, [audioLevel]);
  
  return (
    <View style={styles.waveformContainer}>
      {barHeights.map((height, index) => {
        const animatedStyle = useAnimatedStyle(() => ({
          height: height.value,
        }));
        return (
          <Animated.View 
            key={index}
            style={[styles.waveformBar, animatedStyle]} 
          />
        );
      })}
    </View>
  );
};

const waveformStyles = StyleSheet.create({
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    gap: 3,
  },
  waveformBar: {
    width: 4,
    backgroundColor: '#FF5A1F',
    borderRadius: 2,
  },
});
```

### Responsive Breakpoints

```typescript
// Responsive design for iOS, Android, and Web

const breakpoints = {
  // Mobile (default)
  sm: 0,
  // Tablet
  md: 768,
  // Desktop web
  lg: 1024,
  // Large desktop
  xl: 1280,
};

// Usage with useWindowDimensions
const { width } = useWindowDimensions();
const columns = width < breakpoints.md ? 1 : width < breakpoints.lg ? 2 : 3;
```

### Project File Structure

```
scout-app/
├── app/                          # Expo Router pages
│   ├── (tabs)/                   # Tab navigator group
│   │   ├── _layout.tsx           # Tab bar configuration (4 tabs)
│   │   ├── index.tsx             # Explore tab (list + map)
│   │   ├── passes.tsx            # Passes tab
│   │   ├── trips.tsx             # Trips tab (NEW)
│   │   └── profile.tsx           # Profile tab
│   ├── gym/
│   │   └── [id].tsx              # Gym detail modal
│   ├── booking/
│   │   └── [gymId].tsx           # Booking flow
│   ├── auth/
│   │   ├── login.tsx             # Login screen
│   │   └── callback.tsx          # OAuth callback
│   └── _layout.tsx               # Root layout
│
├── components/
│   ├── search/                   # Search tray components
│   │   ├── SearchTray.tsx        # Main draggable bottom sheet
│   │   ├── SearchInput.tsx       # Search field + mic button
│   │   ├── FilterCarousel.tsx    # Horizontal filter chips
│   │   ├── VoiceRecordingView.tsx # Voice recording UI
│   │   └── AudioWaveform.tsx     # Waveform visualization
│   │
│   ├── explore/                  # Discovery components
│   │   ├── GymCard.tsx           # List view card
│   │   ├── GymMapPin.tsx         # Custom map marker
│   │   ├── GymPreviewSheet.tsx   # Map pin selection sheet
│   │   ├── ViewToggleFAB.tsx     # List/map toggle button
│   │   └── GymDetailModal.tsx    # Full gym details
│   │
│   ├── trips/                    # Trips tab components
│   │   ├── TripCard.tsx          # Trip display card
│   │   ├── AddTripButton.tsx     # Manual trip creation
│   │   └── TripGymList.tsx       # Gyms for a trip
│   │
│   ├── passes/                   # Passes tab components
│   │   ├── QRPass.tsx            # Pass with QR code
│   │   ├── PassCard.tsx          # Compact pass display
│   │   └── WalletButton.tsx      # Add to Apple Wallet
│   │
│   ├── booking/                  # Booking flow components
│   │   ├── BookingCTA.tsx        # Primary booking button
│   │   ├── CheckoutForm.tsx      # Payment form
│   │   └── WaiverModal.tsx       # Waiver signing
│   │
│   └── ui/                       # Shared UI primitives
│       ├── AmenityGrid.tsx       # Amenity icons
│       ├── RatingStars.tsx       # Star rating display
│       ├── PriceTag.tsx          # Price display
│       ├── DistanceBadge.tsx     # Distance indicator
│       └── CardPressAnimation.tsx # Tap animation wrapper
│
├── hooks/
│   ├── useSearchTray.ts          # Search tray state + gestures
│   ├── useVoiceSearch.ts         # Voice recording + transcription
│   ├── useGymSearch.ts           # Search query + results
│   ├── useMapView.ts             # Map state + selected pin
│   ├── useTravelDetection.ts     # Calendar + trip detection
│   └── useBooking.ts             # Booking flow state
│
├── stores/                       # Zustand stores
│   ├── authStore.ts              # Auth state
│   ├── searchStore.ts            # Search filters + results
│   ├── mapStore.ts               # Map view state
│   ├── tripsStore.ts             # Detected trips
│   └── bookingStore.ts           # Active booking
│
├── services/
│   ├── ai/
│   │   ├── gemini.ts             # Gemini 2.5 Flash client
│   │   ├── voiceParser.ts        # Voice → structured query
│   │   └── travelExtractor.ts    # Calendar → destinations
│   ├── maps/
│   │   ├── placesApi.ts          # Google Places API client
│   │   └── geocoding.ts          # Location services
│   ├── payments/
│   │   └── stripe.ts             # Stripe client
│   └── calendar/
│       └── eventKit.ts           # iOS/Google calendar
│
├── constants/
│   ├── colors.ts                 # Scout color palette
│   ├── filters.ts                # Default filter definitions
│   ├── amenities.ts              # Amenity icons + categories
│   └── animations.ts             # Animation constants
│
└── types/
    ├── gym.ts                    # Gym, Amenity types
    ├── booking.ts                # Booking, Pass types
    ├── trip.ts                   # Trip, TravelPeriod types
    └── search.ts                 # SearchQuery, Filter types
```

### UI/UX Architecture Summary

The Scout UI/UX is built around three core patterns:

| Pattern | Implementation | Benefit |
|---------|----------------|---------|
| **Floating Search Tray** | Persistent bottom sheet with collapsed/expanded/voice states | Voice + search always accessible without tab switching |
| **Unified Explore View** | Single tab with list/map toggle FAB | Preserves context when switching views, reduces cognitive load |
| **Dedicated Trips Tab** | Explicit space for travel-related features | Clear ownership of calendar functionality, proactive UX |

**Key UX Principles Applied:**

1. **Always Accessible Voice** — Mic button visible in collapsed search tray on every screen in Explore
2. **Progressive Disclosure** — Collapsed tray shows essentials; expand for full filtering power
3. **Context Preservation** — Switching list ↔ map retains search query, filters, and results
4. **Familiar Patterns** — Borrows from Google Maps, Apple Maps, and Airbnb for instant learnability
5. **Gesture-First** — Drag to expand/collapse, swipe to dismiss, tap to toggle

**Navigation Architecture:**

```
4 Tabs: Explore | Passes | Trips | Profile
                    │
                    ├── SearchTray (floating, persistent)
                    │   ├── Collapsed: Search bar + mic + filter chips
                    │   ├── Expanded: Full filters, recent searches
                    │   └── Voice: Recording UI with transcription
                    │
                    └── ViewToggleFAB: List ↔ Map
```

---

## 6. Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     users       │     │      gyms       │     │    amenities    │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │     │ id (PK)         │     │ id (PK)         │
│ email           │     │ google_place_id │     │ name            │
│ full_name       │     │ name            │     │ category        │
│ avatar_url      │     │ description     │     │ icon            │
│ phone           │     │ address         │     └─────────────────┘
│ created_at      │     │ city            │              │
│ preferences     │     │ state           │              │
└────────┬────────┘     │ lat/lng         │              │
         │              │ owner_id (FK)───┼──────────────┤
         │              │ is_partner      │              │
         │              │ day_pass_price  │     ┌────────┴────────┐
         │              │ created_at      │     │  gym_amenities  │
         │              └────────┬────────┘     ├─────────────────┤
         │                       │              │ gym_id (FK)     │
         │                       │              │ amenity_id (FK) │
┌────────┴────────┐     ┌────────┴────────┐     │ verified        │
│    bookings     │     │    reviews      │     └─────────────────┘
├─────────────────┤     ├─────────────────┤
│ id (PK)         │     │ id (PK)         │
│ user_id (FK)    │     │ user_id (FK)    │
│ gym_id (FK)     │     │ gym_id (FK)     │
│ booking_date    │     │ rating          │
│ pass_type       │     │ comment         │
│ status          │     │ visit_date      │
│ qr_code         │     │ created_at      │
│ stripe_payment  │     └─────────────────┘
│ created_at      │
└─────────────────┘

┌─────────────────┐     ┌─────────────────┐
│ travel_periods  │     │  voice_queries  │
├─────────────────┤     ├─────────────────┤
│ id (PK)         │     │ id (PK)         │
│ user_id (FK)    │     │ user_id (FK)    │
│ destination     │     │ transcript      │
│ start_date      │     │ parsed_intent   │
│ end_date        │     │ results_count   │
│ confidence      │     │ created_at      │
│ source          │     └─────────────────┘
│ created_at      │
└─────────────────┘

┌─────────────────┐     ┌─────────────────┐
│   gym_owners    │     │  gym_hours      │
├─────────────────┤     ├─────────────────┤
│ id (PK)         │     │ gym_id (FK)     │
│ user_id (FK)    │     │ day_of_week     │
│ business_name   │     │ open_time       │
│ stripe_account  │     │ close_time      │
│ verified        │     │ is_24hr         │
│ created_at      │     └─────────────────┘
└─────────────────┘

┌─────────────────┐
│   gym_photos    │
├─────────────────┤
│ id (PK)         │
│ gym_id (FK)     │
│ url             │
│ source          │
│ is_primary      │
│ uploaded_by     │
│ created_at      │
└─────────────────┘
```

### Complete SQL Schema

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  
  -- Preferences stored as JSONB for flexibility
  preferences JSONB DEFAULT '{
    "preferred_amenities": [],
    "preferred_facility_types": [],
    "price_sensitivity": "medium",
    "notification_settings": {
      "travel_alerts": true,
      "booking_reminders": true,
      "promotions": false
    }
  }',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AMENITIES TABLE (reference data)
-- ============================================
CREATE TABLE amenities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL, -- 'core', 'premium', 'equipment', 'accessibility', 'parking'
  icon TEXT, -- Icon name for UI
  description TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed amenities
INSERT INTO amenities (name, slug, category, icon) VALUES
  -- Core
  ('WiFi', 'wifi', 'core', 'wifi'),
  ('Locker Rooms', 'lockers', 'core', 'locker'),
  ('Showers', 'showers', 'core', 'shower'),
  ('Towel Service', 'towels', 'core', 'towel'),
  ('Water Fountain', 'water', 'core', 'droplet'),
  
  -- Premium
  ('Sauna', 'sauna', 'premium', 'flame'),
  ('Steam Room', 'steam', 'premium', 'cloud'),
  ('Pool', 'pool', 'premium', 'waves'),
  ('Hot Tub', 'hot-tub', 'premium', 'hot-tub'),
  ('Cold Plunge', 'cold-plunge', 'premium', 'snowflake'),
  ('Cafe', 'cafe', 'premium', 'coffee'),
  ('Pro Shop', 'pro-shop', 'premium', 'shopping-bag'),
  ('Childcare', 'childcare', 'premium', 'baby'),
  
  -- Equipment
  ('Free Weights', 'free-weights', 'equipment', 'dumbbell'),
  ('Machines', 'machines', 'equipment', 'activity'),
  ('Cardio Equipment', 'cardio', 'equipment', 'heart'),
  ('Olympic Platforms', 'olympic', 'equipment', 'medal'),
  ('Functional Area', 'functional', 'equipment', 'target'),
  ('Stretching Area', 'stretching', 'equipment', 'move'),
  
  -- Accessibility
  ('Wheelchair Accessible', 'wheelchair', 'accessibility', 'accessibility'),
  ('Accessible Locker Rooms', 'accessible-lockers', 'accessibility', 'door-open'),
  ('Service Animals Welcome', 'service-animals', 'accessibility', 'heart'),
  
  -- Parking
  ('Free Parking', 'free-parking', 'parking', 'car'),
  ('Paid Parking', 'paid-parking', 'parking', 'credit-card'),
  ('EV Charging', 'ev-charging', 'parking', 'zap'),
  ('Bike Storage', 'bike-storage', 'parking', 'bike'),
  ('24/7 Access', '24-7', 'parking', 'clock');

-- ============================================
-- GYM OWNERS TABLE
-- ============================================
CREATE TABLE gym_owners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  business_email TEXT,
  business_phone TEXT,
  stripe_account_id TEXT, -- Stripe Connect account
  stripe_onboarding_complete BOOLEAN DEFAULT FALSE,
  verified BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- GYMS TABLE
-- ============================================
CREATE TABLE gyms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  google_place_id TEXT UNIQUE, -- Link to Google Places
  
  -- Basic info
  name TEXT NOT NULL,
  description TEXT,
  facility_type TEXT NOT NULL, -- 'gym', 'yoga_studio', 'crossfit', etc.
  
  -- Location
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT,
  country TEXT DEFAULT 'US',
  location GEOGRAPHY(POINT, 4326), -- PostGIS for geo queries
  
  -- Partnership status
  owner_id UUID REFERENCES gym_owners(id),
  is_partner BOOLEAN DEFAULT FALSE, -- Can we sell passes?
  partnership_tier TEXT, -- 'basic', 'premium', 'enterprise'
  
  -- Pricing (for partners)
  day_pass_price DECIMAL(10, 2),
  week_pass_price DECIMAL(10, 2),
  month_pass_price DECIMAL(10, 2),
  
  -- Ratings (aggregated)
  rating DECIMAL(2, 1),
  review_count INTEGER DEFAULT 0,
  
  -- Google Places data cache
  google_rating DECIMAL(2, 1),
  google_review_count INTEGER,
  google_ai_summary TEXT, -- Gemini-generated summary from Places API
  google_data_updated_at TIMESTAMPTZ,
  
  -- Metadata
  website TEXT,
  phone TEXT,
  email TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create spatial index for location queries
CREATE INDEX idx_gyms_location ON gyms USING GIST(location);

-- ============================================
-- GYM AMENITIES (junction table)
-- ============================================
CREATE TABLE gym_amenities (
  gym_id UUID REFERENCES gyms(id) ON DELETE CASCADE,
  amenity_id UUID REFERENCES amenities(id) ON DELETE CASCADE,
  verified BOOLEAN DEFAULT FALSE, -- Verified by gym owner
  verification_date TIMESTAMPTZ,
  user_reported_count INTEGER DEFAULT 0, -- Crowdsourced verification
  
  PRIMARY KEY (gym_id, amenity_id)
);

-- ============================================
-- GYM HOURS
-- ============================================
CREATE TABLE gym_hours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gym_id UUID REFERENCES gyms(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0=Sunday, 6=Saturday
  open_time TIME,
  close_time TIME,
  is_closed BOOLEAN DEFAULT FALSE,
  is_24hr BOOLEAN DEFAULT FALSE,
  
  UNIQUE (gym_id, day_of_week)
);

-- ============================================
-- GYM PHOTOS
-- ============================================
CREATE TABLE gym_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gym_id UUID REFERENCES gyms(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  storage_path TEXT, -- Supabase Storage path
  source TEXT NOT NULL, -- 'google', 'owner', 'user'
  is_primary BOOLEAN DEFAULT FALSE,
  uploaded_by UUID REFERENCES users(id),
  caption TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  gym_id UUID REFERENCES gyms(id) ON DELETE CASCADE,
  
  -- Booking details
  booking_date DATE NOT NULL,
  pass_type TEXT NOT NULL, -- 'day', 'week', 'month'
  
  -- Status
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'used', 'cancelled', 'expired'
  
  -- QR Code
  qr_code TEXT UNIQUE, -- Encrypted payload for validation
  qr_scanned_at TIMESTAMPTZ,
  qr_scanned_by TEXT, -- Staff who scanned
  
  -- Payment
  stripe_payment_intent_id TEXT,
  stripe_transfer_id TEXT, -- Transfer to gym
  amount_paid DECIMAL(10, 2) NOT NULL,
  platform_fee DECIMAL(10, 2), -- Scout's 15%
  gym_payout DECIMAL(10, 2), -- Gym's 85%
  
  -- Waiver
  waiver_signed BOOLEAN DEFAULT FALSE,
  waiver_signed_at TIMESTAMPTZ,
  waiver_ip_address TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  gym_id UUID REFERENCES gyms(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id), -- Optional link to booking
  
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  
  -- Specific ratings
  cleanliness_rating INTEGER CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
  equipment_rating INTEGER CHECK (equipment_rating >= 1 AND equipment_rating <= 5),
  staff_rating INTEGER CHECK (staff_rating >= 1 AND staff_rating <= 5),
  value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
  
  visit_date DATE,
  is_verified_visit BOOLEAN DEFAULT FALSE, -- Has associated booking
  
  -- Moderation
  is_visible BOOLEAN DEFAULT TRUE,
  flagged BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE (user_id, gym_id, visit_date) -- One review per visit
);

-- ============================================
-- TRAVEL PERIODS (from calendar)
-- ============================================
CREATE TABLE travel_periods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Destination
  destination_city TEXT NOT NULL,
  destination_state TEXT,
  destination_country TEXT DEFAULT 'US',
  destination_lat DECIMAL(10, 7),
  destination_lng DECIMAL(10, 7),
  
  -- Dates
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  
  -- Detection metadata
  confidence_score DECIMAL(3, 2), -- 0.00 to 1.00
  source TEXT NOT NULL, -- 'ios_calendar', 'google_calendar', 'manual'
  source_event_id TEXT, -- Calendar event ID
  
  -- Notifications sent
  pre_trip_notification_sent BOOLEAN DEFAULT FALSE,
  day_before_notification_sent BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- VOICE QUERIES (for analytics & improvement)
-- ============================================
CREATE TABLE voice_queries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Query data
  transcript TEXT NOT NULL,
  parsed_intent JSONB, -- Structured extraction from Gemini
  
  -- Results
  results_count INTEGER,
  selected_gym_id UUID REFERENCES gyms(id),
  
  -- Processing metadata
  transcription_method TEXT, -- 'apple_speechanalyzer', 'whisper'
  processing_time_ms INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SAVED GYMS (favorites)
-- ============================================
CREATE TABLE saved_gyms (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  gym_id UUID REFERENCES gyms(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  
  PRIMARY KEY (user_id, gym_id)
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE gym_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE gyms ENABLE ROW LEVEL SECURITY;
ALTER TABLE gym_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE gym_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE gym_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_gyms ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Anyone can view gyms
CREATE POLICY "Gyms are viewable by everyone" ON gyms
  FOR SELECT USING (true);

-- Gym owners can update their gyms
CREATE POLICY "Owners can update their gyms" ON gyms
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM gym_owners
      WHERE gym_owners.id = gyms.owner_id
      AND gym_owners.user_id = auth.uid()
    )
  );

-- Bookings are private to user
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Reviews are public to read, but users can only edit own
CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (is_visible = true);

CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Travel periods are private
CREATE POLICY "Users can manage own travel periods" ON travel_periods
  FOR ALL USING (auth.uid() = user_id);

-- Voice queries are private
CREATE POLICY "Users can view own voice queries" ON voice_queries
  FOR ALL USING (auth.uid() = user_id);

-- Saved gyms are private
CREATE POLICY "Users can manage saved gyms" ON saved_gyms
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to search gyms by location
CREATE OR REPLACE FUNCTION search_gyms_nearby(
  user_lat DECIMAL,
  user_lng DECIMAL,
  radius_miles INTEGER DEFAULT 10,
  facility_types TEXT[] DEFAULT NULL,
  required_amenities TEXT[] DEFAULT NULL
)
RETURNS TABLE (
  gym_id UUID,
  name TEXT,
  facility_type TEXT,
  distance_miles DECIMAL,
  rating DECIMAL,
  day_pass_price DECIMAL,
  is_partner BOOLEAN,
  amenity_slugs TEXT[]
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    g.id AS gym_id,
    g.name,
    g.facility_type,
    ROUND((ST_Distance(
      g.location::geography,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
    ) / 1609.34)::DECIMAL, 1) AS distance_miles,
    g.rating,
    g.day_pass_price,
    g.is_partner,
    ARRAY_AGG(a.slug) FILTER (WHERE a.slug IS NOT NULL) AS amenity_slugs
  FROM gyms g
  LEFT JOIN gym_amenities ga ON g.id = ga.gym_id
  LEFT JOIN amenities a ON ga.amenity_id = a.id
  WHERE ST_DWithin(
    g.location::geography,
    ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
    radius_miles * 1609.34 -- Convert miles to meters
  )
  AND (facility_types IS NULL OR g.facility_type = ANY(facility_types))
  GROUP BY g.id
  HAVING (
    required_amenities IS NULL 
    OR required_amenities <@ ARRAY_AGG(a.slug) FILTER (WHERE a.slug IS NOT NULL)
  )
  ORDER BY distance_miles ASC;
END;
$$;

-- Function to generate QR code payload
CREATE OR REPLACE FUNCTION generate_qr_payload(booking_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  payload TEXT;
BEGIN
  -- Generate encrypted payload with booking info
  SELECT encode(
    encrypt(
      (b.id || '|' || b.user_id || '|' || b.gym_id || '|' || b.booking_date || '|' || extract(epoch from now()))::bytea,
      current_setting('app.qr_secret')::bytea,
      'aes'
    ),
    'base64'
  )
  INTO payload
  FROM bookings b
  WHERE b.id = booking_id;
  
  RETURN payload;
END;
$$;

-- Function to update gym rating after review
CREATE OR REPLACE FUNCTION update_gym_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE gyms
  SET 
    rating = (
      SELECT ROUND(AVG(rating)::DECIMAL, 1)
      FROM reviews
      WHERE gym_id = NEW.gym_id AND is_visible = true
    ),
    review_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE gym_id = NEW.gym_id AND is_visible = true
    ),
    updated_at = NOW()
  WHERE id = NEW.gym_id;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_update_gym_rating
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_gym_rating();
```

---

## 7. API Architecture

### API Overview

Scout uses a hybrid API architecture:

1. **Supabase Auto-Generated REST API** — For standard CRUD operations
2. **Supabase Edge Functions** — For complex business logic, AI processing, external API calls
3. **Google Places API** — For gym discovery and data enrichment

### Edge Function Endpoints

```
/functions/v1/
├── voice/
│   ├── transcribe          POST  - Transcribe audio (Whisper fallback)
│   └── process-query       POST  - Parse intent with Gemini
│
├── search/
│   ├── gyms                GET   - Search gyms with filters
│   └── nearby              GET   - Gyms near coordinates
│
├── places/
│   ├── details             GET   - Fetch Google Places details
│   ├── photos              GET   - Proxy for Places photos
│   └── refresh             POST  - Update cached Places data
│
├── bookings/
│   ├── create              POST  - Create booking + payment
│   ├── confirm             POST  - Confirm after payment
│   ├── cancel              POST  - Cancel booking
│   └── validate-qr         POST  - Validate QR code at gym
│
├── calendar/
│   ├── sync                POST  - Sync calendar events
│   └── detect-travel       POST  - Run travel detection
│
├── payments/
│   ├── create-intent       POST  - Create Stripe PaymentIntent
│   ├── webhook             POST  - Stripe webhook handler
│   └── connect-account     POST  - Gym owner Stripe onboarding
│
└── notifications/
    ├── travel-alert        POST  - Send travel notification
    └── booking-reminder    POST  - Send booking reminder
```

### Key Edge Function Implementations

```typescript
// Edge Function: /functions/v1/voice/process-query
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { GoogleGenerativeAI } from 'npm:@google/generative-ai';

const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY')!);

serve(async (req) => {
  const { transcript, user_location } = await req.json();
  
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  
  const prompt = `
    Parse this fitness facility search query into structured parameters.
    
    Query: "${transcript}"
    User location: ${JSON.stringify(user_location)}
    
    Extract as JSON:
    {
      "intent": "search_gyms" | "get_details" | "book_pass",
      "location": { "query": string, "use_current": boolean },
      "facility_types": string[],
      "required_amenities": string[],
      "time_constraint": string | null,
      "price_constraint": { "max": number } | null
    }
  `;
  
  const result = await model.generateContent(prompt);
  const parsed = JSON.parse(result.response.text());
  
  return new Response(JSON.stringify(parsed), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

```typescript
// Edge Function: /functions/v1/search/gyms
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

serve(async (req) => {
  const url = new URL(req.url);
  const lat = parseFloat(url.searchParams.get('lat')!);
  const lng = parseFloat(url.searchParams.get('lng')!);
  const radius = parseInt(url.searchParams.get('radius') || '10');
  const types = url.searchParams.get('types')?.split(',');
  const amenities = url.searchParams.get('amenities')?.split(',');
  
  // Call the database function
  const { data, error } = await supabase.rpc('search_gyms_nearby', {
    user_lat: lat,
    user_lng: lng,
    radius_miles: radius,
    facility_types: types,
    required_amenities: amenities,
  });
  
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  // Enrich with Google Places data for non-partner gyms
  const enrichedGyms = await Promise.all(
    data.map(async (gym) => {
      if (!gym.is_partner && gym.google_place_id) {
        const placesData = await fetchPlacesDetails(gym.google_place_id);
        return { ...gym, ...placesData };
      }
      return gym;
    })
  );
  
  return new Response(JSON.stringify(enrichedGyms), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

```typescript
// Edge Function: /functions/v1/bookings/validate-qr
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js';

serve(async (req) => {
  const { qr_code, gym_id, staff_id } = await req.json();
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
  
  // Decrypt and parse QR code
  const decrypted = decrypt(qr_code, Deno.env.get('QR_SECRET')!);
  const [bookingId, userId, qrGymId, bookingDate, timestamp] = decrypted.split('|');
  
  // Validate
  if (qrGymId !== gym_id) {
    return new Response(JSON.stringify({ 
      valid: false, 
      error: 'QR code is for a different gym' 
    }), { status: 400 });
  }
  
  const today = new Date().toISOString().split('T')[0];
  if (bookingDate !== today) {
    return new Response(JSON.stringify({ 
      valid: false, 
      error: 'Pass is not valid for today' 
    }), { status: 400 });
  }
  
  // Check booking status
  const { data: booking, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single();
  
  if (error || !booking) {
    return new Response(JSON.stringify({ 
      valid: false, 
      error: 'Booking not found' 
    }), { status: 404 });
  }
  
  if (booking.status === 'used') {
    return new Response(JSON.stringify({ 
      valid: false, 
      error: 'Pass already used' 
    }), { status: 400 });
  }
  
  // Mark as used
  await supabase
    .from('bookings')
    .update({
      status: 'used',
      qr_scanned_at: new Date().toISOString(),
      qr_scanned_by: staff_id,
    })
    .eq('id', bookingId);
  
  // Get user info for gym staff display
  const { data: user } = await supabase
    .from('users')
    .select('full_name, avatar_url')
    .eq('id', userId)
    .single();
  
  return new Response(JSON.stringify({
    valid: true,
    booking: {
      id: bookingId,
      pass_type: booking.pass_type,
      user_name: user?.full_name,
      user_avatar: user?.avatar_url,
    }
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

### Google Places API Integration

```typescript
// lib/places-api.ts
const PLACES_API_BASE = 'https://places.googleapis.com/v1';
const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

interface PlacesSearchParams {
  textQuery: string;
  includedType?: string;
  locationBias?: {
    circle: {
      center: { latitude: number; longitude: number };
      radius: number;
    };
  };
}

export async function searchPlaces(params: PlacesSearchParams) {
  const response = await fetch(`${PLACES_API_BASE}/places:searchText`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': [
        'places.id',
        'places.displayName',
        'places.formattedAddress',
        'places.location',
        'places.rating',
        'places.userRatingCount',
        'places.regularOpeningHours',
        'places.generativeSummary',
        'places.photos',
      ].join(','),
    },
    body: JSON.stringify(params),
  });
  
  return response.json();
}

export async function getPlaceDetails(placeId: string) {
  const response = await fetch(
    `${PLACES_API_BASE}/places/${placeId}`,
    {
      headers: {
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': [
          'id',
          'displayName',
          'formattedAddress',
          'location',
          'rating',
          'userRatingCount',
          'regularOpeningHours',
          'generativeSummary',
          'reviews',
          'photos',
          'websiteUri',
          'nationalPhoneNumber',
          'accessibilityOptions',
          'parkingOptions',
        ].join(','),
      },
    }
  );
  
  return response.json();
}
```

---

## 8. Feature Specifications

### F1: Voice Search

**Priority:** P0 (MVP Core)  
**Complexity:** High  
**AI Dependency:** Apple SpeechAnalyzer + Gemini 2.5 Flash  
**UI Location:** Mic button in SearchTray (accessible on Explore tab in both list and map views)

**User Stories:**
- As a user, I can tap the mic button in the search tray and speak my search
- As a user, I see real-time transcription as I speak
- As a user, I can use natural language ("gym with sauna near me")
- As a user, I can have follow-up conversations ("show me cheaper options")

**Technical Requirements:**
- Audio recording with expo-av (16kHz mono)
- On-device transcription via @react-native-ai/apple (iOS 26+)
- Fallback to Whisper API (Android, older iOS)
- Intent parsing via Gemini 2.5 Flash
- Streaming UI updates during processing
- Conversation context management (8-10 turn memory)
- Voice Activity Detection (VAD) for automatic stop on silence
- SearchTray transitions to voice recording state (~40% height)

**Acceptance Criteria:**
- [ ] Voice recording activates within 200ms of mic button press
- [ ] SearchTray smoothly transitions to voice recording state
- [ ] Pulsing mic animation provides clear recording feedback
- [ ] Real-time waveform visualization during recording
- [ ] Transcription appears in real-time (volatile + final text)
- [ ] Transcription completes within 500ms of speech end
- [ ] Intent parsing completes within 1 second
- [ ] Search results display within 2 seconds total
- [ ] Multi-turn conversations maintain context

---

### F2: Gym Discovery & Search

**Priority:** P0 (MVP Core)  
**Complexity:** Medium  
**AI Dependency:** Google Places API + Gemini AI Summaries  
**UI Location:** Explore tab with unified list/map views and ViewToggleFAB

**User Stories:**
- As a user, I can browse gyms on a list view (default)
- As a user, I can toggle to map view with a floating button
- As a user, I can switch between list and map without losing my search context
- As a user, I can filter by facility type (yoga, CrossFit, etc.)
- As a user, I can filter by amenities (sauna, pool, 24/7)
- As a user, I can see AI-generated summaries of gyms
- As a user, I can see distance from my location

**Technical Requirements:**
- Google Places API (New) integration
- PostGIS spatial queries for distance calculation
- Field masking for cost optimization
- Caching strategy per Google ToS (place_id permanent, coordinates 30 days)
- Hybrid data: Google Places + Scout proprietary database
- Single map instance (no remounting on toggle)
- Shared state between list and map views

**Acceptance Criteria:**
- [ ] Map loads within 1 second with gym pins
- [ ] List view shows 10+ gyms sorted by distance
- [ ] ViewToggleFAB switches views with bounce animation
- [ ] Search query and filters persist across view toggle
- [ ] Filter carousel updates results instantly
- [ ] AI summaries display for US locations
- [ ] Photos load progressively (placeholder → full)
- [ ] Map pin selection shows GymPreviewSheet

---

### F3: Calendar Integration & Trips Tab

**Priority:** P1 (MVP Important)  
**Complexity:** Medium  
**AI Dependency:** Gemini 2.5 Flash for destination extraction  
**UI Location:** Trips tab (dedicated space for travel-related features)

**User Stories:**
- As a user, I can connect my iOS/Google Calendar
- As a user, I see my detected trips in the Trips tab
- As a user, Scout automatically detects my upcoming trips
- As a user, I can manually add trips that weren't auto-detected
- As a user, I receive proactive gym recommendations before travel
- As a user, I can browse gyms for a specific trip directly from the Trips tab
- As a user, I control what calendar data Scout can access

**Technical Requirements:**
- iOS EventKit via expo-calendar
- Google Calendar API OAuth integration
- On-device travel detection algorithm
- Background refresh every 12-24 hours
- Push notification scheduling via OneSignal
- TripCard component showing destination, dates, gym count
- Manual trip creation flow

**Acceptance Criteria:**
- [ ] Calendar permission request explains benefits clearly
- [ ] Travel detection runs without sending event details to server
- [ ] Detected trips display in Trips tab with gym count
- [ ] Tapping "Browse Gyms" on a trip pre-fills Explore search with destination
- [ ] Push notification sent 7 days before detected trip
- [ ] User can dismiss detected trips they don't want
- [ ] User can manually add trips with destination + dates
- [ ] Works with multiple calendars

---

### F4: Booking & Payment

**Priority:** P0 (MVP Core)  
**Complexity:** High  
**Dependencies:** Stripe Connect, Partner Gyms

**User Stories:**
- As a user, I can purchase a day pass with one tap
- As a user, I can see transparent pricing (no hidden fees)
- As a user, I receive instant confirmation with QR code
- As a gym owner, I receive 85% of booking revenue
- As a gym owner, I can see all bookings in my dashboard

**Technical Requirements:**
- Stripe Connect for marketplace payments
- Separate Charges and Transfers model
- 15% platform commission calculation
- QR code generation with encrypted payload
- Waiver signing flow before first booking

**Acceptance Criteria:**
- [ ] Checkout completes in under 10 seconds
- [ ] QR code generates immediately after payment
- [ ] QR code works offline (Apple Wallet integration)
- [ ] Gym receives payout within 2-5 business days
- [ ] Cancellation within 24 hours provides full refund

---

### F5: QR Code Digital Passes

**Priority:** P0 (MVP Core)  
**Complexity:** Medium  
**Dependencies:** Booking system

**User Stories:**
- As a user, my QR code displays in the app
- As a user, I can add my pass to Apple/Google Wallet
- As a user, the QR code works even without internet
- As gym staff, I can scan and validate passes instantly
- As gym staff, I see the user's name and photo after scanning

**Technical Requirements:**
- Dynamic QR code with encrypted payload
- HMAC signature for validation
- Single-use scan lock (mark as used immediately)
- Apple Wallet / Google Wallet pass generation
- Offline validation fallback with sync

**Acceptance Criteria:**
- [ ] QR code displays within 1 second of opening pass
- [ ] Wallet integration works on iOS 15+ and Android 10+
- [ ] Scanning validation responds within 500ms
- [ ] Used passes cannot be scanned again
- [ ] Staff sees user info after successful scan

---

### F6: Gym Owner Dashboard

**Priority:** P1 (MVP Important)  
**Complexity:** Medium  
**Platform:** Web (primary), Mobile (future)

**User Stories:**
- As a gym owner, I can claim and verify my gym listing
- As a gym owner, I can update hours, photos, amenities
- As a gym owner, I can set my day pass pricing
- As a gym owner, I can view bookings and revenue
- As a gym owner, I can connect my Stripe account

**Technical Requirements:**
- Web dashboard (Next.js or Vite + React)
- Stripe Connect Express onboarding
- Photo upload to Supabase Storage
- Real-time booking notifications
- Revenue analytics and payout history

**Acceptance Criteria:**
- [ ] Gym verification process takes under 48 hours
- [ ] Dashboard loads within 2 seconds
- [ ] Stripe onboarding completes in one session
- [ ] Revenue updates reflect within 24 hours
- [ ] Booking notifications deliver in real-time

---

### F7: Reviews & Ratings

**Priority:** P2 (Post-MVP)  
**Complexity:** Low  

**User Stories:**
- As a user, I can rate a gym after my visit
- As a user, I can leave detailed reviews
- As a user, I can see reviews from other Scout users
- As a user, I can report inappropriate reviews

**Technical Requirements:**
- Review submission with booking verification
- Rating aggregation trigger function
- Review moderation queue for admin
- Integration with Google Places reviews

**Acceptance Criteria:**
- [ ] Review prompt appears 24 hours after visit
- [ ] Rating updates reflect within 5 minutes
- [ ] Reviews show verification badge for actual visitors
- [ ] Reported reviews hidden pending moderation

---

## 9. Development Timeline

### Phase Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    12-WEEK MVP TIMELINE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PHASE 1: Foundation (Weeks 1-3)                                │
│  ├─ Project setup, auth, 4-tab navigation                       │
│  ├─ SearchTray component (floating search + voice)              │
│  └─ Database schema, Supabase configuration                     │
│                                                                 │
│  PHASE 2: Core Features (Weeks 4-7)                             │
│  ├─ Gym discovery + Google Places integration                   │
│  ├─ Voice search in SearchTray + AI processing                  │
│  └─ Unified map/list view with toggle                           │
│                                                                 │
│  PHASE 3: Booking System (Weeks 8-9)                            │
│  ├─ Stripe Connect integration                                  │
│  ├─ QR code generation/validation                               │
│  └─ Booking flow                                                │
│                                                                 │
│  PHASE 4: Intelligence (Week 10)                                │
│  ├─ Trips tab + calendar integration                            │
│  └─ Travel detection + notifications                            │
│                                                                 │
│  PHASE 5: Polish & Launch (Weeks 11-12)                         │
│  ├─ Testing, bug fixes, performance                             │
│  ├─ App Store submission                                        │
│  └─ Soft launch in Miami/Tampa                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Week-by-Week Breakdown

#### Week 1: Project Foundation
- [ ] Initialize Expo SDK 54 project with TypeScript
- [ ] Configure EAS Build (iOS + Android)
- [ ] Set up Supabase project (Pro tier)
- [ ] Implement database schema (SQL from Section 6)
- [ ] Configure Row Level Security policies
- [ ] Set up GitHub repository with CI/CD

**Deliverable:** Running app shell with database connected

#### Week 2: Authentication
- [ ] Implement Apple Sign In
- [ ] Implement Google Sign In
- [ ] Add magic link email authentication
- [ ] Create auth state management (Zustand)
- [ ] Build login/signup screens
- [ ] Implement secure token storage (expo-secure-store)

**Deliverable:** Working authentication flow

#### Week 3: Navigation & Design System
- [ ] Set up Expo Router file-based navigation
- [ ] Create 4-tab navigation (Explore, Passes, Trips, Profile)
- [ ] Build SearchTray component (collapsed/expanded/voice states)
- [ ] Implement ViewToggleFAB (list/map toggle button)
- [ ] Build design system components (colors, typography, spacing)
- [ ] Create reusable UI components (GymCard, FilterCarousel, etc.)
- [ ] Implement dark mode support

**Deliverable:** Complete navigation with floating search tray and placeholder screens

#### Week 4: Google Places Integration
- [ ] Set up Google Cloud project with Places API (New)
- [ ] Create Edge Function for Places API proxy
- [ ] Implement text search for gyms
- [ ] Implement place details fetching
- [ ] Build photo proxy endpoint
- [ ] Create data caching layer

**Deliverable:** Basic gym search returning Google data

#### Week 5: Voice Search - Recording
- [ ] Implement audio recording (expo-av)
- [ ] Create VoiceRecordingView within SearchTray (mic + transcription UI)
- [ ] Build pulse animation for recording state
- [ ] Build audio waveform visualization component
- [ ] Integrate Apple SpeechAnalyzer (@react-native-ai/apple)
- [ ] Implement Whisper API fallback for Android
- [ ] Build real-time transcription display (volatile + final text)
- [ ] Add Voice Activity Detection (VAD) for auto-stop

**Deliverable:** Voice-to-text working in SearchTray on iOS

#### Week 6: Voice Search - AI Processing
- [ ] Create Gemini 2.5 Flash Edge Function
- [ ] Implement intent parsing prompt
- [ ] Build query-to-search translation
- [ ] Create natural language response generation
- [ ] Implement conversation context (multi-turn)

**Deliverable:** End-to-end voice search working

#### Week 7: Map & Discovery UI
- [ ] Integrate react-native-maps
- [ ] Build map view with custom GymMapPin components
- [ ] Implement ViewToggleFAB with bounce animation
- [ ] Create seamless list ↔ map state sync (preserve filters, results)
- [ ] Implement filter carousel (facility types, amenities)
- [ ] Build GymPreviewSheet for map pin selection
- [ ] Create gym detail modal (full screen)
- [ ] Add saved gyms functionality

**Deliverable:** Complete discovery experience with unified list/map toggle

#### Week 8: Stripe Integration
- [ ] Set up Stripe account and Connect
- [ ] Create payment intent Edge Function
- [ ] Build checkout flow UI
- [ ] Implement Stripe webhook handler
- [ ] Create gym owner Stripe onboarding flow
- [ ] Test end-to-end payment flow

**Deliverable:** Test payments working

#### Week 9: Booking & QR Codes
- [ ] Build booking creation flow
- [ ] Implement QR code generation
- [ ] Create QR validation endpoint
- [ ] Build Passes tab with booking history
- [ ] Implement Apple Wallet integration
- [ ] Create waiver signing flow

**Deliverable:** Complete booking loop

#### Week 10: Calendar, Trips Tab & Notifications
- [ ] Build Trips tab UI (upcoming trips, past trips, manual add)
- [ ] Implement TripCard component
- [ ] Implement expo-calendar integration
- [ ] Build travel detection algorithm
- [ ] Create destination extraction (Gemini)
- [ ] Link detected trips to Explore tab search
- [ ] Set up OneSignal push notifications
- [ ] Implement travel alert notifications (7 days, 1 day before)
- [ ] Build booking reminder notifications

**Deliverable:** Proactive travel recommendations with dedicated Trips tab

#### Week 11: Testing & Optimization
- [ ] Write unit tests for critical functions
- [ ] Implement E2E tests (Detox)
- [ ] Performance optimization (bundle size, load times)
- [ ] Accessibility audit (VoiceOver, TalkBack)
- [ ] Security audit (auth, payments, data)
- [ ] Fix bugs from internal testing

**Deliverable:** Stable, tested app

#### Week 12: Launch Preparation
- [ ] App Store screenshot preparation
- [ ] Write App Store description
- [ ] Submit iOS app for review
- [ ] Submit Android app to Play Store
- [ ] Prepare launch marketing materials
- [ ] Recruit 5-10 partner gyms in Miami/Tampa
- [ ] Soft launch to beta testers

**Deliverable:** Apps live in stores

---

## 10. Cost Projections

### Development Phase Costs (Months 1-3)

| Item | Monthly Cost |
|------|-------------|
| Supabase Pro | $25 |
| Apple Developer Program | $8.25 ($99/year) |
| Google Play Console | $2.08 ($25 one-time) |
| Domain (scoutfitness.app) | ~$2 |
| Google Places API (testing) | ~$50 |
| Gemini API (testing) | ~$20 |
| **Total** | **~$110/month** |

### MVP Launch Costs (1,000 Users)

| Item | Monthly Cost | Notes |
|------|-------------|-------|
| Supabase Pro | $25 | 8GB database included |
| Google Places API | ~$230 | 7,500 searches, 2,250 details |
| Gemini 2.5 Flash | ~$50 | ~750K tokens (voice + recommendations) |
| Whisper API | ~$15 | Android users only (~30%) |
| OneSignal | $0 | Free tier (10K subscribers) |
| Stripe Fees | ~$75 | 2.9% + $0.30 on ~$2,500 GMV |
| **Total** | **~$395/month** |

**Per User Cost:** $0.40/month

### Growth Phase Costs (10,000 Users)

| Item | Monthly Cost | Notes |
|------|-------------|-------|
| Supabase Pro | $25-75 | May need compute add-ons |
| Google Places API | ~$2,300 | Volume discounts apply |
| Gemini 2.5 Flash | ~$300 | ~7.5M tokens |
| Whisper API | ~$100 | |
| OneSignal | $0-99 | May hit Growth tier |
| Stripe Fees | ~$750 | ~$25K GMV |
| **Total** | **~$3,550/month** |

**Per User Cost:** $0.36/month

### Scale Phase Costs (100,000 Users)

| Item | Monthly Cost | Notes |
|------|-------------|-------|
| Supabase Pro + Add-ons | $200-500 | Large instance + bandwidth |
| Google Places API | ~$15,000 | Enterprise volume discounts |
| Gemini 2.5 Flash | ~$2,000 | ~75M tokens |
| Whisper API | ~$500 | |
| OneSignal | $99-299 | |
| Stripe Fees | ~$7,500 | ~$250K GMV |
| **Total** | **~$25,500/month** |

**Per User Cost:** $0.26/month

### Revenue Model

| Revenue Stream | Pricing | 100K Users Projection |
|----------------|---------|----------------------|
| Day Pass Commission (15%) | $3-5 avg per booking | $75,000/month |
| Premium Subscription | $9.99/month | $30,000/month (30% conversion) |
| Corporate B2B | $30K/year avg | $10,000/month (4 clients) |
| **Total Revenue** | | **~$115,000/month** |
| **Costs** | | ~$25,500/month |
| **Gross Margin** | | **~78%** |

---

## 11. Launch Strategy

### Pre-Launch (Weeks 10-12)

**Gym Partner Recruitment (Miami/Tampa)**
- Target: 20 partner gyms before launch
- Focus: Mix of boutique studios + mid-size gyms
- Value proposition: "15% commission, not 30%. Fair partnerships."
- Collateral: One-pager, demo video, case studies from beta

**Beta Testing**
- TestFlight beta with 50 users
- Focus on voice search accuracy, booking flow, QR validation
- Collect feedback via in-app surveys

**App Store Optimization**
- Keywords: "gym finder", "fitness pass", "gym day pass", "workout near me"
- Screenshots: Voice search in action, map view, QR pass
- Video preview: 15-second demo

### Soft Launch (Week 12-14)

**Geography:** Miami and Tampa only  
**Goal:** 500 users, 50 bookings, 10 reviews  

**Marketing Channels:**
1. **Reddit** — r/Miami, r/Tampa, r/fitness, r/digitalnomad
2. **Local fitness influencers** — Instagram/TikTok micro-influencers
3. **Business travel forums** — FlyerTalk, travel subreddits
4. **Product Hunt** — Schedule launch for visibility

**Success Metrics:**
- 60%+ booking completion rate
- <2% payment failure rate
- 4.5+ app store rating
- <1% critical bug rate

### Public Launch (Week 14-16)

**Expansion:** Add 3-5 more Florida cities  
**Goal:** 5,000 users, 500 bookings  

**Marketing Push:**
1. **Press release** — TechCrunch, local business journals
2. **Paid ads** — Instagram, Google Ads (geo-targeted)
3. **Referral program** — $10 credit for referrer and referee
4. **Corporate outreach** — HR departments at Miami/Tampa companies

### Growth Phase (Months 4-6)

**Expansion:** 10 US cities  
**Goal:** 25,000 users, 100 partner gyms  

**Focus Areas:**
1. Build proprietary amenity database
2. Launch gym owner mobile app
3. Add week/month pass options
4. Corporate B2B sales team
5. Series A fundraise (if needed)

---

## 12. Risk Mitigation

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Voice recognition accuracy | Medium | High | Fallback to Whisper, error correction prompts |
| Google Places API rate limits | Low | High | Caching, request batching, budget alerts |
| Apple SpeechAnalyzer iOS 26 only | Low | Medium | Whisper fallback for older devices |
| Supabase scaling issues | Low | Medium | Monitor usage, plan migration path |

### Business Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Gym partner recruitment | High | Critical | Start with chains, prove value, raise commission if needed |
| ClassPass competitive response | Medium | High | Differentiate on service, not price |
| App Store rejection | Low | High | Emphasize "physical service" exception |
| Payment failures | Low | Medium | Stripe handles retries, backup methods |

### Regulatory Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| CCPA/GDPR compliance | Medium | High | Privacy-by-design, data minimization |
| Apple IAP requirements | Low | High | Physical service positioning, legal review |
| Gym waiver liability | Medium | Medium | Legal review of waiver language |

### Contingency Plans

**If gym recruitment is slow:**
- Launch with "discovery only" mode (Google Places data, no booking)
- Users can see gyms but call to book directly
- Prove user demand, then approach gyms with data

**If voice search underperforms:**
- Emphasize text search as primary
- Voice becomes "delighter" feature, not core
- Reduce Gemini costs

**If costs exceed projections:**
- Implement usage caps per user
- Switch to Gemini 2.5 Flash-Lite (50% cheaper)
- Reduce Places API calls with aggressive caching

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| **Day Pass** | Single-day access to a gym |
| **Partner Gym** | Gym that has agreed to sell passes through Scout |
| **Discovery Gym** | Gym listed via Google Places, not yet a partner |
| **QR Pass** | Digital pass with QR code for gym entry |
| **Voice Query** | Natural language search via voice input |
| **Travel Period** | Detected upcoming trip from user's calendar |
| **GMV** | Gross Merchandise Value (total booking value) |
| **MAU** | Monthly Active Users |
| **DAU** | Daily Active Users |

## Appendix B: Key Links

- **Expo Documentation:** https://docs.expo.dev
- **Supabase Documentation:** https://supabase.com/docs
- **Google Places API (New):** https://developers.google.com/maps/documentation/places/web-service
- **Gemini API:** https://ai.google.dev/gemini-api/docs
- **Stripe Connect:** https://stripe.com/docs/connect
- **Apple SpeechAnalyzer:** https://developer.apple.com/documentation/speech/speechanalyzer
- **@react-native-ai/apple:** https://www.callstack.com/blog/on-device-speech-transcription-with-apple-speechanalyzer

## Appendix C: AI Prompts Library

### Voice Query Intent Parsing
```
You are Scout's voice search assistant. Parse this fitness facility search query 
and extract structured parameters.

User query: "${transcript}"
User location: ${location}

Extract as JSON:
{
  "intent": "search_gyms" | "get_details" | "book_pass" | "check_schedule",
  "location": { "query": string, "use_current": boolean },
  "facility_types": string[],
  "required_amenities": string[],
  "time_constraint": string | null,
  "price_constraint": { "max": number } | null
}

Respond with valid JSON only, no explanation.
```

### Travel Destination Extraction
```
Extract travel destination from this calendar event.

Event title: "${title}"
Event location: "${location}"
Event notes: "${notes}"
Event dates: ${startDate} to ${endDate}

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

If not travel, return:
{
  "is_travel": false,
  "confidence": 0.0-1.0
}

Respond with valid JSON only.
```

### Gym Recommendation Ranking
```
Rank these gyms for this user based on their preferences.

User preferences:
- Favorite amenities: ${amenities}
- Facility types: ${types}
- Price sensitivity: ${sensitivity}
- Past highly-rated gyms: ${history}

Available gyms:
${JSON.stringify(gyms)}

Return JSON array of gym IDs ordered by best match:
[
  { "id": string, "match_score": 0-100, "match_reason": string }
]
```

---

**Document Version History**

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Nov 25, 2025 | Initial complete blueprint |

---

*This document serves as the complete technical specification for Scout Fitness App MVP development. All architectural decisions, technology choices, and implementation details should reference this document as the source of truth.*
