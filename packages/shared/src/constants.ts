/**
 * Shared constants across all Scout applications
 */

// Pass types
export const PASS_TYPES = ['day', 'week', 'month'] as const;
export type PassType = typeof PASS_TYPES[number];

// Booking statuses
export const BOOKING_STATUSES = ['confirmed', 'used', 'cancelled'] as const;
export type BookingStatus = typeof BOOKING_STATUSES[number];

// Ticket statuses
export const TICKET_STATUSES = ['open', 'in_progress', 'resolved', 'closed'] as const;
export type TicketStatus = typeof TICKET_STATUSES[number];

// Ticket priorities
export const TICKET_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;
export type TicketPriority = typeof TICKET_PRIORITIES[number];

// Partner application statuses
export const APPLICATION_STATUSES = ['pending', 'approved', 'rejected'] as const;
export type ApplicationStatus = typeof APPLICATION_STATUSES[number];

// Moderation statuses
export const MODERATION_STATUSES = ['pending', 'approved', 'rejected'] as const;
export type ModerationStatus = typeof MODERATION_STATUSES[number];

// Calendar sources
export const CALENDAR_SOURCES = ['ios_calendar', 'google_calendar', 'manual'] as const;
export type CalendarSource = typeof CALENDAR_SOURCES[number];

// Push notification types
export const PUSH_TYPES = [
  'booking_confirmed',
  'booking_reminder',
  'payment_received',
  'support_update',
  'travel_alert',
  'streak_reminder',
  'badge_earned',
] as const;
export type PushType = typeof PUSH_TYPES[number];

// Email types
export const EMAIL_TYPES = [
  'partner_approved',
  'partner_rejected',
  'booking_confirmed',
  'booking_cancelled',
  'refund_processed',
  'support_reply',
  'welcome',
] as const;
export type EmailType = typeof EMAIL_TYPES[number];

// Gamification levels
export const LEVELS = [
  { level: 1, title: 'Beginner', minPoints: 0 },
  { level: 2, title: 'Explorer', minPoints: 100 },
  { level: 3, title: 'Regular', minPoints: 300 },
  { level: 4, title: 'Enthusiast', minPoints: 600 },
  { level: 5, title: 'Champion', minPoints: 1000 },
  { level: 6, title: 'Legend', minPoints: 2000 },
] as const;

// Badge definitions
export const BADGES = {
  first_steps: { id: 'first_steps', name: 'First Steps', points: 10 },
  explorer: { id: 'explorer', name: 'Explorer', points: 25 },
  regular: { id: 'regular', name: 'Regular', points: 50 },
  streak_3: { id: 'streak_3', name: '3-Day Streak', points: 30 },
  streak_7: { id: 'streak_7', name: 'Week Warrior', points: 75 },
  streak_30: { id: 'streak_30', name: 'Monthly Master', points: 200 },
  cities_3: { id: 'cities_3', name: 'City Hopper', points: 50 },
  cities_10: { id: 'cities_10', name: 'Globetrotter', points: 150 },
  reviewer: { id: 'reviewer', name: 'Reviewer', points: 20 },
} as const;

// API rate limits (requests per minute)
export const RATE_LIMITS = {
  AI: 10,
  STANDARD: 60,
  AUTH: 5,
  WEBHOOK: 100,
  SEARCH: 30,
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

// Platform fee percentage
export const PLATFORM_FEE_PERCENT = 15;

// Minimum pass prices
export const MIN_PRICES = {
  day: 5,
  week: 20,
  month: 50,
} as const;

