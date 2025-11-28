-- ============================================================================
-- Migration: Consolidate reviews and gym_reviews tables
-- 
-- This migration:
-- 1. Adds moderation columns to the reviews table
-- 2. Migrates data from gym_reviews to reviews
-- 3. Updates triggers to work with consolidated table
-- 4. Drops the gym_reviews table
-- ============================================================================

-- Step 1: Add moderation columns to reviews table
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS moderation_status TEXT DEFAULT 'approved' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS moderation_notes TEXT,
ADD COLUMN IF NOT EXISTS moderated_by UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS moderated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS has_verified_booking BOOLEAN DEFAULT FALSE;

-- Make booking_id optional (some reviews may not have associated bookings)
ALTER TABLE reviews ALTER COLUMN booking_id DROP NOT NULL;

-- Step 2: Migrate data from gym_reviews to reviews (if gym_reviews exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'gym_reviews') THEN
    -- Insert gym_reviews data into reviews, avoiding duplicates
    INSERT INTO reviews (
      user_id,
      gym_id,
      booking_id,
      rating,
      title,
      comment,
      moderation_status,
      moderation_notes,
      moderated_by,
      moderated_at,
      helpful_count,
      has_verified_booking,
      created_at,
      updated_at
    )
    SELECT 
      gr.user_id,
      gr.gym_id,
      gr.booking_id,
      gr.rating,
      gr.title,
      gr.comment,
      gr.moderation_status,
      gr.moderation_notes,
      gr.moderated_by,
      gr.moderated_at,
      gr.helpful_count,
      gr.booking_id IS NOT NULL,
      gr.created_at,
      gr.updated_at
    FROM gym_reviews gr
    WHERE NOT EXISTS (
      SELECT 1 FROM reviews r 
      WHERE r.user_id = gr.user_id 
        AND r.gym_id = gr.gym_id 
        AND r.created_at = gr.created_at
    );
  END IF;
END $$;

-- Step 3: Create index for moderation queries
CREATE INDEX IF NOT EXISTS idx_reviews_moderation_status ON reviews(moderation_status);
CREATE INDEX IF NOT EXISTS idx_reviews_user_gym ON reviews(user_id, gym_id);

-- Step 4: Update the gym rating trigger to only count approved reviews
CREATE OR REPLACE FUNCTION update_gym_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE gyms
  SET
    rating = (
      SELECT COALESCE(AVG(rating)::DECIMAL(3, 2), 0)
      FROM reviews
      WHERE gym_id = COALESCE(NEW.gym_id, OLD.gym_id)
        AND moderation_status = 'approved'
    ),
    review_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE gym_id = COALESCE(NEW.gym_id, OLD.gym_id)
        AND moderation_status = 'approved'
    )
  WHERE id = COALESCE(NEW.gym_id, OLD.gym_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate trigger to handle updates and deletes
DROP TRIGGER IF EXISTS update_gym_rating_on_review ON reviews;
CREATE TRIGGER update_gym_rating_on_review
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_gym_rating();

-- Step 5: Add RLS policies for moderation
CREATE POLICY "Users can view approved reviews" ON reviews
  FOR SELECT USING (moderation_status = 'approved' OR auth.uid() = user_id);

CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id AND moderation_status = 'pending');

-- Step 6: Drop gym_reviews table (after data migration)
DROP TABLE IF EXISTS gym_reviews CASCADE;

-- Step 7: Add comment for documentation
COMMENT ON TABLE reviews IS 'Consolidated reviews table with moderation support. Replaces both reviews and gym_reviews tables.';
COMMENT ON COLUMN reviews.moderation_status IS 'pending = awaiting moderation, approved = visible to all, rejected = hidden';
COMMENT ON COLUMN reviews.has_verified_booking IS 'True if reviewer had a verified booking at this gym';

