# Scout Fitness App - Test Inventory

**Document Date:** 2025-11-27  
**Status:** Complete Inventory

---

## Overview

This document provides a comprehensive inventory of all testable units in the Scout Fitness App, organized by priority level and component type. Each entry includes:
- **Priority Level**: CRITICAL (P1), HIGH (P2), MEDIUM (P3), LOW (P4)
- **Current Coverage**: Existing test status
- **Test Type**: Unit, Integration, E2E
- **Estimated Effort**: Hours to implement
- **Key Test Cases**: What should be tested

---

## CRITICAL PRIORITY (P1) - MUST TEST FIRST

### Authentication & Authorization

| Component | Path | Coverage | Effort | Key Test Cases |
|-----------|------|----------|--------|-----------------|
| LoginScreen | `app/(auth)/login.tsx` | 0% | 3h | OAuth flows (Apple/Google), email validation, error handling, redirect on success |
| useAuth Hook | `hooks/useAuth.ts` | 0% | 2h | Login, logout, session refresh, user state |
| authStore | `stores/authStore.ts` | 6.45% | 1h | Set/clear user, token management, auth state |

### Search & Discovery

| Component | Path | Coverage | Effort | Key Test Cases |
|-----------|------|----------|--------|-----------------|
| ExploreTab | `app/(tabs)/index.tsx` | 0% | 4h | Render, search interaction, view toggle (list/map), gym press |
| SearchTray | `components/search/SearchTray.tsx` | 0% | 3h | Input handling, filter application, voice search trigger |
| GymCard | `components/explore/GymCard.tsx` | 0% | 2h | Render gym data, press handler, save toggle |
| useGymSearch | `hooks/useGymSearch.ts` | 0% | 2h | Search query, filter logic, results transformation |
| GymMap | `components/explore/GymMap.tsx` | 0% | 3h | Map rendering, markers, press handlers |

### Booking Flow

| Component | Path | Coverage | Effort | Key Test Cases |
|-----------|------|----------|--------|-----------------|
| BookingFlow | `app/booking/[id].tsx` | 0% | 4h | Pass selection, date picker, price calculation, navigation |
| CheckoutForm | `components/booking/CheckoutForm.tsx` | 0% | 3h | Form validation, submission, error handling |
| PaymentScreen | `app/booking/payment.tsx` | 0% | 4h | Stripe integration, payment processing, error handling |
| usePayment | `hooks/usePayment.ts` | 0% | 3h | Payment intent creation, confirmation, error handling |
| useBookings | `hooks/useBookings.ts` | 8.33% | 1h | Fetch bookings, create booking, data transformation |

### Gym Details

| Component | Path | Coverage | Effort | Key Test Cases |
|-----------|------|----------|--------|-----------------|
| GymDetail | `app/gym/[id].tsx` | 0% | 4h | Gym data display, amenities, reviews, booking CTA |
| GymCard (Detail) | `components/gym/GymCard.tsx` | 0% | 2h | Render gym info, images, ratings |

### State Management (Stores)

| Store | Path | Coverage | Effort | Key Test Cases |
|-------|------|----------|--------|-----------------|
| bookingStore | `stores/bookingStore.ts` | 100% ✅ | 0h | Already complete |
| authStore | `stores/authStore.ts` | 6.45% | 1h | User state, token, logout |
| searchStore | `stores/searchStore.ts` | 12.5% | 1h | Query, filters, results |

---

## HIGH PRIORITY (P2) - TEST SECOND

### Passes & Bookings Management

| Component | Path | Coverage | Effort | Key Test Cases |
|-----------|------|----------|--------|-----------------|
| PassesTab | `app/(tabs)/passes.tsx` | 0% | 3h | Booking list, sections (active/upcoming/past), QR modal |
| QRPass | `components/booking/QRPass.tsx` | 0% | 2h | QR code display, brightness control, wallet button |
| PassCard | `components/booking/PassCard.tsx` | 0% | 2h | Pass display, status badge, action buttons |
| EnhancedBookingCard | `components/booking/EnhancedBookingCard.tsx` | 0% | 2h | Booking info display, actions |

### Trips & Travel Planning

| Component | Path | Coverage | Effort | Key Test Cases |
|-----------|------|----------|--------|-----------------|
| TripsTab | `app/(tabs)/trips.tsx` | 0% | 3h | Trip list, sections (active/upcoming/past), create button |
| TripCard | `components/trips/TripCard.tsx` | 0% | 2h | Trip display, destination, dates, gym count |
| useTrips | `hooks/useTrips.ts` | 0% | 2h | Fetch trips, create trip, delete trip |
| tripsStore | `stores/tripsStore.ts` | 70% | 1h | Trip state management |

### Search & Filters

| Component | Path | Coverage | Effort | Key Test Cases |
|-----------|------|----------|--------|-----------------|
| FilterCarousel | `components/search/FilterCarousel.tsx` | 0% | 2h | Filter chips, toggle, apply |
| useGymSearch | `hooks/useGymSearch.ts` | 0% | 2h | Search logic, filtering, sorting |

### Notifications

