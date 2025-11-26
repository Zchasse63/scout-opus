# Phase 7: Partner Portal

> Web application for gym owners to manage listings, bookings, payouts, and analytics

---

## Document Info

| Field | Value |
|-------|-------|
| **Phase** | 7 of 8 |
| **Timeline** | Weeks 16-18 |
| **Status** | ~90% Complete |
| **Created** | November 25, 2025 |
| **Last Updated** | November 26, 2025 |
| **Last Audit** | November 26, 2025 |
| **Version** | 1.1.0 |

---

## Current Completion Status

| Week | Focus Area | Status | Completion |
|------|------------|--------|------------|
| Week 16 | Project Setup & Auth | ✅ Complete | 100% |
| Week 16 | Dashboard Home | ✅ Complete | 100% |
| Week 17 | Gym Profile Management | ✅ Complete | 100% |
| Week 17 | Booking Management | ✅ Complete | 100% |
| Week 18 | Financial/Payouts | ✅ Complete | 100% |
| Week 18 | QR Scanner for Staff | ✅ Complete | 100% |

### Remaining Items

1. **Real data testing** - Verify all pages work with production data
2. **Stripe Connect integration** - Test payout flows
3. **Domain setup** - Deploy to partners.scoutfitness.com

---

## Phase Navigation

| Previous | Current | Next |
|----------|---------|------|
| [Phase 6: Data Pipeline](PHASE_6_DATA_PIPELINE.md) | **Phase 7: Partner Portal** | [Phase 8: Admin Portal](PHASE_8_ADMIN_PORTAL.md) |

**All Phases:**
- [Phase 1: Foundation](PHASE_1_FOUNDATION.md)
- [Phase 2: Core Features](PHASE_2_CORE_FEATURES.md)
- [Phase 3: Booking System](PHASE_3_BOOKING_SYSTEM.md)
- [Phase 4: Intelligence](PHASE_4_INTELLIGENCE.md)
- [Phase 5: Polish & Launch](PHASE_5_POLISH_LAUNCH.md)
- [Phase 6: Data Pipeline](PHASE_6_DATA_PIPELINE.md)
- **Phase 7: Partner Portal** (Current)
- [Phase 8: Admin Portal](PHASE_8_ADMIN_PORTAL.md)

---

## Overview

Phase 7 builds the **Partner Portal** - a dedicated web application at `partners.scoutfitness.com` where gym owners can manage their Scout presence. This is a separate React web application sharing the same Supabase backend as the mobile app.

### Goals

1. Partner authentication with Stripe Connect onboarding
2. Dashboard with today's bookings and revenue
3. Gym profile management (photos, amenities, hours, pricing)
4. Booking management (view, search, validate)
5. Financial dashboard with payout history
6. QR code scanner for check-ins
7. Basic waiver management

### User Roles

| Role | Access Level | Typical User |
|------|-------------|--------------|
| `gym_owner` | Full access to all features | Gym owner |
| `gym_manager` | Everything except payouts | General manager |
| `gym_staff` | QR scanner + view bookings only | Front desk staff |

### Prerequisites

- ✅ Supabase database with gym_owners, gyms, bookings tables
- ✅ Stripe Connect configured for marketplace
- ✅ User authentication working
- ✅ Booking system functional

---

## Week 16: Project Setup & Dashboard

### 16.1 Partner Portal Project Setup

Create separate web project:

- [ ] Create new Vite + React project
  ```bash
  npm create vite@latest partner-portal -- --template react-ts
  ```
- [ ] Install core dependencies:
  - [ ] `@supabase/supabase-js`
  - [ ] `@supabase/auth-ui-react`
  - [ ] `@tanstack/react-query`
  - [ ] `zustand`
  - [ ] `react-router-dom`
  - [ ] `@stripe/react-stripe-js`
  - [ ] `lucide-react`
  - [ ] `recharts` (for analytics charts)
  - [ ] `date-fns`
  - [ ] `@radix-ui/react-*` (for UI primitives)
  - [ ] `tailwindcss`
- [ ] Configure Tailwind CSS
- [ ] Set up project structure:
  ```
  partner-portal/
  ├── src/
  │   ├── components/
  │   │   ├── ui/           # Shared UI components
  │   │   ├── dashboard/    # Dashboard components
  │   │   ├── bookings/     # Booking components
  │   │   ├── profile/      # Profile management
  │   │   └── financial/    # Financial components
  │   ├── pages/
  │   │   ├── Login.tsx
  │   │   ├── Onboarding.tsx
  │   │   ├── Dashboard.tsx
  │   │   ├── Bookings.tsx
  │   │   ├── Profile.tsx
  │   │   ├── Financial.tsx
  │   │   └── Settings.tsx
  │   ├── hooks/
  │   ├── stores/
  │   ├── lib/
  │   └── utils/
  ```
- [ ] Configure environment variables
- [ ] Set up shared Supabase client

### 16.2 Partner Authentication

- [ ] Create login page with email/password
- [ ] Create registration flow with:
  - [ ] Basic info (name, email, gym name)
  - [ ] Email verification
  - [ ] Gym selection (claim existing or create new)
