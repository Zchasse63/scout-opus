// Re-export database types
export * from './database';

// Auth Types
export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

// Gym Types
export interface Gym {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  dayPassPrice: number;
  weekPassPrice?: number;
  monthPassPrice?: number;
  amenities: string[];
  photos: string[];
  description: string;
  googlePlaceId?: string;
  hours?: GymHours;
  isSaved?: boolean;
  // Google's AI-generated summary from Places API
  aiSummary?: string;
  // AI review summary (different from generativeSummary)
  reviewSummary?: string;
  // Accessibility options (wheelchair accessible entrance/parking/restroom/seating)
  accessibilityOptions?: {
    wheelchairAccessibleEntrance?: boolean;
    wheelchairAccessibleParking?: boolean;
    wheelchairAccessibleRestroom?: boolean;
    wheelchairAccessibleSeating?: boolean;
  };
  // Parking availability
  parkingOptions?: {
    freeParkingLot?: boolean;
    paidParkingLot?: boolean;
    freeStreetParking?: boolean;
    paidStreetParking?: boolean;
    valetParking?: boolean;
    freeGarageParking?: boolean;
    paidGarageParking?: boolean;
  };
  // Payment methods accepted
  paymentOptions?: {
    acceptsCreditCards?: boolean;
    acceptsDebitCards?: boolean;
    acceptsCashOnly?: boolean;
    acceptsNfc?: boolean;
  };
  // Location context (e.g., "Near Central Park")
  addressDescriptor?: string;
  // Personalized match reasons (populated client-side)
  personalization?: {
    matchScore: number;
    reasons: string[];
  };
}

export interface GymHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
  isOpen24h?: boolean;
}

// Search Types
export interface SearchQuery {
  textQuery?: string;
  filters: string[];
  latitude?: number;
  longitude?: number;
  radius?: number; // in meters
}

export interface VoiceQueryResult {
  intent: 'search_gyms' | 'refine_search' | 'compare' | 'get_details' | 'book_pass' | 'check_schedule';
  location?: { query: string; useCurrentLocation: boolean };
  facilityTypes: string[];
  amenities: string[];
  timeConstraint?: string;
  priceConstraint?: { max: number };
  sortBy?: 'distance' | 'price' | 'rating';
  isRefinement?: boolean;
  confidence?: number;
}

// Booking Types
export interface Booking {
  id: string;
  userId: string;
  gymId: string;
  gymName?: string;
  bookingDate: string;
  passType: 'day' | 'week' | 'month';
  status: 'pending' | 'confirmed' | 'used' | 'cancelled' | 'expired';
  amountPaid: number;
  platformFee?: number;
  gymPayout?: number;
  stripePaymentIntentId?: string;
  qrCode?: string;
  qrScannedAt?: string;
  checkedInAt?: string;
}

// Trip Types
export interface TravelPeriod {
  id: string;
  userId: string;
  destinationCity: string;
  destinationState: string;
  destinationCountry: string;
  destinationLat: number;
  destinationLng: number;
  startDate: string;
  endDate: string;
  confidenceScore: number;
  source: 'ios_calendar' | 'google_calendar' | 'manual';
  sourceEventId?: string;
}

// Map Types
export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

// UI Types
export interface FilterChip {
  id: string;
  label: string;
  icon: string;
  isActive?: boolean;
}
