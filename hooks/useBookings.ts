import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Booking } from '../types';

interface BookingRow {
  id: number;
  user_id: string;
  gym_id: number;
  booking_date: string;
  pass_type: 'day' | 'week' | 'month';
  status: 'confirmed' | 'used' | 'cancelled';
  amount_paid: number;
  qr_code: any;
  qr_scanned_at: string | null;
  gyms: {
    name: string;
    address: string;
  };
}

function transformBookingData(row: BookingRow): Booking {
  return {
    id: row.id.toString(),
    userId: row.user_id,
    gymId: row.gym_id.toString(),
    bookingDate: row.booking_date,
    passType: row.pass_type,
    status: row.status,
    amountPaid: row.amount_paid,
    qrCode: row.qr_code?.code || `SCOUT-${row.id}`,
    qrScannedAt: row.qr_scanned_at || undefined,
  };
}

async function fetchUserBookings(): Promise<Booking[]> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      gyms(name, address)
    `)
    .eq('user_id', user.id)
    .order('booking_date', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch bookings: ${error.message}`);
  }

  if (!data) {
    return [];
  }

  return (data as BookingRow[]).map(transformBookingData);
}

export function useBookings() {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: fetchUserBookings,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

interface CreateBookingInput {
  gymId: string;
  passType: 'day' | 'week' | 'month';
  bookingDate: string;
  amountPaid: number;
  platformFee: number;
  gymPayout: number;
  stripePaymentIntentId: string;
}

async function createBooking(input: CreateBookingInput): Promise<Booking> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  // Generate QR code data
  const qrCodeData = {
    code: `SCOUT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    timestamp: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      user_id: user.id,
      gym_id: parseInt(input.gymId),
      booking_date: input.bookingDate,
      pass_type: input.passType,
      status: 'confirmed',
      amount_paid: input.amountPaid,
      platform_fee: input.platformFee,
      gym_payout: input.gymPayout,
      stripe_payment_intent_id: input.stripePaymentIntentId,
      qr_code: qrCodeData,
    })
    .select(`
      *,
      gyms(name, address)
    `)
    .single();

  if (error) {
    throw new Error(`Failed to create booking: ${error.message}`);
  }

  if (!data) {
    throw new Error('No booking data returned');
  }

  return transformBookingData(data as BookingRow);
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      // Invalidate bookings query to refetch
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
