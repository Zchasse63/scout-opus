/**
 * useGymReviews - Hook for fetching gym reviews
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface Review {
  id: string;
  gymId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title?: string;
  content: string;
  photos?: string[];
  createdAt: string;
  helpful: number;
  ownerResponse?: {
    content: string;
    createdAt: string;
  };
  categories?: {
    cleanliness: number;
    equipment: number;
    value: number;
    staff: number;
    location: number;
  };
}

export interface ReviewsData {
  reviews: Review[];
  totalCount: number;
  averageRating: number;
  ratingBreakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  categoryAverages?: {
    cleanliness: number;
    equipment: number;
    value: number;
    staff: number;
    location: number;
  };
}

async function fetchGymReviews(gymId: string): Promise<ReviewsData> {
  // Fetch reviews from consolidated reviews table
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select(`
      id,
      user_id,
      rating,
      title,
      comment,
      helpful_count,
      created_at,
      has_verified_booking,
      users:user_id (
        first_name,
        last_name,
        avatar_url
      )
    `)
    .eq('gym_id', gymId)
    .eq('moderation_status', 'approved')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }

  // Transform database rows to Review interface
  const transformedReviews: Review[] = (reviews || []).map((r: any) => ({
    id: String(r.id),
    gymId,
    userId: r.user_id,
    userName: r.users?.first_name
      ? `${r.users.first_name} ${r.users.last_name?.charAt(0) || ''}.`
      : 'Anonymous',
    userAvatar: r.users?.avatar_url,
    rating: r.rating,
    title: r.title,
    content: r.comment || '',
    createdAt: r.created_at,
    helpful: r.helpful_count || 0,
  }));

  // Calculate rating breakdown
  const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  transformedReviews.forEach(r => {
    if (r.rating >= 1 && r.rating <= 5) {
      ratingBreakdown[r.rating as keyof typeof ratingBreakdown]++;
    }
  });

  const totalCount = transformedReviews.length;
  const averageRating = totalCount > 0
    ? transformedReviews.reduce((sum, r) => sum + r.rating, 0) / totalCount
    : 0;

  return {
    reviews: transformedReviews,
    totalCount,
    averageRating,
    ratingBreakdown,
  };
}

export function useGymReviews(gymId: string | undefined) {
  return useQuery({
    queryKey: ['gymReviews', gymId],
    queryFn: () => fetchGymReviews(gymId!),
    enabled: !!gymId,
    staleTime: 5 * 60 * 1000,
  });
}

export default useGymReviews;

