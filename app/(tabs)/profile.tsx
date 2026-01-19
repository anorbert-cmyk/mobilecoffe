import { View, Text, Pressable, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { useUserProfile } from '@/lib/user-profile';
import { useThemeContext, ThemePreference } from '@/lib/theme-provider';
import { useSubscription } from '@/lib/subscription/subscription-provider';
import { useMyEquipment } from '@/lib/equipment/my-equipment-provider';

type ThemeOption = { value: ThemePreference; label: string; icon: string };

const THEME_OPTIONS: ThemeOption[] = [
  { value: 'light', label: 'Light', icon: 'sun.max.fill' },
  { value: 'dark', label: 'Dark', icon: 'moon.fill' },
  { value: 'auto', label: 'Auto', icon: 'circle.lefthalf.filled' },
];

const triggerHaptic = () => {
  if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

// Menu Row Component - iOS Settings Style
const MenuRow = ({
  icon,
  iconColor,
  iconBg,
  title,
  subtitle,
  value,
  onPress,
  isDestructive = false,
  showChevron = true,
}: {
  icon: string;
  iconColor: string;
  iconBg: string;
  title: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
  isDestructive?: boolean;
  showChevron?: boolean;
}) => {
  const colors = useColors();

  return (
    <Pressable
      onPress={() => {
        triggerHaptic();
        onPress?.();
      }}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.menuRow,
        {
          backgroundColor: colors.surface,
          opacity: pressed ? 0.7 : 1,
        }
      ]}
    >
      <View style={[styles.menuIcon, { backgroundColor: iconBg }]}>
        <IconSymbol name={icon as any} size={20} color={iconColor} />
      </View>
      <View style={styles.menuContent}>
        <Text style={[styles.menuTitle, { color: isDestructive ? colors.error : colors.foreground }]}>
          {title}
        </Text>
        {subtitle && <Text style={[styles.menuSubtitle, { color: colors.muted }]}>{subtitle}</Text>}
      </View>
      {value && <Text style={[styles.menuValue, { color: colors.muted }]}>{value}</Text>}
      {showChevron && onPress && (
        <IconSymbol name="chevron.right" size={16} color={colors.muted} />
      )}
    </Pressable>
  );
};

// Section Header Component
const SectionHeader = ({ title }: { title: string }) => {
  const colors = useColors();
  return (
    <Text style={[styles.sectionHeader, { color: colors.muted }]}>{title}</Text>
  );
};

