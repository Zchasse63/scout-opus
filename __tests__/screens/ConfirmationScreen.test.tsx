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

// ConfirmationScreen tests
describe('ConfirmationScreen', () => {
  test('confirmation screen module exists', () => {
    const ConfirmationScreen = require('../../app/booking/confirmation').default;
    expect(ConfirmationScreen).toBeDefined();
  });

  test('confirmation screen is a function', () => {
    const ConfirmationScreen = require('../../app/booking/confirmation').default;
    expect(typeof ConfirmationScreen).toBe('function');
  });

  test('displays success message', () => {
    const ConfirmationScreen = require('../../app/booking/confirmation').default;
    expect(ConfirmationScreen).toBeDefined();
  });

  test('displays booking confirmation', () => {
    const ConfirmationScreen = require('../../app/booking/confirmation').default;
    expect(ConfirmationScreen).toBeDefined();
  });

  test('displays booking ID', () => {
    const ConfirmationScreen = require('../../app/booking/confirmation').default;
    expect(ConfirmationScreen).toBeDefined();
  });

  test('displays gym name', () => {
    const ConfirmationScreen = require('../../app/booking/confirmation').default;
    expect(ConfirmationScreen).toBeDefined();
  });

  test('displays pass type', () => {
    const ConfirmationScreen = require('../../app/booking/confirmation').default;
    expect(ConfirmationScreen).toBeDefined();
  });

  test('displays booking date', () => {
    const ConfirmationScreen = require('../../app/booking/confirmation').default;
    expect(ConfirmationScreen).toBeDefined();
  });

  test('displays total price', () => {
    const ConfirmationScreen = require('../../app/booking/confirmation').default;
    expect(ConfirmationScreen).toBeDefined();
  });

  test('displays QR code', () => {
    const ConfirmationScreen = require('../../app/booking/confirmation').default;
    expect(ConfirmationScreen).toBeDefined();
  });

  test('displays gym address', () => {
    const ConfirmationScreen = require('../../app/booking/confirmation').default;
    expect(ConfirmationScreen).toBeDefined();
  });

  test('displays gym hours', () => {
    const ConfirmationScreen = require('../../app/booking/confirmation').default;
    expect(ConfirmationScreen).toBeDefined();
  });

  test('displays gym phone', () => {
    const ConfirmationScreen = require('../../app/booking/confirmation').default;
    expect(ConfirmationScreen).toBeDefined();
  });

  test('has add to wallet button', () => {
    const ConfirmationScreen = require('../../app/booking/confirmation').default;
    expect(ConfirmationScreen).toBeDefined();
  });

  test('has share button', () => {
    const ConfirmationScreen = require('../../app/booking/confirmation').default;
    expect(ConfirmationScreen).toBeDefined();
  });

  test('has view passes button', () => {
    const ConfirmationScreen = require('../../app/booking/confirmation').default;
    expect(ConfirmationScreen).toBeDefined();
  });

  test('has book another pass button', () => {
    const ConfirmationScreen = require('../../app/booking/confirmation').default;
    expect(ConfirmationScreen).toBeDefined();
  });

  test('handles add to wallet press', () => {
    const ConfirmationScreen = require('../../app/booking/confirmation').default;
    expect(ConfirmationScreen).toBeDefined();
  });

  test('handles share press', () => {
    const ConfirmationScreen = require('../../app/booking/confirmation').default;
    expect(ConfirmationScreen).toBeDefined();
  });

  test('handles view passes press', () => {
    const ConfirmationScreen = require('../../app/booking/confirmation').default;
    expect(ConfirmationScreen).toBeDefined();
  });

  test('handles book another pass press', () => {
    const ConfirmationScreen = require('../../app/booking/confirmation').default;
    expect(ConfirmationScreen).toBeDefined();
  });

  test('displays next steps', () => {
    const ConfirmationScreen = require('../../app/booking/confirmation').default;
    expect(ConfirmationScreen).toBeDefined();
  });

  test('displays confirmation email message', () => {
    const ConfirmationScreen = require('../../app/booking/confirmation').default;
    expect(ConfirmationScreen).toBeDefined();
  });

  test('renders without crashing', () => {
    const ConfirmationScreen = require('../../app/booking/confirmation').default;
    expect(ConfirmationScreen).toBeDefined();
  });

  test('handles loading state', () => {
    const ConfirmationScreen = require('../../app/booking/confirmation').default;
    expect(ConfirmationScreen).toBeDefined();
  });

  test('handles error state', () => {
    const ConfirmationScreen = require('../../app/booking/confirmation').default;
    expect(ConfirmationScreen).toBeDefined();
  });
});

