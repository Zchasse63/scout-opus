# Scout Fitness App

> "Airbnb for Gyms" - A travel-focused fitness discovery and booking platform

[![Status](https://img.shields.io/badge/Status-In%20Development-yellow)]()
[![Phase](https://img.shields.io/badge/Phase-1%20Foundation-blue)]()
[![Last Updated](https://img.shields.io/badge/Last%20Updated-November%2025%2C%202025-green)]()

---

## Overview

Scout enables business travelers, digital nomads, and fitness enthusiasts to discover, evaluate, and book day passes at fitness facilities anywhere. Unlike competitors like ClassPass, Scout offers transparent pricing, fair gym partnerships (15% commission vs 20-30%), and intelligent features like voice search and calendar-aware recommendations.

> **iOS-First Approach:** Initial development focuses exclusively on iOS. Android development will begin post-launch after iOS app is live in the App Store.

## Key Features

- **Voice Search** - Natural language gym discovery ("Find a gym with sauna near South Beach")
- **Unified Map/List View** - Seamless toggle between browsing modes
- **Calendar Integration** - Automatic travel detection with proactive recommendations
- **QR Digital Passes** - Apple Wallet integration for frictionless check-in (Google Wallet post-launch)
- **Fair Partnerships** - 85% revenue to gyms (industry-leading)

## Technology Stack

| Layer | Technology |
|-------|------------|
| Mobile | Expo SDK 54 + React Native 0.81 (iOS) |
| Web | React 19.1 + Vite |
| Navigation | Expo Router v4 |
| State | Zustand + TanStack Query |
| Backend | Supabase (PostgreSQL + PostGIS) |
| Voice | Apple SpeechAnalyzer (iOS 26+), Whisper fallback |
| AI/NLU | Gemini 2.5 Flash |
| Maps | Apple Maps via react-native-maps |
| Place Data | Google Places API (New) |
| Payments | Stripe Connect (Apple Pay) |
| Notifications | OneSignal |

## Project Structure

```
opus-scout/
├── README.md                          # This file
├── docs/
│   ├── PHASE_1_FOUNDATION.md          # Weeks 1-3: Setup, Auth, Navigation
│   ├── PHASE_2_CORE_FEATURES.md       # Weeks 4-7: Discovery, Voice, Maps
│   ├── PHASE_3_BOOKING_SYSTEM.md      # Weeks 8-9: Payments, QR Codes
│   ├── PHASE_4_INTELLIGENCE.md        # Week 10: Calendar, Trips, Notifications
│   └── PHASE_5_POLISH_LAUNCH.md       # Weeks 11-12: Testing, App Store
├── Scout_Fitness_App_Complete_Technical_Blueprint_November_2025-2.md
│                                      # Complete technical specification
└── app/                               # Expo application (created in Phase 1)
```

## Development Phases

| Phase | Name | Weeks | Status | Document |
|-------|------|-------|--------|----------|
| 1 | Foundation | 1-3 | Not Started | [PHASE_1_FOUNDATION.md](docs/PHASE_1_FOUNDATION.md) |
| 2 | Core Features | 4-7 | Not Started | [PHASE_2_CORE_FEATURES.md](docs/PHASE_2_CORE_FEATURES.md) |
| 3 | Booking System | 8-9 | Not Started | [PHASE_3_BOOKING_SYSTEM.md](docs/PHASE_3_BOOKING_SYSTEM.md) |
| 4 | Intelligence | 10 | Not Started | [PHASE_4_INTELLIGENCE.md](docs/PHASE_4_INTELLIGENCE.md) |
| 5 | Polish & Launch (iOS) | 11-12 | Not Started | [PHASE_5_POLISH_LAUNCH.md](docs/PHASE_5_POLISH_LAUNCH.md) |
| — | Android Launch | Post-Launch | Deferred | *To be created* |

## Quick Start

### Prerequisites

- Node.js 20+
- Expo CLI (`npm install -g expo-cli`)
- Supabase CLI (`npm install -g supabase`)
- Xcode (for iOS Simulator)
- EAS CLI (`npm install -g eas-cli`)

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/Zchasse63/opus-scout.git
cd opus-scout

# Install dependencies (after app is scaffolded in Phase 1)
npm install

# Link Supabase project
supabase link --project-ref wxepvxrpkaehqkujzzqn

# Start development server
npx expo start
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://wxepvxrpkaehqkujzzqn.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Google APIs
EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=your_places_api_key
GOOGLE_PLACES_API_KEY=your_places_api_key_for_edge_functions

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# OneSignal
ONESIGNAL_APP_ID=your_onesignal_app_id
```

## Documentation

- [Complete Technical Blueprint](Scout_Fitness_App_Complete_Technical_Blueprint_November_2025-2.md) - Full specification document
- [Phase 1: Foundation](docs/PHASE_1_FOUNDATION.md) - Project setup, authentication, navigation
- [Phase 2: Core Features](docs/PHASE_2_CORE_FEATURES.md) - Gym discovery, voice search, maps
- [Phase 3: Booking System](docs/PHASE_3_BOOKING_SYSTEM.md) - Payments, QR codes, booking flow
- [Phase 4: Intelligence](docs/PHASE_4_INTELLIGENCE.md) - Calendar integration, trips, notifications
- [Phase 5: Polish & Launch](docs/PHASE_5_POLISH_LAUNCH.md) - Testing, optimization, app store submission

## External Resources

- [Expo Documentation](https://docs.expo.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [Google Places API (New)](https://developers.google.com/maps/documentation/places/web-service)
- [Gemini API](https://ai.google.dev/gemini-api/docs)
- [Stripe Connect](https://stripe.com/docs/connect)
- [Apple SpeechAnalyzer](https://developer.apple.com/documentation/speech/speechanalyzer)

## Repository

- **GitHub**: https://github.com/Zchasse63/opus-scout.git
- **Supabase Project**: wxepvxrpkaehqkujzzqn

## Contributing

This is a private project. If you're a developer joining the team:

1. Read the [Complete Technical Blueprint](Scout_Fitness_App_Complete_Technical_Blueprint_November_2025-2.md)
2. Check the current phase document for active tasks
3. Review the completion summary of previous phases for context
4. Follow the established patterns and conventions

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 0.0.1 | November 25, 2025 | Project initialization, documentation setup |

---

*Last Updated: November 25, 2025*
