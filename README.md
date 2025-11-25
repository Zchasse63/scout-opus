# Scout - Fitness Discovery & Booking App

Scout is a travel-focused fitness discovery and booking platform that makes it easy to find and book gym passes while traveling. Built with React Native and Expo, Scout integrates voice search, real-time gym availability, QR code bookings, and calendar-based trip detection.

## Project Structure

```
scout-app/
├── app/                          # Expo Router navigation structure
│   ├── (tabs)/                   # Tab navigation stack
│   │   ├── index.tsx             # Explore tab with gym search
│   │   ├── passes.tsx            # User's booked passes
│   │   ├── trips.tsx             # Travel itineraries & calendar sync
│   │   └── profile.tsx           # User profile
│   ├── (auth)/                   # Authentication flows
│   │   ├── login.tsx             # Sign in with Apple/Google/Email
│   │   └── callback.tsx          # OAuth callbacks
│   ├── gym/                      # Gym detail modal
│   │   ├── _layout.tsx
│   │   └── [id].tsx
│   ├── booking/                  # Booking flow screens
│   │   ├── _layout.tsx
│   │   ├── [id].tsx              # Select pass & date
│   │   ├── payment.tsx           # Payment information
│   │   └── confirmation.tsx      # QR code & confirmation
│   ├── _layout.tsx               # Root layout with auth guard
│   └── App.tsx                   # App entry point
├── components/
│   ├── search/                   # Search UI components
│   │   ├── SearchTray.tsx        # Collapsible search with voice
│   │   └── FilterCarousel.tsx    # Filter chips
│   ├── explore/                  # Explore tab components
│   │   ├── GymCard.tsx           # Gym list item
│   │   ├── GymMap.tsx            # Apple Maps integration
│   │   └── ViewToggleFAB.tsx     # List/Map toggle button
│   ├── auth/                     # Auth components
│   └── ui/                       # Reusable UI components
├── hooks/
│   ├── useGymSearch.ts           # TanStack Query integration
│   ├── useVoiceSearch.ts         # Recording & transcription
│   ├── useSavedGyms.ts           # Saved gyms CRUD
│   └── useBooking.ts             # Booking state management
├── stores/
│   ├── authStore.ts              # Zustand auth state
│   ├── mapStore.ts               # Map view state
│   ├── bookingStore.ts           # Current booking state
│   └── tripsStore.ts             # Trips state
├── lib/
│   └── supabase.ts               # Supabase client setup
├── types/
│   └── index.ts                  # TypeScript interfaces
├── constants/
│   ├── colors.ts                 # Scout design system
│   ├── typography.ts             # Text styles
│   ├── spacing.ts                # Layout scale
│   ├── animations.ts             # Animation timing
│   └── filters.ts                # Default filters
├── services/
│   ├── calendar/                 # iOS Calendar integration
│   ├── notifications/            # OneSignal setup
│   └── supabase/                 # Supabase Edge Functions
├── __tests__/                    # Unit & integration tests
│   ├── hooks/
│   ├── stores/
│   └── components/
├── e2e/                          # Detox E2E tests
├── jest.config.js                # Jest configuration
├── jest.setup.js                 # Jest setup & mocks
└── package.json                  # Dependencies
```

## Key Technologies

- **Framework**: React Native 0.81.5 + Expo 54
- **Navigation**: Expo Router (v4)
- **State Management**: Zustand (v5) + TanStack Query (v5)
- **Backend**: Supabase (PostgreSQL + PostGIS)
- **Maps**: Apple Maps via react-native-maps
- **Search Data**: Google Places API (New)
- **Voice**: Apple SpeechAnalyzer + Whisper API fallback
- **AI**: Gemini 2.5 Flash (intent parsing)
- **Payments**: Stripe Connect
- **Notifications**: OneSignal
- **Animations**: Reanimated (v4)
- **Testing**: Jest + Testing Library + Detox

## Development Phases

### Phase 1: Foundation (Weeks 1-3)
- ✅ Project setup & design system
- ✅ Supabase database schema
- ✅ Authentication (Apple, Google, Email)
- ✅ Core stores & hooks

### Phase 2: Discovery & Search (Weeks 4-7)
- ✅ Google Places API integration
- ✅ Voice search with transcription
- ✅ Apple Maps with gym markers
- ✅ Gym detail modal with AI summary

