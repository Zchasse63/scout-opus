import { useState, useCallback } from 'react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Gym } from '../types';

interface SearchOptions {
  latitude?: number;
  longitude?: number;
  filters?: string[];
  query?: string;
  pageSize?: number;
}

interface PlacesSearchResponse {
  places: unknown[];
  nextPageToken?: string;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export function useGymSearch(options: SearchOptions = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<string[]>(options.filters || []);
  const pageSize = options.pageSize || 20;

  const {
    data,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['gyms', searchQuery, filters, options.latitude, options.longitude, pageSize],
    queryFn: async ({ pageParam }) => {
      if (!searchQuery && filters.length === 0) {
        return { places: [], page: 1, pageSize, hasMore: false } as PlacesSearchResponse;
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
            pageSize,
            pageToken: pageParam,
          },
        });

        if (error) {
          console.error('Places search error:', error);
          return { places: [], page: 1, pageSize, hasMore: false } as PlacesSearchResponse;
        }

        return data as PlacesSearchResponse;
      } catch (err) {
        console.error('useGymSearch error:', err);
        return { places: [], page: 1, pageSize, hasMore: false } as PlacesSearchResponse;
      }
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextPageToken,
    enabled: searchQuery.length > 0 || filters.length > 0,
  });

  // Flatten all pages into a single array of gyms
  const results = data?.pages.flatMap((page) => transformPlacesToGyms(page.places || [])) || [];

  const toggleFilter = useCallback((filterId: string) => {
    setFilters((prev) =>
      prev.includes(filterId) ? prev.filter((f) => f !== filterId) : [...prev, filterId]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setFilters([]);
  }, []);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    searchQuery,
    setSearchQuery,
    filters,
    toggleFilter,
    clearFilters,
    results: results as Gym[],
    isLoading,
    error,
    refetch,
    // Pagination
    loadMore,
    hasNextPage: hasNextPage || false,
    isFetchingNextPage,
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
