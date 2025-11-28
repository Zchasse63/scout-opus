/**
 * Shared type definitions
 */

import type { PassType, BookingStatus, TicketStatus, TicketPriority, CalendarSource } from './constants';

// API Response wrapper
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

// User
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  pushToken?: string;
  createdAt: string;
}

// Gym
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
  description?: string;
  googlePlaceId?: string;
}

// Booking
export interface Booking {
  id: number;
  userId: string;
  gymId: number;
  bookingDate: string;
  passType: PassType;
  status: BookingStatus;
  amountPaid: number;
  qrCode?: string;
  createdAt: string;
  gym?: Pick<Gym, 'name' | 'address'>;
}

// Review
export interface Review {
  id: number;
  userId: string;
  gymId: number;
  bookingId: number;
  rating: number;
  comment?: string;
  helpfulCount: number;
  createdAt: string;
  user?: Pick<User, 'firstName' | 'lastName' | 'avatarUrl'>;
}

// Support Ticket
export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
}

// Travel Period
export interface TravelPeriod {
  id: number;
  userId: string;
  destinationCity: string;
  destinationState?: string;
  destinationCountry: string;
  destinationLat: number;
  destinationLng: number;
  startDate: string;
  endDate: string;
  confidenceScore?: number;
  source: CalendarSource;
  dismissed: boolean;
}

// Gamification Stats
export interface GamificationStats {
  totalPoints: number;
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  gymsVisited: number;
  citiesVisited: number;
  totalWorkouts: number;
  unlockedBadges: string[];
}

// Partner
export interface Partner {
  id: string;
  userId: string;
  gymId: number;
  stripeAccountId?: string;
  stripeOnboardingComplete: boolean;
  createdAt: string;
}

// Partner Application
export interface PartnerApplication {
  id: string;
  gymName: string;
  address: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
}

// Voice Query Result
export interface VoiceQueryResult {
  transcript: string;
  parsedIntent: {
    intent: 'search_gyms' | 'refine_search' | 'compare' | 'get_details' | 'book_pass';
    location?: { query: string; useCurrent: boolean };
    facilityTypes?: string[];
    requiredAmenities?: string[];
    priceConstraint?: { max: number };
    sortBy?: 'distance' | 'price' | 'rating';
    confidence: number;
  };
}

