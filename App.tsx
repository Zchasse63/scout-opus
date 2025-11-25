import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Slot } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './stores/authStore';
import { supabase } from './lib/supabase';
import { StripeProvider } from './components/providers/StripeProvider';
import { registerPushToken } from './services/notifications';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1 * 60 * 1000, // 1 minute
    },
  },
});

export default function App() {
  const { user, refreshSession } = useAuthStore();

  useEffect(() => {
    // Initialize auth state on app load
    refreshSession();

    // Listen for auth state changes
    const unsubscribe = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        refreshSession();

        // Register for push notifications when user signs in
        registerPushToken().catch((error) => {
          console.error('Failed to register push token:', error);
          // Don't throw - push notifications are optional
        });
      }
    });

    return () => {
      unsubscribe.data?.subscription?.unsubscribe();
    };
  }, [refreshSession]);

  return (
    <QueryClientProvider client={queryClient}>
      <StripeProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Slot />
        </GestureHandlerRootView>
      </StripeProvider>
    </QueryClientProvider>
  );
}
