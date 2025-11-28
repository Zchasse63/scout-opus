You are a senior full-stack architect conducting a comprehensive integration audit. Your task is to autonomously analyze this codebase to verify complete communication and data flow integrity across all application layers.

## PHASE 0: AUTONOMOUS DISCOVERY & MAPPING

Before conducting the audit, you must first discover and document the entire architecture by analyzing the codebase.

### Step 1: Identify Tech Stack

Analyze the codebase to determine what technologies are in use. Look at package files, dependency manifests, imports, file extensions, and code patterns to identify:

**Frontend Layer:**
- Primary framework and version (examples: React, Vue, Angular, Svelte, Next.js, Nuxt, SvelteKit, or other)
- Language used (examples: JavaScript, TypeScript, or other)
- Routing solution (examine how pages/routes are defined)
- State management approach (examine how global/shared state is handled)
- HTTP/API client (examine how API calls are made)
- UI component library or styling approach
- Build tooling and bundler

**Backend Layer:**
- Primary framework and version (examples: Express, Fastify, NestJS, Django, FastAPI, Flask, Rails, Spring, Go Fiber, or other)
- Language and runtime (examples: Node.js, Python, Go, Java, Ruby, Rust, PHP, .NET, or other)
- API architecture style (examples: REST, GraphQL, gRPC, tRPC, or other)
- Authentication approach (examine how users are authenticated)
- Middleware and request processing pipeline

**Data Layer:**
- Database system(s) (examples: PostgreSQL, MySQL, MongoDB, Redis, SQLite, DynamoDB, Supabase, Firebase, or other)
- ORM, ODM, or query builder (examine how database queries are constructed)
- Migration system and schema management
- Connection management and pooling
- Caching layer (if present)

**Scripts & Background Processing:**
- Standalone scripts in any language (look for /scripts, /jobs, /workers, /tasks directories or similar)
- Scheduled jobs and cron tasks
- Task/job queues and workers
- Data processing pipelines
- CLI tools

**External Service Integrations:**
- Payment processing
- Email/SMS/notification services
- File storage and CDN
- Analytics and tracking
- Search services
- Any other third-party APIs or SDKs

**Real-Time Communication:**
- WebSocket implementations
- Server-Sent Events (SSE)
- Real-time database subscriptions
- Push notification services

**Infrastructure & DevOps:**
- Caching systems
- Message queues and event buses
- Environment and secrets management
- Containerization and orchestration
- CI/CD configuration

**Document your findings in this format:**
```
DISCOVERED TECH STACK
=====================
Frontend: React Native 0.81.5 with Expo ~54.0.25, React 19.1.0, TypeScript
Backend: Supabase Edge Functions (Deno runtime) + PostgreSQL
Database: PostgreSQL via Supabase with PostGIS extension
ORM/Data Access: Supabase JS Client @supabase/supabase-js ^2.49.4
Key Dependencies:
  - State Management: Zustand ^5.0.0
  - Data Fetching: TanStack React Query ^5.0.0
  - Navigation: Expo Router ~4.0.0
  - Payments: Stripe React Native ^0.42.1
  - Maps: React Native Maps ^1.20.1
  - Icons: Lucide React Native ^0.475.0
  - Animations: React Native Reanimated ~3.16.1
  - Voice: @react-native-voice/voice ^3.3.1
External Services:
  - Stripe Connect (payments, marketplace)
  - Google Places API (New) (gym search)
  - OpenAI Whisper (voice transcription)
  - Google Gemini AI (intent parsing, personalization)
  - OneSignal (push notifications)
  - Expo Push (push notifications)
  - Resend (transactional emails)
  - Tally (form webhooks)
  - Firecrawl (web scraping)
Real-Time: Supabase Realtime subscriptions (PostgreSQL changes)
Background Jobs: Supabase Edge Functions (event-triggered, webhook-based)

Additional Portals:
  - Admin Portal: Vite + React + React Router + Tailwind CSS
  - Partner Portal: Vite + React + React Router + Stripe Connect
```

### Step 2: Map Codebase Structure

Analyze and document the actual folder structure of this project:
- Identify where frontend code lives
- Identify where backend code lives
- Identify where database schemas/models are defined
- Identify where scripts and jobs are located
- Identify shared code, types, or utilities
- Identify configuration and environment files
- Identify test directories

**Document in this format:**
```
CODEBASE STRUCTURE
==================
scout-app/
├── app/                          # Expo Router pages
│   ├── (auth)/                   # Auth flow screens
│   │   ├── _layout.tsx
│   │   ├── callback.tsx          # OAuth callback handler
│   │   └── login.tsx             # Login screen
│   ├── (tabs)/                   # Main tab navigation
│   │   ├── _layout.tsx
│   │   ├── index.tsx             # Home/Explore screen
│   │   ├── passes.tsx            # User's passes/bookings
│   │   ├── profile.tsx           # User profile
│   │   └── trips.tsx             # Travel periods
│   ├── _layout.tsx               # Root layout
│   └── gym/[id].tsx              # Gym detail screen
├── components/                   # Reusable UI components
├── hooks/                        # Custom React hooks
│   ├── useBookings.ts            # Booking CRUD operations
│   ├── useGymSearch.ts           # Gym search with TanStack Query
│   ├── usePayment.ts             # Stripe payment flow
│   ├── useSavedGyms.ts           # Saved gyms management
│   ├── useTrips.ts               # Travel periods CRUD
│   └── useVoiceSearch.ts         # Voice search with native speech
├── stores/                       # Zustand state stores
│   ├── authStore.ts              # Authentication state
│   ├── bookingStore.ts           # Booking state
│   └── gamificationStore.ts      # Points, badges, streaks
├── services/                     # API service layer
│   └── payment.ts                # Payment intent creation
├── lib/                          # Core utilities
│   └── supabase.ts               # Supabase client config
├── types/                        # TypeScript definitions
│   └── index.ts                  # Shared type interfaces
├── supabase/
│   ├── functions/                # Edge Functions (18 total)
│   │   ├── bookings-validate-qr/ # QR code validation
│   │   ├── calendar-extract-destination/
│   │   ├── firecrawl-scrape/     # Web scraping
│   │   ├── gym-page/             # SEO gym pages
│   │   ├── gym-personalize/      # AI personalization
│   │   ├── notifications-travel-alert/
│   │   ├── notify-admin/         # Admin alerts
│   │   ├── payments-create-intent/
│   │   ├── payments-webhook/     # Stripe webhooks
│   │   ├── places-details/       # Google Places details
│   │   ├── places-photos/        # Google Places photos
│   │   ├── places-search/        # Google Places search
│   │   ├── send-email/           # Resend emails
│   │   ├── send-push/            # Expo push notifications
│   │   ├── stripe-connect-onboarding/
│   │   ├── tally-webhook/        # Form submissions
│   │   ├── voice-process-query/  # Gemini intent parsing
│   │   └── voice-transcribe/     # OpenAI Whisper
│   └── migrations/               # Database migrations (6 files)
├── admin-portal/                 # Admin web dashboard
│   └── src/
│       ├── pages/                # Dashboard, Partners, Tickets, etc.
│       ├── stores/               # Auth store
│       └── components/           # Layout, shared components
├── partner-portal/               # Partner/Gym owner dashboard
│   └── src/
│       ├── pages/                # Dashboard, Bookings, QR Scanner, etc.
│       ├── stores/               # Auth store
│       └── components/           # Layout, shared components
├── __tests__/                    # Test files
│   ├── hooks/
│   └── stores/
├── assets/                       # Images, icons
├── app.json                      # Expo configuration
├── package.json                  # Dependencies
└── tsconfig.json                 # TypeScript config
```

