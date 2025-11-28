/**
 * Centralized icon definitions for Scout app
 * Replaces emoji icons with Lucide React Native icons
 */

import {
  Heart,
  X,
  Share2,
  MapPin,
  Star,
  Clock,
  Dumbbell,
  Bike,
  Waves,
  Flame,
  PersonStanding,
  Sparkles,
  Search,
  Calendar,
  Ticket,
  Plane,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  Info,
  Filter,
  SlidersHorizontal,
  Navigation,
  Zap,
  Shield,
  Award,
  TrendingUp,
  Users,
  CircleDot,
  type LucideIcon,
} from 'lucide-react-native';

// Icon size constants
export const iconSizes = {
  xxs: 10,
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// Action icons
export const ActionIcons = {
  close: X,
  back: ChevronLeft,
  forward: ChevronRight,
  share: Share2,
  save: Heart,
  filter: Filter,
  settings: SlidersHorizontal,
  search: Search,
  check: Check,
  info: Info,
  alert: AlertCircle,
} as const;

// Navigation/Tab icons
export const NavIcons = {
  explore: Search,
  passes: Ticket,
  trips: Plane,
  profile: User,
} as const;

// Filter/Category icons (replacing emojis in filters.ts)
export const FilterIcons: Record<string, LucideIcon> = {
  gym: Dumbbell,
  yoga: PersonStanding,
  crossfit: Flame,
  cycling: Bike,
  boxing: Zap,
  sauna: Sparkles,
  pool: Waves,
  '24hr': Clock,
} as const;

// Gym detail icons
export const GymIcons = {
  location: MapPin,
  rating: Star,
  time: Clock,
  calendar: Calendar,
  amenity: Check,
  navigation: Navigation,
} as const;

// Badge/Status icons
export const BadgeIcons = {
  verified: Shield,
  popular: TrendingUp,
  new: Sparkles,
  award: Award,
  users: Users,
  live: CircleDot,
} as const;

// Empty state icons
export const EmptyStateIcons = {
  noGyms: Dumbbell,
  noBookings: Ticket,
  noTrips: Plane,
  noSaved: Heart,
  noResults: Search,
} as const;

// Helper to get filter icon by id
export const getFilterIcon = (filterId: string): LucideIcon => {
  return FilterIcons[filterId] || Dumbbell;
};

// Default icon props
export const defaultIconProps = {
  strokeWidth: 2,
} as const;

