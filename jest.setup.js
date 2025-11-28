// Jest setup file
// Note: @testing-library/jest-native is deprecated, using built-in matchers from @testing-library/react-native

// Mock Expo winter runtime (SDK 54+)
jest.mock('expo/src/winter/runtime.native', () => ({}), { virtual: true });
jest.mock('expo/src/winter/installGlobal', () => ({}), { virtual: true });

// Mock Expo constants
jest.mock('expo-constants', () => ({
  isDevice: true, // Simulate physical device for push notification tests
  expoConfig: {
    version: '1.0.0',
    extra: { eas: { buildProfile: 'test', projectId: 'test-project-id' } },
  },
}));

// Mock React Native Alert
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

// Mock React Native Voice
jest.mock('@react-native-voice/voice', () => ({
  onSpeechStart: jest.fn(),
  onSpeechEnd: jest.fn(),
  onSpeechError: jest.fn(),
  onSpeechResults: jest.fn(),
  onSpeechPartialResults: jest.fn(),
  startSpeech: jest.fn(),
  stopSpeech: jest.fn(),
  cancelSpeech: jest.fn(),
  destroy: jest.fn(() => Promise.resolve()),
  removeAllListeners: jest.fn(),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
}));

// Mock react-native-maps
jest.mock('react-native-maps', () => ({
  __esModule: true,
  default: jest.fn(() => null),
  Marker: jest.fn(() => null),
  Callout: jest.fn(() => null),
  PROVIDER_DEFAULT: 'default',
  PROVIDER_GOOGLE: 'google',
}));

// Mock Sentry
jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
  setUser: jest.fn(),
  addBreadcrumb: jest.fn(),
  ErrorBoundary: ({ children }) => children,
}));

// Mock Mixpanel
jest.mock('mixpanel-react-native', () => ({
  Mixpanel: jest.fn().mockImplementation(() => ({
    init: jest.fn(() => Promise.resolve()),
    identify: jest.fn(),
    reset: jest.fn(),
    track: jest.fn(),
    getPeople: jest.fn(() => ({ set: jest.fn() })),
  })),
}));

// Mock Supabase
jest.mock('./lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signInWithOAuth: jest.fn(),
      signInWithOtp: jest.fn(),
      signOut: jest.fn(),
      refreshSession: jest.fn(),
      getUser: jest.fn(() => Promise.resolve({ data: { user: { id: 'test-user-123' } } })),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
    functions: {
      invoke: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({ data: [], error: null })),
        })),
        order: jest.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ error: null })),
      })),
    })),
  },
}));

// Mock Expo Router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    navigate: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  router: {
    push: jest.fn(),
    back: jest.fn(),
    navigate: jest.fn(),
  },
}));

// Mock React Native Reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock Expo modules
jest.mock('expo-calendar', () => ({
  getCalendarPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted' })
  ),
  requestCalendarPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted' })
  ),
  getCalendarsAsync: jest.fn(() => Promise.resolve([])),
  getEventsAsync: jest.fn(() => Promise.resolve([])),
  createEventAsync: jest.fn(() => Promise.resolve('mock-event-id')),
  EntityTypes: { EVENT: 0 },
}));

jest.mock('expo-av', () => ({
  Audio: {
    Recording: jest.fn(),
    requestPermissionsAsync: jest.fn(() =>
      Promise.resolve({ status: 'granted' })
    ),
    setAudioModeAsync: jest.fn(() => Promise.resolve()),
  },
}));

jest.mock('expo-notifications', () => ({
  getPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted' })
  ),
  requestPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted' })
  ),
  getExpoPushTokenAsync: jest.fn(() =>
    Promise.resolve({ data: 'mock-push-token' })
  ),
  scheduleNotificationAsync: jest.fn(() =>
    Promise.resolve('mock-notification-id')
  ),
  cancelScheduledNotificationAsync: jest.fn(() => Promise.resolve()),
  cancelAllScheduledNotificationsAsync: jest.fn(() => Promise.resolve()),
  getBadgeCountAsync: jest.fn(() => Promise.resolve(0)),
  setBadgeCountAsync: jest.fn(() => Promise.resolve()),
  setNotificationHandler: jest.fn(),
  addNotificationReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  addNotificationResponseReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  removeNotificationSubscription: jest.fn(),
}));

// Mock Stripe
jest.mock('@stripe/stripe-react-native', () => ({
  StripeProvider: ({ children }) => children,
  CardField: 'CardField',
  useStripe: () => ({
    confirmPayment: jest.fn(() =>
      Promise.resolve({ paymentIntent: { status: 'succeeded' } })
    ),
  }),
}));

// Suppress console errors in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Non-serializable values were found in the navigation state') ||
        args[0].includes('Cannot set property'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
