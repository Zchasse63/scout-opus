# Scout App - Implementation Roadmap

This document outlines all remaining work to complete the Scout app. The foundational architecture (Phases 1-5) is complete. This roadmap covers integration, wiring, and production-readiness tasks.

---

## Status Summary

| Area | Completion | Notes |
|------|------------|-------|
| Database Schema | 100% | All tables, RLS, functions deployed |
| Auth Flow | 90% | UI complete, needs testing |
| UI Components | 95% | All screens built |
| Data Fetching | 20% | Using mock data, needs Supabase wiring |
| Payments | 30% | Edge Function exists, needs Stripe SDK |
| Calendar Sync | 10% | expo-calendar installed, not wired |
| Notifications | 0% | Not installed |

---

## Phase 6: Data Integration

**Goal:** Replace all mock data with live Supabase queries using TanStack Query.

### 6.1 Gym Data Fetching
| Task | File(s) | Priority |
|------|---------|----------|
| Create `useGym` hook to fetch single gym by ID | `hooks/useGym.ts` | High |
| Create `useGymsNearby` hook using `search_gyms_nearby` RPC | `hooks/useGymsNearby.ts` | High |
| Wire gym detail screen to fetch real data | `app/gym/[id].tsx` | High |
| Wire booking screen to fetch gym by ID | `app/booking/[id].tsx` | High |
| Calculate actual distance from user location | `app/gym/[id].tsx` | Medium |

### 6.2 Booking Data Fetching
| Task | File(s) | Priority |
|------|---------|----------|
| Create `useBookings` hook to fetch user's bookings | `hooks/useBookings.ts` | High |
| Wire Passes tab to display real bookings | `app/(tabs)/passes.tsx` | High |
| Implement booking creation mutation | `hooks/useCreateBooking.ts` | High |

### 6.3 Trips Data Fetching
| Task | File(s) | Priority |
|------|---------|----------|
| Create `useTrips` hook to fetch user's travel periods | `hooks/useTrips.ts` | High |
| Wire Trips tab to display real trips | `app/(tabs)/trips.tsx` | High |
| Implement trip creation/dismissal mutations | `hooks/useTrips.ts` | Medium |

### 6.4 Saved Gyms
| Task | File(s) | Priority |
|------|---------|----------|
| Wire `useSavedGyms` hook to Supabase | `hooks/useSavedGyms.ts` | Medium |
| Persist saved gyms to database | `hooks/useSavedGyms.ts` | Medium |

---

## Phase 7: Payments Integration

**Goal:** Complete Stripe Connect integration for gym payments.

### 7.1 Client-Side Stripe
| Task | File(s) | Priority |
|------|---------|----------|
| Install `@stripe/stripe-react-native` | `package.json` | High |
| Configure Stripe provider in app root | `app/_layout.tsx` | High |
| Implement Stripe Payment Sheet UI | `app/booking/payment.tsx` | High |
| Handle payment confirmation flow | `app/booking/payment.tsx` | High |

### 7.2 Server-Side Stripe (Edge Functions)
| Task | File(s) | Priority |
|------|---------|----------|
| Add Stripe SDK to payments Edge Function | `supabase/functions/payments-create-intent/index.ts` | High |
| Fetch gym's Stripe connected account from DB | `supabase/functions/payments-create-intent/index.ts` | High |
| Implement proper PaymentIntent creation with transfers | `supabase/functions/payments-create-intent/index.ts` | High |
| Add webhook handler for payment events | `supabase/functions/payments-webhook/index.ts` | Medium |

### 7.3 QR Code Validation
| Task | File(s) | Priority |
|------|---------|----------|
| Wire QR validation Edge Function to Supabase | `supabase/functions/bookings-validate-qr/index.ts` | Medium |
| Implement QR code modal in Passes tab | `app/(tabs)/passes.tsx` | Medium |

### 7.4 Apple Wallet (Optional)
| Task | File(s) | Priority |
|------|---------|----------|
| Research PassKit/pkpass generation | N/A | Low |
| Implement Apple Wallet pass generation | `app/booking/confirmation.tsx` | Low |
| Wire "Add to Wallet" buttons | `app/(tabs)/passes.tsx` | Low |

---

## Phase 8: Calendar & Trips

**Goal:** Automatically detect trips from user's calendar and suggest gyms.