| Hook | Path | Coverage | Effort | Key Test Cases |
|------|------|----------|--------|-----------------|
| useNotifications | `hooks/useNotifications.ts` | 51.89% | 1h | Permission handling, local notifications, scheduling |

### Stores

| Store | Path | Coverage | Effort | Key Test Cases |
|-------|------|----------|--------|-----------------|
| gamificationStore | `stores/gamificationStore.ts` | 26.6% | 1h | Points, achievements, streaks |
| mapStore | `stores/mapStore.ts` | 0% | 1h | View mode, region, markers |

---

## MEDIUM PRIORITY (P3) - TEST THIRD

### Profile & Settings

| Component | Path | Coverage | Effort | Key Test Cases |
|-----------|------|----------|--------|-----------------|
| ProfileTab | `app/(tabs)/profile.tsx` | 0% | 3h | User info display, navigation, logout |
| ProfileEdit | `app/profile/edit.tsx` | 0% | 2h | Form validation, submission, image upload |
| ProfileAccount | `app/profile/account.tsx` | 0% | 2h | Account settings, password change |
| ProfileNotifications | `app/profile/notifications.tsx` | 0% | 1h | Notification preferences |
| ProfilePaymentMethods | `app/profile/payment-methods.tsx` | 0% | 2h | Saved cards, add/remove |

### Booking Components

| Component | Path | Coverage | Effort | Key Test Cases |
|-----------|------|----------|--------|-----------------|
| PassTypeSelector | `components/booking/PassTypeSelector.tsx` | 0% | 1h | Selection state, price display |
| DatePicker | `components/booking/DatePicker.tsx` | 0% | 2h | Date selection, availability |
| CalendarPicker | `components/booking/CalendarPicker.tsx` | 0% | 2h | Calendar display, date range |
| PriceBreakdown | `components/booking/PriceBreakdown.tsx` | 0% | 1h | Price calculation, fees |
| WaiverModal | `components/booking/WaiverModal.tsx` | 0% | 1h | Modal display, accept/decline |
| ConfirmationScreen | `app/booking/confirmation.tsx` | 0% | 2h | Success state, QR display, next steps |

### Hooks

| Hook | Path | Coverage | Effort | Key Test Cases |
|------|------|----------|--------|-----------------|
| useCalendarSync | `hooks/useCalendarSync.ts` | 81.25% | 0.5h | Calendar sync, event creation |
| useSavedGyms | `hooks/useSavedGyms.ts` | 0% | 1h | Save/unsave gym, list saved |
| useGym | `hooks/useGym.ts` | 0% | 1h | Fetch gym details, reviews |
| useVoiceSearch | `hooks/useVoiceSearch.ts` | 0% | 2h | Voice input, intent parsing, search |

### UI Components

| Component | Path | Coverage | Effort | Key Test Cases |
|-----------|------|----------|--------|-----------------|
| Button | `components/ui/Button.tsx` | 89.74% ✅ | 0h | Already complete |
| Card | `components/ui/Card.tsx` | 64.7% ✅ | 0h | Already complete |
| Badge | `components/ui/Badge.tsx` | 100% ✅ | 0h | Already complete |
| Avatar | `components/ui/Avatar.tsx` | 0% | 1h | Image display, fallback |
| Skeleton | `components/ui/Skeleton.tsx` | 0% | 1h | Loading states |
| EmptyState | `components/ui/EmptyState.tsx` | 0% | 1h | Empty state display, action |

---

## LOW PRIORITY (P4) - TEST LAST

### Utility Functions

| Module | Path | Coverage | Effort | Key Test Cases |
|--------|------|----------|--------|-----------------|
| voiceFilterParser | `utils/voiceFilterParser.ts` | 0% | 2h | Intent parsing, filter extraction |
| security | `utils/security.ts` | 0% | 1h | Sanitization, validation |
| accessibility | `utils/accessibility.ts` | 0% | 1h | A11y helpers |
| haptics | `utils/haptics.ts` | 0% | 0.5h | Haptic feedback |
| performance | `utils/performance.ts` | 0% | 0.5h | Performance utilities |

### Services

| Service | Path | Coverage | Effort | Key Test Cases |
|---------|------|----------|--------|-----------------|
| calendar | `services/calendar.ts` | 0% | 1h | Calendar operations |
| notifications | `services/notifications.ts` | 0% | 1h | Notification service |
| payment | `services/payment.ts` | 0% | 1h | Payment operations |

### Additional Components

| Component | Path | Coverage | Effort | Key Test Cases |
|-----------|------|----------|--------|-----------------|
| ViewToggleFAB | `components/explore/ViewToggleFAB.tsx` | 0% | 1h | Toggle state, icon |
| PhotoCarousel | `components/explore/PhotoCarousel.tsx` | 0% | 1h | Image carousel, navigation |
| HeroSection | `components/explore/HeroSection.tsx` | 0% | 1h | Hero display |
| ReviewCard | `components/gym/ReviewCard.tsx` | 0% | 1h | Review display |
| ReviewsList | `components/gym/ReviewsList.tsx` | 0% | 1h | Reviews list, pagination |
| RatingBreakdown | `components/gym/RatingBreakdown.tsx` | 0% | 1h | Rating display |

