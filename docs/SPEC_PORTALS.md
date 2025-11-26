# Scout Partner & Admin Portals Specification
## Supplement to Main Technical Blueprint

**Version:** 1.0  
**Date:** November 25, 2025  
**Status:** Draft for Review

---

## Table of Contents

1. [Gym Owner Portal (Partner Dashboard)](#1-gym-owner-portal-partner-dashboard)
2. [Scout Admin Portal (Application Owner)](#2-scout-admin-portal-application-owner)
3. [SSO & Authentication Architecture](#3-sso--authentication-architecture)
4. [Partner API (B2B Integration)](#4-partner-api-b2b-integration)
5. [Analytics Architecture](#5-analytics-architecture)
6. [Implementation Recommendations](#6-implementation-recommendations)

---

## 1. Gym Owner Portal (Partner Dashboard)

### Overview

The **Gym Owner Portal** is a web-based dashboard for partner gyms to manage their Scout presence. Not all gyms will use this — only verified partners who want enhanced control, analytics, and marketing capabilities.

**Platform:** Web application (React + Vite or Next.js)  
**URL:** `partners.scoutfitness.com` or `app.scoutfitness.com/partners`  
**Target Users:** Gym owners, managers, and staff at partner facilities

### Gym Tiers

| Tier | Description | Portal Access | Features |
|------|-------------|---------------|----------|
| **Listed** | Data from Google Places API only | ❌ None | Basic listing, Google reviews |
| **Claimed** | Owner verified but not booking-enabled | ✅ Basic | Update info, photos, respond to reviews |
| **Partner** | Full Scout integration + booking | ✅ Full | All features including bookings, analytics, marketing |
| **Premium Partner** | Featured placement + priority support | ✅ Full + Premium | All features + dedicated support, featured listings |

### Portal Modules

#### 1.1 Dashboard Home

```
┌─────────────────────────────────────────────────────────────────┐
│  SCOUT PARTNER PORTAL                     [Iron Temple Fitness] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📊 TODAY'S SNAPSHOT                                            │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │ Bookings     │ │ Revenue      │ │ Check-ins    │            │
│  │     12       │ │   $340       │ │    8/12      │            │
│  │ +3 vs avg    │ │ +15% vs avg  │ │ 67% rate     │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
│                                                                 │
│  📈 THIS MONTH                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [Revenue chart - line graph]                            │   │
│  │  $8,450 total  •  287 bookings  •  $29.44 avg            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ⏰ UPCOMING CHECK-INS                                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 10:00 AM  John Smith      Day Pass    [View] [Check In] │   │
│  │ 11:30 AM  Sarah Johnson   Day Pass    [View] [Check In] │   │
│  │ 2:00 PM   Mike Davis      Week Pass   [View] [Check In] │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  📣 QUICK ACTIONS                                               │
│  [+ Create Campaign]  [📤 Export Report]  [⚙️ Settings]        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Key Metrics Displayed:**
- Today's bookings vs. average
- Revenue (today, week, month, YTD)
- Check-in rate (showed up / booked)
- Upcoming check-ins with quick actions
- Review summary and recent reviews
- Payout status and next payout date

#### 1.2 Gym Profile Management

**Editable Fields:**
- Business name and description
- Address and location (map pin adjustment)
- Hours of operation (including holiday hours)
- Contact information (phone, email, website)
- Social media links
- Day pass pricing (with Scout's 15% commission clearly shown)
- Week/month pass pricing (if offered)

**Photo Management:**
- Upload up to 20 photos
- Set primary/hero image
- Categorize photos (exterior, equipment, amenities, classes)
- Drag-and-drop reordering
- Auto-compression and CDN delivery via Supabase Storage

**Amenity Management:**
- Toggle amenities on/off from master list
- Add custom amenities not in standard list
- Mark amenities as "verified" vs "self-reported"

#### 1.3 Waiver Management

```
┌─────────────────────────────────────────────────────────────────┐
│  WAIVER MANAGEMENT                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ACTIVE WAIVER                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 📄 Iron Temple Liability Waiver v2.1                    │   │
│  │    Uploaded: Nov 15, 2025                               │   │
│  │    Signed by: 234 users                                 │   │
│  │                                                         │   │
│  │    [Preview]  [Download]  [Replace]                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  WAIVER HISTORY                                                 │
│  • v2.0 - Oct 1, 2025 (archived, 189 signatures)               │
│  • v1.0 - Aug 15, 2025 (archived, 45 signatures)               │
│                                                                 │
│  ⚠️ When you upload a new waiver, all users will be required   │
│     to sign again before their next visit.                     │
│                                                                 │
│  [+ Upload New Waiver]                                          │
│                                                                 │
│  SIGNED WAIVERS                                    [Export CSV] │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ User           │ Signed      │ Version │ Download        │  │
│  │ John Smith     │ Nov 20, 2025│ v2.1    │ [PDF]          │  │
│  │ Sarah Johnson  │ Nov 18, 2025│ v2.1    │ [PDF]          │  │
│  │ ...            │             │         │                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Waiver Features:**
- Upload PDF or create from template
- Version control with automatic archiving
- Force re-signing when waiver changes
- Download signed waivers (individual or bulk)
- Legal timestamp and IP address logging
- Integration with booking flow (user must sign before first visit)

#### 1.4 Analytics Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  ANALYTICS                              [Last 30 Days ▼]        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  REVENUE                                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  $12,450                                                 │   │
│  │  ▲ 23% vs previous period                               │   │
│  │                                                          │   │
│  │  [═══════════════════════════════════════════════════]  │   │
│  │  [    Line chart showing daily revenue over time     ]  │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  KEY METRICS                                                    │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────┐ │
│  │ Bookings    │ │ Check-in %  │ │ Avg Revenue │ │ New Users │ │
│  │    423      │ │    78%      │ │   $29.44    │ │    156    │ │
│  │ ▲ 15%       │ │ ▲ 5%        │ │ ▲ 3%        │ │ ▲ 22%     │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └───────────┘ │
│                                                                 │
│  BOOKING BREAKDOWN                                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Day Pass      ████████████████████████  380 (90%)       │  │
│  │  Week Pass     ████                       35 (8%)        │  │
│  │  Month Pass    █                           8 (2%)        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  PEAK HOURS                                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  6-7 AM   ████████████████  42 bookings                  │  │
│  │  7-8 AM   ████████████████████████  67 bookings          │  │
│  │  5-6 PM   ██████████████████████████████  89 bookings    │  │
│  │  6-7 PM   ████████████████████████  65 bookings          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  USER DEMOGRAPHICS                                              │
│  • 65% Business Travelers  •  25% Locals  •  10% Tourists      │
│  • Avg age: 34  •  68% returning users                         │
│                                                                 │
│  [📤 Export Report]  [📊 Advanced Analytics]                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Analytics Capabilities:**

| Metric Category | Metrics Included |
|-----------------|------------------|
| **Revenue** | Gross revenue, net revenue (after commission), revenue by pass type, revenue by day/week/month, YoY comparison |
| **Bookings** | Total bookings, bookings by type, cancellation rate, no-show rate, booking lead time |
| **Users** | New vs returning, user demographics, geographic origin, average visits per user |
| **Performance** | Check-in rate, peak hours, busiest days, capacity utilization |
| **Reviews** | Average rating, rating trend, sentiment analysis, review response rate |
| **Marketing** | Campaign performance, conversion rates, ROI by campaign |

**Time Periods:**
- Today, Yesterday
- Last 7 days, Last 30 days, Last 90 days
- This month, Last month
- This quarter, Last quarter
- This year, Last year
- Custom date range

#### 1.5 Marketing Campaigns

```
┌─────────────────────────────────────────────────────────────────┐
│  MARKETING CAMPAIGNS                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [+ New Campaign]                                               │
│                                                                 │
│  ACTIVE CAMPAIGNS                                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 🎉 Holiday Special - 20% Off                             │  │
│  │    Status: Active  •  Sent: 1,245  •  Opened: 42%        │  │
│  │    Bookings: 89  •  Revenue: $2,136                      │  │
│  │    [Pause]  [Edit]  [View Report]                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 📧 Win-Back: Haven't visited in 30 days                  │  │
│  │    Status: Active (automated)  •  Sent: 234 this month   │  │
│  │    Bookings: 45  •  Revenue: $1,125                      │  │
│  │    [Pause]  [Edit]  [View Report]                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  CAMPAIGN TEMPLATES                                             │
│  • Welcome Series (3 emails over 7 days)                       │
│  • Win-Back (users inactive 30+ days)                          │
│  • Birthday Special (auto-send on user birthday)               │
│  • Review Request (24 hours after visit)                       │
│  • Referral Program ("Invite a friend, get $10")               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Campaign Types:**

| Type | Channel | Trigger | Example |
|------|---------|---------|---------|
| **One-Time Blast** | Email, SMS | Manual | "Holiday Sale - 20% off this weekend" |
| **Automated Drip** | Email | Event-based | Welcome series after first booking |
| **Win-Back** | Email, SMS | Inactivity | "We miss you! Here's 15% off" |
| **Transactional** | Email, SMS | Booking events | Confirmation, reminder, receipt |
| **Review Request** | Email | Post-visit | "How was your workout?" |

**Campaign Builder Features:**
- Drag-and-drop email builder
- SMS character counter (160 char limit)
- Audience segmentation (all users, first-timers, regulars, lapsed)
- A/B testing for subject lines
- Send time optimization
- Promo code generation and tracking

**Compliance:**
- CAN-SPAM compliant unsubscribe links
- SMS opt-in/opt-out management
- GDPR consent tracking
- Rate limiting to prevent spam

**Integration:**
- Built on **SendGrid** for email ($15-50/month for this volume)
- Built on **Twilio** for SMS (~$0.0075/message)
- Scout handles delivery; gym provides content

#### 1.6 Booking Management

```
┌─────────────────────────────────────────────────────────────────┐
│  BOOKINGS                               [Filter ▼] [Search 🔍]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  TODAY'S BOOKINGS (12)                                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Status │ Time   │ User          │ Type    │ Actions      │  │
│  ├────────┼────────┼───────────────┼─────────┼──────────────┤  │
│  │ ✅     │ 6:00 AM│ John Smith    │ Day Pass│ [Details]    │  │
│  │ ✅     │ 7:30 AM│ Sarah Johnson │ Day Pass│ [Details]    │  │
│  │ ⏳     │ 10:00AM│ Mike Davis    │ Day Pass│ [Check In]   │  │
│  │ ⏳     │ 11:30AM│ Lisa Wong     │ Week    │ [Check In]   │  │
│  │ ❌     │ 8:00 AM│ Tom Brown     │ Day Pass│ No-show      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  BOOKING DETAIL (John Smith)                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 📅 Date: Nov 25, 2025                                    │  │
│  │ ⏰ Check-in: 6:00 AM  •  Check-out: 7:45 AM              │  │
│  │ 🎫 Type: Day Pass ($25)                                  │  │
│  │ 💰 Your payout: $21.25 (after 15% commission)            │  │
│  │ 📄 Waiver: Signed Nov 20, 2025                           │  │
│  │ 📧 john.smith@email.com  •  📱 (555) 123-4567            │  │
│  │                                                          │  │
│  │ VISIT HISTORY                                            │  │
│  │ • Nov 25, 2025 (today)                                   │  │
│  │ • Nov 18, 2025                                           │  │
│  │ • Nov 10, 2025                                           │  │
│  │                                                          │  │
│  │ [Contact User]  [Issue Refund]  [Block User]             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Booking Management Features:**
- View all bookings (past, present, future)
- Filter by status (confirmed, checked-in, no-show, cancelled)
- Manual check-in capability
- Issue refunds (partial or full)
- Contact user via in-app messaging
- Block problematic users
- Export booking history

#### 1.7 Financial & Payouts

```
┌─────────────────────────────────────────────────────────────────┐
│  FINANCIALS                                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ACCOUNT BALANCE                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │  Available for Payout:  $2,456.75                        │  │
│  │  Pending (in transit):  $890.00                          │  │
│  │                                                          │  │
│  │  Next automatic payout: Nov 27, 2025                     │  │
│  │                                                          │  │
│  │  [Request Instant Payout]  (1% fee)                      │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  PAYOUT HISTORY                                    [Export CSV] │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Date       │ Amount    │ Status    │ Bank Account        │  │
│  ├────────────┼───────────┼───────────┼─────────────────────┤  │
│  │ Nov 20     │ $1,890.50 │ Completed │ ****4567            │  │
│  │ Nov 13     │ $2,134.25 │ Completed │ ****4567            │  │
│  │ Nov 6      │ $1,567.00 │ Completed │ ****4567            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  REVENUE BREAKDOWN (This Month)                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Gross Revenue:        $10,500.00                         │  │
│  │ Scout Commission (15%): -$1,575.00                       │  │
│  │ Stripe Fees (~2.9%):    -$304.50                         │  │
│  │ ─────────────────────────────────                        │  │
│  │ Net to You:            $8,620.50                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  [⚙️ Payout Settings]  [📄 Tax Documents (1099)]                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Financial Features:**
- Real-time balance display
- Automatic weekly payouts (configurable)
- Instant payout option (1% fee via Stripe)
- Complete payout history
- Revenue breakdown showing gross, commission, fees, net
- 1099 tax document generation (for US gyms)
- Bank account management via Stripe Connect

#### 1.8 Export & Reporting

**Available Exports:**

| Export | Format | Contents |
|--------|--------|----------|
| **Bookings Report** | CSV, Excel | All bookings with user info, dates, amounts, status |
| **Revenue Report** | CSV, Excel, PDF | Revenue by period with breakdown |
| **User Report** | CSV | All users who've visited, contact info, visit count |
| **Waiver Report** | CSV, PDF bundle | All signed waivers |
| **Marketing Report** | CSV, PDF | Campaign performance metrics |
| **Tax Report** | PDF | Annual summary for tax filing |

**Scheduled Reports:**
- Daily summary email (optional)
- Weekly revenue report
- Monthly comprehensive report
- Custom scheduled reports

---

## 2. Scout Admin Portal (Application Owner)

### Recommended Architecture

For the **application owner (you)**, I recommend a **hybrid approach**:

```
┌─────────────────────────────────────────────────────────────────┐
│                    SCOUT ADMIN ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  SCOUT ADMIN PORTAL                      │   │
│  │              (admin.scoutfitness.com)                    │   │
│  │                                                          │   │
│  │  Custom web app for operational tasks:                   │   │
│  │  • Partner management (approve/reject, tier changes)     │   │
│  │  • User management (support, bans, refunds)              │   │
│  │  • Content moderation (reviews, photos)                  │   │
│  │  • Payout management (manual adjustments)                │   │
│  │  • Support ticket queue                                  │   │
│  │  • System health monitoring                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           │                                     │
│                           │ Connects to                         │
│                           ▼                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              THIRD-PARTY ANALYTICS TOOLS                 │   │
│  │                                                          │   │
│  │  Mixpanel / Amplitude (Product Analytics)                │   │
│  │  • User behavior, funnels, retention                     │   │
│  │  • Feature usage                                         │   │
│  │  • Conversion tracking                                   │   │
│  │                                                          │   │
│  │  Metabase / Superset (Business Intelligence)             │   │
│  │  • SQL-based dashboards                                  │   │
│  │  • Revenue reports                                       │   │
│  │  • Custom queries                                        │   │
│  │                                                          │   │
│  │  Stripe Dashboard (Payments)                             │   │
│  │  • Revenue, payouts, disputes                            │   │
│  │  • Already included with Stripe                          │   │
│  │                                                          │   │
│  │  Supabase Dashboard (Database)                           │   │
│  │  • Real-time data                                        │   │
│  │  • Already included with Supabase                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Why This Approach?

| Option | Pros | Cons | Recommendation |
|--------|------|------|----------------|
| **Build Everything Custom** | Full control, exactly what you need | Expensive to build, maintain; weeks of dev time | ❌ Not for MVP |
| **Third-Party Only** | Fast, powerful, proven | Can't handle operational tasks (approvals, bans) | ❌ Incomplete |
| **Hybrid (Recommended)** | Custom for operations + best-in-class analytics | Two systems to learn | ✅ Best balance |

### Scout Admin Portal (Custom Build)

**URL:** `admin.scoutfitness.com`  
**Access:** SSO with admin role verification  
**Platform:** Web only (React + Vite, shared codebase with Partner Portal)

#### Admin Portal Modules

**2.1 Dashboard Overview**

```
┌─────────────────────────────────────────────────────────────────┐
│  SCOUT ADMIN                                    [Zach ▼] [🔔 3] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📊 PLATFORM HEALTH                           Nov 25, 2025      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────┐ │
│  │ Users       │ │ Partners    │ │ Bookings    │ │ Revenue   │ │
│  │   12,456    │ │     89      │ │   1,234     │ │  $34,500  │ │
│  │ +156 today  │ │ +2 pending  │ │ today       │ │ this week │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └───────────┘ │
│                                                                 │
│  ⚠️ REQUIRES ATTENTION                                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 🏢 2 partner applications pending review                 │  │
│  │ 🚩 5 reviews flagged for moderation                      │  │
│  │ 🎫 3 support tickets open > 24 hours                     │  │
│  │ 💳 1 payout failed - needs manual review                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  📈 QUICK METRICS                                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ [Weekly revenue chart]                                   │  │
│  │ [User growth chart]                                      │  │
│  │ [Booking volume chart]                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  [View Full Analytics →]  (opens Mixpanel/Metabase)            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**2.2 Partner Management**

- View all partners (by status, tier, location)
- Approve/reject partner applications
- Upgrade/downgrade partner tiers
- Suspend partners (with reason logging)
- View partner analytics
- Manual payout adjustments
- Communication with partners

**2.3 User Management**

- Search users by email, name, phone
- View user profile, booking history, reviews
- Issue refunds
- Ban/suspend users
- Respond to support requests
- Impersonate user (for debugging, with audit log)

**2.4 Content Moderation**

- Review flagged reviews
- Approve/reject gym photos
- Handle DMCA requests
- Manage reported users

**2.5 Support Queue**

- View all support tickets
- Assign to team members (if you scale)
- Track response times
- Canned responses
- Escalation workflow

**2.6 System Health**

- API status (Google Places, Stripe, Supabase)
- Error rates and logs
- Performance metrics
- Scheduled job status (travel detection, notifications)

### Third-Party Analytics Stack (Recommended)

#### Product Analytics: **Mixpanel** or **Amplitude**

**Why:** Purpose-built for understanding user behavior. Much more powerful than building custom.

**Cost:** 
- Mixpanel: Free up to 20M events/month, then $25+/month
- Amplitude: Free up to 10M events/month, then custom pricing

**What You'll Track:**
- User registration → first booking conversion funnel
- Feature usage (voice search, filters, map vs list)
- Retention cohorts (D1, D7, D30 retention)
- Power user identification
- Drop-off points in booking flow

**Implementation:**
```typescript
// Track events from mobile app
mixpanel.track('Gym Searched', {
  query: 'yoga studio',
  filters: ['sauna', 'towels'],
  results_count: 12,
  voice_search: true
});

mixpanel.track('Booking Completed', {
  gym_id: 'abc123',
  amount: 25.00,
  pass_type: 'day'
});
```

#### Business Intelligence: **Metabase** (Self-Hosted) or **Preset** (Hosted Superset)

**Why:** SQL-based dashboards connected directly to your Supabase PostgreSQL database. Build any report you can imagine.

**Cost:**
- Metabase: Free (self-hosted), or $85/month (cloud)
- Preset: Free tier available, then $20/user/month

**What You'll Build:**
- Revenue dashboards (daily, weekly, monthly trends)
- Partner performance reports
- Geographic analysis (bookings by city)
- Financial reconciliation
- Custom reports for investors

**Example Queries:**
```sql
-- Monthly revenue by city
SELECT 
  g.city,
  DATE_TRUNC('month', b.created_at) as month,
  SUM(b.amount) as revenue,
  COUNT(*) as bookings
FROM bookings b
JOIN gyms g ON b.gym_id = g.id
WHERE b.status = 'completed'
GROUP BY g.city, month
ORDER BY month DESC, revenue DESC;
```

#### Already Included (No Extra Cost)

- **Stripe Dashboard:** All payment analytics, revenue, payouts
- **Supabase Dashboard:** Database stats, API usage, real-time data
- **OneSignal Dashboard:** Push notification analytics
- **Google Cloud Console:** Places API usage and costs

### Do You Need a Mobile Admin App?

**Short answer: No, not for MVP.**

**Why web is sufficient:**
1. Admin tasks are infrequent (not hourly)
2. Complex operations need full keyboard
3. Data-heavy dashboards need large screens
4. You can access web portal from phone browser if needed

**When to consider mobile admin:**
- When you have staff doing check-ins at events
- When you have a support team needing mobile response
- When you're traveling and need frequent access

**If you want mobile later:**
- Build as a separate React Native app
- Or use responsive web design (works on phone)
- Or use Expo's web support (same codebase)

---

## 3. SSO & Authentication Architecture

### Authentication Flows by User Type

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION ARCHITECTURE                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CONSUMER APP (iOS/Android/Web)                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Primary Auth:                                            │   │
│  │ • Apple Sign In (required for iOS)                       │   │
│  │ • Google Sign In                                         │   │
│  │                                                          │   │
│  │ Backup Auth:                                             │   │
│  │ • Email Magic Link (passwordless)                        │   │
│  │ • Email + Password (fallback)                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  PARTNER PORTAL (Web)                                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Primary Auth:                                            │   │
│  │ • Email + Password                                       │   │
│  │ • Google Workspace SSO (for gyms using Google)           │   │
│  │ • Microsoft Entra SSO (for gyms using Microsoft)         │   │
│  │                                                          │   │
│  │ Required:                                                │   │
│  │ • Email verification                                     │   │
│  │ • Gym ownership verification                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ADMIN PORTAL (Web)                                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Primary Auth:                                            │   │
│  │ • Email + Password with MFA required                     │   │
│  │ • Google Workspace SSO (your domain only)                │   │
│  │                                                          │   │
│  │ Additional Security:                                     │   │
│  │ • IP allowlist (optional)                                │   │
│  │ • Session timeout (4 hours)                              │   │
│  │ • Audit logging                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### SSO Implementation

**Supabase Auth supports SSO out of the box** via:

1. **Social Providers (OIDC):**
   - Google
   - Apple
   - Microsoft (Azure AD / Entra)
   - Many others

2. **SAML 2.0** (Enterprise SSO):
   - For large gym chains with their own identity provider
   - Requires Supabase Pro ($25/month) - already in our stack

**Implementation for Partner Portal:**

```typescript
// supabase/auth configuration
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Google Workspace SSO
async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      scopes: 'email profile',
      queryParams: {
        hd: 'partnergymdomain.com' // Restrict to specific domain (optional)
      }
    }
  });
}

// Microsoft Entra (Azure AD) SSO
async function signInWithMicrosoft() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'azure',
    options: {
      scopes: 'email profile openid'
    }
  });
}

