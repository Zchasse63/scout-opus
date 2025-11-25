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
  intent: 'search_gyms' | 'get_details' | 'book_pass' | 'check_schedule';
  location?: { query: string; useCurrentLocation: boolean };
  facilityTypes: string[];
  amenities: string[];
  timeConstraint?: string;
  priceConstraint?: { max: number };
}

// Booking Types
export interface Booking {
  id: string;
  userId: string;
  gymId: string;
  bookingDate: string;
  passType: 'day' | 'week' | 'month';
  status: 'confirmed' | 'used' | 'cancelled';
  amountPaid: number;
  qrCode?: string;
  qrScannedAt?: string;
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
