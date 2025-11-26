import { useState, useEffect } from 'react';
import { useStripe } from '@stripe/stripe-react-native';
import { createPaymentIntent, confirmPaymentAndCreateBooking } from '../services/payment';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

interface PaymentInput {
  gymId: string;
  passType: 'day' | 'week' | 'month';
  amount: number;
  bookingDate: string;
}

interface PaymentResult {
  success: boolean;
  bookingId?: string;
  error?: string;
}

export function usePayment() {
  const { presentPaymentSheet, initPaymentSheet } = useStripe();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerName, setCustomerName] = useState<string>('Customer');
  const [customerEmail, setCustomerEmail] = useState<string | undefined>();

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from('users')
          .select('first_name, last_name, email')
          .eq('id', user.id)
          .single();

        if (profile) {
          const fullName = [profile.first_name, profile.last_name]
            .filter(Boolean)
            .join(' ') || 'Customer';
          setCustomerName(fullName);
          setCustomerEmail(profile.email || user.email);
        } else {
          // Fallback to auth email
          setCustomerEmail(user.email);
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const processPayment = async (input: PaymentInput): Promise<PaymentResult> => {
    setIsProcessing(true);

    try {
      // Step 1: Create payment intent on the server
      const { clientSecret, paymentIntentId } = await createPaymentIntent(input);

      // Step 2: Initialize the payment sheet
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'Scout',
        paymentIntentClientSecret: clientSecret,
        defaultBillingDetails: {
          name: customerName,
          email: customerEmail,
        },
        allowsDelayedPaymentMethods: false,
      });

      if (initError) {
        return {
          success: false,
          error: `Failed to initialize payment: ${initError.message}`,
        };
      }

      // Step 3: Present the payment sheet to the user
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        // User cancelled or payment failed
        return {
          success: false,
          error: presentError.message,
        };
      }

      // Step 4: Payment succeeded, create the booking
      const bookingId = await confirmPaymentAndCreateBooking(
        paymentIntentId,
        input.gymId,
        input.passType,
        input.bookingDate,
        input.amount
      );

      // Invalidate bookings query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['bookings'] });

      return {
        success: true,
        bookingId,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed',
      };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processPayment,
    isProcessing,
  };
}
