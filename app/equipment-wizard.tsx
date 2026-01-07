import { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import Animated, { 
  FadeIn, 
  FadeInDown,
  SlideInRight,
  SlideInLeft,
} from 'react-native-reanimated';

import { ScreenContainer } from '@/components/screen-container';
import { PremiumButton } from '@/components/ui/premium-button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { 
  useUserProfile, 
  BudgetRange, 
  CoffeePurpose 
} from '@/lib/user-profile';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type WizardStep = 'intro' | 'budget' | 'purpose' | 'complete';

export default function EquipmentWizardScreen() {
  const colors = useColors();
  const { profile, updateProfile } = useUserProfile();
  
  const [currentStep, setCurrentStep] = useState<WizardStep>('intro');
  const [budget, setBudget] = useState<BudgetRange | null>(profile.budgetRange);
  const [purposes, setPurposes] = useState<CoffeePurpose[]>(profile.coffeePurpose || []);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');

  const triggerHaptic = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  const goBack = useCallback(() => {
    triggerHaptic();
    setDirection('back');
    
    if (currentStep === 'budget') {
      setCurrentStep('intro');
    } else if (currentStep === 'purpose') {
      setCurrentStep('budget');
    } else if (currentStep === 'complete') {
      setCurrentStep('purpose');
    } else {
      router.back();
    }
  }, [currentStep, triggerHaptic]);

  const goNext = useCallback((nextStep: WizardStep) => {
    triggerHaptic();
    setDirection('forward');
    setCurrentStep(nextStep);
  }, [triggerHaptic]);

  const handleBudgetSelect = async (selectedBudget: BudgetRange) => {
    triggerHaptic();
    setBudget(selectedBudget);
    await updateProfile({ budgetRange: selectedBudget });
    goNext('purpose');
  };

  const handlePurposeToggle = (purpose: CoffeePurpose) => {
    triggerHaptic();
    setPurposes(prev => {
      if (prev.includes(purpose)) {
        return prev.filter(p => p !== purpose);
      }
      return [...prev, purpose];
    });
  };

  const handlePurposeContinue = async () => {
    triggerHaptic();
    await updateProfile({ coffeePurpose: purposes, wantsToBuyEquipment: true });
    goNext('complete');
  };

  const handleViewRecommendations = () => {
    triggerHaptic();
    router.replace('/recommendations');
  };

  const handleClose = () => {
    triggerHaptic();
    router.back();
  };

  const progress = currentStep === 'intro' ? 0 : currentStep === 'budget' ? 0.33 : currentStep === 'purpose' ? 0.66 : 1;
  const enteringAnimation = direction === 'forward' ? SlideInRight.duration(300) : SlideInLeft.duration(300);

  return (
    <ScreenContainer edges={['top', 'bottom', 'left', 'right']}>
      {/* Header with Back Button */}
      <Animated.View 
        entering={FadeIn.duration(300)}
        style={styles.header}
      >
        <Pressable
          onPress={goBack}
          style={({ pressed }) => [
            styles.backButton,
            { 
              backgroundColor: colors.surface,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <IconSymbol name="chevron.left" size={20} color={colors.foreground} />
        </Pressable>
        
        <View style={styles.progressWrapper}>
          <View style={[styles.progressTrack, { backgroundColor: colors.surface }]}>
            <Animated.View 
              style={[
                styles.progressFill, 
                { 
                  backgroundColor: colors.primary,
                  width: `${progress * 100}%`,
                }
              ]} 
            />
          </View>
        </View>

        <Pressable
          onPress={handleClose}
          style={({ pressed }) => [
            styles.closeButton,
            { 
              backgroundColor: colors.surface,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Close wizard"
        >
          <IconSymbol name="xmark" size={18} color={colors.foreground} />
        </Pressable>
      </Animated.View>

      {/* Intro Step */}
      {currentStep === 'intro' && (
        <Animated.View 
          key="intro"
          entering={FadeIn.duration(400)}
          style={styles.stepContainer}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.introContent}>
              <View style={[styles.introIconWrapper, { backgroundColor: colors.primary + '20' }]}>
                <IconSymbol name="gearshape.2.fill" size={48} color={colors.primary} />
              </View>
              
              <Text style={[styles.introTitle, { color: colors.foreground }]}>
                Find Your Perfect Setup
              </Text>
              
              <Text style={[styles.introDescription, { color: colors.muted }]}>
                Answer a few quick questions and we'll recommend the best espresso machine and grinder for your needs and budget.
              </Text>

              <View style={styles.introFeatures}>
                <View style={[styles.featureRow, { backgroundColor: colors.surface }]}>
                  <IconSymbol name="checkmark.circle.fill" size={24} color="#4CAF50" />
                  <Text style={[styles.featureText, { color: colors.foreground }]}>
                    Personalized recommendations
                  </Text>
                </View>
                <View style={[styles.featureRow, { backgroundColor: colors.surface }]}>
                  <IconSymbol name="checkmark.circle.fill" size={24} color="#4CAF50" />
                  <Text style={[styles.featureText, { color: colors.foreground }]}>
                    Budget-friendly options
                  </Text>
                </View>
                <View style={[styles.featureRow, { backgroundColor: colors.surface }]}>
                  <IconSymbol name="checkmark.circle.fill" size={24} color="#4CAF50" />
                  <Text style={[styles.featureText, { color: colors.foreground }]}>
                    Expert-curated selection
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={[styles.bottomContainer, { backgroundColor: colors.background }]}>
            <PremiumButton
              variant="primary"
              size="lg"
              onPress={() => goNext('budget')}
              fullWidth
            >
              Let's Get Started
            </PremiumButton>
          </View>
        </Animated.View>
      )}

      {/* Budget Step */}
      {currentStep === 'budget' && (
        <Animated.View 
          key="budget"
          entering={enteringAnimation}
          style={styles.stepContainer}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.stepHeader}>
              <Text style={[styles.stepTitle, { color: colors.foreground }]}>
                What's your budget?
              </Text>
              <Text style={[styles.stepSubtitle, { color: colors.muted }]}>
                This includes both machine and grinder
              </Text>
            </View>

            <View style={styles.budgetOptions}>
              {[
                { budget: 'starter' as BudgetRange, title: 'Getting Started', range: '$200 - $500', desc: 'Entry-level equipment' },
                { budget: 'home-barista' as BudgetRange, title: 'Home Barista', range: '$500 - $1,000', desc: 'Quality daily drivers' },
                { budget: 'serious' as BudgetRange, title: 'Serious Setup', range: '$1,000 - $2,000', desc: 'Professional-grade' },
                { budget: 'prosumer' as BudgetRange, title: 'Prosumer', range: '$2,000+', desc: 'Commercial quality' },
              ].map((option, index) => (
                <Animated.View
                  key={option.budget}
                  entering={FadeInDown.delay(index * 80).duration(300)}
                >
                  <Pressable
                    onPress={() => handleBudgetSelect(option.budget)}
                    style={({ pressed }) => [
                      styles.budgetCard,
                      { 
                        backgroundColor: budget === option.budget ? colors.primary + '15' : colors.surface,
                        borderColor: budget === option.budget ? colors.primary : colors.border,
                        borderWidth: budget === option.budget ? 2 : 1,
                        transform: [{ scale: pressed ? 0.98 : 1 }],
                      },
                    ]}
                    accessibilityRole="button"
                  >
                    <View style={styles.budgetContent}>
                      <Text style={[styles.budgetTitle, { color: colors.foreground }]}>
                        {option.title}
                      </Text>
                      <Text style={[styles.budgetRange, { color: colors.primary }]}>
                        {option.range}
                      </Text>
                      <Text style={[styles.budgetDesc, { color: colors.muted }]}>
                        {option.desc}
                      </Text>
                    </View>
                    {budget === option.budget && (
                      <IconSymbol name="checkmark.circle.fill" size={24} color={colors.primary} />
                    )}
                  </Pressable>
                </Animated.View>
              ))}
            </View>
          </ScrollView>
        </Animated.View>
      )}

      {/* Purpose Step */}
      {currentStep === 'purpose' && (
        <Animated.View 
          key="purpose"
          entering={enteringAnimation}
          style={styles.stepContainer}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.stepHeader}>
              <Text style={[styles.stepTitle, { color: colors.foreground }]}>
                What will you make?
              </Text>
              <Text style={[styles.stepSubtitle, { color: colors.muted }]}>
                Select all that apply
              </Text>
            </View>

            <View style={styles.purposeOptions}>
              {[
                { purpose: 'quick-espresso' as CoffeePurpose, title: 'Espresso Shots', icon: 'bolt.fill' },
                { purpose: 'milk-drinks' as CoffeePurpose, title: 'Lattes & Cappuccinos', icon: 'drop.fill' },
                { purpose: 'pour-over' as CoffeePurpose, title: 'Pour Over', icon: 'arrow.down.circle.fill' },
                { purpose: 'cold-brew' as CoffeePurpose, title: 'Cold Brew', icon: 'snowflake' },
                { purpose: 'experimenting' as CoffeePurpose, title: 'Experimenting', icon: 'flask.fill' },
              ].map((option, index) => {
                const isSelected = purposes.includes(option.purpose);
                return (
                  <Animated.View
                    key={option.purpose}
                    entering={FadeInDown.delay(index * 60).duration(300)}
                  >
                    <Pressable
                      onPress={() => handlePurposeToggle(option.purpose)}
                      style={({ pressed }) => [
                        styles.purposeChip,
                        { 
                          backgroundColor: isSelected ? colors.primary : colors.surface,
                          borderColor: isSelected ? colors.primary : colors.border,
                          transform: [{ scale: pressed ? 0.96 : 1 }],
                        },
                      ]}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: isSelected }}
                    >
                      <IconSymbol 
                        name={option.icon as any} 
                        size={20} 
                        color={isSelected ? '#FFFFFF' : colors.foreground} 
                      />
                      <Text style={[
                        styles.purposeText, 
                        { color: isSelected ? '#FFFFFF' : colors.foreground }
                      ]}>
                        {option.title}
                      </Text>
                      {isSelected && (
                        <IconSymbol name="checkmark" size={16} color="#FFFFFF" />
                      )}
                    </Pressable>
                  </Animated.View>
                );
              })}
            </View>
          </ScrollView>

          <View style={[styles.bottomContainer, { backgroundColor: colors.background }]}>
            <PremiumButton
              variant="primary"
              size="lg"
              onPress={handlePurposeContinue}
              fullWidth
              disabled={purposes.length === 0}
            >
              See Recommendations
            </PremiumButton>
          </View>
        </Animated.View>
      )}

      {/* Complete Step */}
      {currentStep === 'complete' && (
        <Animated.View 
          key="complete"
          entering={FadeIn.duration(500)}
          style={styles.stepContainer}
        >
          <ScrollView 
            contentContainerStyle={[styles.scrollContent, styles.completeContent]}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.completeIconWrapper, { backgroundColor: '#4CAF5020' }]}>
              <IconSymbol name="checkmark.circle.fill" size={64} color="#4CAF50" />
            </View>

            <Text style={[styles.completeTitle, { color: colors.foreground }]}>
              Perfect!
            </Text>
            
            <Text style={[styles.completeSubtitle, { color: colors.muted }]}>
              We've found the best equipment for you
            </Text>

            <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.muted }]}>Budget</Text>
                <Text style={[styles.summaryValue, { color: colors.foreground }]}>
                  {budget === 'starter' ? '$200-500' : budget === 'home-barista' ? '$500-1K' : budget === 'serious' ? '$1K-2K' : '$2K+'}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.muted }]}>Interests</Text>
                <Text style={[styles.summaryValue, { color: colors.foreground }]}>
                  {purposes.length} selected
                </Text>
              </View>
            </View>
          </ScrollView>

          <View style={[styles.bottomContainer, { backgroundColor: colors.background }]}>
            <PremiumButton
              variant="primary"
              size="lg"
              onPress={handleViewRecommendations}
              fullWidth
            >
              View My Recommendations
            </PremiumButton>
          </View>
        </Animated.View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressWrapper: {
    flex: 1,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  stepContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  
  // Intro styles
  introContent: {
    alignItems: 'center',
    paddingTop: 40,
  },
  introIconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  introTitle: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  introDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  introFeatures: {
    width: '100%',
    marginTop: 32,
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
  },
  featureText: {
    fontSize: 15,
    fontWeight: '500',
  },

  // Step header
  stepHeader: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 32,
  },
  stepTitle: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  stepSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },

  // Budget styles
  budgetOptions: {
    gap: 12,
  },
  budgetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
  },
  budgetContent: {
    flex: 1,
  },
  budgetTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  budgetRange: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 4,
  },
  budgetDesc: {
    fontSize: 13,
    marginTop: 4,
  },

  // Purpose styles
  purposeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  purposeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 1,
  },
  purposeText: {
    fontSize: 15,
    fontWeight: '500',
  },

  // Complete styles
  completeContent: {
    alignItems: 'center',
    paddingTop: 60,
  },
  completeIconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  completeTitle: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
  },
  completeSubtitle: {
    fontSize: 17,
    textAlign: 'center',
    marginTop: 8,
  },
  summaryCard: {
    width: '100%',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 32,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 15,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '500',
  },

  // Bottom container
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 40,
  },
});
