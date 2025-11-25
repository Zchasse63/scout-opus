import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Gym, GymHours } from '../types';

interface GymRow {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  rating: number;
  review_count: number;
  day_pass_price: number;
  week_pass_price: number | null;
  month_pass_price: number | null;
  description: string | null;
  google_place_id: string | null;
  gym_amenities: Array<{
    amenities: {
      name: string;
    };
  }>;
  gym_photos: Array<{
    url: string;
    display_order: number;
  }>;
  gym_hours: Array<{
    day_of_week: number;
    opens_at: string | null;
    closes_at: string | null;
    is_closed: boolean;
  }>;
}

function transformGymData(row: GymRow): Gym {
  // Transform hours array to GymHours object
  const hours: Record<string, string> = {};
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  row.gym_hours.forEach((h) => {
    const dayName = dayNames[h.day_of_week];
    if (h.is_closed) {
      hours[dayName] = 'Closed';
    } else if (h.opens_at && h.closes_at) {
      hours[dayName] = `${h.opens_at} - ${h.closes_at}`;
    }
  });

  return {
    id: row.id.toString(),
    name: row.name,
    address: row.address,
    latitude: row.latitude,
    longitude: row.longitude,
    rating: row.rating,
    reviewCount: row.review_count,
    dayPassPrice: row.day_pass_price,
    weekPassPrice: row.week_pass_price ?? undefined,
    monthPassPrice: row.month_pass_price ?? undefined,
    amenities: row.gym_amenities.map((ga) => ga.amenities.name),
    photos: row.gym_photos
      .sort((a, b) => a.display_order - b.display_order)
      .map((p) => p.url),
    description: row.description || '',
    googlePlaceId: row.google_place_id ?? undefined,
    hours: Object.keys(hours).length > 0 ? (hours as GymHours) : undefined,
  };
}

async function fetchGymById(gymId: string): Promise<Gym> {
  const { data, error } = await supabase
    .from('gyms')
    .select(`
      *,
      gym_amenities(amenities(name)),
      gym_photos(url, display_order),
      gym_hours(day_of_week, opens_at, closes_at, is_closed)
    `)
    .eq('id', gymId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch gym: ${error.message}`);
  }

  if (!data) {
    throw new Error('Gym not found');
  }

  return transformGymData(data as GymRow);
}

export function useGym(gymId: string | undefined) {
  return useQuery({
    queryKey: ['gym', gymId],
    queryFn: () => {
      if (!gymId) {
        throw new Error('Gym ID is required');
      }
      return fetchGymById(gymId);
    },
    enabled: !!gymId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
