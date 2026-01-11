// Push Notification Service for Brewing Timers
// Handles local notifications for timer completion

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface TimerNotification {
  id: string;
  title: string;
  body: string;
  triggerSeconds: number;
}

class NotificationService {
  private permissionGranted: boolean = false;

  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') {
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    this.permissionGranted = finalStatus === 'granted';
    return this.permissionGranted;
  }

  async scheduleTimerNotification(notification: TimerNotification): Promise<string | null> {
    if (Platform.OS === 'web') {
      return null;
    }

    if (!this.permissionGranted) {
      const granted = await this.requestPermissions();
      if (!granted) return null;
    }

    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          sound: 'default',
          data: { type: 'timer', id: notification.id },
        },
        trigger: {
          seconds: notification.triggerSeconds,
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        },
      });

      return notificationId;
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      return null;
    }
  }

  async cancelNotification(notificationId: string): Promise<void> {
    if (Platform.OS === 'web') return;
    
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Failed to cancel notification:', error);
    }
  }

  async cancelAllNotifications(): Promise<void> {
    if (Platform.OS === 'web') return;
    
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Failed to cancel all notifications:', error);
    }
  }

  // Brewing timer specific notifications
  async scheduleBrewingTimerNotification(
    brewMethod: string,
    totalSeconds: number
  ): Promise<string | null> {
    return this.scheduleTimerNotification({
      id: `brew-${Date.now()}`,
      title: '☕ Brewing Complete!',
      body: `Your ${brewMethod} is ready. Enjoy your coffee!`,
      triggerSeconds: totalSeconds,
    });
  }

  // Pre-infusion reminder
  async schedulePreInfusionReminder(
    brewMethod: string,
    secondsUntilPour: number
  ): Promise<string | null> {
    return this.scheduleTimerNotification({
      id: `preinf-${Date.now()}`,
      title: '💧 Time to Pour',
      body: `Pre-infusion complete. Continue pouring for your ${brewMethod}.`,
      triggerSeconds: secondsUntilPour,
    });
  }
}

export const notificationService = new NotificationService();
