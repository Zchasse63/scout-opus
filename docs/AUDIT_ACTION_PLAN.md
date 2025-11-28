# Scout App - Audit Action Plan

**Generated:** 2025-11-27  
**Source:** docs/Project Audit.md  
**Overall Health Score:** 7/10

---

## Table of Contents

1. [Critical Issues](#1-critical-issues)
2. [High Priority Issues](#2-high-priority-issues)
3. [Medium Priority Issues](#3-medium-priority-issues)
4. [Low Priority Issues](#4-low-priority-issues)
5. [Orphaned & Dead Code Remediation](#5-orphaned--dead-code-remediation)
6. [Best Practice Violations Remediation](#6-best-practice-violations-remediation)
7. [Architecture Improvements](#7-architecture-improvements)
8. [Implementation Timeline](#8-implementation-timeline)

---

## 1. Critical Issues

### TASK-001: Implement Travel Alert Scheduler
| Field | Value |
|-------|-------|
| **Priority** | 🔴 CRITICAL |
| **Source** | Issue #1 |
| **Location** | `supabase/functions/notifications-travel-alert/` |
| **Effort** | Medium (4-8 hours) |
| **Dependencies** | None |
| **Owner** | TBD |

**Description:**  
Travel alert notifications require a scheduler to scan `travel_periods` table daily. Currently, the Edge Function exists but is never called, meaning users never receive 7-day or 1-day trip reminders.

**Current Behavior:**  
Edge Function exists but is never triggered.

**Expected Behavior:**  
Daily cron job triggers alerts for all users with upcoming trips at 7-day and 1-day intervals.

**Recommended Fix:**
1. Option A: Add Supabase pg_cron extension with daily job
2. Option B: Use external scheduler (Vercel Cron, GitHub Actions, etc.)
3. Create SQL function to query upcoming trips
4. Schedule daily trigger at appropriate time (e.g., 9 AM user timezone)

**Implementation Steps:**
```sql
-- Example pg_cron setup
SELECT cron.schedule(
  'travel-alerts-daily',
  '0 9 * * *',  -- 9 AM daily
  $$SELECT net.http_post(
    url := 'https://[project].supabase.co/functions/v1/notifications-travel-alert',
    headers := '{"Authorization": "Bearer [service_role_key]"}'::jsonb
  )$$
);
```

**Acceptance Criteria:**
- [ ] Scheduler configured and running
- [ ] Users receive notification 7 days before trip
- [ ] Users receive notification 1 day before trip
- [ ] Notifications not sent multiple times (deduplication via `sent_alerts` table)
- [ ] Logs show successful daily execution

---

## 2. High Priority Issues

### TASK-002: Add JWT Authentication to Edge Functions
| Field | Value |
|-------|-------|
| **Priority** | 🟠 HIGH |
| **Source** | Issue #2 |
| **Location** | 8 Edge Functions (see below) |
| **Effort** | Low (2-4 hours) |
| **Dependencies** | None |
| **Owner** | TBD |

**Affected Functions:**
- `voice-process-query`
- `gym-personalize`
- `notifications-travel-alert`
- `send-push`
- `send-email`
- `notify-admin`
- `calendar-extract-destination`
- `firecrawl-scrape`

**Current Behavior:**  
These endpoints accept any request without authentication.

**Expected Behavior:**  
All endpoints require valid Supabase JWT token.

**Implementation Steps:**
1. Create shared auth middleware function
2. Add JWT validation to each function's entry point
3. Return 401 Unauthorized for invalid/missing tokens
4. Test each endpoint with valid and invalid tokens

**Code Template:**
```typescript
// Add to each Edge Function
const authHeader = req.headers.get('Authorization');
if (!authHeader?.startsWith('Bearer ')) {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
}
const token = authHeader.replace('Bearer ', '');
const { data: { user }, error } = await supabase.auth.getUser(token);
if (error || !user) {
  return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
}
```

**Acceptance Criteria:**
- [ ] All 8 functions validate JWT
- [ ] 401 returned for missing/invalid tokens
- [ ] Existing functionality preserved
- [ ] Frontend continues working (tokens already sent)

---

### TASK-003: Add Tally Webhook Signature Verification
| Field | Value |
|-------|-------|
| **Priority** | 🟠 HIGH |
| **Source** | Issue #3 |
| **Location** | `supabase/functions/tally-webhook/index.ts` |
| **Effort** | Low (1-2 hours) |
| **Dependencies** | None |
| **Owner** | TBD |

**Current Behavior:**  
All POST requests accepted without verification.

**Expected Behavior:**  
Verify Tally webhook signature before processing.

**Implementation Steps:**
1. Get Tally webhook signing secret from dashboard
2. Add secret to Supabase Edge Function secrets
3. Implement HMAC signature verification
4. Return 400 for invalid signatures

**Acceptance Criteria:**
- [ ] Webhook signature verified on each request
- [ ] Invalid signatures rejected with 400
- [ ] Valid Tally submissions processed normally
- [ ] Secret stored securely in environment

---

### TASK-004: Consolidate Push Notification Systems
| Field | Value |
|-------|-------|
| **Priority** | 🟠 HIGH |
| **Source** | Issue #4 |
| **Location** | `send-push/`, `notifications-travel-alert/` |
| **Effort** | Medium (4-8 hours) |
| **Dependencies** | TASK-001 |
| **Owner** | TBD |

**Current Behavior:**  
- `send-push` uses Expo Push API
- `notifications-travel-alert` uses OneSignal

**Expected Behavior:**  
Single unified push notification system (recommend Expo Push for React Native).

**Implementation Steps:**
1. Audit all push notification use cases
2. Choose primary system (Expo Push recommended)
3. Migrate OneSignal calls to Expo Push
4. Remove OneSignal configuration and dependencies
5. Update environment variables

**Acceptance Criteria:**
- [ ] Single push notification service in use
- [ ] All notification types working
- [ ] OneSignal dependencies removed
- [ ] Documentation updated

---

## 3. Medium Priority Issues

### TASK-005: Create Shared Types Package
| Field | Value |
|-------|-------|
| **Priority** | 🟡 MEDIUM |
| **Source** | Issue #5 |
| **Location** | `types/index.ts`, Edge Functions |
| **Effort** | Medium (4-8 hours) |
| **Dependencies** | None |
| **Owner** | TBD |

**Current Behavior:**
Type definitions duplicated between frontend and backend.

**Expected Behavior:**
Shared type package or generated types from Supabase schema.

**Implementation Steps:**
1. Install Supabase CLI type generation: `supabase gen types typescript`
2. Create `types/database.ts` with generated types
3. Update Edge Functions to import from shared types
4. Set up type generation in CI/CD pipeline

**Acceptance Criteria:**
- [ ] Types generated from Supabase schema
- [ ] Frontend and backend use same type definitions
- [ ] Type generation automated in CI

---

### TASK-006: Standardize Error Handling in Portals
| Field | Value |
|-------|-------|
| **Priority** | 🟡 MEDIUM |
| **Source** | Issue #6 |
| **Location** | `admin-portal/src/*`, `partner-portal/src/*` |
| **Effort** | Medium (4-6 hours) |
| **Dependencies** | None |
| **Owner** | TBD |

**Current Behavior:**
Inconsistent error handling patterns across components.

**Expected Behavior:**
Global error boundary and toast notification system.

**Implementation Steps:**
1. Install toast library (react-hot-toast or similar)
2. Create global ErrorBoundary component
3. Create useToast hook for consistent notifications
4. Wrap all API calls with error handling
5. Add toast notifications for success/error states

**Acceptance Criteria:**
- [ ] ErrorBoundary catches all unhandled errors
- [ ] Toast system shows success/error messages
- [ ] All API calls have consistent error handling
- [ ] User always sees feedback for actions

---

### TASK-007: Add Loading States to Gamification Store
| Field | Value |
|-------|-------|
| **Priority** | 🟡 MEDIUM |
| **Source** | Issue #7 |
| **Location** | `stores/gamificationStore.ts` |
| **Effort** | Low (1-2 hours) |
| **Dependencies** | None |
| **Owner** | TBD |

**Current Behavior:**
Database sync operations have no loading indicators.

**Expected Behavior:**
Loading states for all sync operations.

**Implementation Steps:**
1. Add `isLoading` and `isSyncing` state to store
2. Set loading state before async operations
3. Clear loading state in finally block
4. Update UI components to show loading state

**Acceptance Criteria:**
- [ ] `isLoading` state added to store
- [ ] All async operations set/clear loading state
- [ ] UI shows loading indicators during sync
- [ ] Error state also tracked

---

### TASK-008: Consolidate Reviews Tables
| Field | Value |
|-------|-------|
| **Priority** | 🟡 MEDIUM |
| **Source** | Issue #8 |
| **Location** | `supabase/migrations/` |
| **Effort** | Medium (4-6 hours) |
| **Dependencies** | None |
| **Owner** | TBD |

**Current Behavior:**
Both `reviews` and `gym_reviews` tables exist.

**Expected Behavior:**
Single canonical reviews table.

**Implementation Steps:**
1. Audit which table is used where
2. Migrate data from deprecated table to canonical
3. Update all code references
4. Create migration to drop deprecated table
5. Update RLS policies

**Acceptance Criteria:**
- [ ] Single reviews table in use
- [ ] All data migrated
- [ ] All code references updated
- [ ] Deprecated table dropped

---

## 4. Low Priority Issues

### TASK-009: Create API Documentation
| Field | Value |
|-------|-------|
| **Priority** | 🟢 LOW |
| **Source** | Issue #9 |
| **Location** | N/A (new documentation) |
| **Effort** | Medium (4-8 hours) |
| **Dependencies** | None |
| **Owner** | TBD |

**Current Behavior:**
No API documentation exists.

**Expected Behavior:**
OpenAPI/Swagger documentation for all Edge Functions.

**Implementation Steps:**
1. Create OpenAPI 3.0 spec file
2. Document each Edge Function endpoint
3. Include request/response schemas
4. Set up Swagger UI for viewing
5. Add to documentation site

**Acceptance Criteria:**
- [ ] OpenAPI spec covers all 18 Edge Functions
- [ ] Request/response schemas documented
- [ ] Swagger UI accessible
- [ ] Documentation kept up to date

---

### TASK-010: Improve Test Coverage
| Field | Value |
|-------|-------|
| **Priority** | 🟢 LOW |
| **Source** | Issue #10 |
| **Location** | `__tests__/` |
| **Effort** | High (16-40 hours) |
| **Dependencies** | None |
| **Owner** | TBD |

**Current Behavior:**
Only 3 test files exist (filter logic, auth store, booking store).

**Expected Behavior:**
Comprehensive test suite with unit and integration tests.

**Implementation Steps:**
1. Add unit tests for all hooks
2. Add unit tests for all stores
3. Add integration tests for critical flows
4. Mock external services (Stripe, Supabase)
5. Set up coverage reporting
6. Add tests to CI pipeline

**Priority Test Areas:**
- Payment flow (usePayment, payments-create-intent)
- Booking flow (useBookings, bookings-validate-qr)
- Auth flow (authStore, login/logout)
- Voice search (useVoiceSearch, voice-process-query)

**Acceptance Criteria:**
- [ ] >70% code coverage
- [ ] Critical flows have integration tests
- [ ] External services properly mocked
- [ ] Tests run in CI on every PR

---

### TASK-011: Add Rate Limiting to Edge Functions
| Field | Value |
|-------|-------|
| **Priority** | 🟢 LOW |
| **Source** | Issue #11 |
| **Location** | All Edge Functions |
| **Effort** | Medium (4-6 hours) |
| **Dependencies** | TASK-002 (auth first) |
| **Owner** | TBD |

**Current Behavior:**
No rate limiting on any endpoint.

**Expected Behavior:**
Rate limiting per user/IP, especially on AI-powered endpoints.

**Implementation Steps:**
1. Choose rate limiting strategy (Redis, Supabase, Upstash)
2. Create rate limiting middleware
3. Apply stricter limits to AI endpoints (Gemini, OpenAI)
4. Return 429 Too Many Requests when exceeded
5. Add rate limit headers to responses

**Suggested Limits:**
| Endpoint | Rate Limit |
|----------|------------|
| AI endpoints (gym-personalize, voice-process-query) | 10/min |
| Search endpoints (places-*) | 30/min |
| Other endpoints | 60/min |

**Acceptance Criteria:**
- [ ] Rate limiting middleware implemented
- [ ] AI endpoints have strict limits
- [ ] 429 returned when limit exceeded
- [ ] Rate limit headers in responses

---

## 5. Orphaned & Dead Code Remediation

### TASK-012: Remove voice-transcribe Edge Function
| Field | Value |
|-------|-------|
| **Priority** | 🟢 LOW |
| **Source** | Section 12 - Backend Endpoints with No Consumers |
| **Location** | `supabase/functions/voice-transcribe/` |
| **Effort** | Low (30 min) |
| **Dependencies** | None |
| **Owner** | TBD |

**Decision:** REMOVE

**Rationale:**
Native iOS speech recognition is used instead. OpenAI Whisper integration is unused and incurs unnecessary costs if accidentally called.

**Implementation Steps:**
1. Verify no frontend code calls this endpoint
2. Remove `supabase/functions/voice-transcribe/` directory
3. Remove OPENAI_API_KEY from environment if not used elsewhere
4. Update documentation

**Acceptance Criteria:**
- [ ] Edge Function directory removed
- [ ] No references in codebase
- [ ] Environment variables cleaned up

---

### TASK-013: Investigate firecrawl-scrape Usage
| Field | Value |
|-------|-------|
| **Priority** | 🟢 LOW |
| **Source** | Section 12 - Backend Endpoints with No Consumers |
| **Location** | `supabase/functions/firecrawl-scrape/` |
| **Effort** | Low (1 hour) |
| **Dependencies** | None |
| **Owner** | TBD |

**Decision:** INVESTIGATE → then REMOVE or DOCUMENT

**Rationale:**
No frontend calls found. May be for admin/future use.

**Implementation Steps:**
1. Check if used in admin portal or partner portal
2. Check for any scheduled jobs or manual triggers
3. If unused: Remove endpoint and FIRECRAWL_API_KEY
4. If planned: Document intended use case

**Acceptance Criteria:**
- [ ] Usage determined
- [ ] Either removed or documented with use case

---

### TASK-014: Investigate passes Table
| Field | Value |
|-------|-------|
| **Priority** | 🟢 LOW |
| **Source** | Section 12 - Unused Database Tables |
| **Location** | Database: `passes` table |
| **Effort** | Low (1 hour) |
| **Dependencies** | None |
| **Owner** | TBD |

**Decision:** INVESTIGATE → then REMOVE or INTEGRATE

**Rationale:**
No code references found. Possibly legacy or planned feature.

**Implementation Steps:**
1. Check if table has any data
2. Review migration file for original intent
3. If empty and unused: Create migration to drop table
4. If has data or planned: Document purpose

**Acceptance Criteria:**
- [ ] Table purpose determined
- [ ] Either dropped or integrated into app

---

### TASK-015: Consolidate gym_reviews into reviews
| Field | Value |
|-------|-------|
| **Priority** | 🟡 MEDIUM |
| **Source** | Section 12 - Unused Database Tables |
| **Location** | Database: `gym_reviews`, `reviews` tables |
| **Effort** | Medium (4-6 hours) |
| **Dependencies** | None |
| **Owner** | TBD |

**Decision:** CONSOLIDATE into `reviews` table

**Rationale:**
Two review tables cause confusion and data fragmentation.

**Implementation Steps:**
1. Compare schemas of both tables
2. Determine which has more/better data
3. Create data migration to merge
4. Update all code references (gym-page uses gym_reviews)
5. Create migration to drop gym_reviews
6. Update RLS policies

**Acceptance Criteria:**
- [ ] All review data in single table
- [ ] gym-page updated to use reviews table
- [ ] gym_reviews table dropped
- [ ] No data loss verified

---

## 6. Best Practice Violations Remediation

### TASK-016: Add Schema Validation to Edge Functions
| Field | Value |
|-------|-------|
| **Priority** | 🟡 MEDIUM |
| **Source** | Section 13 - Input Validation |
| **Location** | All Edge Functions |
| **Effort** | Medium (4-6 hours) |
| **Dependencies** | None |
| **Owner** | TBD |

**Current Issue:**
Edge Functions have basic required field checks only, no schema validation library.

**Implementation Steps:**
1. Install Zod in Edge Functions
2. Create schema definitions for each endpoint
3. Validate request body against schema
4. Return detailed validation errors

**Example:**
```typescript
import { z } from 'zod';

const PaymentIntentSchema = z.object({
  gymId: z.string().uuid(),
  passType: z.enum(['day', 'week', 'month']),
  amount: z.number().positive(),
  bookingDate: z.string().datetime(),
});

// In handler
const result = PaymentIntentSchema.safeParse(body);
if (!result.success) {
  return new Response(JSON.stringify({ errors: result.error.issues }), { status: 400 });
}
```

**Acceptance Criteria:**
- [ ] Zod installed in Edge Functions
- [ ] All endpoints have request schemas
- [ ] Detailed validation errors returned
- [ ] Type safety improved

---

### TASK-017: Add Pagination to Gym Search
| Field | Value |
|-------|-------|
| **Priority** | 🟡 MEDIUM |
| **Source** | Section 13 - Performance |
| **Location** | `supabase/functions/places-search/`, `hooks/useGymSearch.ts` |
| **Effort** | Medium (4-6 hours) |
| **Dependencies** | None |
| **Owner** | TBD |

**Current Issue:**
No pagination on gym search results.

**Implementation Steps:**
1. Add `page` and `pageSize` parameters to places-search
2. Implement cursor-based or offset pagination
3. Update useGymSearch hook to support pagination
4. Add "Load More" or infinite scroll to UI

**Acceptance Criteria:**
- [ ] Pagination parameters supported
- [ ] Large result sets paginated
- [ ] UI supports loading more results
- [ ] Performance improved for large areas

---

### TASK-018: Add CDN Caching for Gym Photos
| Field | Value |
|-------|-------|
| **Priority** | 🟢 LOW |
| **Source** | Section 13 - Performance |
| **Location** | `supabase/functions/places-photos/` |
| **Effort** | Medium (4-6 hours) |
| **Dependencies** | None |
| **Owner** | TBD |

**Current Issue:**
Photos proxied through Edge Function without caching.

**Implementation Steps:**
1. Add Cache-Control headers to response
2. Consider storing photos in Supabase Storage
3. Set up CDN (Cloudflare, Vercel Edge) for photo URLs
4. Implement cache invalidation strategy

**Acceptance Criteria:**
- [ ] Photos cached at edge
- [ ] Reduced Google Places API calls
- [ ] Faster photo loading for users

---

### TASK-019: Create Shared Utilities Package
| Field | Value |
|-------|-------|
| **Priority** | 🟢 LOW |
| **Source** | Section 13 - Code Organization |
| **Location** | New package |
| **Effort** | Medium (4-8 hours) |
| **Dependencies** | TASK-005 |
| **Owner** | TBD |

**Current Issue:**
No shared utilities between mobile app and web portals.

**Implementation Steps:**
1. Create `packages/shared/` directory
2. Move common utilities, constants, validators
3. Set up as internal package (npm workspace)
4. Import in mobile app and portals
5. Consider monorepo tooling (Turborepo, Nx)

**Acceptance Criteria:**
- [ ] Shared package created
- [ ] Common code extracted
- [ ] All projects using shared package

---

## 7. Architecture Improvements

### Immediate Improvements (1-2 days)

| Task ID | Task | Effort | Dependencies |
|---------|------|--------|--------------|
| TASK-002 | Add JWT auth to 8 Edge Functions | 2-4 hrs | None |
| TASK-003 | Add Tally webhook signature verification | 1-2 hrs | None |
| TASK-007 | Add loading states to gamificationStore | 1-2 hrs | None |
| TASK-012 | Remove unused voice-transcribe Edge Function | 30 min | None |

**Success Criteria:**
- All endpoints authenticated
- Webhook security improved
- UX feedback improved
- Dead code removed

---

### Short-term Improvements (1-2 weeks)

| Task ID | Task | Effort | Dependencies |
|---------|------|--------|--------------|
| TASK-001 | Implement travel alert scheduler | 4-8 hrs | None |
| TASK-004 | Consolidate push notification systems | 4-8 hrs | TASK-001 |
| TASK-016 | Add schema validation (Zod) to Edge Functions | 4-6 hrs | None |
| TASK-008/015 | Consolidate reviews/gym_reviews tables | 4-6 hrs | None |
| TASK-011 | Add rate limiting to Edge Functions | 4-6 hrs | TASK-002 |
| TASK-006 | Standardize error handling in portals | 4-6 hrs | None |

**Success Criteria:**
- Travel alerts working
- Single push system
- Input validation robust
- Database clean
- API abuse prevented
- Portal UX consistent

---

### Long-term Improvements (1+ months)

| Task ID | Task | Effort | Dependencies |
|---------|------|--------|--------------|
| TASK-005 | Create shared types package | 4-8 hrs | None |
| TASK-020 | Generate TypeScript types from Supabase | 2-4 hrs | TASK-005 |
| TASK-010 | Add comprehensive test coverage | 16-40 hrs | None |
| TASK-009 | Create OpenAPI documentation | 4-8 hrs | None |
| TASK-021 | Implement real-time subscriptions for bookings | 8-16 hrs | None |
| TASK-018 | Add CDN caching for gym photos | 4-6 hrs | None |
| TASK-022 | Unify patterns between mobile and portals | 16-24 hrs | TASK-019 |

---

### TASK-020: Generate TypeScript Types from Supabase
| Field | Value |
|-------|-------|
| **Priority** | 🟢 LOW |
| **Source** | Section 14 |
| **Location** | `types/` |
| **Effort** | Low (2-4 hours) |
| **Dependencies** | TASK-005 |
| **Owner** | TBD |

**Implementation Steps:**
1. Install Supabase CLI
2. Run `supabase gen types typescript --project-id <id>`
3. Add to npm scripts for automation
4. Set up CI to regenerate on schema changes

**Acceptance Criteria:**
- [ ] Types auto-generated from schema
- [ ] CI regenerates on migration changes
- [ ] All code uses generated types

---

### TASK-021: Implement Real-time Subscriptions
| Field | Value |
|-------|-------|
| **Priority** | 🟢 LOW |
| **Source** | Section 14 |
| **Location** | Hooks, stores |
| **Effort** | Medium-High (8-16 hours) |
| **Dependencies** | None |
| **Owner** | TBD |

**Implementation Steps:**
1. Create useRealtimeBookings hook
2. Subscribe to booking table changes
3. Update UI automatically on changes
4. Handle reconnection gracefully

**Acceptance Criteria:**
- [ ] Bookings update in real-time
- [ ] Partner portal sees new bookings instantly
- [ ] Reconnection handled gracefully

---

### TASK-022: Unify Mobile and Portal Patterns
| Field | Value |
|-------|-------|
| **Priority** | 🟢 LOW |
| **Source** | Section 14 |
| **Location** | All projects |
| **Effort** | High (16-24 hours) |
| **Dependencies** | TASK-019 |
| **Owner** | TBD |

**Implementation Steps:**
1. Document current patterns in each project
2. Define unified patterns for:
   - API calls (hooks vs direct calls)
   - Error handling
   - Loading states
   - Toast notifications
3. Create shared hooks package
4. Migrate portals to unified patterns

**Acceptance Criteria:**
- [ ] Patterns documented
- [ ] Shared hooks created
- [ ] Portals use consistent patterns
- [ ] Developer experience improved

---

## 8. Implementation Timeline

### Week 1: Immediate Fixes (Security & UX)

| Day | Tasks | Owner |
|-----|-------|-------|
| Day 1 | TASK-002: JWT auth for 8 Edge Functions | TBD |
| Day 1 | TASK-003: Tally webhook verification | TBD |
| Day 2 | TASK-007: Gamification loading states | TBD |
| Day 2 | TASK-012: Remove voice-transcribe | TBD |
| Day 2 | TASK-013: Investigate firecrawl-scrape | TBD |

**Week 1 Deliverables:**
- ✅ All Edge Functions authenticated
- ✅ Webhook security improved
- ✅ Dead code removed
- ✅ UX feedback improved

---

### Weeks 2-3: Short-term Improvements

| Week | Tasks | Owner |
|------|-------|-------|
| Week 2, Day 1-2 | TASK-001: Travel alert scheduler | TBD |
| Week 2, Day 3-4 | TASK-004: Consolidate push notifications | TBD |
| Week 2, Day 5 | TASK-011: Rate limiting | TBD |
| Week 3, Day 1-2 | TASK-016: Zod schema validation | TBD |
| Week 3, Day 3-4 | TASK-008/015: Consolidate reviews tables | TBD |
| Week 3, Day 5 | TASK-006: Portal error handling | TBD |

**Weeks 2-3 Deliverables:**
- ✅ Travel alerts working
- ✅ Single push notification system
- ✅ Rate limiting active
- ✅ Input validation robust
- ✅ Database cleaned up
- ✅ Portal UX consistent

---

### Month 2+: Long-term Improvements

| Sprint | Tasks | Owner |
|--------|-------|-------|
| Sprint 1 | TASK-005: Shared types package | TBD |
| Sprint 1 | TASK-020: Generate Supabase types | TBD |
| Sprint 2 | TASK-009: API documentation | TBD |
| Sprint 2 | TASK-018: CDN caching | TBD |
| Sprint 3-4 | TASK-010: Test coverage | TBD |
| Sprint 5 | TASK-021: Real-time subscriptions | TBD |
| Sprint 6 | TASK-019, TASK-022: Shared utilities & unified patterns | TBD |

**Month 2+ Deliverables:**
- ✅ Type safety across all layers
- ✅ API documentation complete
- ✅ Performance optimized
- ✅ Comprehensive test suite
- ✅ Real-time updates working
- ✅ Unified codebase patterns

---

## Summary

| Priority | Count | Total Effort |
|----------|-------|--------------|
| 🔴 Critical | 1 | 4-8 hours |
| 🟠 High | 3 | 7-14 hours |
| 🟡 Medium | 8 | 32-52 hours |
| 🟢 Low | 10 | 44-82 hours |
| **TOTAL** | **22** | **87-156 hours** |

**Estimated Timeline:**
- Week 1: Critical + High priority fixes
- Weeks 2-3: Medium priority improvements
- Month 2+: Low priority enhancements

---

*Last Updated: 2025-11-27*
*Source Document: docs/Project Audit.md*

