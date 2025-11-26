# Phase 1: Foundation

> Project setup, authentication, navigation, and design system

---

## Document Info

| Field | Value |
|-------|-------|
| **Phase** | 1 of 8 |
| **Timeline** | Weeks 1-3 |
| **Status** | In Progress (65% Complete) |
| **Created** | November 25, 2025 |
| **Last Updated** | November 26, 2025 |
| **Last Audit** | November 26, 2025 |
| **Version** | 1.2.0 |

---

## Current Completion Status

| Week | Focus Area | Status | Completion |
|------|------------|--------|------------|
| Week 1 | Project Foundation | ✅ Mostly Complete | 85% |
| Week 1 | EAS Build Config | ⚠️ Partial | 30% |
| Week 1 | Supabase Setup | ✅ Complete | 100% |
| Week 1 | GitHub Repository | ✅ Complete | 100% |
| Week 2 | Authentication | ⚠️ Partial | 70% |
| Week 3 | Navigation | ✅ Complete | 95% |
| Week 3 | SearchTray | ⚠️ Partial | 60% |
| Week 3 | Design System | ✅ Complete | 90% |
| Week 3 | UI Components | ✅ Complete | 100% |
| Week 3 | Dark Mode | ⚠️ Partial | 30% |

### Critical Remaining Items

