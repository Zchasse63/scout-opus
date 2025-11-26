import { create } from 'zustand';
import { supabase } from '../lib/supabase';

// Helper: Calculate distance between two coordinates in miles
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // Round to 1 decimal
}

// Helper: Extract amenities from Google Places data
function extractAmenities(place: any): string[] {
  const amenities: string[] = [];

  // Check for common gym amenities based on place types or features
  // Note: Google Places API doesn't provide detailed amenities, so we infer from data
  if (place.types?.includes('spa')) amenities.push('Spa');
  if (place.types?.includes('swimming_pool')) amenities.push('Pool');

  // If place has generative summary, we could parse it for amenities
  // For now, return common defaults
  if (amenities.length === 0) {
    return ['Weights', 'Cardio'];
  }

  return amenities;
}

// Helper: Check if place is currently open
function isPlaceOpen(openingHours: any): boolean {
  if (!openingHours?.periods) return false;

  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday
  const currentTime = now.getHours() * 100 + now.getMinutes();

  const todaysPeriods = openingHours.periods.filter(
    (period: any) => period.open?.day === dayOfWeek
  );

  for (const period of todaysPeriods) {
    const openTime = parseInt(period.open?.time || '0000', 10);
    const closeTime = parseInt(period.close?.time || '2359', 10);

    if (currentTime >= openTime && currentTime <= closeTime) {
      return true;
    }
  }

  return false;
}

export interface SearchFilters {
  facilityTypes: string[];
  amenities: string[];
  priceRange: {
    min: number;
    max: number;
  } | null;
  rating: number | null;
  distance: number | null; // in miles
  isOpenNow: boolean;
  hasAvailability: boolean;
}

export interface SearchLocation {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
}

export interface SearchResult {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  dayPassPrice: number;
  primaryPhoto: string;
  distance: number;
  amenities: string[];
  isVerified: boolean;
  isOpen: boolean;
}

interface SearchStore {
  // Query state
  query: string;
  setQuery: (query: string) => void;

  // Location state
  location: SearchLocation | null;
  setLocation: (location: SearchLocation) => void;

  // Filters state
  filters: SearchFilters;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;

  // Results state
  results: SearchResult[];
  setResults: (results: SearchResult[]) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;

  // View state
  viewMode: 'list' | 'map';
  setViewMode: (mode: 'list' | 'map') => void;

  // Selected gym (for map preview)
  selectedGymId: string | null;
  setSelectedGymId: (id: string | null) => void;

  // Recent searches
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;

  // Saved gyms
  savedGymIds: Set<string>;
  toggleSavedGym: (id: string) => void;

  // Actions
  search: () => Promise<void>;
  clearSearch: () => void;
}

const DEFAULT_FILTERS: SearchFilters = {
  facilityTypes: [],
  amenities: [],
  priceRange: null,
  rating: null,
  distance: null,
  isOpenNow: false,
  hasAvailability: false,
};

