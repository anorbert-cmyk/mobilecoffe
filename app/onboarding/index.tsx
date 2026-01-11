import { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeIn, 
  FadeOut, 
  SlideInRight, 
  SlideOutLeft,
  SlideInLeft,
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';

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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');

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
    setDirection('forward');
    setCurrentStep(nextStepId);
  }, [triggerHaptic]);

  const goBack = useCallback(() => {
    triggerHaptic();
    setDirection('back');
    
    const stepOrder: OnboardingStep[] = ['welcome', 'experience', 'equipment-interest', 'budget', 'purpose', 'complete'];
    const currentIndex = stepOrder.indexOf(currentStep);
    
    if (currentStep === 'purpose') {
      if (experienceLevel === 'beginner' && wantsToBuy) {
        setCurrentStep('budget');
      } else if (experienceLevel === 'beginner') {
        setCurrentStep('equipment-interest');
      } else {
        setCurrentStep('experience');
      }
    } else if (currentStep === 'budget') {
      setCurrentStep('equipment-interest');
    } else if (currentStep === 'equipment-interest') {
      setCurrentStep('experience');
    } else if (currentStep === 'experience') {
      setCurrentStep('welcome');
    } else if (currentStep === 'complete') {
      setCurrentStep('purpose');
    }
  }, [currentStep, experienceLevel, wantsToBuy, triggerHaptic]);

  const handleExperienceSelect = async (level: ExperienceLevel) => {
    triggerHaptic();
    setExperienceLevel(level);
    await updateProfile({ experienceLevel: level });
    
    setDirection('forward');
    if (level === 'beginner') {
      setCurrentStep('equipment-interest');
    } else {
      setCurrentStep('purpose');
    }
  };

  const handleEquipmentInterest = async (wants: boolean) => {
    triggerHaptic();
    setWantsToBuy(wants);
    await updateProfile({ wantsToBuyEquipment: wants });
    
    setDirection('forward');
    if (wants) {
      setCurrentStep('budget');
    } else {
      setCurrentStep('purpose');
    }
  };

  const handleBudgetSelect = async (selectedBudget: BudgetRange) => {
    triggerHaptic();
    setBudget(selectedBudget);
    await updateProfile({ budgetRange: selectedBudget });
    setDirection('forward');
    setCurrentStep('purpose');
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
    setDirection('forward');
    setCurrentStep('complete');
  };

  const handleComplete = async () => {
    triggerHaptic();
    await completeOnboarding();
    
    // If user wants to buy equipment, navigate to recommendations
    if (wantsToBuy && budget) {
      router.replace('/recommendations');
    } else {
      router.replace('/(tabs)');
    }
  };

  const visibleSteps = getVisibleSteps();
  const currentIndex = getCurrentStepIndex();
  const progress = (currentIndex + 1) / visibleSteps.length;
  const canGoBack = currentStep !== 'welcome';

  const enteringAnimation = direction === 'forward' ? SlideInRight.duration(350) : SlideInLeft.duration(350);
  const exitingAnimation = direction === 'forward' ? SlideOutLeft.duration(250) : SlideOutLeft.duration(250);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Premium Header with Back Button */}
      {currentStep !== 'welcome' && (
        <Animated.View 
          entering={FadeIn.duration(300)}
          style={styles.header}
        >
          {canGoBack && currentStep !== 'complete' && (
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
          )}
          
          {/* Progress Indicator */}
          {currentStep !== 'complete' && (
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
              <Text style={[styles.progressText, { color: colors.muted }]}>
                {currentIndex + 1} / {visibleSteps.length}
              </Text>
            </View>
          )}
        </Animated.View>
      )}

      {/* Welcome Step - Premium Design */}
      {currentStep === 'welcome' && (
        <WelcomeStep 
          colors={colors} 
          onContinue={() => goToNextStep('experience')} 
        />
      )}

      {/* Experience Level Step */}
      {currentStep === 'experience' && (
        <Animated.View 
          key="experience"
          entering={enteringAnimation}
          style={styles.stepContainer}
        >
          <ExperienceStep 
            colors={colors} 
            onSelect={handleExperienceSelect}
          />
        </Animated.View>
      )}

      {/* Equipment Interest Step */}
      {currentStep === 'equipment-interest' && (
        <Animated.View 
          key="equipment"
          entering={enteringAnimation}
          style={styles.stepContainer}
        >
          <EquipmentInterestStep 
            colors={colors} 
            onSelect={handleEquipmentInterest}
          />
        </Animated.View>
      )}

      {/* Budget Step */}
      {currentStep === 'budget' && (
        <Animated.View 
          key="budget"
          entering={enteringAnimation}
          style={styles.stepContainer}
        >
          <BudgetStep 
            colors={colors} 
            selected={budget}
            onSelect={handleBudgetSelect}
          />
        </Animated.View>
      )}

      {/* Purpose Step */}
      {currentStep === 'purpose' && (
        <Animated.View 
          key="purpose"
          entering={enteringAnimation}
          style={styles.stepContainer}
        >
          <PurposeStep 
            colors={colors} 
            selected={purposes}
            onToggle={handlePurposeToggle}
            onContinue={handlePurposeContinue}
          />
        </Animated.View>
      )}

      {/* Complete Step */}
      {currentStep === 'complete' && (
        <Animated.View 
          key="complete"
          entering={FadeIn.duration(500)}
          style={styles.stepContainer}
        >
          <CompleteStep 
            colors={colors}
            experienceLevel={experienceLevel}
            wantsToBuy={wantsToBuy}
            budget={budget}
            purposes={purposes}
            onComplete={handleComplete}
          />
        </Animated.View>
      )}
    </View>
  );
}