// SAML for enterprise (large gym chains)
// Configured in Supabase Dashboard under Authentication > SSO
```

### Role-Based Access Control (RBAC)

```sql
-- User roles stored in profiles table
CREATE TYPE user_role AS ENUM (
  'user',           -- Regular consumer
  'gym_staff',      -- Can check in users, view bookings
  'gym_manager',    -- Full partner portal access
  'gym_owner',      -- Manager + financial access
  'scout_support',  -- Admin portal - limited
  'scout_admin'     -- Admin portal - full
);

ALTER TABLE users ADD COLUMN role user_role DEFAULT 'user';

-- RLS policy example
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) 
    IN ('scout_support', 'scout_admin')
  );
```

### Multi-Factor Authentication (MFA)

**Required for:**
- Admin portal (all users)
- Partner portal (financial access)

**Optional for:**
- Consumer app (user choice)

**Implementation:**
```typescript
// Supabase supports TOTP MFA
const { data, error } = await supabase.auth.mfa.enroll({
  factorType: 'totp',
  friendlyName: 'Authenticator App'
});

// Returns QR code for Google Authenticator / Authy
```

---

## 4. Partner API (B2B Integration)

### Overview

Many gyms use existing management software (Mindbody, Zen Planner, ClubReady, etc.). The **Partner API** allows them to integrate Scout data into their existing systems.

### API Endpoints

**Base URL:** `https://api.scoutfitness.com/v1/partners`

