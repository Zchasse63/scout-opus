import { renderHook, act } from '@testing-library/react-native';
import { useSearchStore } from '../searchStore';

describe('searchStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useSearchStore());
    act(() => {
      result.current.clearSearch();
    });
  });

  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useSearchStore());

    expect(result.current.query).toBe('');
    expect(result.current.results).toEqual([]);
    expect(result.current.viewMode).toBe('list');
    expect(result.current.selectedGymId).toBe(null);
  });

  it('should set search query', () => {
    const { result } = renderHook(() => useSearchStore());

    act(() => {
      result.current.setQuery('powerlifting gym');
    });

    expect(result.current.query).toBe('powerlifting gym');
  });

  it('should set location', () => {
    const { result } = renderHook(() => useSearchStore());

    const location = {
      latitude: 40.7128,
      longitude: -74.006,
      address: 'New York, NY',
    };

    act(() => {
      result.current.setLocation(location);
    });

    expect(result.current.location).toEqual(location);
  });

  it('should set filters', () => {
    const { result } = renderHook(() => useSearchStore());

    const filters = {
      facilityTypes: ['gym', 'crossfit'],
      amenities: ['showers', 'lockers'],
      priceRange: { min: 10, max: 30 },
      rating: 4,
      distance: 5,
      isOpenNow: true,
      hasAvailability: true,
    };

    act(() => {
      result.current.setFilters(filters);
    });

    expect(result.current.filters).toEqual(filters);
  });

  it('should toggle view mode', () => {
    const { result } = renderHook(() => useSearchStore());

    expect(result.current.viewMode).toBe('list');

    act(() => {
      result.current.setViewMode('map');
    });

    expect(result.current.viewMode).toBe('map');
  });

  it('should set selected gym', () => {
    const { result } = renderHook(() => useSearchStore());

    act(() => {
      result.current.setSelectedGymId('gym-123');
    });

    expect(result.current.selectedGymId).toBe('gym-123');
  });

  it('should clear selected gym', () => {
    const { result } = renderHook(() => useSearchStore());

    act(() => {
      result.current.setSelectedGymId('gym-123');
      result.current.setSelectedGymId(null);
    });

    expect(result.current.selectedGymId).toBe(null);
  });

  it('should add recent search', () => {
    const { result } = renderHook(() => useSearchStore());

    act(() => {
      result.current.addRecentSearch('powerlifting gym');
    });

    expect(result.current.recentSearches).toContain('powerlifting gym');
  });

  it('should limit recent searches to 10', () => {
    const { result } = renderHook(() => useSearchStore());

    act(() => {
      for (let i = 0; i < 12; i++) {
        result.current.addRecentSearch(`search ${i}`);
      }
    });

    expect(result.current.recentSearches).toHaveLength(10);
  });

  it('should not add duplicate recent searches', () => {
    const { result } = renderHook(() => useSearchStore());

    act(() => {
      result.current.addRecentSearch('powerlifting gym');
      result.current.addRecentSearch('powerlifting gym');
    });

    const count = result.current.recentSearches.filter(
      (s) => s === 'powerlifting gym'
    ).length;
    expect(count).toBe(1);
  });

  it('should clear search and reset state', () => {
    const { result } = renderHook(() => useSearchStore());

    act(() => {
      result.current.setQuery('test query');
      result.current.setSelectedGymId('gym-123');
      result.current.clearSearch();
    });

    expect(result.current.query).toBe('');
    expect(result.current.selectedGymId).toBe(null);
  });
});
