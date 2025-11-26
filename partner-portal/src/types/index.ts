export interface Partner {
  id: string;
  user_id: string;
  business_name: string;
  stripe_account_id: string | null;
  stripe_onboarding_complete: boolean;
  stripe_charges_enabled: boolean;
  stripe_payouts_enabled: boolean;
  status: 'pending' | 'active' | 'suspended' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Gym {
  id: number;
  owner_id: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  website: string | null;
  rating: number;
  review_count: number;
  day_pass_price: number | null;
  week_pass_price: number | null;
  month_pass_price: number | null;
  google_place_id: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface GymHours {
  id: number;
  gym_id: number;
  day_of_week: number; // 0-6 (Sunday-Saturday)
  opens_at: string | null; // HH:MM format
  closes_at: string | null; // HH:MM format
  is_closed: boolean;
}

export interface Amenity {
  id: number;
  name: string;
  icon: string | null;
}

export interface GymAmenity {
  id: number;
  gym_id: number;
  amenity_id: number;
  amenity?: Amenity;
}

export interface Booking {
  id: number;
  user_id: string;
  gym_id: number;
  booking_date: string;
  pass_type: 'day' | 'week' | 'month';
  status: 'confirmed' | 'used' | 'cancelled';
  amount_paid: number;
  platform_fee: number;
  gym_payout: number;
  stripe_payment_intent_id: string | null;
  qr_scanned_at: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    first_name: string | null;
    last_name: string | null;
    email: string;
  };
}

export interface FinancialSummary {
  total_revenue: number;
  total_payouts: number;
  pending_payouts: number;
  platform_fees_paid: number;
  bookings_count: number;
}

export interface Transaction {
  id: number;
  booking_id: number;
  date: string;
  customer_name: string;
  customer_email: string;
  amount: number;
  fee: number;
  net: number;
  status: string;
  pass_type: string;
}

export interface DashboardStats {
  today_bookings: number;
  week_revenue: number;
  pending_checkins: number;
  total_customers: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  bookings: number;
}