### Step 3: Identify Critical User Flows

By analyzing the code (routes, components, handlers, etc.), identify the main user journeys and system processes:
- Authentication flows (registration, login, logout, password reset)
- Core business operations (what does this app primarily do?)
- Data submission and retrieval flows
- Payment or transaction flows (if applicable)
- Admin or management operations
- Background processes and scheduled tasks
- Any complex multi-step workflows

**List the top 5-10 critical flows you identify, ranked by importance to the application's core functionality**

```
CRITICAL USER FLOWS (Ranked by Importance)
==========================================

1. GYM SEARCH & DISCOVERY
   - User searches for gyms via text, voice, or map
   - Frontend calls places-search Edge Function
   - Google Places API returns results
   - Results displayed on map and list view
   - User can filter by amenities, price, distance

2. BOOKING & PAYMENT FLOW
   - User selects gym and pass type (day/week/month)
   - Frontend calls payments-create-intent Edge Function
   - Stripe Connect creates payment intent with 15% platform fee
   - User completes payment via Stripe Payment Sheet
   - Booking created with QR code in database
   - Confirmation email sent via Resend

3. QR CODE CHECK-IN
   - Partner scans user's QR code via Partner Portal
   - bookings-validate-qr Edge Function validates booking
   - Checks: status, date, gym match
   - Updates booking status to 'used'
   - Gamification points awarded

4. USER AUTHENTICATION
   - Apple Sign-In, Google Sign-In, or Email OTP
   - Supabase Auth handles OAuth/OTP flow
   - User profile created/updated in users table
   - JWT stored in Expo SecureStore
   - Session persisted across app restarts

5. TRAVEL PERIOD MANAGEMENT
   - User adds trip manually or via calendar sync
   - Calendar events analyzed by calendar-extract-destination
   - Gemini AI extracts destination from event details
   - Travel period saved to database
   - notifications-travel-alert sends reminders

6. VOICE SEARCH FLOW
   - User taps microphone, speaks query
   - @react-native-voice/voice captures speech
   - voice-process-query parses intent via Gemini AI
   - Structured search parameters returned
   - Gym search executed with parsed filters

7. PARTNER ONBOARDING
   - Gym owner applies via Tally form
   - tally-webhook creates partner_application
   - Admin reviews in Admin Portal
   - On approval, stripe-connect-onboarding creates Stripe account
   - Partner can now receive payouts

8. GAMIFICATION SYSTEM
   - Check-ins award points (10 per visit)
   - Streaks tracked (7, 30, 100 day badges)
   - Cities visited unlock exploration badges
   - Leaderboard shows top users
   - Levels unlock discounts (5-20%)

9. SUPPORT TICKET FLOW
   - User submits ticket via app
   - Stored in support_tickets table
   - Admin responds via Admin Portal
   - send-email sends reply to user
   - send-push notifies user of response

10. GYM PERSONALIZATION
    - gym-personalize analyzes user history
    - Gemini AI generates "Why this gym" reasons
    - Match scores based on past bookings/ratings
    - Personalized recommendations displayed
```

### Step 4: Identify All Integration Points

Scan the codebase to create a preliminary inventory of:
- All backend API endpoints (examine route definitions)
- All frontend API calls (search for HTTP client usage patterns)
- All database tables/collections (examine schema files and models)
- All scripts and background jobs (find standalone executable files)
- All external API integrations (look for API keys, SDK imports, third-party client instantiation)
- All webhook endpoints (incoming webhooks from external services)
- All real-time channels/subscriptions (if applicable)

**Create a preliminary count:**
```
INTEGRATION POINT SUMMARY
=========================
Backend Endpoints: 18 (Supabase Edge Functions)
Frontend API Calls: ~25 (hooks + services + stores)
Database Tables/Collections: 25+ (across 6 migrations)
Scripts/Background Jobs: 0 (all event-driven via Edge Functions)
External API Integrations: 8 (Stripe, Google Places, OpenAI, Gemini, OneSignal, Expo Push, Resend, Tally)
Webhook Endpoints: 3 (payments-webhook, tally-webhook, stripe-connect callbacks)
Real-Time Channels: 1 (Supabase Realtime for auth state changes)
```

---

## PHASE 1: COMPREHENSIVE AUDIT

Now conduct the full integration audit using the architecture you discovered in Phase 0. Adapt your analysis to the specific technologies found - the sections below are framework-agnostic and should be applied to whatever stack this project uses.

---

### AUDIT SECTION 1: BACKEND API ENDPOINT MAPPING

For EACH backend endpoint/route in the system, document:

**Endpoint Details:**
- HTTP Method and Path
- Handler/Controller function name and file location
- Middleware or guards applied (authentication, validation, rate limiting, logging, etc.)

**Request Contract:**
- Expected request body structure (with types/schema)
- URL parameters and query parameters
- Required vs optional fields
- Validation rules implemented
- Expected headers

**Processing Logic:**
- Database operations performed
- External API calls made
- Business logic and transformations
- Side effects (emails sent, events emitted, files created, etc.)

**Response Contract:**
- Success response structure (with types/schema)
- HTTP status codes used
- Error response structures
- Headers set

**Security:**
- Authentication required (yes/no, what type)
- Authorization/permission checks
- Input sanitization
- Rate limiting

**Dependencies:**
- Database tables/collections accessed
- External services called
- Internal services or other endpoints called
- Environment variables required

**Create a comprehensive table:**

