/**
 * Database Types - Generated from Supabase schema
 * These types represent the database tables and should be kept in sync with migrations
 * 
 * To regenerate: npx supabase gen types typescript --local > types/database.ts
 */

// ============================================================================
// ENUMS
// ============================================================================

export type PassType = 'day' | 'week' | 'month';
export type BookingStatus = 'confirmed' | 'used' | 'cancelled';
export type CalendarSource = 'ios_calendar' | 'google_calendar' | 'manual';
export type TranscriptionMethod = 'on_device' | 'whisper';
export type AlertType = 'travel_alert' | 'booking_reminder' | 'streak_reminder';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

// ============================================================================
// DATABASE TABLE TYPES
// ============================================================================

export interface DbUser {
  id: string; // UUID
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  preferences: UserPreferences;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  notifications: {
    travel_alerts: boolean;
    booking_reminders: boolean;
    promotions: boolean;
  };
  theme: 'light' | 'dark' | 'automatic';
}

export interface DbGymOwner {
  id: string; // UUID
  user_id: string;
  gym_name: string;
  stripe_account_id: string | null;
  stripe_onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbGym {
  id: number;
  owner_id: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  website: string | null;
  rating: number;
  review_count: number;
  day_pass_price: number | null;
  week_pass_price: number | null;
  month_pass_price: number | null;
  google_place_id: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbGymAmenity {
  id: number;
  gym_id: number;
  amenity_id: number;
  is_verified: boolean;
  created_at: string;
}

export interface DbGymHours {
  id: number;
  gym_id: number;
  day_of_week: number; // 0-6 (Sunday-Saturday)
  opens_at: string | null; // TIME format
  closes_at: string | null;
  is_closed: boolean;
  created_at: string;
}

export interface DbGymPhoto {
  id: number;
  gym_id: number;
  url: string;
  display_order: number;
  created_at: string;
}

export interface DbBooking {
  id: number;
  user_id: string;
  gym_id: number;
  booking_date: string; // DATE format
  pass_type: PassType;
  status: BookingStatus;
  amount_paid: number;
  platform_fee: number;
  gym_payout: number;
  stripe_payment_intent_id: string | null;
  qr_code: Record<string, unknown> | null;
  qr_scanned_at: string | null;
  qr_scanned_by: string | null;
  waiver_signed: boolean;
  waiver_signed_at: string | null;
  waiver_ip_address: string | null;
  waiver_version: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbReview {
  id: number;
  user_id: string;
  gym_id: number;
  booking_id: number;
  rating: number; // 1-5
  comment: string | null;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface DbTravelPeriod {
  id: number;
  user_id: string;
  destination_city: string;
  destination_state: string | null;
  destination_country: string;
  destination_lat: number;
  destination_lng: number;
  start_date: string; // DATE format
  end_date: string;
  confidence_score: number | null;
  source: CalendarSource;
  source_event_id: string | null;
  dismissed: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbVoiceQuery {
  id: number;
  user_id: string;
  transcript: string;
  parsed_intent: Record<string, unknown> | null;
  results_count: number | null;
  selected_gym_id: number | null;
  transcription_method: TranscriptionMethod | null;
  processing_time_ms: number | null;
  created_at: string;
}

export interface DbSavedGym {
  id: number;
  user_id: string;
  gym_id: number;
  created_at: string;
}

export interface DbAmenity {
  id: number;
  name: string;
  icon: string | null;
  created_at: string;
}

export interface DbSentAlert {
  id: number;
  user_id: string;
  alert_key: string;
  alert_type: AlertType;
  created_at: string;
}

export interface DbSupportTicket {
  id: number;
  user_id: string;
  subject: string;
  description: string;
  category: string;
  status: TicketStatus;
  priority: TicketPriority;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbGamificationProfile {
  id: number;
  user_id: string;
  total_points: number;
  current_streak: number;
  longest_streak: number;
  total_workouts: number;
  total_gyms_visited: number;
  badges: string[];
  created_at: string;
  updated_at: string;
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

// ============================================================================
// EDGE FUNCTION REQUEST TYPES
// ============================================================================

export interface VoiceProcessRequest {
  transcript: string;
  userLocation?: { latitude: number; longitude: number };
  conversationHistory?: Array<{ role: string; content: string }>;
  previousIntent?: Record<string, unknown>;
}

export interface GymPersonalizeRequest {
  gymIds: string[];
}

export interface TravelAlertRequest {
  userId: string;
  destination: string;
  daysUntilTrip: number;
  gymCount: number;
  pushToken?: string;
}

export interface SendPushRequest {
  pushTokens: string[];
  type: 'booking_confirmed' | 'booking_reminder' | 'payment_received' | 'support_update' | 'travel_alert' | 'streak_reminder' | 'badge_earned';
  data: Record<string, string | number>;
}

export interface SendEmailRequest {
  to: string;
  type: 'partner_approved' | 'partner_rejected' | 'booking_confirmed' | 'booking_cancelled' | 'refund_processed' | 'support_reply' | 'welcome';
  data: Record<string, string | number>;
}

export interface CalendarExtractRequest {
  title: string;
  location?: string;
  description?: string;
  startDate: string;
  endDate: string;
}

export interface PlacesSearchRequest {
  query: string;
  latitude: number;
  longitude: number;
  radius?: number;
}

export interface BookingValidateQrRequest {
  bookingId: number;
  gymId: number;
  scannedBy: string;
}

