import React from 'react';
import { render, screen, fireEvent, waitFor } from '../test-utils/render';

// Mock dependencies
const mockSetSearchQuery = jest.fn();
const mockSetViewMode = jest.fn();
const mockToggleSave = jest.fn();

jest.mock('../../hooks/useGymSearch', () => ({
  useGymSearch: () => ({
    setSearchQuery: mockSetSearchQuery,
    results: [
      {
        id: 'gym-1',
        name: 'Fitness First',
        address: '123 Main St',
        rating: 4.5,
        distance: 0.5,
        amenities: ['Weights', 'Cardio', 'Yoga'],
        imageUrl: 'https://example.com/gym1.jpg',
      },
      {
        id: 'gym-2',
        name: 'Gold Gym',
        address: '456 Oak Ave',
        rating: 4.2,
        distance: 1.2,
        amenities: ['Weights', 'Pool', 'Sauna'],
        imageUrl: 'https://example.com/gym2.jpg',
      },
    ],
    isLoading: false,
  }),
}));

jest.mock('../../stores/mapStore', () => ({
  useMapStore: () => ({
    viewMode: 'list',
    setViewMode: mockSetViewMode,
  }),
}));

jest.mock('../../hooks/useSavedGyms', () => ({
  useSavedGyms: () => ({
    isSaved: jest.fn(() => false),
    toggleSave: mockToggleSave,
  }),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

import ExploreTab from '../../app/(tabs)/index';

describe('ExploreTab', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders explore tab with list view', () => {
    render(<ExploreTab />);

    expect(screen.getByText('Fitness First')).toBeTruthy();
    expect(screen.getByText('Gold Gym')).toBeTruthy();
  });

  test('displays gym cards in list view', () => {
    render(<ExploreTab />);

    expect(screen.getByText('Fitness First')).toBeTruthy();
    expect(screen.getByText('123 Main St')).toBeTruthy();
    expect(screen.getByText('Gold Gym')).toBeTruthy();
    expect(screen.getByText('456 Oak Ave')).toBeTruthy();
  });

  test('renders without crashing', () => {
    const { root } = render(<ExploreTab />);
    expect(root).toBeTruthy();
  });
});

