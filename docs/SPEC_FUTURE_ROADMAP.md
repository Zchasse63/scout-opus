# Scout Fitness App: Future Plans & Roadmap
## Features for Post-MVP Development

**Version:** 1.0  
**Date:** November 25, 2025  
**Status:** Planning Document

---

## Overview

This document outlines features planned for development AFTER the MVP launch. These features have been identified as valuable but are not required for initial market validation. They are organized by priority and estimated timeline.

---

## Feature Categories

| Priority | Timeline | Features |
|----------|----------|----------|
| **Phase 2** | Months 4-6 | Gym Comparison, Referral Program, Class Schedule Display |
| **Phase 3** | Months 7-9 | Gym Matching Quiz, Price Alerts, Light Social |
| **Phase 4** | Months 10-12 | Corporate Accounts, Partner Referrals |
| **Future** | Year 2+ | Data Licensing, Real-Time Occupancy |

---

## Phase 2 Features (Months 4-6 Post-Launch)

### 1. Gym Comparison Tool

**Description:** Allow users to compare 2-3 gyms side-by-side to make informed decisions.

**User Story:**
> As a traveler deciding between gyms, I want to compare amenities, pricing, and reviews side-by-side so I can choose the best option for my needs.

**UI Concept:**
```
┌─────────────────────────────────────────────────────────────────┐
│  COMPARE GYMS                                          [Done]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐       │
│  │ Iron Temple   │  │ FitLife Tampa │  │ [+ Add Gym]   │       │
│  │ [Remove]      │  │ [Remove]      │  │               │       │
│  └───────────────┘  └───────────────┘  └───────────────┘       │
│                                                                 │
│  ─────────────────────────────────────────────────────────     │
│                                                                 │
│  RATING          ⭐ 4.8 (124)      ⭐ 4.5 (89)                  │
│  DAY PASS        $25              $20                          │
│  DISTANCE        0.8 mi           1.2 mi                       │
│                                                                 │
│  ─────────────────────────────────────────────────────────     │
│                                                                 │
│  AMENITIES                                                      │
│  Sauna           ✓                ✗                            │
│  Pool            ✓                ✓                            │
│  Towel Service   ✓                ✗                            │
│  24/7 Access     ✓                ✓                            │
│  WiFi            ✓                ✓                            │
│  Steam Room      ✗                ✓                            │
│                                                                 │
│  ─────────────────────────────────────────────────────────     │
│                                                                 │
│  EQUIPMENT                                                      │
│  Brand           Rogue            Life Fitness                 │
│  Free Weights    ✓ (200lb max)    ✓ (150lb max)               │
│  Squat Racks     10               4                            │
│                                                                 │
│  ─────────────────────────────────────────────────────────     │
│                                                                 │
│  [Book Iron Temple]    [Book FitLife]                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Technical Requirements:**
- Comparison state stored in Zustand (up to 3 gyms)
- "Add to Compare" button on gym cards
- Floating compare bar when 1+ gyms selected
- Shareable comparison URL for web

**Estimated Effort:** 1-2 weeks

---

### 2. Referral Program

**Description:** Users can invite friends and both receive rewards when the friend books their first workout.

**User Story:**
> As a Scout user, I want to invite my friends and earn free passes when they sign up, so I can share the app and get rewards.

**Mechanics:**
```
┌─────────────────────────────────────────────────────────────────┐
│  INVITE FRIENDS, EARN REWARDS                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Share your code and you BOTH get a FREE day pass              │
│  when your friend completes their first booking!                │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │           Your Code: JOHN2025                           │   │
│  │                                                         │   │
│  │           [Copy Code]  [Share]                          │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  YOUR REFERRALS                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Sarah J.     Signed up Nov 20    ✓ Booked - You earned! │   │
│  │ Mike D.      Signed up Nov 22    ⏳ Waiting for booking  │   │
│  │ Lisa W.      Signed up Nov 24    ⏳ Waiting for booking  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  REWARDS EARNED                                                 │
│  🎫 1 Free Day Pass (from Sarah's booking)                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Reward Structure:**
| Action | Referrer Gets | Referee Gets |
|--------|---------------|--------------|
| Friend signs up | Nothing yet | Nothing yet |
| Friend completes first booking | Free day pass | Free day pass |
| 5 successful referrals | "Ambassador" badge + bonus pass | - |
| 10 successful referrals | "Scout Champion" badge + premium features | - |

**Technical Requirements:**
- Unique referral codes per user
- Deep link support (scoutfitness.com/r/JOHN2025)
- Attribution tracking (30-day window)
- Fraud prevention (same device, same IP detection)
- Integration with points/rewards system

**Estimated Effort:** 2 weeks

---

### 3. Class Schedule Display

**Description:** Show class schedules for gyms that provide them, allowing users to see what's available.

**User Story:**
> As a yoga enthusiast traveling to Tampa, I want to see what classes are offered at a studio and when, so I can plan my visit around my preferred workout.

**Data Source:**
- Partner gyms provide via Partner Portal
- Scraped from gym websites (if structured)
- User contributions ("I saw they have 6am yoga")

**UI Concept:**
```
┌─────────────────────────────────────────────────────────────────┐
│  CLASS SCHEDULE                              [This Week ▼]      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  TODAY - Monday, Nov 25                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 6:00 AM   Yoga Flow         Sarah M.      45 min        │   │
│  │ 7:00 AM   HIIT Bootcamp     Mike T.       60 min        │   │
│  │ 9:00 AM   Pilates           Lisa K.       50 min        │   │
│  │ 12:00 PM  Power Yoga        Sarah M.      60 min        │   │
│  │ 5:30 PM   Spin              James R.      45 min        │   │
│  │ 6:30 PM   Strength & Tone   Mike T.       45 min        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  TOMORROW - Tuesday, Nov 26                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 6:00 AM   Sunrise Yoga      Sarah M.      45 min        │   │
│  │ ...                                                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ⚠️ Schedules provided by gym. Verify before visiting.         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Technical Requirements:**
- Class schedule data model (time, name, instructor, duration, type)
- Partner Portal: Class schedule management UI
- Verification form: "Do you offer group classes?" section
- Calendar view component
- Timezone handling for travelers

**Estimated Effort:** 2-3 weeks

**Note:** This is display-only. Class booking through Scout is a separate, more complex feature not currently planned.

---

## Phase 3 Features (Months 7-9 Post-Launch)

### 4. Gym Matching Quiz

**Description:** Interactive quiz that learns user preferences and recommends personalized gyms.

**User Story:**
> As a new Scout user, I want to answer a few questions about my workout style so the app can recommend gyms that match my preferences.

**Quiz Flow:**
```
┌─────────────────────────────────────────────────────────────────┐
│  FIND YOUR PERFECT GYM                              Step 1 of 5 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  What's your primary workout style?                             │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐                      │
│  │                 │  │                 │                      │
│  │    🏋️ Weights   │  │    🧘 Yoga      │                      │
│  │   & Strength    │  │   & Flexibility │                      │
│  │                 │  │                 │                      │
│  └─────────────────┘  └─────────────────┘                      │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐                      │
│  │                 │  │                 │                      │
│  │    🏃 Cardio    │  │    🥊 HIIT &    │                      │
│  │   & Endurance   │  │   Functional    │                      │
│  │                 │  │                 │                      │
│  └─────────────────┘  └─────────────────┘                      │
│                                                                 │
│  ┌─────────────────────────────────────┐                       │
│  │         🎯 I like variety!          │                       │
│  └─────────────────────────────────────┘                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Quiz Questions:**
1. Primary workout style (strength, cardio, yoga, HIIT, variety)
2. Must-have amenities (sauna, pool, towels, 24/7)
3. Time preference (early morning, midday, evening, anytime)
4. Atmosphere preference (hardcore, social, quiet, luxury)
5. Budget range ($10-20, $20-30, $30-50, $50+)

**Output:**
- Personalized gym recommendations
- Saved preferences for future searches
- "Because you prefer..." explanations on gym cards

**Technical Requirements:**
- Quiz state management
- Preference storage in user profile
- Recommendation algorithm weighted by preferences
- Re-take quiz option

**Estimated Effort:** 1-2 weeks

---

### 5. Price Alerts

**Description:** Notify users when gym prices drop or special promotions are available.

**User Story:**
> As a budget-conscious user, I want to be notified when my favorite gyms lower their day pass prices so I can take advantage of deals.

**Alert Types:**
| Alert Type | Trigger | Example |
|------------|---------|---------|
| Price Drop | Day pass price decreased | "Iron Temple dropped to $20 (was $25)!" |
| Promotion | Partner creates promo | "Flash sale: 30% off this weekend!" |
| Threshold | Price falls below user's target | "A gym near you is now under $15!" |

**UI - Setting Alerts:**
```
┌─────────────────────────────────────────────────────────────────┐
│  PRICE ALERTS                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Get notified about price drops and deals                       │
│                                                                 │
│  WATCHED GYMS                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🏋️ Iron Temple        Currently $25    [🔔 Watching]    │   │
│  │ 🧘 Zen Yoga Studio    Currently $18    [🔔 Watching]    │   │
│  │ [+ Watch Another Gym]                                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  PRICE THRESHOLD                                                │
│  Alert me when any gym near me drops below:                     │
│  [$15_______] per day pass                                      │
│                                                                 │
│  PROMOTIONS                                                     │
│  [✓] Notify me about flash sales and promotions                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Technical Requirements:**
- Price history tracking (detect changes)
- User watchlist storage
- Push notification triggers
- Partner Portal: Promotion creation
- Deep links to gym from notification

**Estimated Effort:** 1-2 weeks

---

### 6. Light Social Features

**Description:** Add subtle social elements to increase engagement without becoming a social network.

**Features:**
| Feature | Description | Privacy Level |
|---------|-------------|---------------|
| Activity Count | "5 Scout users visited this week" | Anonymous, aggregate |
| Check-in Feed | See friends' recent workouts (opt-in) | Friends only |
| Leaderboards | Top explorers, longest streaks (opt-in) | Public username |
| Workout Buddies | "3 friends have been here" | Friends only |

**UI - Activity Indicators:**
```
┌─────────────────────────────────────────────────────────────────┐
│  Iron Temple Fitness                                            │
│  ⭐ 4.8 (124 reviews)  •  📍 Tampa, FL                          │
│                                                                 │
│  🔥 Popular on Scout                                            │
│  12 Scout users visited this week                               │
│                                                                 │
│  👥 2 friends have been here                                    │
│  Sarah gave it ⭐⭐⭐⭐⭐                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Privacy Controls:**
```
┌─────────────────────────────────────────────────────────────────┐
│  PRIVACY SETTINGS                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  WHO CAN SEE MY ACTIVITY                                        │
│  ( ) Nobody - Keep my workouts private                          │
│  (•) Friends Only - Only people I've added                      │
│  ( ) Everyone - Appear on leaderboards                          │
│                                                                 │
│  WHAT'S VISIBLE                                                 │
│  [✓] Which gyms I've visited                                   │
│  [✓] My reviews and ratings                                    │
│  [ ] My workout frequency                                       │
│  [ ] My current streak                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Technical Requirements:**
- Friend system (add/remove friends)
- Privacy settings per user
- Aggregate activity calculations
- Activity feed (friends' workouts)
- Leaderboard calculations

**Estimated Effort:** 3-4 weeks

**Note:** This is intentionally "light" — Scout is a utility app, not a social network. Keep social features optional and unobtrusive.

---

## Phase 4 Features (Months 10-12 Post-Launch)

### 7. Corporate Accounts

**Description:** B2B offering for companies to provide Scout access to employees for business travel.

**User Story:**
> As an HR manager, I want to give my employees access to Scout so they can stay fit during business trips, charged to the company.

**Business Model:**
| Plan | Price | Includes |
|------|-------|----------|
| Starter | $500/month | Up to 25 employees, $200 in credits |
| Business | $1,500/month | Up to 100 employees, $750 in credits |
| Enterprise | Custom | Unlimited employees, dedicated support |

**Features:**
- Admin dashboard for HR/travel managers
- Employee invitation and management
- Consolidated billing (company card)
- Usage reports and analytics
- Expense integration (easy reporting)
- SSO with company identity provider

**Corporate Admin Dashboard:**
```
┌─────────────────────────────────────────────────────────────────┐
│  ACME CORP - Scout Corporate Dashboard                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  USAGE THIS MONTH                                               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │ Employees   │ │ Bookings    │ │ Spent       │               │
│  │    45/100   │ │     89      │ │ $2,340/$3K  │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
│                                                                 │
│  TOP USERS                                                      │
│  1. Sarah Johnson - 8 bookings ($200)                          │
│  2. Mike Smith - 6 bookings ($150)                             │
│  3. Lisa Chen - 5 bookings ($125)                              │
│                                                                 │
│  [Invite Employees]  [View Report]  [Export CSV]               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Technical Requirements:**
- Organization entity in database
- Role-based access (org admin, employee)
- Billing at organization level
- Usage tracking and limits
- SSO integration (SAML, Google Workspace)
- API for expense systems

**Estimated Effort:** 4-6 weeks

**Revenue Potential:** High-value contracts, low churn, predictable revenue

---

### 8. Partner Referrals

**Description:** Allow partner gyms to refer other gyms and earn bonuses.

**User Story:**
> As a partner gym owner, I want to refer other gym owners I know to Scout and earn a bonus when they sign up.

**Referral Structure:**
| Referral Outcome | Referrer Earns |
|------------------|----------------|
| Referred gym signs up as Partner | $100 credit or 1 month reduced commission |
| Referred gym earns $1,000 on Scout | Additional $50 bonus |
| 5+ successful referrals | "Scout Advocate" badge on listing |

**Implementation:**
- Referral codes for partners in Partner Portal
- Attribution tracking
- Payout integration with existing financials
- Partner network visualization

**Estimated Effort:** 1-2 weeks

---

## Future Consideration (Year 2+)

### 9. Data Licensing

**Description:** License Scout's comprehensive gym database to third parties.

**Potential Customers:**
| Customer Type | Use Case | Value Proposition |
|---------------|----------|-------------------|
| Corporate Wellness | Employee gym recommendations | Most comprehensive amenity data |
| Real Estate | Neighborhood fitness scores | Unique location data |
| Insurance | Wellness program integrations | Verified facility data |
| Travel Platforms | Gym recommendations for travelers | API access to discovery |
| Fitness Equipment | Market research | Equipment distribution data |

**Licensing Models:**
- API access (per-call pricing)
- Data feed subscription (monthly/annual)
- Custom data products (one-time projects)

**Technical Requirements:**
- Public API with authentication
- Rate limiting and usage tracking
- Data freshness guarantees
- Legal/contract framework
- Privacy compliance (anonymize user data)

**Estimated Effort:** 4-6 weeks for API, ongoing for partnerships

**Revenue Potential:** Recurring B2B revenue, validates data as asset

---

### 10. Real-Time Occupancy

**Description:** Show users how crowded a gym is right now.

**User Story:**
> As someone who hates crowded gyms, I want to see how busy a gym is before I go, so I can time my visit for when it's less crowded.

**Data Sources:**
| Source | Accuracy | Implementation |
|--------|----------|----------------|
| Partner self-report | Low | Staff updates manually |
| Check-in tracking | Medium | Scout check-ins as proxy |
| WiFi device counting | High | Requires gym integration |
| Camera/sensor | Very High | Requires hardware partnership |
| Google Popular Times | Medium | Free, but delayed |

**UI Concept:**
```
┌─────────────────────────────────────────────────────────────────┐
│  Iron Temple Fitness                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CURRENT CROWD LEVEL                                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  🟡 Moderately Busy                                     │   │
│  │  Usually gets busier around 5-6 PM                      │   │
│  │                                                         │   │
│  │  [░░░░░░░░░░░░░░▓▓▓▓▓▓░░░░░░]                          │   │
│  │   6am        12pm      5pm     10pm                     │   │
│  │                    ▲ Now                                │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  BEST TIMES TO GO                                               │
│  🟢 Least busy: 6-7 AM, 2-4 PM                                 │
│  🔴 Most busy: 5-7 PM                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**MVP Approach:**
1. Start with Google Popular Times data (free, available via API)
2. Supplement with Scout check-in patterns
3. Allow partner gyms to update manually
4. Explore integrations with gym software later

**Technical Requirements:**
- Google Popular Times integration
- Check-in pattern analysis
- Partner Portal: Manual crowd update
- Historical pattern visualization

**Estimated Effort:** 2-3 weeks for basic version, ongoing for advanced

---

## Implementation Priority Matrix

```
                    HIGH IMPACT
                         │
     Corporate           │           Referral Program
     Accounts            │           Gym Comparison
          ●              │                ●
                         │
                         │
LOW ─────────────────────┼───────────────────── HIGH
EFFORT                   │                      EFFORT
                         │
        Price Alerts     │           Class Schedules
        Partner Referrals│           Light Social
        Gym Quiz         │           Real-Time Occupancy
             ●           │                ●
                         │
                    LOW IMPACT
```

**Recommended Order:**
1. Referral Program (high impact, medium effort, drives growth)
2. Gym Comparison (high impact, low effort, uses existing data)
3. Price Alerts (medium impact, low effort, increases engagement)
4. Gym Matching Quiz (medium impact, low effort, improves onboarding)
5. Class Schedules (medium impact, medium effort, depends on data)
6. Corporate Accounts (high impact, high effort, big revenue opportunity)
7. Light Social (medium impact, high effort, engagement play)
8. Partner Referrals (low impact, low effort, nice-to-have)
9. Real-Time Occupancy (medium impact, high effort, requires integrations)
10. Data Licensing (high potential, requires scale first)

---

## Dependencies & Prerequisites

| Feature | Requires |
|---------|----------|
| Gym Comparison | Comprehensive amenity data (Phase 1) |
| Referral Program | User accounts, booking system (MVP) |
| Class Schedules | Partner Portal, form data collection |
| Gym Matching Quiz | User profiles, preference storage |
| Price Alerts | Price history tracking, push notifications |
| Light Social | Friend system, privacy infrastructure |
| Corporate Accounts | SSO support, organization entity |
| Partner Referrals | Partner Portal, payout system |
| Data Licensing | API infrastructure, legal framework |
| Real-Time Occupancy | Partner integrations OR sufficient check-in volume |

---

## Success Metrics

| Feature | Primary Metric | Target |
|---------|----------------|--------|
| Gym Comparison | Comparison-to-booking conversion | 30%+ |
| Referral Program | Referred user activation rate | 40%+ |
| Class Schedules | Schedule views per gym view | 25%+ |
| Gym Matching Quiz | Quiz completion rate | 70%+ |
| Price Alerts | Alert-to-booking conversion | 20%+ |
| Light Social | Friend connections per user | 3+ avg |
| Corporate Accounts | Enterprise contract value | $10K+ ARR |
| Partner Referrals | Partner referral rate | 10% of partners |
| Data Licensing | API revenue | $5K+ MRR |
| Real-Time Occupancy | Feature usage rate | 40%+ of sessions |

---

## Notes

- All timelines are estimates and depend on MVP launch timing
- Features may be reprioritized based on user feedback post-launch
- Some features may be split into phases (e.g., Light Social v1 vs v2)
- Corporate Accounts may warrant dedicated sales effort
- Data Licensing requires significant scale before viable

---

*This document will be updated as priorities evolve and user feedback is collected.*