| Endpoint | Method | Auth | Request Schema | Response Schema | DB Tables | External Calls | Status | Issues |
|----------|--------|------|----------------|-----------------|-----------|----------------|--------|--------|
| payments-create-intent | POST | JWT | `{gymId, passType, amount, bookingDate, userId}` | `{clientSecret, paymentIntentId}` | gyms, partners | Stripe API | ✓ | None |
| payments-webhook | POST | Stripe Sig | Stripe Event Object | `{received: true}` | bookings | None | ✓ | None |
| bookings-validate-qr | POST | Service Key | `{bookingId, signature?}` | `{isValid, message, userName, gymName}` | bookings, users, gyms | None | ✓ | None |
| places-search | POST | JWT | `{query, location, radius, filters}` | `{places: Place[]}` | None | Google Places API | ✓ | None |
| places-details | POST | JWT | `{placeId}` | `{place: PlaceDetails}` | None | Google Places API | ✓ | None |
| places-photos | GET | JWT | `?photoReference=&maxWidth=` | Binary image | None | Google Places API | ✓ | None |
| voice-transcribe | POST | JWT | `{audioData: base64}` | `{transcript}` | voice_queries | OpenAI Whisper | ✓ | None |
| voice-process-query | POST | None | `{transcript, conversationHistory?, previousIntent?}` | `{parsedIntent, rawResponse}` | None | Gemini AI | ✓ | Missing auth |
| gym-personalize | POST | None | `{userId, gymIds}` | `{personalizations: [{gymId, matchScore, reasons}]}` | bookings, reviews, gyms | Gemini AI | ✓ | Missing auth |
| gym-page | GET | None | `?slug=` | HTML page | gyms, gym_reviews, gym_photos | None | ✓ | Public endpoint |
| notifications-travel-alert | POST | None | `{userId, destination, daysUntilTrip, gymCount}` | `{success, notificationId}` | None | OneSignal | ✓ | Missing auth |
| send-push | POST | None | `{pushTokens, type, data}` | `{success, sent, failed, tickets}` | None | Expo Push API | ✓ | Missing auth |
| send-email | POST | None | `{to, type, data}` | `{success, emailId}` | None | Resend API | ✓ | Missing auth |
| notify-admin | POST | None | `{type, data, priority?}` | `{success, slack?, email?}` | None | Slack, Resend | ✓ | Missing auth |
| stripe-connect-onboarding | POST | JWT | `{account_id?, refresh_url?, return_url?}` | `{url, account_id}` | partners | Stripe Connect | ✓ | None |
| tally-webhook | POST | None | Tally Event Object | `{success: true}` | gyms, partner_applications, gym_claims, verification_requests | None | ✓ | No signature verification |
| calendar-extract-destination | POST | None | `{title, location?, description?, startDate, endDate}` | `{is_travel, destination?, confidence}` | None | Gemini AI | ✓ | Missing auth |
| firecrawl-scrape | POST | None | `{url}` | `{content}` | None | Firecrawl API | ✓ | Missing auth |

---

### AUDIT SECTION 2: FRONTEND API INTEGRATION MAPPING

For EACH API call made from the frontend, document:

**Call Location:**
- File path where call is made
- Function/component name
- User action or event that triggers it

**Request Details:**
- Target endpoint (verify it exists in backend)
- HTTP method
- Payload structure sent
- Headers included
- Query parameters

**Contract Validation:**
- ✓ Does the endpoint exist in backend?
- ✓ Does request payload match backend expectations exactly?
- ✓ Are all required fields sent?
- ✓ Are data types correct?
- ✓ Is authentication token properly included?

**Response Handling:**
- How success responses are processed
- Data transformations applied
- State management updates
- UI updates triggered
- Cache invalidation/updates

**Error Handling:**
- How error responses are caught
- User feedback mechanism (toast, modal, inline message, etc.)
- Retry logic (if any)
- Fallback behavior
- Error logging/reporting

**Loading & UX States:**
- Loading indicator implemented
- Button/form disabled during request
- Optimistic updates (if applicable)
- Success confirmation shown

**Create a comprehensive table:**

