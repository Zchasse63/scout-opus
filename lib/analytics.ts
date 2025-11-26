import { Mixpanel } from 'mixpanel-react-native';

const MIXPANEL_TOKEN = process.env.EXPO_PUBLIC_MIXPANEL_TOKEN;

let mixpanel: Mixpanel | null = null;

export async function initAnalytics() {
  if (!MIXPANEL_TOKEN) {
    console.warn('Mixpanel token not configured. Analytics disabled.');
    return;
  }

  try {
    mixpanel = new Mixpanel(MIXPANEL_TOKEN, true);
    await mixpanel.init();
    console.log('Analytics initialized');
  } catch (error) {
    console.error('Failed to initialize analytics:', error);
  }
}

// Identify user (call after login)
export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (!mixpanel) return;

  mixpanel.identify(userId);

  if (traits) {
    mixpanel.getPeople().set(traits);
  }
}

// Reset user (call after logout)
export function resetUser() {
  if (!mixpanel) return;
  mixpanel.reset();
}

// Track event with properties
export function track(eventName: string, properties?: Record<string, unknown>) {
  if (!mixpanel) return;
  mixpanel.track(eventName, properties);
}

// ===== Event Tracking Functions =====

// App lifecycle
export function trackAppOpen() {
  track('App Opened', { timestamp: new Date().toISOString() });
}

// Search events
export function trackSearch(query: string, filters?: Record<string, unknown>) {
  track('Search Performed', { query, ...filters });
}

export function trackVoiceSearchStarted() {
  track('Voice Search Started');
}

export function trackVoiceSearchCompleted(transcript: string, success: boolean) {
  track('Voice Search Completed', { transcript, success });
}

// Gym events
export function trackGymViewed(gymId: string, gymName: string, source: string) {
  track('Gym Viewed', { gym_id: gymId, gym_name: gymName, source });
}

export function trackGymSaved(gymId: string, gymName: string) {
  track('Gym Saved', { gym_id: gymId, gym_name: gymName });
}

// Booking events
export function trackBookingStarted(gymId: string, passType: string, amount: number) {
  track('Booking Started', { gym_id: gymId, pass_type: passType, amount });
}

export function trackBookingCompleted(bookingId: string, gymId: string, passType: string, amount: number) {
  track('Booking Completed', {
    booking_id: bookingId,
    gym_id: gymId,
    pass_type: passType,
    amount,
    revenue: amount,
  });
}

export function trackBookingCancelled(bookingId: string, reason?: string) {
  track('Booking Cancelled', { booking_id: bookingId, reason });
}

// QR events
export function trackQRViewed(bookingId: string) {
  track('QR Pass Viewed', { booking_id: bookingId });
}

export function trackQRScanned(bookingId: string, success: boolean) {
  track('QR Pass Scanned', { booking_id: bookingId, success });
}

// Review events
export function trackReviewSubmitted(gymId: string, rating: number) {
  track('Review Submitted', { gym_id: gymId, rating });
}

export function trackPhotoSubmitted(gymId: string) {
  track('Photo Submitted', { gym_id: gymId });
}

// Trip events
export function trackTripCreated(destination: string, startDate: string, source: string) {
  track('Trip Created', { destination, start_date: startDate, source });
}

export function trackTripDetected(destination: string, daysUntil: number) {
  track('Trip Detected', { destination, days_until: daysUntil });
}

// Navigation events
export function trackScreenView(screenName: string, params?: Record<string, unknown>) {
  track('Screen Viewed', { screen_name: screenName, ...params });
}

// Gamification events
export function trackBadgeEarned(badgeId: string, badgeName: string, points: number) {
  track('Badge Earned', { badge_id: badgeId, badge_name: badgeName, points });
}

export function trackLevelUp(oldLevel: number, newLevel: number) {
  track('Level Up', { old_level: oldLevel, new_level: newLevel });
}

// Error tracking (supplement to Sentry)
export function trackError(errorType: string, errorMessage: string, context?: Record<string, unknown>) {
  track('Error Occurred', { error_type: errorType, error_message: errorMessage, ...context });
}

