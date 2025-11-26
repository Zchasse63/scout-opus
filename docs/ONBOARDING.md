# Scout Developer Onboarding Guide

> Quick start guide for developers joining the Scout project

[![Status](https://img.shields.io/badge/Status-In%20Development-yellow)]()
[![Last Updated](https://img.shields.io/badge/Last%20Updated-November%2026%2C%202025-green)]()

---

## Welcome to Scout

Scout is a travel-focused fitness discovery and booking platform ("Airbnb for Gyms"). This guide will help you get up to speed quickly.

> **See the main [README.md](../README.md) for full project documentation.**

## First Steps

1. **Read the main README** - [../README.md](../README.md) for project overview
2. **Review current status** - [NEXT_STEPS.md](NEXT_STEPS.md) for active tasks
3. **Understand the architecture** - [Scout_Fitness_App_Complete_Technical_Blueprint_November_2025-2.md](Scout_Fitness_App_Complete_Technical_Blueprint_November_2025-2.md)

## Development Phases

| Phase | Name | Status | Document |
|-------|------|--------|----------|
| 1 | Foundation | ~60% Complete | [PHASE_1_FOUNDATION.md](PHASE_1_FOUNDATION.md) |
| 2 | Core Features | ~40% Complete | [PHASE_2_CORE_FEATURES.md](PHASE_2_CORE_FEATURES.md) |
| 3 | Booking System | ~25% Complete | [PHASE_3_BOOKING_SYSTEM.md](PHASE_3_BOOKING_SYSTEM.md) |
| 4 | Intelligence | ~20% Complete | [PHASE_4_INTELLIGENCE.md](PHASE_4_INTELLIGENCE.md) |
| 5 | Polish & Launch | ~5% Complete | [PHASE_5_POLISH_LAUNCH.md](PHASE_5_POLISH_LAUNCH.md) |
| 6 | Data Pipeline | Post-MVP | [PHASE_6_DATA_PIPELINE.md](PHASE_6_DATA_PIPELINE.md) |
| 7 | Partner Portal | ~90% Complete | [PHASE_7_PARTNER_PORTAL.md](PHASE_7_PARTNER_PORTAL.md) |
| 8 | Admin Portal | ~90% Complete | [PHASE_8_ADMIN_PORTAL.md](PHASE_8_ADMIN_PORTAL.md) |

> **iOS-First Approach:** Android development is deferred to post-launch.

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

## Key Documentation

| Document | Purpose |
|----------|---------|
| [README.md](../README.md) | Main project documentation |
| [NEXT_STEPS.md](NEXT_STEPS.md) | Current tasks and priorities |
| [AUDIT_REMEDIATION_PLAN.md](AUDIT_REMEDIATION_PLAN.md) | Known issues and fixes |
| [Technical Blueprint](Scout_Fitness_App_Complete_Technical_Blueprint_November_2025-2.md) | Full specification |

## External Resources

- [Expo Documentation](https://docs.expo.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [Google Places API (New)](https://developers.google.com/maps/documentation/places/web-service)
- [Gemini API](https://ai.google.dev/gemini-api/docs)
- [Stripe Connect](https://stripe.com/docs/connect)

## Repository

- **GitHub**: https://github.com/Zchasse63/scout-opus.git
- **Supabase Project**: wxepvxrpkaehqkujzzqn

## Getting Help

1. Check [NEXT_STEPS.md](NEXT_STEPS.md) for current priorities
2. Review phase documents for detailed task breakdowns
3. Check [AUDIT_REMEDIATION_PLAN.md](AUDIT_REMEDIATION_PLAN.md) for known issues

---

*Last Updated: November 26, 2025*
