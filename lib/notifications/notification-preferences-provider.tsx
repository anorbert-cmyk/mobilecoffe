import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export interface NotificationPreferences {
  coffeeStockAlerts: boolean;
  maintenanceReminders: boolean;
  brewingTimers: boolean;
  courseUpdates: boolean;
  stockThresholdDays: number; // Days before running out
  maintenanceReminderDays: number; // Days before maintenance due
}

interface NotificationPreferencesContextType {
  preferences: NotificationPreferences;
  updatePreference: <K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K]
  ) => Promise<void>;
  scheduleStockAlert: (beanName: string, daysRemaining: number) => Promise<void>;
  scheduleMaintenanceAlert: (equipmentName: string, daysUntilDue: number) => Promise<void>;
  cancelStockAlert: (beanId: string) => Promise<void>;
  cancelMaintenanceAlert: (equipmentId: string) => Promise<void>;
  requestPermissions: () => Promise<boolean>;
}

const NotificationPreferencesContext = createContext<NotificationPreferencesContextType | undefined>(undefined);

const STORAGE_KEY = '@coffee_craft_notification_prefs';
const DEFAULT_PREFERENCES: NotificationPreferences = {
  coffeeStockAlerts: true,
  maintenanceReminders: true,
  brewingTimers: true,
  courseUpdates: false,
  stockThresholdDays: 7,
  maintenanceReminderDays: 7,
};

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function NotificationPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setPreferences(JSON.parse(data));
      }
    } catch (error) {
      console.error('Failed to load notification preferences:', error);
    }
  };

  const savePreferences = async (newPreferences: NotificationPreferences) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPreferences));
      setPreferences(newPreferences);
    } catch (error) {
      console.error('Failed to save notification preferences:', error);
    }
  };

  const updatePreference = async <K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K]
  ) => {
    const newPreferences = { ...preferences, [key]: value };
    await savePreferences(newPreferences);
  };

  const requestPermissions = async (): Promise<boolean> => {
    if (Platform.OS === 'web') {
      return false;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      return finalStatus === 'granted';
    } catch (error) {
      console.error('Failed to request notification permissions:', error);
      return false;
    }
  };

  const scheduleStockAlert = async (beanName: string, daysRemaining: number) => {
    if (!preferences.coffeeStockAlerts || Platform.OS === 'web') {
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      return;
    }

    try {
      // Calculate trigger time (when stock reaches threshold)
      const triggerSeconds = Math.max(0, (daysRemaining - preferences.stockThresholdDays) * 24 * 60 * 60);

      await Notifications.scheduleNotificationAsync({
        identifier: `stock-alert-${beanName}`,
        content: {
          title: '☕ Coffee Running Low',
          body: `Your ${beanName} is running low. Time to restock!`,
          data: { type: 'stock-alert', beanName },
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: Math.max(60, triggerSeconds) },
      });
    } catch (error) {
      console.error('Failed to schedule stock alert:', error);
    }
  };

  const scheduleMaintenanceAlert = async (equipmentName: string, daysUntilDue: number) => {
    if (!preferences.maintenanceReminders || Platform.OS === 'web') {
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      return;
    }

    try {
      // Calculate trigger time (reminder days before due date)
      const triggerSeconds = Math.max(0, (daysUntilDue - preferences.maintenanceReminderDays) * 24 * 60 * 60);

      await Notifications.scheduleNotificationAsync({
        identifier: `maintenance-alert-${equipmentName}`,
        content: {
          title: '🔧 Maintenance Due',
          body: `Time to clean your ${equipmentName}. Keep your equipment in top shape!`,
          data: { type: 'maintenance-alert', equipmentName },
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: Math.max(60, triggerSeconds) },
      });
    } catch (error) {
      console.error('Failed to schedule maintenance alert:', error);
    }
  };

  const cancelStockAlert = async (beanId: string) => {
    if (Platform.OS === 'web') {
      return;
    }

    try {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      const stockAlert = scheduled.find(n => n.identifier === `stock-alert-${beanId}`);
      if (stockAlert) {
        await Notifications.cancelScheduledNotificationAsync(stockAlert.identifier);
      }
    } catch (error) {
      console.error('Failed to cancel stock alert:', error);
    }
  };

  const cancelMaintenanceAlert = async (equipmentId: string) => {
    if (Platform.OS === 'web') {
      return;
    }

    try {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      const maintenanceAlert = scheduled.find(n => n.identifier === `maintenance-alert-${equipmentId}`);
      if (maintenanceAlert) {
        await Notifications.cancelScheduledNotificationAsync(maintenanceAlert.identifier);
      }
    } catch (error) {
      console.error('Failed to cancel maintenance alert:', error);
    }
  };

  return (
    <NotificationPreferencesContext.Provider
      value={{
        preferences,
        updatePreference,
        scheduleStockAlert,
        scheduleMaintenanceAlert,
        cancelStockAlert,
        cancelMaintenanceAlert,
        requestPermissions,
      }}
    >
      {children}
    </NotificationPreferencesContext.Provider>
  );
}

export function useNotificationPreferences() {
  const context = useContext(NotificationPreferencesContext);
  if (!context) {
    throw new Error('useNotificationPreferences must be used within NotificationPreferencesProvider');
  }
  return context;
}
