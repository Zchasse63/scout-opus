# Scout Fitness App - Comprehensive Integration Audit

**Audit Date:** 2025-11-26
**Last Updated:** 2025-11-26
**Auditor:** Senior Full-Stack Architect
**App Version:** Phase 5 Complete

---

## Executive Summary

This audit analyzes the Scout fitness app ("Airbnb for Gyms") for integration integrity across all layers. The app is a React Native/Expo application with Supabase backend and 17 Edge Functions.

### Overall Health: ✅ CRITICAL ISSUES FIXED

| Category | Status | Issues |
|----------|--------|--------|
| Tech Stack | ✅ Good | None |
| API Integration | ✅ Fixed | ~~3 contract mismatches~~ → All fixed |
| Database | ✅ Fixed | ~~2 schema inconsistencies~~ → Migration created |
| Auth Flow | ✅ Good | None |
| External APIs | ⚠️ Issues | Missing error handling |
| Configuration | ⚠️ Issues | 5 missing env vars |

### ✅ Critical Issues Fixed (Nov 26, 2025)

| Issue | Fix Applied |
|-------|-------------|
| Payment function name mismatch | `services/payment.ts` → `payments-create-intent` |
| Partners table missing gym_id | `migrations/004_add_gym_id_to_partners.sql` |
| Voice search flow broken | `hooks/useVoiceSearch.ts` → calls transcribe first |

---

## Phase 0: Architecture Discovery

### Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Frontend** | React Native | 0.81.5 |
| **Framework** | Expo SDK | 54.0.25 |
| **Language** | TypeScript | 5.3.3 |
| **Routing** | Expo Router | 4.x |
| **State** | Zustand | 5.x |
| **Data Fetching** | TanStack Query | 5.x |
| **Backend** | Supabase Edge Functions | Deno |
| **Database** | PostgreSQL + PostGIS | 15.x |
| **Auth** | Supabase Auth | 2.x |
| **Payments** | Stripe Connect | 14.x |
| **Error Tracking** | Sentry | 7.2.0 |
| **Analytics** | Mixpanel | 3.1.2 |

### Codebase Structure

```
scout-app/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Login, callback
│   ├── (tabs)/            # Main tabs (explore, passes, trips, profile)
│   ├── booking/           # Booking flow
│   └── gym/               # Gym details
├── components/            # UI components (40+ files)
├── hooks/                 # Custom hooks (11 files)
├── stores/                # Zustand stores (8 files)
├── services/              # Business logic (3 files)
├── lib/                   # Core utilities (7 files)
├── supabase/
│   ├── functions/         # 17 Edge Functions
│   └── migrations/        # 3 SQL migrations
└── types/                 # TypeScript definitions
```

### Database Schema (27+ Tables)

**Core Tables:** users, gyms, bookings, reviews, travel_periods, voice_queries, saved_gyms, amenities, gym_amenities, gym_hours, gym_photos

**Phase 3 Tables:** partners, partner_applications, support_tickets, ticket_messages, gym_reviews, gym_verification_queue, gym_claims, verification_requests, passes, scraping_queue, user_stats, user_achievements, user_activity_log, admin_notifications

---

## Section 1: Backend API Mapping

### Edge Functions Inventory (17 Total)

| Function | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `places-search` | POST | Google Places text search | No |
| `places-details` | POST | Google Places details | No |
| `places-photos` | POST | Google Places photos | No |
| `payments-create-intent` | POST | Create Stripe PaymentIntent | Yes |
| `payments-webhook` | POST | Stripe webhook handler | No (signature) |
| `bookings-validate-qr` | POST | QR code validation | Yes |
| `voice-transcribe` | POST | Whisper transcription | Yes |
| `voice-process-query` | POST | Gemini intent parsing | No |
| `send-email` | POST | Resend email notifications | Yes |
| `send-push` | POST | Expo push notifications | Yes |
| `notify-admin` | POST | Slack/email admin alerts | Yes |
| `stripe-connect-onboarding` | POST | Partner Stripe setup | Yes |
| `tally-webhook` | POST | Tally form submissions | No |
| `firecrawl-scrape` | POST | Web scraping queue | Yes |
| `gym-page` | GET | Public gym page data | No |
| `calendar-extract-destination` | POST | Calendar travel detection | Yes |
| `notifications-travel-alert` | POST | Travel notification trigger | Yes |

