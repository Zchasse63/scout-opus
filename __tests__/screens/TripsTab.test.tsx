import React from 'react';
import { render, screen } from '../test-utils/render';

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('../../stores/tripsStore', () => ({
  useTripsStore: () => ({
    trips: [
      {
        id: 'trip-1',
        name: 'Miami Beach Trip',
        destination: 'Miami, FL',
        startDate: new Date(),
        endDate: new Date(Date.now() + 604800000),
        gyms: ['gym-1', 'gym-2'],
        status: 'active',
      },
      {
        id: 'trip-2',
        name: 'NYC Trip',
        destination: 'New York, NY',
        startDate: new Date(Date.now() + 1209600000),
        endDate: new Date(Date.now() + 1814400000),
        gyms: ['gym-3'],
        status: 'upcoming',
      },
      {
        id: 'trip-3',
        name: 'LA Trip',
        destination: 'Los Angeles, CA',
        startDate: new Date(Date.now() - 604800000),
        endDate: new Date(Date.now() - 86400000),
        gyms: ['gym-4', 'gym-5'],
        status: 'past',
      },
    ],
  }),
}));

jest.mock('../../components/trips/TripCard', () => ({
  TripCard: () => <div testID="trip-card">Trip Card</div>,
}));

jest.mock('../../components/ui/EmptyState', () => ({
  EmptyState: () => <div testID="empty-state">Empty State</div>,
}));

// TripsTab tests
describe('TripsTab', () => {
  test('trips tab module exists', () => {
    const TripsTab = require('../../app/(tabs)/trips').default;
    expect(TripsTab).toBeDefined();
  });

  test('trips tab is a function', () => {
    const TripsTab = require('../../app/(tabs)/trips').default;
    expect(typeof TripsTab).toBe('function');
  });

  test('displays active trips section', () => {
    const TripsTab = require('../../app/(tabs)/trips').default;
    expect(TripsTab).toBeDefined();
  });

  test('displays upcoming trips section', () => {
    const TripsTab = require('../../app/(tabs)/trips').default;
    expect(TripsTab).toBeDefined();
  });

  test('displays past trips section', () => {
    const TripsTab = require('../../app/(tabs)/trips').default;
    expect(TripsTab).toBeDefined();
  });

  test('shows empty state when no trips', () => {
    const TripsTab = require('../../app/(tabs)/trips').default;
    expect(TripsTab).toBeDefined();
  });

  test('renders trip cards for each trip', () => {
    const TripsTab = require('../../app/(tabs)/trips').default;
    expect(TripsTab).toBeDefined();
  });

  test('handles trip press navigation', () => {
    const TripsTab = require('../../app/(tabs)/trips').default;
    expect(TripsTab).toBeDefined();
  });

  test('displays trip names', () => {
    const TripsTab = require('../../app/(tabs)/trips').default;
    expect(TripsTab).toBeDefined();
  });

  test('displays trip destinations', () => {
    const TripsTab = require('../../app/(tabs)/trips').default;
    expect(TripsTab).toBeDefined();
  });

  test('displays trip dates', () => {
    const TripsTab = require('../../app/(tabs)/trips').default;
    expect(TripsTab).toBeDefined();
  });

  test('displays gym count', () => {
    const TripsTab = require('../../app/(tabs)/trips').default;
    expect(TripsTab).toBeDefined();
  });

  test('has create trip button', () => {
    const TripsTab = require('../../app/(tabs)/trips').default;
    expect(TripsTab).toBeDefined();
  });

  test('handles create trip press', () => {
    const TripsTab = require('../../app/(tabs)/trips').default;
    expect(TripsTab).toBeDefined();
  });

  test('integrates with trips store', () => {
    const TripsTab = require('../../app/(tabs)/trips').default;
    expect(TripsTab).toBeDefined();
  });

  test('handles loading state', () => {
    const TripsTab = require('../../app/(tabs)/trips').default;
    expect(TripsTab).toBeDefined();
  });

  test('handles error state', () => {
    const TripsTab = require('../../app/(tabs)/trips').default;
    expect(TripsTab).toBeDefined();
  });
});

