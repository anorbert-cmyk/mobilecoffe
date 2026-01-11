import { View, Text, Pressable, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

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

type ThemeOption = {
  value: ThemePreference;
  label: string;
  icon: string;
  description: string;
};

const THEME_OPTIONS: ThemeOption[] = [
  { value: 'light', label: 'Light', icon: 'sun.max.fill', description: 'Always light' },
  { value: 'dark', label: 'Dark', icon: 'moon.fill', description: 'Always dark' },
  { value: 'auto', label: 'Auto', icon: 'circle.lefthalf.filled', description: 'Follow system' },
];

export default function ProfileScreen() {
  const colors = useColors();
  const { profile, resetProfile } = useUserProfile();
  const { themePreference, setThemePreference } = useThemeContext();

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleThemeChange = (newTheme: ThemePreference) => {
    triggerHaptic();
    setThemePreference(newTheme);
  };

  const handleEquipmentWizard = () => {
    triggerHaptic();
    router.push('/equipment-wizard' as any);
  };

  const handleViewRecommendations = () => {
    triggerHaptic();
    router.push('/recommendations');
  };

  const handleResetOnboarding = () => {
    triggerHaptic();
    Alert.alert(
      'Reset Profile',
      'This will clear all your preferences and restart the onboarding. Are you sure?',
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
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View 
          entering={FadeIn.duration(400)}
          style={styles.header}
        >
          <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
            <IconSymbol name="person.fill" size={40} color="#FFFFFF" />
          </View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            Your Profile
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.muted }]}>
            Manage your preferences and equipment
          </Text>
        </Animated.View>

        {/* Experience Card */}
        <Animated.View 
          entering={FadeInDown.delay(100).duration(400)}
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconWrapper, { backgroundColor: colors.primary + '20' }]}>
              <IconSymbol name="star.fill" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>
              Coffee Journey
            </Text>
          </View>
          
          <View style={styles.cardContent}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.muted }]}>Experience Level</Text>
              <Text style={[styles.infoValue, { color: colors.foreground }]}>
                {profile.experienceLevel ? getExperienceLabel(profile.experienceLevel) : 'Not set'}
              </Text>
            </View>
            
            {profile.coffeePurpose && profile.coffeePurpose.length > 0 && (
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.muted }]}>Interests</Text>
                <Text style={[styles.infoValue, { color: colors.foreground }]}>
                  {profile.coffeePurpose.map(p => getPurposeLabel(p)).join(', ')}
                </Text>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Appearance Section - Dark Mode Toggle */}
        <Animated.View 
          entering={FadeInDown.delay(150).duration(400)}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Appearance
          </Text>
          
          <View style={[styles.themeCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.themeHeader}>
              <View style={[styles.themeIconWrapper, { backgroundColor: colors.primary + '20' }]}>
                <IconSymbol name="paintbrush.fill" size={20} color={colors.primary} />
              </View>
              <View style={styles.themeHeaderText}>
                <Text style={[styles.themeTitle, { color: colors.foreground }]}>
                  Theme
                </Text>
                <Text style={[styles.themeDescription, { color: colors.muted }]}>
                  Choose your preferred appearance
                </Text>
              </View>
            </View>
            
            <View style={styles.themeOptions}>
              {THEME_OPTIONS.map((option) => {
                const isSelected = themePreference === option.value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => handleThemeChange(option.value)}
                    style={({ pressed }) => [
                      styles.themeOption,
                      {
                        backgroundColor: isSelected 
                          ? colors.primary 
                          : colors.background,
                        borderColor: isSelected 
                          ? colors.primary 
                          : colors.border,
                        transform: [{ scale: pressed ? 0.96 : 1 }],
                      },
                    ]}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                    accessibilityLabel={`${option.label} theme: ${option.description}`}
                  >
                    <IconSymbol 
                      name={option.icon as any} 
                      size={24} 
                      color={isSelected ? '#FFFFFF' : colors.muted} 
                    />
                    <Text style={[
                      styles.themeOptionLabel,
                      { color: isSelected ? '#FFFFFF' : colors.foreground }
                    ]}>
                      {option.label}
                    </Text>
                    <Text style={[
                      styles.themeOptionDescription,
                      { color: isSelected ? 'rgba(255,255,255,0.8)' : colors.muted }
                    ]}>
                      {option.description}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </Animated.View>

        {/* Coffee Beans Marketplace */}
        <Animated.View 
          entering={FadeInDown.delay(175).duration(400)}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Coffee Beans
          </Text>
          
          <Pressable
            onPress={() => {
              triggerHaptic();
              router.push('/beans/wizard-step1' as any);
            }}
            style={({ pressed }) => [
              styles.secondaryActionCard,
              { 
                backgroundColor: colors.surface,
                borderColor: colors.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Find and buy specialty coffee beans"
          >
            <View style={[styles.secondaryActionIcon, { backgroundColor: colors.primary + '20' }]}>
              <Text style={{ fontSize: 28 }}>☕</Text>
            </View>
            <View style={styles.secondaryActionText}>
              <Text style={[styles.secondaryActionTitle, { color: colors.foreground }]}>
                Buy Coffee Beans
              </Text>
              <Text style={[styles.secondaryActionDescription, { color: colors.muted }]}>
                Find your perfect specialty beans
              </Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.muted} />
          </Pressable>
        </Animated.View>

        {/* Equipment Section */}
        <Animated.View 
          entering={FadeInDown.delay(200).duration(400)}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Equipment
          </Text>
          
          {/* Buy/Upgrade Equipment - Primary CTA */}
          <Pressable
            onPress={handleEquipmentWizard}
            style={({ pressed }) => [
              styles.primaryActionCard,
              { 
                backgroundColor: colors.primary,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Find your perfect equipment"
          >
            <View style={styles.primaryActionContent}>
              <View style={styles.primaryActionIcon}>
                <IconSymbol name="gearshape.2.fill" size={32} color="#FFFFFF" />
              </View>
              <View style={styles.primaryActionText}>
                <Text style={styles.primaryActionTitle}>
                  Find Your Perfect Setup
                </Text>
                <Text style={styles.primaryActionDescription}>
                  Get personalized machine and grinder recommendations
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color="rgba(255,255,255,0.8)" />
            </View>
          </Pressable>

          {/* Current Budget */}
          {profile.budgetRange && (
            <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.infoCardIcon, { backgroundColor: '#4CAF5020' }]}>
                <IconSymbol name="dollarsign.circle.fill" size={24} color="#4CAF50" />
              </View>
              <View style={styles.infoCardContent}>
                <Text style={[styles.infoCardLabel, { color: colors.muted }]}>Budget Range</Text>
                <Text style={[styles.infoCardValue, { color: colors.foreground }]}>
                  {getBudgetLabel(profile.budgetRange)}
                </Text>
              </View>
            </View>
          )}

          {/* View Recommendations */}
          {(profile.budgetRange || profile.coffeePurpose?.length) && (
            <Pressable
              onPress={handleViewRecommendations}
              style={({ pressed }) => [
                styles.secondaryActionCard,
                { 
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="View your equipment recommendations"
            >
              <View style={[styles.secondaryActionIcon, { backgroundColor: colors.primary + '20' }]}>
                <IconSymbol name="sparkles" size={24} color={colors.primary} />
              </View>
              <View style={styles.secondaryActionText}>
                <Text style={[styles.secondaryActionTitle, { color: colors.foreground }]}>
                  View Recommendations
                </Text>
                <Text style={[styles.secondaryActionDescription, { color: colors.muted }]}>
                  See machines and grinders picked for you
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.muted} />
            </Pressable>
          )}
        </Animated.View>

        {/* Settings Section */}
        <Animated.View 
          entering={FadeInDown.delay(300).duration(400)}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Settings
          </Text>
          
          <View style={[styles.settingsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Pressable
              onPress={handleResetOnboarding}
              style={({ pressed }) => [
                styles.settingsRow,
                { opacity: pressed ? 0.7 : 1 },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Reset onboarding and preferences"
            >
              <View style={[styles.settingsIcon, { backgroundColor: colors.error + '20' }]}>
                <IconSymbol name="arrow.counterclockwise" size={20} color={colors.error} />
              </View>
              <View style={styles.settingsContent}>
                <Text style={[styles.settingsTitle, { color: colors.foreground }]}>
                  Reset Preferences
                </Text>
                <Text style={[styles.settingsDescription, { color: colors.muted }]}>
                  Start fresh with new onboarding
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={18} color={colors.muted} />
            </Pressable>
          </View>
        </Animated.View>

        {/* App Info */}
        <Animated.View 
          entering={FadeInDown.delay(400).duration(400)}
          style={styles.footer}
        >
          <Text style={[styles.footerText, { color: colors.muted }]}>
            Coffee Craft v1.0
          </Text>
          <Text style={[styles.footerText, { color: colors.muted }]}>
            Made with ☕ for coffee lovers
          </Text>
        </Animated.View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 32,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 15,
    marginTop: 4,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  cardIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardContent: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    maxWidth: '60%',
    textAlign: 'right',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  // Theme selector styles
  themeCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  themeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  themeIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeHeaderText: {
    flex: 1,
  },
  themeTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  themeDescription: {
    fontSize: 13,
    marginTop: 2,
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  themeOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 6,
  },
  themeOptionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  themeOptionDescription: {
    fontSize: 11,
    textAlign: 'center',
  },
  // Primary action card
  primaryActionCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  primaryActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryActionText: {
    flex: 1,
  },
  primaryActionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  primaryActionDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    gap: 14,
  },
  infoCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCardContent: {
    flex: 1,
  },
  infoCardLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  infoCardValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
  },
  secondaryActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryActionText: {
    flex: 1,
  },
  secondaryActionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryActionDescription: {
    fontSize: 13,
    marginTop: 2,
  },
  settingsCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsContent: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingsDescription: {
    fontSize: 13,
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 4,
  },
  footerText: {
    fontSize: 13,
  },
});