// Premium Welcome Step Component
function WelcomeStep({ 
  colors, 
  onContinue 
}: { 
  colors: ReturnType<typeof useColors>;
  onContinue: () => void;
}) {
  return (
    <Animated.View 
      entering={FadeIn.duration(800)}
      style={styles.welcomeContainer}
    >
      {/* Hero Image - Full Width */}
      <View style={styles.heroImageWrapper}>
        <Image
          source={require('@/assets/images/onboarding/welcome_premium.png')}
          style={styles.heroImageFull}
          contentFit="cover"
        />
        {/* Lottie Animation Overlay */}
        <View style={styles.lottieContainer}>
          <LottieView
            source={require('@/assets/lottie/coffee-brewing.json')}
            autoPlay
            loop
            style={styles.lottieAnimation}
          />
        </View>
        {/* Gradient Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.3)', colors.background]}
          locations={[0, 0.5, 1]}
          style={styles.heroGradient}
        />
      </View>
      
      {/* Content */}
      <View style={styles.welcomeContent}>
        {/* App Logo Badge */}
        <Animated.View 
          entering={FadeIn.delay(300).duration(500)}
          style={[styles.logoBadge, { backgroundColor: colors.primary }]}
        >
          <IconSymbol name="cup.and.saucer.fill" size={24} color="#FFFFFF" />
        </Animated.View>

        <Animated.Text 
          entering={FadeIn.delay(400).duration(500)}
          style={[styles.welcomeTitle, { color: colors.foreground }]}
          accessibilityRole="header"
        >
          Coffee Craft
        </Animated.Text>
        
        <Animated.Text 
          entering={FadeIn.delay(500).duration(500)}
          style={[styles.welcomeTagline, { color: colors.primary }]}
        >
          Master the Art of Specialty Coffee
        </Animated.Text>
        
        <Animated.Text 
          entering={FadeIn.delay(600).duration(500)}
          style={[styles.welcomeDescription, { color: colors.muted }]}
        >
          Your personal barista guide to brewing café-quality coffee at home. Learn techniques, discover recipes, and find the perfect equipment.
        </Animated.Text>

        {/* Feature Pills */}
        <Animated.View 
          entering={FadeIn.delay(700).duration(500)}
          style={styles.featurePills}
        >
          <View style={[styles.featurePill, { backgroundColor: colors.surface }]}>
            <IconSymbol name="book.fill" size={14} color={colors.primary} />
            <Text style={[styles.featurePillText, { color: colors.foreground }]}>12+ Recipes</Text>
          </View>
          <View style={[styles.featurePill, { backgroundColor: colors.surface }]}>
            <IconSymbol name="gearshape.fill" size={14} color={colors.primary} />
            <Text style={[styles.featurePillText, { color: colors.foreground }]}>Equipment Guide</Text>
          </View>
          <View style={[styles.featurePill, { backgroundColor: colors.surface }]}>
            <IconSymbol name="mappin.circle.fill" size={14} color={colors.primary} />
            <Text style={[styles.featurePillText, { color: colors.foreground }]}>Find Cafés</Text>
          </View>
        </Animated.View>
        
        <Animated.View 
          entering={FadeIn.delay(800).duration(500)}
          style={styles.welcomeButtonContainer}
        >
          <PremiumButton
            variant="primary"
            size="lg"
            onPress={onContinue}
            fullWidth
            accessibilityLabel="Get started with Coffee Craft"
          >
            Start Your Journey
          </PremiumButton>
          
          <Text style={[styles.welcomeFooter, { color: colors.muted }]}>
            Takes only 30 seconds to personalize
          </Text>
        </Animated.View>
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
  const options: { level: ExperienceLevel; title: string; description: string; icon: string; color: string }[] = [
    {
      level: 'beginner',
      title: 'Just Starting Out',
      description: "I'm new to specialty coffee and want to learn the basics",
      icon: 'leaf.fill',
      color: '#4CAF50',
    },
    {
      level: 'intermediate',
      title: 'Home Brewer',
      description: 'I make coffee at home and want to improve my skills',
      icon: 'flame.fill',
      color: '#FF9800',
    },
    {
      level: 'advanced',
      title: 'Coffee Enthusiast',
      description: "I'm passionate about coffee and seek advanced techniques",
      icon: 'star.fill',
      color: '#9C27B0',
    },
  ];

  return (
    <ScrollView 
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.stepHeader}>
        <Text 
          style={[styles.stepTitle, { color: colors.foreground }]}
          accessibilityRole="header"
        >
          Where are you on your coffee journey?
        </Text>
        <Text style={[styles.stepSubtitle, { color: colors.muted }]}>
          We'll personalize your experience based on your level
        </Text>
      </View>

      <View style={styles.optionsGrid}>
        {options.map((option, index) => (
          <Animated.View
            key={option.level}
            entering={FadeIn.delay(index * 100).duration(400)}
          >
            <Pressable
              onPress={() => onSelect(option.level)}
              style={({ pressed }) => [
                styles.experienceCard,
                { 
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`${option.title}: ${option.description}`}
            >
              <View style={[styles.experienceIconWrapper, { backgroundColor: option.color + '20' }]}>
                <IconSymbol name={option.icon as any} size={28} color={option.color} />
              </View>
              <View style={styles.experienceTextContainer}>
                <Text style={[styles.experienceTitle, { color: colors.foreground }]}>
                  {option.title}
                </Text>
                <Text style={[styles.experienceDescription, { color: colors.muted }]}>
                  {option.description}
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={20} color={colors.muted} />
            </Pressable>
          </Animated.View>
        ))}
      </View>
    </ScrollView>
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
    <ScrollView 
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.stepHeader}>
        <View style={[styles.stepIconWrapper, { backgroundColor: colors.primary + '20' }]}>
          <IconSymbol name="gearshape.2.fill" size={32} color={colors.primary} />
        </View>
        <Text 
          style={[styles.stepTitle, { color: colors.foreground }]}
          accessibilityRole="header"
        >
          Looking to buy coffee equipment?
        </Text>
        <Text style={[styles.stepSubtitle, { color: colors.muted }]}>
          We can help you find the perfect espresso machine and grinder for your needs
        </Text>
      </View>

      <View style={styles.binaryOptions}>
        <Pressable
          onPress={() => onSelect(true)}
          style={({ pressed }) => [
            styles.binaryCard,
            { 
              backgroundColor: colors.surface,
              borderColor: colors.border,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Yes, I want equipment recommendations"
        >
          <View style={[styles.binaryIconWrapper, { backgroundColor: '#4CAF5020' }]}>
            <IconSymbol name="checkmark.circle.fill" size={32} color="#4CAF50" />
          </View>
          <Text style={[styles.binaryTitle, { color: colors.foreground }]}>
            Yes, help me choose
          </Text>
          <Text style={[styles.binaryDescription, { color: colors.muted }]}>
            Get personalized equipment recommendations based on your budget and goals
          </Text>
        </Pressable>

        <Pressable
          onPress={() => onSelect(false)}
          style={({ pressed }) => [
            styles.binaryCard,
            { 
              backgroundColor: colors.surface,
              borderColor: colors.border,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="No, skip equipment recommendations"
        >
          <View style={[styles.binaryIconWrapper, { backgroundColor: colors.muted + '20' }]}>
            <IconSymbol name="arrow.right.circle.fill" size={32} color={colors.muted} />
          </View>
          <Text style={[styles.binaryTitle, { color: colors.foreground }]}>
            Not right now
          </Text>
          <Text style={[styles.binaryDescription, { color: colors.muted }]}>
            Skip this step - you can always access equipment guide later from your profile
          </Text>
        </Pressable>
      </View>
    </ScrollView>
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
      range: '$200 - $500',
      description: 'Entry-level equipment for beginners',
    },
    {
      budget: 'home-barista',
      title: 'Home Barista',
      range: '$500 - $1,000',
      description: 'Quality equipment for daily use',
    },
    {
      budget: 'serious',
      title: 'Serious Setup',
      range: '$1,000 - $2,000',
      description: 'Professional-grade home equipment',
    },
    {
      budget: 'prosumer',
      title: 'Prosumer',
      range: '$2,000+',
      description: 'Commercial-quality machines',
    },
  ];

  return (
    <ScrollView 
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.stepHeader}>
        <View style={[styles.stepIconWrapper, { backgroundColor: '#4CAF5020' }]}>
          <IconSymbol name="dollarsign.circle.fill" size={32} color="#4CAF50" />
        </View>
        <Text 
          style={[styles.stepTitle, { color: colors.foreground }]}
          accessibilityRole="header"
        >
          What's your budget?
        </Text>
        <Text style={[styles.stepSubtitle, { color: colors.muted }]}>
          This helps us recommend the right equipment for you
        </Text>
      </View>

      <View style={styles.budgetOptions}>
        {options.map((option, index) => (
          <Animated.View
            key={option.budget}
            entering={FadeIn.delay(index * 80).duration(300)}
          >
            <Pressable
              onPress={() => onSelect(option.budget)}
              style={({ pressed }) => [
                styles.budgetCard,
                { 
                  backgroundColor: selected === option.budget ? colors.primary + '15' : colors.surface,
                  borderColor: selected === option.budget ? colors.primary : colors.border,
                  borderWidth: selected === option.budget ? 2 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
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
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );
}

// Purpose Step Component
function PurposeStep({ 
  colors, 
  selected,
  onToggle,
  onContinue
}: { 
  colors: ReturnType<typeof useColors>;
  selected: CoffeePurpose[];
  onToggle: (purpose: CoffeePurpose) => void;
  onContinue: () => void;
}) {
  const options: { purpose: CoffeePurpose; title: string; icon: string }[] = [
    { purpose: 'quick-espresso', title: 'Quick Espresso Shots', icon: 'bolt.fill' },
    { purpose: 'milk-drinks', title: 'Milk-Based Drinks', icon: 'drop.fill' },
    { purpose: 'pour-over', title: 'Pour Over & Filter', icon: 'arrow.down.circle.fill' },
    { purpose: 'cold-brew', title: 'Cold Brew', icon: 'snowflake' },
    { purpose: 'experimenting', title: 'Experimenting', icon: 'flask.fill' },
  ];

  return (
    <View style={styles.purposeContainer}>
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.stepHeader}>
          <View style={[styles.stepIconWrapper, { backgroundColor: '#FF980020' }]}>
            <IconSymbol name="cup.and.saucer.fill" size={32} color="#FF9800" />
          </View>
          <Text 
            style={[styles.stepTitle, { color: colors.foreground }]}
            accessibilityRole="header"
          >
            What do you want to make?
          </Text>
          <Text style={[styles.stepSubtitle, { color: colors.muted }]}>
            Select all that apply
          </Text>
        </View>

        <View style={styles.purposeOptions}>
          {options.map((option, index) => {
            const isSelected = selected.includes(option.purpose);
            return (
              <Animated.View
                key={option.purpose}
                entering={FadeIn.delay(index * 60).duration(300)}
              >
                <Pressable
                  onPress={() => onToggle(option.purpose)}
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
                  accessibilityLabel={option.title}
                >
                  <IconSymbol 
                    name={option.icon as any} 
                    size={20} 
                    color={isSelected ? '#FFFFFF' : colors.foreground} 
                  />
                  <Text style={[
                    styles.purposeChipText, 
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

      <View style={[styles.bottomButtonContainer, { backgroundColor: colors.background }]}>
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
    </View>
  );
}

// Complete Step Component
function CompleteStep({ 
  colors,
  experienceLevel,
  wantsToBuy,
  budget,
  purposes,
  onComplete
}: { 
  colors: ReturnType<typeof useColors>;
  experienceLevel: ExperienceLevel | null;
  wantsToBuy: boolean | null;
  budget: BudgetRange | null;
  purposes: CoffeePurpose[];
  onComplete: () => void;
}) {
  return (
    <ScrollView 
      style={styles.scrollContainer}
      contentContainerStyle={[styles.scrollContent, styles.completeContent]}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View 
        entering={FadeIn.delay(200).duration(500)}
        style={[styles.completeIconWrapper, { backgroundColor: '#4CAF5020' }]}
      >
        <IconSymbol name="checkmark.circle.fill" size={64} color="#4CAF50" />
      </Animated.View>

      <Animated.Text 
        entering={FadeIn.delay(400).duration(500)}
        style={[styles.completeTitle, { color: colors.foreground }]}
        accessibilityRole="header"
      >
        You're All Set!
      </Animated.Text>
      
      <Animated.Text 
        entering={FadeIn.delay(500).duration(500)}
        style={[styles.completeSubtitle, { color: colors.muted }]}
      >
        Your personalized coffee experience is ready
      </Animated.Text>

      {/* Summary Card */}
      <Animated.View 
        entering={FadeIn.delay(600).duration(500)}
        style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <Text style={[styles.summaryTitle, { color: colors.foreground }]}>Your Profile</Text>
        
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.muted }]}>Experience</Text>
          <Text style={[styles.summaryValue, { color: colors.foreground }]}>
            {experienceLevel === 'beginner' ? 'Beginner' : experienceLevel === 'intermediate' ? 'Home Brewer' : 'Enthusiast'}
          </Text>
        </View>

        {wantsToBuy && budget && (
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.muted }]}>Budget</Text>
            <Text style={[styles.summaryValue, { color: colors.foreground }]}>
              {budget === 'starter' ? '$200-500' : budget === 'home-barista' ? '$500-1K' : budget === 'serious' ? '$1K-2K' : '$2K+'}
            </Text>
          </View>
        )}

        {purposes.length > 0 && (
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.muted }]}>Interests</Text>
            <Text style={[styles.summaryValue, { color: colors.foreground }]}>
              {purposes.length} selected
            </Text>
          </View>
        )}
      </Animated.View>

      <Animated.View 
        entering={FadeIn.delay(800).duration(500)}
        style={styles.completeButtonContainer}
      >
        <PremiumButton
          variant="primary"
          size="lg"
          onPress={onComplete}
          fullWidth
          accessibilityLabel="Start exploring Coffee Craft"
        >
          Start Exploring
        </PremiumButton>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    gap: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressWrapper: {
    flex: 1,
    gap: 8,
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
    fontWeight: '500',
  },
  stepContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  
  // Welcome Step Styles
  welcomeContainer: {
    flex: 1,
  },
  heroImageWrapper: {
    height: SCREEN_HEIGHT * 0.45,
    width: '100%',
    position: 'relative',
  },
  heroImageFull: {
    width: '100%',
    height: '100%',
  },
  lottieContainer: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottieAnimation: {
    width: 200,
    height: 200,
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
  },
  welcomeContent: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: -40,
  },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  welcomeTitle: {
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  welcomeTagline: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 0.5,
  },
  welcomeDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 8,
  },
  featurePills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  featurePillText: {
    fontSize: 13,
    fontWeight: '500',
  },
  welcomeButtonContainer: {
    width: '100%',
    marginTop: 32,
    gap: 12,
  },
  welcomeFooter: {
    fontSize: 13,
    textAlign: 'center',
  },

  // Step Header Styles
  stepHeader: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 32,
  },
  stepIconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
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
    lineHeight: 22,
  },

  // Experience Step Styles
  optionsGrid: {
    gap: 12,
  },
  experienceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 16,
  },
  experienceIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  experienceTextContainer: {
    flex: 1,
  },
  experienceTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  experienceDescription: {
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },

  // Binary Options Styles
  binaryOptions: {
    gap: 16,
  },
  binaryCard: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
  },
  binaryIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  binaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  binaryDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },

  // Budget Step Styles
  budgetOptions: {
    gap: 12,
  },
  budgetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
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
  budgetDescription: {
    fontSize: 13,
    marginTop: 4,
  },

  // Purpose Step Styles
  purposeContainer: {
    flex: 1,
  },
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
  purposeChipText: {
    fontSize: 15,
    fontWeight: '500',
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 40,
  },

  // Complete Step Styles
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
  summaryTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 16,
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
  completeButtonContainer: {
    width: '100%',
    marginTop: 32,
  },
});
