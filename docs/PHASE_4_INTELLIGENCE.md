# Phase 4: Intelligence

> Calendar integration, travel detection, Trips tab, and proactive notifications

---

## Document Info

| Field | Value |
|-------|-------|
| **Phase** | 4 of 8 |
| **Timeline** | Week 10 |
| **Status** | In Progress (20% Complete) |
| **Created** | November 25, 2025 |
| **Last Updated** | November 25, 2025 |
| **Last Audit** | November 25, 2025 |
| **Version** | 1.1.0 |

---

## Current Completion Status

| Week | Focus Area | Status | Completion |
|------|------------|--------|------------|
| Week 10 | Calendar Integration | ⚠️ Partial | 30% |
| Week 10 | Travel Detection | ⚠️ Partial | 25% |
| Week 10 | Trips Tab UI | ❌ Not Started | 0% |
| Week 10 | Notifications | ⚠️ Partial | 20% |

### Critical Remaining Items

1. **CalendarPermission.tsx** - Permission request UI (BLOCKING)
2. **TripCard.tsx** - Trip display card (BLOCKING)
3. **AddTripButton.tsx** - Manual trip addition (BLOCKING)
4. **TripGymList.tsx** - Gyms for a trip
5. **useCalendarSync** hook - Calendar sync logic
6. **useTravelDetection** hook - Travel detection algorithm
7. **useNotifications** hook - Notification handling
8. **notifications-booking-reminder/** Edge Function
9. **OneSignal integration** - onesignal-expo-plugin not installed

### What's Working

- ✅ `expo-calendar` installed (~15.0.7)
- ✅ `expo-notifications` installed (^0.32.13)
- ✅ `calendar-extract-destination/` Edge Function created
- ✅ `notifications-travel-alert/` Edge Function created
- ✅ `tripsStore.ts` created
- ✅ `useTrips` hook created
- ✅ Trips tab route exists

---

## Phase Navigation

| Previous | Current | Next |
|----------|---------|------|
| [Phase 3: Booking System](PHASE_3_BOOKING_SYSTEM.md) | **Phase 4: Intelligence** | [Phase 5: Polish & Launch](PHASE_5_POLISH_LAUNCH.md) |

**All Phases:**
- [Phase 1: Foundation](PHASE_1_FOUNDATION.md)
- [Phase 2: Core Features](PHASE_2_CORE_FEATURES.md)
- [Phase 3: Booking System](PHASE_3_BOOKING_SYSTEM.md)
- **Phase 4: Intelligence** (Current)
- [Phase 5: Polish & Launch](PHASE_5_POLISH_LAUNCH.md)
- [Phase 6: Data Pipeline](PHASE_6_DATA_PIPELINE.md)
- [Phase 7: Partner Portal](PHASE_7_PARTNER_PORTAL.md)
- [Phase 8: Admin Portal](PHASE_8_ADMIN_PORTAL.md)

---

## Overview

Phase 4 implements Scout's "intelligence" layer - the features that make it proactively helpful rather than just reactive. This includes calendar integration to detect upcoming travel, the dedicated Trips tab for managing travel-related gym discovery, and push notifications to alert users before their trips.

### Goals

1. iOS Calendar (EventKit) integration via expo-calendar
2. Google Calendar API integration
3. On-device travel detection algorithm
4. Gemini-powered destination extraction
5. Full Trips tab implementation
6. OneSignal push notification integration
7. Proactive travel alert notifications

### Prerequisites (from Phase 3)

- ✅ Complete booking flow working
- ✅ QR passes functional
- ✅ User authentication with profile
- ✅ Gym discovery and search

### Privacy First Approach

Calendar data is sensitive. Scout's approach:
- **On-device analysis first** - Travel scoring happens locally
- **Minimal data extraction** - Only send destination + dates to server
- **No event content stored** - We don't save meeting titles, attendees, etc.
- **User control** - Clear permissions, easy to disconnect

> **Note:** Android development is deferred to post-launch. All Android-specific items are marked accordingly.

---

## Week 10: Calendar, Trips & Notifications

### 10.1 Calendar Permission & Setup

- [ ] Install `expo-calendar`
- [ ] Design permission request screen:
  ```
  📅 Connect Your Calendar

  Scout can detect your upcoming trips and
  recommend gyms before you travel.

  We analyze calendars on-device. We only
  save trip destinations and dates - never
  your event details.

  [Connect Calendar]    [Not Now]
  ```
- [ ] Request calendar read permission
- [ ] Handle permission denied gracefully
- [ ] Allow selective calendar access (work, personal, etc.)

### 10.2 iOS EventKit Integration

- [ ] Implement calendar source listing:
  ```typescript
  const calendars = await Calendar.getCalendarsAsync(
    Calendar.EntityTypes.EVENT
  );
  ```
- [ ] Fetch events for next 60 days:
  ```typescript
  const events = await Calendar.getEventsAsync(
    calendarIds,
    startDate,
    endDate
  );
  ```
- [ ] Handle multiple calendars (iCloud, Exchange, etc.)
- [ ] Set up background refresh (check every 12-24 hours)

### 10.3 Google Calendar API Integration

- [ ] Set up Google Calendar API in Cloud Console
- [ ] Implement OAuth flow for Calendar scope
- [ ] Fetch events from Google Calendar API:
  ```typescript
  const response = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        singleEvents: true,
      },
    }
  );
  ```
- [ ] Handle token refresh
- [ ] Support multiple Google accounts

### 10.4 On-Device Travel Detection Algorithm

- [ ] Implement scoring algorithm (runs locally):
  ```typescript
  interface TravelScore {
    score: number; // 0.0 - 1.0
    signals: {
      keywords: number;      // 35% weight
      location: number;      // 30% weight
      multiDay: number;      // 20% weight
      allDay: number;        // 10% weight
      busyStatus: number;    // 5% weight
    };
  }

  const TRAVEL_KEYWORDS = [
    'flight', 'hotel', 'airbnb', 'trip', 'travel',
    'vacation', 'conference', 'OOO', 'out of office',
    'visiting', 'airport'
  ];

  const AIRPORT_CODES = ['JFK', 'LAX', 'MIA', 'TPA', ...];
  ```
- [ ] Score each event:
  - [ ] Check title/notes for travel keywords
  - [ ] Check location field for cities/airports
  - [ ] Check duration (multi-day = higher score)
  - [ ] Check if all-day event
  - [ ] Check busy/OOO status
- [ ] Group consecutive travel events
- [ ] Threshold: score >= 0.5 = likely travel

### 10.5 Destination Extraction (Gemini)

- [ ] Create `supabase/functions/calendar-extract-destination/index.ts`
- [ ] Send minimal data to Gemini:
  ```typescript
  const DESTINATION_PROMPT = `
  Extract travel destination from this calendar event.

  Event title: "${title}"
  Event location: "${location}"
  Event dates: ${startDate} to ${endDate}

  If this appears to be travel, extract:
  {
    "is_travel": true,
    "destination": {
      "city": string,
      "state": string,
      "country": string
    },
    "confidence": 0.0-1.0
  }

  If not travel:
  { "is_travel": false, "confidence": 0.0-1.0 }
  `;
  ```
- [ ] Geocode destination for coordinates
- [ ] Handle ambiguous destinations
- [ ] Cache extraction results

### 10.6 Travel Period Storage

- [ ] Save detected trips to `travel_periods` table:
  ```typescript
  const travelPeriod = {
    user_id: userId,
    destination_city: 'Miami',
    destination_state: 'FL',
    destination_country: 'US',
    destination_lat: 25.7617,
    destination_lng: -80.1918,
    start_date: '2025-12-05',
    end_date: '2025-12-08',
    confidence_score: 0.85,
    source: 'ios_calendar',
    source_event_id: calendarEventId,
  };
  ```
- [ ] Avoid duplicate trips (check existing)
- [ ] Update trips if dates change in calendar

### 10.7 Trips Tab UI

- [ ] Create `app/(tabs)/trips.tsx` full implementation
- [ ] Sections:
  - [ ] **Upcoming Trips** - Detected and manual trips
  - [ ] **Past Trips** - Completed trips with visit history
- [ ] TripCard component:
  ```typescript
  interface TripCardProps {
    destination: { city: string; state: string };
    dates: { start: Date; end: Date };
    source: 'calendar_detected' | 'manual';
    gymCount: number;
    onBrowse: () => void;
    onDismiss: () => void;
  }
  ```
- [ ] Card shows:
  - [ ] ✈️ destination icon
  - [ ] City, State
  - [ ] Date range
  - [ ] "Detected from calendar" or "Added manually"
  - [ ] "X gyms found near your destination"
  - [ ] [Browse] and [Dismiss] buttons

### 10.8 Trip → Explore Integration

- [ ] Tapping "Browse" on TripCard:
  1. Navigate to Explore tab
  2. Pre-fill search location with destination
  3. Show gyms near destination
  4. Optionally pre-filter by trip dates (opening hours)
- [ ] Add "For your Miami trip" context banner
- [ ] Remember trip context during session

### 10.9 Manual Trip Creation

- [ ] Create "Add Trip Manually" button
- [ ] Trip creation form:
  - [ ] Destination city search (Google Places autocomplete)
  - [ ] Start date picker
  - [ ] End date picker
  - [ ] Optional: Hotel/Airbnb address
- [ ] Save as `source: 'manual'`
- [ ] Search gyms for new trip

### 10.10 Trip Dismissal

- [ ] Allow users to dismiss incorrect detections
- [ ] Store dismissal (don't re-detect same event)
- [ ] Improve algorithm feedback:
  ```typescript
  // Track false positives for model improvement
  const dismissal = {
    travel_period_id: id,
    dismissed_at: timestamp,
    source_event_id: eventId,
  };
  ```

### 10.11 OneSignal Setup

- [ ] Create OneSignal account and app
- [ ] Install `onesignal-expo-plugin`
- [ ] Configure in `app.json`:
  ```json
  {
    "plugins": [
      ["onesignal-expo-plugin", {
        "mode": "development"
      }]
    ]
  }
  ```
- [ ] Initialize OneSignal in app:
  ```typescript
  import OneSignal from 'react-native-onesignal';

  OneSignal.setAppId(ONESIGNAL_APP_ID);
  OneSignal.setExternalUserId(supabaseUserId);
  ```
- [ ] Request notification permissions
- [ ] Handle notification tap (deep link to Trips tab)

### 10.12 Travel Alert Notifications

- [ ] Create `supabase/functions/notifications-travel-alert/index.ts`
- [ ] Schedule notifications:
  - [ ] **7 days before** - "You're traveling to Miami in a week! 🏋️"
  - [ ] **1 day before** - "Arriving in Miami tomorrow. Book a gym now!"
- [ ] Notification content:
  ```typescript
  const notification = {
    headings: { en: "Miami Trip Coming Up! 🏋️" },
    contents: {
      en: "12 gyms found near your hotel. Browse and book ahead?"
    },
    data: {
      type: 'travel_alert',
      travel_period_id: id,
      destination: 'Miami, FL',
    },
  };
  ```
- [ ] Track notification sent status (don't re-send)
- [ ] Respect user notification preferences

### 10.13 Booking Reminder Notifications

- [ ] Create booking reminder notification:
  - [ ] **Day before** - "Your gym pass is ready for tomorrow!"
  - [ ] **Morning of** - "Your pass at Iron Temple is active today"
- [ ] Include:
  - [ ] Gym name
  - [ ] Check-in time/hours
  - [ ] Quick action: "View Pass"

### 10.14 Notification Preferences

- [ ] Add to Profile tab settings:
  ```
  Notifications
  ├─ Travel Alerts         [ON]
  ├─ Booking Reminders     [ON]
  └─ Promotions            [OFF]
  ```
- [ ] Store preferences in `users.preferences` JSON
- [ ] Respect preferences when sending

### 10.15 Background Calendar Sync

- [ ] Implement background refresh:
  ```typescript
  // Run every 12-24 hours
  TaskManager.defineTask(CALENDAR_SYNC_TASK, async () => {
    const events = await fetchCalendarEvents();
    const trips = detectTravelPeriods(events);
    await syncTripsToServer(trips);
    return BackgroundFetch.Result.NewData;
  });
  ```
- [ ] Handle app foregrounding (immediate sync)
- [ ] Show "Last synced" timestamp in settings

---

## Technical Specifications

### New Components (Phase 4)

```
components/
├── trips/
│   ├── TripCard.tsx              # Trip display card
│   ├── AddTripButton.tsx         # Manual trip creation
│   ├── TripGymList.tsx           # Gyms for a trip
│   └── CalendarPermission.tsx    # Permission request UI
└── notifications/
    └── NotificationHandler.tsx   # Deep link handling
```

### New Edge Functions

```
supabase/functions/
├── calendar-extract-destination/ # Gemini destination extraction
├── notifications-travel-alert/   # Send travel notifications
└── notifications-booking-reminder/ # Send booking reminders
```

### New Stores

```
stores/
└── tripsStore.ts                 # Detected/manual trips
```

### New Hooks

```
hooks/
├── useTravelDetection.ts         # Calendar analysis
├── useCalendarSync.ts            # Calendar integration
└── useNotifications.ts           # OneSignal integration
```

### New Services

```
services/
├── calendar/
│   ├── eventKit.ts               # iOS calendar
│   └── googleCalendar.ts         # Google Calendar API
└── notifications/
    └── oneSignal.ts              # Push notification client
```

---

## Travel Detection Algorithm

### Scoring Weights

| Signal | Weight | Description |
|--------|--------|-------------|
| Keywords | 35% | Travel-related words in title/notes |
| Location | 30% | City names, airport codes, hotel mentions |
| Multi-day | 20% | Events spanning 2+ days |
| All-day | 10% | All-day events correlate with travel |
| Busy/OOO | 5% | Calendar availability status |

### Example Scores

| Event | Keywords | Location | Multi-day | All-day | Busy | Total | Travel? |
|-------|----------|----------|-----------|---------|------|-------|---------|
| "Flight to MIA" | 35% | 30% | 0% | 0% | 0% | **65%** | ✅ |
| "Miami Conference" | 0% | 30% | 20% | 10% | 5% | **65%** | ✅ |
| "Team Meeting" | 0% | 0% | 0% | 0% | 5% | **5%** | ❌ |
| "Vacation - Hawaii" | 35% | 30% | 20% | 10% | 5% | **100%** | ✅ |

---

## Acceptance Criteria

### Must Have (P0)
- [ ] Calendar permission request is clear and user-friendly
- [ ] Travel detection identifies >80% of actual trips
- [ ] Trips tab shows detected trips with gym counts
- [ ] "Browse" navigates to Explore with destination pre-filled
- [ ] Push notifications deliver correctly
- [ ] User can dismiss false positive trips

### Should Have (P1)
- [ ] Google Calendar integration works
- [ ] Manual trip creation works
- [ ] Background calendar sync runs
- [ ] Notification preferences are respected
- [ ] Past trips show visit history

### Nice to Have (P2)
- [ ] Trip edit functionality
- [ ] Multiple destination trips
- [ ] Suggested gyms in notification

---

## Privacy & Security

### Data Minimization
- [ ] Only extract: destination, dates, confidence
- [ ] Never store: event titles, attendees, full notes
- [ ] Never access: email, contacts, other calendars

### User Control
- [ ] Clear explanation of data usage
- [ ] Easy calendar disconnect
- [ ] Delete trip data on request
- [ ] Notification opt-out

### Transparency
- [ ] Show "Detected from calendar" source
- [ ] Link to privacy policy from permission screen
- [ ] Settings show connected calendars

---

## Completion Summary

> *To be filled in upon phase completion*

### Completion Date
*Not yet completed*

### Final Status
*Pending*

### Deliverables Completed
- [ ] iOS Calendar integration
- [ ] Google Calendar integration
- [ ] Travel detection algorithm
- [ ] Trips tab UI
- [ ] Manual trip creation
- [ ] OneSignal notifications
- [ ] Travel alerts

### Metrics
| Metric | Target | Actual |
|--------|--------|--------|
| Travel detection accuracy | >80% | — |
| Notification delivery rate | >95% | — |
| Calendar sync latency | <5s | — |

---

## Carryover Items

> *Items deferred from this phase*

| Item | Moved To | Reason |
|------|----------|--------|
| TalkBack testing (Android) | Post-Launch | iOS-first approach |

---

## Change Log

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| November 25, 2025 | 1.0.0 | Initial phase document created | — |

---

*Reference: [Complete Technical Blueprint](../Scout_Fitness_App_Complete_Technical_Blueprint_November_2025-2.md) - Sections 4, 5, 8 (F3)*