**Authentication:** API Key (generated in Partner Portal)

```
Authorization: Bearer sk_live_abc123...
```

### Available Endpoints

#### Bookings

```http
# List all bookings
GET /bookings
Query params: ?status=confirmed&from=2025-11-01&to=2025-11-30

# Get single booking
GET /bookings/{booking_id}

# Update booking status (check-in)
PATCH /bookings/{booking_id}
Body: { "status": "checked_in" }

# Webhook for real-time booking notifications
POST /webhooks/subscribe
Body: { 
  "url": "https://yoursite.com/scout-webhook",
  "events": ["booking.created", "booking.cancelled", "booking.checked_in"]
}
```

#### Analytics

```http
# Revenue summary
GET /analytics/revenue
Query params: ?period=month&from=2025-11-01

# Booking stats
GET /analytics/bookings
Query params: ?period=week&group_by=day

# User stats
GET /analytics/users
Query params: ?period=month
```

#### Users (Limited - Privacy Compliance)

```http
# List users who have booked at your gym
GET /users
Query params: ?has_booking=true

# Note: Returns limited data (name, email, visit count)
# Full PII not exposed via API for privacy compliance
```

#### Gym Profile

```http
# Get gym profile
GET /gym

# Update gym profile
PATCH /gym
Body: {
  "day_pass_price": 30.00,
  "hours": { "monday": { "open": "05:00", "close": "23:00" } }
}

# Upload photo
POST /gym/photos
Body: multipart/form-data with image file
```

