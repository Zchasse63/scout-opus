# Phase 6: Data Pipeline

> Web scraping, gym verification, user-generated content, and proprietary database

---

## Document Info

| Field | Value |
|-------|-------|
| **Phase** | 6 of 8 |
| **Timeline** | Weeks 13-15 |
| **Status** | Not Started |
| **Created** | November 25, 2025 |
| **Last Updated** | November 25, 2025 |
| **Last Audit** | November 25, 2025 |
| **Version** | 1.0.0 |

---

## Current Completion Status

| Week | Focus Area | Status | Completion |
|------|------------|--------|------------|
| Week 13 | Scraping Pipeline | ❌ Not Started | 0% |
| Week 13 | Database Schema Updates | ❌ Not Started | 0% |
| Week 14 | Verification Forms | ❌ Not Started | 0% |
| Week 14 | User-Generated Content | ❌ Not Started | 0% |
| Week 15 | Gamification System | ❌ Not Started | 0% |
| Week 15 | Public Gym Pages | ❌ Not Started | 0% |

### Critical Blockers

1. **MVP Mobile App (Phases 1-5)** must be complete before this phase
2. Firecrawl API account and credits
3. Tally (or custom form) setup for verification
4. Tampa/Miami gym list from Google Places API

---

## Phase Navigation

| Previous | Current | Next |
|----------|---------|------|
| [Phase 5: Polish & Launch](PHASE_5_POLISH_LAUNCH.md) | **Phase 6: Data Pipeline** | [Phase 7: Partner Portal](PHASE_7_PARTNER_PORTAL.md) |

**All Phases:**
- [Phase 1: Foundation](PHASE_1_FOUNDATION.md)
- [Phase 2: Core Features](PHASE_2_CORE_FEATURES.md)
- [Phase 3: Booking System](PHASE_3_BOOKING_SYSTEM.md)
- [Phase 4: Intelligence](PHASE_4_INTELLIGENCE.md)
- [Phase 5: Polish & Launch](PHASE_5_POLISH_LAUNCH.md)
- **Phase 6: Data Pipeline** (Current)
- [Phase 7: Partner Portal](PHASE_7_PARTNER_PORTAL.md)
- [Phase 8: Admin Portal](PHASE_8_ADMIN_PORTAL.md)

---

## Overview

Phase 6 builds Scout's **data moat** - the proprietary fitness facility database that differentiates Scout from competitors relying solely on Google Places. This phase implements the web scraping pipeline, gym verification system, user-generated content collection, and gamification to incentivize contributions.

### Goals

1. Firecrawl web scraping pipeline for Tampa/Miami gyms
2. Gym verification form system (via Tally or custom)
3. User reviews and photo contributions
4. Badges and streaks gamification system
5. Public SEO-optimized gym pages
6. Equipment search and filtering
7. Market waitlist for expansion

### Data Strategy Vision

