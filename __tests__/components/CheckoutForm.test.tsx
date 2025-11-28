import React from 'react';
import { render, screen, fireEvent, waitFor } from '../test-utils/render';

// Mock dependencies
const mockOnSuccess = jest.fn();

jest.mock('@stripe/stripe-react-native', () => ({
  useStripe: () => ({
    confirmPayment: jest.fn().mockResolvedValue({ error: null }),
  }),
  CardField: () => <div testID="card-field">Card Field</div>,
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('../../components/booking/WaiverModal', () => ({
  WaiverModal: () => <div testID="waiver-modal">Waiver Modal</div>,
}));

jest.mock('../../components/booking/PassTypeSelector', () => ({
  PassTypeSelector: () => <div testID="pass-type-selector">Pass Type Selector</div>,
}));

jest.mock('../../components/booking/DatePicker', () => ({
  DatePicker: () => <div testID="date-picker">Date Picker</div>,
}));

jest.mock('../../components/booking/PriceBreakdown', () => ({
  PriceBreakdown: () => <div testID="price-breakdown">Price Breakdown</div>,
}));

jest.mock('../../components/ui/Button', () => ({
  Button: ({ title }: any) => <div testID="button">{title}</div>,
}));

jest.mock('../../utils/haptics', () => ({
  haptics: {
    light: jest.fn(),
  },
}));

import { CheckoutForm } from '../../components/booking/CheckoutForm';

describe('CheckoutForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders gym name', () => {
    render(
      <CheckoutForm
        gymId="gym-1"
        gymName="Fitness First"
        dayPassPrice={25}
        onSuccess={mockOnSuccess}
      />
    );
    
    expect(screen.getByText('Fitness First')).toBeTruthy();
  });

  test('accepts day pass price prop', () => {
    const { root } = render(
      <CheckoutForm
        gymId="gym-1"
        gymName="Fitness First"
        dayPassPrice={25}
        onSuccess={mockOnSuccess}
      />
    );

    expect(root).toBeTruthy();
  });

  test('accepts week pass price prop', () => {
    const { root } = render(
      <CheckoutForm
        gymId="gym-1"
        gymName="Fitness First"
        dayPassPrice={25}
        weekPassPrice={100}
        onSuccess={mockOnSuccess}
      />
    );

    expect(root).toBeTruthy();
  });

  test('accepts month pass price prop', () => {
    const { root } = render(
      <CheckoutForm
        gymId="gym-1"
        gymName="Fitness First"
        dayPassPrice={25}
        monthPassPrice={300}
        onSuccess={mockOnSuccess}
      />
    );

    expect(root).toBeTruthy();
  });

  test('renders pass type selector', () => {
    render(
      <CheckoutForm
        gymId="gym-1"
        gymName="Fitness First"
        dayPassPrice={25}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByTestId('pass-type-selector')).toBeTruthy();
  });

  test('renders waiver section', () => {
    render(
      <CheckoutForm
        gymId="gym-1"
        gymName="Fitness First"
        dayPassPrice={25}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByTestId('waiver-modal')).toBeTruthy();
  });

  test('renders pay button', () => {
    render(
      <CheckoutForm
        gymId="gym-1"
        gymName="Fitness First"
        dayPassPrice={25}
        onSuccess={mockOnSuccess}
      />
    );
    
    expect(screen.getByText(/Pay/i)).toBeTruthy();
  });

  test('renders without crashing', () => {
    const { root } = render(
      <CheckoutForm
        gymId="gym-1"
        gymName="Fitness First"
        dayPassPrice={25}
        onSuccess={mockOnSuccess}
      />
    );
    expect(root).toBeTruthy();
  });
});