### Stores

| Store | Path | Coverage | Effort | Key Test Cases |
|-------|------|----------|--------|-----------------|
| themeStore | `stores/themeStore.ts` | 88.23% | 0.5h | Theme toggle |

---

## INTEGRATION TESTS (Cross-Component)

### Critical User Flows

| Flow | Components | Effort | Key Test Cases |
|------|-----------|--------|-----------------|
| Complete Booking | SearchTray → GymDetail → BookingFlow → Payment → Confirmation | 4h | End-to-end booking |
| Search & Discovery | ExploreTab → SearchTray → GymCard → GymDetail | 3h | Search to detail view |
| Trip Planning | TripsTab → TripCreate → TripDetail → GymList | 3h | Trip creation and viewing |
| Authentication | LoginScreen → OAuth → ExploreTab | 2h | Full auth flow |
| Pass Management | PassesTab → QRPass → Wallet Integration | 2h | Pass viewing and wallet |

---

## E2E TESTS (End-to-End)

### Critical User Journeys

| Journey | Platforms | Effort | Key Test Cases |
|---------|-----------|--------|-----------------|
| New User Onboarding | iOS, Android | 3h | Sign up, first search, first booking |
| Booking Complete Flow | iOS, Android | 3h | Search → Book → Pay → QR Scan |
| Trip Planning | iOS, Android | 2h | Create trip, view gyms, book |
| Pass Validation | iOS, Android | 2h | Show QR, gym staff scan, validation |

---

## API INTEGRATION TESTS

### Supabase Edge Functions (18 total)

| Function | Endpoint | Effort | Key Test Cases |
|----------|----------|--------|-----------------|
| payments-create-intent | POST /payments/create-intent | 2h | Create payment intent, error handling |
| payments-webhook | POST /payments/webhook | 2h | Webhook processing, booking creation |
| places-search | POST /places/search | 2h | Search gyms, filtering, pagination |
| places-details | POST /places/details | 1h | Fetch gym details, reviews |
| places-photos | POST /places/photos | 1h | Fetch gym photos |
| voice-process-query | POST /voice/process-query | 2h | Voice intent parsing |
| bookings-validate-qr | POST /bookings/validate-qr | 1h | QR validation, pass marking |
| gym-personalize | POST /gym/personalize | 1h | Personalization logic |
| gym-page | POST /gym/page | 1h | Gym page data |
| trips-sync-calendar | POST /trips/sync-calendar | 1h | Calendar sync |
| trips-nearby-gyms | POST /trips/nearby-gyms | 1h | Nearby gyms for trip |
| reviews-fetch | POST /reviews/fetch | 1h | Fetch reviews |
| reviews-submit | POST /reviews/submit | 1h | Submit review |
| gamification-update | POST /gamification/update | 1h | Update points/achievements |
| notifications-send | POST /notifications/send | 1h | Send notification |
| analytics-track | POST /analytics/track | 0.5h | Track event |
| auth-verify-token | POST /auth/verify-token | 1h | Token verification |
| auth-refresh | POST /auth/refresh | 1h | Token refresh |

---

## SUMMARY BY PRIORITY

| Priority | Count | Total Effort | Status |
|----------|-------|--------------|--------|
| P1 (CRITICAL) | 18 | 40h | Not Started |
| P2 (HIGH) | 20 | 30h | Not Started |
| P3 (MEDIUM) | 30 | 28h | Not Started |
| P4 (LOW) | 21 | 14h | Not Started |
| Integration Tests | 5 | 14h | Not Started |
| E2E Tests | 4 | 10h | Not Started |
| API Integration | 18 | 20h | Not Started |
| **TOTAL** | **116** | **156h** | - |

---

## IMPLEMENTATION ROADMAP

### Phase 1: Critical Path (Week 1-2)
- Fix failing tests (2h) ✅ DONE
- P1 Components & Hooks (40h)
- P1 Integration Tests (8h)
- **Subtotal: 50h**

### Phase 2: High Priority (Week 3-4)
- P2 Components & Hooks (30h)
- P2 Integration Tests (6h)
- **Subtotal: 36h**

### Phase 3: Medium Priority (Week 5-6)
- P3 Components & Hooks (28h)
- P3 Integration Tests (6h)
- **Subtotal: 34h**

### Phase 4: Low Priority & E2E (Week 7-8)
- P4 Components & Utilities (14h)
- E2E Tests (10h)
- API Integration Tests (20h)
- **Subtotal: 44h**

---

## NOTES

- **Coverage Target**: 60% (currently 7.11%)
- **Test Framework**: Jest + React Testing Library + Detox
- **Mock Strategy**: Minimal mocks, use MSW for APIs
- **Effort Estimates**: Based on component complexity and test coverage requirements
- **Dependencies**: Some tests depend on others (e.g., booking tests depend on auth tests)

See `TEST_ACTION_PLAN.md` for detailed implementation timeline and `TEST_IMPLEMENTATION_GUIDE.md` for code examples.

