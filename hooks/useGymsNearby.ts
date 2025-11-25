import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Gym } from '../types';

interface NearbyGymResult {
  id: number;
  name: string;
  address: string;
  distance_meters: number;
  rating: number;
  day_pass_price: number;
}

async function fetchGymsNearby(
  latitude: number,
  longitude: number,
  radiusMeters: number = 5000
): Promise<Gym[]> {
  const { data, error } = await supabase.rpc('search_gyms_nearby', {
    lat: latitude,
    lng: longitude,
    radius_meters: radiusMeters,
  });

  if (error) {
    throw new Error(`Failed to fetch nearby gyms: ${error.message}`);
  }

  if (!data) {
    return [];
  }

  // Transform minimal data to Gym type (for list view)
  return (data as NearbyGymResult[]).map((gym) => ({
    id: gym.id.toString(),
    name: gym.name,
    address: gym.address,
    latitude: 0, // Will be fetched when viewing details
    longitude: 0,
    rating: gym.rating,
    reviewCount: 0, // Not included in RPC result
    dayPassPrice: gym.day_pass_price,
    amenities: [],
    photos: [],
    description: '',
  }));
}

export function useGymsNearby(
  latitude: number | undefined,
  longitude: number | undefined,
  radiusMeters?: number
) {
  return useQuery({
    queryKey: ['gyms', 'nearby', latitude, longitude, radiusMeters],
    queryFn: () => {
      if (latitude === undefined || longitude === undefined) {
        throw new Error('Location is required');
      }
      return fetchGymsNearby(latitude, longitude, radiusMeters ?? 5000);
    },
    enabled: latitude !== undefined && longitude !== undefined,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