| Frontend Location | Endpoint | Trigger | Payload Matches | Response Handled | Errors Handled | Loading State | Status | Issues |
|-------------------|----------|---------|-----------------|------------------|----------------|---------------|--------|--------|
| hooks/useGymSearch.ts | places-search | User search/filter | ✓ | ✓ TanStack Query | ✓ Error state | ✓ isLoading | ✓ | None |
| hooks/useBookings.ts | Direct Supabase | Component mount | ✓ | ✓ TanStack Query | ✓ Error thrown | ✓ isLoading | ✓ | None |
| hooks/usePayment.ts | payments-create-intent | Book button tap | ✓ | ✓ | ✓ Try/catch | ✓ isProcessing | ✓ | None |
| services/payment.ts | payments-create-intent | usePayment hook | ✓ | ✓ | ✓ Error thrown | N/A (service) | ✓ | None |
| services/payment.ts | generate_qr_payload RPC | After payment | ✓ | ✓ | ✓ Error thrown | N/A (service) | ✓ | None |
| hooks/useTrips.ts | Direct Supabase | Component mount | ✓ | ✓ TanStack Query | ✓ Error thrown | ✓ isLoading | ✓ | None |
| hooks/useSavedGyms.ts | Direct Supabase | Component mount | ✓ | ✓ TanStack Query | ✓ Error thrown | ✓ isLoading | ✓ | None |
| hooks/useVoiceSearch.ts | voice-process-query | Stop recording | ✓ | ✓ | ✓ Error state | ✓ isProcessing | ✓ | None |
| stores/authStore.ts | Supabase Auth | Login/logout | ✓ | ✓ | ✓ Error state | ✓ isLoading | ✓ | None |
| stores/gamificationStore.ts | Direct Supabase | Various actions | ✓ | ✓ | ✓ Console.error | ✗ No loading | ⚠ | Missing loading states |
| admin-portal/src/* | Direct Supabase | Various | ✓ | ✓ | Varies | Varies | ⚠ | Inconsistent patterns |
| partner-portal/src/* | Direct Supabase | Various | ✓ | ✓ | Varies | Varies | ⚠ | Inconsistent patterns |

---

### AUDIT SECTION 3: DATABASE INTEGRATION AUDIT

For EACH database table/collection, document:

**Schema Definition:**
- Table/collection name
- Fields with data types
- Primary key(s)
- Foreign keys and relationships
- Indexes
- Constraints (unique, not null, check, etc.)
- Default values

**Access Patterns:**
- Which backend endpoints READ from this table
- Which backend endpoints WRITE to this table
- Which scripts/jobs access this table
- Common query patterns (simple select, joins, aggregations)

**Data Integrity:**
- Validation before writes
- Sanitization implemented
- Transaction usage for multi-table operations
- Referential integrity enforcement
- Soft delete vs hard delete patterns

**Performance Considerations:**
- Indexes on frequently queried columns
- N+1 query risks identified
- Large table handling (pagination, cursors)
- Query optimization opportunities

**Schema Management:**
- Migration files present and up to date
- Schema version tracking
- Rollback capability

**Create a comprehensive table:**

| Table/Collection | Backend Endpoints | Scripts/Jobs | Relationships | Indexed Fields | Validation | Issues |
|------------------|-------------------|--------------|---------------|----------------|------------|--------|
| users | All (via auth) | None | 1:M bookings, reviews, travel_periods | id (PK), email | Supabase Auth | None |
| gyms | places-*, gym-*, bookings-* | None | 1:M bookings, reviews; M:M amenities | id (PK), slug, location (PostGIS) | Edge Function | None |
| gym_owners | stripe-connect-*, tally-webhook | None | M:1 gyms, 1:1 users | id (PK), user_id, gym_id | Edge Function | None |
| bookings | payments-*, bookings-validate-qr | None | M:1 users, gyms | id (PK), user_id, gym_id, booking_date | Edge Function | None |
| reviews | gym-personalize | None | M:1 users, gyms | id (PK), user_id, gym_id | None | Missing validation |
| travel_periods | notifications-travel-alert | None | M:1 users | id (PK), user_id | Frontend | None |
| voice_queries | voice-transcribe | None | M:1 users | id (PK), user_id | None | None |
| saved_gyms | None (direct Supabase) | None | M:1 users, gyms | id (PK), user_id, gym_id | Frontend | None |
| partners | stripe-connect-*, tally-webhook | None | 1:1 users, M:1 gyms | id (PK), user_id | Edge Function | None |
| partner_applications | tally-webhook, notify-admin | None | None | id (PK) | Tally form | None |
| support_tickets | send-email, notify-admin | None | M:1 users | id (PK), user_id | Frontend | None |
| gym_reviews | gym-page | None | M:1 gyms, users | id (PK), gym_id | None | Duplicate of reviews? |
| passes | None | None | M:1 users, gyms | id (PK) | None | Possibly unused |
| user_stats | gamificationStore | None | 1:1 users | user_id (PK) | Frontend | None |
| user_achievements | gamificationStore | None | M:1 users | id (PK), user_id | Frontend | None |
| admin_notifications | notify-admin | None | None | id (PK) | Edge Function | None |
| sent_alerts | notifications-travel-alert | None | M:1 users | id (PK), user_id | Edge Function | Deduplication |
| verification_requests | tally-webhook | None | None | id (PK) | Edge Function | None |
| gym_claims | tally-webhook | None | M:1 gyms | id (PK), gym_id | Edge Function | None |
| amenities | None | None | M:M gyms | id (PK) | None | None |
| gym_amenities | None | None | Junction table | gym_id, amenity_id | None | None |
| gym_photos | gym-page | None | M:1 gyms | id (PK), gym_id | None | None |

---

### AUDIT SECTION 4: SCRIPTS & BACKGROUND JOB AUDIT

For EACH script, worker, scheduled job, or background task (in any language), document:

**Identity:**
- File name and location
- Language/runtime
- Purpose and functionality
- Execution method (cron, queue, manual, event-triggered, etc.)
- Schedule (if applicable)

**Inputs:**
- Command-line arguments
- Environment variables required
- Configuration files read
- Database connections needed
- Message queue subscriptions

**Processing:**
- Database operations performed
- External APIs called
- Files read/written
- Data transformations

**Outputs:**
- Database changes made
- Files/reports generated
- Notifications sent
- Events emitted
- API calls to other services

**Integration:**
- How it's triggered (scheduler, API call, queue message, manual)
- How it reports status/completion
- How it integrates with the main application
- Shared data formats or contracts

**Reliability:**
- Error handling implemented
- Retry logic
- Idempotency (safe to re-run?)
- Logging and monitoring
- Alerting on failure

**Create a comprehensive table:**

| Script/Job | Language | Purpose | Trigger | DB Access | External Calls | Error Handling | Status | Issues |
|------------|----------|---------|---------|-----------|----------------|----------------|--------|--------|
| N/A - No traditional scripts/cron jobs | | | | | | | | |

**Note:** This project uses Supabase Edge Functions exclusively for backend processing. All "background" work is event-driven:
- **Webhook-triggered**: payments-webhook, tally-webhook (external service callbacks)
- **API-triggered**: All other Edge Functions called on-demand from frontend
- **No scheduled jobs**: Travel alerts would need external scheduler (e.g., Supabase pg_cron or external service)

**Potential Gap**: Travel alert notifications (7-day and 1-day reminders) require a scheduled job to scan travel_periods table daily. Currently, notifications-travel-alert is designed to be called but no scheduler exists to trigger it.

---

### AUDIT SECTION 5: EXTERNAL API INTEGRATION AUDIT

For EACH third-party service or external API, document:

**Service Identity:**
- Service name and purpose
- SDK or client library used
- API version

**Integration Points:**
- Where it's called from (list all backend endpoints, frontend locations, and scripts)
- Is it called directly or through an abstraction layer?

**Authentication:**
- How credentials are managed
- Environment variables used
- Token refresh handling (if applicable)

**Usage:**
- Specific endpoints/methods called
- Request/response formats
- Rate limits and quotas

**Incoming Data (Webhooks):**
- Webhook endpoints registered
- Event types handled
- Signature verification implemented
- Idempotency handling

**Error Handling:**
- Network failure handling
- API error response handling
- Retry logic with backoff
- Fallback behavior
- Circuit breaker pattern (if applicable)

**Monitoring:**
- API call logging
- Error tracking
- Performance monitoring
- Cost tracking (if usage-based pricing)

**Create a comprehensive table:**

| Service | Called From | Purpose | Auth Method | Webhooks | Error Handling | Fallback | Status | Issues |
|---------|-------------|---------|-------------|----------|----------------|----------|--------|--------|
| Stripe Connect | payments-create-intent, payments-webhook, stripe-connect-onboarding | Marketplace payments, 15% platform fee | STRIPE_SECRET_KEY | payments-webhook | ✓ Try/catch | None | ✓ | None |
| Google Places API (New) | places-search, places-details, places-photos | Gym discovery, details, photos | GOOGLE_PLACES_API_KEY | None | ✓ Try/catch | None | ✓ | None |
| OpenAI Whisper | voice-transcribe | Speech-to-text | OPENAI_API_KEY | None | ✓ Try/catch | None | ✓ | None |
| Google Gemini AI | voice-process-query, gym-personalize, calendar-extract-destination | Intent parsing, personalization | GEMINI_API_KEY | None | ✓ Try/catch | None | ✓ | None |
| OneSignal | notifications-travel-alert | Push notifications | ONESIGNAL_APP_ID, ONESIGNAL_API_KEY | None | ✓ Try/catch | None | ✓ | None |
| Expo Push | send-push | Push notifications | EXPO_ACCESS_TOKEN | None | ✓ Try/catch | None | ✓ | Dual push system |
| Resend | send-email, notify-admin | Transactional emails | RESEND_API_KEY | None | ✓ Try/catch | None | ✓ | None |
| Tally | tally-webhook | Form submissions | None (webhook) | tally-webhook | ✓ Try/catch | None | ⚠ | No signature verification |
| Firecrawl | firecrawl-scrape | Web scraping | FIRECRAWL_API_KEY | None | ✓ Try/catch | None | ✓ | None |
| Slack | notify-admin | Admin alerts | SLACK_ADMIN_WEBHOOK_URL | None | ✓ Try/catch | Email fallback | ✓ | None |
| Supabase Auth | authStore.ts | OAuth, Email OTP | SUPABASE_URL, SUPABASE_ANON_KEY | None | ✓ Try/catch | None | ✓ | None |

---

### AUDIT SECTION 6: COMPLETE DATA FLOW TRACING

For EACH critical user flow discovered in Phase 0, trace the complete data journey:

**Use this format for each flow:**
```
FLOW: [Name of the flow]
=====================================

1. USER ACTION
   → [What the user does]

2. FRONTEND
   → Component/Page: [file location]
   → Trigger: [event/action]
   → Validation: [client-side validation performed]
   → API Call: [method] [endpoint]
   → Payload: [structure sent]

3. BACKEND RECEIPT
   → Route Handler: [file:function]
   → Middleware Chain: [list middleware executed]
   → Request Validation: [validation performed]

4. BUSINESS LOGIC
   → Service/Logic Layer: [file:function]
   → Operations: [what happens]
   → Database Queries: [tables accessed, operations performed]

5. EXTERNAL CALLS (if any)
   → Service: [external API]
   → Purpose: [why it's called]
   → Data Exchanged: [what's sent/received]

6. RESPONSE CONSTRUCTION
   → Response Format: [structure]
   → Status Code: [code]

7. FRONTEND HANDLING
   → Response Handler: [file:function]
   → State Update: [what state changes]
   → UI Update: [what re-renders]

8. USER FEEDBACK
   → Confirmation: [how user knows it worked]

VERIFICATION CHECKLIST:
[ ] All code paths exist
[ ] Data formats match at each boundary
[ ] Error handling at each step
[ ] Loading states implemented
[ ] Success feedback shown
[ ] Edge cases handled

ISSUES FOUND:
- [list any problems]
```

**FLOW 1: BOOKING & PAYMENT**
```
1. USER ACTION
   → User taps "Book Day Pass" on gym detail screen

2. FRONTEND
   → Component: app/gym/[id].tsx
   → Trigger: onPress handler
   → Validation: Pass type selected, date selected
   → API Call: hooks/usePayment.ts → services/payment.ts
   → Payload: {gymId, passType, amount, bookingDate}

3. BACKEND RECEIPT
   → Route Handler: supabase/functions/payments-create-intent/index.ts
   → Middleware: CORS headers, JWT validation
   → Request Validation: Required fields check

4. BUSINESS LOGIC
   → Fetches gym's Stripe Connect account ID
   → Calculates 15% platform fee
   → Creates Stripe PaymentIntent with transfer_data

5. EXTERNAL CALLS
   → Service: Stripe API
   → Purpose: Create payment intent
   → Data: amount, currency, connected account, application_fee

6. RESPONSE CONSTRUCTION
   → Response: {clientSecret, paymentIntentId}
   → Status: 200

7. FRONTEND HANDLING
   → Stripe Payment Sheet presented
   → On success: confirmPaymentAndCreateBooking called
   → Booking inserted to database with QR code
   → Query cache invalidated

8. USER FEEDBACK
   → Success toast shown
   → Redirected to passes screen
   → Confirmation email sent

VERIFICATION CHECKLIST:
[✓] All code paths exist
[✓] Data formats match at each boundary
[✓] Error handling at each step
[✓] Loading states implemented
[✓] Success feedback shown
[⚠] Edge cases: Stripe webhook for failed payments not fully tested
```

**FLOW 2: QR CODE CHECK-IN**
```
1. USER ACTION
   → Partner scans QR code via Partner Portal scanner

2. FRONTEND
   → Component: partner-portal/src/pages/QRScanner.tsx
   → Trigger: QR code detected
   → Validation: QR format check
   → API Call: supabase.functions.invoke('bookings-validate-qr')
   → Payload: {bookingId}

3. BACKEND RECEIPT
   → Route Handler: supabase/functions/bookings-validate-qr/index.ts
   → Middleware: CORS headers
   → Request Validation: bookingId required

4. BUSINESS LOGIC
   → Fetches booking with user and gym details
   → Validates: status, date, gym match
   → Updates booking status to 'used'

5. EXTERNAL CALLS
   → None

6. RESPONSE CONSTRUCTION
   → Response: {isValid, message, userName, gymName, checkedInAt}
   → Status: 200

7. FRONTEND HANDLING
   → Success/error message displayed
   → Scanner reset for next scan

8. USER FEEDBACK
   → Green checkmark for valid
   → Red X with reason for invalid

VERIFICATION CHECKLIST:
[✓] All code paths exist
[✓] Data formats match
[✓] Error handling complete
[✓] Loading states implemented
[✓] Success feedback shown
[✓] Edge cases handled (used, cancelled, wrong date)
```

**FLOW 3: VOICE SEARCH**
```
1. USER ACTION
   → User taps microphone, speaks "gyms with pools near me"

2. FRONTEND
   → Component: hooks/useVoiceSearch.ts
   → Trigger: startRecording/stopRecording
   → Validation: Speech recognition available
   → API Call: supabase.functions.invoke('voice-process-query')
   → Payload: {transcript, conversationHistory, previousIntent}

3. BACKEND RECEIPT
   → Route Handler: supabase/functions/voice-process-query/index.ts
   → Middleware: None (missing auth!)
   → Request Validation: transcript required

4. BUSINESS LOGIC
   → Builds prompt with conversation context
   → Calls Gemini AI for intent parsing
   → Parses JSON from response

5. EXTERNAL CALLS
   → Service: Google Gemini AI
   → Purpose: Natural language understanding
   → Data: transcript, context, previous intent

6. RESPONSE CONSTRUCTION
   → Response: {transcript, parsedIntent, rawResponse}
   → Status: 200

7. FRONTEND HANDLING
   → Intent merged with previous (if refinement)
   → Gym search triggered with parsed filters
   → Conversation history updated

8. USER FEEDBACK
   → Partial transcript shown while speaking
   → Search results update

VERIFICATION CHECKLIST:
[✓] All code paths exist
[✓] Data formats match
[✓] Error handling complete
[✓] Loading states implemented
[✓] Success feedback shown
[⚠] Missing authentication on Edge Function
```

---

### AUDIT SECTION 7: AUTHENTICATION & AUTHORIZATION AUDIT

Document the complete auth system:

**User Registration:**
- Frontend form location
- API endpoint
- Validation (client and server)
- Password handling (hashing algorithm, strength requirements)
- User record creation
- Email verification (if applicable)
- Initial session/token creation
- Post-registration flow

**User Login:**
- Frontend form location
- API endpoint
- Credential validation
- Token/session generation
- Token storage location (cookie, localStorage, memory)
- Response to frontend
- Redirect behavior

**Token/Session Management:**
- Token type and format
- Expiration policy
- Refresh mechanism
- Storage security
- Transmission method (header, cookie)
- Revocation capability

**Protected Frontend Routes:**
| Route | Auth Guard | Unauthorized Redirect | Issues |
|-------|------------|----------------------|--------|
| /(tabs)/* | authStore.isAuthenticated | /(auth)/login | ✓ |
| /gym/[id] | authStore.isAuthenticated | /(auth)/login | ✓ |
| Admin Portal /* | authStore.isAuthenticated | /login | ✓ |
| Partner Portal /* | authStore.isAuthenticated | /login | ✓ |

**Protected Backend Endpoints:**
| Endpoint | Auth Middleware | Permission Check | Unauthorized Response | Issues |
|----------|-----------------|------------------|----------------------|--------|
| payments-create-intent | JWT validation | User exists | 401 Unauthorized | ✓ |
| stripe-connect-onboarding | JWT validation | User is partner | 401 Unauthorized | ✓ |
| places-search | JWT validation | None | 401 Unauthorized | ✓ |
| places-details | JWT validation | None | 401 Unauthorized | ✓ |
| places-photos | JWT validation | None | 401 Unauthorized | ✓ |
| voice-transcribe | JWT validation | None | 401 Unauthorized | ✓ |
| voice-process-query | **None** | None | N/A | ⚠ Missing auth |
| gym-personalize | **None** | None | N/A | ⚠ Missing auth |
| notifications-travel-alert | **None** | None | N/A | ⚠ Missing auth |
| send-push | **None** | None | N/A | ⚠ Missing auth |
| send-email | **None** | None | N/A | ⚠ Missing auth |
| notify-admin | **None** | None | N/A | ⚠ Missing auth |
| calendar-extract-destination | **None** | None | N/A | ⚠ Missing auth |
| firecrawl-scrape | **None** | None | N/A | ⚠ Missing auth |
| bookings-validate-qr | Service Role Key | Partner owns gym | 401 Unauthorized | ✓ |
| payments-webhook | Stripe Signature | Valid signature | 400 Bad Request | ✓ |
| tally-webhook | **None** | None | N/A | ⚠ No signature verification |
| gym-page | **None (public)** | None | N/A | ✓ Intentionally public |

**Authorization & Permissions:**
- Permission model (RBAC, ABAC, custom)
- How roles are assigned
- How permissions are checked
- Resource-level access control
- Consistency across frontend and backend

**Security Concerns:**
- Password storage method
- Brute force protection
- Session fixation prevention
- CSRF protection
- Token security (httpOnly, secure flags)

---

### AUDIT SECTION 8: REAL-TIME COMMUNICATION AUDIT

If real-time features exist, document:

**Technology Used:**
- Implementation (WebSocket, SSE, polling, third-party service)
- Library or framework

**Channels/Events:**
| Channel/Event | Purpose | Publisher | Subscribers | Auth Required | Issues |
|---------------|---------|-----------|-------------|---------------|--------|
| auth.onAuthStateChange | Auth state sync | Supabase Auth | authStore.ts | N/A | ✓ |
| bookings table changes | Real-time booking updates | Database triggers | Not implemented | JWT | Not used |
| gyms table changes | Real-time gym updates | Database triggers | Not implemented | JWT | Not used |

**Note:** Real-time subscriptions are available via Supabase but not actively used in the mobile app. The app relies on TanStack Query's refetch mechanisms instead.

**Connection Management:**
- Connection establishment flow
- Authentication/authorization for connections
- Reconnection handling
- Heartbeat/keepalive mechanism

**Data Flow:**
- Message formats
- Serialization/deserialization
- Message ordering guarantees
- Delivery guarantees

**Scaling Considerations:**
- Horizontal scaling approach
- State management across instances
- Pub/sub backend (if applicable)

---

### AUDIT SECTION 9: CONFIGURATION & ENVIRONMENT AUDIT

**Environment Variables:**
| Variable | Used In | Purpose | Default | Required | Validated | Issues |
|----------|---------|---------|---------|----------|-----------|--------|
| SUPABASE_URL | lib/supabase.ts, Edge Functions | Supabase project URL | None | ✓ | ✓ | None |
| SUPABASE_ANON_KEY | lib/supabase.ts | Public API key | None | ✓ | ✓ | None |
| SUPABASE_SERVICE_ROLE_KEY | Edge Functions | Admin API key | None | ✓ | ✓ | None |
| STRIPE_SECRET_KEY | payments-*, stripe-connect-* | Stripe API | None | ✓ | ✓ | None |
| STRIPE_WEBHOOK_SECRET | payments-webhook | Webhook signature | None | ✓ | ✓ | None |
| GOOGLE_PLACES_API_KEY | places-* | Google Places API | None | ✓ | ✓ | None |
| OPENAI_API_KEY | voice-transcribe | Whisper API | None | ✓ | ✓ | None |
| GEMINI_API_KEY | voice-process-query, gym-personalize, calendar-extract-destination | Gemini AI | None | ✓ | ✓ | None |
| ONESIGNAL_APP_ID | notifications-travel-alert | OneSignal app | None | ✓ | ✓ | None |
| ONESIGNAL_API_KEY | notifications-travel-alert | OneSignal API | None | ✓ | ✓ | None |
| EXPO_ACCESS_TOKEN | send-push | Expo Push API | None | ✗ | ✗ | Optional |
| RESEND_API_KEY | send-email, notify-admin | Resend email API | None | ✓ | ✓ | None |
| FROM_EMAIL | send-email | Sender address | Scout <noreply@scoutfitness.app> | ✗ | ✗ | Has default |
| ADMIN_EMAIL | notify-admin | Admin recipient | admin@scoutfitness.app | ✗ | ✗ | Has default |
| SLACK_ADMIN_WEBHOOK_URL | notify-admin | Slack alerts | None | ✗ | ✗ | Optional |
| PARTNER_PORTAL_URL | stripe-connect-onboarding | Redirect URLs | None | ✓ | ✗ | Not validated |
| FIRECRAWL_API_KEY | firecrawl-scrape | Web scraping | None | ✓ | ✓ | None |
| TALLY_GYM_VERIFICATION_FORM_ID | tally-webhook | Form routing | None | ✗ | ✗ | Optional |
| TALLY_PARTNER_APPLICATION_FORM_ID | tally-webhook | Form routing | None | ✗ | ✗ | Optional |
| TALLY_GYM_CLAIM_FORM_ID | tally-webhook | Form routing | None | ✗ | ✗ | Optional |

**Configuration Files:**
- List all config files found
- What each configures
- Environment-specific overrides
- Sensitive data handling

**Secrets Management:**
- How secrets are stored
- How secrets are accessed
- Rotation policy (if any)
- No hardcoded credentials verification

**Database Configuration:**
- Connection string management
- Connection pooling settings
- Timeout configuration
- SSL/TLS in production

**CORS Configuration:**
- Allowed origins
- Allowed methods
- Credentials handling
- Preflight caching

**Feature Flags/Toggles (if present):**
- How they're implemented
- Where they're defined
- How they're accessed

---

### AUDIT SECTION 10: TYPE SAFETY & CONTRACT AUDIT

**API Contract Definitions:**
- Are request/response types defined?
- Where are they defined (shared types, OpenAPI, GraphQL schema, etc.)?
- Are they used consistently across frontend and backend?

**Type Mismatches Found:**

| Location | Expected | Actual | Impact | Fix |
|----------|----------|--------|--------|-----|
| hooks/useBookings.ts | gym_id: string | gym_id: number | Type coercion needed | parseInt() used ✓ |
| services/payment.ts | gym_id: string | gym_id: number | Type coercion needed | Direct assignment (potential issue) |
| types/index.ts Gym.id | string | number from DB | Inconsistent | Standardize to string |
| gamificationStore.ts | cities_visited: string[] | Set<string> in store | Conversion needed | Array.from() used ✓ |

**API Contract Definitions:**
- Request/response types: Partially defined in types/index.ts
- Shared types location: types/index.ts (frontend only)
- Backend types: Inline interfaces in Edge Functions (not shared)
- Consistency: ⚠ Types not shared between frontend and backend

**Schema Validation:**
- Backend: Basic required field checks, no schema library (e.g., Zod)
- Frontend: TanStack Query handles response, minimal validation
- Database: PostgreSQL constraints, Supabase RLS policies
- Consistency: ⚠ Validation rules not consistent across layers

**Contract Documentation:**
- API documentation: ❌ None
- Generated docs: ❌ No OpenAPI/Swagger
- Up to date: N/A

**Schema Validation:**
- Backend request validation (library used, coverage)
- Frontend form validation
- Database schema validation
- Are validation rules consistent across layers?

**Contract Documentation:**
- API documentation exists?
- Is it generated or manual?
- Is it up to date?

---

### AUDIT SECTION 11: INTEGRATION ISSUES REPORT

Compile all issues found into severity categories:

### CRITICAL (Broken functionality - fix immediately)
```
ISSUE #1: Missing Scheduled Job for Travel Alerts
Location: notifications-travel-alert Edge Function
Description: Travel alert notifications require a scheduler to scan travel_periods daily
Impact: Users never receive 7-day or 1-day trip reminders
Current Behavior: Edge Function exists but is never called
Expected Behavior: Daily cron job triggers alerts for upcoming trips
Recommended Fix: Add Supabase pg_cron job or external scheduler (e.g., Vercel Cron)
Effort Estimate: Medium
```

### HIGH (Potential failures - fix soon)
```
ISSUE #2: Missing Authentication on 8 Edge Functions
Location: voice-process-query, gym-personalize, notifications-travel-alert, send-push, send-email, notify-admin, calendar-extract-destination, firecrawl-scrape
Description: These endpoints have no JWT validation
Impact: Anyone can call these endpoints, potential abuse/cost
Current Behavior: Endpoints accept any request
Expected Behavior: Require valid Supabase JWT
Recommended Fix: Add JWT validation middleware to each function
Effort Estimate: Low

ISSUE #3: No Webhook Signature Verification for Tally
Location: supabase/functions/tally-webhook/index.ts
Description: Tally webhooks not verified with signature
Impact: Malicious actors could submit fake form data
Current Behavior: All POST requests accepted
Expected Behavior: Verify Tally webhook signature
Recommended Fix: Implement Tally signature verification
Effort Estimate: Low

ISSUE #4: Dual Push Notification Systems
Location: send-push (Expo) and notifications-travel-alert (OneSignal)
Description: Two different push notification services configured
Impact: Inconsistent notification delivery, maintenance overhead
Current Behavior: Different features use different services
Expected Behavior: Single unified push notification system
Recommended Fix: Consolidate to one service (recommend Expo for RN apps)
Effort Estimate: Medium
```

### MEDIUM (Best practice violations - plan to fix)
```
ISSUE #5: No Shared Types Between Frontend and Backend
Location: types/index.ts (frontend), inline types in Edge Functions
Description: Type definitions duplicated and potentially inconsistent
Impact: Type mismatches between layers, maintenance burden
Current Behavior: Types defined separately in each layer
Expected Behavior: Shared type package or generated types
Recommended Fix: Create shared types package or use Supabase type generation
Effort Estimate: Medium

ISSUE #6: Inconsistent Error Handling in Admin/Partner Portals
Location: admin-portal/src/*, partner-portal/src/*
Description: Error handling patterns vary across components
Impact: Inconsistent user experience, potential silent failures
Current Behavior: Some errors caught, some not
Expected Behavior: Consistent error boundaries and toast notifications
Recommended Fix: Implement global error boundary and toast system
Effort Estimate: Medium

ISSUE #7: Missing Loading States in Gamification Store
Location: stores/gamificationStore.ts
Description: Database sync operations have no loading indicators
Impact: User may not know when data is being saved
Current Behavior: Operations happen silently
Expected Behavior: Loading states for sync operations
Recommended Fix: Add isLoading/isSyncing state to store
Effort Estimate: Low

ISSUE #8: Potential Duplicate Tables (reviews vs gym_reviews)
Location: supabase/migrations/001_initial_schema.sql, 003_missing_tables.sql
Description: Both 'reviews' and 'gym_reviews' tables exist
Impact: Data fragmentation, confusion about which to use
Current Behavior: Both tables exist, unclear which is canonical
Expected Behavior: Single reviews table
Recommended Fix: Audit usage and consolidate to one table
Effort Estimate: Medium
```

### LOW (Optimization opportunities - nice to have)
```
ISSUE #9: No API Documentation
Location: N/A
Description: No OpenAPI/Swagger documentation for Edge Functions
Impact: Harder for developers to understand API contracts
Current Behavior: Must read code to understand endpoints
Expected Behavior: Auto-generated API documentation
Recommended Fix: Add OpenAPI spec or use Supabase's built-in docs
Effort Estimate: Medium

ISSUE #10: Limited Test Coverage
Location: __tests__/
Description: Only 3 test files exist (filter logic, auth store, booking store)
Impact: Regressions may go unnoticed
Current Behavior: Minimal unit tests, no integration tests
Expected Behavior: Comprehensive test suite
Recommended Fix: Add tests for critical flows (payment, booking, auth)
Effort Estimate: High

ISSUE #11: No Rate Limiting on Edge Functions
Location: All Edge Functions
Description: No rate limiting implemented
Impact: Potential for abuse, especially on AI-powered endpoints
Current Behavior: Unlimited requests allowed
Expected Behavior: Rate limiting per user/IP
Recommended Fix: Implement rate limiting middleware or use Supabase's built-in
Effort Estimate: Medium
```

---

### AUDIT SECTION 12: ORPHANED & DEAD CODE

**Frontend Calls to Non-Existent Endpoints:**
| Frontend Location | Target Endpoint | Likely Cause |
|-------------------|-----------------|--------------|
| None identified | | All endpoints exist |

**Backend Endpoints with No Consumers:**
| Endpoint | Last Modified | Recommendation |
|----------|---------------|----------------|
| voice-transcribe | Unknown | Remove - native iOS speech used instead |
| firecrawl-scrape | Unknown | Investigate - no frontend calls found |
| notifications-travel-alert | Unknown | Keep - needs scheduler to trigger |

**Unused Database Tables:**
| Table | Recommendation |
|-------|----------------|
| passes | Investigate - no code references found |
| gym_reviews | Consolidate with reviews table |

**Unused External Integrations:**
| Service | Configured In | Recommendation |
|---------|---------------|----------------|
| OpenAI Whisper | voice-transcribe | Remove - using native iOS speech |

**Orphaned Scripts/Jobs:**
| Script | Last Modified | Recommendation |
|--------|---------------|----------------|
| N/A | | No traditional scripts in project |

**Dead Code Patterns:**
- ✓ No unreachable functions identified
- ⚠ voice-transcribe Edge Function unused (native iOS speech used)
- ⚠ Potential duplicate: reviews vs gym_reviews tables
- ✓ No unused exports identified

---

### AUDIT SECTION 13: BEST PRACTICE VIOLATIONS

**Error Handling:**
- ✓ Edge Functions use try/catch consistently
- ⚠ Admin/Partner portals have inconsistent error handling
- ⚠ gamificationStore logs errors to console only
- ✓ Frontend hooks throw errors for TanStack Query to handle

**Input Validation:**
- ⚠ Edge Functions have basic required field checks only
- ⚠ No schema validation library (Zod, Yup) used
- ✓ Supabase RLS provides database-level security
- ✓ No SQL injection risk (parameterized queries via Supabase client)
- ✓ No XSS risk (React escapes by default)

**Performance:**
- ✓ TanStack Query provides caching and deduplication
- ✓ PostGIS indexes for geolocation queries
- ⚠ No pagination on gym search results
- ✓ Async operations throughout
- ⚠ No CDN caching for gym photos (proxied through Edge Function)
- ✓ Reasonable payload sizes

**Security:**
- ⚠ 8 Edge Functions missing authentication (see Issue #2)
- ✓ Supabase Auth with OAuth providers
- ⚠ No rate limiting on Edge Functions
- ✓ Sensitive data not exposed in responses
- ✓ RLS policies prevent unauthorized data access

**Code Organization:**
- ⚠ Types not shared between frontend and backend
- ✓ Reasonable file sizes (largest ~300 lines)
- ✓ Good separation: hooks, stores, services, components
- ⚠ No shared utilities package
- ⚠ Inconsistent patterns between mobile app and web portals

**UX:**
- ✓ Loading states in most hooks (isLoading)
- ⚠ gamificationStore missing loading states
- ✓ Error feedback via TanStack Query error states
- ✓ Success confirmations (toasts, navigation)
- ✓ Core flows (auth, booking, payment) well-implemented

---

### AUDIT SECTION 14: ARCHITECTURE RECOMMENDATIONS

**Immediate Improvements (1-2 days):**
1. Add JWT authentication to 8 unprotected Edge Functions
2. Add Tally webhook signature verification
3. Add loading states to gamificationStore
4. Remove unused voice-transcribe Edge Function

**Short-term Improvements (1-2 weeks):**
1. Implement scheduled job for travel alert notifications (pg_cron or external)
2. Consolidate push notification systems (OneSignal vs Expo Push)
3. Add schema validation (Zod) to Edge Functions
4. Consolidate reviews/gym_reviews tables
5. Add rate limiting to Edge Functions
6. Standardize error handling in Admin/Partner portals

**Long-term Improvements (1+ months):**
1. Create shared types package between frontend and backend
2. Generate TypeScript types from Supabase schema
3. Add comprehensive test coverage (unit + integration)
4. Create OpenAPI documentation for Edge Functions
5. Implement real-time subscriptions for booking updates
6. Add CDN caching for gym photos
7. Unify patterns between mobile app and web portals

**Consolidation Opportunities:**
- ⚠ reviews vs gym_reviews tables should be consolidated
- ⚠ OneSignal vs Expo Push should use single system
- ⚠ Admin/Partner portal patterns should be unified
- ✓ Hooks follow consistent TanStack Query pattern

**Documentation Needs:**
- ❌ API documentation (no OpenAPI/Swagger)
- ❌ Architecture diagrams
- ⚠ Setup/deployment guides (partial in README)
- ⚠ Code comments (minimal, mostly self-documenting)

**Testing Gaps:**
- ❌ No integration tests for critical flows
- ❌ Payment flow not tested
- ❌ Auth flow not tested end-to-end
- ⚠ Only filter logic and stores have unit tests
- ❌ External integrations not mocked

---

## DELIVERABLE SUMMARY

**Overall Integration Health Score: 7/10**

**Discovery Statistics:**
- Backend Endpoints: 18 (Supabase Edge Functions)
- Frontend API Calls: ~25 (hooks + services + stores)
- Database Tables: 25+ (across 6 migrations)
- Scripts/Jobs: 0 (event-driven architecture)
- External Integrations: 8 (Stripe, Google Places, OpenAI, Gemini, OneSignal, Expo Push, Resend, Tally)
- Real-Time Channels: 1 (auth state only)

**Issues Found:**
- Critical: 1 (Missing travel alert scheduler)
- High: 4 (Missing auth, Tally verification, dual push systems)
- Medium: 4 (Shared types, error handling, loading states, duplicate tables)
- Low: 3 (API docs, test coverage, rate limiting)

**Top 5 Most Critical Findings:**
1. **Missing Scheduler** - Travel alert notifications never sent (no cron job)
2. **8 Unprotected Endpoints** - Edge Functions missing JWT authentication
3. **No Tally Webhook Verification** - Form submissions not verified
4. **Dual Push Systems** - OneSignal and Expo Push both configured
5. **No Shared Types** - Frontend/backend type definitions not synchronized

**Immediate Action Items (Do This Week):**
1. Add JWT authentication to 8 unprotected Edge Functions
2. Implement Tally webhook signature verification
3. Set up pg_cron or external scheduler for travel alerts

**Integration Health by Layer:**
- Frontend ↔ Backend Communication: 8/10 (TanStack Query well-implemented)
- Backend ↔ Database Integration: 8/10 (Supabase client works well)
- External API Integrations: 7/10 (All working, some redundancy)
- Scripts/Jobs Integration: 4/10 (Missing scheduler for alerts)
- Authentication System: 6/10 (Good OAuth, but 8 endpoints unprotected)
- Real-Time Systems: 5/10 (Available but underutilized)
- Configuration Management: 8/10 (Env vars well-organized)
- Type Safety/Contracts: 6/10 (Types exist but not shared)

**Audit Confidence Level:** High
Based on: Full codebase access, clear project structure, comprehensive migrations, well-organized Edge Functions

**Recommended Follow-Up Audits:**
- Security audit of RLS policies
- Performance audit of database queries
- Accessibility audit of mobile app
- Load testing of Edge Functions

---

## END OF PROMPT

---

## After You Receive the Audit

Once the AI completes the audit, you should:

1. **Review CRITICAL issues immediately** - These are blocking production functionality
2. **Validate findings** - AI might occasionally misinterpret patterns, verify before acting
3. **Create tickets** for all HIGH and CRITICAL issues
4. **Schedule fixes** for MEDIUM priority issues  
5. **Discuss LOW priority** optimizations with your team
6. **Update documentation** based on discovered architecture
7. **Re-run audit** after major fixes are implemented
8. **Add automated tests** for critical integration points

## Tips for Best Results

1. **Provide Complete Code Access**: Give the AI access to your entire codebase - the more it can see, the better the audit
2. **Let It Explore**: Don't interrupt the discovery phase - let the AI fully map your architecture first
3. **Run on Modules**: For massive codebases (100k+ lines), consider running per module/feature
4. **Validate Discoveries**: Check that the AI correctly identified your tech stack in Phase 0
5. **Ask Follow-ups**: If something is unclear, ask the AI to dive deeper into specific areas
6. **Iterate the Prompt**: Based on results, refine this prompt for your specific patterns
7. **Schedule Regular Audits**: Run monthly or after major architectural changes

## What to Expect

**Discovery Phase (Phase 0)**: The AI will spend time analyzing your codebase structure, identifying technologies, mapping folders, and understanding your architecture. This is crucial for accurate auditing.

**Audit Phase (Phase 1)**: Systematic analysis of every integration point with detailed tables and findings.

**Total Time**: Depending on codebase size:
- Small projects (<10k lines): 5-10 minutes
- Medium projects (10k-50k lines): 10-30 minutes  
- Large projects (50k+ lines): 30+ minutes or multiple sessions

## Common Issues the AI Will Find

- Frontend calling non-existent backend endpoints
- Backend endpoints never called by frontend (dead code)
- Missing error handling on API calls
- Database tables not accessed by any code
- Inconsistent data contracts between layers
- Missing authentication on protected routes
- Hardcoded configuration values
- External API integrations without error handling
- Missing loading states on frontend
- N+1 query problems in database access
- Type mismatches between frontend and backend
- Orphaned scripts that are never executed

---

## Version History

- **v2.0** - Autonomous discovery, zero manual configuration required
- **v1.0** - Initial comprehensive integration audit prompt

---

## License & Usage

Free to use and modify. This is a living document - improve it based on your findings and share enhancements back to your team.