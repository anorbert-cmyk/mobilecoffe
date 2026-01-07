import { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import Animated, { 
  FadeIn, 
  FadeOut, 
  SlideInRight, 
  SlideOutLeft,
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';

import { ScreenContainer } from '@/components/screen-container';
import { PremiumButton } from '@/components/ui/premium-button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { 
  useUserProfile, 
  ExperienceLevel, 
  BudgetRange, 
  CoffeePurpose 
} from '@/lib/user-profile';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Onboarding step types
type OnboardingStep = 
  | 'welcome'
  | 'experience'
  | 'equipment-interest'
  | 'budget'
  | 'purpose'
  | 'complete';

interface StepConfig {
  id: OnboardingStep;
  showForBeginners: boolean;
  showForAll: boolean;
}

const STEPS: StepConfig[] = [
  { id: 'welcome', showForBeginners: true, showForAll: true },
  { id: 'experience', showForBeginners: true, showForAll: true },
  { id: 'equipment-interest', showForBeginners: true, showForAll: false },
  { id: 'budget', showForBeginners: true, showForAll: false },
  { id: 'purpose', showForBeginners: true, showForAll: true },
  { id: 'complete', showForBeginners: true, showForAll: true },
];

export default function OnboardingScreen() {
  const colors = useColors();
  const { updateProfile, completeOnboarding } = useUserProfile();
  
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | null>(null);
  const [wantsToBuy, setWantsToBuy] = useState<boolean | null>(null);
  const [budget, setBudget] = useState<BudgetRange | null>(null);
  const [purposes, setPurposes] = useState<CoffeePurpose[]>([]);

  const triggerHaptic = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  const getVisibleSteps = useCallback(() => {
    if (experienceLevel === 'beginner' && wantsToBuy) {
      return STEPS.filter(s => s.showForBeginners);
    }
    return STEPS.filter(s => s.showForAll);
  }, [experienceLevel, wantsToBuy]);

  const getCurrentStepIndex = useCallback(() => {
    const visibleSteps = getVisibleSteps();
    return visibleSteps.findIndex(s => s.id === currentStep);
  }, [currentStep, getVisibleSteps]);

  const goToNextStep = useCallback((nextStepId: OnboardingStep) => {
    triggerHaptic();
    setCurrentStep(nextStepId);
  }, [triggerHaptic]);

  const handleExperienceSelect = async (level: ExperienceLevel) => {
    triggerHaptic();
    setExperienceLevel(level);
    await updateProfile({ experienceLevel: level });
    
    if (level === 'beginner') {
      goToNextStep('equipment-interest');
    } else {
      goToNextStep('purpose');
    }
  };

  const handleEquipmentInterest = async (wants: boolean) => {
    triggerHaptic();
    setWantsToBuy(wants);
    await updateProfile({ wantsToBuyEquipment: wants });
    
    if (wants) {
      goToNextStep('budget');
    } else {
      goToNextStep('purpose');
    }
  };

  const handleBudgetSelect = async (selectedBudget: BudgetRange) => {
    triggerHaptic();
    setBudget(selectedBudget);
    await updateProfile({ budgetRange: selectedBudget });
    goToNextStep('purpose');
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
    await updateProfile({ coffeePurpose: purposes });
    goToNextStep('complete');
  };

  const handleComplete = async () => {
    triggerHaptic();
    await completeOnboarding();
    router.replace('/(tabs)');
  };

  const visibleSteps = getVisibleSteps();
  const currentIndex = getCurrentStepIndex();
  const progress = (currentIndex + 1) / visibleSteps.length;

  return (
    <ScreenContainer edges={['top', 'bottom', 'left', 'right']}>
      {/* Progress Bar */}
      {currentStep !== 'welcome' && currentStep !== 'complete' && (
        <Animated.View 
          entering={FadeIn}
          style={styles.progressContainer}
        >
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
          <Text style={[styles.progressText, { color: colors.muted }]}>
            Step {currentIndex + 1} of {visibleSteps.length}
          </Text>
        </Animated.View>
      )}

      {/* Welcome Step */}
      {currentStep === 'welcome' && (
        <WelcomeStep 
          colors={colors} 
          onContinue={() => goToNextStep('experience')} 
        />
      )}

      {/* Experience Level Step */}
      {currentStep === 'experience' && (
        <ExperienceStep 
          colors={colors} 
          onSelect={handleExperienceSelect}
        />
      )}

      {/* Equipment Interest Step */}
      {currentStep === 'equipment-interest' && (
        <EquipmentInterestStep 
          colors={colors} 
          onSelect={handleEquipmentInterest}
        />
      )}

      {/* Budget Step */}
      {currentStep === 'budget' && (
        <BudgetStep 
          colors={colors} 
          selected={budget}
          onSelect={handleBudgetSelect}
        />
      )}

      {/* Purpose Step */}
      {currentStep === 'purpose' && (
        <PurposeStep 
          colors={colors} 
          selected={purposes}
          onToggle={handlePurposeToggle}
          onContinue={handlePurposeContinue}
        />
      )}

      {/* Complete Step */}
      {currentStep === 'complete' && (
        <CompleteStep 
          colors={colors}
          experienceLevel={experienceLevel}
          wantsToBuy={wantsToBuy}
          budget={budget}
          purposes={purposes}
          onComplete={handleComplete}
        />
      )}
    </ScreenContainer>
  );
}

// Welcome Step Component
function WelcomeStep({ 
  colors, 
  onContinue 
}: { 
  colors: ReturnType<typeof useColors>;
  onContinue: () => void;
}) {
  return (
    <Animated.View 
      entering={FadeIn.duration(600)}
      style={styles.stepContainer}
    >
      <View style={styles.imageContainer}>
        <Image
          source={require('@/assets/images/onboarding/welcome.png')}
          style={styles.heroImage}
          contentFit="contain"
        />
      </View>
      
      <View style={styles.contentContainer}>
        <Text 
          style={[styles.title, { color: colors.foreground }]}
          accessibilityRole="header"
        >
          Welcome to{'\n'}Coffee Craft
        </Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Your personal guide to brewing the perfect cup of specialty coffee at home.
        </Text>
        
        <View style={styles.buttonContainer}>
          <PremiumButton
            variant="primary"
            size="lg"
            onPress={onContinue}
            fullWidth
            accessibilityLabel="Get started with Coffee Craft"
          >
            Get Started
          </PremiumButton>
        </View>
      </View>
    </Animated.View>
  );
}

// Experience Level Step Component
function ExperienceStep({ 
  colors, 
  onSelect 
}: { 
  colors: ReturnType<typeof useColors>;
  onSelect: (level: ExperienceLevel) => void;
}) {
  const options: { level: ExperienceLevel; title: string; description: string; image: any }[] = [
    {
      level: 'beginner',
      title: 'Just Starting Out',
      description: "I'm new to specialty coffee",
      image: require('@/assets/images/onboarding/beginner.png'),
    },
    {
      level: 'intermediate',
      title: 'Home Brewer',
      description: 'I make coffee at home sometimes',
      image: require('@/assets/images/onboarding/intermediate.png'),
    },
    {
      level: 'advanced',
      title: 'Coffee Enthusiast',
      description: "I'm passionate about coffee",
      image: require('@/assets/images/onboarding/advanced.png'),
    },
  ];

  return (
    <Animated.View 
      entering={SlideInRight.duration(400)}
      exiting={SlideOutLeft.duration(300)}
      style={styles.stepContainer}
    >
      <View style={styles.headerContainer}>
        <Text 
          style={[styles.stepTitle, { color: colors.foreground }]}
          accessibilityRole="header"
        >
          Where are you on your{'\n'}coffee journey?
        </Text>
        <Text style={[styles.stepSubtitle, { color: colors.muted }]}>
          We'll personalize your experience
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <Pressable
            key={option.level}
            onPress={() => onSelect(option.level)}
            style={({ pressed }) => [
              styles.optionCard,
              { 
                backgroundColor: colors.surface,
                borderColor: colors.border,
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={`${option.title}: ${option.description}`}
          >
            <Image
              source={option.image}
              style={styles.optionImage}
              contentFit="cover"
            />
            <View style={styles.optionContent}>
              <Text style={[styles.optionTitle, { color: colors.foreground }]}>
                {option.title}
              </Text>
              <Text style={[styles.optionDescription, { color: colors.muted }]}>
                {option.description}
              </Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.muted} />
          </Pressable>
        ))}
      </View>
    </Animated.View>
  );
}

