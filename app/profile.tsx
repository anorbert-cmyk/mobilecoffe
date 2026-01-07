import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { ScreenContainer } from '@/components/screen-container';
import { PremiumButton } from '@/components/ui/premium-button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { 
  useUserProfile, 
  getExperienceLabel, 
  getBudgetLabel, 
  getPurposeLabel,
  ExperienceLevel,
  BudgetRange,
  CoffeePurpose,
} from '@/lib/user-profile';

export default function ProfileScreen() {
  const colors = useColors();
  const { profile, updateProfile, resetProfile } = useUserProfile();
  const [isResetting, setIsResetting] = useState(false);

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleResetProfile = () => {
    triggerHaptic();
    
    if (Platform.OS === 'web') {
      // Web doesn't support Alert, use confirm
      if (window.confirm('This will reset all your preferences and show the onboarding again. Continue?')) {
        performReset();
      }
    } else {
      Alert.alert(
        'Reset Profile',
        'This will reset all your preferences and show the onboarding again. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Reset', 
            style: 'destructive',
            onPress: performReset,
          },
        ]
      );
    }
  };

  const performReset = async () => {
    setIsResetting(true);
    await resetProfile();
    router.replace('/onboarding');
  };

  const handleViewRecommendations = () => {
    triggerHaptic();
    router.push('/recommendations');
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ScreenContainer>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              { opacity: pressed ? 0.7 : 1 }
            ]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <IconSymbol name="arrow.left" size={24} color={colors.foreground} />
          </Pressable>
          <Text 
            style={[styles.title, { color: colors.foreground }]}
            accessibilityRole="header"
          >
            Your Profile
          </Text>
        </Animated.View>

        {/* Profile Summary Card */}
        <Animated.View 
          entering={FadeInDown.delay(100).duration(400)}
          style={[styles.summaryCard, { backgroundColor: colors.surface }]}
        >
          <View style={styles.summaryHeader}>
            <View style={[styles.avatarContainer, { backgroundColor: `${colors.primary}20` }]}>
              <IconSymbol name="cup.and.saucer.fill" size={32} color={colors.primary} />
            </View>
            <View style={styles.summaryInfo}>
              <Text style={[styles.experienceLevel, { color: colors.foreground }]}>
                {profile.experienceLevel 
                  ? getExperienceLabel(profile.experienceLevel)
                  : 'Coffee Enthusiast'}
              </Text>
              <Text style={[styles.memberSince, { color: colors.muted }]}>
                Member since {formatDate(profile.createdAt)}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Preferences Section */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Your Preferences
          </Text>
          
          <View style={[styles.preferencesCard, { backgroundColor: colors.surface }]}>
            {/* Experience Level */}
            <View style={styles.preferenceRow}>
              <View style={styles.preferenceLabel}>
                <IconSymbol name="star.fill" size={20} color={colors.primary} />
                <Text style={[styles.preferenceLabelText, { color: colors.muted }]}>
                  Experience
                </Text>
              </View>
              <Text style={[styles.preferenceValue, { color: colors.foreground }]}>
                {profile.experienceLevel 
                  ? getExperienceLabel(profile.experienceLevel)
                  : 'Not set'}
              </Text>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Budget */}
            <View style={styles.preferenceRow}>
              <View style={styles.preferenceLabel}>
                <IconSymbol name="gauge" size={20} color={colors.primary} />
                <Text style={[styles.preferenceLabelText, { color: colors.muted }]}>
                  Budget Range
                </Text>
              </View>
              <Text style={[styles.preferenceValue, { color: colors.foreground }]}>
                {profile.budgetRange 
                  ? getBudgetLabel(profile.budgetRange)
                  : 'Not set'}
              </Text>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Interests */}
            <View style={styles.preferenceRow}>
              <View style={styles.preferenceLabel}>
                <IconSymbol name="heart.fill" size={20} color={colors.primary} />
                <Text style={[styles.preferenceLabelText, { color: colors.muted }]}>
                  Interests
                </Text>
              </View>
              <Text style={[styles.preferenceValue, { color: colors.foreground }]}>
                {profile.coffeePurpose && profile.coffeePurpose.length > 0
                  ? `${profile.coffeePurpose.length} selected`
                  : 'Not set'}
              </Text>
            </View>

            {profile.coffeePurpose && profile.coffeePurpose.length > 0 && (
              <View style={styles.interestTags}>
                {profile.coffeePurpose.map((purpose) => (
                  <View 
                    key={purpose} 
                    style={[styles.tag, { backgroundColor: `${colors.primary}15` }]}
                  >
                    <Text style={[styles.tagText, { color: colors.primary }]}>
                      {getPurposeLabel(purpose)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </Animated.View>

        {/* Equipment Interest */}
        {profile.wantsToBuyEquipment && (
          <Animated.View entering={FadeInDown.delay(300).duration(400)}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Equipment Recommendations
            </Text>
            
            <Pressable
              onPress={handleViewRecommendations}
              style={({ pressed }) => [
                styles.recommendationsCard,
                { 
                  backgroundColor: colors.surface,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="View equipment recommendations"
            >
              <View style={styles.recommendationsContent}>
                <IconSymbol name="wrench.fill" size={24} color={colors.primary} />
                <View style={styles.recommendationsText}>
                  <Text style={[styles.recommendationsTitle, { color: colors.foreground }]}>
                    View Your Recommendations
                  </Text>
                  <Text style={[styles.recommendationsSubtitle, { color: colors.muted }]}>
                    Personalized equipment based on your preferences
                  </Text>
                </View>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.muted} />
            </Pressable>
          </Animated.View>
        )}

        {/* Actions Section */}
        <Animated.View 
          entering={FadeInDown.delay(400).duration(400)}
          style={styles.actionsSection}
        >
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Actions
          </Text>

          <View style={styles.actionsContainer}>
            <PremiumButton
              variant="outline"
              size="md"
              onPress={() => router.push('/onboarding')}
              fullWidth
            >
              Retake Onboarding
            </PremiumButton>

            <PremiumButton
              variant="ghost"
              size="md"
              onPress={handleResetProfile}
              fullWidth
              loading={isResetting}
            >
              Reset All Preferences
            </PremiumButton>
          </View>
        </Animated.View>

        {/* App Info */}
        <Animated.View 
          entering={FadeInDown.delay(500).duration(400)}
          style={styles.appInfo}
        >
          <Text style={[styles.appName, { color: colors.muted }]}>
            Coffee Craft
          </Text>
          <Text style={[styles.appVersion, { color: colors.muted }]}>
            Version 1.0.0
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
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  summaryCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryInfo: {
    flex: 1,
  },
  experienceLevel: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  preferencesCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  preferenceLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  preferenceLabelText: {
    fontSize: 15,
  },
  preferenceValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  interestTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
  },
  recommendationsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  recommendationsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  recommendationsText: {
    flex: 1,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  recommendationsSubtitle: {
    fontSize: 13,
  },
  actionsSection: {
    marginBottom: 32,
  },
  actionsContainer: {
    gap: 12,
  },
  appInfo: {
    alignItems: 'center',
    paddingTop: 16,
  },
  appName: {
    fontSize: 14,
    fontWeight: '600',
  },
  appVersion: {
    fontSize: 12,
    marginTop: 4,
  },
});
