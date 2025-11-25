import React, { Fragment } from 'react';
import { StripeProvider as StripeProviderNative } from '@stripe/stripe-react-native';

const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY;

interface StripeProviderProps {
  children: React.ReactNode;
}

/**
 * Wrapper component for Stripe React Native SDK
 * Initializes Stripe with the publishable key from environment variables
 */
export function StripeProvider({ children }: StripeProviderProps) {
  // If no Stripe key is configured, render children without Stripe functionality
  // This allows the app to run without Stripe during development
  if (!STRIPE_PUBLISHABLE_KEY) {
    console.warn(
      'EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY not set. Payment functionality will be disabled. ' +
      'Add your Stripe publishable key to .env to enable payments.'
    );
    return <Fragment>{children}</Fragment>;
  }

  return (
    <StripeProviderNative publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <Fragment>{children}</Fragment>
    </StripeProviderNative>
  );
}
