import { create } from 'zustand';

interface Gym {
  id: string;
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  dayPassPrice: number;
  primaryPhoto: string;
  isVerified: boolean;
  distance?: number;
}

interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  coverImage?: string;
  status: 'upcoming' | 'active' | 'past';
  isAutoDetected: boolean;
  calendarEventId?: string;
  calendarTitle?: string;
  gyms: Gym[];
  createdAt: string;
  updatedAt: string;
}

interface TripStore {
  trips: Trip[];
  isLoading: boolean;
  error: string | null;
  selectedTripId: string | null;

  // Actions
  setTrips: (trips: Trip[]) => void;
  addTrip: (trip: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTrip: (tripId: string, updates: Partial<Trip>) => void;
  deleteTrip: (tripId: string) => void;
  addGymToTrip: (tripId: string, gym: Gym) => void;
  removeGymFromTrip: (tripId: string, gymId: string) => void;
  setSelectedTrip: (tripId: string | null) => void;
  syncWithCalendar: (detectedTrips: any[]) => void;
  updateTripStatuses: () => void;
  getTripById: (tripId: string) => Trip | undefined;
  getUpcomingTrips: () => Trip[];
  getActiveTrips: () => Trip[];
  getPastTrips: () => Trip[];
}

export const useTripStore = create<TripStore>((set, get) => ({
  trips: [],
  isLoading: false,
  error: null,
  selectedTripId: null,

  setTrips: (trips) => set({ trips }),

  addTrip: (tripData) => {
    const newTrip: Trip = {
      ...tripData,
      id: `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      gyms: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      trips: [...state.trips, newTrip],
    }));

    // Update statuses after adding
    get().updateTripStatuses();
  },

  updateTrip: (tripId, updates) => {
    set((state) => ({
      trips: state.trips.map((trip) =>
        trip.id === tripId
          ? { ...trip, ...updates, updatedAt: new Date().toISOString() }
          : trip
      ),
    }));
  },

  deleteTrip: (tripId) => {
    set((state) => ({
      trips: state.trips.filter((trip) => trip.id !== tripId),
      selectedTripId:
        state.selectedTripId === tripId ? null : state.selectedTripId,
    }));
  },

  addGymToTrip: (tripId, gym) => {
    set((state) => ({
      trips: state.trips.map((trip) => {
        if (trip.id === tripId) {
          // Check if gym already exists
          const gymExists = trip.gyms.some((g) => g.id === gym.id);
          if (gymExists) return trip;

          return {
            ...trip,
            gyms: [...trip.gyms, gym],
            updatedAt: new Date().toISOString(),
          };
        }
        return trip;
      }),
    }));
  },

  removeGymFromTrip: (tripId, gymId) => {
    set((state) => ({
      trips: state.trips.map((trip) => {
        if (trip.id === tripId) {
          return {
            ...trip,
            gyms: trip.gyms.filter((gym) => gym.id !== gymId),
            updatedAt: new Date().toISOString(),
          };
        }
        return trip;
      }),
    }));
  },

  setSelectedTrip: (tripId) => set({ selectedTripId: tripId }),

  syncWithCalendar: (detectedTrips) => {
    const existingTrips = get().trips;

    // Add new calendar-detected trips that don't already exist
    const newTrips: Trip[] = [];

    for (const detected of detectedTrips) {
      // Check if trip already exists (by calendar event ID or date range + destination)
      const exists = existingTrips.some(
        (trip) =>
          (trip.calendarEventId &&
            trip.calendarEventId === detected.calendarEventId) ||
          (trip.destination === detected.destination &&
            trip.startDate === detected.startDate &&
            trip.endDate === detected.endDate)
      );

      if (!exists) {
        const today = new Date();
        const startDate = new Date(detected.startDate);
        const endDate = new Date(detected.endDate);

        let status: 'upcoming' | 'active' | 'past' = 'upcoming';
        if (today >= startDate && today <= endDate) {
          status = 'active';
        } else if (today > endDate) {
          status = 'past';
        }

        newTrips.push({
          id: detected.id,
          destination: detected.destination,
          startDate: detected.startDate,
          endDate: detected.endDate,
          status,
          isAutoDetected: true,
          calendarEventId: detected.calendarEventId,
          calendarTitle: detected.calendarTitle,
          gyms: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    if (newTrips.length > 0) {
      set((state) => ({
        trips: [...state.trips, ...newTrips],
      }));
    }
  },

  updateTripStatuses: () => {
    const today = new Date();

    set((state) => ({
      trips: state.trips.map((trip) => {
        const startDate = new Date(trip.startDate);
        const endDate = new Date(trip.endDate);

        let newStatus: 'upcoming' | 'active' | 'past' = trip.status;

        if (today >= startDate && today <= endDate) {
          newStatus = 'active';
        } else if (today > endDate) {
          newStatus = 'past';
        } else if (today < startDate) {
          newStatus = 'upcoming';
        }

        if (newStatus !== trip.status) {
          return { ...trip, status: newStatus };
        }

        return trip;
      }),
    }));
  },

  getTripById: (tripId) => {
    return get().trips.find((trip) => trip.id === tripId);
  },

  getUpcomingTrips: () => {
    return get()
      .trips.filter((trip) => trip.status === 'upcoming')
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
  },

  getActiveTrips: () => {
    return get()
      .trips.filter((trip) => trip.status === 'active')
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
  },

  getPastTrips: () => {
    return get()
      .trips.filter((trip) => trip.status === 'past')
      .sort(
        (a, b) =>
          new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
      );
  },
}));
