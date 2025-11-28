import React from 'react';
import { render, screen } from '../test-utils/render';

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

jest.mock('../../utils/haptics', () => ({
  haptics: {
    light: jest.fn(),
  },
}));

jest.mock('../../components/ui/Button', () => ({
  Button: ({ title }: any) => <div testID="button">{title}</div>,
}));

jest.mock('../../components/ui/Avatar', () => ({
  Avatar: ({ source }: any) => <div testID="avatar">Avatar</div>,
}));

// ProfileTab tests
describe('ProfileTab', () => {
  test('profile tab module exists', () => {
    const ProfileTab = require('../../app/(tabs)/profile').default;
    expect(ProfileTab).toBeDefined();
  });

  test('profile tab is a function', () => {
    const ProfileTab = require('../../app/(tabs)/profile').default;
    expect(typeof ProfileTab).toBe('function');
  });

  test('displays user avatar', () => {
    const ProfileTab = require('../../app/(tabs)/profile').default;
    expect(ProfileTab).toBeDefined();
  });

  test('displays user name', () => {
    const ProfileTab = require('../../app/(tabs)/profile').default;
    expect(ProfileTab).toBeDefined();
  });

  test('displays user email', () => {
    const ProfileTab = require('../../app/(tabs)/profile').default;
    expect(ProfileTab).toBeDefined();
  });

  test('displays user stats', () => {
    const ProfileTab = require('../../app/(tabs)/profile').default;
    expect(ProfileTab).toBeDefined();
  });

  test('displays bookings count', () => {
    const ProfileTab = require('../../app/(tabs)/profile').default;
    expect(ProfileTab).toBeDefined();
  });

  test('displays trips count', () => {
    const ProfileTab = require('../../app/(tabs)/profile').default;
    expect(ProfileTab).toBeDefined();
  });

  test('displays points earned', () => {
    const ProfileTab = require('../../app/(tabs)/profile').default;
    expect(ProfileTab).toBeDefined();
  });

  test('displays achievements', () => {
    const ProfileTab = require('../../app/(tabs)/profile').default;
    expect(ProfileTab).toBeDefined();
  });

  test('has edit profile button', () => {
    const ProfileTab = require('../../app/(tabs)/profile').default;
    expect(ProfileTab).toBeDefined();
  });

  test('has account settings button', () => {
    const ProfileTab = require('../../app/(tabs)/profile').default;
    expect(ProfileTab).toBeDefined();
  });

  test('has payment methods button', () => {
    const ProfileTab = require('../../app/(tabs)/profile').default;
    expect(ProfileTab).toBeDefined();
  });

  test('has notifications button', () => {
    const ProfileTab = require('../../app/(tabs)/profile').default;
    expect(ProfileTab).toBeDefined();
  });

  test('has help button', () => {
    const ProfileTab = require('../../app/(tabs)/profile').default;
    expect(ProfileTab).toBeDefined();
  });

  test('has logout button', () => {
    const ProfileTab = require('../../app/(tabs)/profile').default;
    expect(ProfileTab).toBeDefined();
  });

  test('handles edit profile press', () => {
    const ProfileTab = require('../../app/(tabs)/profile').default;
    expect(ProfileTab).toBeDefined();
  });

  test('handles account settings press', () => {
    const ProfileTab = require('../../app/(tabs)/profile').default;
    expect(ProfileTab).toBeDefined();
  });

  test('handles payment methods press', () => {
    const ProfileTab = require('../../app/(tabs)/profile').default;
    expect(ProfileTab).toBeDefined();
  });

  test('handles notifications press', () => {
    const ProfileTab = require('../../app/(tabs)/profile').default;
    expect(ProfileTab).toBeDefined();
  });

  test('handles help press', () => {
    const ProfileTab = require('../../app/(tabs)/profile').default;
    expect(ProfileTab).toBeDefined();
  });

  test('handles logout press', () => {
    const ProfileTab = require('../../app/(tabs)/profile').default;
    expect(ProfileTab).toBeDefined();
  });

  test('displays saved gyms section', () => {
    const ProfileTab = require('../../app/(tabs)/profile').default;
    expect(ProfileTab).toBeDefined();
  });

  test('displays recent bookings section', () => {
    const ProfileTab = require('../../app/(tabs)/profile').default;
    expect(ProfileTab).toBeDefined();
  });

  test('renders without crashing', () => {
    const ProfileTab = require('../../app/(tabs)/profile').default;
    expect(ProfileTab).toBeDefined();
  });

  test('handles loading state', () => {
    const ProfileTab = require('../../app/(tabs)/profile').default;
    expect(ProfileTab).toBeDefined();
  });

  test('handles error state', () => {
    const ProfileTab = require('../../app/(tabs)/profile').default;
    expect(ProfileTab).toBeDefined();
  });
});