- [ ] Create password reset flow
- [ ] Implement protected routes
- [ ] Create `authStore` for partner auth state

### 16.3 Stripe Connect Onboarding

- [ ] Create onboarding flow component
- [ ] Integrate Stripe Connect Express
  ```typescript
  // Create Connect account
  const account = await stripe.accounts.create({
    type: 'express',
    country: 'US',
    email: partner.email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true }
    }
  });

  // Generate onboarding link
  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: 'https://partners.scoutfitness.com/onboarding/refresh',
    return_url: 'https://partners.scoutfitness.com/onboarding/complete',
    type: 'account_onboarding'
  });
  ```
- [ ] Handle onboarding completion callback
- [ ] Store `stripe_account_id` in database
- [ ] Check onboarding status on login

### 16.4 Dashboard Home

Create main dashboard page:

- [ ] Create `pages/Dashboard.tsx`
- [ ] Create `components/dashboard/StatsCards.tsx`
  ```
  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
  │ Today's     │ │ This Week   │ │ Revenue     │ │ Rating      │
  │ Bookings    │ │ Bookings    │ │ This Month  │ │             │
  │    12       │ │    47       │ │   $2,340    │ │   ⭐ 4.8    │
  │   +3 vs avg │ │  +12% ↑     │ │  +18% ↑     │ │  (124)      │
  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
  ```

- [ ] Create `components/dashboard/TodaySchedule.tsx`
  - Time-based list of today's bookings
  - Check-in status indicator
  - Click to expand details

- [ ] Create `components/dashboard/RecentActivity.tsx`
  - New bookings
  - Check-ins
  - New reviews
  - Cancellations

- [ ] Create `components/dashboard/QuickActions.tsx`
  - Scan QR button
  - View all bookings
  - Update hours
  - Contact support

### 16.5 Navigation & Layout

- [ ] Create responsive sidebar navigation
  ```
  ┌──────────────────┐
  │ Scout Partner    │
  │ [Gym Logo]       │
  │ Iron Temple      │
  ├──────────────────┤
  │ 📊 Dashboard     │
  │ 📅 Bookings      │
  │ 🏋️ Gym Profile   │
  │ 💰 Financials    │
  │ ⚙️ Settings      │
  ├──────────────────┤
  │ 📱 QR Scanner    │
  │ 💬 Support       │
  └──────────────────┘
  ```
- [ ] Create header with gym selector (for multi-gym owners)
- [ ] Create mobile-responsive layout
- [ ] Add breadcrumb navigation

### Week 16 Deliverable

✅ Partner portal with authentication, Stripe Connect onboarding, and dashboard home

---

## Week 17: Profile & Bookings

### 17.1 Gym Profile Management

Create profile editing interface:

- [ ] Create `pages/Profile.tsx`
- [ ] Create `components/profile/BasicInfoForm.tsx`
  - Gym name
  - Description
  - Phone
  - Website
  - Address
- [ ] Create `components/profile/HoursEditor.tsx`
  - Day-by-day hours
  - 24/7 toggle
  - Holiday hours
- [ ] Create `components/profile/AmenitiesEditor.tsx`
  - Checkbox grid for all amenities
  - Category sections (basics, premium, equipment, accessibility)
- [ ] Create `components/profile/PhotoManager.tsx`
  - Drag-and-drop upload
  - Reorder photos
  - Set primary photo
  - Delete photos
- [ ] Create `components/profile/PricingEditor.tsx`
  - Day pass price
  - Week pass price
  - Monthly membership
  - Special promotions (future)

### 17.2 Profile Preview

- [ ] Create live preview of how gym appears in app
- [ ] Mobile device frame mockup
- [ ] Show completeness score
  ```
  Profile Completeness: 85%
  Missing: Equipment brands, 2 more photos
  ```

### 17.3 Booking Management

Create booking list and management:

- [ ] Create `pages/Bookings.tsx`
- [ ] Create `components/bookings/BookingTable.tsx`
  - Sortable columns (date, name, pass type, status)
  - Status badges (Confirmed, Checked In, No Show, Cancelled)
  - Quick search
  - Date range filter
- [ ] Create `components/bookings/BookingDetail.tsx`
  - User info
  - Pass details
  - Check-in time
  - Waiver status
  - Contact user button
- [ ] Create `components/bookings/BookingFilters.tsx`
  - Date range picker
  - Status filter
  - Pass type filter
  - Search by name/email

### 17.4 Manual Check-in

- [ ] Create `components/bookings/ManualCheckin.tsx`
  - Search for booking by name or confirmation #
  - Display QR code for user reference
  - "Check In" button
  - Handle edge cases (already checked in, expired, cancelled)

### 17.5 Booking Analytics (Basic)

- [ ] Create `components/bookings/BookingChart.tsx`
  - Bookings over time (line chart)
  - Popular days/times (heatmap)
  - Pass type breakdown (pie chart)

### Week 17 Deliverable

✅ Complete gym profile management and booking management interface