---

## Section 2: Frontend API Integration Mapping

### Hooks → Edge Functions

| Hook | Edge Function Called | Status |
|------|---------------------|--------|
| `useGymSearch` | `places-search` | ⚠️ Response mismatch |
| `usePayment` | `create-payment-intent` | ❌ Wrong function name |
| `useVoiceSearch` | `voice-process-query` | ⚠️ Missing transcribe step |
| `useBookings` | Direct Supabase | ✅ OK |
| `useTrips` | Direct Supabase | ✅ OK |
| `useSavedGyms` | Direct Supabase | ✅ OK |
| `useGym` | Direct Supabase | ✅ OK |

### Stores → Database Tables

| Store | Tables Accessed | Status |
|-------|-----------------|--------|
| `authStore` | `auth.users` | ✅ OK |
| `searchStore` | `places-search` (Edge) | ✅ OK |
| `bookingStore` | In-memory only | ✅ OK |
| `gamificationStore` | `user_stats` | ⚠️ Column mismatch |
| `tripStore` | `travel_periods` | ✅ OK |
| `mapStore` | In-memory only | ✅ OK |
| `themeStore` | In-memory only | ✅ OK |

---

## Section 3: Database Integration Audit

### Schema vs Code Type Mismatches

#### 🟡 Moderate: `bookings` Table Type Mismatch

**Database Schema (001_initial_schema.sql):**
```sql
CREATE TABLE bookings (
  id BIGINT PRIMARY KEY,         -- Number type
  status TEXT CHECK (status IN ('confirmed', 'used', 'cancelled')),
  -- Has: stripe_payment_intent_id, platform_fee, gym_payout ✅
);
```

**TypeScript Type (types/index.ts):**
```typescript
interface Booking {
  id: string;                    // ⚠️ Should be number (BIGINT)
  status: 'pending' | 'confirmed' | 'used' | 'cancelled' | 'expired';
  // ⚠️ 'pending' and 'expired' not in DB CHECK constraint
}
```

**Impact:** Type coercion works but status values may be rejected by DB.

#### 🔴 Critical: `user_stats` Table

**Database Schema (003_missing_tables.sql):**
```sql
CREATE TABLE user_stats (
  user_id UUID PRIMARY KEY,
  total_points INTEGER,
  current_level INTEGER,
  current_streak INTEGER,
  longest_streak INTEGER,
  cities_visited TEXT[],        -- Array of city names
  unique_gyms_visited INTEGER,
  reviews_submitted INTEGER,
  photos_submitted INTEGER
);
```

**gamificationStore.ts expects:**
```typescript
{
  gyms_visited: number,         // ❌ Column is unique_gyms_visited
  total_workouts: number,       // ❌ Column doesn't exist
  unlocked_badges: string[],    // ❌ Column doesn't exist
}
```

**Impact:** Gamification sync will fail silently.

### Missing Foreign Key Relationships

| Table | Missing FK | Should Reference |
|-------|-----------|------------------|
| `partners` | `gym_id` | `gyms(id)` |
| `passes` | `booking_id` | Uses BIGINT but bookings.id is BIGSERIAL |

---

## Section 4: External API Integrations

### API Dependencies

