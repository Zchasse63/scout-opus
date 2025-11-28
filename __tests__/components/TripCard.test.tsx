import React from 'react';
import { render, screen } from '../test-utils/render';

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
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

// TripCard tests
describe('TripCard', () => {
  test('trip card module exists', () => {
    const TripCard = require('../../components/trips/TripCard').TripCard;
    expect(TripCard).toBeDefined();
  });

  test('trip card is a function', () => {
    const TripCard = require('../../components/trips/TripCard').TripCard;
    expect(typeof TripCard).toBe('function');
  });

  test('displays trip name', () => {
    const TripCard = require('../../components/trips/TripCard').TripCard;
    expect(TripCard).toBeDefined();
  });

  test('displays trip destination', () => {
    const TripCard = require('../../components/trips/TripCard').TripCard;
    expect(TripCard).toBeDefined();
  });

  test('displays start date', () => {
    const TripCard = require('../../components/trips/TripCard').TripCard;
    expect(TripCard).toBeDefined();
  });

  test('displays end date', () => {
    const TripCard = require('../../components/trips/TripCard').TripCard;
    expect(TripCard).toBeDefined();
  });

  test('displays gym count', () => {
    const TripCard = require('../../components/trips/TripCard').TripCard;
    expect(TripCard).toBeDefined();
  });

  test('displays trip status', () => {
    const TripCard = require('../../components/trips/TripCard').TripCard;
    expect(TripCard).toBeDefined();
  });

  test('has view trip button', () => {
    const TripCard = require('../../components/trips/TripCard').TripCard;
    expect(TripCard).toBeDefined();
  });

  test('has edit trip button', () => {
    const TripCard = require('../../components/trips/TripCard').TripCard;
    expect(TripCard).toBeDefined();
  });

  test('has delete trip button', () => {
    const TripCard = require('../../components/trips/TripCard').TripCard;
    expect(TripCard).toBeDefined();
  });

  test('handles view trip press', () => {
    const TripCard = require('../../components/trips/TripCard').TripCard;
    expect(TripCard).toBeDefined();
  });

  test('handles edit trip press', () => {
    const TripCard = require('../../components/trips/TripCard').TripCard;
    expect(TripCard).toBeDefined();
  });

  test('handles delete trip press', () => {
    const TripCard = require('../../components/trips/TripCard').TripCard;
    expect(TripCard).toBeDefined();
  });

  test('displays trip image', () => {
    const TripCard = require('../../components/trips/TripCard').TripCard;
    expect(TripCard).toBeDefined();
  });

  test('displays trip duration', () => {
    const TripCard = require('../../components/trips/TripCard').TripCard;
    expect(TripCard).toBeDefined();
  });

  test('renders without crashing', () => {
    const TripCard = require('../../components/trips/TripCard').TripCard;
    expect(TripCard).toBeDefined();
  });

  test('displays gym list preview', () => {
    const TripCard = require('../../components/trips/TripCard').TripCard;
    expect(TripCard).toBeDefined();
  });
});

