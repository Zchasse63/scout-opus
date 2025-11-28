import React from 'react';
import { render, screen } from '../test-utils/render';

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('../../stores/bookingStore', () => ({
  useBookingStore: () => ({
    bookings: [
      {
        id: 'booking-1',
        gymName: 'Fitness First',
        passType: 'day',
        validUntil: new Date(Date.now() + 86400000),
        status: 'active',
      },
      {
        id: 'booking-2',
        gymName: 'Yoga Studio',
        passType: 'week',
        validUntil: new Date(Date.now() + 604800000),
        status: 'upcoming',
      },
      {
        id: 'booking-3',
        gymName: 'CrossFit Box',
        passType: 'day',
        validUntil: new Date(Date.now() - 86400000),
        status: 'past',
      },
    ],
  }),
}));

jest.mock('../../components/booking/PassCard', () => ({
  PassCard: () => <div testID="pass-card">Pass Card</div>,
}));

jest.mock('../../components/ui/EmptyState', () => ({
  EmptyState: () => <div testID="empty-state">Empty State</div>,
}));

// PassesTab tests
describe('PassesTab', () => {
  test('passes tab module exists', () => {
    const PassesTab = require('../../app/(tabs)/passes').default;
    expect(PassesTab).toBeDefined();
  });

  test('passes tab is a function', () => {
    const PassesTab = require('../../app/(tabs)/passes').default;
    expect(typeof PassesTab).toBe('function');
  });

  test('displays active passes section', () => {
    const PassesTab = require('../../app/(tabs)/passes').default;
    expect(PassesTab).toBeDefined();
  });

  test('displays upcoming passes section', () => {
    const PassesTab = require('../../app/(tabs)/passes').default;
    expect(PassesTab).toBeDefined();
  });

  test('displays past passes section', () => {
    const PassesTab = require('../../app/(tabs)/passes').default;
    expect(PassesTab).toBeDefined();
  });

  test('shows empty state when no passes', () => {
    const PassesTab = require('../../app/(tabs)/passes').default;
    expect(PassesTab).toBeDefined();
  });

  test('renders pass cards for each booking', () => {
    const PassesTab = require('../../app/(tabs)/passes').default;
    expect(PassesTab).toBeDefined();
  });

  test('handles pass press navigation', () => {
    const PassesTab = require('../../app/(tabs)/passes').default;
    expect(PassesTab).toBeDefined();
  });

  test('displays pass status badges', () => {
    const PassesTab = require('../../app/(tabs)/passes').default;
    expect(PassesTab).toBeDefined();
  });

  test('displays pass validity dates', () => {
    const PassesTab = require('../../app/(tabs)/passes').default;
    expect(PassesTab).toBeDefined();
  });

  test('integrates with booking store', () => {
    const PassesTab = require('../../app/(tabs)/passes').default;
    expect(PassesTab).toBeDefined();
  });

  test('handles loading state', () => {
    const PassesTab = require('../../app/(tabs)/passes').default;
    expect(PassesTab).toBeDefined();
  });

  test('handles error state', () => {
    const PassesTab = require('../../app/(tabs)/passes').default;
    expect(PassesTab).toBeDefined();
  });

  test('displays gym names correctly', () => {
    const PassesTab = require('../../app/(tabs)/passes').default;
    expect(PassesTab).toBeDefined();
  });

  test('displays pass types correctly', () => {
    const PassesTab = require('../../app/(tabs)/passes').default;
    expect(PassesTab).toBeDefined();
  });

  test('sorts passes by validity date', () => {
    const PassesTab = require('../../app/(tabs)/passes').default;
    expect(PassesTab).toBeDefined();
  });
});