```
┌─────────────────────────────────────────────────────────────────┐
│                    SCOUT DATA ECOSYSTEM                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐          │
│   │  SCRAPED    │   │  VERIFIED   │   │    USER     │          │
│   │   DATA      │ + │   (Forms)   │ + │  GENERATED  │          │
│   │ (Firecrawl) │   │             │   │  (Reviews,  │          │
│   │             │   │             │   │   Photos)   │          │
│   └──────┬──────┘   └──────┬──────┘   └──────┬──────┘          │
│          │                 │                 │                  │
│          └────────────┬────┴────────────────┘                  │
│                       ▼                                         │
│          ┌─────────────────────────┐                           │
│          │   SCOUT PROPRIETARY     │                           │
│          │       DATABASE          │                           │
│          └─────────────────────────┘                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Prerequisites (from Phase 5)

- ✅ Mobile app launched and working
- ✅ Booking system functional
- ✅ User authentication in place
- ✅ Review system functional

---

## Week 13: Scraping Pipeline

### 13.1 Firecrawl Account Setup

- [ ] Create Firecrawl account (firecrawl.dev)
- [ ] Choose plan (Hobby $19/mo for ~3,000 credits)
- [ ] Get API key and store in environment
- [ ] Test API connectivity

### 13.2 Database Schema Updates

Update `supabase/migrations/` with new data fields:

- [ ] Add `data_source` field to gyms table
  ```sql
  ALTER TABLE gyms ADD COLUMN data_source TEXT
    CHECK (data_source IN ('scraped', 'verified', 'partner', 'api'));
  ```
- [ ] Add `scraped_at` timestamp
- [ ] Add `needs_verification` boolean
- [ ] Add `outreach_status` field
- [ ] Add `confidence_scores` JSONB field for per-field confidence
- [ ] Create `equipment_brands` table
  ```sql
  CREATE TABLE equipment_brands (
    id BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    category TEXT CHECK (category IN ('strength', 'cardio', 'functional'))
  );
  ```
- [ ] Create `gym_equipment` junction table
- [ ] Add scraping-related indexes

### 13.3 Create Scraping Edge Functions

- [ ] Create `supabase/functions/scrape-discover-gyms/index.ts`
  - Query Google Places API for gym websites
  - Store place_id and website URLs
  - Queue for scraping

- [ ] Create `supabase/functions/scrape-gym-website/index.ts`
  ```typescript
  // Firecrawl integration
  const result = await firecrawl.scrapeUrl(gymWebsite, {
    formats: ['extract'],
    extract: {
      schema: GYM_EXTRACTION_SCHEMA,
      prompt: 'Extract gym amenities, pricing, contact info...'
    }
  });
  ```

- [ ] Create `supabase/functions/scrape-process-batch/index.ts`
  - Process multiple gyms with rate limiting
  - Handle failures gracefully
  - Log scraping results

### 13.4 Chain Gym Handling

- [ ] Create `constants/chainGyms.ts` with known chain configurations
  ```typescript
  const CHAIN_GYMS = {
    'crunch': {
      default_amenities: ['locker_rooms', 'showers'],
      variable_amenities: ['pool', 'sauna', 'hydromassage']
    },
    'planet_fitness': { ... },
    'la_fitness': { ... }
  };
  ```
- [ ] Implement chain detection logic
- [ ] Apply default amenities for known chains
- [ ] Flag variable amenities for verification

### 13.5 Scraping Dashboard (Admin)

- [ ] Create basic admin view to monitor scraping progress
- [ ] Show scraped vs pending vs failed counts
- [ ] Manual retry button for failed scrapes

### Week 13 Deliverable

✅ Automated scraping pipeline discovering and extracting data from Tampa/Miami gyms

---

## Week 14: Verification & Outreach

### 14.1 Verification Form Setup

- [ ] Create Tally form OR custom Scout form
- [ ] Form sections:
  - [ ] Basic Info (pre-filled from scraped data)
  - [ ] Hours of Operation
  - [ ] Amenities (checkboxes)
  - [ ] Equipment (checkboxes + brand dropdown)
  - [ ] Women's Facilities
  - [ ] Accessibility
  - [ ] Pricing (day pass, week pass, monthly)
  - [ ] Classes Offered
  - [ ] Photos upload
- [ ] Configure webhook to Supabase Edge Function

### 14.2 Form Processing Edge Function

- [ ] Create `supabase/functions/form-process-verification/index.ts`
  - Receive webhook from Tally
  - Update gym record with verified data
  - Set data_source = 'verified'
  - Apply "Verified" badge
  - Send confirmation email

### 14.3 Outreach Email System

- [ ] Create email templates:
  - [ ] Initial outreach email
  - [ ] Day 3 reminder
  - [ ] Day 7 final reminder
- [ ] Create `supabase/functions/outreach-send-email/index.ts`
- [ ] Create `supabase/functions/outreach-schedule-followups/index.ts`
- [ ] Track outreach status per gym

### 14.4 User-Generated Content

- [ ] Create review system components (if not in Phase 3):
  - [ ] `components/reviews/ReviewForm.tsx`
  - [ ] `components/reviews/ReviewCard.tsx`
  - [ ] `components/reviews/StarRating.tsx`
- [ ] Create `supabase/functions/reviews-process/index.ts`
- [ ] Implement review moderation queue
- [ ] Create photo upload system:
  - [ ] `components/photos/PhotoUpload.tsx`
  - [ ] `supabase/functions/photos-process/index.ts`
  - [ ] AI moderation with vision model (Gemini)

### 14.5 Photo Management

- [ ] Set up Supabase Storage bucket for gym photos
- [ ] Implement image compression before upload
- [ ] Create AI moderation Edge Function
  ```typescript
  // Check for inappropriate content
  const moderationResult = await gemini.analyzeImage(photoUrl, {
    prompt: 'Is this an appropriate gym photo? Check for...'
  });
  ```
- [ ] Create photo approval workflow

### Week 14 Deliverable

✅ Verification form system with automated outreach and user content collection

---

## Week 15: Gamification & SEO

### 15.1 Gamification System

Create gamification infrastructure:

- [ ] Create `gamification` table in database
  ```sql
  CREATE TABLE user_badges (
    id BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    user_id UUID NOT NULL REFERENCES users(id),
    badge_type TEXT NOT NULL,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    metadata JSONB
  );

  CREATE TABLE user_streaks (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE
  );
  ```

- [ ] Define badge types:
  ```typescript
  const BADGES = {
    'first_workout': { name: 'First Workout', icon: '🎉' },
    'reviewer': { name: 'Reviewer', icon: '⭐', requirement: '5 reviews' },
    'photographer': { name: 'Photographer', icon: '📸', requirement: '10 photos' },
    'explorer': { name: 'Explorer', icon: '🗺️', requirement: '10 different gyms' },
    'streak_7': { name: 'Week Warrior', icon: '🔥', requirement: '7-day streak' },
    'streak_30': { name: 'Iron Will', icon: '💪', requirement: '30-day streak' },
    // ... more badges
  };
  ```

- [ ] Create `supabase/functions/gamification-check-badges/index.ts`
- [ ] Create `supabase/functions/gamification-update-streak/index.ts`

### 15.2 Points System

- [ ] Create `user_points` table
  ```sql
  CREATE TABLE user_points (
    id BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    user_id UUID NOT NULL REFERENCES users(id),
    points INTEGER NOT NULL,
    reason TEXT NOT NULL,
    reference_type TEXT,
    reference_id BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
  );
  ```

- [ ] Define point values:
  | Action | Points |
  |--------|--------|
  | Complete booking | 10 |
  | Write review | 20 |
  | Upload photo | 15 |
  | Photo approved | 10 bonus |
  | Verify gym info | 25 |
  | Referral conversion | 50 |

- [ ] Create points-earning Edge Functions

### 15.3 Profile & Badges UI

- [ ] Update `app/(tabs)/profile.tsx` with:
  - [ ] Points display
  - [ ] Badge showcase
  - [ ] Current streak
  - [ ] Stats (gyms visited, reviews, photos)
- [ ] Create `components/profile/BadgeGrid.tsx`
- [ ] Create `components/profile/StreakDisplay.tsx`
- [ ] Create `components/profile/PointsHistory.tsx`

### 15.4 Public Gym Pages (SEO)

Create web-accessible gym pages for SEO:

- [ ] Set up web route structure: `/gym/[slug]`
- [ ] Create `GymPublicPage.tsx` component
  - Hero image
  - Gym info (name, address, hours)
  - Amenities grid
  - Reviews section
  - CTA to download app
- [ ] Implement structured data (JSON-LD)
  ```json
  {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    "name": "Iron Temple Fitness",
    "address": { ... }
  }
  ```
- [ ] Create sitemap generator
- [ ] Submit to Google Search Console

### 15.5 Equipment Search Feature

- [ ] Add equipment filter to search:
  - [ ] Update `FilterCarousel.tsx` with equipment options
  - [ ] Create `components/search/EquipmentFilter.tsx`
- [ ] Update search Edge Function to filter by equipment
- [ ] Add equipment display on gym detail page

### 15.6 Market Waitlist System

For users in unsupported markets:

- [ ] Create `market_waitlist` table
  ```sql
  CREATE TABLE market_waitlist (
    id BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    email TEXT,
    city TEXT NOT NULL,
    state TEXT,
    country TEXT DEFAULT 'US',
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
  );
  ```
- [ ] Create waitlist signup component
- [ ] Show when user searches in unsupported area
- [ ] Create notification when market launches

### Week 15 Deliverable

✅ Complete gamification system, public SEO pages, equipment search, and market waitlist

---

## Technical Specifications

### Data Completeness Tiers

| Tier | Description | Data Sources | Badge |
|------|-------------|--------------|-------|
| **Tier 1: Premium** | Partner gyms | Verified + Owner + UGC + API | ⭐ Partner |
| **Tier 2: Verified** | Non-partner verified | Verified + UGC + API | ✓ Verified |
| **Tier 3: Enriched** | Scraped + user content | Scraped + UGC + API | (none) |
| **Tier 4: Basic** | API only | Google Places only | ⚠️ Unverified |

### Confidence Scoring

Each data field has a confidence score:

```typescript
interface DataField {
  value: any;
  source: 'owner' | 'scout' | 'user_verified' | 'user' | 'scraped' | 'api';
  confidence: number;  // 0.0 - 1.0
  last_updated: Date;
}
```

### API Costs

| Service | Usage | Est. Monthly Cost |
|---------|-------|-------------------|
| Firecrawl | ~2,000 scrapes | $19 (Hobby) |
| Gemini (moderation) | ~5,000 images | ~$50 |
| Email (Resend/SendGrid) | ~10,000 emails | $20 |
| **Total** | | **~$90/month** |

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Tampa gyms scraped | 500+ | Database count |
| Miami gyms scraped | 500+ | Database count |
| Verification response rate | 20%+ | Forms submitted / emails sent |
| User reviews per gym | 3+ avg | Reviews table |
| Photos per gym | 5+ avg | Photos table |
| Badge earn rate | 30% of users | Badges earned / active users |
| SEO page indexing | 80%+ | Google Search Console |

---

## Change Log

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| November 25, 2025 | 1.0.0 | Initial document created | Claude |

---

*This phase should only begin after MVP launch (Phase 5 complete).*
