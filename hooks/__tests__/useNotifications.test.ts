import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useNotifications } from '../useNotifications';
import * as Notifications from 'expo-notifications';

jest.mock('expo-notifications');

describe('useNotifications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register for push notifications on mount', async () => {
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });

    (Notifications.getExpoPushTokenAsync as jest.Mock).mockResolvedValue({
      data: 'ExponentPushToken[test-token]',
    });

    const { result } = renderHook(() => useNotifications());

    await waitFor(() => {
      expect(result.current.expoPushToken).toBe('ExponentPushToken[test-token]');
    });

    expect(Notifications.getPermissionsAsync).toHaveBeenCalled();
  });

  it('should handle permission granted', async () => {
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });

    (Notifications.getExpoPushTokenAsync as jest.Mock).mockResolvedValue({
      data: 'test-token',
    });

    const { result } = renderHook(() => useNotifications());

    await waitFor(() => {
      expect(result.current.permission.granted).toBe(true);
    });
  });

  it('should handle permission denied', async () => {
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'denied',
    });

    // Don't mock getExpoPushTokenAsync - it shouldn't be called when permission is denied
    (Notifications.getExpoPushTokenAsync as jest.Mock).mockRejectedValue(
      new Error('Permission denied')
    );

    const { result } = renderHook(() => useNotifications());

    // Wait for initial registration attempt to complete
    await waitFor(() => {
      expect(result.current.permission.granted).toBe(false);
    });

    // Manually call registerForPushNotifications to test the return value
    let token: string | null = null;
    await act(async () => {
      token = await result.current.registerForPushNotifications();
    });

    expect(token).toBe(null);
  });

  it('should request permissions if not granted', async () => {
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'undetermined',
    });

    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });

    (Notifications.getExpoPushTokenAsync as jest.Mock).mockResolvedValue({
      data: 'test-token',
    });

    const { result } = renderHook(() => useNotifications());

    await act(async () => {
      await result.current.registerForPushNotifications();
    });

    await waitFor(() => {
      expect(result.current.permission.granted).toBe(true);
    });

    expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
  });

  it('should send local notification', async () => {
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });

    (Notifications.scheduleNotificationAsync as jest.Mock).mockResolvedValue(
      'notification-123'
    );

    const { result } = renderHook(() => useNotifications());

    let notificationId: string | null = null;

    await act(async () => {
      notificationId = await result.current.sendLocalNotification({
        type: 'booking_confirmed',
        title: 'Booking Confirmed',
        body: 'Your pass is ready',
      });
    });

    expect(notificationId).toBe('notification-123');
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.objectContaining({
          title: 'Booking Confirmed',
          body: 'Your pass is ready',
          sound: true,
        }),
        trigger: null,
      })
    );
  });

  it('should schedule notification for later', async () => {
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });

    (Notifications.scheduleNotificationAsync as jest.Mock).mockResolvedValue(
      'scheduled-notification-123'
    );

    const { result } = renderHook(() => useNotifications());

    const triggerDate = new Date('2025-12-01T09:00:00');

    let notificationId: string | null = null;

    await act(async () => {
      notificationId = await result.current.scheduleNotification(
        {
          type: 'trip_reminder',
          title: 'Trip Reminder',
          body: "Don't forget your trip!",
        },
        triggerDate
      );
    });

    expect(notificationId).toBe('scheduled-notification-123');
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
      content: {
        title: 'Trip Reminder',
        body: "Don't forget your trip!",
        data: { type: 'trip_reminder' },
        sound: true,
      },
      trigger: { type: 'date', date: triggerDate },
    });
  });

  it('should cancel notification', async () => {
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });

    (Notifications.cancelScheduledNotificationAsync as jest.Mock).mockResolvedValue(
      undefined
    );

    const { result } = renderHook(() => useNotifications());

    await act(async () => {
      await result.current.cancelNotification('notification-123');
    });

    expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith(
      'notification-123'
    );
  });

  it('should set and get badge count', async () => {
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });

    (Notifications.getBadgeCountAsync as jest.Mock).mockResolvedValue(5);
    (Notifications.setBadgeCountAsync as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useNotifications());

    let badgeCount: number = 0;

    await act(async () => {
      badgeCount = await result.current.getBadgeCount();
    });

    expect(badgeCount).toBe(5);

    await act(async () => {
      await result.current.setBadgeCount(10);
    });

    expect(Notifications.setBadgeCountAsync).toHaveBeenCalledWith(10);
  });

  it('should clear badge', async () => {
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });

    (Notifications.setBadgeCountAsync as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useNotifications());

    await act(async () => {
      await result.current.clearBadge();
    });

    expect(Notifications.setBadgeCountAsync).toHaveBeenCalledWith(0);
  });

  it('should send booking confirmation', async () => {
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });

    (Notifications.scheduleNotificationAsync as jest.Mock).mockResolvedValue(
      'booking-notification-123'
    );

    const { result } = renderHook(() => useNotifications());

    let notificationId: string | null = null;

    await act(async () => {
      notificationId = await result.current.sendBookingConfirmation(
        'Test Gym',
        '2025-12-01'
      );
    });

    expect(notificationId).toBe('booking-notification-123');
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.objectContaining({
          title: 'Booking Confirmed!',
          body: expect.stringContaining('Test Gym'),
        }),
      })
    );
  });
});
