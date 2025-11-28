import { http, HttpResponse } from 'msw';

// Base URL for Supabase Edge Functions
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://mvvndpuwrbsrahytxtjf.supabase.co';

export const handlers = [
  // Payments
  http.post(`${SUPABASE_URL}/functions/v1/payments-create-intent`, () => {
    return HttpResponse.json({
      clientSecret: 'pi_test_secret_123',
      paymentIntentId: 'pi_test_123',
    });
  }),

  http.post(`${SUPABASE_URL}/functions/v1/payments-webhook`, () => {
    return HttpResponse.json({ success: true });
  }),

  // Places
  http.post(`${SUPABASE_URL}/functions/v1/places-search`, () => {
    return HttpResponse.json({
      gyms: [
        {
          id: '1',
          name: 'Test Gym',
          address: '123 Main St',
          rating: 4.5,
          reviewCount: 100,
          photoUrl: 'https://example.com/gym.jpg',
        },
      ],
    });
  }),

  http.post(`${SUPABASE_URL}/functions/v1/places-details`, () => {
    return HttpResponse.json({
      id: '1',
      name: 'Test Gym',
      address: '123 Main St',
      rating: 4.5,
      reviewCount: 100,
      amenities: ['WiFi', 'Parking'],
      hours: { open: '6:00 AM', close: '10:00 PM' },
    });
  }),

  http.post(`${SUPABASE_URL}/functions/v1/places-photos`, () => {
    return HttpResponse.json({
      photos: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'],
    });
  }),

  // Voice
  http.post(`${SUPABASE_URL}/functions/v1/voice-process-query`, () => {
    return HttpResponse.json({
      intent: 'search',
      filters: { location: 'New York', amenities: ['WiFi'] },
    });
  }),

  // Bookings
  http.post(`${SUPABASE_URL}/functions/v1/bookings-validate-qr`, () => {
    return HttpResponse.json({
      valid: true,
      booking: { id: '1', status: 'confirmed' },
    });
  }),

  // Gym
  http.post(`${SUPABASE_URL}/functions/v1/gym-personalize`, () => {
    return HttpResponse.json({
      recommendations: [{ id: '1', name: 'Test Gym' }],
    });
  }),

  http.post(`${SUPABASE_URL}/functions/v1/gym-page`, () => {
    return HttpResponse.json({
      gym: { id: '1', name: 'Test Gym' },
    });
  }),

  // Trips
  http.post(`${SUPABASE_URL}/functions/v1/trips-sync-calendar`, () => {
    return HttpResponse.json({ synced: true });
  }),

  http.post(`${SUPABASE_URL}/functions/v1/trips-nearby-gyms`, () => {
    return HttpResponse.json({
      gyms: [{ id: '1', name: 'Test Gym', distance: 2.5 }],
    });
  }),

  // Reviews
  http.post(`${SUPABASE_URL}/functions/v1/reviews-fetch`, () => {
    return HttpResponse.json({
      reviews: [
        {
          id: '1',
          rating: 5,
          text: 'Great gym!',
          author: 'John Doe',
        },
      ],
    });
  }),

  http.post(`${SUPABASE_URL}/functions/v1/reviews-submit`, () => {
    return HttpResponse.json({
      id: '1',
      success: true,
    });
  }),

  // Gamification
  http.post(`${SUPABASE_URL}/functions/v1/gamification-update`, () => {
    return HttpResponse.json({
      points: 100,
      achievements: ['first_booking'],
    });
  }),

  // Notifications
  http.post(`${SUPABASE_URL}/functions/v1/notifications-send`, () => {
    return HttpResponse.json({ sent: true });
  }),

  // Analytics
  http.post(`${SUPABASE_URL}/functions/v1/analytics-track`, () => {
    return HttpResponse.json({ tracked: true });
  }),

  // Auth
  http.post(`${SUPABASE_URL}/functions/v1/auth-verify-token`, () => {
    return HttpResponse.json({
      valid: true,
      user: { id: 'user-123', email: 'test@example.com' },
    });
  }),

  http.post(`${SUPABASE_URL}/functions/v1/auth-refresh`, () => {
    return HttpResponse.json({
      token: 'new-token-123',
    });
  }),
];

