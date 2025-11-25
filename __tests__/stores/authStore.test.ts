import { useAuthStore } from '../../stores/authStore';

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store state between tests
    useAuthStore.setState({
      user: null,
      session: null,
      isLoading: false,
      error: null,
    });
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
});
