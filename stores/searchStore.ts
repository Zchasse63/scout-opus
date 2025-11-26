import { create } from 'zustand';

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

    set({ isLoading: true, error: null });

    try {
      // TODO: Implement actual search API call
      // This would call your places-search Edge Function

      // For now, simulate with a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock results
      const mockResults: SearchResult[] = [
        {
          id: '1',
          name: 'Iron Temple Fitness',
          address: '123 Main St, Tampa, FL 33601',
          latitude: 27.9506,
          longitude: -82.4572,
          rating: 4.8,
          reviewCount: 124,
          dayPassPrice: 25,
          primaryPhoto: 'https://via.placeholder.com/400x300',
          distance: 0.8,
          amenities: ['Sauna', 'Pool', 'WiFi'],
          isVerified: true,
          isOpen: true,
        },
        // Add more mock results...
      ];

      set({ results: mockResults, isLoading: false });

      // Add to recent searches if query exists
      if (query.trim()) {
        get().addRecentSearch(query.trim());
      }
    } catch (error) {
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
