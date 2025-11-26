import { QueryClient } from '@tanstack/react-query';

// Optimized query client configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes
      staleTime: 5 * 60 * 1000,
      
      // Keep unused data in cache for 30 minutes
      gcTime: 30 * 60 * 1000,
      
      // Retry failed requests up to 2 times
      retry: 2,
      
      // Exponential backoff for retries
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Don't refetch on window focus in mobile
      refetchOnWindowFocus: false,
      
      // Don't refetch on reconnect automatically
      refetchOnReconnect: 'always',
      
      // Network mode - always try to fetch
      networkMode: 'offlineFirst',
    },
    mutations: {
      // Retry mutations once
      retry: 1,
      
      // Network mode for mutations
      networkMode: 'offlineFirst',
    },
  },
});

// Query keys factory for type-safe and consistent keys
export const queryKeys = {
  // Gyms
  gyms: {
    all: ['gyms'] as const,
    lists: () => [...queryKeys.gyms.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.gyms.lists(), filters] as const,
    details: () => [...queryKeys.gyms.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.gyms.details(), id] as const,
    search: (query: string, filters?: Record<string, unknown>) => 
      [...queryKeys.gyms.all, 'search', query, filters] as const,
    nearby: (lat: number, lng: number, radius: number) => 
      [...queryKeys.gyms.all, 'nearby', lat, lng, radius] as const,
  },
  
  // Bookings
  bookings: {
    all: ['bookings'] as const,
    lists: () => [...queryKeys.bookings.all, 'list'] as const,
    list: (userId: string) => [...queryKeys.bookings.lists(), userId] as const,
    details: () => [...queryKeys.bookings.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.bookings.details(), id] as const,
    upcoming: (userId: string) => [...queryKeys.bookings.all, 'upcoming', userId] as const,
    past: (userId: string) => [...queryKeys.bookings.all, 'past', userId] as const,
  },
  
  // User
  user: {
    all: ['user'] as const,
    profile: (id: string) => [...queryKeys.user.all, 'profile', id] as const,
    stats: (id: string) => [...queryKeys.user.all, 'stats', id] as const,
    preferences: (id: string) => [...queryKeys.user.all, 'preferences', id] as const,
  },
  
  // Reviews
  reviews: {
    all: ['reviews'] as const,
    byGym: (gymId: string) => [...queryKeys.reviews.all, 'gym', gymId] as const,
    byUser: (userId: string) => [...queryKeys.reviews.all, 'user', userId] as const,
  },
  
  // Trips
  trips: {
    all: ['trips'] as const,
    list: (userId: string) => [...queryKeys.trips.all, 'list', userId] as const,
    upcoming: (userId: string) => [...queryKeys.trips.all, 'upcoming', userId] as const,
  },
  
  // Leaderboard
  leaderboard: {
    all: ['leaderboard'] as const,
    global: () => [...queryKeys.leaderboard.all, 'global'] as const,
    friends: (userId: string) => [...queryKeys.leaderboard.all, 'friends', userId] as const,
  },
} as const;

// Prefetch utilities
export async function prefetchGymDetails(gymId: string) {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.gyms.detail(gymId),
    staleTime: 5 * 60 * 1000,
  });
}

export async function prefetchUserBookings(userId: string) {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.bookings.list(userId),
    staleTime: 2 * 60 * 1000,
  });
}

// Invalidation utilities
export function invalidateGymQueries() {
  queryClient.invalidateQueries({ queryKey: queryKeys.gyms.all });
}

export function invalidateBookingQueries() {
  queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
}

export function invalidateUserQueries(userId: string) {
  queryClient.invalidateQueries({ queryKey: queryKeys.user.profile(userId) });
  queryClient.invalidateQueries({ queryKey: queryKeys.user.stats(userId) });
}