1. ~~**components/ui/**~~ ✅ All UI components now exist
2. **EAS Configuration** - eas.json exists, build profiles need testing
3. **GitHub Actions** - CI/CD pipeline not configured
4. **Dark Mode** - themeStore exists, color variants need implementation
5. **Tab Icons** - Replace emojis with lucide-react-native

---

## Phase Navigation

| Previous | Current | Next |
|----------|---------|------|
| — | **Phase 1: Foundation** | [Phase 2: Core Features](PHASE_2_CORE_FEATURES.md) |

**All Phases:**
- **Phase 1: Foundation** (Current)
- [Phase 2: Core Features](PHASE_2_CORE_FEATURES.md)
- [Phase 3: Booking System](PHASE_3_BOOKING_SYSTEM.md)
- [Phase 4: Intelligence](PHASE_4_INTELLIGENCE.md)
- [Phase 5: Polish & Launch](PHASE_5_POLISH_LAUNCH.md)

---

## Overview

Phase 1 establishes the foundational infrastructure for the Scout app. This includes initializing the Expo project, setting up the Supabase backend, implementing authentication, creating the 4-tab navigation structure, and building the core UI components including the signature SearchTray.

### Goals

1. Fully functional Expo SDK 54 project with TypeScript
2. Connected Supabase backend with complete database schema
3. Working authentication (Apple, Google, Email)
4. 4-tab navigation (Explore, Passes, Trips, Profile)
5. SearchTray component with collapsed/expanded states
6. Design system (colors, typography, components)
7. CI/CD pipeline configured

### Dependencies

- Node.js 20+
- Expo CLI
- Supabase CLI
- EAS CLI
- Xcode (for iOS development)
- Android Studio (for Android development)

---

## Week 1: Project Foundation

### 1.1 Initialize Expo Project

- [x] Create new Expo SDK 54 project with TypeScript template ✅ *Completed*
  ```bash
  npx create-expo-app@latest scout-app --template expo-template-blank-typescript
  ```
- [ ] Configure `app.json` / `app.config.ts` with Scout branding ⚠️ *Needs branding review*
- [x] Set up project structure per blueprint specification ✅ *Completed*
- [x] Configure TypeScript strict mode ✅ *Completed*
- [x] Install core dependencies: ✅ *All installed*
  - [x] `expo-router` v4 → ~4.0.0
  - [x] `react-native-reanimated` v4 → ^4.0.0
  - [x] `react-native-gesture-handler` → ^2.17.0
  - [x] `zustand` v5 → ^5.0.0
  - [x] `@tanstack/react-query` v5 → ^5.0.0
  - [x] `@supabase/supabase-js` → ^2.45.0

### 1.2 Configure EAS Build

- [ ] Initialize EAS project: `eas build:configure`
- [ ] Configure iOS build profile (development, preview, production)
- [ ] ~~Configure Android build profile~~ *(Deferred to Post-Launch)*
- [ ] Set up EAS Update for OTA updates
- [ ] Test development build on iOS Simulator
- [ ] ~~Test development build on Android Emulator~~ *(Deferred to Post-Launch)*

### 1.3 Set Up Supabase

- [x] Link to existing Supabase project: ✅ *Completed*
  ```bash
  supabase link --project-ref wxepvxrpkaehqkujzzqn
  ```
- [x] Pull existing schema (if any): `supabase db pull` ✅ *Completed*
- [x] Implement complete database schema from blueprint (Section 6) ✅ *001_initial_schema.sql*
- [x] Enable PostGIS extension for spatial queries ✅ *Completed*
- [x] Configure Row Level Security (RLS) policies ✅ *All tables have policies*
- [x] Seed amenities reference data ✅ *15 amenities seeded*
- [ ] Create database functions: ⚠️ *Partial - in 002_functions.sql*
  - [x] `search_gyms_nearby()` - Spatial search ✅
  - [x] `generate_qr_payload()` - QR code generation ✅
  - [ ] `update_gym_rating()` - Rating trigger ❌ *Not implemented*
- [x] Test database locally: `supabase start` ✅ *Completed*

### 1.4 Set Up GitHub Repository

- [x] Initialize git repository (if not already) ✅ *Completed*
- [x] Create `.gitignore` with Expo/React Native patterns ✅ *Completed*
- [ ] Create `.env.example` with required environment variables ❌ *Not created*
- [ ] Set up branch protection rules on `main` ❌ *Not configured*
- [ ] Configure GitHub Actions for: ❌ *Not started*
  - [ ] Lint on PR
  - [ ] Type check on PR
  - [ ] EAS Build trigger on merge to `main`
- [x] Push initial project structure ✅ *Completed*

### Week 1 Deliverable

✅ Running app shell with database connected, deployable via EAS

---

## Week 2: Authentication

### 2.1 Supabase Auth Configuration

- [ ] Enable Apple Sign In provider in Supabase dashboard ⚠️ *Needs verification*
- [ ] Enable Google Sign In provider in Supabase dashboard ⚠️ *Needs verification*
- [ ] Enable Magic Link (email) provider ⚠️ *Needs verification*
- [ ] Configure redirect URLs for OAuth callbacks ⚠️ *Needs verification*
- [ ] Set up auth email templates (confirmation, magic link) ❌ *Not configured*

### 2.2 Apple Sign In

- [x] Install `expo-apple-authentication` ✅ *~6.4.0 installed*
- [ ] Configure Apple Sign In capability in `app.json` ⚠️ *Needs verification*
- [x] Create Apple Sign In button component ✅ *In login.tsx*
- [x] Implement sign in flow with Supabase ✅ *In authStore.ts*
- [ ] Handle token refresh ⚠️ *Basic implementation*
- [ ] Test on iOS device/simulator ❌ *Not tested*

### 2.3 Google Sign In

- [x] Install `@react-native-google-signin/google-signin` ✅ *^13.0.0 installed*
- [ ] Configure Google Cloud OAuth credentials ⚠️ *Needs verification*
- [ ] ~~Configure Android SHA-1 fingerprint~~ *(Deferred to Post-Launch)*
- [x] Create Google Sign In button component ✅ *In login.tsx*
- [x] Implement sign in flow with Supabase ✅ *In authStore.ts*
- [ ] Test on iOS ❌ *Not tested*

### 2.4 Email Magic Link

- [x] Create email input form ✅ *In login.tsx*
- [x] Implement magic link request flow ✅ *In authStore.ts*
- [x] Handle deep link callback for magic link ✅ *In callback.tsx*
- [ ] Show confirmation/error states ⚠️ *Basic implementation*
- [ ] Test email delivery ❌ *Not tested*

### 2.5 Auth State Management

- [x] Create `authStore` with Zustand ✅ *stores/authStore.ts*
  ```typescript
  interface AuthStore {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    signIn: (provider: 'apple' | 'google' | 'email') => Promise<void>;
    signOut: () => Promise<void>;
    refreshSession: () => Promise<void>;
  }
  ```
- [x] Implement secure token storage with `expo-secure-store` ✅ *Installed*
- [x] Create auth context provider ✅ *Basic implementation*
- [x] Implement session persistence across app restarts ✅ *via Supabase*
- [x] Handle auth state changes (onAuthStateChange) ✅ *In authStore.ts*

### 2.6 Auth Screens

- [x] Create `app/auth/login.tsx` screen ✅ *Completed*
- [x] Create `app/auth/callback.tsx` for OAuth redirect ✅ *Completed*
- [ ] Design login screen with Scout branding ⚠️ *Needs design polish*
- [x] Add loading states and error handling ✅ *Basic implementation*
- [ ] Implement protected route logic ⚠️ *Needs verification*

### Week 2 Deliverable

✅ Working authentication flow with Apple, Google, and email options

---

## Week 3: Navigation & Design System

### 3.1 Expo Router Setup

- [x] Configure file-based routing in `app/` directory ✅ *Completed*
- [x] Create root layout `app/_layout.tsx` ✅ *Completed*
- [ ] Set up auth guard for protected routes ⚠️ *Needs verification*
- [ ] Configure deep linking scheme ⚠️ *Needs verification*

### 3.2 Tab Navigation (4 Tabs)

- [x] Create `app/(tabs)/_layout.tsx` with tab configuration ✅ *Completed*
- [x] Implement 4 tabs: ✅ *All created*
  - [x] `index.tsx` - Explore (home)
  - [x] `passes.tsx` - Passes
  - [x] `trips.tsx` - Trips
  - [x] `profile.tsx` - Profile
- [x] Configure tab bar styling per design spec: ✅ *Mostly complete*
  - Active color: `#FF5A1F` (Scout orange) ✅
  - Inactive color: `#7A7A7A` ✅
  - Background: `#FFFFFF` ✅
  - Height: 84px (iOS) / 64px (Android) ✅
- [ ] Add tab icons (lucide-react-native): ❌ **Currently using emojis - needs fix**
  - Explore: SearchIcon → Currently using 🔍
  - Passes: TicketIcon → Currently using 🎟️
  - Trips: PlaneIcon → Currently using ✈️
  - Profile: UserIcon → Currently using 👤

### 3.3 SearchTray Component (Core)

- [x] Create `components/search/SearchTray.tsx` ✅ *Completed*
- [ ] Implement three states: ⚠️ *Partial implementation*
  - [x] **Collapsed** (~180px) - Search bar + mic + filter chips ✅
  - [x] **Expanded** (~500px) - Full filters, recent searches ⚠️ *Basic*
  - [ ] **Voice Recording** (~320px) - Mic + transcription ❌ *Not implemented*
- [x] Implement drag gesture with `react-native-gesture-handler` ✅
- [x] Add spring animation with `react-native-reanimated` ⚠️ *Needs verification*
  ```typescript
  const SNAP_THRESHOLD = 100;
  const VELOCITY_THRESHOLD = 500;
  ```
- [ ] Create background overlay that dims content behind expanded tray ⚠️ *Needs verification*
- [ ] Handle keyboard appearance/dismissal ⚠️ *Needs verification*

### 3.4 SearchInput Component

- [ ] Create `components/search/SearchInput.tsx` ⚠️ *Inline in SearchTray*
- [x] Text input with placeholder "Search gyms, yoga, CrossFit..." ✅
- [ ] Mic button (right side) - visual only for now ⚠️ *Needs verification*
- [ ] Focus state styling ⚠️ *Needs verification*
- [ ] Clear button when text present ❌ *Not implemented*

### 3.5 FilterCarousel Component

- [x] Create `components/search/FilterCarousel.tsx` ✅ *Completed*
- [x] Horizontal scrolling filter chips ✅
- [x] Implement default filters ✅ *In constants/filters.ts*
  ```typescript
  const DEFAULT_FILTERS = [
    { id: 'gym', label: 'Gym', icon: '🏋️' },
    { id: 'yoga', label: 'Yoga', icon: '🧘' },
    { id: 'crossfit', label: 'CrossFit', icon: '💪' },
    { id: 'cycling', label: 'Cycling', icon: '🚴' },
    { id: 'boxing', label: 'Boxing', icon: '🥊' },
    { id: 'sauna', label: 'Sauna', icon: '🧖' },
    { id: 'pool', label: 'Pool', icon: '🏊' },
    { id: '24hr', label: '24hr', icon: '⏰' },
  ];
  ```
- [x] Active/inactive chip styling ✅
- [x] Multi-select support ✅

### 3.6 ViewToggleFAB Component

- [x] Create `components/explore/ViewToggleFAB.tsx` ✅ *Completed*
- [x] Floating button to toggle list/map view ✅
- [ ] Bounce animation on press ⚠️ *Needs verification*
- [x] Icon switches between MapIcon and ListIcon ✅
- [x] Position: bottom center, above tab bar ✅

### 3.7 Design System Foundation

- [x] Create `constants/colors.ts`: ✅ *Completed*
  ```typescript
  export const colors = {
    primary: '#FF5A1F',
    primaryLight: '#FF7A45',
    primaryDark: '#E04A10',
    secondary: '#0066FF',
    black: '#1A1A1A',
    gray900: '#2D2D2D',
    gray700: '#4A4A4A',
    gray500: '#7A7A7A',
    gray300: '#B0B0B0',
    gray100: '#F0F0F0',
    white: '#FFFFFF',
    success: '#00C853',
    warning: '#FFB300',
    error: '#FF3D00',
  };
  ```
- [x] Create `constants/typography.ts` with font scales ✅ *Completed*
- [x] Create `constants/spacing.ts` with spacing scale ✅ *Completed*
- [x] Create `constants/animations.ts` with timing constants ✅ *Completed*

### 3.8 Shared UI Components

> **UPDATE (Nov 26, 2025): All UI components now exist in components/ui/**

- [x] Create `components/ui/Button.tsx` (primary, secondary, outline variants) ✅
- [x] Create `components/ui/Card.tsx` with press animation ✅
- [x] Create `components/ui/Avatar.tsx` ✅
- [x] Create `components/ui/Badge.tsx` ✅
- [x] Create `components/ui/Skeleton.tsx` for loading states ✅
- [x] Create `components/ui/EmptyState.tsx` ✅

### 3.9 Dark Mode Support

> **NOT STARTED: Should be completed before Phase 5 polish.**

- [ ] Implement color scheme detection ❌
- [ ] Create dark mode color variants ❌
- [ ] Add theme context/store ❌ *stores/themeStore.ts missing*
- [ ] Test all screens in both modes ❌

### Week 3 Deliverable

✅ Complete navigation with floating search tray and placeholder screens

---

## Technical Specifications

### Project Structure (End of Phase 1)

```
scout-app/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab bar configuration
│   │   ├── index.tsx            # Explore tab (placeholder)
│   │   ├── passes.tsx           # Passes tab (placeholder)
│   │   ├── trips.tsx            # Trips tab (placeholder)
│   │   └── profile.tsx          # Profile tab (placeholder)
│   ├── auth/
│   │   ├── login.tsx            # Login screen
│   │   └── callback.tsx         # OAuth callback
│   └── _layout.tsx              # Root layout
├── components/
│   ├── search/
│   │   ├── SearchTray.tsx       # Main bottom sheet
│   │   ├── SearchInput.tsx      # Search field + mic
│   │   └── FilterCarousel.tsx   # Filter chips
│   ├── explore/
│   │   └── ViewToggleFAB.tsx    # List/map toggle
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Avatar.tsx
│       ├── Badge.tsx
│       ├── Skeleton.tsx
│       └── EmptyState.tsx
├── stores/
│   ├── authStore.ts             # Auth state
│   └── themeStore.ts            # Theme state
├── hooks/
│   └── useSearchTray.ts         # SearchTray state + gestures
├── constants/
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   ├── animations.ts
│   └── filters.ts
├── types/
│   ├── auth.ts
│   └── search.ts
├── lib/
│   └── supabase.ts              # Supabase client
├── supabase/
│   └── migrations/              # Database migrations
├── app.config.ts
├── package.json
├── tsconfig.json
└── .env
```

### Database Tables (Created in Phase 1)

- `users` - User profiles
- `amenities` - Reference data for amenities
- `gym_owners` - Gym owner accounts
- `gyms` - Fitness facilities
- `gym_amenities` - Junction table
- `gym_hours` - Operating hours
- `gym_photos` - Facility images
- `bookings` - User bookings
- `reviews` - User reviews
- `travel_periods` - Detected trips
- `voice_queries` - Voice search logs
- `saved_gyms` - User favorites

---

## Acceptance Criteria

### Must Have (P0)
- [ ] App launches successfully on iOS and Android
- [ ] User can sign in with Apple (iOS)
- [ ] User can sign in with Google
- [ ] User can sign in with email magic link
- [ ] 4-tab navigation is functional
- [ ] SearchTray expands/collapses smoothly
- [ ] Database schema is complete and migrations applied
- [ ] RLS policies are active and tested

### Should Have (P1)
- [ ] Dark mode toggle works
- [ ] All UI components follow design spec
- [ ] Animations run at 60fps
- [ ] GitHub Actions CI is functional
- [ ] EAS builds complete successfully

### Nice to Have (P2)
- [ ] Haptic feedback on interactions
- [ ] Splash screen with Scout branding
- [ ] App icon configured

---

## Completion Summary

> *To be filled in upon phase completion*

### Completion Date
*Not yet completed*

### Final Status
*Pending*

### Deliverables Completed
- [ ] Item 1
- [ ] Item 2

### Metrics
| Metric | Target | Actual |
|--------|--------|--------|
| Build success rate | 100% | — |
| Auth flow completion | 100% | — |
| SearchTray animation fps | 60 | — |

---

## Carryover Items

> *Items deferred from this phase*

| Item | Moved To | Reason |
|------|----------|--------|
| Configure Android build profile | Post-Launch | iOS-first approach |
| Test on Android Emulator | Post-Launch | iOS-first approach |
| Configure Android SHA-1 fingerprint | Post-Launch | iOS-first approach |

---

## Change Log

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| November 25, 2025 | 1.0.0 | Initial phase document created | — |

---

*Reference: [Complete Technical Blueprint](../Scout_Fitness_App_Complete_Technical_Blueprint_November_2025-2.md) - Sections 3, 5, 6*
