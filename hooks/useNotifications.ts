import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

// OneSignal types (will be installed via: npx expo install onesignal-expo-plugin)
// For now, we'll use basic notification setup with Expo Notifications

interface NotificationPermission {
  granted: boolean;
  canAskAgain: boolean;
}

interface NotificationData {
  type: 'booking_confirmed' | 'trip_reminder' | 'gym_recommendation' | 'pass_expiring';
  title: string;
  body: string;
  data?: Record<string, any>;
}

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string>('');
  const [permission, setPermission] = useState<NotificationPermission>({
    granted: false,
    canAskAgain: true,
  });
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);

  // Register for push notifications
  const registerForPushNotifications = async (): Promise<string | null> => {
    try {
      // Check if running on physical device
      if (Constants.isDevice) {
        // Check existing permissions
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        // Request permissions if not granted
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        // Update permission state
        setPermission({
          granted: finalStatus === 'granted',
          canAskAgain: finalStatus !== 'denied',
        });

        if (finalStatus !== 'granted') {
          console.warn('Failed to get push token for push notification');
          return null;
        }

        // Get push token
        const tokenData = await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas?.projectId,
        });

        const token = tokenData.data;
        setExpoPushToken(token);

        // Configure Android channel
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }

        return token;
      } else {
        console.warn('Must use physical device for Push Notifications');
        return null;
      }
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return null;
    }
  };

  // Send local notification
  const sendLocalNotification = async (
    notificationData: NotificationData
  ): Promise<string | null> => {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notificationData.title,
          body: notificationData.body,
          data: { ...notificationData.data, type: notificationData.type },
          sound: true,
        },
        trigger: null, // Send immediately
      });

      return notificationId;
    } catch (error) {
      console.error('Error sending local notification:', error);
      return null;
    }
  };

  // Schedule notification for later
  const scheduleNotification = async (
    notificationData: NotificationData,
    triggerDate: Date
  ): Promise<string | null> => {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notificationData.title,
          body: notificationData.body,
          data: { ...notificationData.data, type: notificationData.type },
          sound: true,
        },
        trigger: triggerDate,
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  };

  // Cancel scheduled notification
  const cancelNotification = async (notificationId: string): Promise<void> => {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  };

  // Cancel all scheduled notifications
  const cancelAllNotifications = async (): Promise<void> => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  };

  // Get badge count
  const getBadgeCount = async (): Promise<number> => {
    try {
      return await Notifications.getBadgeCountAsync();
    } catch (error) {
      console.error('Error getting badge count:', error);
      return 0;
    }
  };

  // Set badge count
  const setBadgeCount = async (count: number): Promise<void> => {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('Error setting badge count:', error);
    }
  };

  // Clear badge
  const clearBadge = async (): Promise<void> => {
    await setBadgeCount(0);
  };

  // Helper: Schedule trip reminder
  const scheduleTripReminder = async (
    tripDestination: string,
    tripStartDate: Date
  ): Promise<string | null> => {
    // Schedule notification 1 day before trip
    const reminderDate = new Date(tripStartDate);
    reminderDate.setDate(reminderDate.getDate() - 1);
    reminderDate.setHours(9, 0, 0, 0); // 9 AM day before

    // Only schedule if in future
    if (reminderDate > new Date()) {
      return await scheduleNotification(
        {
          type: 'trip_reminder',
          title: 'Trip Tomorrow!',
          body: `Don't forget to check out gyms in ${tripDestination}`,
          data: { destination: tripDestination },
        },
        reminderDate
      );
    }

    return null;
  };

  // Helper: Send booking confirmation
  const sendBookingConfirmation = async (
    gymName: string,
    bookingDate: string
  ): Promise<string | null> => {
    return await sendLocalNotification({
      type: 'booking_confirmed',
      title: 'Booking Confirmed!',
      body: `Your pass for ${gymName} is ready. Check your Passes tab.`,
      data: { gymName, bookingDate },
    });
  };

  // Initialize on mount
  useEffect(() => {
    registerForPushNotifications();

    // Listen for notifications received while app is foregrounded
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    // Listen for user interaction with notifications
    const responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const notificationData = response.notification.request.content.data;
        // Handle navigation based on notification type
        console.log('Notification tapped:', notificationData);
      }
    );

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return {
    expoPushToken,
    permission,
    notification,
    registerForPushNotifications,
    sendLocalNotification,
    scheduleNotification,
    cancelNotification,
    cancelAllNotifications,
    getBadgeCount,
    setBadgeCount,
    clearBadge,
    scheduleTripReminder,
    sendBookingConfirmation,
  };
};
