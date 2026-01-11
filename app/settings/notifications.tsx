import { View, Text, Pressable, ScrollView, StyleSheet, Switch, Platform } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { useNotificationPreferences } from '@/lib/notifications/notification-preferences-provider';

export default function NotificationSettingsScreen() {
  const colors = useColors();
  const { preferences, updatePreference, requestPermissions } = useNotificationPreferences();

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleToggle = async (key: keyof typeof preferences, value: boolean) => {
    triggerHaptic();
    
    // Request permissions if enabling any notification
    if (value) {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        alert('Please enable notifications in your device settings');
        return;
      }
    }
    
    await updatePreference(key, value);
  };

  const handleNumberChange = async (key: 'stockThresholdDays' | 'maintenanceReminderDays', increment: boolean) => {
    triggerHaptic();
    const currentValue = preferences[key] as number;
    const newValue = increment ? currentValue + 1 : Math.max(1, currentValue - 1);
    await updatePreference(key, newValue);
  };

  return (
    <ScreenContainer>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Notification Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Banner */}
        <Animated.View
          entering={FadeInDown.delay(50).duration(400)}
          style={[styles.infoBanner, { backgroundColor: colors.primary + '15', borderColor: colors.primary }]}
        >
          <IconSymbol name="bell.fill" size={20} color={colors.primary} />
          <Text style={[styles.infoBannerText, { color: colors.foreground }]}>
            Stay on top of your coffee game with smart notifications
          </Text>
        </Animated.View>

        {/* Notification Types */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Notification Types</Text>

          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {/* Coffee Stock Alerts */}
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={styles.settingHeader}>
                  <IconSymbol name="cup.and.saucer.fill" size={20} color={colors.primary} />
                  <Text style={[styles.settingTitle, { color: colors.foreground }]}>
                    Coffee Stock Alerts
                  </Text>
                </View>
                <Text style={[styles.settingDescription, { color: colors.muted }]}>
                  Get notified when your coffee is running low
                </Text>
              </View>
              <Switch
                value={preferences.coffeeStockAlerts}
                onValueChange={(value) => handleToggle('coffeeStockAlerts', value)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFF"
              />
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Maintenance Reminders */}
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={styles.settingHeader}>
                  <IconSymbol name="wrench.fill" size={20} color={colors.warning} />
                  <Text style={[styles.settingTitle, { color: colors.foreground }]}>
                    Maintenance Reminders
                  </Text>
                </View>
                <Text style={[styles.settingDescription, { color: colors.muted }]}>
                  Get reminded when equipment needs cleaning
                </Text>
              </View>
              <Switch
                value={preferences.maintenanceReminders}
                onValueChange={(value) => handleToggle('maintenanceReminders', value)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFF"
              />
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Brewing Timers */}
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={styles.settingHeader}>
                  <IconSymbol name="timer" size={20} color={colors.success} />
                  <Text style={[styles.settingTitle, { color: colors.foreground }]}>
                    Brewing Timers
                  </Text>
                </View>
                <Text style={[styles.settingDescription, { color: colors.muted }]}>
                  Timer completion notifications
                </Text>
              </View>
              <Switch
                value={preferences.brewingTimers}
                onValueChange={(value) => handleToggle('brewingTimers', value)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFF"
              />
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Course Updates */}
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={styles.settingHeader}>
                  <IconSymbol name="book.fill" size={20} color={colors.error} />
                  <Text style={[styles.settingTitle, { color: colors.foreground }]}>
                    Course Updates
                  </Text>
                </View>
                <Text style={[styles.settingDescription, { color: colors.muted }]}>
                  New lessons and course content
                </Text>
              </View>
              <Switch
                value={preferences.courseUpdates}
                onValueChange={(value) => handleToggle('courseUpdates', value)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFF"
              />
            </View>
          </View>
        </Animated.View>

        {/* Timing Settings */}
        <Animated.View entering={FadeInDown.delay(150).duration(400)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Timing Settings</Text>

          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {/* Stock Threshold */}
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.foreground }]}>
                  Stock Alert Threshold
                </Text>
                <Text style={[styles.settingDescription, { color: colors.muted }]}>
                  Notify when coffee will run out in
                </Text>
              </View>
              <View style={styles.counterControl}>
                <Pressable
                  onPress={() => handleNumberChange('stockThresholdDays', false)}
                  style={({ pressed }) => [
                    styles.counterButton,
                    { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.6 : 1 }
                  ]}
                >
                  <IconSymbol name="minus" size={18} color={colors.foreground} />
                </Pressable>
                <View style={[styles.counterValue, { backgroundColor: colors.primary + '20' }]}>
                  <Text style={[styles.counterValueText, { color: colors.primary }]}>
                    {preferences.stockThresholdDays}
                  </Text>
                  <Text style={[styles.counterUnit, { color: colors.primary }]}>days</Text>
                </View>
                <Pressable
                  onPress={() => handleNumberChange('stockThresholdDays', true)}
                  style={({ pressed }) => [
                    styles.counterButton,
                    { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.6 : 1 }
                  ]}
                >
                  <IconSymbol name="plus" size={18} color={colors.foreground} />
                </Pressable>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Maintenance Reminder */}
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.foreground }]}>
                  Maintenance Reminder
                </Text>
                <Text style={[styles.settingDescription, { color: colors.muted }]}>
                  Remind me before maintenance is due
                </Text>
              </View>
              <View style={styles.counterControl}>
                <Pressable
                  onPress={() => handleNumberChange('maintenanceReminderDays', false)}
                  style={({ pressed }) => [
                    styles.counterButton,
                    { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.6 : 1 }
                  ]}
                >
                  <IconSymbol name="minus" size={18} color={colors.foreground} />
                </Pressable>
                <View style={[styles.counterValue, { backgroundColor: colors.warning + '20' }]}>
                  <Text style={[styles.counterValueText, { color: colors.warning }]}>
                    {preferences.maintenanceReminderDays}
                  </Text>
                  <Text style={[styles.counterUnit, { color: colors.warning }]}>days</Text>
                </View>
                <Pressable
                  onPress={() => handleNumberChange('maintenanceReminderDays', true)}
                  style={({ pressed }) => [
                    styles.counterButton,
                    { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.6 : 1 }
                  ]}
                >
                  <IconSymbol name="plus" size={18} color={colors.foreground} />
                </Pressable>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Help Text */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.helpSection}>
          <IconSymbol name="info.circle.fill" size={16} color={colors.muted} />
          <Text style={[styles.helpText, { color: colors.muted }]}>
            You can change these settings anytime. Make sure notifications are enabled in your device settings.
          </Text>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 17, fontWeight: '600' },
  content: { padding: 16, gap: 24 },
  infoBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 12, borderWidth: 1 },
  infoBannerText: { flex: 1, fontSize: 14, lineHeight: 20 },
  section: { gap: 12 },
  sectionTitle: { fontSize: 20, fontWeight: '700', letterSpacing: -0.3 },
  card: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, gap: 16 },
  settingInfo: { flex: 1, gap: 4 },
  settingHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  settingTitle: { fontSize: 16, fontWeight: '600' },
  settingDescription: { fontSize: 13, lineHeight: 18 },
  divider: { height: 1, marginHorizontal: 16 },
  counterControl: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  counterButton: { width: 36, height: 36, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  counterValue: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, alignItems: 'center', minWidth: 70 },
  counterValueText: { fontSize: 18, fontWeight: '700' },
  counterUnit: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase' },
  helpSection: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 16, borderRadius: 12 },
  helpText: { flex: 1, fontSize: 13, lineHeight: 18 },
});