| Service | Purpose | Env Var | Status |
|---------|---------|---------|--------|
| Google Places API | Gym search | `GOOGLE_PLACES_API_KEY` | ✅ Configured |
| Stripe | Payments | `STRIPE_SECRET_KEY` | ⚠️ Missing |
| Stripe | Publishable | `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ⚠️ Empty |
| OpenAI Whisper | Voice transcription | `OPENAI_API_KEY` | ⚠️ Missing |
| Gemini | Intent parsing | `GEMINI_API_KEY` | ⚠️ Missing |
| Resend | Email | `RESEND_API_KEY` | ⚠️ Missing |
| Expo Push | Notifications | `EXPO_PUBLIC_EXPO_PROJECT_ID` | ⚠️ Empty |
| Sentry | Error tracking | `EXPO_PUBLIC_SENTRY_DSN` | ⚠️ Missing |
| Mixpanel | Analytics | `EXPO_PUBLIC_MIXPANEL_TOKEN` | ⚠️ Missing |

### Error Handling Gaps

| Edge Function | Missing Error Handling |
|---------------|----------------------|
| `places-search` | No CORS headers on error |
| `voice-process-query` | No rate limiting |
| `payments-create-intent` | No idempotency key |

---

## Section 5: Complete Data Flow Tracing

### Flow 1: User Search → Booking → Payment

```
1. User types search query
   └─> searchStore.search()
       └─> supabase.functions.invoke('places-search')
           └─> Google Places API
               └─> Transform to SearchResult[]

2. User selects gym
   └─> router.push('/gym/[id]')
       └─> useGym(id) → Direct Supabase query
           ❌ ISSUE: Gym ID from Google Places won't exist in DB

3. User initiates booking
   └─> bookingStore.setSelectedGym()
       └─> router.push('/booking/[id]')

4. User proceeds to payment
   └─> services/payment.createPaymentIntent()
       └─> supabase.functions.invoke('create-payment-intent')
           ❌ ISSUE: Function name is 'payments-create-intent'

5. Payment confirmation
   └─> Stripe webhook → payments-webhook
       └─> Update bookings table
           ❌ ISSUE: Missing columns in schema
```

### Flow 2: Voice Search

```
1. User taps microphone
   └─> useVoiceSearch.startRecording()
       └─> Audio.Recording.createAsync()

2. User stops recording
   └─> useVoiceSearch.stopRecording()
       └─> supabase.functions.invoke('voice-process-query')
           ❌ ISSUE: Sends audioData but function expects transcript

   Expected flow:
   └─> voice-transcribe (Whisper) → transcript
       └─> voice-process-query (Gemini) → intent
```

---

## Section 6: Authentication & Authorization Audit

### Auth Flow

```
1. User taps "Sign in with Apple/Google"
   └─> authStore.signIn(provider)
       └─> supabase.auth.signInWithOAuth()
           └─> Redirect to provider
               └─> Callback to scout://auth-callback

2. Auth state change
   └─> supabase.auth.onAuthStateChange()
       └─> authStore.setState({ user, session })

3. Protected routes
   └─> app/_layout.tsx checks user
       └─> Redirect to /(auth)/login if !user
```

### RLS Policy Coverage

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| users | ✅ Own | ✅ Own | ✅ Own | ❌ None |
| bookings | ✅ Own | ✅ Own | ✅ Own | ❌ None |
| gyms | ✅ All | ❌ Admin | ❌ Admin | ❌ Admin |
| reviews | ✅ All | ✅ Own | ✅ Own | ❌ None |
| user_stats | ✅ All | ✅ Own | ✅ Own | ❌ None |
| passes | ✅ Own | ✅ Own | ❌ None | ❌ None |

---

## Section 7: Configuration & Environment

### Required Environment Variables

```bash
# ✅ Configured
EXPO_PUBLIC_SUPABASE_URL=https://wxepvxrpkaehqkujzzqn.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=AIza...
GOOGLE_PLACES_API_KEY=AIza...

