-- Function to search gyms by location
CREATE OR REPLACE FUNCTION search_gyms_nearby(
  lat DECIMAL,
  lng DECIMAL,
  radius_meters INTEGER DEFAULT 5000
)
RETURNS TABLE (
  id BIGINT,
  name TEXT,
  address TEXT,
  distance_meters DECIMAL,
  rating DECIMAL,
  day_pass_price DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    g.id,
    g.name,
    g.address,
    ST_Distance(
      g.location,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
    )::DECIMAL as distance_meters,
    g.rating,
    g.day_pass_price
  FROM gyms g
  WHERE ST_DWithin(
    g.location,
    ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
    radius_meters
  )
  ORDER BY distance_meters ASC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to update gym rating
CREATE OR REPLACE FUNCTION update_gym_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE gyms
  SET
    rating = (
      SELECT AVG(rating)::DECIMAL(3, 2)
      FROM reviews
      WHERE gym_id = NEW.gym_id
    ),
    review_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE gym_id = NEW.gym_id
    )
  WHERE id = NEW.gym_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for review creation
CREATE TRIGGER update_gym_rating_on_review
AFTER INSERT ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_gym_rating();

-- Function to generate QR code payload
CREATE OR REPLACE FUNCTION generate_qr_payload(
  booking_id BIGINT,
  user_id UUID,
  gym_id BIGINT,
  booking_date DATE
)
RETURNS JSONB AS $$
DECLARE
  payload JSONB;
  signature TEXT;
BEGIN
  payload := jsonb_build_object(
    'booking_id', booking_id,
    'user_id', user_id,
    'gym_id', gym_id,
    'date', booking_date,
    'timestamp', EXTRACT(EPOCH FROM now())::BIGINT
  );

  -- Return payload (signature should be computed on server)
  RETURN payload;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to validate QR code
CREATE OR REPLACE FUNCTION validate_qr_code(
  booking_id BIGINT,
  current_date DATE
)
RETURNS TABLE (
  is_valid BOOLEAN,
  message TEXT,
  user_name TEXT,
  gym_name TEXT
) AS $$
DECLARE
  booking_record RECORD;
BEGIN
  SELECT b.*, u.email, g.name INTO booking_record
  FROM bookings b
  JOIN users u ON b.user_id = u.id
  JOIN gyms g ON b.gym_id = g.id
  WHERE b.id = booking_id;

  -- Validate conditions
  IF booking_record IS NULL THEN
    RETURN QUERY SELECT FALSE, 'Booking not found', NULL, NULL;
  ELSIF booking_record.status = 'used' THEN
    RETURN QUERY SELECT FALSE, 'Pass already used', NULL, NULL;
  ELSIF booking_record.status = 'cancelled' THEN
    RETURN QUERY SELECT FALSE, 'Booking cancelled', NULL, NULL;
  ELSIF booking_record.booking_date != current_date THEN
    RETURN QUERY SELECT FALSE, 'Invalid date for this pass', NULL, NULL;
  ELSE
    RETURN QUERY SELECT TRUE, 'Valid pass', booking_record.email, booking_record.name;
  END IF;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get nearby gyms for a trip
CREATE OR REPLACE FUNCTION get_trip_gyms(
  trip_lat DECIMAL,
  trip_lng DECIMAL,
  limit_count INTEGER DEFAULT 10,
  radius_meters INTEGER DEFAULT 15000
)
RETURNS TABLE (
  id BIGINT,
  name TEXT,
  rating DECIMAL,
  distance_km DECIMAL,
  day_pass_price DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    g.id,
    g.name,
    g.rating,
    (ST_Distance(
      g.location,
      ST_SetSRID(ST_MakePoint(trip_lng, trip_lat), 4326)::geography
    ) / 1000)::DECIMAL as distance_km,
    g.day_pass_price
  FROM gyms g
  WHERE ST_DWithin(
    g.location,
    ST_SetSRID(ST_MakePoint(trip_lng, trip_lat), 4326)::geography,
    radius_meters
  )
  ORDER BY distance_km ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE;