### Webhook Events

```json
// booking.created
{
  "event": "booking.created",
  "timestamp": "2025-11-25T10:30:00Z",
  "data": {
    "booking_id": "book_abc123",
    "user_name": "John Smith",
    "user_email": "john@email.com",
    "pass_type": "day",
    "booking_date": "2025-11-25",
    "amount": 25.00,
    "your_payout": 21.25
  }
}

// booking.checked_in
{
  "event": "booking.checked_in",
  "timestamp": "2025-11-25T10:35:00Z",
  "data": {
    "booking_id": "book_abc123",
    "checked_in_at": "2025-11-25T10:35:00Z"
  }
}
```

### Rate Limits

| Plan | Requests/minute | Requests/day |
|------|-----------------|--------------|
| Partner | 60 | 10,000 |
| Premium Partner | 120 | 50,000 |

### SDK (Future)

For MVP, REST API only. Future consideration:
- JavaScript/TypeScript SDK
- Python SDK
- Zapier integration

---

## 5. Analytics Architecture

### Event Tracking Schema

All analytics events follow a consistent schema:

```typescript
interface AnalyticsEvent {
  // Identification
  event_name: string;
  user_id?: string;        // Null for anonymous
  session_id: string;
  
  // Context
  timestamp: string;       // ISO 8601
  platform: 'ios' | 'android' | 'web';
  app_version: string;
  
  // Event-specific properties
  properties: Record<string, any>;
}
```

