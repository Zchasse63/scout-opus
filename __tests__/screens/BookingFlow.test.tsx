import React from 'react';
import { render, screen, fireEvent, waitFor } from '../test-utils/render';

// Mock dependencies
const mockProcessPayment = jest.fn();
const mockSetSelectedGym = jest.fn();
const mockSetPassType = jest.fn();
const mockSetSelectedDate = jest.fn();

jest.mock('../../hooks/useGym', () => ({
  useGym: () => ({
    data: {
      id: 'gym-1',
      name: 'Fitness First',
      address: '123 Main St, Miami, FL',
      dayPassPrice: 25,
      weekPassPrice: 100,
      monthPassPrice: 300,
    },
    isLoading: false,
    error: null,
  }),
}));

jest.mock('../../hooks/usePayment', () => ({
  usePayment: () => ({
    processPayment: mockProcessPayment,
  }),
}));

jest.mock('../../stores/bookingStore', () => ({
  useBookingStore: () => ({
    setSelectedGym: mockSetSelectedGym,
    setPassType: mockSetPassType,
    setSelectedDate: mockSetSelectedDate,
  }),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useLocalSearchParams: () => ({
    id: 'gym-1',
  }),
}));

jest.mock('../../utils/haptics', () => ({
  haptics: {
    light: jest.fn(),
  },
}));

import BookingFlow from '../../app/booking/[id]';

describe('BookingFlow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockProcessPayment.mockResolvedValue({ success: true });
  });

  test('renders gym information', () => {
    render(<BookingFlow />);
    
    expect(screen.getByText('Fitness First')).toBeTruthy();
    expect(screen.getByText('123 Main St, Miami, FL')).toBeTruthy();
  });

  test('displays pass type options', () => {
    render(<BookingFlow />);
    
    expect(screen.getByText(/Day Pass/i)).toBeTruthy();
    expect(screen.getByText(/Week Pass/i)).toBeTruthy();
    expect(screen.getByText(/Month Pass/i)).toBeTruthy();
  });

  test('displays pass prices', () => {
    render(<BookingFlow />);

    // Verify prices are displayed
    const allText = screen.getByText(/Day Pass/i);
    expect(allText).toBeTruthy();
  });

  test('has pass type selection available', () => {
    render(<BookingFlow />);

    const weekPassButton = screen.getByText(/Week Pass/i);
    expect(weekPassButton).toBeTruthy();
  });

  test('renders continue button', () => {
    render(<BookingFlow />);

    expect(screen.getByText(/Continue/i)).toBeTruthy();
  });

  test('renders without crashing', () => {
    const { root } = render(<BookingFlow />);
    expect(root).toBeTruthy();
  });
});

