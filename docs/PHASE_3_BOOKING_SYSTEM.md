# Phase 3: Booking System

> Stripe Connect payments, QR code passes, booking flow, and gym owner onboarding

---

## Document Info

| Field | Value |
|-------|-------|
| **Phase** | 3 of 8 |
| **Timeline** | Weeks 8-9 |
| **Status** | In Progress (25% Complete) |
| **Created** | November 25, 2025 |
| **Last Updated** | November 25, 2025 |
| **Last Audit** | November 25, 2025 |
| **Version** | 1.1.0 |

---

## Current Completion Status

| Week | Focus Area | Status | Completion |
|------|------------|--------|------------|
| Week 8 | Stripe Setup | ⚠️ Partial | 40% |
| Week 8 | Checkout UI | ❌ Not Started | 0% |
| Week 9 | QR Code & Passes | ⚠️ Partial | 30% |
| Week 9 | Waiver System | ❌ Not Started | 0% |

### Critical Remaining Items

1. **CheckoutForm.tsx** - Complete checkout UI (BLOCKING)
2. **PassTypeSelector.tsx** - Day/week/month selection (BLOCKING)
3. **DatePicker.tsx** - Booking date selection (BLOCKING)
4. **PriceBreakdown.tsx** - Transparent pricing display (BLOCKING)
5. **QRPass.tsx** - Pass display with QR code (BLOCKING)
6. **PassCard.tsx** - Pass card for Passes tab (BLOCKING)
7. **WaiverModal.tsx** - Legal waiver system (BLOCKING)
8. **payments-webhook/** Edge Function - Stripe webhooks
9. **connect-account/** Edge Function - Gym owner onboarding

### What's Working

- ✅ `@stripe/stripe-react-native` installed
- ✅ `StripeProvider.tsx` component created
- ✅ `payments-create-intent/` Edge Function created
- ✅ `bookings-validate-qr/` Edge Function created
- ✅ `usePayment` hook created
- ✅ `useBookings` hook created
- ✅ `bookingStore.ts` created
- ✅ `react-native-qrcode-svg` installed
- ✅ Booking routes exist (booking/[id], payment, confirmation)

---

## Phase Navigation

| Previous | Current | Next |
|----------|---------|------|
| [Phase 2: Core Features](PHASE_2_CORE_FEATURES.md) | **Phase 3: Booking System** | [Phase 4: Intelligence](PHASE_4_INTELLIGENCE.md) |

**All Phases:**
- [Phase 1: Foundation](PHASE_1_FOUNDATION.md)
- [Phase 2: Core Features](PHASE_2_CORE_FEATURES.md)
- **Phase 3: Booking System** (Current)
- [Phase 4: Intelligence](PHASE_4_INTELLIGENCE.md)
- [Phase 5: Polish & Launch](PHASE_5_POLISH_LAUNCH.md)
- [Phase 6: Data Pipeline](PHASE_6_DATA_PIPELINE.md)
- [Phase 7: Partner Portal](PHASE_7_PARTNER_PORTAL.md)
- [Phase 8: Admin Portal](PHASE_8_ADMIN_PORTAL.md)

---

## Overview

Phase 3 implements the complete booking and payment infrastructure. This includes Stripe Connect for marketplace payments (15% platform commission), QR code generation and validation, waiver signing, and the Passes tab functionality. This phase also includes basic gym owner onboarding to receive payments.

### Goals

1. Stripe Connect marketplace integration
2. Seamless checkout flow with transparent pricing
3. QR code digital passes with Apple/Google Wallet
4. Waiver signing system
5. Passes tab with active/upcoming/past bookings
6. Basic gym owner Stripe onboarding
7. QR code validation for gym staff

### Prerequisites (from Phase 2)

- ✅ Gym discovery and search working
- ✅ GymDetailModal with booking CTA
- ✅ User authentication functional
- ✅ Supabase database with `bookings` table

### Revenue Model

| Party | Percentage | Example ($25 pass) |
|-------|------------|-------------------|
| Gym | 85% | $21.25 |
| Scout (Platform) | 15% | $3.75 |
| Stripe Fees | 2.9% + $0.30 | ~$1.03 (from Scout's cut) |

---

## Week 8: Stripe Integration

### 8.1 Stripe Account Setup

- [ ] Create Stripe account (if not existing)
- [ ] Enable Stripe Connect (Express accounts)
- [ ] Configure Connect settings:
  - [ ] Set platform fee (15%)
  - [ ] Configure payout schedule (2-day rolling)
  - [ ] Set up branding for Connect onboarding
- [ ] Generate API keys:
  - [ ] Test mode keys for development
  - [ ] Live mode keys (store securely)
- [ ] Configure webhook endpoints
- [ ] Store keys in Supabase Edge Function secrets

### 8.2 Payment Intent Edge Function

- [ ] Create `supabase/functions/payments-create-intent/index.ts`
- [ ] Calculate amounts:
  ```typescript
  const calculatePayment = (dayPassPrice: number) => {
    const totalAmount = dayPassPrice * 100; // cents
    const platformFee = Math.round(totalAmount * 0.15);
    const gymPayout = totalAmount - platformFee;

    return {
      amount: totalAmount,
      application_fee_amount: platformFee,
      transfer_data: {
        destination: gymStripeAccountId,
      },
    };
  };
  ```
- [ ] Create PaymentIntent with Stripe SDK
- [ ] Return client secret to mobile app
- [ ] Handle errors (gym not connected, invalid amount)

### 8.3 Stripe React Native Integration

- [ ] Install `@stripe/stripe-react-native`
- [ ] Configure Stripe provider in app root
- [ ] Create `lib/stripe.ts` client utilities
- [ ] Implement `useStripePayment` hook:
  ```typescript
  interface UseStripePayment {
    initPayment: (gymId: string, passType: string) => Promise<void>;
    confirmPayment: () => Promise<PaymentResult>;
    isLoading: boolean;
    error: string | null;
  }
  ```

### 8.4 Checkout Flow UI

- [ ] Create `app/booking/[gymId].tsx` screen
- [ ] Design checkout screen:
  - [ ] Gym info summary (photo, name, location)
  - [ ] Pass type selection (Day/Week/Month)
  - [ ] Date picker for booking date
  - [ ] Price breakdown:
    ```
    Day Pass           $25.00
    Service Fee         $0.00
    ─────────────────────────
    Total              $25.00
    ```
  - [ ] Payment method (Apple Pay, Google Pay, Card)
  - [ ] Terms acceptance checkbox
- [ ] Implement payment sheet presentation
- [ ] Handle payment success/failure states

### 8.5 Stripe Webhook Handler

- [ ] Create `supabase/functions/payments-webhook/index.ts`
- [ ] Verify webhook signature
- [ ] Handle events:
  - [ ] `payment_intent.succeeded` → Create booking record
  - [ ] `payment_intent.payment_failed` → Update status, notify user
  - [ ] `charge.refunded` → Update booking status
- [ ] Generate QR code on successful payment
- [ ] Send confirmation push notification

### 8.6 Booking Record Creation

- [ ] Insert booking into database on payment success:
  ```typescript
  const booking = {
    user_id: userId,
    gym_id: gymId,
    booking_date: selectedDate,
    pass_type: 'day',
    status: 'confirmed',
    stripe_payment_intent_id: paymentIntentId,
    amount_paid: totalAmount / 100,
    platform_fee: platformFee / 100,
    gym_payout: gymPayout / 100,
  };
  ```
- [ ] Trigger QR code generation
- [ ] Send confirmation email (via Supabase Edge Function)

### 8.7 Gym Owner Stripe Onboarding

- [ ] Create `supabase/functions/connect-account/index.ts`
- [ ] Generate Stripe Connect onboarding link:
  ```typescript
  const accountLink = await stripe.accountLinks.create({
    account: stripeAccountId,
    refresh_url: `${APP_URL}/owner/stripe-refresh`,
    return_url: `${APP_URL}/owner/stripe-complete`,
    type: 'account_onboarding',
  });
  ```
- [ ] Create basic gym owner dashboard page (web):
  - [ ] Stripe connection status
  - [ ] Connect/reconnect button
  - [ ] Payout history (basic)
- [ ] Update `gym_owners.stripe_onboarding_complete` on success

### 8.8 Payment Testing

- [ ] Test with Stripe test cards:
  - [ ] `4242424242424242` - Success
  - [ ] `4000000000000002` - Decline
  - [ ] `4000000000009995` - Insufficient funds
- [ ] Test Apple Pay (sandbox)
- [ ] ~~Test Google Pay (sandbox)~~ *(Deferred to Post-Launch)*
- [ ] Verify webhook events in Stripe Dashboard
- [ ] Confirm booking records created correctly

### Week 8 Deliverable

✅ Test payments working end-to-end with booking records created

---

## Week 9: QR Codes & Booking Management

### 9.1 QR Code Generation

- [ ] Create QR code generation function:
  ```typescript
  const generateQRPayload = (booking: Booking) => {
    const payload = {
      bookingId: booking.id,
      oderId: booking.user_id,
      gymId: booking.gym_id,
      date: booking.booking_date,
      timestamp: Date.now(),
    };

    // HMAC signature for tamper protection
    const signature = crypto
      .createHmac('sha256', QR_SECRET)
      .update(JSON.stringify(payload))
      .digest('hex');

    return JSON.stringify({ ...payload, sig: signature });
  };
  ```
- [ ] Generate QR code image using `react-native-qrcode-svg`
- [ ] Store QR payload in `bookings.qr_code` column
- [ ] Generate immediately after payment confirmation

### 9.2 QRPass Component

- [ ] Create `components/passes/QRPass.tsx`
- [ ] Display QR code prominently (large, centered)
- [ ] Show booking details:
  - [ ] Gym name
  - [ ] Pass type (Day Pass)
  - [ ] Valid date
  - [ ] Valid hours (gym opening hours)
- [ ] Pull-to-refresh to regenerate QR
- [ ] Offline-capable (cached QR image)

### 9.3 Apple Wallet Integration

- [ ] Install `react-native-wallet-manager` or similar
- [ ] Create PKPass template:
  ```json
  {
    "formatVersion": 1,
    "passTypeIdentifier": "pass.com.scoutfitness.daypass",
    "teamIdentifier": "YOUR_TEAM_ID",
    "organizationName": "Scout Fitness",
    "description": "Gym Day Pass",
    "logoText": "Scout",
    "foregroundColor": "rgb(255, 255, 255)",
    "backgroundColor": "rgb(255, 90, 31)"
  }
  ```
- [ ] Generate .pkpass file server-side
- [ ] Implement "Add to Apple Wallet" button
- [ ] Handle pass updates (if needed)

### 9.4 Google Wallet Integration *(Deferred to Post-Launch)*

> **Note:** Google Wallet integration is deferred until Android development begins post-launch.

- [ ] ~~Set up Google Wallet API credentials~~
- [ ] ~~Create Generic Pass class~~
- [ ] ~~Generate pass JWT server-side~~
- [ ] ~~Implement "Add to Google Wallet" button~~
- [ ] ~~Test on Android device~~

### 9.5 QR Validation Endpoint

- [ ] Create `supabase/functions/bookings-validate-qr/index.ts`
- [ ] Verify HMAC signature
- [ ] Check booking status:
  - [ ] Not used
  - [ ] Correct gym
  - [ ] Valid date (today)
  - [ ] Not expired
- [ ] Mark booking as `used` on successful scan:
  ```typescript
  await supabase
    .from('bookings')
    .update({
      status: 'used',
      qr_scanned_at: new Date().toISOString(),
      qr_scanned_by: staffId,
    })
    .eq('id', bookingId);
  ```
- [ ] Return user info for gym staff display
- [ ] Handle errors (already used, wrong gym, expired)

### 9.6 Gym Staff QR Scanner (Basic)

- [ ] Create basic web page for gym staff
- [ ] Implement camera-based QR scanner
- [ ] Call validation endpoint on scan
- [ ] Display success/error with user info:
  ```
  ✓ VALID PASS

  John Smith
  Day Pass - Nov 28, 2025

  [Scan Next]
  ```
- [ ] Sound/haptic feedback on scan result

### 9.7 Passes Tab UI

- [ ] Create `app/(tabs)/passes.tsx` full implementation
- [ ] Sections:
  - [ ] **Active Passes** - Valid for today
  - [ ] **Upcoming** - Future bookings
  - [ ] **Past Visits** - Completed bookings
- [ ] PassCard component for list items:
  - [ ] Gym photo thumbnail
  - [ ] Gym name
  - [ ] Date
  - [ ] Status badge (Active, Upcoming, Used)
- [ ] Tap to expand to full QRPass view
- [ ] Empty states for each section

### 9.8 Waiver System

- [ ] Create waiver content (legal review needed):
  ```
  SCOUT FITNESS LIABILITY WAIVER

  By proceeding with this booking, I acknowledge and agree:
  1. I am physically fit to exercise...
  2. I assume all risks associated...
  3. I release Scout and the gym from liability...
  [Full legal text]
  ```
- [ ] Create `components/booking/WaiverModal.tsx`
- [ ] Show waiver on first booking (per gym or global)
- [ ] Require signature (drawn signature or checkbox + name)
- [ ] Store waiver acceptance:
  ```typescript
  {
    waiver_signed: true,
    waiver_signed_at: timestamp,
    waiver_ip_address: ip,
    waiver_version: '1.0',
  }
  ```
- [ ] Skip waiver if already signed for this gym

### 9.9 Booking Cancellation

- [ ] Implement cancellation logic:
  - [ ] Free cancellation: >24 hours before booking date
  - [ ] No refund: <24 hours before booking date
- [ ] Create cancellation endpoint
- [ ] Process Stripe refund (if eligible)
- [ ] Update booking status to `cancelled`
- [ ] Show cancel button on upcoming bookings
- [ ] Confirmation dialog before cancelling

### 9.10 Booking Confirmation Flow

- [ ] After successful payment:
  1. Show success animation (confetti?)
  2. Display QR code immediately
  3. Offer "Add to Wallet" buttons
  4. Show "View Pass" and "Done" options
- [ ] Send confirmation push notification
- [ ] Send confirmation email with:
  - [ ] QR code image
  - [ ] Gym address
  - [ ] Gym hours
  - [ ] Cancellation policy

### Week 9 Deliverable

✅ Complete booking loop: search → book → pay → QR pass → validate

---

## Technical Specifications

### New Components (Phase 3)

```
components/
├── booking/
│   ├── BookingCTA.tsx            # Primary booking button
│   ├── CheckoutForm.tsx          # Checkout screen content
│   ├── PassTypeSelector.tsx      # Day/Week/Month selection
│   ├── DatePicker.tsx            # Booking date selection
│   ├── PriceBreakdown.tsx        # Price summary
│   └── WaiverModal.tsx           # Liability waiver
└── passes/
    ├── QRPass.tsx                # Full QR code display
    ├── PassCard.tsx              # Compact pass in list
    └── WalletButton.tsx          # Add to Apple/Google Wallet
```

### New Edge Functions

```
supabase/functions/
├── payments-create-intent/       # Create Stripe PaymentIntent
├── payments-webhook/             # Handle Stripe webhooks
├── connect-account/              # Gym owner Stripe onboarding
└── bookings-validate-qr/         # Validate QR code at gym
```

### New Stores

```
stores/
└── bookingStore.ts               # Active booking flow state
```

### New Hooks

```
hooks/
├── useStripePayment.ts           # Stripe payment flow
├── useBooking.ts                 # Booking creation/management
└── useWallet.ts                  # Apple/Google Wallet integration
```

---

## Acceptance Criteria

### Must Have (P0)
- [ ] Checkout completes in under 10 seconds
- [ ] QR code displays immediately after payment
- [ ] QR code validates correctly at gym
- [ ] Passes tab shows all user bookings
- [ ] Cancellation with refund works (>24hr)
- [ ] Gym receives correct payout amount (85%)

### Should Have (P1)
- [ ] Apple Wallet integration works
- [ ] ~~Google Wallet integration works~~ *(Deferred to Post-Launch)*
- [ ] Waiver is legally reviewed and signed
- [ ] Confirmation email sends successfully
- [ ] Gym staff scanner is functional

### Nice to Have (P2)
- [ ] Animated success state after payment
- [ ] Booking reminder notifications
- [ ] Receipt download/email

---

## Security Considerations

### Payment Security
- [ ] Never store full card numbers
- [ ] Use Stripe.js/SDK for all card handling
- [ ] Verify webhook signatures
- [ ] Use idempotency keys for payment retries

### QR Code Security
- [ ] HMAC signature prevents tampering
- [ ] Single-use enforcement (mark as used immediately)
- [ ] Timestamp prevents replay attacks
- [ ] Gym ID prevents cross-gym usage

### Data Protection
- [ ] Encrypt sensitive booking data
- [ ] Limit PII in QR payload
- [ ] Audit log for payment events

---

## Stripe Fee Analysis

For a $25 day pass:

| Item | Calculation | Amount |
|------|-------------|--------|
| Gross | — | $25.00 |
| Stripe Fee | 2.9% + $0.30 | $1.03 |
| Net to Platform | 15% of $25 | $3.75 |
| Scout Net | $3.75 - $1.03 | **$2.72** |
| Gym Payout | 85% of $25 | **$21.25** |

*Note: Stripe fees are typically absorbed by the platform (Scout), not passed to customer or gym.*

---

## Completion Summary

> *To be filled in upon phase completion*

### Completion Date
*Not yet completed*

### Final Status
*Pending*

### Deliverables Completed
- [ ] Stripe Connect integration
- [ ] Checkout flow
- [ ] QR code generation
- [ ] QR validation endpoint
- [ ] Passes tab
- [ ] Wallet integration
- [ ] Waiver system

### Metrics
| Metric | Target | Actual |
|--------|--------|--------|
| Checkout completion rate | >90% | — |
| QR scan validation time | <500ms | — |
| Payment failure rate | <2% | — |

---

## Carryover Items

> *Items deferred from this phase*

| Item | Moved To | Reason |
|------|----------|--------|
| Google Wallet integration | Post-Launch | iOS-first approach |
| Google Pay testing | Post-Launch | iOS-first approach |

---

## Change Log

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| November 25, 2025 | 1.0.0 | Initial phase document created | — |

---

*Reference: [Complete Technical Blueprint](../Scout_Fitness_App_Complete_Technical_Blueprint_November_2025-2.md) - Sections 7, 8 (F4, F5, F6)*