# ⚠️ Missing/Empty (Required for production)
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
OPENAI_API_KEY=
GEMINI_API_KEY=
RESEND_API_KEY=
EXPO_PUBLIC_EXPO_PROJECT_ID=
EXPO_PUBLIC_SENTRY_DSN=
EXPO_PUBLIC_MIXPANEL_TOKEN=

# ❌ Security Issue
SUPABASE_SERVICE_ROLE_KEY=eyJ... # Same as anon key in .env!
```

### Security Concern

The `.env` file shows `SUPABASE_SERVICE_ROLE_KEY` is set to the same value as the anon key. This is incorrect - the service role key should be different and kept secret.

---

## Section 8: Integration Issues Report

### 🔴 Critical Issues (Must Fix Before Launch)

#### Issue 1: Payment Service Function Name Mismatch
**Location:** `services/payment.ts:30`
```typescript
// Current (WRONG)
await supabase.functions.invoke('create-payment-intent', {...})

// Should be
await supabase.functions.invoke('payments-create-intent', {...})
```
**Impact:** All payments will fail with 404.

#### Issue 2: Partners Table Missing gym_id Column
**Location:** `supabase/migrations/003_missing_tables.sql`

The `partners` table has no `gym_id` column, but `payments-create-intent` queries:
```sql
.from("partners").select(...).eq("gym_id", gymId)
```

**Impact:** Payment intent creation will always fail with "Gym partner not found".

#### Issue 3: Voice Search Flow Broken
**Location:** `hooks/useVoiceSearch.ts:70-78`

The hook sends `audioData` directly to `voice-process-query`, but that function expects a `transcript` string (it's for intent parsing, not transcription).

**Fix:** Call `voice-transcribe` first, then `voice-process-query`.

### 🟡 High Priority Issues

#### Issue 4: Gamification Store Column Mismatches
**Location:** `stores/gamificationStore.ts:395-407`

Columns used that don't exist in `user_stats`:
- `gyms_visited` → should be `unique_gyms_visited`
- `total_workouts` → doesn't exist
- `unlocked_badges` → doesn't exist

#### Issue 5: Partners Table Missing gym_id FK
**Location:** `supabase/functions/payments-create-intent/index.ts:63-68`

Query filters by `gym_id` but `partners` table has no `gym_id` column.

#### Issue 6: Gym ID Type Mismatch
**Location:** Multiple files

- Database: `gyms.id` is `BIGSERIAL` (number)
- TypeScript: `Gym.id` is `string`
- Google Places: Returns string IDs like `ChIJ...`

This causes issues when trying to book a gym found via Google Places.

### 🟢 Low Priority Issues

#### Issue 7: Missing CORS Headers
Some Edge Functions don't return CORS headers on error responses.

#### Issue 8: Duplicate Store Files
Both `tripStore.ts` and `tripsStore.ts` exist in `/stores`.

---

## Section 9: Missing or Orphaned Code

### Orphaned Files
| File | Issue |
|------|-------|
| `stores/tripsStore.ts` | Duplicate of `tripStore.ts` |
| `stores/mapStore.ts` | Used but not imported in some components |

### Missing Implementations
| Feature | Status |
|---------|--------|
| `generate_qr_payload` RPC | Referenced in `services/payment.ts` but not defined |
| Stripe Payment Sheet | UI exists but not integrated |
| Push notification registration | Hook exists but not called |
| Calendar sync | Hook exists but not connected to UI |

---

## Section 10: Contract Mismatches

### Edge Function Request/Response Contracts

#### `payments-create-intent`

**Expected Request:**
```typescript
{
  gymId: string;
  userId: string;
  passType: 'day' | 'week' | 'month';
  amount: number;
  bookingDate: string;
  customerEmail?: string;
  customerName?: string;
}
```

**Actual Call (services/payment.ts):**
```typescript
{
  gymId: string;
  passType: string;
  amount: number;
  bookingDate: string;
  userId: string;  // ✅ Matches
  // Missing: customerEmail, customerName
}
```

#### `voice-process-query`

**Expected Request:**
```typescript
{
  transcript: string;           // Text to parse
  userLocation?: { latitude, longitude };
  conversationHistory?: Array<{ role, content }>;
}
```

**Actual Call (useVoiceSearch.ts):**
```typescript
{
  audioData: string;  // ❌ Wrong! Sends audio, not transcript
  mimeType: string;
}
```

---

## Section 11: Best Practice Violations

### Security

| Issue | Location | Recommendation |
|-------|----------|----------------|
| Service role key exposed | `.env` | Move to Supabase secrets only |
| No rate limiting | Edge Functions | Add rate limiting middleware |
| No input validation | Multiple | Add Zod schemas |
| CORS allows all origins | Edge Functions | Restrict to app domains |

### Performance

| Issue | Location | Recommendation |
|-------|----------|----------------|
| No query caching | `useGymSearch` | Add staleTime config |
| Large bundle | `package.json` | Tree-shake unused deps |
| No image optimization | Gym photos | Use expo-image with caching |
| No pagination | `useBookings` | Add cursor-based pagination |

### Code Quality

| Issue | Location | Recommendation |
|-------|----------|----------------|
| Duplicate stores | `tripStore.ts`, `tripsStore.ts` | Consolidate |
| Inconsistent naming | `camelCase` vs `snake_case` | Standardize |
| Missing error boundaries | App screens | Add ErrorBoundary |
| No TypeScript strict mode | `tsconfig.json` | Enable strict |

---

## Section 12: Recommended Fixes

### Priority 1: Critical (Block Launch)

1. **Fix payment function name**
   ```typescript
   // services/payment.ts line 30
   - 'create-payment-intent'
   + 'payments-create-intent'
   ```

2. **Add gym_id to partners table**
   ```sql
   ALTER TABLE partners ADD COLUMN gym_id BIGINT REFERENCES gyms(id);
   CREATE INDEX partners_gym_id_idx ON partners(gym_id);
   ```

3. **Fix voice search flow**
   ```typescript
   // useVoiceSearch.ts - call transcribe first
   const { data: transcription } = await supabase.functions.invoke('voice-transcribe', {
     body: { audioData }
   });
   const { data: intent } = await supabase.functions.invoke('voice-process-query', {
     body: { transcript: transcription.transcript }
   });
   ```

### Priority 2: High (Before Beta)

4. Fix gamification store column names
5. Add missing environment variables
6. Fix service role key (get real key from Supabase dashboard)
7. Update booking status CHECK constraint to include 'pending' and 'expired'

### Priority 3: Medium (Before Production)

8. Add rate limiting to Edge Functions
9. Add input validation with Zod
10. Implement proper error boundaries
11. Add pagination to list queries

---

## Appendix: File Reference

### Key Files Audited

| File | Lines | Purpose |
|------|-------|---------|
| `lib/supabase.ts` | 47 | Supabase client config |
| `stores/authStore.ts` | 100 | Auth state management |
| `stores/searchStore.ts` | 340 | Search state & API calls |
| `stores/gamificationStore.ts` | 460 | Gamification logic |
| `hooks/usePayment.ts` | 125 | Payment processing |
| `hooks/useVoiceSearch.ts` | 138 | Voice recording & processing |
| `services/payment.ts` | 106 | Payment service layer |
| `supabase/functions/payments-create-intent/index.ts` | 160 | Stripe integration |
| `supabase/functions/bookings-validate-qr/index.ts` | 179 | QR validation |
| `supabase/migrations/001_initial_schema.sql` | ~200 | Core schema |
| `supabase/migrations/003_missing_tables.sql` | 517 | Extended schema |

---

**Audit Complete**

Total Issues Found: **18**
- Critical: 3
- High: 3
- Medium: 6
- Low: 6

Estimated Fix Time: **8-12 hours**


