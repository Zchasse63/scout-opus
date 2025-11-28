import { renderHook, act } from '@testing-library/react-native';
import { useTripsStore } from '../tripsStore';
import type { TravelPeriod } from '../../types';

const mockTrip: TravelPeriod = {
  id: 'trip-1',
  userId: 'user-1',
  destinationCity: 'New York',
  destinationState: 'NY',
  destinationCountry: 'USA',
  destinationLat: 40.7128,
  destinationLng: -74.006,
  startDate: '2025-01-01',
  endDate: '2025-01-05',
  confidenceScore: 0.9,
  source: 'manual',
};

describe('tripsStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useTripsStore());
    act(() => {
      result.current.setTrips([], []);
    });
  });

  it('should initialize with empty trips', () => {
    const { result } = renderHook(() => useTripsStore());
    expect(result.current.upcomingTrips).toEqual([]);
    expect(result.current.pastTrips).toEqual([]);
  });

  it('should add a new trip', () => {
    const { result } = renderHook(() => useTripsStore());
    act(() => {
      result.current.addTrip(mockTrip);
    });
    expect(result.current.upcomingTrips).toHaveLength(1);
    expect(result.current.upcomingTrips[0].destinationCity).toBe('New York');
  });

  it('should remove a trip', () => {
    const { result } = renderHook(() => useTripsStore());
    act(() => {
      result.current.addTrip(mockTrip);
    });
    act(() => {
      result.current.removeTrip('trip-1');
    });
    expect(result.current.upcomingTrips).toHaveLength(0);
  });

  it('should set loading state', () => {
    const { result } = renderHook(() => useTripsStore());
    act(() => {
      result.current.setIsLoading(true);
    });
    expect(result.current.isLoading).toBe(true);
  });

  it('should set error state', () => {
    const { result } = renderHook(() => useTripsStore());
    act(() => {
      result.current.setError('Something went wrong');
    });
    expect(result.current.error).toBe('Something went wrong');
  });

  it('should set trips for both upcoming and past', () => {
    const { result } = renderHook(() => useTripsStore());
    const pastTrip: TravelPeriod = {
      ...mockTrip,
      id: 'trip-2',
      destinationCity: 'Los Angeles',
      destinationState: 'CA',
    };
    act(() => {
      result.current.setTrips([mockTrip], [pastTrip]);
    });
    expect(result.current.upcomingTrips).toHaveLength(1);
    expect(result.current.pastTrips).toHaveLength(1);
    expect(result.current.upcomingTrips[0].destinationCity).toBe('New York');
    expect(result.current.pastTrips[0].destinationCity).toBe('Los Angeles');
  });
});

