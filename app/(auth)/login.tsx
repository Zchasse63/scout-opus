import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import { useAuthStore } from '../../stores/authStore';
import { colors } from '../../constants/colors';
import { spacing, padding } from '../../constants/spacing';
import { typography } from '../../constants/typography';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const { signIn, isLoading, error } = useAuthStore();

  const handleAppleSignIn = async () => {
    try {
      await signIn('apple');
    } catch (error) {
      Alert.alert('Sign In Error', error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google');
    } catch (error) {
      Alert.alert('Sign In Error', error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleEmailSignIn = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    try {
      await signIn('email', email);
      Alert.alert('Check your email', 'We sent you a magic link to sign in');
    } catch (error) {
      Alert.alert('Sign In Error', error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        {/* Logo/Header */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Scout</Text>
          <Text style={styles.subtitle}>Find & Book Gyms Anywhere</Text>
        </View>

        {/* Sign In Options */}
        <View style={styles.signInSection}>
          {/* Apple Sign In */}
          <TouchableOpacity
            style={[styles.button, styles.appleButton]}
            onPress={handleAppleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>Sign in with Apple</Text>
            )}
          </TouchableOpacity>

          {/* Google Sign In */}
          <TouchableOpacity
            style={[styles.button, styles.googleButton]}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.black} />
            ) : (
              <Text style={[styles.buttonText, { color: colors.black }]}>Sign in with Google</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerSection}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email Sign In */}
          <TextInput
            style={styles.emailInput}
            placeholder="Enter your email"
            placeholderTextColor={colors.gray500}
            value={email}
            onChangeText={setEmail}
            editable={!isLoading}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={[styles.button, styles.emailButton]}
            onPress={handleEmailSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>Send Magic Link</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By signing in, you agree to our Terms and Privacy Policy
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: padding.screenHorizontal,
    justifyContent: 'space-between',
  },
  headerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  title: {
    ...typography.h1,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.gray700,
  },
  signInSection: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.lg,
  },
  button: {
    paddingVertical: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appleButton: {
    backgroundColor: colors.black,
  },
  googleButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  emailButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    ...typography.bodyBold,
    color: colors.white,
  },
  dividerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray300,
  },
  dividerText: {
    ...typography.caption,
    color: colors.gray500,
    marginHorizontal: spacing.lg,
  },
  emailInput: {
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 8,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.black,
  },
  errorBox: {
    backgroundColor: colors.error,
    padding: spacing.lg,
    borderRadius: 8,
    marginBottom: spacing.lg,
  },
  errorText: {
    ...typography.small,
    color: colors.white,
  },
  footer: {
    paddingVertical: spacing.lg,
  },
  footerText: {
    ...typography.caption,
    color: colors.gray500,
    textAlign: 'center',
  },
});