// Equipment Interest Step Component
function EquipmentInterestStep({ 
  colors, 
  onSelect 
}: { 
  colors: ReturnType<typeof useColors>;
  onSelect: (wants: boolean) => void;
}) {
  return (
    <Animated.View 
      entering={SlideInRight.duration(400)}
      exiting={SlideOutLeft.duration(300)}
      style={styles.stepContainer}
    >
      <View style={styles.imageContainer}>
        <Image
          source={require('@/assets/images/onboarding/equipment.png')}
          style={styles.mediumImage}
          contentFit="contain"
        />
      </View>

      <View style={styles.contentContainer}>
        <Text 
          style={[styles.stepTitle, { color: colors.foreground }]}
          accessibilityRole="header"
        >
          Looking to buy{'\n'}coffee equipment?
        </Text>
        <Text style={[styles.stepSubtitle, { color: colors.muted }]}>
          We can help you find the perfect setup for your needs and budget.
        </Text>

        <View style={styles.binaryOptions}>
          <Pressable
            onPress={() => onSelect(true)}
            style={({ pressed }) => [
              styles.binaryOption,
              { 
                backgroundColor: colors.surface,
                borderColor: colors.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Yes, I want to buy equipment"
          >
            <IconSymbol name="checkmark.circle.fill" size={32} color={colors.success} />
            <Text style={[styles.binaryOptionText, { color: colors.foreground }]}>
              Yes, help me choose
            </Text>
          </Pressable>

          <Pressable
            onPress={() => onSelect(false)}
            style={({ pressed }) => [
              styles.binaryOption,
              { 
                backgroundColor: colors.surface,
                borderColor: colors.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="No, I already have equipment"
          >
            <IconSymbol name="xmark.circle.fill" size={32} color={colors.muted} />
            <Text style={[styles.binaryOptionText, { color: colors.foreground }]}>
              No, I have equipment
            </Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

// Budget Step Component
function BudgetStep({ 
  colors, 
  selected,
  onSelect 
}: { 
  colors: ReturnType<typeof useColors>;
  selected: BudgetRange | null;
  onSelect: (budget: BudgetRange) => void;
}) {
  const options: { budget: BudgetRange; title: string; range: string; description: string }[] = [
    {
      budget: 'starter',
      title: 'Getting Started',
      range: '$100 - $300',
      description: 'Basic setup for beginners',
    },
    {
      budget: 'home-barista',
      title: 'Home Barista',
      range: '$300 - $700',
      description: 'Quality equipment for daily use',
    },
    {
      budget: 'serious',
      title: 'Serious Setup',
      range: '$700 - $1,500',
      description: 'Professional-grade at home',
    },
    {
      budget: 'prosumer',
      title: 'Prosumer',
      range: '$1,500+',
      description: 'Café-quality equipment',
    },
  ];

  return (
    <Animated.View 
      entering={SlideInRight.duration(400)}
      exiting={SlideOutLeft.duration(300)}
      style={styles.stepContainer}
    >
      <View style={styles.smallImageContainer}>
        <Image
          source={require('@/assets/images/onboarding/budget.png')}
          style={styles.smallImage}
          contentFit="contain"
        />
      </View>

      <View style={styles.headerContainer}>
        <Text 
          style={[styles.stepTitle, { color: colors.foreground }]}
          accessibilityRole="header"
        >
          What's your budget?
        </Text>
        <Text style={[styles.stepSubtitle, { color: colors.muted }]}>
          We'll recommend equipment that fits
        </Text>
      </View>

      <View style={styles.budgetOptions}>
        {options.map((option) => (
          <Pressable
            key={option.budget}
            onPress={() => onSelect(option.budget)}
            style={({ pressed }) => [
              styles.budgetOption,
              { 
                backgroundColor: selected === option.budget 
                  ? `${colors.primary}15` 
                  : colors.surface,
                borderColor: selected === option.budget 
                  ? colors.primary 
                  : colors.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={`${option.title}: ${option.range}`}
          >
            <View style={styles.budgetContent}>
              <Text style={[styles.budgetTitle, { color: colors.foreground }]}>
                {option.title}
              </Text>
              <Text style={[styles.budgetRange, { color: colors.primary }]}>
                {option.range}
              </Text>
              <Text style={[styles.budgetDescription, { color: colors.muted }]}>
                {option.description}
              </Text>
            </View>
            {selected === option.budget && (
              <IconSymbol name="checkmark.circle.fill" size={24} color={colors.primary} />
            )}
          </Pressable>
        ))}
      </View>
    </Animated.View>
  );
}

// Purpose Step Component
function PurposeStep({ 
  colors, 
  selected,
  onToggle,
  onContinue,
}: { 
  colors: ReturnType<typeof useColors>;
  selected: CoffeePurpose[];
  onToggle: (purpose: CoffeePurpose) => void;
  onContinue: () => void;
}) {
  const options: { purpose: CoffeePurpose; title: string; description: string; image: any }[] = [
    {
      purpose: 'quick-espresso',
      title: 'Quick Espresso',
      description: 'Fast morning shots',
      image: require('@/assets/images/onboarding/purpose_espresso.png'),
    },
    {
      purpose: 'milk-drinks',
      title: 'Milk Drinks',
      description: 'Lattes, cappuccinos',
      image: require('@/assets/images/onboarding/purpose_milk.png'),
    },
    {
      purpose: 'pour-over',
      title: 'Pour-Over',
      description: 'Filter & manual brewing',
      image: require('@/assets/images/onboarding/purpose_pourover.png'),
    },
    {
      purpose: 'full-setup',
      title: 'Full Café',
      description: 'Everything at home',
      image: require('@/assets/images/onboarding/equipment.png'),
    },
  ];

  return (
    <Animated.View 
      entering={SlideInRight.duration(400)}
      exiting={SlideOutLeft.duration(300)}
      style={styles.stepContainer}
    >
      <View style={styles.headerContainer}>
        <Text 
          style={[styles.stepTitle, { color: colors.foreground }]}
          accessibilityRole="header"
        >
          What do you want{'\n'}to make?
        </Text>
        <Text style={[styles.stepSubtitle, { color: colors.muted }]}>
          Select all that interest you
        </Text>
      </View>

      <View style={styles.purposeGrid}>
        {options.map((option) => {
          const isSelected = selected.includes(option.purpose);
          return (
            <Pressable
              key={option.purpose}
              onPress={() => onToggle(option.purpose)}
              style={({ pressed }) => [
                styles.purposeCard,
                { 
                  backgroundColor: isSelected 
                    ? `${colors.primary}15` 
                    : colors.surface,
                  borderColor: isSelected 
                    ? colors.primary 
                    : colors.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={`${option.title}: ${option.description}`}
            >
              <Image
                source={option.image}
                style={styles.purposeImage}
                contentFit="cover"
              />
              <Text style={[styles.purposeTitle, { color: colors.foreground }]}>
                {option.title}
              </Text>
              <Text style={[styles.purposeDescription, { color: colors.muted }]}>
                {option.description}
              </Text>
              {isSelected && (
                <View style={[styles.checkBadge, { backgroundColor: colors.primary }]}>
                  <IconSymbol name="checkmark" size={12} color="#FFFFFF" />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.continueContainer}>
        <PremiumButton
          variant="primary"
          size="lg"
          onPress={onContinue}
          fullWidth
          disabled={selected.length === 0}
          accessibilityLabel="Continue to next step"
        >
          Continue
        </PremiumButton>
      </View>
    </Animated.View>
  );
}

// Complete Step Component
function CompleteStep({ 
  colors,
  experienceLevel,
  wantsToBuy,
  budget,
  purposes,
  onComplete,
}: { 
  colors: ReturnType<typeof useColors>;
  experienceLevel: ExperienceLevel | null;
  wantsToBuy: boolean | null;
  budget: BudgetRange | null;
  purposes: CoffeePurpose[];
  onComplete: () => void;
}) {
  return (
    <Animated.View 
      entering={FadeIn.duration(600)}
      style={styles.stepContainer}
    >
      <View style={styles.imageContainer}>
        <Image
          source={require('@/assets/images/onboarding/complete.png')}
          style={styles.heroImage}
          contentFit="contain"
        />
      </View>
      
      <View style={styles.contentContainer}>
        <Text 
          style={[styles.title, { color: colors.foreground }]}
          accessibilityRole="header"
        >
          You're all set!
        </Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          {experienceLevel === 'beginner' && wantsToBuy
            ? "We've prepared personalized equipment recommendations and recipes just for you."
            : "Your personalized coffee journey awaits. Let's start brewing!"}
        </Text>
        
        {/* Summary */}
        <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.muted }]}>Experience</Text>
            <Text style={[styles.summaryValue, { color: colors.foreground }]}>
              {experienceLevel === 'beginner' ? 'Beginner' : 
               experienceLevel === 'intermediate' ? 'Home Brewer' : 'Enthusiast'}
            </Text>
          </View>
          {budget && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.muted }]}>Budget</Text>
              <Text style={[styles.summaryValue, { color: colors.foreground }]}>
                {budget === 'starter' ? '$100-300' :
                 budget === 'home-barista' ? '$300-700' :
                 budget === 'serious' ? '$700-1,500' : '$1,500+'}
              </Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.muted }]}>Interests</Text>
            <Text style={[styles.summaryValue, { color: colors.foreground }]}>
              {purposes.length} selected
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <PremiumButton
            variant="primary"
            size="lg"
            onPress={onComplete}
            fullWidth
            accessibilityLabel="Start using Coffee Craft"
          >
            Start Brewing
          </PremiumButton>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
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
  progressText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  imageContainer: {
    flex: 0.45,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  smallImageContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  mediumImage: {
    width: '80%',
    height: '100%',
  },
  smallImage: {
    width: '60%',
    height: '100%',
  },
  contentContainer: {
    flex: 0.55,
    paddingHorizontal: 24,
    justifyContent: 'flex-start',
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 17,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  optionsContainer: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 16,
  },
  optionImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
  },
  binaryOptions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  binaryOption: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  binaryOptionText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  budgetOptions: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 10,
  },
  budgetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  budgetContent: {
    flex: 1,
  },
  budgetTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  budgetRange: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  budgetDescription: {
    fontSize: 13,
  },
  purposeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    gap: 12,
    marginTop: 16,
  },
  purposeCard: {
    width: (SCREEN_WIDTH - 60) / 2,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    position: 'relative',
  },
  purposeImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginBottom: 12,
  },
  purposeTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  purposeDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    marginTop: 'auto',
  },
  summaryCard: {
    marginTop: 24,
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});
