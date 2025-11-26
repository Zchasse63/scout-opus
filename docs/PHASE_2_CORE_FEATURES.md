# Phase 2: Core Features

> Gym discovery, voice search, Google Places integration, and unified map/list view

---

## Document Info

| Field | Value |
|-------|-------|
| **Phase** | 2 of 8 |
| **Timeline** | Weeks 4-7 |
| **Status** | In Progress (40% Complete) |
| **Created** | November 25, 2025 |
| **Last Updated** | November 25, 2025 |
| **Last Audit** | November 25, 2025 |
| **Version** | 1.1.0 |

---

## Current Completion Status

| Week | Focus Area | Status | Completion |
|------|------------|--------|------------|
| Week 4 | Google Cloud Setup | ⚠️ Partial | 30% |
| Week 4 | Places API Edge Functions | ⚠️ Partial | 33% |
| Week 5 | Voice Recording UI | ❌ Not Started | 0% |
| Week 5 | Transcription Backend | ⚠️ Partial | 40% |
| Week 6 | AI Processing | ⚠️ Partial | 50% |
| Week 7 | Map & Discovery UI | ⚠️ Partial | 50% |

### Critical Remaining Items

1. **VoiceRecordingView.tsx** - Voice search UI component (BLOCKING)
2. **AudioWaveform.tsx** - Visual feedback component (BLOCKING)
3. **GymPreviewSheet.tsx** - Map marker selection sheet (BLOCKING)
4. **searchStore.ts** - Unified search state management (BLOCKING)
5. **voice-transcribe/** Edge Function - Whisper fallback (BLOCKING)
6. **places-details/** Edge Function - Full gym details
7. **places-photos/** Edge Function - Photo proxy
8. **GymMapPin.tsx** - Custom price markers

### What's Working

- ✅ `places-search/` Edge Function created
- ✅ `voice-process-query/` Edge Function created
- ✅ `useVoiceSearch` hook created
- ✅ `useGymSearch` hook created
- ✅ `GymMap.tsx` component created
- ✅ `GymCard.tsx` component created
- ✅ `mapStore.ts` created

---

## Phase Navigation

| Previous | Current | Next |
|----------|---------|------|
| [Phase 1: Foundation](PHASE_1_FOUNDATION.md) | **Phase 2: Core Features** | [Phase 3: Booking System](PHASE_3_BOOKING_SYSTEM.md) |

**All Phases:**
- [Phase 1: Foundation](PHASE_1_FOUNDATION.md)
- **Phase 2: Core Features** (Current)
- [Phase 3: Booking System](PHASE_3_BOOKING_SYSTEM.md)
- [Phase 4: Intelligence](PHASE_4_INTELLIGENCE.md)
- [Phase 5: Polish & Launch](PHASE_5_POLISH_LAUNCH.md)
- [Phase 6: Data Pipeline](PHASE_6_DATA_PIPELINE.md)
- [Phase 7: Partner Portal](PHASE_7_PARTNER_PORTAL.md)
- [Phase 8: Admin Portal](PHASE_8_ADMIN_PORTAL.md)

---

## Overview

Phase 2 implements the core user-facing features that make Scout unique: voice-powered search, intelligent gym discovery, and a seamless map/list browsing experience. This phase integrates Google Places API (New) for gym data while using Apple Maps for map rendering on iOS.

> **Note:** Android development is deferred to post-launch. All Android-specific items are marked accordingly.

### Goals

1. Google Places API integration for gym discovery
2. Voice search with Apple SpeechAnalyzer (iOS 26+) with Whisper fallback for older iOS
3. AI-powered intent parsing with Gemini 2.5 Flash
4. Unified map/list view with seamless toggle
5. Gym detail modal with AI summaries
6. Saved gyms functionality

### Prerequisites (from Phase 1)

- ✅ Expo project initialized and building
- ✅ Supabase connected with complete schema
- ✅ Authentication working
- ✅ 4-tab navigation functional
- ✅ SearchTray component with drag gestures
- ✅ Design system components

---

## Week 4: Google Places Integration

### 4.1 Google Cloud Setup

- [ ] Create Google Cloud project (or use existing)
- [ ] Enable Places API (New)
- [ ] Enable Maps SDK for iOS
- [ ] ~~Enable Maps SDK for Android~~ *(Deferred to Post-Launch)*
- [ ] Create API keys with appropriate restrictions:
  - [ ] iOS key restricted to bundle ID
  - [ ] ~~Android key restricted to package name + SHA-1~~ *(Deferred to Post-Launch)*
  - [ ] Server key for Edge Functions (IP restricted)
- [ ] Set up billing alerts at $100, $500, $1000 thresholds
- [ ] Store keys in environment variables

### 4.2 Places API Edge Function

- [ ] Create `supabase/functions/places-search/index.ts`
- [ ] Implement Text Search endpoint:
  ```typescript
  interface PlacesSearchRequest {
    textQuery: string;
    locationBias?: {
      circle: {
        center: { latitude: number; longitude: number };
        radius: number; // meters
      };
    };
    includedType?: string; // 'gym', 'yoga_studio', etc.
  }
  ```
- [ ] Configure field mask for cost optimization:
  - `places.id`
  - `places.displayName`
  - `places.formattedAddress`
  - `places.location`
  - `places.rating`
  - `places.userRatingCount`
  - `places.regularOpeningHours`
  - `places.generativeSummary` (AI summaries)
  - `places.photos`
- [ ] Implement error handling and rate limiting
- [ ] Add response caching (place_id: permanent, data: 30 days per ToS)

### 4.3 Place Details Edge Function

- [ ] Create `supabase/functions/places-details/index.ts`
- [ ] Fetch single place by ID with extended fields:
  - `reviews`
  - `websiteUri`
  - `nationalPhoneNumber`
  - `accessibilityOptions`
  - `parkingOptions`
- [ ] Cache results in Supabase for Scout enhancements

### 4.4 Photo Proxy Edge Function

- [ ] Create `supabase/functions/places-photos/index.ts`
- [ ] Proxy Google Places photo requests (required by ToS)
- [ ] Implement responsive sizing (maxWidthPx, maxHeightPx)
- [ ] Add CDN caching headers
- [ ] Handle photo attribution requirements

### 4.5 Data Sync Service

- [ ] Create service to sync Places data with Scout DB
- [ ] Match gyms by `google_place_id`
- [ ] Merge Scout proprietary data (verified amenities, partner status)
- [ ] Flag "unverified" vs "verified" gyms
- [ ] Schedule periodic refresh for cached data

### Week 4 Deliverable

✅ Basic gym search returning Google Places data with AI summaries

---

## Week 5: Voice Search - Recording & Transcription

### 5.1 Audio Recording Setup

- [ ] Install and configure `expo-av`
- [ ] Request microphone permissions with user-friendly prompt
- [ ] Configure recording settings:
  ```typescript
  const RECORDING_OPTIONS = {
    android: {
      extension: '.m4a',
      outputFormat: Audio.AndroidOutputFormat.MPEG_4,
      audioEncoder: Audio.AndroidAudioEncoder.AAC,
      sampleRate: 16000,
      numberOfChannels: 1,
      bitRate: 128000,
    },
    ios: {
      extension: '.m4a',
      outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
      audioQuality: Audio.IOSAudioQuality.HIGH,
      sampleRate: 16000,
      numberOfChannels: 1,
      bitRate: 128000,
    },
  };
  ```
- [ ] Implement start/stop recording controls
- [ ] Handle recording interruptions (phone calls, etc.)

### 5.2 VoiceRecordingView Component

- [ ] Create `components/search/VoiceRecordingView.tsx`
- [ ] Integrate into SearchTray's voice recording state
- [ ] Implement large pulsing mic button:
  ```typescript
  // Pulse animation with Reanimated
  const scale = withRepeat(
    withTiming(1.8, { duration: 1000 }),
    -1, // infinite
    false
  );
  ```
- [ ] Add two concentric pulse rings (staggered by 500ms)
- [ ] Display real-time transcription text
- [ ] Show volatile (interim) results in gray
- [ ] Show final results in white/black
- [ ] Add Cancel and Done buttons

### 5.3 Audio Waveform Visualization

- [ ] Create `components/search/AudioWaveform.tsx`
- [ ] 20-bar waveform visualization
- [ ] Bars respond to audio metering level
- [ ] Spring animation for smooth bar height changes
- [ ] Scout orange color (`#FF5A1F`)

### 5.4 Apple SpeechAnalyzer Integration (iOS)

- [ ] Install `@react-native-ai/apple` package
- [ ] Check iOS version support (iOS 26+)
- [ ] Implement transcription service:
  ```typescript
  import { SpeechTranscriber } from '@react-native-ai/apple';

  const transcriber = new SpeechTranscriber({
    locale: 'en-US',
    reportingOptions: ['volatileResults'],
    attributeOptions: ['audioTimeRange'],
  });
  ```
- [ ] Handle streaming transcription results
- [ ] Implement error handling for unsupported devices

### 5.5 Whisper API Fallback (Older iOS)

- [ ] Create `supabase/functions/voice-transcribe/index.ts`
- [ ] Implement OpenAI Whisper API integration
- [ ] Handle audio file upload (base64 or multipart)
- [ ] Return transcription with timing info
- [ ] Implement fallback detection for older iOS devices:
  ```typescript
  const useOnDeviceTranscription =
    Platform.OS === 'ios' &&
    parseInt(Platform.Version, 10) >= 26 &&
    await SpeechTranscriber.isSupported();
  ```

> **Note:** Android transcription will use Whisper when Android support is added post-launch.

### 5.6 Voice Activity Detection (VAD)

- [ ] Implement silence detection to auto-stop recording
- [ ] Configure silence threshold (e.g., 1.5 seconds)
- [ ] Show visual countdown when silence detected
- [ ] Allow user to continue speaking to reset timer

### 5.7 useVoiceSearch Hook

- [ ] Create `hooks/useVoiceSearch.ts`
- [ ] Manage recording state machine:
  - `idle` → `recording` → `processing` → `results` → `idle`
- [ ] Handle transcription method selection
- [ ] Expose: `startRecording`, `stopRecording`, `transcript`, `isRecording`
- [ ] Integrate with SearchTray state

### Week 5 Deliverable

✅ Voice-to-text working in SearchTray on iOS (with Whisper fallback)

---

## Week 6: Voice Search - AI Processing

### 6.1 Gemini Integration Setup

- [ ] Create Google AI Studio project
- [ ] Generate Gemini API key
- [ ] Store key in Supabase Edge Function secrets
- [ ] Install `@google/generative-ai` in Edge Functions

### 6.2 Intent Parsing Edge Function

- [ ] Create `supabase/functions/voice-process-query/index.ts`
- [ ] Implement Gemini 2.5 Flash integration
- [ ] Design intent parsing prompt:
  ```typescript
  const INTENT_PROMPT = `
  You are Scout's voice search assistant. Parse this fitness facility
  search query and extract structured parameters.

  User query: "${transcript}"
  User location: ${JSON.stringify(location)}

  Extract as JSON:
  {
    "intent": "search_gyms" | "get_details" | "book_pass" | "check_schedule",
    "location": { "query": string, "use_current": boolean },
    "facility_types": string[],
    "required_amenities": string[],
    "time_constraint": string | null,
    "price_constraint": { "max": number } | null
  }

  Respond with valid JSON only.
  `;
  ```
- [ ] Handle edge cases (unclear queries, corrections)
- [ ] Return structured `VoiceQueryResult`

### 6.3 Query-to-Search Translation

- [ ] Create service to convert parsed intent to Places API query
- [ ] Map user intent to `includedType`:
  - "gym" → `gym`
  - "yoga" → `yoga_studio`
  - "CrossFit" → `gym` (filter by name)
  - etc.
- [ ] Build location bias from user location or extracted location
- [ ] Merge with Scout DB filters (verified amenities)

### 6.4 Natural Language Response Generation

- [ ] Generate conversational response from search results:
  ```typescript
  const RESPONSE_PROMPT = `
  Generate a brief, friendly response summarizing these gym search results.

  User asked: "${originalQuery}"
  Results: ${JSON.stringify(results)}

  Keep it under 2 sentences. Be helpful and specific.
  Example: "I found 3 gyms near South Beach with saunas.
  The top match is Iron Temple Fitness, rated 4.8 stars."
  `;
  ```
- [ ] Display response in SearchTray results area
- [ ] Optional: Text-to-speech for audio response (P2)

### 6.5 Conversation Context (Multi-turn)

- [ ] Implement conversation memory (8-10 turns)
- [ ] Store context in searchStore:
  ```typescript
  interface ConversationTurn {
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
    parsedIntent?: VoiceQueryResult;
  }
  ```
- [ ] Pass conversation history to Gemini for follow-ups
- [ ] Handle refinements: "show me cheaper options", "closer to downtown"
- [ ] Clear context on new explicit search

### 6.6 Voice Query Logging

- [ ] Log voice queries to `voice_queries` table:
  - User ID
  - Transcript
  - Parsed intent (JSON)
  - Results count
  - Selected gym (if any)
  - Transcription method
  - Processing time
- [ ] Use for analytics and model improvement
- [ ] Respect privacy settings

### 6.7 End-to-End Voice Flow

- [ ] Connect all components:
  1. Mic tap → Recording starts
  2. Speech → Waveform + real-time transcription
  3. Silence → Auto-stop (or manual Done)
  4. Transcript → Gemini intent parsing
  5. Intent → Places API search
  6. Results → Display in list/map
  7. Response → Show AI summary
- [ ] Add loading states at each step
- [ ] Handle errors gracefully at each step

### Week 6 Deliverable

✅ End-to-end voice search working (speech to results)

---

## Week 7: Map & Discovery UI

### 7.1 Map Integration (react-native-maps)

- [ ] Install `react-native-maps`
- [ ] Configure for Apple Maps on iOS (default, no provider prop)
- [ ] ~~Configure for Google Maps on Android~~ *(Deferred to Post-Launch)*
- [ ] ~~Add Google Maps API key to `app.json` for Android~~ *(Deferred to Post-Launch)*
- [ ] Create `components/explore/MapView.tsx` wrapper
- [ ] Implement map region state management
- [ ] Handle location permissions

### 7.2 GymMapPin Component

- [ ] Create `components/explore/GymMapPin.tsx`
- [ ] Custom marker showing price: `$25`
- [ ] Default state: White background, dark text
- [ ] Selected state: Dark background, white text
- [ ] Handle marker press events

### 7.3 GymPreviewSheet Component

- [ ] Create `components/explore/GymPreviewSheet.tsx`
- [ ] Bottom sheet that appears when map pin is tapped
- [ ] Horizontal layout: Photo | Info | Actions
- [ ] Show: Name, rating, distance, price
- [ ] Amenity chips row below
- [ ] Swipe up gesture to expand to full details
- [ ] Swipe down to dismiss

### 7.4 Unified List/Map State

- [ ] Create `stores/mapStore.ts`:
  ```typescript
  interface MapStore {
    viewMode: 'list' | 'map';
    region: Region;
    selectedGymId: string | null;
    setViewMode: (mode: 'list' | 'map') => void;
    setSelectedGym: (id: string | null) => void;
  }
  ```
- [ ] Preserve state when toggling views:
  - Search query
  - Active filters
  - Search results
  - Scroll position (list) / region (map)
- [ ] Single map instance (don't remount on toggle)

### 7.5 ViewToggleFAB Animation

- [ ] Implement bounce animation on toggle:
  ```typescript
  scale.value = withSequence(
    withTiming(0.9, { duration: 80 }),
    withSpring(1.1, { damping: 8 }),
    withSpring(1, { damping: 10 })
  );
  ```
- [ ] Add flip animation for icon change
- [ ] Counter-rotate text to stay readable
- [ ] Haptic feedback on press

### 7.6 GymCard Component (List View)

- [ ] Create `components/explore/GymCard.tsx`
- [ ] Large hero image with gradient overlay
- [ ] Name, rating, review count, distance
- [ ] Amenity icons row (3-4 visible + "+X more")
- [ ] Price tag
- [ ] Save/favorite heart button
- [ ] Press animation (scale to 0.97)

### 7.7 GymDetailModal

- [ ] Create `app/gym/[id].tsx` modal route
- [ ] Full-screen scrollable modal
- [ ] Photo gallery (horizontal scroll)
- [ ] Hero section: Name, rating, distance
- [ ] AI Summary section (from Google Places)
- [ ] Amenities grid (verified vs unverified badges)
- [ ] Operating hours (expandable)
- [ ] Location map preview
- [ ] Reviews section (Scout + Google)
- [ ] Sticky booking CTA at bottom

### 7.8 Filter Integration

- [ ] Connect FilterCarousel to search results
- [ ] Implement real-time filtering
- [ ] Update both list and map results
- [ ] Show result count badge
- [ ] Clear filters option

### 7.9 Saved Gyms

- [ ] Implement save/unsave functionality
- [ ] Create `hooks/useSavedGyms.ts`
- [ ] Optimistic UI updates
- [ ] Sync with `saved_gyms` table
- [ ] Show saved status on GymCard and GymDetailModal
- [ ] Profile tab: Saved Gyms list (placeholder)

### 7.10 Search Results Management

- [ ] Create `stores/searchStore.ts`:
  ```typescript
  interface SearchStore {
    query: string;
    filters: string[];
    results: Gym[];
    isLoading: boolean;
    error: string | null;
    setQuery: (query: string) => void;
    toggleFilter: (filterId: string) => void;
    search: () => Promise<void>;
  }
  ```
- [ ] Implement TanStack Query for caching
- [ ] Handle pagination / infinite scroll (list view)
- [ ] Cluster markers for dense areas (map view)

### Week 7 Deliverable

✅ Complete discovery experience with unified list/map toggle and voice search

---

## Technical Specifications

### New Components (Phase 2)

```
components/
├── search/
│   ├── VoiceRecordingView.tsx    # Recording UI in SearchTray
│   └── AudioWaveform.tsx         # Waveform visualization
├── explore/
│   ├── MapView.tsx               # Map wrapper component
│   ├── GymCard.tsx               # List view card
│   ├── GymMapPin.tsx             # Custom map marker
│   └── GymPreviewSheet.tsx       # Map pin selection sheet
└── gym/
    └── GymDetailModal.tsx        # Full gym details
```

### New Edge Functions

```
supabase/functions/
├── places-search/                # Google Places text search
├── places-details/               # Google Places details
├── places-photos/                # Photo proxy
├── voice-transcribe/             # Whisper API fallback
└── voice-process-query/          # Gemini intent parsing
```

### New Stores

```
stores/
├── searchStore.ts                # Search query, filters, results
└── mapStore.ts                   # Map view state
```

### New Hooks

```
hooks/
├── useVoiceSearch.ts             # Voice recording + transcription
├── useGymSearch.ts               # Search query execution
├── useMapView.ts                 # Map state management
└── useSavedGyms.ts               # Saved gyms management
```

---

## Acceptance Criteria

### Must Have (P0)
- [ ] Voice search completes within 3 seconds total
- [ ] Search results display gyms with photos, ratings, AI summaries
- [ ] Map shows gym pins with price labels
- [ ] List/map toggle preserves search context
- [ ] GymDetailModal shows all relevant information
- [ ] Filter chips update results in real-time

### Should Have (P1)
- [ ] Voice waveform animates smoothly (60fps)
- [ ] Conversation context works for follow-up queries
- [ ] Map clustering for dense areas
- [ ] Saved gyms sync across sessions
- [ ] Error states are user-friendly

### Nice to Have (P2)
- [ ] Text-to-speech for AI responses
- [ ] Offline voice transcription cache
- [ ] Photo gallery with pinch-to-zoom

---

## API Cost Estimates (Week 7)

| API | Estimated Usage | Cost |
|-----|-----------------|------|
| Google Places Text Search | 500 searches | ~$8 |
| Google Places Details | 200 requests | ~$3 |
| Google Places Photos | 1000 photos | ~$7 |
| Gemini 2.5 Flash | 100K tokens | ~$15 |
| Whisper API | 50 minutes | ~$0.30 |
| **Total** | | **~$33** |

---

## Completion Summary

> *To be filled in upon phase completion*

### Completion Date
*Not yet completed*

### Final Status
*Pending*

### Deliverables Completed
- [ ] Google Places integration
- [ ] Voice search (iOS)
- [ ] AI intent parsing
- [ ] Map/list view with toggle
- [ ] Gym detail modal
- [ ] Saved gyms

### Metrics
| Metric | Target | Actual |
|--------|--------|--------|
| Voice search latency | <3s | — |
| Map load time | <1s | — |
| Search results accuracy | >90% | — |

---

## Carryover Items

> *Items deferred from this phase*

| Item | Moved To | Reason |
|------|----------|--------|
| Enable Maps SDK for Android | Post-Launch | iOS-first approach |
| Android API key configuration | Post-Launch | iOS-first approach |
| Google Maps on Android | Post-Launch | iOS-first approach |
| Android voice transcription | Post-Launch | iOS-first approach |

---

## Change Log

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| November 25, 2025 | 1.0.0 | Initial phase document created | — |

---

*Reference: [Complete Technical Blueprint](../Scout_Fitness_App_Complete_Technical_Blueprint_November_2025-2.md) - Sections 4, 5, 7, 8 (F1, F2)*
