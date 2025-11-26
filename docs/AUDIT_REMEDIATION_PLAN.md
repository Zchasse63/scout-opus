# Scout Fitness App - Audit Remediation Plan

> **Generated:** November 25, 2025
> **Last Updated:** November 26, 2025
> **Status:** Partially Complete
> **Total Issues Identified:** 48
> **Issues Resolved:** ~30
> **Estimated Phases:** 5

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Phase 1: Database Foundation](#phase-1-database-foundation)
3. [Phase 2: Partner Portal Completion](#phase-2-partner-portal-completion)
4. [Phase 3: Admin Portal Completion](#phase-3-admin-portal-completion)
5. [Phase 4: Core Feature Integration](#phase-4-core-feature-integration)
6. [Phase 5: Polish & Notifications](#phase-5-polish--notifications)
7. [Appendix: Full Issue Registry](#appendix-full-issue-registry)

---

## Executive Summary

### Current State Assessment (Updated Nov 26, 2025)

| Component | Completion | Status |
|-----------|------------|--------|
| Mobile App (Expo) | 85% | Mock data, missing integrations |
| Partner Portal (React) | **90%** | ✅ All files exist, needs testing |
| Admin Portal (React) | **90%** | ✅ All files exist, needs testing |
| Database (Supabase) | 55% | Migration 003 ready to apply |
| Edge Functions | 70% | Payment & QR validation stubs |

### Implementation Priority Rationale

1. **Database First** - Apply 003_missing_tables.sql migration
2. ~~**Portals Second**~~ ✅ Partner & Admin portals now complete
3. **Core Features Third** - Search, payments, QR validation
4. **Polish Last** - Notifications, analytics, gamification completion

---

## Phase 1: Database Foundation

**Goal:** Create all missing database tables and ensure schema completeness
**Dependencies:** None
**Estimated Tasks:** 12

### Task 1.1: Create Missing Tables Migration

**File:** `supabase/migrations/003_missing_tables.sql`

#### Subtask 1.1.1: Partner & Application Tables
```
- [ ] Create `partners` table
      - id (UUID, PK)
      - user_id (UUID, FK -> users)
      - business_name (TEXT)
      - stripe_account_id (TEXT)
      - stripe_onboarding_complete (BOOLEAN)
      - status (TEXT: pending, active, suspended)
      - created_at, updated_at (TIMESTAMPTZ)

- [ ] Create `partner_applications` table
      - id (UUID, PK)
      - gym_name (TEXT)
      - contact_name (TEXT)
      - contact_email (TEXT)
      - contact_phone (TEXT)
      - address (TEXT)
      - website (TEXT, nullable)
      - description (TEXT)
      - why_partner (TEXT)
      - status (TEXT: pending, approved, rejected)
      - submitted_at (TIMESTAMPTZ)
      - reviewed_at (TIMESTAMPTZ, nullable)
      - reviewed_by (UUID, FK -> users, nullable)
      - rejection_reason (TEXT, nullable)
```

#### Subtask 1.1.2: Support System Tables
```
- [ ] Create `support_tickets` table
      - id (UUID, PK)
      - user_id (UUID, FK -> users)
      - user_email (TEXT)
      - user_name (TEXT)
      - subject (TEXT)
      - description (TEXT)
      - category (TEXT: booking, payment, account, technical, other)
      - priority (TEXT: low, medium, high, urgent)
      - status (TEXT: open, in_progress, resolved, closed)
      - assigned_to (UUID, FK -> users, nullable)
      - created_at, updated_at (TIMESTAMPTZ)

- [ ] Create `ticket_messages` table
      - id (UUID, PK)
      - ticket_id (UUID, FK -> support_tickets)
      - sender_type (TEXT: user, admin)
      - sender_name (TEXT)
      - message (TEXT)
      - created_at (TIMESTAMPTZ)
```

#### Subtask 1.1.3: Content Moderation Tables
```
- [ ] Create `gym_reviews` table (extends reviews with moderation)
      - id (BIGINT, PK)
      - user_id (UUID, FK -> users)
      - gym_id (BIGINT, FK -> gyms)
      - booking_id (BIGINT, FK -> bookings, nullable)
      - rating (INTEGER, 1-5)
      - title (TEXT, nullable)
      - comment (TEXT)
      - moderation_status (TEXT: pending, approved, rejected)
      - moderation_notes (TEXT, nullable)
      - moderated_by (UUID, FK -> users, nullable)
      - moderated_at (TIMESTAMPTZ, nullable)
      - created_at, updated_at (TIMESTAMPTZ)

- [ ] Create `gym_verification_queue` table
      - id (UUID, PK)
      - gym_id (BIGINT, FK -> gyms)
      - field_name (TEXT)
      - old_value (TEXT, nullable)
      - new_value (TEXT)
      - source (TEXT: user_submission, firecrawl, partner)
      - status (TEXT: pending, approved, rejected)
      - reviewed_by (UUID, FK -> users, nullable)
      - reviewed_at (TIMESTAMPTZ, nullable)
      - created_at (TIMESTAMPTZ)
```

#### Subtask 1.1.4: Gym Claims & Verification Tables
```
- [ ] Create `gym_claims` table
      - id (UUID, PK)
      - gym_id (BIGINT, FK -> gyms)
      - user_id (UUID, FK -> users)
      - business_email (TEXT)
      - proof_document_url (TEXT, nullable)
      - status (TEXT: pending, approved, rejected)
      - rejection_reason (TEXT, nullable)
      - created_at (TIMESTAMPTZ)
      - reviewed_at (TIMESTAMPTZ, nullable)

- [ ] Create `verification_requests` table
      - id (UUID, PK)
      - gym_id (BIGINT, FK -> gyms)
      - requester_email (TEXT)
      - requester_name (TEXT)
      - verification_type (TEXT: hours, amenities, pricing, contact)
      - current_value (TEXT, nullable)
      - suggested_value (TEXT)
      - status (TEXT: pending, approved, rejected)
      - created_at (TIMESTAMPTZ)
```

#### Subtask 1.1.5: Pass & Scraping Tables
```
- [ ] Create `passes` table
      - id (UUID, PK)
      - user_id (UUID, FK -> users)
      - gym_id (BIGINT, FK -> gyms)
      - booking_id (BIGINT, FK -> bookings)
      - pass_type (TEXT: day, week, month)
      - valid_from (DATE)
      - valid_until (DATE)
      - status (TEXT: active, used, expired, cancelled)
      - qr_code_data (JSONB)
      - created_at (TIMESTAMPTZ)

- [ ] Create `scraping_queue` table
      - id (UUID, PK)
      - gym_id (BIGINT, FK -> gyms, nullable)
      - url (TEXT)
      - source (TEXT: google_places, yelp, website)
      - status (TEXT: pending, processing, completed, failed)
      - result (JSONB, nullable)
      - error_message (TEXT, nullable)
      - attempts (INTEGER, default 0)
      - created_at (TIMESTAMPTZ)
      - processed_at (TIMESTAMPTZ, nullable)
```

### Task 1.2: Add Gamification Tables

**File:** `supabase/migrations/003_missing_tables.sql` (continued)

#### Subtask 1.2.1: User Achievement System
```
- [ ] Create `user_stats` table
      - user_id (UUID, PK, FK -> users)
      - total_points (INTEGER, default 0)
      - current_level (INTEGER, default 1)
      - total_bookings (INTEGER, default 0)
      - total_check_ins (INTEGER, default 0)
      - current_streak (INTEGER, default 0)
      - longest_streak (INTEGER, default 0)
      - cities_visited (TEXT[], default '{}')
      - last_check_in_date (DATE, nullable)
      - updated_at (TIMESTAMPTZ)

- [ ] Create `user_achievements` table
      - id (UUID, PK)
      - user_id (UUID, FK -> users)
      - badge_id (TEXT)
      - badge_name (TEXT)
      - badge_category (TEXT)
      - points_awarded (INTEGER)
      - earned_at (TIMESTAMPTZ)

- [ ] Create `user_activity_log` table
      - id (UUID, PK)
      - user_id (UUID, FK -> users)
      - activity_type (TEXT: booking, check_in, review, photo, referral)
      - points_earned (INTEGER)
      - metadata (JSONB)
      - created_at (TIMESTAMPTZ)
```

### Task 1.3: Add RLS Policies for New Tables

#### Subtask 1.3.1: Partner & Support Policies
```
- [ ] partners: Partners can view/update own record
- [ ] partner_applications: Public insert, admin select/update
- [ ] support_tickets: Users view own, admins view all
- [ ] ticket_messages: Users view own ticket messages
```

#### Subtask 1.3.2: Content & Moderation Policies
```
- [ ] gym_reviews: Public read approved, users create own
- [ ] gym_verification_queue: Admin only
- [ ] gym_claims: Users create own, admins manage
- [ ] verification_requests: Public create, admin manage
```

#### Subtask 1.3.3: Gamification Policies
```
- [ ] user_stats: Users read/update own
- [ ] user_achievements: Users read own
- [ ] user_activity_log: Users read own, system insert
```

### Task 1.4: Add Database Indexes

```
- [ ] Index on support_tickets(status, created_at)
- [ ] Index on partner_applications(status)
- [ ] Index on gym_reviews(gym_id, moderation_status)
- [ ] Index on gym_verification_queue(status)
- [ ] Index on user_stats(total_points DESC) for leaderboard
- [ ] Index on passes(user_id, status)
```

---

## Phase 2: Partner Portal Completion

**Goal:** Make partner portal compile and fully functional
**Dependencies:** Phase 1 (database tables)
**Estimated Tasks:** 8

### Task 2.1: Create Shared Infrastructure

#### Subtask 2.1.1: Supabase Client
**File:** `partner-portal/src/lib/supabase.ts`
```
- [ ] Initialize Supabase client with environment variables
- [ ] Export typed client instance
- [ ] Add helper for auth state subscription
```

#### Subtask 2.1.2: Auth Store
**File:** `partner-portal/src/stores/authStore.ts`
```
- [ ] Create Zustand store with:
      - user state (Partner type)
      - isAuthenticated boolean
      - isLoading boolean
      - login(email, password) async method
      - logout() method
      - checkAuth() method for session restoration
- [ ] Subscribe to Supabase auth changes
- [ ] Store partner profile data alongside auth
```

#### Subtask 2.1.3: TypeScript Types
**File:** `partner-portal/src/types/index.ts`
```
- [ ] Define Partner interface
- [ ] Define Booking interface (partner view)
- [ ] Define FinancialSummary interface
- [ ] Define GymProfile interface
```

### Task 2.2: Create Layout Component

**File:** `partner-portal/src/components/Layout.tsx`

```
- [ ] Create responsive sidebar navigation with links:
      - Dashboard (/)
      - Gym Profile (/profile)
      - Bookings (/bookings)
      - Financials (/financials)
      - QR Scanner (/scanner)
      - Stripe Setup (/stripe-onboarding)
- [ ] Add header with partner name and logout button
- [ ] Use React Router Outlet for content area
- [ ] Add mobile-responsive hamburger menu
```

### Task 2.3: Create Login Page

**File:** `partner-portal/src/pages/Login.tsx`

```
- [ ] Create login form with email/password fields
- [ ] Add form validation with react-hook-form + zod
- [ ] Implement login submission via authStore
- [ ] Add error handling and display
- [ ] Add "Forgot Password" link (can be placeholder)
- [ ] Style with Tailwind matching admin portal
```

### Task 2.4: Create Gym Profile Page

**File:** `partner-portal/src/pages/GymProfile.tsx`

```
- [ ] Fetch gym data for current partner
- [ ] Create editable form sections:
      - Basic info (name, description, phone, website)
      - Address (with map preview if possible)
      - Operating hours (7-day grid)
      - Amenities (checkbox grid)
      - Pricing (day/week/month pass prices)
- [ ] Add photo management section
      - Display current photos
      - Upload new photos
      - Reorder/delete photos
- [ ] Save changes to Supabase
- [ ] Show success/error toast notifications
```

### Task 2.5: Create Bookings Page

**File:** `partner-portal/src/pages/Bookings.tsx`

```
- [ ] Fetch bookings for partner's gym(s)
- [ ] Create filterable/sortable table with columns:
      - Customer name
      - Pass type
      - Booking date
      - Status (confirmed, used, cancelled)
      - Amount
      - Actions
- [ ] Add date range filter
- [ ] Add status filter tabs
- [ ] Add search by customer name/email
- [ ] Implement pagination
- [ ] Add "Mark as Used" action for manual check-in
- [ ] Add booking detail modal
```

### Task 2.6: Create Financials Page

**File:** `partner-portal/src/pages/Financials.tsx`

```
- [ ] Create summary cards:
      - Total Revenue (this month)
      - Total Payouts (this month)
      - Pending Payouts
      - Platform Fees Paid
- [ ] Create revenue chart (Recharts):
      - Daily/weekly/monthly toggle
      - Line chart with revenue over time
- [ ] Create transactions table:
      - Date, Customer, Amount, Fee, Net, Status
      - Pagination
- [ ] Create payout history section:
      - Payout date, Amount, Status, Stripe transfer ID
- [ ] Add "Request Payout" button (if manual payouts)
- [ ] Add export to CSV functionality
```

### Task 2.7: Create Entry Point Files

#### Subtask 2.7.1: Main Entry
**File:** `partner-portal/src/main.tsx`
```
- [ ] Import React and ReactDOM
- [ ] Import BrowserRouter
- [ ] Import App component
- [ ] Import global styles (index.css)
- [ ] Render App wrapped in BrowserRouter
```

#### Subtask 2.7.2: Global Styles
**File:** `partner-portal/src/index.css`
```
- [ ] Import Tailwind directives (@tailwind base, components, utilities)
- [ ] Add any custom global styles
- [ ] Add custom scrollbar styles if needed
```

#### Subtask 2.7.3: HTML Template
**File:** `partner-portal/index.html`
```
- [ ] Create standard Vite HTML template
- [ ] Set title to "Scout Partner Portal"
- [ ] Add favicon link
- [ ] Add root div and script module import
```

### Task 2.8: Update Dashboard with Real Data

**File:** `partner-portal/src/pages/Dashboard.tsx` (existing, needs update)

```
- [ ] Replace mock data with Supabase queries
- [ ] Fetch today's bookings count
- [ ] Fetch this week's revenue
- [ ] Fetch pending check-ins
- [ ] Fetch recent bookings list
- [ ] Add real-time subscription for new bookings
- [ ] Add loading states
- [ ] Add empty states
```

---

## Phase 3: Admin Portal Completion

**Goal:** Make admin portal compile and fully functional
**Dependencies:** Phase 1 (database tables)
**Estimated Tasks:** 9

### Task 3.1: Create Shared Infrastructure

#### Subtask 3.1.1: Supabase Client
**File:** `admin-portal/src/lib/supabase.ts`
```
- [ ] Initialize Supabase client with environment variables
- [ ] Export typed client instance
- [ ] Add admin role verification helper
```

#### Subtask 3.1.2: Auth Store
**File:** `admin-portal/src/stores/authStore.ts`
```
- [ ] Create Zustand store with:
      - user state (AdminUser type)
      - isAuthenticated boolean
      - isLoading boolean
      - role (admin, super_admin)
      - login(email, password) async method
      - logout() method
      - checkAuth() method
- [ ] Verify admin role on login
- [ ] Reject non-admin users
```

#### Subtask 3.1.3: TypeScript Types
**File:** `admin-portal/src/types/index.ts`
```
- [ ] Define AdminUser interface
- [ ] Define PlatformStats interface
- [ ] Define UserManagement interface
- [ ] Define AnalyticsData interface
```

### Task 3.2: Create Layout Component

**File:** `admin-portal/src/components/Layout.tsx`

```
- [ ] Create sidebar navigation with links:
      - Dashboard (/)
      - Partner Approvals (/partners)
      - Support Tickets (/tickets)
      - Content Moderation (/moderation)
      - Financials (/financials)
      - Users (/users)
      - Analytics (/analytics)
- [ ] Add header with admin name and role badge
- [ ] Add logout button
- [ ] Use React Router Outlet
- [ ] Add notification bell with unread count
```

### Task 3.3: Create Login Page

**File:** `admin-portal/src/pages/Login.tsx`

```
- [ ] Create secure login form
- [ ] Add form validation
- [ ] Implement login with admin role check
- [ ] Add rate limiting awareness (show lockout message)
- [ ] Add 2FA field (placeholder for future)
- [ ] Style with Tailwind
```

### Task 3.4: Create Dashboard Page

**File:** `admin-portal/src/pages/Dashboard.tsx`

```
- [ ] Create KPI cards row:
      - Total Users (with growth %)
      - Active Partners
      - Revenue This Month
      - Support Tickets Open
- [ ] Create charts section:
      - User signups over time (area chart)
      - Revenue by day (bar chart)
      - Bookings by pass type (pie chart)
- [ ] Create recent activity feed:
      - New partner applications
      - New support tickets
      - Flagged content
- [ ] Create quick actions:
      - View pending approvals
      - View open tickets
      - View moderation queue
```

### Task 3.5: Create Financials Page

**File:** `admin-portal/src/pages/Financials.tsx`

```
- [ ] Create platform summary cards:
      - Gross Revenue (all time)
      - Platform Fees Earned
      - Partner Payouts
      - Refunds Issued
- [ ] Create revenue breakdown chart:
      - By partner (top 10)
      - By pass type
      - By region
- [ ] Create transactions table:
      - All platform transactions
      - Filter by type (booking, refund, payout)
      - Search by partner or user
- [ ] Create partner payouts section:
      - Pending payouts
      - Process payout button
      - Payout history
- [ ] Add date range selector
- [ ] Add export functionality
```

### Task 3.6: Create Users Page

**File:** `admin-portal/src/pages/Users.tsx`

```
- [ ] Create user search and filters:
      - Search by name/email
      - Filter by status (active, suspended)
      - Filter by role (user, partner, admin)
- [ ] Create users table:
      - Name, Email, Role, Status, Joined, Last Active
      - Sortable columns
      - Pagination
- [ ] Create user detail modal:
      - Profile information
      - Booking history
      - Support tickets
      - Activity log
- [ ] Add user actions:
      - Suspend/unsuspend
      - Reset password
      - Change role
      - Delete account
- [ ] Add "Create Admin" button for super_admins
```

### Task 3.7: Create Analytics Page

**File:** `admin-portal/src/pages/Analytics.tsx`

```
- [ ] Create date range selector (preset: 7d, 30d, 90d, custom)
- [ ] Create user analytics section:
      - New signups over time
      - Active users (DAU/WAU/MAU)
      - User retention cohorts
      - Geographic distribution
- [ ] Create booking analytics section:
      - Bookings over time
      - Conversion rate (search -> booking)
      - Average booking value
      - Popular times/days
- [ ] Create partner analytics section:
      - Partner growth
      - Revenue per partner
      - Top performing partners
      - Partner churn
- [ ] Create search analytics section:
      - Popular search terms
      - Voice vs text search ratio
      - Search-to-booking conversion
- [ ] Add export to CSV/PDF
```

### Task 3.8: Create Entry Point Files

#### Subtask 3.8.1: Main Entry
**File:** `admin-portal/src/main.tsx`
```
- [ ] Import React and ReactDOM
- [ ] Import BrowserRouter
- [ ] Import App component
- [ ] Import global styles
- [ ] Render App wrapped in BrowserRouter
```

#### Subtask 3.8.2: Global Styles
**File:** `admin-portal/src/index.css`
```
- [ ] Import Tailwind directives
- [ ] Add custom admin theme variables
- [ ] Add utility classes
```

#### Subtask 3.8.3: HTML Template
**File:** `admin-portal/index.html`
```
- [ ] Create Vite HTML template
- [ ] Set title to "Scout Admin Portal"
- [ ] Add favicon
- [ ] Add root div and script import
```

### Task 3.9: Update Existing Pages with Real Queries

#### Subtask 3.9.1: PartnerApprovals.tsx
```
- [ ] Add reviewed_by field (current admin user)
- [ ] Implement createPartnerAccount() on approval
- [ ] Implement sendApprovalEmail()
- [ ] Implement sendRejectionEmail()
```

#### Subtask 3.9.2: SupportTickets.tsx
```
- [ ] Get admin name from auth store (line 107)
- [ ] Implement sendEmailNotification() on reply (line 121)
- [ ] Add ticket assignment functionality
```

#### Subtask 3.9.3: ContentModeration.tsx
```
- [ ] Implement awardPoints() for approved content (line 98)
- [ ] Add bulk moderation actions
- [ ] Add content preview modal
```

---

## Phase 4: Core Feature Integration

**Goal:** Connect all mock implementations to real backends
**Dependencies:** Phase 1, Phase 2, Phase 3
**Estimated Tasks:** 10

### Task 4.1: Implement Search API

**File:** `stores/searchStore.ts`

```
- [ ] Replace mock data at line 162 with real implementation
- [ ] Create Supabase RPC function for spatial search:
      - Input: lat, lng, radius, filters
      - Use PostGIS ST_DWithin for radius search
      - Apply amenity filters
      - Apply price range filters
      - Apply rating filters
      - Return paginated results with distance
- [ ] Implement search debouncing
- [ ] Add search result caching
- [ ] Handle empty results gracefully
```

**File:** `supabase/functions/search-gyms/index.ts` (new)
```
- [ ] Create Edge Function for complex searches
- [ ] Accept query parameters
- [ ] Perform spatial query with filters
- [ ] Sort by distance or rating
- [ ] Return formatted results
```

### Task 4.2: Implement Voice Transcription

**File:** `components/voice/VoiceRecordingView.tsx`

```
- [ ] Replace mock at line 115 with real implementation
- [ ] Send audio to voice-transcribe Edge Function
- [ ] Handle transcription response
- [ ] Parse intent and populate search
- [ ] Add error handling for transcription failures
- [ ] Add retry logic
```

### Task 4.3: Implement Payment Intent Creation

**File:** `supabase/functions/payments-create-intent/index.ts`

```
- [ ] Get gym's Stripe connected account ID (line 31)
      - Query partners table for stripe_account_id
      - Verify stripe_onboarding_complete is true
- [ ] Create PaymentIntent with Stripe (line 34)
      - Calculate platform fee (15%)
      - Set transfer_data for connected account
      - Include booking metadata
      - Return client_secret
- [ ] Add error handling
- [ ] Add idempotency key support
```

### Task 4.4: Implement QR Validation

**File:** `supabase/functions/bookings-validate-qr/index.ts`

```
- [ ] Implement validation logic at line 23
- [ ] Parse QR code data (booking_id, user_id, signature)
- [ ] Verify booking exists
- [ ] Verify booking status is 'confirmed'
- [ ] Verify booking date is valid
- [ ] Verify gym matches scanner's gym
- [ ] Update booking status to 'used'
- [ ] Record check-in timestamp
- [ ] Return validation result
```

### Task 4.5: Connect UGC Submissions

#### Subtask 4.5.1: Photo Upload
**File:** `components/ugc/SubmitPhoto.tsx`
```
- [ ] Implement upload at line 101
- [ ] Upload to Supabase Storage (gym-photos bucket)
- [ ] Create gym_photos record with pending status
- [ ] Create gym_verification_queue entry
- [ ] Award points via gamification store
- [ ] Show success confirmation
```

#### Subtask 4.5.2: Review Submission
**File:** `components/ugc/SubmitReview.tsx`
```
- [ ] Implement submission at line 46
- [ ] Verify user has valid booking for gym
- [ ] Create gym_reviews record with pending status
- [ ] Award points via gamification store
- [ ] Show success confirmation
```

### Task 4.6: Implement Trip Creation

**File:** `components/trips/AddTripButton.tsx`

```
- [ ] Implement API call at line 109
- [ ] Insert into travel_periods table
- [ ] Set source as 'manual'
- [ ] Trigger gym recommendations for destination
- [ ] Update UI with new trip
```

### Task 4.7: Implement QR Code Modal

**File:** `app/(tabs)/passes.tsx`

```
- [ ] Implement QR code modal at line 75
- [ ] Generate QR code with booking data:
      - booking_id
      - user_id
      - gym_id
      - expiry timestamp
      - signature (HMAC for verification)
- [ ] Display QR code with react-native-qrcode-svg
- [ ] Add brightness boost on modal open
- [ ] Add "Add to Wallet" button (placeholder)
```

### Task 4.8: Connect Dashboard Queries (Partner Portal)

**File:** `partner-portal/src/pages/Dashboard.tsx`

```
- [ ] Implement actual queries at line 43
- [ ] Query today's bookings for partner's gym(s)
- [ ] Query this week's revenue (sum of gym_payout)
- [ ] Query pending check-ins (status = 'confirmed')
- [ ] Set up real-time subscription for new bookings
```

### Task 4.9: Implement Gamification Database Sync

**File:** `stores/gamificationStore.ts`

```
- [ ] Line 200: Show level up notification
      - Create toast/modal component
      - Display new level and rewards

- [ ] Line 240: Check last check-in from database
      - Query user_stats table
      - Compare last_check_in_date with today
      - Update streak accordingly

- [ ] Line 275: Track unique cities
      - Query user_stats.cities_visited
      - Update array on new city check-in
      - Check city-based badge thresholds
```

### Task 4.10: Implement Customer Name in Payment

**File:** `hooks/usePayment.ts`

```
- [ ] Line 36: Get customer name from user profile
- [ ] Query users table for first_name, last_name
- [ ] Pass to Stripe PaymentIntent
```

---

## Phase 5: Polish & Notifications

**Goal:** Complete all remaining TODO items and add polish
**Dependencies:** Phase 4
**Estimated Tasks:** 12

### Task 5.1: Implement Email Notifications

**File:** `supabase/functions/send-email/index.ts` (new)

```
- [ ] Create reusable email Edge Function
- [ ] Integrate with email provider (Resend, SendGrid, or Postmark)
- [ ] Create email templates:
      - Partner application approved
      - Partner application rejected
      - Booking confirmation
      - Check-in confirmation
      - Support ticket reply
      - Refund processed
```

### Task 5.2: Implement Push Notifications

**File:** `supabase/functions/send-push/index.ts` (new)

```
- [ ] Create push notification Edge Function
- [ ] Integrate with Expo Push Notifications
- [ ] Implement notifications for:
      - Booking confirmation (line 131 payments-webhook)
      - Payment received (line 135 payments-webhook)
      - Refund processed (line 210 payments-webhook)
      - Support ticket update
```

### Task 5.3: Admin Notification System

**File:** `supabase/functions/notify-admin/index.ts` (new)

```
- [ ] Create admin notification Edge Function
- [ ] Implement for:
      - New gym verification request (line 182 tally-webhook)
      - New gym claim (line 211 tally-webhook)
      - New partner application
      - High-priority support ticket
- [ ] Store notifications in admin_notifications table
- [ ] Send email digest to admins
```

### Task 5.4: Implement Apple Wallet Integration

**File:** `app/booking/confirmation.tsx`

```
- [ ] Line 94: Implement Apple Wallet pass generation
- [ ] Create pass.json template
- [ ] Sign pass with Apple certificate
- [ ] Generate .pkpass file
- [ ] Trigger native "Add to Wallet" flow
```

### Task 5.5: Implement Error Tracking

**File:** `components/ErrorBoundary.tsx`

```
- [ ] Line 43: Integrate Sentry or similar
- [ ] Initialize Sentry in app entry
- [ ] Capture component errors
- [ ] Add user context
- [ ] Add breadcrumbs for navigation
```

### Task 5.6: Implement Analytics Service

**File:** `utils/performance.ts`

```
- [ ] Line 62: Send metrics to analytics service
- [ ] Choose provider (Mixpanel, Amplitude, or custom)
- [ ] Track performance metrics
- [ ] Track user events
- [ ] Add session recording (optional)
```

### Task 5.7: Implement Trip-Based Search Pre-fill

**File:** `app/(tabs)/trips.tsx`

```
- [ ] Line 198: Pre-fill search with trip location
- [ ] On trip card tap, navigate to search
- [ ] Pass destination coordinates
- [ ] Pass date range for availability
- [ ] Auto-execute search
```

### Task 5.8: Complete E2E Tests

**File:** `e2e/booking.e2e.js`

```
- [ ] Line 14: Implement gym search test
      - Navigate to search
      - Enter search query
      - Verify results appear
      - Tap on gym card

- [ ] Line 73: Implement payment error test
      - Attempt booking with invalid card
      - Verify error message appears
      - Verify booking not created
```

### Task 5.9: Environment Configuration

**File:** `.env`

```
- [ ] Line 9: Add Stripe publishable key
      - Create Stripe account if needed
      - Get publishable key from dashboard
      - Add to .env and .env.example

- [ ] Line 14: Add Expo project ID
      - Create Expo project in dashboard
      - Get project ID
      - Add to .env and app.json
```

### Task 5.10: Content Points System

**File:** `admin-portal/src/pages/ContentModeration.tsx`

```
- [ ] Line 98: Implement points awarding
- [ ] On content approval, call gamification API
- [ ] Award points based on content type:
      - Photo: 10 points
      - Review: 15 points
      - Verification: 5 points
- [ ] Check for badge thresholds
```

### Task 5.11: Support Ticket Email Notifications

**File:** `admin-portal/src/pages/SupportTickets.tsx`

```
- [ ] Line 121: Send email notification on reply
- [ ] Call send-email Edge Function
- [ ] Include ticket subject and reply preview
- [ ] Include link to view in app
```

### Task 5.12: Final Code Cleanup

```
- [ ] Remove all console.log statements in production
- [ ] Add proper TypeScript types to any 'any' usage
- [ ] Ensure all error boundaries are in place
- [ ] Verify all loading states are handled
- [ ] Verify all empty states are designed
- [ ] Run linter and fix all warnings
- [ ] Run type-check and fix all errors
```

---

## Appendix: Full Issue Registry

### Issues by File

| # | File | Line | Issue | Phase | Priority |
|---|------|------|-------|-------|----------|
| 1 | stores/searchStore.ts | 162 | Search API mock | 4 | Critical |
| 2 | components/voice/VoiceRecordingView.tsx | 115 | Voice transcription mock | 4 | Critical |
| 3 | supabase/functions/payments-create-intent/index.ts | 31-34 | Payment intent stub | 4 | Critical |
| 4 | supabase/functions/bookings-validate-qr/index.ts | 23 | QR validation stub | 4 | Critical |
| 5 | partner-portal/src/pages/Dashboard.tsx | 43 | Mock queries | 4 | Critical |
| 6 | partner-portal/src/stores/authStore.ts | - | File missing | 2 | Blocker |
| 7 | partner-portal/src/lib/supabase.ts | - | File missing | 2 | Blocker |
| 8 | partner-portal/src/components/Layout.tsx | - | File missing | 2 | Blocker |
| 9 | partner-portal/src/pages/Login.tsx | - | File missing | 2 | Blocker |
| 10 | partner-portal/src/pages/GymProfile.tsx | - | File missing | 2 | Blocker |
| 11 | partner-portal/src/pages/Bookings.tsx | - | File missing | 2 | Blocker |
| 12 | partner-portal/src/pages/Financials.tsx | - | File missing | 2 | Blocker |
| 13 | admin-portal/src/stores/authStore.ts | - | File missing | 3 | Blocker |
| 14 | admin-portal/src/lib/supabase.ts | - | File missing | 3 | Blocker |
| 15 | admin-portal/src/components/Layout.tsx | - | File missing | 3 | Blocker |
| 16 | admin-portal/src/pages/Login.tsx | - | File missing | 3 | Blocker |
| 17 | admin-portal/src/pages/Dashboard.tsx | - | File missing | 3 | Blocker |
| 18 | admin-portal/src/pages/Financials.tsx | - | File missing | 3 | Blocker |
| 19 | admin-portal/src/pages/Users.tsx | - | File missing | 3 | Blocker |
| 20 | admin-portal/src/pages/Analytics.tsx | - | File missing | 3 | Blocker |
| 21 | admin-portal/src/pages/PartnerApprovals.tsx | 77-78 | Partner account creation | 3 | High |
| 22 | admin-portal/src/pages/PartnerApprovals.tsx | 105 | Rejection email | 5 | Medium |
| 23 | admin-portal/src/pages/SupportTickets.tsx | 107 | Admin name hardcoded | 3 | High |
| 24 | admin-portal/src/pages/SupportTickets.tsx | 121 | Email notification | 5 | Medium |
| 25 | admin-portal/src/pages/ContentModeration.tsx | 98 | Points system | 5 | Medium |
| 26 | components/ugc/SubmitReview.tsx | 46 | Review submission | 4 | High |
| 27 | components/ugc/SubmitPhoto.tsx | 101 | Photo upload | 4 | High |
| 28 | components/trips/AddTripButton.tsx | 109 | Trip creation API | 4 | High |
| 29 | supabase/functions/tally-webhook/index.ts | 182 | Admin notification | 5 | Medium |
| 30 | supabase/functions/tally-webhook/index.ts | 211 | Admin notification | 5 | Medium |
| 31 | supabase/functions/payments-webhook/index.ts | 131 | Push notification | 5 | Medium |
| 32 | supabase/functions/payments-webhook/index.ts | 135 | Email confirmation | 5 | Medium |
| 33 | supabase/functions/payments-webhook/index.ts | 210 | Refund notification | 5 | Medium |
| 34 | stores/gamificationStore.ts | 200 | Level up notification | 4 | Medium |
| 35 | stores/gamificationStore.ts | 240 | Streak from database | 4 | Medium |
| 36 | stores/gamificationStore.ts | 275 | City tracking | 4 | Medium |
| 37 | app/(tabs)/passes.tsx | 75 | QR code modal | 4 | High |
| 38 | app/(tabs)/passes.tsx | 80 | Apple Wallet | 5 | Low |
| 39 | .env | 9 | Stripe key placeholder | 5 | Low |
| 40 | .env | 14 | Expo project ID | 5 | Low |
| 41 | utils/performance.ts | 62 | Analytics service | 5 | Low |
| 42 | components/ErrorBoundary.tsx | 43 | Error tracking | 5 | Low |
| 43 | hooks/usePayment.ts | 36 | Customer name | 4 | Low |
| 44 | app/booking/confirmation.tsx | 94 | Apple Wallet | 5 | Low |
| 45 | app/(tabs)/trips.tsx | 198 | Search pre-fill | 5 | Low |
| 46 | e2e/booking.e2e.js | 14 | Search test | 5 | Low |
| 47 | e2e/booking.e2e.js | 73 | Payment error test | 5 | Low |

### Missing Database Tables

| Table | Referenced By | Phase |
|-------|---------------|-------|
| partners | StripeOnboarding, stripe-connect-onboarding | 1 |
| partner_applications | PartnerApprovals, tally-webhook | 1 |
| support_tickets | SupportTickets | 1 |
| ticket_messages | SupportTickets | 1 |
| gym_reviews | ContentModeration | 1 |
| gym_verification_queue | ContentModeration | 1 |
| gym_claims | tally-webhook | 1 |
| verification_requests | tally-webhook | 1 |
| passes | payments-webhook | 1 |
| scraping_queue | firecrawl-scrape | 1 |
| user_stats | gamificationStore | 1 |
| user_achievements | gamificationStore | 1 |
| user_activity_log | gamificationStore | 1 |

---

## Implementation Checklist Summary

- [ ] **Phase 1:** 12 tasks (Database)
- [ ] **Phase 2:** 8 tasks (Partner Portal)
- [ ] **Phase 3:** 9 tasks (Admin Portal)
- [ ] **Phase 4:** 10 tasks (Core Features)
- [ ] **Phase 5:** 12 tasks (Polish)

**Total:** 51 tasks across 5 phases

---

*Document maintained as single source of truth for Scout App remediation effort.*
