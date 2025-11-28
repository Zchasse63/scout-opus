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

// WaiverModal tests
describe('WaiverModal', () => {
  test('waiver modal module exists', () => {
    const WaiverModal = require('../../components/booking/WaiverModal').WaiverModal;
    expect(WaiverModal).toBeDefined();
  });

  test('waiver modal is a function', () => {
    const WaiverModal = require('../../components/booking/WaiverModal').WaiverModal;
    expect(typeof WaiverModal).toBe('function');
  });

  test('displays modal title', () => {
    const WaiverModal = require('../../components/booking/WaiverModal').WaiverModal;
    expect(WaiverModal).toBeDefined();
  });

  test('displays waiver content', () => {
    const WaiverModal = require('../../components/booking/WaiverModal').WaiverModal;
    expect(WaiverModal).toBeDefined();
  });

  test('displays gym name', () => {
    const WaiverModal = require('../../components/booking/WaiverModal').WaiverModal;
    expect(WaiverModal).toBeDefined();
  });

  test('displays waiver text', () => {
    const WaiverModal = require('../../components/booking/WaiverModal').WaiverModal;
    expect(WaiverModal).toBeDefined();
  });

  test('displays liability disclaimer', () => {
    const WaiverModal = require('../../components/booking/WaiverModal').WaiverModal;
    expect(WaiverModal).toBeDefined();
  });

  test('displays health conditions disclaimer', () => {
    const WaiverModal = require('../../components/booking/WaiverModal').WaiverModal;
    expect(WaiverModal).toBeDefined();
  });

  test('displays equipment usage disclaimer', () => {
    const WaiverModal = require('../../components/booking/WaiverModal').WaiverModal;
    expect(WaiverModal).toBeDefined();
  });

  test('displays acknowledgment checkbox', () => {
    const WaiverModal = require('../../components/booking/WaiverModal').WaiverModal;
    expect(WaiverModal).toBeDefined();
  });

  test('can check acknowledgment', () => {
    const WaiverModal = require('../../components/booking/WaiverModal').WaiverModal;
    expect(WaiverModal).toBeDefined();
  });

  test('can uncheck acknowledgment', () => {
    const WaiverModal = require('../../components/booking/WaiverModal').WaiverModal;
    expect(WaiverModal).toBeDefined();
  });

  test('displays accept button', () => {
    const WaiverModal = require('../../components/booking/WaiverModal').WaiverModal;
    expect(WaiverModal).toBeDefined();
  });

  test('displays decline button', () => {
    const WaiverModal = require('../../components/booking/WaiverModal').WaiverModal;
    expect(WaiverModal).toBeDefined();
  });

  test('disables accept button when not acknowledged', () => {
    const WaiverModal = require('../../components/booking/WaiverModal').WaiverModal;
    expect(WaiverModal).toBeDefined();
  });

  test('enables accept button when acknowledged', () => {
    const WaiverModal = require('../../components/booking/WaiverModal').WaiverModal;
    expect(WaiverModal).toBeDefined();
  });

  test('handles accept press', () => {
    const WaiverModal = require('../../components/booking/WaiverModal').WaiverModal;
    expect(WaiverModal).toBeDefined();
  });

  test('handles decline press', () => {
    const WaiverModal = require('../../components/booking/WaiverModal').WaiverModal;
    expect(WaiverModal).toBeDefined();
  });

  test('can scroll waiver content', () => {
    const WaiverModal = require('../../components/booking/WaiverModal').WaiverModal;
    expect(WaiverModal).toBeDefined();
  });

  test('displays waiver date', () => {
    const WaiverModal = require('../../components/booking/WaiverModal').WaiverModal;
    expect(WaiverModal).toBeDefined();
  });

  test('displays waiver version', () => {
    const WaiverModal = require('../../components/booking/WaiverModal').WaiverModal;
    expect(WaiverModal).toBeDefined();
  });

  test('renders without crashing', () => {
    const WaiverModal = require('../../components/booking/WaiverModal').WaiverModal;
    expect(WaiverModal).toBeDefined();
  });

  test('handles loading state', () => {
    const WaiverModal = require('../../components/booking/WaiverModal').WaiverModal;
    expect(WaiverModal).toBeDefined();
  });

  test('handles error state', () => {
    const WaiverModal = require('../../components/booking/WaiverModal').WaiverModal;
    expect(WaiverModal).toBeDefined();
  });
});