### Phase 3: Booking & Payments (Weeks 8-9)
- ✅ Stripe Connect integration
- ✅ Booking flow UI
- ✅ QR code generation
- ✅ Passes tab with status tracking
- ⏳ Apple Wallet integration
- ⏳ Waiver system

### Phase 4: Travel & Trips (Week 10)
- ✅ iOS Calendar integration
- ✅ Trip detection & display
- ✅ Nearby gyms suggestions
- ⏳ Travel alerts (OneSignal)

### Phase 5: Testing & Launch (Weeks 11-12)
- ⏳ Unit tests (hooks, stores)
- ⏳ Integration tests (booking flow)
- ⏳ E2E tests (Detox)
- ⏳ Performance optimization
- ⏳ Accessibility audit
- ⏳ App Store submission

## Environment Setup

### Prerequisites
- Node.js 18+
- Expo CLI (`npm install -g eas-cli`)
- Xcode 15+ (for iOS development)

### Installation

```bash
cd scout-app
npm install
```

### Environment Variables

Create a `.env` file in `scout-app/`:

```bash
# Supabase
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google APIs
EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_api_key

# Stripe
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key

# OneSignal
EXPO_PUBLIC_ONESIGNAL_APP_ID=your_onesignal_id

# Gemini AI
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_key
```

## Running the App

### Development
```bash
npm run ios
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## Testing

### Unit Tests
```bash
npm test
```

### Unit Tests with Coverage
```bash
npm test -- --coverage
```

### E2E Tests (requires build)
```bash
detox test e2e/booking.e2e.js --configuration ios.sim.release
```

## Key Features

### 🔍 Smart Search
- Text search via Google Places API
- Voice search with AI intent parsing
- Real-time filter chips
- Location-based results

### 📱 Booking Flow
- Simple 3-step booking process
- Multiple pass types (day/week/month)
- Secure Stripe payments
- QR code generation

### 🗺️ Exploration
- Apple Maps with gym locations
- List/Map view toggle
- Gym ratings & reviews
- Detailed gym information

### 🎫 Pass Management
- Active/Upcoming/Past sections
- QR code display
- Apple Wallet integration
- Status tracking

### ✈️ Travel Integration
- iOS Calendar sync
- Automatic trip detection
- Nearby gyms at destination
- Travel alerts

## Business Model

Scout operates on a **15% platform commission**:
- Users pay full pass price
- Scout retains 15% platform fee
- Gyms receive 85% of revenue

Example:
- Day Pass: $25
- Scout Fee (15%): $3.75
- Gym Receives (85%): $21.25

## Architecture Decisions

### State Management
- **Zustand** for simple, reactive state (auth, map, booking)
- **TanStack Query** for server state (gyms, bookings, trips)
- Minimizes boilerplate vs. Redux while maintaining scalability

### Backend
- **Supabase** provides: Auth, Database (PostgreSQL), RLS, Edge Functions
- **PostGIS** for geographic queries (nearby gyms)
- **Edge Functions** for API integrations (Google Places, Stripe, Gemini)

### Maps
- **Apple Maps** (via react-native-maps) displays native iOS experience
- **Google Places API** provides gym data and AI summaries
- Separation of concerns: rendering vs. data

### Voice
- **Apple SpeechAnalyzer** for fast on-device recognition
- **Whisper API** fallback if unavailable
- **Gemini 2.5 Flash** parses intent and location

## Performance Considerations

- Maps rendered natively via react-native-maps
- Query results cached by TanStack Query (5-minute default)
- Voice results processed server-side to minimize app size
- Images lazy-loaded in lists (FlatList optimization)
- Reanimated for smooth 60fps animations

## Accessibility

- VoiceOver support for all interactive elements
- High contrast text (WCAG AA compliant)
- Semantic navigation structure
- Alternative text for all images

## Next Steps

1. **Edge Functions**: Deploy all Supabase functions with proper API keys
2. **Stripe Setup**: Connect Stripe account and add payment processing
3. **TestFlight**: Build and submit for beta testing
4. **Refinements**: Gather user feedback and iterate
5. **App Store**: Final submission and launch

## Support

For questions or issues, please open an issue on GitHub or contact the development team.

---

Built with ❤️ for fitness travelers everywhere.
