/**
 * OneSignal Configuration
 *
 * To integrate OneSignal for production:
 * 1. Install: npx expo install onesignal-expo-plugin
 * 2. Add to app.json plugins:
 *    "plugins": [
 *      [
 *        "onesignal-expo-plugin",
 *        {
 *          "mode": "production"
 *        }
 *      ]
 *    ]
 * 3. Add to .env:
 *    ONESIGNAL_APP_ID=your_app_id_here
 * 4. Run: npx expo prebuild --clean
 * 5. Uncomment the code below and import in App.tsx
 */

// import OneSignal from 'react-native-onesignal';
// import Constants from 'expo-constants';

export const initializeOneSignal = () => {
  // Uncomment when OneSignal is installed:
  /*
  const ONESIGNAL_APP_ID = Constants.expoConfig?.extra?.oneSignalAppId || '';

  if (!ONESIGNAL_APP_ID) {
    console.warn('OneSignal App ID not configured');
    return;
  }

  // Initialize OneSignal
  OneSignal.setAppId(ONESIGNAL_APP_ID);

  // Prompt for push notification permissions
  OneSignal.promptForPushNotificationsWithUserResponse((response) => {
    console.log('OneSignal permission response:', response);
  });

  // Handle notification opened
  OneSignal.setNotificationOpenedHandler((notification) => {
    console.log('OneSignal notification opened:', notification);
    const { type, ...data } = notification.notification.additionalData || {};

    // Navigate based on notification type
    switch (type) {
      case 'booking_confirmed':
        // Navigate to passes tab
        break;
      case 'trip_reminder':
        // Navigate to trip details
        break;
      case 'gym_recommendation':
        // Navigate to gym details
        break;
      default:
        console.log('Unknown notification type:', type);
    }
  });

  // Handle notification received in foreground
  OneSignal.setNotificationWillShowInForegroundHandler((notificationReceivedEvent) => {
    const notification = notificationReceivedEvent.getNotification();
    console.log('OneSignal notification received:', notification);

    // Display the notification
    notificationReceivedEvent.complete(notification);
  });
  */
};

/**
 * OneSignal Notification Types
 */
export enum NotificationType {
  BOOKING_CONFIRMED = 'booking_confirmed',
  TRIP_REMINDER = 'trip_reminder',
  GYM_RECOMMENDATION = 'gym_recommendation',
  PASS_EXPIRING = 'pass_expiring',
  PARTNER_MESSAGE = 'partner_message',
}

/**
 * Send notification via OneSignal REST API
 * This would be called from Edge Functions
 */
export interface OneSignalNotification {
  userId: string;
  heading: string;
  message: string;
  type: NotificationType;
  data?: Record<string, any>;
}

/**
 * Example Edge Function code for sending OneSignal notifications:
 *
 * const sendOneSignalNotification = async (notification: OneSignalNotification) => {
 *   const ONESIGNAL_APP_ID = Deno.env.get('ONESIGNAL_APP_ID');
 *   const ONESIGNAL_REST_API_KEY = Deno.env.get('ONESIGNAL_REST_API_KEY');
 *
 *   const response = await fetch('https://onesignal.com/api/v1/notifications', {
 *     method: 'POST',
 *     headers: {
 *       'Content-Type': 'application/json',
 *       'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`,
 *     },
 *     body: JSON.stringify({
 *       app_id: ONESIGNAL_APP_ID,
 *       include_external_user_ids: [notification.userId],
 *       headings: { en: notification.heading },
 *       contents: { en: notification.message },
 *       data: {
 *         type: notification.type,
 *         ...notification.data,
 *       },
 *     }),
 *   });
 *
 *   return response.json();
 * };
 */
