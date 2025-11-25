# Phase 1: Foundation

> Project setup, authentication, navigation, and design system

---

## Document Info

| Field | Value |
|-------|-------|
| **Phase** | 1 of 5 |
| **Timeline** | Weeks 1-3 |
| **Status** | Not Started |
| **Created** | November 25, 2025 |
| **Last Updated** | November 25, 2025 |
| **Version** | 1.0.0 |

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

- [ ] Create new Expo SDK 54 project with TypeScript template
  ```bash
  npx create-expo-app@latest scout-app --template expo-template-blank-typescript
  ```
- [ ] Configure `app.json` / `app.config.ts` with Scout branding
- [ ] Set up project structure per blueprint specification
- [ ] Configure TypeScript strict mode
- [ ] Install core dependencies:
  - [ ] `expo-router` v4
  - [ ] `react-native-reanimated` v4
  - [ ] `react-native-gesture-handler`
  - [ ] `zustand` v5
  - [ ] `@tanstack/react-query` v5
  - [ ] `@supabase/supabase-js`

### 1.2 Configure EAS Build

- [ ] Initialize EAS project: `eas build:configure`
- [ ] Configure iOS build profile (development, preview, production)
- [ ] ~~Configure Android build profile~~ *(Deferred to Post-Launch)*
- [ ] Set up EAS Update for OTA updates
- [ ] Test development build on iOS Simulator
- [ ] ~~Test development build on Android Emulator~~ *(Deferred to Post-Launch)*

### 1.3 Set Up Supabase

- [ ] Link to existing Supabase project:
  ```bash
  supabase link --project-ref wxepvxrpkaehqkujzzqn
  ```
- [ ] Pull existing schema (if any): `supabase db pull`
- [ ] Implement complete database schema from blueprint (Section 6)
- [ ] Enable PostGIS extension for spatial queries
- [ ] Configure Row Level Security (RLS) policies
- [ ] Seed amenities reference data
- [ ] Create database functions:
  - [ ] `search_gyms_nearby()` - Spatial search
  - [ ] `generate_qr_payload()` - QR code generation
  - [ ] `update_gym_rating()` - Rating trigger
- [ ] Test database locally: `supabase start`

### 1.4 Set Up GitHub Repository

- [ ] Initialize git repository (if not already)
- [ ] Create `.gitignore` with Expo/React Native patterns
- [ ] Create `.env.example` with required environment variables
- [ ] Set up branch protection rules on `main`
- [ ] Configure GitHub Actions for:
  - [ ] Lint on PR
  - [ ] Type check on PR
  - [ ] EAS Build trigger on merge to `main`
- [ ] Push initial project structure

### Week 1 Deliverable

✅ Running app shell with database connected, deployable via EAS

---

## Week 2: Authentication

### 2.1 Supabase Auth Configuration

- [ ] Enable Apple Sign In provider in Supabase dashboard
- [ ] Enable Google Sign In provider in Supabase dashboard
- [ ] Enable Magic Link (email) provider
- [ ] Configure redirect URLs for OAuth callbacks
- [ ] Set up auth email templates (confirmation, magic link)

### 2.2 Apple Sign In

- [ ] Install `expo-apple-authentication`
- [ ] Configure Apple Sign In capability in `app.json`
- [ ] Create Apple Sign In button component
- [ ] Implement sign in flow with Supabase
- [ ] Handle token refresh
- [ ] Test on iOS device/simulator

### 2.3 Google Sign In

- [ ] Install `@react-native-google-signin/google-signin`
- [ ] Configure Google Cloud OAuth credentials
- [ ] ~~Configure Android SHA-1 fingerprint~~ *(Deferred to Post-Launch)*
- [ ] Create Google Sign In button component
- [ ] Implement sign in flow with Supabase
- [ ] Test on iOS

### 2.4 Email Magic Link

- [ ] Create email input form
- [ ] Implement magic link request flow
- [ ] Handle deep link callback for magic link
- [ ] Show confirmation/error states
- [ ] Test email delivery

### 2.5 Auth State Management

