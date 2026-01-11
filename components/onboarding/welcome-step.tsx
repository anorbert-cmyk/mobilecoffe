import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
import LottieView from 'lottie-react-native';

import { PremiumButton } from '@/components/ui/premium-button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';

interface WelcomeStepProps {
  onContinue: () => void;
}

export function WelcomeStep({ onContinue }: WelcomeStepProps) {
  const colors = useColors();

  return (
    <Animated.View 
      entering={FadeIn.duration(800)}
      style={styles.welcomeContainer}
    >
      {/* Hero Section with Lottie Animation */}
      <View style={styles.heroImageWrapper}>
        {/* Background Image */}
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

const styles = StyleSheet.create({
  welcomeContainer: {
    flex: 1,
  },
  heroImageWrapper: {
    height: '50%',
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
    height: '50%',
  },
  welcomeContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 36,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeTagline: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  welcomeDescription: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },
  featurePills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  featurePillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  welcomeButtonContainer: {
    gap: 12,
  },
  welcomeFooter: {
    fontSize: 13,
    textAlign: 'center',
  },
});
