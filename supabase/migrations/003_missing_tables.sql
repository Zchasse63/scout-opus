-- Migration: Add missing tables for Scout Fitness App
-- Phase 1: Database Foundation
-- Created: 2025-11-25

-- ============================================================================
-- PARTNER & APPLICATION TABLES
-- ============================================================================

-- Partners table (gym owners who have completed onboarding)
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  stripe_account_id TEXT UNIQUE,
  stripe_onboarding_complete BOOLEAN DEFAULT FALSE,
  stripe_charges_enabled BOOLEAN DEFAULT FALSE,
  stripe_payouts_enabled BOOLEAN DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Partner applications (applications to become a partner)
CREATE TABLE partner_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  address TEXT NOT NULL,
  website TEXT,
  description TEXT NOT NULL,
  why_partner TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES users(id),
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================================================
-- SUPPORT SYSTEM TABLES
-- ============================================================================

-- Support tickets
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('booking', 'payment', 'account', 'technical', 'other')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Support ticket messages
CREATE TABLE ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'admin')),
  sender_name TEXT NOT NULL,
  sender_id UUID REFERENCES users(id),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================================================
-- CONTENT MODERATION TABLES
-- ============================================================================

-- User-generated reviews (extends existing reviews table with moderation)
CREATE TABLE gym_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  gym_id BIGINT NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
  booking_id BIGINT REFERENCES bookings(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT NOT NULL,
  moderation_status TEXT NOT NULL DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
  moderation_notes TEXT,
  moderated_by UUID REFERENCES users(id),
  moderated_at TIMESTAMP WITH TIME ZONE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Gym verification queue (for crowdsourced data verification)
CREATE TABLE gym_verification_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id BIGINT NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('user_submission', 'firecrawl', 'partner', 'tally_form')),
  submitter_id UUID REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================================================
-- GYM CLAIMS & VERIFICATION REQUESTS
-- ============================================================================

-- Gym ownership claims
CREATE TABLE gym_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id BIGINT NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  claimant_name TEXT NOT NULL,
  claimant_email TEXT NOT NULL,
  claimant_phone TEXT NOT NULL,
  business_email TEXT NOT NULL,
  proof_document_url TEXT,
  additional_notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES users(id)
);

-- Public verification requests (from Tally form)
CREATE TABLE verification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id BIGINT REFERENCES gyms(id) ON DELETE CASCADE,
  requester_email TEXT NOT NULL,
  requester_name TEXT NOT NULL,
  verification_type TEXT NOT NULL CHECK (verification_type IN ('hours', 'amenities', 'pricing', 'contact', 'address', 'general')),
  current_value TEXT,
  suggested_value TEXT NOT NULL,
  additional_context TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================================================
-- PASS MANAGEMENT
-- ============================================================================

-- Active passes (extends bookings with pass lifecycle)
CREATE TABLE passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  gym_id BIGINT NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
  booking_id BIGINT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  pass_type TEXT NOT NULL CHECK (pass_type IN ('day', 'week', 'month')),
  valid_from DATE NOT NULL,
  valid_until DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired', 'cancelled', 'refunded')),
  qr_code_data JSONB NOT NULL,
  check_in_count INTEGER DEFAULT 0,
  last_check_in_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================================================
-- WEB SCRAPING QUEUE
-- ============================================================================

-- Firecrawl scraping job queue
CREATE TABLE scraping_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gym_id BIGINT REFERENCES gyms(id) ON DELETE SET NULL,
  url TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('google_places', 'yelp', 'website', 'instagram', 'facebook')),
  priority INTEGER DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  result JSONB,
  error_message TEXT,
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  started_at TIMESTAMP WITH TIME ZONE,
  processed_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- GAMIFICATION TABLES
-- ============================================================================

-- User stats and gamification progress
CREATE TABLE user_stats (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  total_points INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  level_progress INTEGER DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  total_check_ins INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  cities_visited TEXT[] DEFAULT '{}',
  unique_gyms_visited INTEGER DEFAULT 0,
  reviews_submitted INTEGER DEFAULT 0,
  photos_submitted INTEGER DEFAULT 0,
  referrals_made INTEGER DEFAULT 0,
  last_check_in_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User achievements (badges earned)
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  badge_category TEXT NOT NULL CHECK (badge_category IN ('milestones', 'streaks', 'explorer', 'social', 'special')),
  badge_tier TEXT CHECK (badge_tier IN ('bronze', 'silver', 'gold', 'platinum')),
  points_awarded INTEGER NOT NULL DEFAULT 0,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- User activity log (for points tracking and analytics)
CREATE TABLE user_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('booking', 'check_in', 'review', 'photo', 'referral', 'streak', 'level_up')),
  points_earned INTEGER NOT NULL DEFAULT 0,
  related_id UUID,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================================================
-- ADMIN NOTIFICATIONS
-- ============================================================================

-- Admin notification queue
CREATE TABLE admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('partner_application', 'gym_claim', 'verification_request', 'support_ticket', 'content_moderation', 'platform_alert')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  related_id UUID,
  related_table TEXT,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
  read_by UUID REFERENCES users(id),
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Support system indexes
CREATE INDEX support_tickets_user_id_idx ON support_tickets(user_id);
CREATE INDEX support_tickets_status_idx ON support_tickets(status);
CREATE INDEX support_tickets_created_at_idx ON support_tickets(created_at DESC);
CREATE INDEX ticket_messages_ticket_id_idx ON ticket_messages(ticket_id);

-- Partner indexes
CREATE INDEX partners_user_id_idx ON partners(user_id);
CREATE INDEX partners_status_idx ON partners(status);
CREATE INDEX partner_applications_status_idx ON partner_applications(status);

