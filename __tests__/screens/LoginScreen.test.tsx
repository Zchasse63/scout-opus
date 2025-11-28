import React from 'react';
import { render, screen, fireEvent, waitFor } from '../test-utils/render';

// Mock useAuthStore BEFORE importing LoginScreen
const mockSignIn = jest.fn();
jest.mock('../../stores/authStore', () => ({
  useAuthStore: () => ({
    signIn: mockSignIn,
    isLoading: false,
    error: null,
  }),
}));

// Import after mocking
import LoginScreen from '../../app/(auth)/login';

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login screen with title and subtitle', () => {
    render(<LoginScreen />);

    expect(screen.getByText('Scout')).toBeTruthy();
    expect(screen.getByText('Find & Book Gyms Anywhere')).toBeTruthy();
  });

  test('renders all sign-in buttons', () => {
    render(<LoginScreen />);

    expect(screen.getByText('Sign in with Apple')).toBeTruthy();
    expect(screen.getByText('Sign in with Google')).toBeTruthy();
    expect(screen.getByText('Send Magic Link')).toBeTruthy();
  });

  test('renders email input field', () => {
    render(<LoginScreen />);

    const emailInput = screen.getByPlaceholderText('Enter your email');
    expect(emailInput).toBeTruthy();
  });

  test('handles Apple sign-in button press', async () => {
    mockSignIn.mockResolvedValueOnce(undefined);
    render(<LoginScreen />);

    const appleButton = screen.getByText('Sign in with Apple');
    fireEvent.press(appleButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('apple');
    });
  });

  test('handles Google sign-in button press', async () => {
    mockSignIn.mockResolvedValueOnce(undefined);
    render(<LoginScreen />);

    const googleButton = screen.getByText('Sign in with Google');
    fireEvent.press(googleButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('google');
    });
  });

  test('updates email input on text change', () => {
    render(<LoginScreen />);

    const emailInput = screen.getByPlaceholderText('Enter your email');
    fireEvent.changeText(emailInput, 'test@example.com');

    expect(emailInput.props.value).toBe('test@example.com');
  });

  test('calls signIn with apple provider', async () => {
    mockSignIn.mockResolvedValueOnce(undefined);
    render(<LoginScreen />);

    const appleButton = screen.getByText('Sign in with Apple');
    fireEvent.press(appleButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('apple');
    });
  });

  test('calls signIn with google provider', async () => {
    mockSignIn.mockResolvedValueOnce(undefined);
    render(<LoginScreen />);

    const googleButton = screen.getByText('Sign in with Google');
    fireEvent.press(googleButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('google');
    });
  });
});

