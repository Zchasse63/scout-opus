import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useCalendarSync } from '../useCalendarSync';
import * as Calendar from 'expo-calendar';

jest.mock('expo-calendar');

describe('useCalendarSync', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with no permission', async () => {
    (Calendar.getCalendarPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'denied',
    });

    const { result } = renderHook(() => useCalendarSync());

    await waitFor(() => {
      expect(result.current.hasPermission).toBe(false);
    });
  });

  it('should check permission on mount', async () => {
    (Calendar.getCalendarPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });

    const { result } = renderHook(() => useCalendarSync());

    await waitFor(() => {
      expect(result.current.hasPermission).toBe(true);
    });

    expect(Calendar.getCalendarPermissionsAsync).toHaveBeenCalled();
  });

  it('should request permission', async () => {
    (Calendar.requestCalendarPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });

    const { result } = renderHook(() => useCalendarSync());

    let permissionGranted: boolean = false;

    await act(async () => {
      permissionGranted = await result.current.requestPermission();
    });

    expect(permissionGranted).toBe(true);
    expect(result.current.hasPermission).toBe(true);
    expect(Calendar.requestCalendarPermissionsAsync).toHaveBeenCalled();
  });

  it('should load calendars when permission granted', async () => {
    (Calendar.getCalendarPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });

    const mockCalendars = [
      { id: 'cal-1', title: 'Personal', allowsModifications: true },
      { id: 'cal-2', title: 'Work', allowsModifications: true },
    ];

    (Calendar.getCalendarsAsync as jest.Mock).mockResolvedValue(mockCalendars);

    const { result } = renderHook(() => useCalendarSync());

    await waitFor(() => {
      expect(result.current.calendars).toEqual(mockCalendars);
    });

    expect(Calendar.getCalendarsAsync).toHaveBeenCalled();
  });

  it('should fetch upcoming events', async () => {
    (Calendar.getCalendarPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });

    (Calendar.getCalendarsAsync as jest.Mock).mockResolvedValue([
      { id: 'cal-1', title: 'Personal' },
    ]);

    const mockEvents = [
      {
        id: 'event-1',
        title: 'Meeting',
        startDate: new Date('2025-12-01'),
        endDate: new Date('2025-12-01'),
        location: 'Office',
        notes: 'Important meeting',
      },
    ];

    (Calendar.getEventsAsync as jest.Mock).mockResolvedValue(mockEvents);

    const { result } = renderHook(() => useCalendarSync());

    await waitFor(() => {
      expect(result.current.hasPermission).toBe(true);
    });

    let events: any[] = [];

    await act(async () => {
      events = await result.current.fetchUpcomingEvents(30);
    });

    expect(events).toHaveLength(1);
    expect(events[0].title).toBe('Meeting');
    expect(Calendar.getEventsAsync).toHaveBeenCalled();
  });

  it('should detect trips from calendar events', async () => {
    (Calendar.getCalendarPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });

    (Calendar.getCalendarsAsync as jest.Mock).mockResolvedValue([
      { id: 'cal-1', title: 'Personal' },
    ]);

    const mockEvents = [
      {
        id: 'event-1',
        title: 'Trip to Paris',
        startDate: new Date('2025-12-01'),
        endDate: new Date('2025-12-05'),
        location: 'Paris, France',
        notes: 'Vacation',
      },
      {
        id: 'event-2',
        title: 'Short meeting',
        startDate: new Date('2025-12-01T10:00:00'),
        endDate: new Date('2025-12-01T11:00:00'),
        location: 'Office',
        notes: '',
      },
    ];

    (Calendar.getEventsAsync as jest.Mock).mockResolvedValue(mockEvents);

    const { result } = renderHook(() => useCalendarSync());

    await waitFor(() => {
      expect(result.current.hasPermission).toBe(true);
    });

    let trips: any[] = [];

    await act(async () => {
      trips = await result.current.detectTrips();
    });

    // Should only detect the multi-day trip with travel keyword
    expect(trips).toHaveLength(1);
    expect(trips[0].destination).toBe('Paris, France');
    expect(trips[0].calendarTitle).toBe('Trip to Paris');
  });

  it('should add event to calendar', async () => {
    (Calendar.getCalendarPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });

    (Calendar.getCalendarsAsync as jest.Mock).mockResolvedValue([
      { id: 'cal-1', title: 'Personal', allowsModifications: true },
    ]);

    (Calendar.createEventAsync as jest.Mock).mockResolvedValue('new-event-id');

    const { result } = renderHook(() => useCalendarSync());

    await waitFor(() => {
      expect(result.current.hasPermission).toBe(true);
    });

    let eventId: string | null = null;

    await act(async () => {
      eventId = await result.current.addEventToCalendar(
        'Trip to Tokyo',
        new Date('2026-01-01'),
        new Date('2026-01-10'),
        'Tokyo, Japan',
        'Vacation trip'
      );
    });

    expect(eventId).toBe('new-event-id');
    expect(Calendar.createEventAsync).toHaveBeenCalled();
  });
});