### Key Events to Track

#### User Journey Events

| Event | Properties | Purpose |
|-------|------------|---------|
| `app_opened` | source, first_open | DAU/MAU calculation |
| `user_registered` | method (apple/google/email) | Registration funnel |
| `search_performed` | query, filters, voice, results_count | Search effectiveness |
| `gym_viewed` | gym_id, source (search/map/recommendation) | Discovery patterns |
| `booking_started` | gym_id, pass_type | Booking funnel |
| `booking_completed` | gym_id, amount, pass_type | Revenue |
| `booking_cancelled` | gym_id, reason, hours_before | Cancellation analysis |
| `review_submitted` | gym_id, rating | Engagement |
| `trip_detected` | destination, days_out | Travel feature usage |

#### Feature Usage Events

| Event | Properties | Purpose |
|-------|------------|---------|
| `voice_search_used` | success, duration, transcript | Voice feature adoption |
| `map_toggled` | from_view, to_view | UI preference |
| `filter_applied` | filter_type, filter_value | Filter usage |
| `calendar_connected` | provider (ios/google) | Calendar feature adoption |
| `pass_added_to_wallet` | pass_type | Wallet integration |

### Analytics Dashboard Requirements

#### Scout Admin Dashboards (Metabase)

1. **Executive Dashboard**
   - Total users, WAU, MAU
   - Total revenue, GMV
   - Active partners
   - Key conversion rates

