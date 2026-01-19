import { View, Text, Pressable, StyleSheet, ScrollView, Alert, Platform, Dimensions } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';

import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import {
  useUserProfile,
  getExperienceLabel,
  getBudgetLabel,
  getPurposeLabel
} from '@/lib/user-profile';
import { useThemeContext, ThemePreference } from '@/lib/theme-provider';
import { useSubscription } from '@/lib/subscription/subscription-provider';
import { useMyEquipment } from '@/lib/equipment/my-equipment-provider';

type ThemeOption = {
  value: ThemePreference;
  label: string;
  icon: string;
};

const THEME_OPTIONS: ThemeOption[] = [
  { value: 'light', label: 'Light', icon: 'sun.max.fill' },
  { value: 'dark', label: 'Dark', icon: 'moon.fill' },
  { value: 'auto', label: 'Auto', icon: 'circle.lefthalf.filled' },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Bento Card Component
const BentoCard = ({
  children,
  style,
  onPress,
  delay = 0,
  colSpan = 1,
  rowSpan = 1
}: {
  children: React.ReactNode;
  style?: any;
  onPress?: () => void;
  delay?: number;
  colSpan?: 1 | 2;
  rowSpan?: number;
}) => {
  const colors = useColors();
  const width = colSpan === 2 ? '100%' : '48%';

  const Content = (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(500)}
      layout={Layout.springify()}
      style={[
        styles.bentoCard,
        {
          width,
          backgroundColor: colors.surface,
          borderColor: 'rgba(255,255,255,0.05)',
        },
        style
      ]}
    >
      {children}
    </Animated.View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={() => {
          if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        style={({ pressed }) => [{ width, opacity: pressed ? 0.95 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }]}
      >
        {Content}
      </Pressable>
    );
  }

  return Content;
};

export default function ProfileScreen() {
  const colors = useColors();
  const { profile, resetProfile } = useUserProfile();
  const { themePreference, setThemePreference } = useThemeContext();
  const { tier, isSubscribed, getTrialStatus } = useSubscription();
  const { equipment, getMaintenanceDueItems } = useMyEquipment();

  const trialStatus = getTrialStatus();

  const handleResetOnboarding = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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

  return (
    <ScreenContainer>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Profile Section */}
        <Animated.View style={styles.header} entering={FadeIn.duration(600)}>
          <View style={styles.profileHeaderTop}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <IconSymbol name="person.fill" size={32} color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.greeting, { color: colors.muted }]}>Welcome back,</Text>
              <Text style={[styles.profileName, { color: colors.foreground }]}>Coffee Lover</Text>
            </View>
            <Pressable
              onPress={() => router.push('/settings/notifications' as any)}
              style={[styles.iconButton, { backgroundColor: colors.surface }]}
            >
              <IconSymbol name="gearshape.fill" size={20} color={colors.muted} />
            </Pressable>
          </View>
        </Animated.View>

        {/* Bento Grid Layout */}
        <View style={styles.bentoGrid}>

          {/* 1. Subscription Status (Full Width) */}
          <BentoCard
            colSpan={2}
            delay={100}
            onPress={() => router.push('/subscription/plans' as any)}
            style={{
              backgroundColor: isSubscribed ? '#1A1A1A' : colors.primary,
              borderWidth: 0,
              overflow: 'hidden'
            }}
          >
            <LinearGradient
              colors={isSubscribed ? ['#2D2D2D', '#1A1A1A'] : [colors.primary, '#4A1D96']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View style={[styles.bentoContentRow, { justifyContent: 'space-between', alignItems: 'center' }]}>
              <View>
                <View style={[styles.badge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  <Text style={styles.badgeText}>
                    {isSubscribed ? (tier === 'pro' ? 'PRO MEMBER' : 'MEMBER') : 'FREE PLAN'}
                  </Text>
                </View>
                <Text style={[styles.cardTitleBig, { color: '#FFF', marginTop: 8 }]}>
                  {isSubscribed ? 'Premium Active' : 'Upgrade to Pro'}
                </Text>
                <Text style={[styles.cardSubtext, { color: 'rgba(255,255,255,0.7)' }]}>
                  {isSubscribed
                    ? 'Unlock all recipes & features'
                    : 'Get unlimited recipes & AI insights'}
                </Text>
              </View>
              <IconSymbol name="sparkles" size={40} color="rgba(255,255,255,0.3)" />
            </View>
          </BentoCard>

          {/* 2. My Equipment (Half Width) */}
          <BentoCard delay={200} onPress={() => router.push('/my-equipment' as any)}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,149,0,0.1)' }]}>
              <IconSymbol name="wrench.and.screwdriver.fill" size={24} color="#FF9500" />
            </View>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Equipment</Text>
            <Text style={[styles.statValue, { color: colors.foreground }]}>{equipment.length}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Items Owned</Text>

            {getMaintenanceDueItems().length > 0 && (
              <View style={styles.alertBadge}>
                <Text style={styles.alertText}>{getMaintenanceDueItems().length} Alerts</Text>
              </View>
            )}
          </BentoCard>

          {/* 3. Coffee Journey / Stats (Half Width) */}
          <BentoCard delay={250}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(52,199,89,0.1)' }]}>
              <IconSymbol name="chart.bar.fill" size={24} color="#34C759" />
            </View>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Level</Text>
            <Text style={[styles.statValue, { color: colors.foreground }]}>
              {profile.experienceLevel === 'advanced' ? 'Expert' : profile.experienceLevel === 'intermediate' ? 'Barista' : 'Novice'}
            </Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>Experience</Text>
          </BentoCard>

          {/* 4. Bean Matcher (Full Width - Styled different) */}
          <BentoCard colSpan={2} delay={300} onPress={() => router.push('/bean-matcher/step1-machine' as any)}>
            <Image
              source={require('@/assets/images/coffee-beans-bg.png')}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
            />
            <LinearGradient
              colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)']}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.bentoContentRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitleBig, { color: '#FFF' }]}>Find Perfect Beans</Text>
                <Text style={[styles.cardSubtext, { color: 'rgba(255,255,255,0.9)' }]}>
                  AI-powered matching based on your taste profile
                </Text>
              </View>
              <View style={[styles.arrowCircle, { backgroundColor: '#FFF' }]}>
                <IconSymbol name="arrow.right" size={20} color="#000" />
              </View>
            </View>
          </BentoCard>

          {/* 5. Favorites (Half Width) */}
          <BentoCard delay={350} onPress={() => router.push('/favorites' as any)}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,45,85,0.1)' }]}>
              <IconSymbol name="heart.fill" size={24} color="#FF2D55" />
            </View>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Favorites</Text>
            <Text style={[styles.cardLink, { color: colors.primary }]}>View Saved</Text>
          </BentoCard>

          {/* 6. Journal (Half Width) */}
          <BentoCard delay={400} onPress={() => router.push('/journal' as any)}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(175,82,222,0.1)' }]}>
              <IconSymbol name="book.fill" size={24} color="#AF52DE" />
            </View>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Journal</Text>
            <Text style={[styles.cardLink, { color: colors.primary }]}>Brew Logs</Text>
          </BentoCard>

          {/* 7. Theme Selector (Full Width) */}
          <BentoCard colSpan={2} delay={450}>
            <Text style={[styles.sectionHeader, { color: colors.muted }]}>APPEARANCE</Text>
            <View style={styles.themeSelector}>
              {THEME_OPTIONS.map((option) => (
                <Pressable
                  key={option.value}
                  onPress={() => setThemePreference(option.value)}
                  style={[
                    styles.themeOption,
                    {
                      backgroundColor: themePreference === option.value ? colors.surface : 'transparent',
                      borderColor: themePreference === option.value ? colors.primary : 'transparent',
                    }
                  ]}
                >
                  <IconSymbol
                    name={option.icon as any}
                    size={20}
                    color={themePreference === option.value ? colors.primary : colors.muted}
                  />
                  <Text style={[
                    styles.themeLabel,
                    {
                      color: themePreference === option.value ? colors.foreground : colors.muted,
                      fontWeight: themePreference === option.value ? '600' : '400'
                    }
                  ]}>
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </BentoCard>

          {/* 8. Danger Zone (Reset) */}
          <BentoCard colSpan={2} delay={500} onPress={handleResetOnboarding}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <IconSymbol name="arrow.counterclockwise" size={20} color={colors.error} />
              <Text style={{ color: colors.error, fontSize: 16, fontWeight: '600' }}>Reset Onboarding</Text>
            </View>
          </BentoCard>

        </View>

        <View style={styles.footer}>
          <Text style={{ color: colors.muted, textAlign: 'center', fontSize: 12 }}>Version 1.0.0 (Build 2024.1)</Text>
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
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  profileHeaderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Bento Grid
  bentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  bentoCard: {
    borderRadius: 24,
    padding: 20,
    minHeight: 140,
    justifyContent: 'space-between',
    borderWidth: 1,
    overflow: 'hidden',
  },
  bentoContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Card Elements
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  cardTitleBig: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  cardSubtext: {
    fontSize: 14,
    marginTop: 4,
  },
  cardLink: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },

  // Stats
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
  },

  // Decorative
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  alertBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  alertText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },

  // Theme Selector
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
  },
  themeSelector: {
    flexDirection: 'row',
    padding: 4,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 16,
  },
  themeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
  },
  themeLabel: {
    fontSize: 13,
  },

  footer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
});
