import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';

const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;

export function initSentry() {
  if (!SENTRY_DSN) {
    console.warn('Sentry DSN not configured. Error tracking disabled.');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: __DEV__ ? 'development' : 'production',
    debug: __DEV__,
    
    // Performance monitoring
    tracesSampleRate: __DEV__ ? 1.0 : 0.2,
    
    // Session replay (optional)
    // replaysSessionSampleRate: 0.1,
    // replaysOnErrorSampleRate: 1.0,
    
    // Release tracking
    release: Constants.expoConfig?.version || '1.0.0',
    dist: Constants.expoConfig?.extra?.eas?.buildProfile || 'local',
    
    // Ignore common non-actionable errors
    ignoreErrors: [
      'Network request failed',
      'AbortError',
      'ChunkLoadError',
    ],
    
    // Before send hook for filtering
    beforeSend(event, hint) {
      // Don't send events in development
      if (__DEV__) {
        console.log('[Sentry] Event captured:', event);
        return null;
      }
      
      // Filter out certain error types
      const error = hint.originalException;
      if (error instanceof Error) {
        // Ignore user-initiated cancellations
        if (error.message.includes('User cancelled')) {
          return null;
        }
      }
      
      return event;
    },
  });
}

// Helper to capture exceptions with context
export function captureException(error: Error, context?: Record<string, unknown>) {
  Sentry.captureException(error, {
    extra: context,
  });
}

// Helper to set user context
export function setUser(user: { id: string; email?: string; firstName?: string }) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.firstName,
  });
}

// Helper to clear user context on logout
export function clearUser() {
  Sentry.setUser(null);
}

// Helper to add breadcrumb
export function addBreadcrumb(
  message: string,
  category: string,
  level: Sentry.SeverityLevel = 'info',
  data?: Record<string, unknown>
) {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
  });
}

// Wrapper for Sentry's error boundary
export const SentryErrorBoundary = Sentry.ErrorBoundary;

// Navigation tracking
export function setNavigationRoute(routeName: string, params?: Record<string, unknown>) {
  Sentry.addBreadcrumb({
    message: `Navigate to ${routeName}`,
    category: 'navigation',
    level: 'info',
    data: params,
  });
}

export { Sentry };

