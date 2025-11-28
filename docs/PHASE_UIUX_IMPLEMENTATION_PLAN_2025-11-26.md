# Scout App UI/UX Implementation Plan
## Complete Redesign Roadmap to Airbnb-Quality Standards

**Document Version:** 1.0  
**Created:** 2025-11-26  
**Status:** Ready for Implementation  
**Audit Source:** `docs/UI UX Audit.md` framework evaluation

---

## EXECUTIVE SUMMARY

### Scope Overview

This implementation plan addresses **ALL** findings from the comprehensive UI/UX audit of the Scout fitness marketplace app. The plan transforms Scout from a functional MVP (current score: 5/10) to an Airbnb-quality experience (target score: 9/10).

| Metric | Current | Target | Gap |
|--------|---------|--------|-----|
| Overall Design Maturity | 5/10 | 9/10 | +4 |
| Airbnb-Quality Score | 4/10 | 9/10 | +5 |
| Booking Conversion Potential | 6/10 | 9/10 | +3 |
| Trust & Credibility | 4/10 | 9/10 | +5 |
| Discovery Experience | 5/10 | 9/10 | +4 |

### Total Implementation Scope

- **5 Phases** over 10-12 weeks
- **23 Audit Areas** addressed
- **~150 Individual Tasks**
- **~40 New Components** to create
- **~25 Existing Components** to enhance
- **1 Core Differentiator** (Voice/AI Search) to preserve and enhance

### Voice/AI Search - Core Differentiator Strategy

The existing `SearchTray` component with voice/AI capabilities is Scout's **primary competitive advantage**. This plan:

1. **PRESERVES** the floating overlay paradigm
2. **ENHANCES** voice interaction with new UI patterns
3. **INTEGRATES** structured search as a complement, not replacement
4. **EXTENDS** voice commands to work with new features (filters, map, booking)

---

## PHASE OVERVIEW

| Phase | Name | Duration | Focus |
|-------|------|----------|-------|
| 1 | Foundation & Infrastructure | 2 weeks | Design system, components, dark mode setup |
| 2 | Core Discovery Experience | 3 weeks | Search, filters, map, listings |
| 3 | Detail & Booking Flow | 2.5 weeks | Gym detail, gallery, payment, reviews |
| 4 | User Features | 2 weeks | Profile, favorites, passes, trips |
| 5 | Polish & Delight | 2.5 weeks | Animations, micro-interactions, accessibility |

---

## VOICE/AI SEARCH INTEGRATION STRATEGY

### Current State Analysis

The `SearchTray` component (`components/search/SearchTray.tsx`) provides:
- **Collapsed state:** Compact search bar with location + mic button
- **Expanded state:** Full input with filter carousel
- **Voice state:** Pulsing mic, real-time transcript, done/stop buttons

### Evolution Strategy: Hybrid Approach

