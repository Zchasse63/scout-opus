-- ============================================================================
-- MIGRATION 006: Schema Fixes
-- Fix gamification column mismatches and booking status constraint
-- ============================================================================

-- 1. Add missing columns to user_stats table
-- The gamificationStore expects these columns that don't exist
ALTER TABLE user_stats 
  ADD COLUMN IF NOT EXISTS total_workouts INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS unlocked_badges TEXT[] DEFAULT '{}';

-- 2. Add gyms_visited as an alias column (gamificationStore uses this name)
-- The table has unique_gyms_visited but store uses gyms_visited
ALTER TABLE user_stats 
  ADD COLUMN IF NOT EXISTS gyms_visited INTEGER DEFAULT 0;

-- Sync existing unique_gyms_visited values to gyms_visited
UPDATE user_stats 
SET gyms_visited = unique_gyms_visited 
WHERE gyms_visited = 0 AND unique_gyms_visited > 0;

-- 3. Update bookings status CHECK constraint to include 'pending' and 'expired'
-- First drop the existing constraint
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;

-- Add new constraint with all status values
ALTER TABLE bookings 
  ADD CONSTRAINT bookings_status_check 
  CHECK (status IN ('pending', 'confirmed', 'used', 'cancelled', 'expired'));

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON COLUMN user_stats.total_workouts IS 'Total workout sessions completed by user';
COMMENT ON COLUMN user_stats.unlocked_badges IS 'Array of badge IDs unlocked by user';
COMMENT ON COLUMN user_stats.gyms_visited IS 'Alias for unique_gyms_visited for backward compatibility';

