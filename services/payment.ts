import { supabase } from '../lib/supabase';

interface CreatePaymentIntentInput {
  gymId: string;
  passType: 'day' | 'week' | 'month';
  amount: number;
  bookingDate: string;
}

interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

/**
 * Creates a payment intent by calling the Supabase Edge Function
 * This handles the secure server-side creation of Stripe payment intents
 */
export async function createPaymentIntent(
  input: CreatePaymentIntentInput
): Promise<PaymentIntentResponse> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase.functions.invoke('create-payment-intent', {
    body: {
      gymId: input.gymId,
      passType: input.passType,
      amount: input.amount,
      bookingDate: input.bookingDate,
      userId: user.id,
    },
  });

  if (error) {
    throw new Error(`Failed to create payment intent: ${error.message}`);
  }

  if (!data || !data.clientSecret || !data.paymentIntentId) {
    throw new Error('Invalid response from payment service');
  }

  return {
    clientSecret: data.clientSecret,
    paymentIntentId: data.paymentIntentId,
  };
}

/**
 * Confirms a payment was successful and creates the booking
 * This should be called after Stripe confirms the payment
 */
export async function confirmPaymentAndCreateBooking(
  paymentIntentId: string,
  gymId: string,
  passType: 'day' | 'week' | 'month',
  bookingDate: string,
  amount: number
): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  // Generate QR code payload
  const qrPayload = await supabase.rpc('generate_qr_payload', {
    p_user_id: user.id,
    p_gym_id: gymId,
    p_booking_date: bookingDate,
  });

  if (qrPayload.error) {
    throw new Error(`Failed to generate QR code: ${qrPayload.error.message}`);
  }

  // Create booking with payment intent ID
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      user_id: user.id,
      gym_id: gymId,
      booking_date: bookingDate,
      pass_type: passType,
      status: 'confirmed',
      amount_paid: amount,
      qr_code: qrPayload.data,
      payment_intent_id: paymentIntentId,
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to create booking: ${error.message}`);
  }

  return data.id;
}