-- Content moderation indexes
CREATE INDEX gym_reviews_gym_id_idx ON gym_reviews(gym_id);
CREATE INDEX gym_reviews_moderation_status_idx ON gym_reviews(moderation_status);
CREATE INDEX gym_reviews_user_id_idx ON gym_reviews(user_id);
CREATE INDEX gym_verification_queue_status_idx ON gym_verification_queue(status);
CREATE INDEX gym_verification_queue_gym_id_idx ON gym_verification_queue(gym_id);

-- Gym claims indexes
CREATE INDEX gym_claims_gym_id_idx ON gym_claims(gym_id);
CREATE INDEX gym_claims_status_idx ON gym_claims(status);
CREATE INDEX verification_requests_status_idx ON verification_requests(status);

-- Pass management indexes
CREATE INDEX passes_user_id_idx ON passes(user_id);
CREATE INDEX passes_gym_id_idx ON passes(gym_id);
CREATE INDEX passes_status_idx ON passes(status);
CREATE INDEX passes_valid_until_idx ON passes(valid_until);

-- Scraping queue indexes
CREATE INDEX scraping_queue_status_idx ON scraping_queue(status);
CREATE INDEX scraping_queue_gym_id_idx ON scraping_queue(gym_id);

-- Gamification indexes
CREATE INDEX user_stats_total_points_idx ON user_stats(total_points DESC);
CREATE INDEX user_stats_current_level_idx ON user_stats(current_level DESC);
CREATE INDEX user_achievements_user_id_idx ON user_achievements(user_id);
CREATE INDEX user_activity_log_user_id_idx ON user_activity_log(user_id);
CREATE INDEX user_activity_log_created_at_idx ON user_activity_log(created_at DESC);

-- Admin notifications indexes
CREATE INDEX admin_notifications_status_idx ON admin_notifications(status);
CREATE INDEX admin_notifications_type_idx ON admin_notifications(type);
CREATE INDEX admin_notifications_created_at_idx ON admin_notifications(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all new tables
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE gym_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE gym_verification_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE gym_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraping_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

-- Partners policies
CREATE POLICY "Partners can view their own record"
  ON partners FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Partners can update their own record"
  ON partners FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Partner applications policies
CREATE POLICY "Anyone can submit partner applications"
  ON partner_applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own applications"
  ON partner_applications FOR SELECT
  USING (contact_email = (SELECT email FROM users WHERE id = auth.uid()));

-- Support tickets policies
CREATE POLICY "Users can view their own tickets"
  ON support_tickets FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create support tickets"
  ON support_tickets FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own tickets"
  ON support_tickets FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Ticket messages policies
CREATE POLICY "Users can view messages for their tickets"
  ON ticket_messages FOR SELECT
  USING (
    ticket_id IN (
      SELECT id FROM support_tickets WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages for their tickets"
  ON ticket_messages FOR INSERT
  WITH CHECK (
    sender_type = 'user' AND
    sender_id = auth.uid() AND
    ticket_id IN (
      SELECT id FROM support_tickets WHERE user_id = auth.uid()
    )
  );

-- Gym reviews policies
CREATE POLICY "Approved reviews are publicly viewable"
  ON gym_reviews FOR SELECT
  USING (moderation_status = 'approved' OR user_id = auth.uid());

CREATE POLICY "Users can create reviews"
  ON gym_reviews FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own pending reviews"
  ON gym_reviews FOR UPDATE
  USING (user_id = auth.uid() AND moderation_status = 'pending')
  WITH CHECK (user_id = auth.uid());

-- Gym verification queue policies (admin only for now)
CREATE POLICY "Anyone can view pending verifications"
  ON gym_verification_queue FOR SELECT
  USING (status = 'approved' OR submitter_id = auth.uid());

CREATE POLICY "Authenticated users can submit verifications"
  ON gym_verification_queue FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Gym claims policies
CREATE POLICY "Users can view their own claims"
  ON gym_claims FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create claims"
  ON gym_claims FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Verification requests policies
CREATE POLICY "Anyone can submit verification requests"
  ON verification_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view verification requests they submitted"
  ON verification_requests FOR SELECT
  USING (requester_email = (SELECT email FROM users WHERE id = auth.uid()));

-- Passes policies
CREATE POLICY "Users can view their own passes"
  ON passes FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create passes"
  ON passes FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Scraping queue policies (admin only, no public access)
-- (No policies = admin-only via service role)

-- User stats policies
CREATE POLICY "Users can view their own stats"
  ON user_stats FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can view leaderboard (top stats only)"
  ON user_stats FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own stats"
  ON user_stats FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "System can insert user stats"
  ON user_stats FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- User achievements policies
CREATE POLICY "Users can view their own achievements"
  ON user_achievements FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can view all user achievements (for leaderboard)"
  ON user_achievements FOR SELECT
  USING (true);

-- User activity log policies
CREATE POLICY "Users can view their own activity"
  ON user_activity_log FOR SELECT
  USING (user_id = auth.uid());

-- Admin notifications policies (admin only, no public access)
-- (No policies = admin-only via service role)

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_partners_updated_at
  BEFORE UPDATE ON partners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gym_reviews_updated_at
  BEFORE UPDATE ON gym_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_passes_updated_at
  BEFORE UPDATE ON passes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON user_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INITIAL DATA / SEEDS
-- ============================================================================

-- Create initial user_stats records for existing users
INSERT INTO user_stats (user_id)
SELECT id FROM users
ON CONFLICT (user_id) DO NOTHING;

-- Migration complete
