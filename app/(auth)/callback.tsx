import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { colors } from '../../constants/colors';

export default function AuthCallbackScreen() {
  const router = useRouter();

  useEffect(() => {
    // Handle the deep link from OAuth redirect
    const handleDeepLink = async (url: string) => {
      const deepLink = url.substring(url.indexOf(':/') + 1);

      // Extract hash from URL
      const hashPrefix = '#';
      const hashIndex = deepLink.indexOf(hashPrefix);

      if (hashIndex > -1) {
        const hash = deepLink.substring(hashIndex);
        // Parse the hash for session data
        const sessionData = new URLSearchParams(hash.substring(1));

        // If we have access token, we can proceed
        if (sessionData.has('access_token')) {
          // Supabase SDK will handle this automatically
          // Just wait a moment and redirect
          setTimeout(() => {
            router.replace('/(tabs)');
          }, 1000);
          return;
        }
      }

      // If something goes wrong, go back to login
      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 1000);
    };

    // This would be called by expo-linking
    // For now, we'll just redirect after a short delay
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>Signing you in...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    gap: 16,
  },
  text: {
    fontSize: 16,
    color: colors.gray700,
    marginTop: 16,
  },
});
