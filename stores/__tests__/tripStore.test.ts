import { renderHook, act } from '@testing-library/react-hooks';
import { useTripStore } from '../tripStore';

const mockGym = {
  id: 'gym-1',
  name: 'Test Gym',
  address: '123 Main St',
  rating: 4.5,
  reviewCount: 100,
  dayPassPrice: 20,
  primaryPhoto: 'https://example.com/photo.jpg',
  isVerified: true,
  distance: 1.5,
};

const mockTrip = {
  destination: 'New York',
  startDate: '2025-12-01',
  endDate: '2025-12-05',
  status: 'upcoming' as const,
  isAutoDetected: false,
};

describe('tripStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useTripStore());
    act(() => {
      result.current.setTrips([]);
    });
  });

  it('should initialize with empty trips', () => {
    const { result } = renderHook(() => useTripStore());
    expect(result.current.trips).toEqual([]);
  });

  it('should add a new trip', () => {
    const { result } = renderHook(() => useTripStore());

    act(() => {
      result.current.addTrip(mockTrip);
    });

    expect(result.current.trips).toHaveLength(1);
    expect(result.current.trips[0].destination).toBe('New York');
    expect(result.current.trips[0]).toHaveProperty('id');
    expect(result.current.trips[0]).toHaveProperty('createdAt');
    expect(result.current.trips[0].gyms).toEqual([]);
  });

  it('should update a trip', () => {
    const { result } = renderHook(() => useTripStore());

    act(() => {
      result.current.addTrip(mockTrip);
    });

    const tripId = result.current.trips[0].id;

    act(() => {
      result.current.updateTrip(tripId, {
        destination: 'Los Angeles',
      });
    });

    expect(result.current.trips[0].destination).toBe('Los Angeles');
  });

  it('should delete a trip', () => {
    const { result } = renderHook(() => useTripStore());

    act(() => {
      result.current.addTrip(mockTrip);
    });

    const tripId = result.current.trips[0].id;

    act(() => {
      result.current.deleteTrip(tripId);
    });

    expect(result.current.trips).toHaveLength(0);
  });

  it('should add gym to trip', () => {
    const { result } = renderHook(() => useTripStore());

    act(() => {
      result.current.addTrip(mockTrip);
    });

    const tripId = result.current.trips[0].id;

    act(() => {
      result.current.addGymToTrip(tripId, mockGym);
    });

    expect(result.current.trips[0].gyms).toHaveLength(1);
    expect(result.current.trips[0].gyms[0].id).toBe('gym-1');
  });

  it('should not add duplicate gym to trip', () => {
    const { result } = renderHook(() => useTripStore());

    act(() => {
      result.current.addTrip(mockTrip);
    });

    const tripId = result.current.trips[0].id;

    act(() => {
      result.current.addGymToTrip(tripId, mockGym);
      result.current.addGymToTrip(tripId, mockGym);
    });

    expect(result.current.trips[0].gyms).toHaveLength(1);
  });

  it('should remove gym from trip', () => {
    const { result } = renderHook(() => useTripStore());

    act(() => {
      result.current.addTrip(mockTrip);
    });

    const tripId = result.current.trips[0].id;

    act(() => {
      result.current.addGymToTrip(tripId, mockGym);
      result.current.removeGymFromTrip(tripId, 'gym-1');
    });

    expect(result.current.trips[0].gyms).toHaveLength(0);
  });

  it('should set selected trip', () => {
    const { result } = renderHook(() => useTripStore());

    act(() => {
      result.current.addTrip(mockTrip);
    });

    const tripId = result.current.trips[0].id;

    act(() => {
      result.current.setSelectedTrip(tripId);
    });

    expect(result.current.selectedTripId).toBe(tripId);
  });

  it('should get trip by id', () => {
    const { result } = renderHook(() => useTripStore());

    act(() => {
      result.current.addTrip(mockTrip);
    });

    const tripId = result.current.trips[0].id;
    const trip = result.current.getTripById(tripId);

    expect(trip).toBeDefined();
    expect(trip?.destination).toBe('New York');
  });

  it('should filter upcoming trips', () => {
    const { result } = renderHook(() => useTripStore());

    const futureTrip = {
      ...mockTrip,
      startDate: '2026-01-01',
      endDate: '2026-01-05',
      status: 'upcoming' as const,
    };

    const pastTrip = {
      ...mockTrip,
      startDate: '2023-01-01',
      endDate: '2023-01-05',
      status: 'past' as const,
    };

    act(() => {
      result.current.addTrip(futureTrip);
      result.current.addTrip(pastTrip);
    });

    const upcomingTrips = result.current.getUpcomingTrips();
    expect(upcomingTrips).toHaveLength(1);
    expect(upcomingTrips[0].status).toBe('upcoming');
  });

  it('should filter past trips', () => {
    const { result } = renderHook(() => useTripStore());

    const futureTrip = {
      ...mockTrip,
      startDate: '2026-01-01',
      endDate: '2026-01-05',
      status: 'upcoming' as const,
    };

    const pastTrip = {
      ...mockTrip,
      startDate: '2023-01-01',
      endDate: '2023-01-05',
      status: 'past' as const,
    };

    act(() => {
      result.current.addTrip(futureTrip);
      result.current.addTrip(pastTrip);
    });

    const pastTrips = result.current.getPastTrips();
    expect(pastTrips).toHaveLength(1);
    expect(pastTrips[0].status).toBe('past');
  });

  it('should sync with calendar detected trips', () => {
    const { result } = renderHook(() => useTripStore());

    const detectedTrips = [
      {
        id: 'cal_123',
        destination: 'Paris',
        startDate: '2026-06-01',
        endDate: '2026-06-10',
        calendarEventId: 'event-123',
        calendarTitle: 'Paris Trip',
      },
    ];

    act(() => {
      result.current.syncWithCalendar(detectedTrips);
    });

    expect(result.current.trips).toHaveLength(1);
    expect(result.current.trips[0].destination).toBe('Paris');
    expect(result.current.trips[0].isAutoDetected).toBe(true);
  });

  it('should not duplicate calendar trips on sync', () => {
    const { result } = renderHook(() => useTripStore());

    const detectedTrips = [
      {
        id: 'cal_123',
        destination: 'Paris',
        startDate: '2026-06-01',
        endDate: '2026-06-10',
        calendarEventId: 'event-123',
        calendarTitle: 'Paris Trip',
      },
    ];

    act(() => {
      result.current.syncWithCalendar(detectedTrips);
      result.current.syncWithCalendar(detectedTrips);
    });

    expect(result.current.trips).toHaveLength(1);
  });
});
