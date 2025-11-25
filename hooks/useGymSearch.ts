import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Gym } from '../types';

interface SearchOptions {
  latitude?: number;
  longitude?: number;
  filters?: string[];
  query?: string;
}

export function useGymSearch(options: SearchOptions = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<string[]>(options.filters || []);

  const { data: results, isLoading, error, refetch } = useQuery({
    queryKey: ['gyms', searchQuery, filters, options.latitude, options.longitude],
    queryFn: async () => {
      if (!searchQuery && filters.length === 0) {
        return [];
      }

      try {
        // Build search query combining text and filters
        const textQuery = [searchQuery, ...filters].filter(Boolean).join(' ');

        // Call Edge Function to search via Google Places API
        const { data, error } = await supabase.functions.invoke('places-search', {
          body: {
            textQuery,
            latitude: options.latitude,
            longitude: options.longitude,
          },
        });

        if (error) {
          console.error('Places search error:', error);
          return [];
        }

        // Transform Places API results to Gym format
        return transformPlacesToGyms(data || []);
      } catch (err) {
        console.error('useGymSearch error:', err);
        return [];
      }
    },
    enabled: searchQuery.length > 0 || filters.length > 0,
  });

  const toggleFilter = useCallback((filterId: string) => {
    setFilters((prev) =>
      prev.includes(filterId) ? prev.filter((f) => f !== filterId) : [...prev, filterId]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setFilters([]);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    filters,
    toggleFilter,
    clearFilters,
    results: (results as Gym[]) || [],
    isLoading,
    error,
    refetch,
  };
}

/**
 * Transform Google Places API results to Gym format
 */
function transformPlacesToGyms(places: any[]): Gym[] {
  return places.map((place) => ({
    id: place.id || place.placeId,
    name: place.name || place.displayName?.text || '',
    address: place.formattedAddress || place.address || '',
    latitude: place.location?.latitude || 0,
    longitude: place.location?.longitude || 0,
    rating: place.rating || 0,
    reviewCount: place.userRatingCount || 0,
    dayPassPrice: place.dayPassPrice || 25, // Default price
    weekPassPrice: place.weekPassPrice,
    monthPassPrice: place.monthPassPrice,
    amenities: place.types || [],
    photos: (place.photos || []).map((photo: any) => photo.name || ''),
    description: place.editorialSummary?.text || '',
    googlePlaceId: place.id,
    hours: transformHours(place.currentOpeningHours),
  }));
}

/**
 * Transform opening hours to GymHours format
 */
function transformHours(hours: any) {
  if (!hours || !hours.weekdayDescriptions) {
    return undefined;
  }

  const dayMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const transformed: any = {};

  hours.weekdayDescriptions.forEach((desc: string, index: number) => {
    const day = dayMap[index];
    const time = desc.split(': ')[1];
    transformed[day] = time || 'Closed';
  });

  return transformed;
}