### 8.1 Calendar Integration
| Task | File(s) | Priority |
|------|---------|----------|
| Create `useCalendarSync` hook | `hooks/useCalendarSync.ts` | Medium |
| Request calendar permissions | `hooks/useCalendarSync.ts` | Medium |
| Read iOS calendar events with expo-calendar | `hooks/useCalendarSync.ts` | Medium |
| Extract travel destinations from events | `hooks/useCalendarSync.ts` | Medium |
| Wire "Sync Calendar" button in Trips tab | `app/(tabs)/trips.tsx` | Medium |

### 8.2 Trip-to-Gym Navigation
| Task | File(s) | Priority |
|------|---------|----------|
| Implement "View Gyms" from trip card | `app/(tabs)/trips.tsx` | Medium |
| Navigate to Explore with location filter | `app/(tabs)/trips.tsx` | Medium |
| Use `get_trip_gyms` RPC for nearby results | `hooks/useGymsNearby.ts` | Medium |

---

## Phase 9: Push Notifications

**Goal:** Notify users about upcoming trips and booking reminders.

### 9.1 Client-Side Setup
| Task | File(s) | Priority |
|------|---------|----------|
| Install `expo-notifications` | `package.json` | Medium |
| Create notification permission request flow | `hooks/useNotifications.ts` | Medium |
| Register for push notifications | `hooks/useNotifications.ts` | Medium |
| Handle notification tap navigation | `app/_layout.tsx` | Medium |

### 9.2 Server-Side Notifications
| Task | File(s) | Priority |
|------|---------|----------|
| Set up OneSignal account and get credentials | N/A | Medium |
| Add OneSignal env vars to Supabase | Supabase Dashboard | Medium |
| Test travel alert Edge Function | `supabase/functions/notifications-travel-alert/index.ts` | Medium |
| Create booking reminder Edge Function | `supabase/functions/notifications-booking-reminder/index.ts` | Low |

---

## Phase 10: Testing & Polish

**Goal:** Ensure app is stable and production-ready.

### 10.1 Unit Tests
| Task | File(s) | Priority |
|------|---------|----------|
| Add tests for `useGym` hook | `__tests__/hooks/useGym.test.ts` | Low |
| Add tests for `useBookings` hook | `__tests__/hooks/useBookings.test.ts` | Low |
| Add tests for `useTrips` hook | `__tests__/hooks/useTrips.test.ts` | Low |
| Increase coverage threshold to 80% | `jest.config.js` | Low |

### 10.2 E2E Tests
| Task | File(s) | Priority |
|------|---------|----------|
| Set up Detox configuration | `detox.config.js` | Low |
| Write booking flow E2E test | `e2e/booking.e2e.js` | Low |
| Write auth flow E2E test | `e2e/auth.e2e.js` | Low |

### 10.3 Error Handling & Edge Cases
| Task | File(s) | Priority |
|------|---------|----------|
| Add error boundaries to screens | `components/ErrorBoundary.tsx` | Medium |
| Handle offline state gracefully | Various | Medium |
| Add loading skeletons to lists | Various | Low |

---

## Implementation Order (Recommended)

```
Week 1: Phase 6 (Data Integration)
├── 6.1 Gym fetching hooks
├── 6.2 Booking fetching hooks
└── 6.3 Trips fetching hooks

Week 2: Phase 7 (Payments)
├── 7.1 Stripe SDK setup
├── 7.2 Payment flow completion
└── 7.3 QR validation

Week 3: Phase 8 & 9 (Calendar & Notifications)
├── 8.1 Calendar sync
├── 8.2 Trip navigation
└── 9.1 Push notification setup

Week 4: Phase 10 (Testing & Polish)
├── 10.1 Unit tests
├── 10.2 E2E tests
└── 10.3 Error handling
```

---

## Environment Variables Needed

```bash
# Already configured
EXPO_PUBLIC_SUPABASE_URL=https://wxepvxrpkaehqkujzzqn.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# Need to add
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...  # Edge Function secret
ONESIGNAL_APP_ID=...
ONESIGNAL_API_KEY=...
GOOGLE_PLACES_API_KEY=AIzaSyAxLUAq-pFXbZOYtgr1c9YUiu7NKv7Nd4g
```

---

## Quick Reference: File Locations

| Category | Path |
|----------|------|
| Screens | `app/` |
| Components | `components/` |
| Hooks | `hooks/` |
| Stores (Zustand) | `stores/` |
| Types | `types/` |
| Constants | `constants/` |
| Supabase Client | `lib/supabase.ts` |
| Edge Functions | `supabase/functions/` |
| Migrations | `supabase/migrations/` |
| Tests | `__tests__/` |
