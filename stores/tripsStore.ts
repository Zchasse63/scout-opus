import { create } from 'zustand';
import type { TravelPeriod } from '../types';

interface TripsStore {
  upcomingTrips: TravelPeriod[];
  pastTrips: TravelPeriod[];
  isLoading: boolean;
  error: string | null;
  setTrips: (upcoming: TravelPeriod[], past: TravelPeriod[]) => void;
  addTrip: (trip: TravelPeriod) => void;
  removeTrip: (tripId: string) => void;
  dismissTrip: (tripId: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTripsStore = create<TripsStore>((set) => ({
  upcomingTrips: [],
  pastTrips: [],
  isLoading: false,
  error: null,
  setTrips: (upcoming, past) => set({ upcomingTrips: upcoming, pastTrips: past }),
  addTrip: (trip) =>
    set((state) => ({
      upcomingTrips: [trip, ...state.upcomingTrips],
    })),
  removeTrip: (tripId) =>
    set((state) => ({
      upcomingTrips: state.upcomingTrips.filter((t) => t.id !== tripId),
      pastTrips: state.pastTrips.filter((t) => t.id !== tripId),
    })),
  dismissTrip: (tripId) =>
    set((state) => ({
      upcomingTrips: state.upcomingTrips.map((t) =>
        t.id === tripId ? { ...t, dismissed: true } : t
      ),
    })),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
