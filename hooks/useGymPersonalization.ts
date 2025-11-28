import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface GymPersonalization {
  gymId: string;
  matchScore: number;
  reasons: string[];
}

interface PersonalizationResponse {
  personalizations: GymPersonalization[];
}

/**
 * Fetch personalized "Why this gym" recommendations for a list of gyms
 * Returns match scores and reasons based on user's booking history
 */
async function fetchPersonalizations(
  userId: string,
  gymIds: string[]
): Promise<GymPersonalization[]> {
  if (!userId || gymIds.length === 0) {
    return [];
  }

  try {
    const { data, error } = await supabase.functions.invoke<PersonalizationResponse>(
      'gym-personalize',
      {
        body: { userId, gymIds },
      }
    );

    if (error) {
      console.error('Personalization error:', error);
      return [];
    }

    return data?.personalizations || [];
  } catch (err) {
    console.error('Failed to fetch personalizations:', err);
    return [];
  }
}

export function useGymPersonalization(gymIds: string[]) {
  return useQuery({
    queryKey: ['gym-personalization', gymIds],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      return fetchPersonalizations(user.id, gymIds);
    },
    enabled: gymIds.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes - personalizations don't change often
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
  });
}

/**
 * Get personalization for a single gym from the cached results
 */
export function getGymPersonalization(
  personalizations: GymPersonalization[] | undefined,
  gymId: string
): GymPersonalization | undefined {
  return personalizations?.find((p) => p.gymId === gymId);
}

