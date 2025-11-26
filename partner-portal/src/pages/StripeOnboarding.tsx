import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';

export default function StripeOnboarding() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [accountStatus, setAccountStatus] = useState<string>('incomplete');
  const [accountLink, setAccountLink] = useState<string | null>(null);

  useEffect(() => {
    checkStripeStatus();
  }, []);

  const checkStripeStatus = async () => {
    try {
      // Check if partner already has Stripe Connect account
      const { data, error } = await supabase
        .from('partners')
        .select('stripe_account_id, stripe_onboarding_complete')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;

      if (data?.stripe_onboarding_complete) {
        setAccountStatus('complete');
        setLoading(false);
        return;
      }

      // If account exists but onboarding incomplete, create new account link
      if (data?.stripe_account_id) {
        await createAccountLink(data.stripe_account_id);
      }
    } catch (error) {
      console.error('Error checking Stripe status:', error);
    } finally {
      setLoading(false);
    }
  };

  const createAccountLink = async (accountId?: string) => {
    try {
      // Call Edge Function to create Stripe Connect account or account link
      const { data, error } = await supabase.functions.invoke(
        'stripe-connect-onboarding',
        {
          body: {
            account_id: accountId,
            refresh_url: `${window.location.origin}/stripe-onboarding`,
            return_url: `${window.location.origin}/financials`,
          },
        }
      );

      if (error) throw error;

      if (data.url) {
        setAccountLink(data.url);
      }
    } catch (error) {
      console.error('Error creating account link:', error);
    }
  };

  const handleStartOnboarding = () => {
    if (accountLink) {
      window.location.href = accountLink;
    } else {
      createAccountLink();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (accountStatus === 'complete') {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Stripe Connected!</h1>
          <p className="text-gray-600 mb-6">
            Your Stripe account is fully set up. You can now receive payments from bookings.
          </p>
          <button
            onClick={() => navigate('/financials')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
          >
            View Financials
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-4">Connect with Stripe</h1>
        <p className="text-gray-600 mb-6">
          To receive payments from Scout bookings, you need to connect your Stripe account.
          Stripe handles all payment processing securely.
        </p>

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold mb-3">What you'll need:</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-indigo-600 mr-2">•</span>
              <span>Business information (name, address, tax ID)</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 mr-2">•</span>
              <span>Bank account details for payouts</span>
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 mr-2">•</span>
              <span>Personal identification (for verification)</span>
            </li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-700">
              <p className="font-semibold mb-1">Platform Fee:</p>
              <p>
                Scout charges a 15% platform fee on all bookings. This covers payment processing,
                customer support, and platform maintenance.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleStartOnboarding}
          disabled={!accountLink && loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 font-semibold"
        >
          {loading ? 'Loading...' : 'Connect Stripe Account'}
        </button>

        <p className="text-xs text-gray-500 mt-4 text-center">
          By connecting your Stripe account, you agree to Stripe's{' '}
          <a href="https://stripe.com/connect-account/legal" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
            Connected Account Agreement
          </a>
        </p>
      </div>
    </div>
  );
}