- [ ] Create `authStore` with Zustand
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
- [ ] Implement secure token storage with `expo-secure-store`
- [ ] Create auth context provider
- [ ] Implement session persistence across app restarts
- [ ] Handle auth state changes (onAuthStateChange)

### 2.6 Auth Screens

- [ ] Create `app/auth/login.tsx` screen
- [ ] Create `app/auth/callback.tsx` for OAuth redirect
- [ ] Design login screen with Scout branding
- [ ] Add loading states and error handling
- [ ] Implement protected route logic

### Week 2 Deliverable

✅ Working authentication flow with Apple, Google, and email options

---

## Week 3: Navigation & Design System

### 3.1 Expo Router Setup

- [ ] Configure file-based routing in `app/` directory
- [ ] Create root layout `app/_layout.tsx`
- [ ] Set up auth guard for protected routes
- [ ] Configure deep linking scheme

### 3.2 Tab Navigation (4 Tabs)

- [ ] Create `app/(tabs)/_layout.tsx` with tab configuration
- [ ] Implement 4 tabs:
  - [ ] `index.tsx` - Explore (home)
  - [ ] `passes.tsx` - Passes
  - [ ] `trips.tsx` - Trips
  - [ ] `profile.tsx` - Profile
- [ ] Configure tab bar styling per design spec:
  - Active color: `#FF5A1F` (Scout orange)
  - Inactive color: `#7A7A7A`
  - Background: `#FFFFFF`
  - Height: 84px (iOS) / 64px (Android)
- [ ] Add tab icons (lucide-react-native):
  - Explore: SearchIcon
  - Passes: TicketIcon
  - Trips: PlaneIcon
  - Profile: UserIcon

### 3.3 SearchTray Component (Core)

- [ ] Create `components/search/SearchTray.tsx`
- [ ] Implement three states:
  - [ ] **Collapsed** (~180px) - Search bar + mic + filter chips
  - [ ] **Expanded** (~500px) - Full filters, recent searches
  - [ ] **Voice Recording** (~320px) - Mic + transcription (placeholder for Phase 2)
- [ ] Implement drag gesture with `react-native-gesture-handler`
- [ ] Add spring animation with `react-native-reanimated`:
  ```typescript
  const SNAP_THRESHOLD = 100;
  const VELOCITY_THRESHOLD = 500;
  ```
- [ ] Create background overlay that dims content behind expanded tray
- [ ] Handle keyboard appearance/dismissal

### 3.4 SearchInput Component

- [ ] Create `components/search/SearchInput.tsx`
- [ ] Text input with placeholder "Search gyms, yoga, CrossFit..."
- [ ] Mic button (right side) - visual only for now
- [ ] Focus state styling
- [ ] Clear button when text present

### 3.5 FilterCarousel Component

- [ ] Create `components/search/FilterCarousel.tsx`
- [ ] Horizontal scrolling filter chips
- [ ] Implement default filters:
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
- [ ] Active/inactive chip styling
- [ ] Multi-select support

### 3.6 ViewToggleFAB Component

- [ ] Create `components/explore/ViewToggleFAB.tsx`
- [ ] Floating button to toggle list/map view
- [ ] Bounce animation on press
- [ ] Icon switches between MapIcon and ListIcon
- [ ] Position: bottom center, above tab bar

### 3.7 Design System Foundation

- [ ] Create `constants/colors.ts`:
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
- [ ] Create `constants/typography.ts` with font scales
- [ ] Create `constants/spacing.ts` with spacing scale
- [ ] Create `constants/animations.ts` with timing constants

### 3.8 Shared UI Components

- [ ] Create `components/ui/Button.tsx` (primary, secondary, outline variants)
- [ ] Create `components/ui/Card.tsx` with press animation
- [ ] Create `components/ui/Avatar.tsx`
- [ ] Create `components/ui/Badge.tsx`
- [ ] Create `components/ui/Skeleton.tsx` for loading states
- [ ] Create `components/ui/EmptyState.tsx`

### 3.9 Dark Mode Support

- [ ] Implement color scheme detection
- [ ] Create dark mode color variants
- [ ] Add theme context/store
- [ ] Test all screens in both modes

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
