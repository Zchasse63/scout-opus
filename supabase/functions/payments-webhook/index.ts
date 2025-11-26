import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, stripe-signature',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Stripe
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    if (!stripeSecretKey || !webhookSecret) {
      throw new Error('Stripe configuration missing');
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Get the signature from headers
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      throw new Error('No stripe-signature header found');
    }

    // Get raw body for signature verification
    const body = await req.text();

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment succeeded:', paymentIntent.id);

        // Extract booking details from metadata
        const {
          booking_id,
          user_id,
          gym_id,
          pass_type,
          booking_date,
        } = paymentIntent.metadata;

        if (!booking_id || !user_id || !gym_id) {
          console.error('Missing required metadata in payment intent');
          break;
        }

        // Update booking status to confirmed
        const { error: updateError } = await supabase
          .from('bookings')
          .update({
            status: 'confirmed',
            payment_status: 'paid',
            payment_intent_id: paymentIntent.id,
            amount_paid: paymentIntent.amount / 100, // Convert from cents
            updated_at: new Date().toISOString(),
          })
          .eq('id', booking_id);

        if (updateError) {
          console.error('Error updating booking:', updateError);
          break;
        }

        // Create a pass record
        const qrCodeData = JSON.stringify({
          booking_id,
          user_id,
          gym_id,
          pass_type,
          booking_date,
          timestamp: Date.now(),
        });

        const { error: passError } = await supabase
          .from('passes')
          .insert({
            id: booking_id, // Use same ID as booking
            user_id,
            gym_id,
            pass_type,
            booking_date,
            qr_code_data: qrCodeData,
            status: 'active',
          });

        if (passError) {
          console.error('Error creating pass:', passError);
        }

        // Send confirmation notification via OneSignal
        // This would be implemented when OneSignal is integrated
        // For now, log it
        console.log('TODO: Send push notification to user:', user_id);

        // Send email confirmation
        // This would be implemented with email service
        console.log('TODO: Send email confirmation to user:', user_id);

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', paymentIntent.id);

        const { booking_id } = paymentIntent.metadata;

        if (booking_id) {
          // Update booking status to failed
          const { error: updateError } = await supabase
            .from('bookings')
            .update({
              status: 'cancelled',
              payment_status: 'failed',
              payment_intent_id: paymentIntent.id,
              updated_at: new Date().toISOString(),
            })
            .eq('id', booking_id);

          if (updateError) {
            console.error('Error updating booking:', updateError);
          }
        }

        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        console.log('Charge refunded:', charge.id);

        // Find booking by payment_intent_id
        const { data: booking, error: findError } = await supabase
          .from('bookings')
          .select('*')
          .eq('payment_intent_id', charge.payment_intent)
          .single();

        if (findError || !booking) {
          console.error('Booking not found for refund:', findError);
          break;
        }

        // Update booking and pass status
        const { error: updateError } = await supabase
          .from('bookings')
          .update({
            status: 'refunded',
            payment_status: 'refunded',
            updated_at: new Date().toISOString(),
          })
          .eq('id', booking.id);

        if (updateError) {
          console.error('Error updating booking for refund:', updateError);
        }

        // Update pass status
        const { error: passError } = await supabase
          .from('passes')
          .update({
            status: 'cancelled',
            updated_at: new Date().toISOString(),
          })
          .eq('id', booking.id);

        if (passError) {
          console.error('Error updating pass for refund:', passError);
        }

        // Send refund notification
        console.log('TODO: Send refund notification to user:', booking.user_id);

        break;
      }

      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment canceled:', paymentIntent.id);

        const { booking_id } = paymentIntent.metadata;

        if (booking_id) {
          // Update booking status to cancelled
          const { error: updateError } = await supabase
            .from('bookings')
            .update({
              status: 'cancelled',
              payment_status: 'cancelled',
              payment_intent_id: paymentIntent.id,
              updated_at: new Date().toISOString(),
            })
            .eq('id', booking_id);

          if (updateError) {
            console.error('Error updating booking:', updateError);
          }
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return success response
    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Webhook processing failed',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