```
┌─────────────────────────────────────────────────────────────┐
│                    SCOUT SEARCH PARADIGM                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   FLOATING   │    │  STRUCTURED  │    │    VOICE     │  │
│  │   OVERLAY    │ ←→ │    MODAL     │ ←→ │   COMMAND    │  │
│  │  (Primary)   │    │ (On Demand)  │    │  (Enhanced)  │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         ↓                   ↓                   ↓           │
│  Quick searches      Complex queries      Natural language  │
│  Recent/suggested    Where+What+When      "Find me a gym    │
│  Filter chips        Price range          with pool near    │
│                      Distance slider      downtown open now"│
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Integration Points with New Features

| New Feature | Voice Integration | Notes |
|-------------|-------------------|-------|
| Photo Carousel | Voice: "Show more photos" | Navigate gallery via voice |
| Map Price Bubbles | Voice: "Show gyms under $20" | Filter map markers |
| Filter Bottom Sheet | Voice: "Filter by yoga studios" | Open and apply filters |
| Booking Flow | Voice: "Book for tomorrow" | Date selection via voice |
| Reviews | Voice: "Read recent reviews" | Audio playback of reviews |

---

## PHASE 1: FOUNDATION & INFRASTRUCTURE
### Duration: 2 weeks | Priority: Critical

**Objective:** Establish the design system foundation, create missing core components, and set up dark mode infrastructure before any feature work.

### 1.1 Design System Enhancements

#### 1.1.1 Icon System Migration
**Current:** Emoji icons (❤️, 🏋️, ✕, 🔗) mixed with Lucide  
**Target:** Consistent Lucide React Native icons throughout

**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 1.1.1a | Replace heart emoji with Lucide Heart icon | `components/explore/GymCard.tsx`, `app/gym/[id].tsx` | Animated heart icon with fill state |
| 1.1.1b | Replace close emoji (✕) with Lucide X icon | `app/gym/[id].tsx`, `app/booking/*.tsx` | Consistent close buttons |
| 1.1.1c | Replace share emoji (🔗) with Lucide Share icon | `app/gym/[id].tsx` | Native share icon |
| 1.1.1d | Replace filter emojis with Lucide icons | `constants/filters.ts`, `FilterCarousel.tsx` | Icon-based filter chips |
| 1.1.1e | Replace empty state emojis with Lucide icons | `components/ui/EmptyState.tsx` | Professional empty states |
| 1.1.1f | Create icon mapping constants file | `constants/icons.ts` (new) | Centralized icon definitions |

#### 1.1.2 Animation System Setup
**Current:** Basic timing values, no spring physics
**Target:** Comprehensive animation library with reanimated presets

**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 1.1.2a | Add spring configuration presets | `constants/animations.ts` | Spring configs for different use cases |
| 1.1.2b | Add celebration animation timing | `constants/animations.ts` | 1000ms celebration duration |
| 1.1.2c | Add micro-feedback timing | `constants/animations.ts` | 100ms haptic timing |
| 1.1.2d | Create shared animation hooks | `hooks/useAnimatedValue.ts` (new) | Reusable animation hooks |
| 1.1.2e | Add gesture animation configs | `constants/animations.ts` | Swipe, pinch, pan configs |

#### 1.1.3 Typography Enhancements
**Current:** System font only, no tabular numbers
**Target:** Custom font with tabular numbers for prices

**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 1.1.3a | Add tabular number font variant | `constants/typography.ts` | Aligned price displays |
| 1.1.3b | Add letter spacing for labels | `constants/typography.ts` | Improved label readability |
| 1.1.3c | Create price text component | `components/ui/PriceText.tsx` (new) | Consistent price formatting |

#### 1.1.4 Spacing & Layout Refinements
**Current:** 4pt grid exists but inconsistent usage
**Target:** Strict adherence to spacing scale

**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 1.1.4a | Audit and fix inline margin/padding | All component files | Consistent spacing usage |
| 1.1.4b | Add card padding constants | `constants/spacing.ts` | Standardized card interiors |
| 1.1.4c | Add section spacing constants | `constants/spacing.ts` | Consistent section gaps |

---

### 1.2 Dark Mode Infrastructure

#### 1.2.1 Theme System Implementation
**Current:** `themeStore.ts` exists but not connected
**Target:** Full dark mode with system detection

**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 1.2.1a | Create theme context provider | `contexts/ThemeContext.tsx` (new) | App-wide theme access |
| 1.2.1b | Add system theme detection | `hooks/useSystemTheme.ts` (new) | Auto dark mode |
| 1.2.1c | Create themed color hook | `hooks/useThemedColors.ts` (new) | Dynamic color access |
| 1.2.1d | Define dark mode color palette | `constants/colors.ts` | Complete dark palette |
| 1.2.1e | Create ThemeProvider wrapper | `app/_layout.tsx` | Theme at app root |

#### 1.2.2 Component Theme Awareness
**Current:** Hardcoded `colors.white` backgrounds
**Target:** All components respond to theme

**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 1.2.2a | Create themed StyleSheet factory | `utils/themedStyles.ts` (new) | Dynamic stylesheet generation |
| 1.2.2b | Update SafeAreaView backgrounds | All screen files | Theme-aware containers |
| 1.2.2c | Update card backgrounds | All card components | Theme-aware cards |
| 1.2.2d | Update text colors | All components | Theme-aware text |
| 1.2.2e | Create dark map style JSON | `constants/mapStyles.ts` (new) | Dark mode map |

---

### 1.3 Core Component Library

#### 1.3.1 Skeleton Loading Components
**Current:** `ActivityIndicator` spinners only
**Target:** Skeleton screens for perceived performance

**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 1.3.1a | Create base Skeleton component | `components/ui/Skeleton.tsx` (new) | Animated skeleton bone |
| 1.3.1b | Create SkeletonCard component | `components/ui/SkeletonCard.tsx` (new) | Gym card skeleton |
| 1.3.1c | Create SkeletonList component | `components/ui/SkeletonList.tsx` (new) | List of skeleton cards |
| 1.3.1d | Create SkeletonDetail component | `components/ui/SkeletonDetail.tsx` (new) | Gym detail skeleton |
| 1.3.1e | Replace ActivityIndicator in explore | `app/(tabs)/index.tsx` | Skeleton loading state |
| 1.3.1f | Replace ActivityIndicator in passes | `app/(tabs)/passes.tsx` | Skeleton loading state |
| 1.3.1g | Replace ActivityIndicator in trips | `app/(tabs)/trips.tsx` | Skeleton loading state |

#### 1.3.2 Animated Components
**Current:** No animated feedback components
**Target:** Delightful micro-interaction components

**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 1.3.2a | Create AnimatedHeart component | `components/ui/AnimatedHeart.tsx` (new) | Pop animation on save |
| 1.3.2b | Create AnimatedButton component | `components/ui/AnimatedButton.tsx` (new) | Scale on press |
| 1.3.2c | Create ConfettiCelebration component | `components/ui/Confetti.tsx` (new) | Booking success celebration |
| 1.3.2d | Create PulsingDot component | `components/ui/PulsingDot.tsx` (new) | Live indicator |
| 1.3.2e | Create AnimatedCheckmark component | `components/ui/AnimatedCheckmark.tsx` (new) | Success confirmation |

#### 1.3.3 Trust & Badge Components
**Current:** No verification or trust indicators
**Target:** Complete trust signal system

**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 1.3.3a | Create VerifiedBadge component | `components/ui/VerifiedBadge.tsx` (new) | Gym verification indicator |
| 1.3.3b | Create PopularBadge component | `components/ui/PopularBadge.tsx` (new) | "Popular" tag |
| 1.3.3c | Create NewBadge component | `components/ui/NewBadge.tsx` (new) | "New" listing tag |
| 1.3.3d | Create UrgencyIndicator component | `components/ui/UrgencyIndicator.tsx` (new) | "X people viewing" |
| 1.3.3e | Create ResponseRate component | `components/ui/ResponseRate.tsx` (new) | Gym response time |

---

### 1.4 Haptic Feedback System

**Current:** No haptic feedback
**Target:** Tactile feedback on key interactions

**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 1.4a | Install expo-haptics | `package.json` | Haptic capability |
| 1.4b | Create haptic utility functions | `utils/haptics.ts` (new) | Light, medium, heavy, success, error |
| 1.4c | Add haptics to heart toggle | `components/explore/GymCard.tsx` | Tactile save feedback |
| 1.4d | Add haptics to booking confirmation | `app/booking/confirmation.tsx` | Success haptic |
| 1.4e | Add haptics to filter selection | `components/search/FilterCarousel.tsx` | Selection feedback |
| 1.4f | Add haptics to voice activation | `components/search/SearchTray.tsx` | Voice mode feedback |

---

### Phase 1 Voice/AI Integration

| Enhancement | Implementation | File(s) |
|-------------|----------------|---------|
| Haptic feedback on voice start/stop | Add haptic trigger | `hooks/useVoiceSearch.ts` |
| Voice button animation | Replace static mic with animated | `SearchTray.tsx` |
| Theme-aware voice overlay | Dark mode voice UI | `SearchTray.tsx` |

---

### Phase 1 Deliverables Checklist

- [ ] All emoji icons replaced with Lucide icons
- [ ] Animation constants and hooks created
- [ ] Dark mode infrastructure in place
- [ ] Theme toggle working (manual + system)
- [ ] Skeleton components created
- [ ] Animated feedback components created
- [ ] Trust badge components created
- [ ] Haptic feedback system implemented
- [ ] Voice search enhanced with haptics and animations

---

## PHASE 2: CORE DISCOVERY EXPERIENCE
### Duration: 3 weeks | Priority: Critical

**Objective:** Transform the search, filter, map, and listing experience to Airbnb quality while preserving and enhancing voice/AI search.

### 2.1 Search Experience Overhaul

#### 2.1.1 Enhanced SearchTray (Preserve Core Differentiator)
**Current:** Basic TextInput with voice toggle
**Target:** Rich search with suggestions, history, and structured option

**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 2.1.1a | Add search suggestions dropdown | `components/search/SearchSuggestions.tsx` (new) | Autocomplete suggestions |
| 2.1.1b | Add recent searches storage | `stores/searchHistoryStore.ts` (new) | Persist search history |
| 2.1.1c | Add recent searches display | `SearchTray.tsx` | Show recent on focus |
| 2.1.1d | Add "Popular in area" suggestions | `SearchTray.tsx` | Location-based suggestions |
| 2.1.1e | Add time-based suggestions | `SearchTray.tsx` | "Open now", "24-hour" chips |
| 2.1.1f | Enhance collapsed state with location name | `SearchTray.tsx` | Show current location |
| 2.1.1g | Add clear search button | `SearchTray.tsx` | X button when text present |

#### 2.1.2 Structured Search Modal (Complement to Voice)
**Current:** None
**Target:** Airbnb-style Where/What/When modal for complex queries

**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 2.1.2a | Create StructuredSearchModal | `components/search/StructuredSearchModal.tsx` (new) | Full-screen search modal |
| 2.1.2b | Create LocationPicker section | `components/search/LocationPicker.tsx` (new) | Where are you going? |
| 2.1.2c | Create GymTypePicker section | `components/search/GymTypePicker.tsx` (new) | What type of gym? |
| 2.1.2d | Create DatePicker section | `components/search/SearchDatePicker.tsx` (new) | When do you need access? |
| 2.1.2e | Add "More filters" expansion | `StructuredSearchModal.tsx` | Reveal advanced options |
| 2.1.2f | Add modal trigger from SearchTray | `SearchTray.tsx` | Icon to open structured search |
| 2.1.2g | Integrate voice results with structured | `SearchTray.tsx` | Voice can populate structured |

#### 2.1.3 Voice Search Enhancements
**Current:** Basic transcript display
**Target:** Rich voice interaction with visual feedback

**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 2.1.3a | Add waveform visualization | `components/voice/AudioWaveform.tsx` | Real-time audio visualization |
| 2.1.3b | Add voice command hints | `SearchTray.tsx` | "Try saying..." prompts |
| 2.1.3c | Add voice confirmation feedback | `SearchTray.tsx` | Visual confirm of understood query |
| 2.1.3d | Add voice error recovery | `SearchTray.tsx` | "I didn't catch that" with retry |
| 2.1.3e | Add voice-to-filter mapping | `hooks/useVoiceSearch.ts` | Parse voice into filter selections |
| 2.1.3f | Add voice command glossary | `components/voice/VoiceHints.tsx` (new) | Learnable voice commands |

---

### 2.2 Filter System Enhancement

#### 2.2.1 Filter Carousel Improvements
**Current:** Emoji-based horizontal chips
**Target:** Icon-based chips with count preview

**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 2.2.1a | Replace emoji with Lucide icons | `FilterCarousel.tsx`, `constants/filters.ts` | Professional filter icons |
| 2.2.1b | Add result count preview | `FilterCarousel.tsx` | "(24)" next to filter label |
| 2.2.1c | Add "Clear All" button | `FilterCarousel.tsx` | Reset all filters |
| 2.2.1d | Add filter count badge | `FilterCarousel.tsx` | Badge showing active count |
| 2.2.1e | Real-time result update | `app/(tabs)/index.tsx` | Instant filter response |

#### 2.2.2 Advanced Filter Bottom Sheet
**Current:** None
**Target:** Full filter panel with sliders and toggles

**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 2.2.2a | Create FilterBottomSheet component | `components/search/FilterBottomSheet.tsx` (new) | Draggable filter panel |
| 2.2.2b | Add price range slider | `components/search/PriceRangeSlider.tsx` (new) | $10-$100 range |
| 2.2.2c | Add distance filter | `components/search/DistanceFilter.tsx` (new) | Miles/km radius |
| 2.2.2d | Add rating threshold | `components/search/RatingFilter.tsx` (new) | Minimum stars |
| 2.2.2e | Add hours filter | `components/search/HoursFilter.tsx` (new) | Open now, 24-hour, specific times |
| 2.2.2f | Add amenities multi-select | `components/search/AmenitiesFilter.tsx` (new) | Detailed amenity selection |
| 2.2.2g | Add "Show X results" button | `FilterBottomSheet.tsx` | Live result count |
| 2.2.2h | Add "More Filters" trigger | `FilterCarousel.tsx` | Button to open sheet |

#### 2.2.3 Voice-to-Filter Integration
**Current:** Voice search separate from filters
**Target:** Voice commands that apply filters

**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 2.2.3a | Create voice filter parser | `utils/voiceFilterParser.ts` (new) | NLP to filter mapping |
| 2.2.3b | Handle "under $X" commands | `voiceFilterParser.ts` | Price filter from voice |
| 2.2.3c | Handle "within X miles" commands | `voiceFilterParser.ts` | Distance filter from voice |
| 2.2.3d | Handle amenity commands | `voiceFilterParser.ts` | "with pool", "with sauna" |
| 2.2.3e | Handle time commands | `voiceFilterParser.ts` | "open now", "open until 10pm" |

---

### 2.3 Map Experience Transformation

#### 2.3.1 Custom Map Markers
**Current:** Basic pinColor markers
**Target:** Airbnb-style price bubble markers

**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 2.3.1a | Create PriceBubbleMarker component | `components/explore/PriceBubbleMarker.tsx` (new) | Custom price markers |
| 2.3.1b | Add selected state styling | `PriceBubbleMarker.tsx` | Enlarged/highlighted on select |
| 2.3.1c | Add rating mini-badge | `PriceBubbleMarker.tsx` | Small star rating on marker |
| 2.3.1d | Integrate with GymMap | `components/explore/GymMap.tsx` | Replace Marker with custom |
| 2.3.1e | Add marker clustering | `GymMap.tsx` | Cluster at zoom levels |
| 2.3.1f | Add cluster count display | `components/explore/ClusterMarker.tsx` (new) | "12 gyms" cluster bubble |

#### 2.3.2 Map Interaction Enhancements
**Current:** Basic tap to select
**Target:** Rich map interactions

**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 2.3.2a | Add "Search this area" button | `GymMap.tsx` | Button appears on pan |
| 2.3.2b | Add preview card on marker tap | `components/explore/MapPreviewCard.tsx` (new) | Slide-up mini card |
| 2.3.2c | Add map/list sync | `app/(tabs)/index.tsx` | Scroll list highlights marker |
| 2.3.2d | Add user location centering | `GymMap.tsx` | "Center on me" button |
| 2.3.2e | Add dark mode map style | `GymMap.tsx` | Theme-aware map |
| 2.3.2f | Remove hardcoded Miami default | `GymMap.tsx` | Use device location |

#### 2.3.3 Map Voice Integration
**Current:** None
**Target:** Voice commands for map interaction

**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 2.3.3a | Add "zoom in/out" voice command | `hooks/useVoiceSearch.ts` | Voice map zoom |
| 2.3.3b | Add "show gyms near [location]" | `hooks/useVoiceSearch.ts` | Voice pan/search |
| 2.3.3c | Add "show only gyms under $X" | `hooks/useVoiceSearch.ts` | Voice filter markers |

---

### 2.4 Listing Cards (GymCard) Redesign

#### 2.4.1 Photo Carousel Implementation
**Current:** Single static image
**Target:** Swipeable photo carousel

**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 2.4.1a | Create PhotoCarousel component | `components/ui/PhotoCarousel.tsx` (new) | Swipeable image carousel |
| 2.4.1b | Add pagination dots | `PhotoCarousel.tsx` | Dot indicators |
| 2.4.1c | Add swipe gesture handling | `PhotoCarousel.tsx` | Smooth swipe transitions |
| 2.4.1d | Integrate with GymCard | `components/explore/GymCard.tsx` | Replace static Image |
| 2.4.1e | Add lazy image loading | `PhotoCarousel.tsx` | Load images on scroll |
| 2.4.1f | Add image skeleton | `PhotoCarousel.tsx` | Skeleton while loading |

#### 2.4.2 Card Content Enhancement
**Current:** Basic info display
**Target:** Rich, trust-building content

**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 2.4.2a | Add verified badge to cards | `GymCard.tsx` | Trust indicator |
| 2.4.2b | Add "Popular" / "New" badges | `GymCard.tsx` | Highlight badges |
| 2.4.2c | Add distance indicator | `GymCard.tsx` | "0.3 mi away" |
| 2.4.2d | Add "X people viewing" | `GymCard.tsx` | Urgency indicator |
| 2.4.2e | Replace amenity emojis with icons | `GymCard.tsx` | Professional amenity row |
| 2.4.2f | Add "Great Value" badge | `GymCard.tsx` | Price comparison badge |
| 2.4.2g | Reduce dark overlay intensity | `GymCard.tsx` | Better image visibility |

#### 2.4.3 Card Interaction Polish
**Current:** Basic Pressable with opacity
**Target:** Delightful press interactions

**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 2.4.3a | Add scale animation on press | `GymCard.tsx` | Subtle scale down |
| 2.4.3b | Add heart pop animation | `GymCard.tsx` | Animated save |
| 2.4.3c | Add haptic on save | `GymCard.tsx` | Tactile feedback |
| 2.4.3d | Add long-press quick actions | `GymCard.tsx` | Share, compare options |

---

### 2.5 First Impressions & Home Screen

#### 2.5.1 Hero Section Addition
**Current:** Straight to search results
**Target:** Inspiring hero with value proposition

**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 2.5.1a | Create HeroSection component | `components/explore/HeroSection.tsx` (new) | Aspirational hero |
| 2.5.1b | Add lifestyle imagery | `HeroSection.tsx` | Rotating hero images |
| 2.5.1c | Add tagline/value prop | `HeroSection.tsx` | "Your gym, anywhere" |
| 2.5.1d | Add quick-book for returning users | `HeroSection.tsx` | Resume last search |
| 2.5.1e | Integrate hero into explore | `app/(tabs)/index.tsx` | Collapsible hero |

#### 2.5.2 Curated Collections
**Current:** None
**Target:** Featured and personalized collections

**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 2.5.2a | Create CollectionRow component | `components/explore/CollectionRow.tsx` (new) | Horizontal gym row |
| 2.5.2b | Add "Featured Gyms" section | `app/(tabs)/index.tsx` | Editor picks |
| 2.5.2c | Add "Popular This Week" section | `app/(tabs)/index.tsx` | Trending gyms |
| 2.5.2d | Add "Near You" section | `app/(tabs)/index.tsx` | Location-based |
| 2.5.2e | Add "Great Value" section | `app/(tabs)/index.tsx` | Budget picks |

---

### Phase 2 Voice/AI Integration Summary

| Feature | Voice Command | Implementation |
|---------|---------------|----------------|
| Search suggestions | "Search for [query]" | Auto-populate input |
| Structured search | Voice fills Where/What/When | Modal population |
| Filter application | "Only show yoga studios" | Filter toggle |
| Price filter | "Under $25" | Slider adjustment |
| Map navigation | "Show gyms near downtown" | Map pan + search |
| Time filter | "Open after 6pm" | Hours filter |

---

### Phase 2 Deliverables Checklist

- [ ] SearchTray enhanced with suggestions and history
- [ ] Structured search modal created
- [ ] Voice search has visual feedback and hints
- [ ] Filter carousel uses icons, has clear all
- [ ] Filter bottom sheet with sliders
- [ ] Voice commands apply filters
- [ ] Custom price bubble map markers
- [ ] Map has "Search this area" button
- [ ] Preview cards on marker tap
- [ ] GymCard has photo carousel
- [ ] Cards show badges and distance
- [ ] Hero section on home screen
- [ ] Curated collection rows

---

## PHASE 3: DETAIL & BOOKING FLOW
### Duration: 2.5 weeks | Priority: High

**Objective:** Transform the gym detail page into an immersive experience and streamline booking to maximize conversion.

### 3.1 Gym Detail Page Redesign

#### 3.1.1 Hero & Gallery Transformation
**Current:** Fixed 300px image container
**Target:** Full-bleed parallax hero with immersive gallery

**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 3.1.1a | Create parallax hero | `app/gym/[id].tsx` | Scroll-responsive hero |
| 3.1.1b | Make hero full-width bleed | `app/gym/[id].tsx` | Edge-to-edge imagery |
| 3.1.1c | Add gradient overlay (bottom only) | `app/gym/[id].tsx` | Readable title on image |
| 3.1.1d | Create FullScreenGallery component | `components/gym/FullScreenGallery.tsx` (new) | Immersive photo viewer |
| 3.1.1e | Add pinch-to-zoom | `FullScreenGallery.tsx` | Zoom on photos |
| 3.1.1f | Add swipe navigation | `FullScreenGallery.tsx` | Swipe between photos |
| 3.1.1g | Add photo categories | `FullScreenGallery.tsx` | Equipment, Facilities tabs |
| 3.1.1h | Add photo count display | `app/gym/[id].tsx` | "View all 12 photos" |
| 3.1.1i | Add grid view option | `FullScreenGallery.tsx` | Grid vs carousel toggle |

#### 3.1.2 Content Sections Enhancement
**Current:** Basic info sections
**Target:** Rich, scannable content

**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 3.1.2a | Add "Highlights" section | `app/gym/[id].tsx` | Top 3-4 selling points |
| 3.1.2b | Add "What's Included" section | `app/gym/[id].tsx` | Pass benefits breakdown |
| 3.1.2c | Add busy times graph | `components/gym/BusyTimesGraph.tsx` (new) | Hour-by-hour popularity |
| 3.1.2d | Improve hours display | `app/gym/[id].tsx` | Today highlighted, expandable |
| 3.1.2e | Add amenity categories | `app/gym/[id].tsx` | Grouped amenities |
| 3.1.2f | Add "Good to Know" section | `app/gym/[id].tsx` | Policies, rules |
| 3.1.2g | Replace emoji icons in sections | `app/gym/[id].tsx` | Lucide icons |

#### 3.1.3 Trust & Social Proof
**Current:** No verification or social proof
**Target:** Complete trust system

**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 3.1.3a | Add verified badge to header | `app/gym/[id].tsx` | "Verified Gym" badge |
| 3.1.3b | Add "X people booked today" | `app/gym/[id].tsx` | Social proof indicator |
| 3.1.3c | Add gym owner profile section | `components/gym/GymOwnerProfile.tsx` (new) | Owner photo, bio |
| 3.1.3d | Add response rate/time | `GymOwnerProfile.tsx` | "Usually responds in 1 hour" |
| 3.1.3e | Add "Last updated" timestamp | `app/gym/[id].tsx` | Freshness indicator |
| 3.1.3f | Add similar gyms carousel | `components/gym/SimilarGyms.tsx` (new) | Related listings |

#### 3.1.4 Sticky Booking Bar Enhancement
**Current:** Basic "Book Pass" button
**Target:** Rich booking CTA with price

**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 3.1.4a | Show price on CTA button | `app/gym/[id].tsx` | "Book · From $15/day" |
| 3.1.4b | Add availability indicator | `app/gym/[id].tsx` | "Available today" |
| 3.1.4c | Add "X passes left" urgency | `app/gym/[id].tsx` | Limited availability |
| 3.1.4d | Animate bar on scroll | `app/gym/[id].tsx` | Appear/hide on scroll |

---

### 3.2 Reviews System Implementation

**Current:** Rating displayed but no reviews
**Target:** Complete reviews experience

#### 3.2.1 Reviews Data & Display
**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 3.2.1a | Create reviews API hook | `hooks/useGymReviews.ts` (new) | Fetch reviews |
| 3.2.1b | Create ReviewCard component | `components/gym/ReviewCard.tsx` (new) | Individual review display |
| 3.2.1c | Create ReviewsList component | `components/gym/ReviewsList.tsx` (new) | Paginated reviews |
| 3.2.1d | Add reviews section to detail | `app/gym/[id].tsx` | Reviews on detail page |
| 3.2.1e | Add "See all reviews" button | `app/gym/[id].tsx` | Link to full list |

#### 3.2.2 Rating Breakdown
**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 3.2.2a | Create RatingBreakdown component | `components/gym/RatingBreakdown.tsx` (new) | Category ratings |
| 3.2.2b | Add cleanliness rating | `RatingBreakdown.tsx` | Cleanliness score |
| 3.2.2c | Add equipment rating | `RatingBreakdown.tsx` | Equipment quality score |
| 3.2.2d | Add value rating | `RatingBreakdown.tsx` | Value for money score |
| 3.2.2e | Add location rating | `RatingBreakdown.tsx` | Location convenience score |
| 3.2.2f | Add staff rating | `RatingBreakdown.tsx` | Staff friendliness score |

#### 3.2.3 Review Features
**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 3.2.3a | Add review photos | `ReviewCard.tsx` | Photos in reviews |
| 3.2.3b | Add review filtering | `ReviewsList.tsx` | Sort by recent, rating |
| 3.2.3c | Add review search | `ReviewsList.tsx` | Search review text |
| 3.2.3d | Add gym owner responses | `ReviewCard.tsx` | Owner reply display |
| 3.2.3e | Add reviewer credibility | `ReviewCard.tsx` | "5 reviews, 2 years" |
| 3.2.3f | Add AI review summary | `components/gym/ReviewSummary.tsx` (new) | AI-generated summary |
| 3.2.3g | Add voice: "Read reviews" | `hooks/useVoiceSearch.ts` | Audio review playback |

---

### 3.3 Booking Flow Optimization

#### 3.3.1 Pass Selection Enhancement
**Current:** Basic pass type cards
**Target:** Comparison-friendly selection

**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 3.3.1a | Redesign pass cards | `app/booking/[id].tsx` | Clearer comparison |
| 3.3.1b | Add "Best Value" badge | `app/booking/[id].tsx` | Highlight savings |
| 3.3.1c | Add savings calculation | `app/booking/[id].tsx` | "Save $X with week pass" |
| 3.3.1d | Add pass feature comparison | `app/booking/[id].tsx` | What's included per tier |

#### 3.3.2 Date Selection Enhancement
**Current:** Prev/next arrow navigation
**Target:** Full calendar picker

**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 3.3.2a | Create CalendarPicker component | `components/booking/CalendarPicker.tsx` (new) | Full month calendar |
| 3.3.2b | Add date range for multi-day | `CalendarPicker.tsx` | Week/month pass ranges |
| 3.3.2c | Add availability indicators | `CalendarPicker.tsx` | Available/limited/full |
| 3.3.2d | Add voice: "Book for tomorrow" | `hooks/useVoiceSearch.ts` | Voice date selection |
| 3.3.2e | Replace prev/next with calendar | `app/booking/[id].tsx` | Integrate calendar |

#### 3.3.3 Payment Integration
**Current:** Placeholder TextInput
**Target:** Native payment sheet

**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 3.3.3a | Integrate Stripe Payment Sheet | `app/booking/payment.tsx` | Native payment UI |
| 3.3.3b | Add Apple Pay button | `app/booking/payment.tsx` | Apple Pay option |
| 3.3.3c | Add Google Pay button | `app/booking/payment.tsx` | Google Pay option |
| 3.3.3d | Add saved cards display | `app/booking/payment.tsx` | Previously used cards |
| 3.3.3e | Add payment error handling | `app/booking/payment.tsx` | Clear error states |
| 3.3.3f | Add payment success animation | `app/booking/payment.tsx` | Checkmark animation |

#### 3.3.4 Confirmation Celebration
**Current:** Static ✅ emoji
**Target:** Delightful celebration moment

**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 3.3.4a | Add confetti animation | `app/booking/confirmation.tsx` | Confetti on success |
| 3.3.4b | Add success haptic | `app/booking/confirmation.tsx` | Celebration haptic |
| 3.3.4c | Animate checkmark | `app/booking/confirmation.tsx` | Animated checkmark |
| 3.3.4d | Add countdown to visit | `app/booking/confirmation.tsx` | "2 days until your visit" |
| 3.3.4e | Implement Apple Wallet pass | `app/booking/confirmation.tsx` | Real PassKit integration |

---

### Phase 3 Voice/AI Integration Summary

| Feature | Voice Command | Implementation |
|---------|---------------|----------------|
| Photo gallery | "Show more photos" | Open full gallery |
| Reviews | "Read reviews" | Audio playback |
| Booking | "Book for tomorrow" | Date selection |
| Payment | "Pay with Apple Pay" | Payment method |

---

### Phase 3 Deliverables Checklist

- [ ] Parallax hero with full-bleed images
- [ ] Full-screen pinch-zoom gallery
- [ ] Highlights and What's Included sections
- [ ] Busy times graph
- [ ] Verified badge and social proof
- [ ] Gym owner profile section
- [ ] Similar gyms carousel
- [ ] Complete reviews system with ratings breakdown
- [ ] Review photos and filtering
- [ ] AI review summary
- [ ] Calendar date picker
- [ ] Stripe Payment Sheet with Apple/Google Pay
- [ ] Booking confirmation celebration

---

## PHASE 4: USER FEATURES
### Duration: 2 weeks | Priority: High

**Objective:** Build complete user-facing features including profile, favorites, passes management, and trips.

### 4.1 Profile Screen Rebuild

**Current:** Stub with email and sign out only
**Target:** Complete profile experience

#### 4.1.1 Profile Structure
**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 4.1.1a | Create profile header | `app/(tabs)/profile.tsx` | Avatar, name, member since |
| 4.1.1b | Add avatar upload | `app/(tabs)/profile.tsx` | Profile photo |
| 4.1.1c | Add profile edit screen | `app/profile/edit.tsx` (new) | Edit name, email, phone |
| 4.1.1d | Add gym passport stats | `app/(tabs)/profile.tsx` | Visits, cities, streak |
| 4.1.1e | Add achievement badges | `components/profile/Achievements.tsx` (new) | Gamification |

#### 4.1.2 Profile Sections
**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 4.1.2a | Add "Active Passes" section | `app/(tabs)/profile.tsx` | Quick pass access |
| 4.1.2b | Add "Visit History" section | `app/(tabs)/profile.tsx` | Past gym visits |
| 4.1.2c | Add "Saved Gyms" section | `app/(tabs)/profile.tsx` | Favorites preview |
| 4.1.2d | Add "Payment Methods" section | `app/profile/payment-methods.tsx` (new) | Saved cards |
| 4.1.2e | Add "Preferences" section | `app/profile/preferences.tsx` (new) | App settings |
| 4.1.2f | Add "Notifications" settings | `app/profile/notifications.tsx` (new) | Push settings |
| 4.1.2g | Add "Help & Support" | `app/profile/help.tsx` (new) | FAQ, contact |

#### 4.1.3 Account Settings
**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 4.1.3a | Add theme toggle | `app/profile/preferences.tsx` | Light/dark/auto |
| 4.1.3b | Add units preference | `app/profile/preferences.tsx` | Miles/km toggle |
| 4.1.3c | Add default location | `app/profile/preferences.tsx` | Home location |
| 4.1.3d | Add account deletion | `app/profile/account.tsx` (new) | GDPR compliance |

---

### 4.2 Favorites & Wishlists

**Current:** Heart toggle works, no dedicated screen
**Target:** Full favorites management

#### 4.2.1 Favorites Screen
**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 4.2.1a | Create Favorites screen | `app/favorites/index.tsx` (new) | Saved gyms list |
| 4.2.1b | Add favorites tab or section | Navigation update | Access to favorites |
| 4.2.1c | Add map view of favorites | `app/favorites/index.tsx` | Map of saved gyms |
| 4.2.1d | Add empty state | `app/favorites/index.tsx` | No favorites message |

#### 4.2.2 Wishlist Features
**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 4.2.2a | Add multiple wishlists | `stores/favoritesStore.ts` | Create lists |
| 4.2.2b | Create wishlist management | `app/favorites/lists.tsx` (new) | Manage lists |
| 4.2.2c | Add notes to saved gyms | `stores/favoritesStore.ts` | Personal notes |
| 4.2.2d | Add price change alerts | `services/notifications.ts` | Price drop notifications |

---

### 4.3 Passes Tab Enhancement

**Current:** Functional with sections and QR
**Target:** Polished pass management

#### 4.3.1 Pass Card Enhancement
**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 4.3.1a | Add gym image to card | `app/(tabs)/passes.tsx` | Visual identification |
| 4.3.1b | Add countdown to expiry | `app/(tabs)/passes.tsx` | "Expires in 2 days" |
| 4.3.1c | Add gym quick info | `app/(tabs)/passes.tsx` | Address, hours |
| 4.3.1d | Add directions button | `app/(tabs)/passes.tsx` | Open in Maps |

#### 4.3.2 Check-In Experience
**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 4.3.2a | Add brightness boost for QR | `components/booking/QRPass.tsx` | Auto-brighten |
| 4.3.2b | Add geofenced QR display | `app/(tabs)/passes.tsx` | Auto-show near gym |
| 4.3.2c | Add check-in confirmation | `app/(tabs)/passes.tsx` | Success animation |
| 4.3.2d | Add post-visit review prompt | `app/(tabs)/passes.tsx` | Request review |
| 4.3.2e | Implement Apple Wallet | `components/booking/QRPass.tsx` | Real PassKit |

---

### 4.4 Trips Tab Enhancement

**Current:** Functional with calendar sync
**Target:** Enhanced trip experience

#### 4.4.1 Trip Card Enhancement
**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 4.4.1a | Add destination image | `app/(tabs)/trips.tsx` | City/location image |
| 4.4.1b | Add gym count preview | `app/(tabs)/trips.tsx` | "24 gyms available" |
| 4.4.1c | Add weather preview | `app/(tabs)/trips.tsx` | Weather for dates |
| 4.4.1d | Improve "View Gyms" flow | `app/(tabs)/trips.tsx` | Pre-fill search with location |

#### 4.4.2 Trip Management
**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 4.4.2a | Add manual trip creation | `app/trips/create.tsx` (new) | Add trip manually |
| 4.4.2b | Add trip editing | `app/trips/[id].tsx` (new) | Edit trip details |
| 4.4.2c | Add trip deletion | `app/(tabs)/trips.tsx` | Remove trips |
| 4.4.2d | Add trip notifications | `services/notifications.ts` | Pre-trip reminders |

---

### Phase 4 Voice/AI Integration Summary

| Feature | Voice Command | Implementation |
|---------|---------------|----------------|
| Favorites | "Show my saved gyms" | Open favorites |
| Passes | "Show my pass" | Display QR |
| Trips | "Add a trip to Miami" | Create trip |
| Profile | "Change to dark mode" | Toggle theme |

---

### Phase 4 Deliverables Checklist

- [ ] Complete profile screen with all sections
- [ ] Avatar upload functionality
- [ ] Gym passport stats and achievements
- [ ] Payment methods management
- [ ] App preferences/settings
- [ ] Dedicated favorites screen
- [ ] Multiple wishlists support
- [ ] Enhanced pass cards with countdown
- [ ] Brightness boost for QR
- [ ] Apple Wallet integration
- [ ] Trip destination images
- [ ] Manual trip creation

---

## PHASE 5: POLISH & DELIGHT
### Duration: 2.5 weeks | Priority: High

**Objective:** Add the finishing touches that elevate Scout from good to exceptional.

### 5.1 Animation & Micro-interactions

#### 5.1.1 Navigation Animations
**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 5.1.1a | Add shared element transitions | Navigation config | Smooth page transitions |
| 5.1.1b | Add tab switch animations | `app/(tabs)/_layout.tsx` | Tab transition effects |
| 5.1.1c | Add modal presentation animations | Modal configs | Smooth modal open/close |
| 5.1.1d | Add bottom sheet spring physics | Bottom sheets | Natural spring motion |

#### 5.1.2 Component Animations
**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 5.1.2a | Add list item stagger animation | `FlatList` components | Staggered entrance |
| 5.1.2b | Add card hover/press states | All card components | Tactile feedback |
| 5.1.2c | Add button press animations | Button components | Scale/color response |
| 5.1.2d | Add pull-to-refresh animation | Scroll views | Custom refresh animation |
| 5.1.2e | Add scroll-linked animations | Headers, FABs | Scroll-responsive UI |

#### 5.1.3 Celebration Moments
**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 5.1.3a | Booking success confetti | `app/booking/confirmation.tsx` | Full confetti effect |
| 5.1.3b | First booking celebration | Special first-time flow | Extra celebration |
| 5.1.3c | Achievement unlock animation | Profile achievements | Badge unlock effect |
| 5.1.3d | Streak milestone celebration | Check-in flow | Streak rewards |

---

### 5.2 Empty States & Error Handling

#### 5.2.1 Empty State Illustrations
**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 5.2.1a | Replace emoji with illustrations | `EmptyState.tsx` variants | Custom illustrations |
| 5.2.1b | Add animated empty states | `EmptyState.tsx` | Subtle animations |
| 5.2.1c | Add contextual suggestions | `EmptyState.tsx` | Smart suggestions |
| 5.2.1d | Add personality to copy | All empty states | Friendly messaging |

#### 5.2.2 Error State Improvements
**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 5.2.2a | Create friendly error illustrations | Error components | Visual error states |
| 5.2.2b | Add retry with backoff | API hooks | Smart retry logic |
| 5.2.2c | Add offline state handling | App-wide | Offline-first experience |
| 5.2.2d | Add error recovery suggestions | Error states | Actionable recovery |

---

### 5.3 Accessibility Audit & Fixes

#### 5.3.1 VoiceOver Support
**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 5.3.1a | Add accessibilityLabel to buttons | All button components | Screen reader support |
| 5.3.1b | Add accessibilityHint | Interactive elements | Usage hints |
| 5.3.1c | Add accessibilityRole | All components | Semantic roles |
| 5.3.1d | Test full VoiceOver flow | All screens | Verified accessibility |

#### 5.3.2 Visual Accessibility
**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 5.3.2a | Verify color contrast ratios | Color constants | WCAG AA compliance |
| 5.3.2b | Add Dynamic Type support | Typography system | Respect font size settings |
| 5.3.2c | Add reduced motion support | Animation hooks | Respect motion preferences |
| 5.3.2d | Verify touch target sizes | All touchables | Min 44pt targets |

#### 5.3.3 Motor Accessibility
**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 5.3.3a | Ensure one-handed reachability | Key actions | Bottom-focused CTAs |
| 5.3.3b | Add gesture alternatives | Swipe actions | Button alternatives |
| 5.3.3c | Increase touch target padding | Small buttons | Easier tapping |

---

### 5.4 Performance Optimization

#### 5.4.1 Perceived Performance
**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 5.4.1a | Implement skeleton screens everywhere | Loading states | Perceived speed |
| 5.4.1b | Add optimistic updates | Mutations | Instant feedback |
| 5.4.1c | Prefetch likely next screens | Navigation hooks | Faster navigation |
| 5.4.1d | Add progressive image loading | Image components | Blur-up loading |

#### 5.4.2 Real Performance
**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 5.4.2a | Implement list virtualization | FlatLists | Memory efficiency |
| 5.4.2b | Memoize expensive components | React.memo usage | Prevent re-renders |
| 5.4.2c | Optimize image sizes | Image loading | Appropriate resolutions |
| 5.4.2d | Add image caching | Image system | Cache optimization |

---

### 5.5 Dark Mode Completion

#### 5.5.1 Full Theme Application
**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 5.5.1a | Apply dark theme to all screens | All screen files | Complete dark mode |
| 5.5.1b | Apply dark theme to all components | All components | Component theming |
| 5.5.1c | Add dark map style | Map component | Dark mode map |
| 5.5.1d | Test all states in dark mode | Full app | Verified dark mode |
| 5.5.1e | Add smooth theme transition | Theme toggle | Animated theme switch |

---

### 5.6 Voice/AI Final Polish

#### 5.6.1 Voice Experience Polish
**Tasks:**

| Task ID | Task | File(s) | Outcome |
|---------|------|---------|---------|
| 5.6.1a | Add voice tutorial on first use | Onboarding | Teach voice commands |
| 5.6.1b | Add voice command cheat sheet | Help section | Reference guide |
| 5.6.1c | Add voice feedback sounds | Audio feedback | Confirmation sounds |
| 5.6.1d | Add voice error recovery UX | Error states | Friendly recovery |
| 5.6.1e | Polish waveform animation | Audio waveform | Smooth visualization |

---

### Phase 5 Deliverables Checklist

- [ ] Smooth navigation transitions
- [ ] Spring physics on all interactive elements
- [ ] Celebration animations (confetti, checkmarks)
- [ ] Custom empty state illustrations
- [ ] Friendly error handling
- [ ] Full VoiceOver support
- [ ] WCAG AA color contrast
- [ ] Dynamic Type support
- [ ] Reduced motion support
- [ ] Skeleton screens everywhere
- [ ] Optimistic updates
- [ ] Complete dark mode
- [ ] Voice tutorial and cheat sheet
- [ ] All accessibility verified

---

## APPENDIX A: COMPONENT CREATION CHECKLIST

### New Components to Create (~40)

| Component | Phase | Location |
|-----------|-------|----------|
| AnimatedHeart | 1 | `components/ui/` |
| AnimatedButton | 1 | `components/ui/` |
| AnimatedCheckmark | 1 | `components/ui/` |
| Confetti | 1 | `components/ui/` |
| PulsingDot | 1 | `components/ui/` |
| Skeleton | 1 | `components/ui/` |
| SkeletonCard | 1 | `components/ui/` |
| SkeletonList | 1 | `components/ui/` |
| SkeletonDetail | 1 | `components/ui/` |
| VerifiedBadge | 1 | `components/ui/` |
| PopularBadge | 1 | `components/ui/` |
| NewBadge | 1 | `components/ui/` |
| UrgencyIndicator | 1 | `components/ui/` |
| ResponseRate | 1 | `components/ui/` |
| PriceText | 1 | `components/ui/` |
| SearchSuggestions | 2 | `components/search/` |
| StructuredSearchModal | 2 | `components/search/` |
| LocationPicker | 2 | `components/search/` |
| GymTypePicker | 2 | `components/search/` |
| SearchDatePicker | 2 | `components/search/` |
| FilterBottomSheet | 2 | `components/search/` |
| PriceRangeSlider | 2 | `components/search/` |
| DistanceFilter | 2 | `components/search/` |
| RatingFilter | 2 | `components/search/` |
| HoursFilter | 2 | `components/search/` |
| AmenitiesFilter | 2 | `components/search/` |
| VoiceHints | 2 | `components/voice/` |
| PriceBubbleMarker | 2 | `components/explore/` |
| ClusterMarker | 2 | `components/explore/` |
| MapPreviewCard | 2 | `components/explore/` |
| PhotoCarousel | 2 | `components/ui/` |
| HeroSection | 2 | `components/explore/` |
| CollectionRow | 2 | `components/explore/` |
| FullScreenGallery | 3 | `components/gym/` |
| BusyTimesGraph | 3 | `components/gym/` |
| GymOwnerProfile | 3 | `components/gym/` |
| SimilarGyms | 3 | `components/gym/` |
| ReviewCard | 3 | `components/gym/` |
| ReviewsList | 3 | `components/gym/` |
| RatingBreakdown | 3 | `components/gym/` |
| ReviewSummary | 3 | `components/gym/` |
| CalendarPicker | 3 | `components/booking/` |
| Achievements | 4 | `components/profile/` |

---

## APPENDIX B: FILE MODIFICATION CHECKLIST

### Existing Files to Modify (~25)

| File | Phase | Changes |
|------|-------|---------|
| `constants/colors.ts` | 1 | Dark mode palette |
| `constants/typography.ts` | 1 | Tabular numbers |
| `constants/spacing.ts` | 1 | Section spacing |
| `constants/animations.ts` | 1 | Spring configs |
| `constants/filters.ts` | 2 | Lucide icons |
| `stores/themeStore.ts` | 1 | System detection |
| `components/ui/EmptyState.tsx` | 1 | Icon migration |
| `components/ui/Button.tsx` | 1 | Animation |
| `components/explore/GymCard.tsx` | 2 | Photo carousel, badges |
| `components/explore/GymMap.tsx` | 2 | Custom markers |
| `components/search/SearchTray.tsx` | 2 | Suggestions, history |
| `components/search/FilterCarousel.tsx` | 2 | Icons, clear all |
| `components/booking/QRPass.tsx` | 4 | Brightness, Wallet |
| `app/(tabs)/index.tsx` | 2 | Hero, collections |
| `app/(tabs)/passes.tsx` | 4 | Enhanced cards |
| `app/(tabs)/trips.tsx` | 4 | Enhanced cards |
| `app/(tabs)/profile.tsx` | 4 | Complete rebuild |
| `app/(tabs)/_layout.tsx` | 5 | Tab animations |
| `app/gym/[id].tsx` | 3 | Full redesign |
| `app/booking/[id].tsx` | 3 | Calendar, pass cards |
| `app/booking/payment.tsx` | 3 | Stripe integration |
| `app/booking/confirmation.tsx` | 3 | Celebration |
| `hooks/useVoiceSearch.ts` | 2-5 | Voice commands |
| `app/_layout.tsx` | 1 | Theme provider |

---

## APPENDIX C: NEW FILES TO CREATE

### New Screens/Routes

| File | Phase |
|------|-------|
| `app/profile/edit.tsx` | 4 |
| `app/profile/payment-methods.tsx` | 4 |
| `app/profile/preferences.tsx` | 4 |
| `app/profile/notifications.tsx` | 4 |
| `app/profile/help.tsx` | 4 |
| `app/profile/account.tsx` | 4 |
| `app/favorites/index.tsx` | 4 |
| `app/favorites/lists.tsx` | 4 |
| `app/trips/create.tsx` | 4 |
| `app/trips/[id].tsx` | 4 |

### New Hooks

| File | Phase |
|------|-------|
| `hooks/useSystemTheme.ts` | 1 |
| `hooks/useThemedColors.ts` | 1 |
| `hooks/useAnimatedValue.ts` | 1 |
| `hooks/useGymReviews.ts` | 3 |

### New Stores

| File | Phase |
|------|-------|
| `stores/searchHistoryStore.ts` | 2 |

### New Utils

| File | Phase |
|------|-------|
| `utils/haptics.ts` | 1 |
| `utils/themedStyles.ts` | 1 |
| `utils/voiceFilterParser.ts` | 2 |

### New Constants

| File | Phase |
|------|-------|
| `constants/icons.ts` | 1 |
| `constants/mapStyles.ts` | 1 |

### New Contexts

| File | Phase |
|------|-------|
| `contexts/ThemeContext.tsx` | 1 |

---

## APPENDIX D: TESTING REQUIREMENTS

### Per-Phase Testing

| Phase | Testing Focus |
|-------|---------------|
| 1 | Dark mode toggle, haptics, skeleton animations |
| 2 | Search suggestions, filter application, map interactions, voice commands |
| 3 | Gallery gestures, payment flow, reviews display, booking completion |
| 4 | Profile CRUD, favorites sync, pass QR display, trip creation |
| 5 | Accessibility audit, performance profiling, animation smoothness |

### Voice/AI Testing Matrix

| Voice Command | Expected Result | Phase |
|---------------|-----------------|-------|
| "Find gyms near me" | Location search | 2 |
| "Only show yoga studios" | Filter applied | 2 |
| "Under $20" | Price filter | 2 |
| "Open now" | Time filter | 2 |
| "Show more photos" | Gallery opens | 3 |
| "Book for tomorrow" | Date selected | 3 |
| "Show my pass" | QR displayed | 4 |

---

## APPENDIX E: SUCCESS METRICS

### Target Scores After Implementation

| Metric | Before | After | Method |
|--------|--------|-------|--------|
| Design Maturity | 5/10 | 9/10 | Expert review |
| Airbnb-Quality | 4/10 | 9/10 | Comparative analysis |
| Booking Conversion | 6/10 | 9/10 | A/B testing |
| Trust Score | 4/10 | 9/10 | User research |
| Discovery Score | 5/10 | 9/10 | Usability testing |

### Key Performance Indicators

- Time to first meaningful paint: <1.5s
- Time to interactive: <3s
- Search result latency: <500ms
- Booking completion rate: >75%
- Voice command success rate: >85%
- User satisfaction (NPS): >50

---

*Document End*