2. **Revenue Dashboard**
   - Revenue by day/week/month
   - Revenue by city
   - Revenue by gym tier
   - Commission earned
   - Average booking value

3. **User Dashboard**
   - Registration trends
   - Retention cohorts (D1, D7, D30)
   - User demographics
   - Power user identification

4. **Partner Dashboard**
   - Partner growth
   - Partner tier distribution
   - Booking volume by partner
   - Partner churn

5. **Product Dashboard**
   - Feature usage
   - Voice search adoption
   - Booking funnel conversion
   - Error rates

#### Partner Portal Dashboards (Built-in)

1. **Overview** - Today's snapshot
2. **Revenue** - Earnings over time
3. **Bookings** - Volume and patterns
4. **Users** - Who's visiting
5. **Marketing** - Campaign performance

---

## 6. Implementation Recommendations

### Build Order

| Phase | Scope | Timeline |
|-------|-------|----------|
| **MVP** | Partner Portal basics (profile, bookings, payouts) | Weeks 8-9 |
| **MVP** | Admin Portal basics (partner approvals, user support) | Week 10 |
| **Post-MVP** | Partner analytics dashboard | Week 13-14 |
| **Post-MVP** | Marketing campaigns (email/SMS) | Week 15-16 |
| **Post-MVP** | Partner API | Week 17-18 |
| **Post-MVP** | Advanced analytics (Mixpanel/Metabase) | Week 14+ |