export default function ProfileScreen() {
  const colors = useColors();
  const { profile, resetProfile } = useUserProfile();
  const { themePreference, setThemePreference } = useThemeContext();
  const { tier, isSubscribed } = useSubscription();
  const { equipment, getMaintenanceDueItems } = useMyEquipment();

  const handleResetOnboarding = () => {
    triggerHaptic();
    Alert.alert(
      'Reset Profile',
      'Are you sure you want to reset all preferences? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetProfile();
            router.replace('/onboarding');
          }
        },
      ]
    );
  };

  const experienceLabel = profile.experienceLevel === 'advanced' ? 'Expert' :
    profile.experienceLevel === 'intermediate' ? 'Barista' : 'Novice';

  return (
    <ScreenContainer>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <IconSymbol name="person.fill" size={36} color="#FFF" />
          </View>
          <Text style={[styles.profileName, { color: colors.foreground }]}>Coffee Lover</Text>
          <Text style={[styles.profileSubtitle, { color: colors.muted }]}>
            {experienceLabel} • {equipment.length} Equipment
          </Text>
        </Animated.View>

        {/* Subscription Card */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <Pressable
            onPress={() => { triggerHaptic(); router.push('/subscription/plans' as any); }}
            style={({ pressed }) => [
              styles.subscriptionCard,
              { opacity: pressed ? 0.9 : 1 }
            ]}
          >
            <LinearGradient
              colors={isSubscribed ? ['#1A1A1A', '#2D2D2D'] : ['#7C3AED', '#4A1D96']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View style={styles.subscriptionContent}>
              <View style={styles.subscriptionBadge}>
                <Text style={styles.subscriptionBadgeText}>
                  {isSubscribed ? (tier === 'pro' ? 'PRO' : 'MEMBER') : 'FREE'}
                </Text>
              </View>
              <Text style={styles.subscriptionTitle}>
                {isSubscribed ? 'Premium Active' : 'Upgrade to Pro'}
              </Text>
              <Text style={styles.subscriptionSubtitle}>
                {isSubscribed ? 'All features unlocked' : 'Get unlimited recipes & AI insights'}
              </Text>
            </View>
            <IconSymbol name="sparkles" size={40} color="rgba(255,255,255,0.3)" />
          </Pressable>
        </Animated.View>

        {/* Quick Actions Section */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <SectionHeader title="QUICK ACTIONS" />
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <MenuRow
              icon="wand.and.stars"
              iconColor="#7C3AED"
              iconBg="rgba(124,58,237,0.1)"
              title="Find Perfect Beans"
              subtitle="AI-powered matching"
              onPress={() => router.push('/bean-matcher/step1-machine' as any)}
            />
            <View style={[styles.separator, { backgroundColor: colors.border }]} />
            <MenuRow
              icon="heart.fill"
              iconColor="#FF2D55"
              iconBg="rgba(255,45,85,0.1)"
              title="Favorites"
              subtitle="Your saved items"
              onPress={() => router.push('/favorites' as any)}
            />
            <View style={[styles.separator, { backgroundColor: colors.border }]} />
            <MenuRow
              icon="book.fill"
              iconColor="#AF52DE"
              iconBg="rgba(175,82,222,0.1)"
              title="Brew Journal"
              subtitle="Your coffee logs"
              onPress={() => router.push('/journal' as any)}
            />
          </View>
        </Animated.View>

        {/* My Coffee Section */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <SectionHeader title="MY COFFEE" />
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <MenuRow
              icon="wrench.and.screwdriver.fill"
              iconColor="#FF9500"
              iconBg="rgba(255,149,0,0.1)"
              title="My Equipment"
              value={`${equipment.length} items`}
              onPress={() => router.push('/my-equipment' as any)}
            />
            {getMaintenanceDueItems().length > 0 && (
              <View style={styles.alertBanner}>
                <IconSymbol name="exclamationmark.triangle.fill" size={16} color="#FF9500" />
                <Text style={styles.alertText}>{getMaintenanceDueItems().length} maintenance alerts</Text>
              </View>
            )}
            <View style={[styles.separator, { backgroundColor: colors.border }]} />
            <MenuRow
              icon="chart.bar.fill"
              iconColor="#34C759"
              iconBg="rgba(52,199,89,0.1)"
              title="Experience Level"
              value={experienceLabel}
              showChevron={false}
            />
          </View>
        </Animated.View>

        {/* Appearance Section */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <SectionHeader title="APPEARANCE" />
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <View style={styles.themeRow}>
              {THEME_OPTIONS.map((option) => (
                <Pressable
                  key={option.value}
                  onPress={() => { triggerHaptic(); setThemePreference(option.value); }}
                  style={[
                    styles.themeOption,
                    {
                      backgroundColor: themePreference === option.value ? colors.primary : 'transparent',
                    }
                  ]}
                >
                  <IconSymbol
                    name={option.icon as any}
                    size={18}
                    color={themePreference === option.value ? '#FFF' : colors.muted}
                  />
                  <Text style={[
                    styles.themeLabel,
                    { color: themePreference === option.value ? '#FFF' : colors.muted }
                  ]}>
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* B2B Portal Section */}
        <Animated.View entering={FadeInDown.delay(450).duration(400)}>
          <SectionHeader title="BUSINESS" />
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <MenuRow
              icon="building.2.fill"
              iconColor="#3B82F6"
              iconBg="rgba(59,130,246,0.1)"
              title="Business Portal"
              subtitle="Manage your cafe"
              onPress={() => router.push('/b2b' as any)}
            />
          </View>
        </Animated.View>

        {/* Settings Section */}
        <Animated.View entering={FadeInDown.delay(500).duration(400)}>
          <SectionHeader title="SETTINGS" />
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <MenuRow
              icon="bell.fill"
              iconColor="#5856D6"
              iconBg="rgba(88,86,214,0.1)"
              title="Notifications"
              onPress={() => router.push('/settings/notifications' as any)}
            />
            <View style={[styles.separator, { backgroundColor: colors.border }]} />
            <MenuRow
              icon="arrow.counterclockwise"
              iconColor={colors.error}
              iconBg={`${colors.error}15`}
              title="Reset Onboarding"
              isDestructive
              showChevron={false}
              onPress={handleResetOnboarding}
            />
          </View>
        </Animated.View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.muted }]}>
            CoffeeCraft v1.0.0
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  profileSubtitle: {
    fontSize: 15,
    marginTop: 4,
  },
  subscriptionCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 24,
  },
  subscriptionContent: {
    flex: 1,
  },
  subscriptionBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  subscriptionBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  subscriptionTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
  },
  subscriptionSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginTop: 4,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginLeft: 20,
    marginBottom: 8,
    marginTop: 16,
  },
  section: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 14,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  menuSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  menuValue: {
    fontSize: 15,
    marginRight: 4,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 64,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  alertText: {
    fontSize: 13,
    color: '#FF9500',
    fontWeight: '500',
  },
  themeRow: {
    flexDirection: 'row',
    padding: 8,
  },
  themeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
  },
  themeLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  footerText: {
    fontSize: 12,
  },
});
