import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Slot } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './stores/authStore';
import { supabase } from './lib/supabase';
import { StripeProvider } from './components/providers/StripeProvider';
import { registerPushToken } from './services/notifications';
import { initSentry, setUser, clearUser, SentryErrorBoundary } from './lib/sentry';
import { initAnalytics, identifyUser, resetUser, trackAppOpen } from './lib/analytics';
import { queryClient } from './lib/queryClient';

// Initialize Sentry as early as possible
initSentry();

// Initialize analytics
initAnalytics();

export default function App() {
  const { user, refreshSession } = useAuthStore();

  useEffect(() => {
    // Initialize auth state on app load
    refreshSession();

    // Listen for auth state changes
    const unsubscribe = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        refreshSession();

        // Set user context for Sentry and analytics
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
          });
          identifyUser(session.user.id, {
            email: session.user.email,
          });
        }

        // Register for push notifications when user signs in
        registerPushToken().catch((error) => {
          console.error('Failed to register push token:', error);
          // Don't throw - push notifications are optional
        });
      } else if (event === 'SIGNED_OUT') {
        // Clear user context for Sentry and analytics
        clearUser();
        resetUser();
      }
    });

    return () => {
      unsubscribe.data?.subscription?.unsubscribe();
    };
  }, [refreshSession]);

  return (
    <SentryErrorBoundary
      fallback={({ error }) => (
        <GestureHandlerRootView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <></>
        </GestureHandlerRootView>
      )}
    >
      <QueryClientProvider client={queryClient}>
        <StripeProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Slot />
          </GestureHandlerRootView>
        </StripeProvider>
      </QueryClientProvider>
    </SentryErrorBoundary>
  );
}
