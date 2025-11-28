/**
 * useRealtimeBookings - Real-time subscription to booking updates
 * 
 * Subscribes to Supabase Realtime for instant booking status updates.
 * Automatically updates the React Query cache when changes occur.
 */

import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Booking } from '../types';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface BookingRow {
  id: number;
  user_id: string;
  gym_id: number;
  booking_date: string;
  pass_type: string;
  status: string;
  amount_paid: number;
  qr_code: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

interface UseRealtimeBookingsOptions {
  userId?: string;
  enabled?: boolean;
  onInsert?: (booking: Booking) => void;
  onUpdate?: (booking: Booking) => void;
  onDelete?: (bookingId: number) => void;
}

export function useRealtimeBookings(options: UseRealtimeBookingsOptions = {}) {
  const { userId, enabled = true, onInsert, onUpdate, onDelete } = options;
  const queryClient = useQueryClient();

  // Transform database row to Booking type
  const transformBooking = useCallback((row: BookingRow): Booking => ({
    id: row.id,
    userId: row.user_id,
    gymId: row.gym_id,
    bookingDate: row.booking_date,
    passType: row.pass_type as 'day' | 'week' | 'month',
    status: row.status as 'confirmed' | 'used' | 'cancelled',
    amountPaid: row.amount_paid,
    qrCode: row.qr_code ? JSON.stringify(row.qr_code) : undefined,
    createdAt: row.created_at,
  }), []);

  // Handle realtime changes
  const handleChange = useCallback(
    (payload: RealtimePostgresChangesPayload<BookingRow>) => {
      const { eventType, new: newRecord, old: oldRecord } = payload;

      switch (eventType) {
        case 'INSERT':
          if (newRecord) {
            const booking = transformBooking(newRecord);
            // Update React Query cache
            queryClient.setQueryData<Booking[]>(['bookings'], (old) => {
              if (!old) return [booking];
              return [booking, ...old];
            });
            onInsert?.(booking);
          }
          break;

        case 'UPDATE':
          if (newRecord) {
            const booking = transformBooking(newRecord);
            // Update React Query cache
            queryClient.setQueryData<Booking[]>(['bookings'], (old) => {
              if (!old) return [booking];
              return old.map((b) => (b.id === booking.id ? booking : b));
            });
            onUpdate?.(booking);
          }
          break;

        case 'DELETE':
          if (oldRecord) {
            const bookingId = oldRecord.id;
            // Update React Query cache
            queryClient.setQueryData<Booking[]>(['bookings'], (old) => {
              if (!old) return [];
              return old.filter((b) => b.id !== bookingId);
            });
            onDelete?.(bookingId);
          }
          break;
      }

      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    [queryClient, transformBooking, onInsert, onUpdate, onDelete]
  );

  useEffect(() => {
    if (!enabled) return;

    // Build filter for user-specific subscriptions
    const filter = userId ? `user_id=eq.${userId}` : undefined;

    // Subscribe to bookings table changes
    const channel = supabase
      .channel('bookings-realtime')
      .on<BookingRow>(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter,
        },
        handleChange
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to bookings realtime updates');
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('Error subscribing to bookings realtime');
        }
      });

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled, userId, handleChange]);
}

/**
 * Hook for subscribing to a single booking's updates
 */
export function useRealtimeBooking(
  bookingId: number,
  options: { enabled?: boolean; onUpdate?: (booking: Booking) => void } = {}
) {
  const { enabled = true, onUpdate } = options;
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled || !bookingId) return;

    const channel = supabase
      .channel(`booking-${bookingId}`)
      .on<BookingRow>(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookings',
          filter: `id=eq.${bookingId}`,
        },
        (payload) => {
          if (payload.new) {
            const booking: Booking = {
              id: payload.new.id,
              userId: payload.new.user_id,
              gymId: payload.new.gym_id,
              bookingDate: payload.new.booking_date,
              passType: payload.new.pass_type as 'day' | 'week' | 'month',
              status: payload.new.status as 'confirmed' | 'used' | 'cancelled',
              amountPaid: payload.new.amount_paid,
              qrCode: payload.new.qr_code ? JSON.stringify(payload.new.qr_code) : undefined,
              createdAt: payload.new.created_at,
            };
            queryClient.setQueryData(['booking', bookingId], booking);
            onUpdate?.(booking);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled, bookingId, queryClient, onUpdate]);
}

