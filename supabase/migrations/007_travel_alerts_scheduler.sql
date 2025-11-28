-- ============================================================================
-- MIGRATION 007: Travel Alerts Scheduler Infrastructure
-- Adds pg_cron job and helper functions for automated travel alert notifications
-- ============================================================================

-- Enable required extensions for scheduling
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Function to count gyms within a radius (for travel alerts)
CREATE OR REPLACE FUNCTION count_gyms_in_radius(
  lat DECIMAL,
  lng DECIMAL,
  radius_km INTEGER DEFAULT 10
)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM gyms g
    WHERE ST_DWithin(
      g.location,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
      radius_km * 1000  -- Convert km to meters
    )
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- Schedule daily travel alerts job at 9 AM UTC
-- The Edge Function will check user timezones and send appropriately
SELECT cron.schedule(
  'travel-alerts-daily',
  '0 9 * * *',  -- 9 AM UTC daily
  $$
  SELECT net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/travel-alerts-scheduler',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.service_role_key'),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);

-- Also run at 5 PM UTC to catch more timezones
SELECT cron.schedule(
  'travel-alerts-evening',
  '0 17 * * *',  -- 5 PM UTC daily
  $$
  SELECT net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/travel-alerts-scheduler',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.service_role_key'),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);

-- Create a view for monitoring scheduled jobs
CREATE OR REPLACE VIEW cron_job_status AS
SELECT 
  jobid,
  jobname,
  schedule,
  command,
  nodename,
  nodeport,
  database,
  username,
  active
FROM cron.job
WHERE database = current_database();

-- Add index to optimize travel_periods queries by start_date
CREATE INDEX IF NOT EXISTS idx_travel_periods_start_date 
ON travel_periods(start_date) 
WHERE dismissed = false;

-- Add index to optimize sent_alerts lookups
CREATE INDEX IF NOT EXISTS idx_sent_alerts_lookup 
ON sent_alerts(user_id, alert_key);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT SELECT ON cron.job TO postgres;

-- Comments for documentation
COMMENT ON FUNCTION count_gyms_in_radius IS 
'Counts the number of gyms within a specified radius (km) from a lat/lng point. Used by travel alerts scheduler.';

-- ============================================================================
-- ALTERNATIVE: If pg_cron is not available, use this SQL function that can
-- be called externally (e.g., via GitHub Actions, Vercel Cron, etc.)
-- ============================================================================

-- Function to get users with upcoming trips who need alerts
CREATE OR REPLACE FUNCTION get_pending_travel_alerts()
RETURNS TABLE (
  user_id UUID,
  trip_id BIGINT,
  destination TEXT,
  start_date DATE,
  days_until_trip INTEGER,
  destination_lat DECIMAL,
  destination_lng DECIMAL,
  gym_count INTEGER
) AS $$
DECLARE
  today DATE := CURRENT_DATE;
  seven_days DATE := CURRENT_DATE + INTERVAL '7 days';
  one_day DATE := CURRENT_DATE + INTERVAL '1 day';
BEGIN
  RETURN QUERY
  SELECT 
    tp.user_id,
    tp.id as trip_id,
    CASE 
      WHEN tp.destination_state IS NOT NULL 
      THEN tp.destination_city || ', ' || tp.destination_state
      ELSE tp.destination_city || ', ' || tp.destination_country
    END as destination,
    tp.start_date,
    (tp.start_date - today)::INTEGER as days_until_trip,
    tp.destination_lat,
    tp.destination_lng,
    count_gyms_in_radius(tp.destination_lat, tp.destination_lng, 10) as gym_count
  FROM travel_periods tp
  LEFT JOIN sent_alerts sa ON 
    sa.user_id = tp.user_id AND 
    sa.alert_key = 'trip_' || tp.id || '_' || (tp.start_date - today)::TEXT || 'd'
  JOIN users u ON u.id = tp.user_id
  WHERE 
    tp.dismissed = false
    AND (tp.start_date = seven_days OR tp.start_date = one_day)
    AND sa.id IS NULL  -- Not already sent
    AND (u.preferences->'notifications'->>'travel_alerts')::boolean IS NOT FALSE;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_pending_travel_alerts IS 
'Returns users with upcoming trips (7 days or 1 day away) who have not yet received alerts and have travel_alerts enabled.';