### Technology Stack

| Component | Technology | Rationale |
|-----------|------------|-----------|
| **Partner Portal** | React + Vite | Fast builds, shared components with consumer web |
| **Admin Portal** | React + Vite | Same codebase as partner portal |
| **Analytics (Product)** | Mixpanel | Best-in-class for user behavior |
| **Analytics (Business)** | Metabase + Supabase | SQL access to all data |
| **Email Campaigns** | SendGrid | Reliable, affordable, good APIs |
| **SMS Campaigns** | Twilio | Industry standard |
| **SSO** | Supabase Auth | Already in stack, supports SAML/OIDC |

### Cost Estimates

| Service | Monthly Cost | Notes |
|---------|--------------|-------|
| Metabase Cloud | $85 | Or free self-hosted |
| Mixpanel | $0-25 | Free tier likely sufficient for MVP |
| SendGrid | $15-20 | For partner email campaigns |
| Twilio SMS | Variable | ~$0.0075/message, pay as you go |
| **Total Additional** | ~$100-130/month | On top of existing stack |

### MVP Prioritization

**Must Have for Launch:**
- ✅ Partner can log in and see their gym profile
- ✅ Partner can view bookings and revenue
- ✅ Partner can update basic info (hours, prices, photos)
- ✅ Partner can connect Stripe and receive payouts
- ✅ Admin can approve/reject partner applications
- ✅ Admin can handle support tickets

**Nice to Have (Post-Launch):**
- ⏳ Full analytics dashboard for partners
- ⏳ Marketing campaigns (email/SMS)
- ⏳ Partner API for integrations
- ⏳ Waiver management
- ⏳ Advanced admin analytics

**Future:**
- 📅 SAML SSO for enterprise gym chains
- 📅 White-label options
- 📅 Partner mobile app

---

## Summary

This specification covers:

1. **Gym Owner Portal** - Comprehensive dashboard for partners to manage their Scout presence, analytics, marketing, and finances

2. **Scout Admin Portal** - Custom web app for operational tasks + third-party tools for deep analytics

3. **SSO Architecture** - Supabase-based authentication with social login, Google/Microsoft SSO, and SAML for enterprise

4. **Partner API** - REST API for gyms to integrate Scout data with their existing systems

5. **Analytics Architecture** - Event tracking schema and dashboard requirements

The hybrid approach (custom admin portal + third-party analytics) gives you the best of both worlds: operational control and world-class analytics without months of custom development.