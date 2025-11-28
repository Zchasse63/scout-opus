// Test fixtures for common data types

export const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  avatar_url: 'https://example.com/avatar.jpg',
  created_at: '2024-01-01T00:00:00Z',
};

export const mockGym = {
  id: 'gym-123',
  name: 'Test Gym',
  address: '123 Main St, New York, NY 10001',
  latitude: 40.7128,
  longitude: -74.006,
  rating: 4.5,
  review_count: 100,
  photo_url: 'https://example.com/gym.jpg',
  amenities: ['WiFi', 'Parking', 'Showers'],
  hours: {
    monday: { open: '6:00 AM', close: '10:00 PM' },
    tuesday: { open: '6:00 AM', close: '10:00 PM' },
    wednesday: { open: '6:00 AM', close: '10:00 PM' },
    thursday: { open: '6:00 AM', close: '10:00 PM' },
    friday: { open: '6:00 AM', close: '11:00 PM' },
    saturday: { open: '8:00 AM', close: '11:00 PM' },
    sunday: { open: '8:00 AM', close: '9:00 PM' },
  },
};

export const mockPass = {
  id: 'pass-123',
  type: 'day_pass',
  price: 15.99,
  duration_days: 1,
  description: 'Day Pass',
};

export const mockBooking = {
  id: 'booking-123',
  user_id: 'user-123',
  gym_id: 'gym-123',
  pass_id: 'pass-123',
  booking_date: '2024-01-15',
  status: 'confirmed',
  qr_code: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  created_at: '2024-01-01T00:00:00Z',
  expires_at: '2024-01-16T00:00:00Z',
};

export const mockTrip = {
  id: 'trip-123',
  user_id: 'user-123',
  destination: 'New York',
  start_date: '2024-02-01',
  end_date: '2024-02-07',
  gyms: ['gym-123', 'gym-456'],
  created_at: '2024-01-01T00:00:00Z',
};

export const mockReview = {
  id: 'review-123',
  gym_id: 'gym-123',
  user_id: 'user-123',
  rating: 5,
  text: 'Great gym! Clean facilities and friendly staff.',
  author_name: 'Test User',
  created_at: '2024-01-01T00:00:00Z',
};

export const mockNotification = {
  id: 'notif-123',
  user_id: 'user-123',
  title: 'Booking Confirmed',
  body: 'Your booking at Test Gym is confirmed',
  type: 'booking_confirmed',
  read: false,
  created_at: '2024-01-01T00:00:00Z',
};

