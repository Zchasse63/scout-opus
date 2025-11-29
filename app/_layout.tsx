import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import { StripeProvider } from '../components/providers/StripeProvider';
import { registerPushToken } from '../services/notifications';
import { initSentry, setUser, clearUser, SentryErrorBoundary } from '../lib/sentry';
import { initAnalytics, identifyUser, resetUser } from '../lib/analytics';
import { queryClient } from '../lib/queryClient';

// Initialize Sentry as early as possible
initSentry();

// Initialize analytics
initAnalytics();

function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();
  const { user, isLoading } = useAuthStore();
  const [isNavigationReady, setNavigationReady] = React.useState(false);
  const [hasRedirected, setHasRedirected] = React.useState(false);

  // Initialize auth on mount only
  useEffect(() => {
    const { refreshSession } = useAuthStore.getState();
    refreshSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
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
        });
      } else if (event === 'SIGNED_OUT') {
        clearUser();
        resetUser();
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Mark navigation as ready after first render
  useEffect(() => {
    setNavigationReady(true);
  }, []);

  // Handle auth redirects only after navigation is ready
  useEffect(() => {
    if (!isNavigationReady || isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup && !hasRedirected) {
      setHasRedirected(true);
      router.replace('/(tabs)');
    }
  }, [user, isLoading, segments, isNavigationReady, hasRedirected]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen
        name="gym/[id]"
        options={{
          title: 'Gym Details',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SentryErrorBoundary
      fallback={() => (
        <GestureHandlerRootView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <></>
        </GestureHandlerRootView>
      )}
    >
      <QueryClientProvider client={queryClient}>
        <StripeProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <RootLayoutNav />
          </GestureHandlerRootView>
        </StripeProvider>
      </QueryClientProvider>
    </SentryErrorBoundary>
  );
}
