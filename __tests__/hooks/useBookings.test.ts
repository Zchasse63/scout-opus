import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useBookings } from '../../hooks/useBookings';
import { supabase } from '../../lib/supabase';

// Get the mocked supabase from jest.setup.js
const mockSupabase = supabase as jest.Mocked<typeof supabase>;

// Create wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useBookings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the mock to default behavior
    (mockSupabase.from as jest.Mock).mockImplementation(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({ data: [], error: null })),
        })),
      })),
    }));
  });

  describe('fetchBookings', () => {
    test('returns empty array when no bookings exist', async () => {
      const { result } = renderHook(() => useBookings(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // useBookings returns React Query result with data property
      expect(result.current.data).toEqual([]);
    });

    test('returns bookings when they exist', async () => {
      const mockBookings = [
        {
          id: 1,
          user_id: 'user-123',
          gym_id: 1,
          pass_type: 'day',
          booking_date: '2024-01-15',
          status: 'confirmed',
          amount_paid: 25,
          qr_code: { code: 'SCOUT-123' },
          qr_scanned_at: null,
          gyms: { name: 'Test Gym', address: '123 Main St' },
        },
      ];

      (mockSupabase.from as jest.Mock).mockImplementation(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({ data: mockBookings, error: null })),
          })),
        })),
      }));

      const { result } = renderHook(() => useBookings(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toHaveLength(1);
      // Data is transformed by transformBookingData
      expect(result.current.data?.[0].id).toBe('1');
      expect(result.current.data?.[0].passType).toBe('day');
    });
  });

  describe('data transformation', () => {
    test('transforms booking data correctly', async () => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const mockBookings = [
        {
          id: 1,
          user_id: 'user-123',
          gym_id: 42,
          booking_date: tomorrow.toISOString().split('T')[0],
          pass_type: 'week',
          status: 'confirmed',
          amount_paid: 75,
          qr_code: { code: 'SCOUT-ABC123' },
          qr_scanned_at: null,
          gyms: { name: 'Future Gym', address: '456 Oak Ave' },
        },
      ];

      (mockSupabase.from as jest.Mock).mockImplementation(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({ data: mockBookings, error: null })),
          })),
        })),
      }));

      const { result } = renderHook(() => useBookings(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const booking = result.current.data?.[0];
      expect(booking).toBeDefined();
      expect(booking?.id).toBe('1');
      expect(booking?.userId).toBe('user-123');
      expect(booking?.gymId).toBe('42');
      expect(booking?.passType).toBe('week');
      expect(booking?.status).toBe('confirmed');
      expect(booking?.amountPaid).toBe(75);
      expect(booking?.qrCode).toBe('SCOUT-ABC123');
    });
  });

  describe('error handling', () => {
    test('sets error when fetch fails', async () => {
      (mockSupabase.from as jest.Mock).mockImplementation(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => Promise.resolve({ data: null, error: { message: 'Database error' } })),
          })),
        })),
      }));

      const { result } = renderHook(() => useBookings(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeTruthy();
    });
  });
});