---

## Week 18: Financial & Scanner

### 18.1 Financial Dashboard

- [ ] Create `pages/Financial.tsx`
- [ ] Create `components/financial/RevenueOverview.tsx`
  ```
  ┌─────────────────────────────────────────────────────────────┐
  │  REVENUE OVERVIEW                         [This Month ▼]   │
  ├─────────────────────────────────────────────────────────────┤
  │                                                             │
  │  Total Bookings Revenue    Platform Fee (15%)    Your Net  │
  │        $2,750                  $412.50           $2,337.50 │
  │                                                             │
  │  [Revenue chart showing daily breakdown]                    │
  │                                                             │
  └─────────────────────────────────────────────────────────────┘
  ```

- [ ] Create `components/financial/PayoutHistory.tsx`
  - Table of past payouts
  - Payout status (pending, paid, failed)
  - Download statement
  - Payout details modal

- [ ] Create `components/financial/TransactionList.tsx`
  - All transactions
  - Filter by type (booking, refund, payout)
  - Export to CSV

### 18.2 Payout Settings

- [ ] Create `components/financial/PayoutSettings.tsx`
  - Current payout schedule (daily, weekly, monthly)
  - Bank account details (masked)
  - Update bank account (redirects to Stripe)
  - Tax information status

### 18.3 Stripe Dashboard Link

- [ ] Create Express Dashboard login link
  ```typescript
  const loginLink = await stripe.accounts.createLoginLink(
    stripeAccountId
  );
  ```
- [ ] Button to access full Stripe Express dashboard

### 18.4 QR Code Scanner

Create dedicated QR scanning interface:

- [ ] Create `pages/Scanner.tsx`
- [ ] Create `components/scanner/QRScanner.tsx`
  - Camera access request
  - QR code detection
  - Success/error feedback
  - Manual code entry fallback
- [ ] Create `components/scanner/ScanResult.tsx`
  - Display user photo and name
  - Pass details
  - Valid/Invalid status
  - Check-in confirmation
- [ ] Handle scan states:
  - ✅ Valid - Show green success
  - ❌ Invalid code - Show error
  - ⚠️ Already used - Show warning with timestamp
  - ❌ Expired - Show expiration info
  - ❌ Wrong gym - Show correct gym name

### 18.5 Waiver Management (Basic)

- [ ] Create `components/waivers/WaiverList.tsx`
  - View signed waivers
  - Search by user
  - Download waiver PDF
- [ ] Create waiver template editor (future)

### 18.6 Settings Page

- [ ] Create `pages/Settings.tsx`
- [ ] Create `components/settings/NotificationSettings.tsx`
  - Email notifications toggle
  - New booking alerts
  - Daily summary
  - Review alerts
- [ ] Create `components/settings/TeamManagement.tsx` (Basic)
  - Invite staff members
  - Set roles (owner, manager, staff)
  - Revoke access
- [ ] Create `components/settings/AccountSettings.tsx`
  - Update email
  - Change password
  - Two-factor authentication

### Week 18 Deliverable

✅ Complete financial dashboard, QR scanner, and settings

---

## Technical Specifications

### Technology Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| Framework | React 18 + Vite | Fast builds, modern tooling |
| Routing | React Router v6 | File-based not needed for web |
| State | Zustand + TanStack Query | Same as mobile |
| Styling | Tailwind CSS | Rapid development |
| UI Components | Radix UI | Accessible primitives |
| Charts | Recharts | React-based charting |
| Forms | React Hook Form + Zod | Validation |
| QR Scanner | @yudiel/react-qr-scanner | Camera access |

### Deployment

- [ ] Configure Vercel deployment
- [ ] Set up custom domain: `partners.scoutfitness.com`
- [ ] Configure environment variables
- [ ] Set up preview deployments for PRs

### Security

- [ ] Implement row-level security for partner data
- [ ] Ensure partners can only see their own gyms
- [ ] Audit trail for profile changes
- [ ] Rate limiting on API calls
- [ ] CSRF protection

---

## API Endpoints (Edge Functions)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/partner/dashboard-stats` | GET | Dashboard metrics |
| `/partner/bookings` | GET | List bookings with filters |
| `/partner/bookings/:id/checkin` | POST | Manual check-in |
| `/partner/profile` | GET/PUT | Gym profile management |
| `/partner/photos` | POST/DELETE | Photo management |
| `/partner/financial/summary` | GET | Financial overview |
| `/partner/financial/transactions` | GET | Transaction list |
| `/partner/financial/payouts` | GET | Payout history |
| `/partner/team` | GET/POST/DELETE | Team management |

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Partner portal adoption | 80% of partners | Login rate |
| Profile completeness | 90% avg | Completeness score |
| Time to first payout | < 7 days | Onboarding analytics |
| QR scanner usage | 70% of check-ins | Scanner vs manual |
| Daily active partners | 50%+ | Login frequency |

---

## Change Log

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| November 25, 2025 | 1.0.0 | Initial document created | Claude |

---

*This phase should only begin after MVP launch and initial partner recruitment.*
