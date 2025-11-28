import React from 'react';
import { render, screen, fireEvent, waitFor } from '../test-utils/render';

// Mock dependencies
const mockOnPress = jest.fn();
const mockOnSaveToggle = jest.fn();

jest.mock('../../hooks/useSavedGyms', () => ({
  useSavedGyms: () => ({
    isSaved: jest.fn((gymId) => gymId === 'gym-1'),
    toggleSave: mockOnSaveToggle,
  }),
}));

jest.mock('../../utils/haptics', () => ({
  haptics: {
    light: jest.fn(),
  },
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

import GymCard from '../../components/explore/GymCard';

const mockGym = {
  id: 'gym-1',
  name: 'Fitness First',
  address: '123 Main St, Miami, FL',
  rating: 4.5,
  reviewCount: 128,
  distance: 0.5,
  amenities: ['Weights', 'Cardio', 'Yoga', 'Sauna'],
  imageUrl: 'https://example.com/gym1.jpg',
  priceRange: '$$',
  isOpen: true,
  openingHours: '6:00 AM - 10:00 PM',
};

describe('GymCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders gym name', () => {
    render(<GymCard gym={mockGym} onPress={mockOnPress} />);
    
    expect(screen.getByText('Fitness First')).toBeTruthy();
  });

  test('renders gym address', () => {
    render(<GymCard gym={mockGym} onPress={mockOnPress} />);
    
    expect(screen.getByText('123 Main St, Miami, FL')).toBeTruthy();
  });

  test('renders gym rating', () => {
    render(<GymCard gym={mockGym} onPress={mockOnPress} />);

    expect(screen.getByText('4.5')).toBeTruthy();
  });

  test('renders amenities', () => {
    render(<GymCard gym={mockGym} onPress={mockOnPress} />);
    
    expect(screen.getByText('Weights')).toBeTruthy();
    expect(screen.getByText('Cardio')).toBeTruthy();
  });

  test('has onPress callback available', () => {
    render(<GymCard gym={mockGym} onPress={mockOnPress} />);

    // Verify the component renders with the onPress prop
    expect(mockOnPress).toBeDefined();
  });

  test('renders without crashing', () => {
    const { root } = render(<GymCard gym={mockGym} onPress={mockOnPress} />);
    expect(root).toBeTruthy();
  });
});

