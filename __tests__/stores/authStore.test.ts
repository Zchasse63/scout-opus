import { useAuthStore } from '../../stores/authStore';
import { supabase } from '../../lib/supabase';

// Mock supabase
jest.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithOAuth: jest.fn(),
      signInWithOtp: jest.fn(),
      signOut: jest.fn(),
      refreshSession: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
  },
}));

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store state between tests
    useAuthStore.setState({
      user: null,
      session: null,
      isLoading: false,
      error: null,
    });
    jest.clearAllMocks();
  });

  test('initializes with empty user and session', () => {
    const state = useAuthStore.getState();

    expect(state.user).toBeNull();
    expect(state.session).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  test('sets user when authenticated', () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      app_metadata: {},
      user_metadata: {
        firstName: 'John',
        lastName: 'Doe',
      },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    };

    useAuthStore.setState({ user: mockUser as any });

    expect(useAuthStore.getState().user).toEqual(mockUser);
  });

  test('sets loading state during authentication', () => {
    useAuthStore.setState({ isLoading: true });

    expect(useAuthStore.getState().isLoading).toBe(true);

    useAuthStore.setState({ isLoading: false });

    expect(useAuthStore.getState().isLoading).toBe(false);
  });

  test('sets error when authentication fails', () => {
    const errorMessage = 'Invalid credentials';

    useAuthStore.setState({ error: errorMessage });

    expect(useAuthStore.getState().error).toBe(errorMessage);

    useAuthStore.setState({ error: null });

    expect(useAuthStore.getState().error).toBeNull();
  });

  test('clears error when clearError is called', () => {
    useAuthStore.setState({ error: 'Some error' });
    expect(useAuthStore.getState().error).toBe('Some error');

    useAuthStore.getState().clearError();

    expect(useAuthStore.getState().error).toBeNull();
  });

  test('signIn with apple provider calls supabase.auth.signInWithOAuth', async () => {
    (supabase.auth.signInWithOAuth as jest.Mock).mockResolvedValueOnce({
      error: null,
    });

    const store = useAuthStore.getState();
    await store.signIn('apple');

    expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'apple',
      options: {
        redirectTo: 'scout://auth-callback',
      },
    });
  });

  test('signIn with google provider calls supabase.auth.signInWithOAuth', async () => {
    (supabase.auth.signInWithOAuth as jest.Mock).mockResolvedValueOnce({
      error: null,
    });

    const store = useAuthStore.getState();
    await store.signIn('google');

    expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: 'scout://auth-callback',
      },
    });
  });

  test('signIn with email provider calls supabase.auth.signInWithOtp', async () => {
    (supabase.auth.signInWithOtp as jest.Mock).mockResolvedValueOnce({
      error: null,
    });

    const store = useAuthStore.getState();
    await store.signIn('email', 'test@example.com');

    expect(supabase.auth.signInWithOtp).toHaveBeenCalledWith({
      email: 'test@example.com',
      options: {
        emailRedirectTo: 'scout://auth-callback',
      },
    });
  });

  test('signOut clears user and session', async () => {
    (supabase.auth.signOut as jest.Mock).mockResolvedValueOnce({
      error: null,
    });

    useAuthStore.setState({
      user: { id: 'user-123' } as any,
      session: { user: { id: 'user-123' } } as any,
    });

    const store = useAuthStore.getState();
    await store.signOut();

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().session).toBeNull();
  });

  test('refreshSession updates session and user', async () => {
    const mockSession = {
      user: { id: 'user-123', email: 'test@example.com' },
    };

    (supabase.auth.refreshSession as jest.Mock).mockResolvedValueOnce({
      data: { session: mockSession },
      error: null,
    });

    const store = useAuthStore.getState();
    await store.refreshSession();

    expect(useAuthStore.getState().session).toEqual(mockSession);
    expect(useAuthStore.getState().user).toEqual(mockSession.user);
  });
});
