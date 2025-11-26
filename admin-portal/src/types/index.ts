export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'super_admin';
  created_at: string;
}

export interface PlatformStats {
  total_users: number;
  users_growth: number;
  active_partners: number;
  partners_growth: number;
  monthly_revenue: number;
  revenue_growth: number;
  open_tickets: number;
  tickets_growth: number;
}

export interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Partner {
  id: string;
  user_id: string;
  business_name: string;
  stripe_account_id: string | null;
  stripe_onboarding_complete: boolean;
  status: 'pending' | 'active' | 'suspended' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Gym {
  id: number;
  owner_id: string;
  name: string;
  city: string;
  state: string;
  rating: number;
  review_count: number;
  is_verified: boolean;
  created_at: string;
}

export interface AnalyticsData {
  date: string;
  users: number;
  bookings: number;
  revenue: number;
}

export interface ActivityItem {
  id: string;
  type: 'partner_application' | 'support_ticket' | 'content_moderation' | 'gym_claim';
  title: string;
  description: string;
  created_at: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}
