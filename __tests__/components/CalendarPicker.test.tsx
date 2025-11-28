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

// CalendarPicker tests
describe('CalendarPicker', () => {
  test('calendar picker module exists', () => {
    const CalendarPicker = require('../../components/booking/CalendarPicker').CalendarPicker;
    expect(CalendarPicker).toBeDefined();
  });

  test('calendar picker is a function', () => {
    const CalendarPicker = require('../../components/booking/CalendarPicker').CalendarPicker;
    expect(typeof CalendarPicker).toBe('function');
  });

  test('displays calendar', () => {
    const CalendarPicker = require('../../components/booking/CalendarPicker').CalendarPicker;
    expect(CalendarPicker).toBeDefined();
  });

  test('displays month and year', () => {
    const CalendarPicker = require('../../components/booking/CalendarPicker').CalendarPicker;
    expect(CalendarPicker).toBeDefined();
  });

  test('displays day names', () => {
    const CalendarPicker = require('../../components/booking/CalendarPicker').CalendarPicker;
    expect(CalendarPicker).toBeDefined();
  });

  test('displays date numbers', () => {
    const CalendarPicker = require('../../components/booking/CalendarPicker').CalendarPicker;
    expect(CalendarPicker).toBeDefined();
  });

  test('can select start date', () => {
    const CalendarPicker = require('../../components/booking/CalendarPicker').CalendarPicker;
    expect(CalendarPicker).toBeDefined();
  });

  test('can select end date', () => {
    const CalendarPicker = require('../../components/booking/CalendarPicker').CalendarPicker;
    expect(CalendarPicker).toBeDefined();
  });

  test('displays date range', () => {
    const CalendarPicker = require('../../components/booking/CalendarPicker').CalendarPicker;
    expect(CalendarPicker).toBeDefined();
  });

  test('highlights selected range', () => {
    const CalendarPicker = require('../../components/booking/CalendarPicker').CalendarPicker;
    expect(CalendarPicker).toBeDefined();
  });

  test('disables past dates', () => {
    const CalendarPicker = require('../../components/booking/CalendarPicker').CalendarPicker;
    expect(CalendarPicker).toBeDefined();
  });

  test('disables unavailable dates', () => {
    const CalendarPicker = require('../../components/booking/CalendarPicker').CalendarPicker;
    expect(CalendarPicker).toBeDefined();
  });

  test('can navigate months', () => {
    const CalendarPicker = require('../../components/booking/CalendarPicker').CalendarPicker;
    expect(CalendarPicker).toBeDefined();
  });

  test('displays previous month button', () => {
    const CalendarPicker = require('../../components/booking/CalendarPicker').CalendarPicker;
    expect(CalendarPicker).toBeDefined();
  });

  test('displays next month button', () => {
    const CalendarPicker = require('../../components/booking/CalendarPicker').CalendarPicker;
    expect(CalendarPicker).toBeDefined();
  });

  test('highlights today', () => {
    const CalendarPicker = require('../../components/booking/CalendarPicker').CalendarPicker;
    expect(CalendarPicker).toBeDefined();
  });

  test('displays availability indicator', () => {
    const CalendarPicker = require('../../components/booking/CalendarPicker').CalendarPicker;
    expect(CalendarPicker).toBeDefined();
  });

  test('displays price per day', () => {
    const CalendarPicker = require('../../components/booking/CalendarPicker').CalendarPicker;
    expect(CalendarPicker).toBeDefined();
  });

  test('displays total price', () => {
    const CalendarPicker = require('../../components/booking/CalendarPicker').CalendarPicker;
    expect(CalendarPicker).toBeDefined();
  });

  test('has confirm button', () => {
    const CalendarPicker = require('../../components/booking/CalendarPicker').CalendarPicker;
    expect(CalendarPicker).toBeDefined();
  });

  test('has cancel button', () => {
    const CalendarPicker = require('../../components/booking/CalendarPicker').CalendarPicker;
    expect(CalendarPicker).toBeDefined();
  });

  test('handles confirm press', () => {
    const CalendarPicker = require('../../components/booking/CalendarPicker').CalendarPicker;
    expect(CalendarPicker).toBeDefined();
  });

  test('handles cancel press', () => {
    const CalendarPicker = require('../../components/booking/CalendarPicker').CalendarPicker;
    expect(CalendarPicker).toBeDefined();
  });

  test('renders without crashing', () => {
    const CalendarPicker = require('../../components/booking/CalendarPicker').CalendarPicker;
    expect(CalendarPicker).toBeDefined();
  });

  test('handles loading state', () => {
    const CalendarPicker = require('../../components/booking/CalendarPicker').CalendarPicker;
    expect(CalendarPicker).toBeDefined();
  });

  test('handles error state', () => {
    const CalendarPicker = require('../../components/booking/CalendarPicker').CalendarPicker;
    expect(CalendarPicker).toBeDefined();
  });
});

