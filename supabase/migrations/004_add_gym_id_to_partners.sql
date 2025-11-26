-- Migration 004: Add gym_id column to partners table
-- This fixes the integration issue where payments-create-intent queries partners.gym_id
-- 
-- The gym_id links a partner account to the specific gym they manage in the gyms table.
-- This is required for:
--   1. Looking up partner's Stripe account when processing payments for a gym
--   2. Determining which partner receives payouts from gym bookings
--   3. Partner portal gym management

-- Add gym_id column to partners table
ALTER TABLE partners
ADD COLUMN IF NOT EXISTS gym_id UUID REFERENCES gyms(id) ON DELETE SET NULL;

-- Create index for efficient lookups
CREATE INDEX IF NOT EXISTS partners_gym_id_idx ON partners(gym_id);

-- Add unique constraint: one partner per gym
ALTER TABLE partners
ADD CONSTRAINT partners_gym_id_unique UNIQUE (gym_id);

-- Add RLS policy for gym_id-based lookups (service role can query by gym_id)
CREATE POLICY "Service role can query partners by gym_id"
  ON partners FOR SELECT
  TO service_role
  USING (true);

-- Comment for documentation
COMMENT ON COLUMN partners.gym_id IS 'Reference to the gym this partner manages. Used for payment routing.';

-- Optional: Update existing partners to link to their gyms if we have a way to match them
-- This would need to be done manually or via a separate data migration script
-- For now, new partners will have gym_id set during onboarding

-- Note: After running this migration, ensure that:
-- 1. Partner onboarding flow sets gym_id when creating/linking a gym
-- 2. Existing partners are manually linked to their gyms in the admin portal

