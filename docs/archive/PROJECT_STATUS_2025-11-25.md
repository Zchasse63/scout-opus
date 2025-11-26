# Scout Fitness App - Project Status Dashboard

> Master tracking document for the complete Scout Fitness platform

---

## Quick Links

| Document | Description |
|----------|-------------|
| [Phase 1: Foundation](PHASE_1_FOUNDATION.md) | Project setup, auth, navigation |
| [Phase 2: Core Features](PHASE_2_CORE_FEATURES.md) | Voice search, maps, discovery |
| [Phase 3: Booking System](PHASE_3_BOOKING_SYSTEM.md) | Payments, QR passes |
| [Phase 4: Intelligence](PHASE_4_INTELLIGENCE.md) | Calendar, trips, notifications |
| [Phase 5: Polish & Launch](PHASE_5_POLISH_LAUNCH.md) | Testing, App Store |
| [Phase 6: Data Pipeline](PHASE_6_DATA_PIPELINE.md) | Scraping, verification, UGC |
| [Phase 7: Partner Portal](PHASE_7_PARTNER_PORTAL.md) | Gym owner web app |
| [Phase 8: Admin Portal](PHASE_8_ADMIN_PORTAL.md) | Internal admin web app |
| [Completion Audit](PHASE_COMPLETION_AUDIT.md) | Detailed task-level tracking |
| [Technical Blueprint](Scout_Fitness_App_Complete_Technical_Blueprint_November_2025-2.md) | Full technical specification |
| [Data Strategy](# Scout Data Strategy and Pipeline Speci.md) | Data pipeline specification |
| [Partner Portals Spec](# Scout Partner Admin Portals Spec.md) | Portal requirements |
| [Future Plans](# Scout Fitness App: Future Plans & Road.md) | Post-MVP roadmap |

---

## Project Overview

| Field | Value |
|-------|-------|
| **Project** | Scout Fitness App |
| **Type** | Travel-focused fitness discovery & booking platform |
| **Platforms** | iOS (MVP), Android (Post-Launch), Web |
| **Status** | In Development |
| **Last Updated** | November 25, 2025 |

---

## Overall Progress

```
Phase 1 [████████████░░░░░░░░] 60%  Foundation
Phase 2 [████████░░░░░░░░░░░░] 40%  Core Features
Phase 3 [█████░░░░░░░░░░░░░░░] 25%  Booking System
Phase 4 [████░░░░░░░░░░░░░░░░] 20%  Intelligence
Phase 5 [█░░░░░░░░░░░░░░░░░░░]  5%  Polish & Launch
Phase 6 [░░░░░░░░░░░░░░░░░░░░]  0%  Data Pipeline
Phase 7 [░░░░░░░░░░░░░░░░░░░░]  0%  Partner Portal
Phase 8 [░░░░░░░░░░░░░░░░░░░░]  0%  Admin Portal
────────────────────────────────────────────────────
MVP Total (1-5):     30%
Full Platform (1-8): 19%
```

---

## Phase Summary

| Phase | Name | Timeline | Status | Completion | Blockers |
|-------|------|----------|--------|------------|----------|
| 1 | Foundation | Weeks 1-3 | In Progress | 60% | UI components, EAS config |
| 2 | Core Features | Weeks 4-7 | In Progress | 40% | Voice UI, search store |
| 3 | Booking System | Weeks 8-9 | In Progress | 25% | Checkout components |
| 4 | Intelligence | Week 10 | In Progress | 20% | Trip components, OneSignal |
| 5 | Polish & Launch | Weeks 11-12 | Not Started | 5% | Phases 1-4 completion |
| 6 | Data Pipeline | Weeks 13-15 | Not Started | 0% | MVP launch |
| 7 | Partner Portal | Weeks 16-18 | Not Started | 0% | MVP launch |
| 8 | Admin Portal | Weeks 19-20 | Not Started | 0% | Partner Portal |

---

## MVP Critical Path

The following items are **blocking launch** and must be completed first:

### Phase 1 Blockers (Must fix first)

| Item | Type | Impact |
|------|------|--------|
| `components/ui/Button.tsx` | Component | Used everywhere |
| `components/ui/Card.tsx` | Component | Gym cards, pass cards |
| `components/ui/Badge.tsx` | Component | Verified badges, status |
| `components/ui/Skeleton.tsx` | Component | Loading states |
| `components/ui/EmptyState.tsx` | Component | Empty list states |
| `stores/themeStore.ts` | Store | Dark mode support |
| Tab icons (lucide) | UI Fix | Replace emoji with icons |
| EAS configuration | Config | Build and deploy |
| `.env.example` | Config | Developer onboarding |

### Phase 2 Blockers

| Item | Type | Impact |
|------|------|--------|
| `VoiceRecordingView.tsx` | Component | Core voice feature |
| `AudioWaveform.tsx` | Component | Voice feedback |
| `GymPreviewSheet.tsx` | Component | Map UX |
| `searchStore.ts` | Store | Search state |
| `voice-transcribe/` | Edge Function | Whisper fallback |

### Phase 3 Blockers

| Item | Type | Impact |
|------|------|--------|
| `CheckoutForm.tsx` | Component | Payment flow |
| `PassTypeSelector.tsx` | Component | Pass selection |
| `QRPass.tsx` | Component | Pass display |
| `WaiverModal.tsx` | Component | Legal requirement |
| `payments-webhook/` | Edge Function | Payment confirmation |

### Phase 4 Blockers

| Item | Type | Impact |
|------|------|--------|
| `CalendarPermission.tsx` | Component | Permission flow |
| `TripCard.tsx` | Component | Trips tab |
| OneSignal integration | Service | Push notifications |

### Phase 5 Blockers

| Item | Type | Impact |
|------|------|--------|
| Unit tests (60% coverage) | Testing | Quality assurance |
| E2E tests | Testing | Critical paths |
| App Store assets | Assets | Submission |
| Security audit | Review | Launch requirement |

---

## Estimated Timeline to Launch

| Milestone | Estimated Completion |
|-----------|---------------------|
| Phase 1 complete | +1 week |
| Phase 2 complete | +2 weeks |
| Phase 3 complete | +2 weeks |
| Phase 4 complete | +1 week |
| Phase 5 complete | +2 weeks |
| **MVP Launch** | **~8 weeks from now** |
| Phase 6 complete | +3 weeks post-launch |
| Phase 7 complete | +3 weeks |
| Phase 8 complete | +2 weeks |
| **Full Platform** | **~16 weeks from now** |

---

## Technology Stack Summary

### Mobile App (Phases 1-5)

| Category | Technology |
|----------|------------|
| Framework | Expo SDK 54 + React Native 0.81 |
| Navigation | Expo Router v4 |
| State | Zustand v5 + TanStack Query v5 |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| Payments | Stripe Connect |
| AI | Gemini 2.5 Flash |
| Voice | Apple SpeechAnalyzer + Whisper |
| Maps | React Native Maps + Google Places API |

### Web Apps (Phases 7-8)

| Category | Technology |
|----------|------------|
| Framework | React 18 + Vite |
| Routing | React Router v6 |
| Styling | Tailwind CSS |
| UI | Radix UI |
| Charts | Recharts |
| Auth | Supabase + MFA |

---

## Budget Projections (Monthly)

| Service | MVP Phase | At Scale (100K users) |
|---------|-----------|----------------------|
| Supabase Pro | $25 | $25 |
| Google Places API | $500 | $15,000 |
| Gemini API | $50 | $800 |
| Whisper API | $50 | $500 |
| Firecrawl | $19 | $99 |
| OneSignal | $0 | $99 |
| Vercel (Portals) | $0 | $20 |
| **Total** | **~$650/mo** | **~$16,500/mo** |

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Voice search latency | Medium | High | On-device processing with fallback |
| Partner onboarding friction | Medium | High | Simple Stripe Express flow |
| Data quality at launch | Medium | Medium | Focus on Tampa/Miami only |
| App Store rejection | Low | High | Follow guidelines, clear documentation |
| Scope creep | High | Medium | Strict MVP definition |
| Key dependency failure | Low | High | Fallback options for all services |

---

## Team Responsibilities

| Area | Owner | Backup |
|------|-------|--------|
| Mobile App Development | TBD | TBD |
| Backend/Edge Functions | TBD | TBD |
| Partner Portal | TBD | TBD |
| Admin Portal | TBD | TBD |
| Design | TBD | TBD |
| QA/Testing | TBD | TBD |
| Partner Recruitment | TBD | TBD |

---

## Key Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| Nov 25, 2025 | Defer Android to post-launch | Focus resources on iOS quality |
| Nov 25, 2025 | Use Firecrawl for scraping | Better than custom scrapers |
| Nov 25, 2025 | 8-phase structure | Clear separation of MVP vs platform |
| Nov 25, 2025 | 15% platform commission | Competitive with ClassPass 20-30% |

---

## Next Actions (Priority Order)

### Immediate (This Week)

1. [ ] Create `components/ui/` directory with all base components
2. [ ] Replace emoji tab icons with lucide-react-native
3. [ ] Configure EAS builds (`eas build:configure`)
4. [ ] Create `.env.example` file

### Short-term (Next 2 Weeks)

1. [ ] Complete Phase 1 remaining items
2. [ ] Build VoiceRecordingView and AudioWaveform
3. [ ] Create searchStore for unified search state
4. [ ] Build GymPreviewSheet for map interactions

### Medium-term (Next 4 Weeks)

1. [ ] Complete Phase 2 voice and discovery features
2. [ ] Build complete checkout flow (Phase 3)
3. [ ] Implement QR code pass system
4. [ ] Set up OneSignal for notifications

---

## How to Update This Document

1. When completing a task, update the relevant Phase document
2. Update the completion percentage in the Phase Summary table
3. Remove completed items from the Critical Path section
4. Update the progress bars at the top
5. Add any new decisions to the Decisions Log
6. Update the Last Updated date

---

## Change Log

| Date | Changes | Author |
|------|---------|--------|
| November 25, 2025 | Initial project status dashboard created | Claude |

---

*This document should be reviewed and updated weekly during active development.*
