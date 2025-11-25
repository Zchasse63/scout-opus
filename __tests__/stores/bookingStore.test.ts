import { useBookingStore } from '../../stores/bookingStore';
import type { Gym } from '../../types';

describe('useBookingStore', () => {
  beforeEach(() => {
    // Reset store state between tests
    useBookingStore.setState({
      selectedGym: null,
      passType: null,
      selectedDate: null,
      isProcessing: false,
      error: null,
    });
  });

  test('initializes with empty booking state', () => {
    const state = useBookingStore.getState();

    expect(state.selectedGym).toBeNull();
    expect(state.passType).toBeNull();
    expect(state.selectedDate).toBeNull();
    expect(state.isProcessing).toBe(false);
    expect(state.error).toBeNull();
  });

  test('sets selected gym', () => {
    const mockGym: Gym = {
      id: 'gym-1',
      name: "Gold's Gym",
      address: '123 Main St',
      latitude: 25.7907,
      longitude: -80.1299,
      rating: 4.5,
      reviewCount: 100,
      dayPassPrice: 25,
      amenities: [],
      photos: [],
      description: 'Great gym',
    };

    useBookingStore.getState().setSelectedGym(mockGym);

    expect(useBookingStore.getState().selectedGym).toEqual(mockGym);
  });

  test('sets pass type', () => {
    useBookingStore.getState().setPassType('week');

    expect(useBookingStore.getState().passType).toBe('week');
  });

  test('sets selected date', () => {
    const date = '2024-01-15';

    useBookingStore.getState().setSelectedDate(date);

    expect(useBookingStore.getState().selectedDate).toBe(date);
  });

  test('sets processing state', () => {
    useBookingStore.getState().setIsProcessing(true);

    expect(useBookingStore.getState().isProcessing).toBe(true);
  });

  test('sets error', () => {
    const error = 'Payment failed';

    useBookingStore.getState().setError(error);

    expect(useBookingStore.getState().error).toBe(error);
  });

  test('clears booking state', () => {
    const mockGym: Gym = {
      id: 'gym-1',
      name: "Gold's Gym",
      address: '123 Main St',
      latitude: 25.7907,
      longitude: -80.1299,
      rating: 4.5,
      reviewCount: 100,
      dayPassPrice: 25,
      amenities: [],
      photos: [],
      description: 'Great gym',
    };

    useBookingStore.getState().setSelectedGym(mockGym);
    useBookingStore.getState().setPassType('day');
    useBookingStore.getState().setSelectedDate('2024-01-15');

    expect(useBookingStore.getState().selectedGym).not.toBeNull();

    useBookingStore.getState().clearBooking();

    expect(useBookingStore.getState().selectedGym).toBeNull();
    expect(useBookingStore.getState().passType).toBeNull();
    expect(useBookingStore.getState().selectedDate).toBeNull();
  });
});
