import { create } from 'zustand';
import type { Gym } from '../types';

interface BookingStore {
  selectedGym: Gym | null;
  passType: 'day' | 'week' | 'month' | null;
  selectedDate: string | null;
  isProcessing: boolean;
  error: string | null;
  setSelectedGym: (gym: Gym | null) => void;
  setPassType: (type: 'day' | 'week' | 'month' | null) => void;
  setSelectedDate: (date: string | null) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setError: (error: string | null) => void;
  clearBooking: () => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  selectedGym: null,
  passType: null,
  selectedDate: null,
  isProcessing: false,
  error: null,
  setSelectedGym: (gym) => set({ selectedGym: gym }),
  setPassType: (type) => set({ passType: type }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setError: (error) => set({ error }),
  clearBooking: () =>
    set({
      selectedGym: null,
      passType: null,
      selectedDate: null,
      isProcessing: false,
      error: null,
    }),
}));