export const useSearchStore = create<SearchStore>((set, get) => ({
  // Initial state
  query: '',
  location: null,
  filters: DEFAULT_FILTERS,
  results: [],
  isLoading: false,
  error: null,
  viewMode: 'list',
  selectedGymId: null,
  recentSearches: [],
  savedGymIds: new Set(),

  // Query actions
  setQuery: (query) => set({ query }),

  // Location actions
  setLocation: (location) => set({ location }),

  // Filter actions
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  // Results actions
  setResults: (results) => set({ results }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // View actions
  setViewMode: (viewMode) => set({ viewMode }),

  // Selected gym actions
  setSelectedGymId: (selectedGymId) => set({ selectedGymId }),

  // Recent searches
  addRecentSearch: (query) =>
    set((state) => ({
      recentSearches: [
        query,
        ...state.recentSearches.filter((q) => q !== query),
      ].slice(0, 10), // Keep last 10 searches
    })),

  clearRecentSearches: () => set({ recentSearches: [] }),

  // Saved gyms
  toggleSavedGym: (id) =>
    set((state) => {
      const newSavedGymIds = new Set(state.savedGymIds);
      if (newSavedGymIds.has(id)) {
        newSavedGymIds.delete(id);
      } else {
        newSavedGymIds.add(id);
      }
      return { savedGymIds: newSavedGymIds };
    }),

  // Search action
  search: async () => {
    const { query, location, filters } = get();

    if (!location) {
      set({ error: 'Location required for search', isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      // Build search query - include amenities/facility types in query if filtered
      let searchQuery = query.trim() || 'gym fitness center';

      // Add filter terms to query for better Google Places results
      if (filters.facilityTypes.length > 0) {
        searchQuery += ` ${filters.facilityTypes.join(' ')}`;
      }
      if (filters.amenities.length > 0) {
        searchQuery += ` ${filters.amenities.slice(0, 3).join(' ')}`; // Limit to 3 amenities
      }

      // Call the places-search Edge Function
      const { data, error: functionError } = await supabase.functions.invoke('places-search', {
        body: {
          textQuery: searchQuery,
          locationBias: {
            circle: {
              center: {
                latitude: location.latitude,
                longitude: location.longitude,
              },
              radius: (filters.distance || 10) * 1609.34, // Convert miles to meters
            },
          },
          includedType: 'gym',
        },
      });

      if (functionError) {
        throw new Error(functionError.message || 'Search failed');
      }

      // Transform Google Places API response to SearchResult format
      const places = data?.places || [];
      const results: SearchResult[] = places.map((place: any) => {
        // Calculate distance from user location
        const placeLatLng = place.location;
        const distance = calculateDistance(
          location.latitude,
          location.longitude,
          placeLatLng.latitude,
          placeLatLng.longitude
        );

        // Get the first photo reference if available
        const photoReference = place.photos?.[0]?.name || null;
        const photoUrl = photoReference
          ? `https://places.googleapis.com/v1/${photoReference}/media?maxHeightPx=400&key=${process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY}`
          : 'https://via.placeholder.com/400x300?text=No+Image';

        return {
          id: place.id,
          name: place.displayName?.text || 'Unknown Gym',
          address: place.formattedAddress || '',
          latitude: placeLatLng.latitude,
          longitude: placeLatLng.longitude,
          rating: place.rating || 0,
          reviewCount: place.userRatingCount || 0,
          dayPassPrice: 25, // Default - will be fetched from our DB
          primaryPhoto: photoUrl,
          distance,
          amenities: extractAmenities(place),
          isVerified: false, // From our DB
          isOpen: isPlaceOpen(place.regularOpeningHours),
        };
      });

      // Apply client-side filters
      let filteredResults = results;

      // Filter by price range
      if (filters.priceRange) {
        filteredResults = filteredResults.filter(
          (r) => r.dayPassPrice >= filters.priceRange!.min && r.dayPassPrice <= filters.priceRange!.max
        );
      }

      // Filter by minimum rating
      if (filters.rating) {
        filteredResults = filteredResults.filter((r) => r.rating >= filters.rating!);
      }

      // Filter by open now
      if (filters.isOpenNow) {
        filteredResults = filteredResults.filter((r) => r.isOpen);
      }

      // Sort by distance
      filteredResults.sort((a, b) => a.distance - b.distance);

      set({ results: filteredResults, isLoading: false });

      // Add to recent searches if query exists
      if (query.trim()) {
        get().addRecentSearch(query.trim());
      }
    } catch (error) {
      console.error('Search error:', error);
      set({
        error: error instanceof Error ? error.message : 'Search failed',
        isLoading: false,
      });
    }
  },

  // Clear search
  clearSearch: () =>
    set({
      query: '',
      results: [],
      filters: DEFAULT_FILTERS,
      error: null,
      selectedGymId: null,
    }),
}));
