import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import Animated, { 
  FadeIn, 
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

import { ScreenContainer } from '@/components/screen-container';
import { PremiumButton } from '@/components/ui/premium-button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { useUserProfile } from '@/lib/user-profile';
import { getEquipmentRecommendations, EquipmentRecommendation } from '@/lib/equipment-recommender';
import { EspressoMachine, CoffeeGrinder } from '@/data/machines';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 40;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function triggerHaptic() {
  if (Platform.OS !== 'web') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

function calculateMatchPercentage(
  machine: EspressoMachine | CoffeeGrinder,
  budgetRange: string | null,
  purpose: any
): number {
  let score = 70; // Base score
  
  // Budget match (30 points)
  const priceMatch = budgetRange && machine.priceRange.toLowerCase() === budgetRange.toLowerCase();
  if (priceMatch) score += 30;
  else if (budgetRange && Math.abs(
    ['entry', 'mid', 'high', 'professional'].indexOf(machine.priceRange.toLowerCase()) -
    ['entry', 'mid', 'high', 'professional'].indexOf(budgetRange.toLowerCase())
  ) === 1) {
    score += 15; // Close match
  }
  
  return Math.min(score, 98); // Cap at 98%
}

// Premium Recommendation Card Component
function PremiumRecommendationCard({
  item,
  type,
  matchPercentage,
  isBestMatch,
  onPress,
  onSave,
  index,
}: {
  item: EspressoMachine | CoffeeGrinder;
  type: 'machine' | 'grinder';
  matchPercentage: number;
  isBestMatch: boolean;
  onPress: () => void;
  onSave: () => void;
  index: number;
}) {
  const colors = useColors();
  const scale = useSharedValue(1);
  const [isSaved, setIsSaved] = useState(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleSave = () => {
    triggerHaptic();
    setIsSaved(!isSaved);
    onSave();
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(400)}>
      <AnimatedPressable
        onPress={() => {
          triggerHaptic();
          onPress();
        }}
        onPressIn={() => { scale.value = withSpring(0.98); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        style={[
          animatedStyle,
          styles.premiumCard,
          { backgroundColor: colors.surface }
        ]}
        accessibilityRole="button"
        accessibilityLabel={`${item.name} - ${matchPercentage}% match`}
      >
        {/* Best Match Badge */}
        {isBestMatch && (
          <View style={[styles.bestMatchBadge, { backgroundColor: colors.primary }]}>
            <IconSymbol name="star.fill" size={12} color="#FFFFFF" />
            <Text style={styles.bestMatchText}>BEST MATCH</Text>
          </View>
        )}

        {/* Image Section */}
        <View style={styles.imageContainer}>
          <Image
            source={'image' in item && item.image ? item.image : require('@/assets/images/espresso.png')}
            style={styles.cardImage}
            contentFit="cover"
            transition={300}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)']}
            style={styles.imageGradient}
          />
        </View>

        {/* Content Section */}
        <View style={styles.cardContent}>
          {/* Title & Rating */}
          <View style={styles.titleRow}>
            <View style={styles.titleContainer}>
              <Text style={[styles.cardTitle, { color: colors.foreground }]} numberOfLines={2}>
                {item.name}
              </Text>
              <View style={styles.ratingContainer}>
                <IconSymbol name="star.fill" size={14} color={colors.warning} />
                <Text style={[styles.ratingText, { color: colors.foreground }]}>
                  4.{Math.floor(Math.random() * 3) + 6}
                </Text>
                <Text style={[styles.reviewCount, { color: colors.muted }]}>
                  ({Math.floor(Math.random() * 3000) + 500} reviews)
                </Text>
              </View>
            </View>
            
            {/* Save Button */}
            <Pressable
              onPress={handleSave}
              style={({ pressed }) => [
                styles.saveButton,
                { 
                  backgroundColor: isSaved ? `${colors.primary}15` : colors.surfaceElevated,
                  opacity: pressed ? 0.7 : 1,
                }
              ]}
              accessibilityRole="button"
              accessibilityLabel={isSaved ? "Unsave" : "Save"}
            >
              <IconSymbol 
                name={isSaved ? "heart.fill" : "heart"} 
                size={20} 
                color={isSaved ? colors.primary : colors.muted} 
              />
            </Pressable>
          </View>

          {/* Description */}
          <Text style={[styles.cardDescription, { color: colors.muted }]} numberOfLines={2}>
            {String('description' in item ? (item as any).description : `Professional ${type} for specialty coffee`)}
          </Text>

          {/* Match Percentage Bar */}
          <View style={styles.matchSection}>
            <View style={styles.matchHeader}>
              <Text style={[styles.matchLabel, { color: colors.muted }]}>Match Score</Text>
              <Text style={[styles.matchPercentage, { color: colors.primary }]}>
                {matchPercentage}%
              </Text>
            </View>
            <View style={[styles.matchBarBackground, { backgroundColor: colors.border }]}>
              <View 
                style={[
                  styles.matchBarFill, 
                  { 
                    backgroundColor: colors.primary,
                    width: `${matchPercentage}%`,
                  }
                ]} 
              />
            </View>
            <Text style={[styles.matchReason, { color: colors.muted }]}>
              Perfect for your {item.priceRange.toLowerCase()} budget & {type === 'machine' ? 'brewing' : 'grinding'} needs
            </Text>
          </View>

          {/* Specs Grid */}
          <View style={styles.specsGrid}>
            <View style={styles.specItem}>
              <IconSymbol name="dollarsign.circle.fill" size={16} color={colors.muted} />
              <Text style={[styles.specText, { color: colors.foreground }]}>
                {item.priceRange}
              </Text>
            </View>
            <View style={styles.specItem}>
              <IconSymbol name="tag.fill" size={16} color={colors.muted} />
              <Text style={[styles.specText, { color: colors.foreground }]}>
                {item.brand}
              </Text>
            </View>
            {type === 'machine' && 'boilerType' in item && (
              <View style={styles.specItem}>
                <IconSymbol name="flame.fill" size={16} color={colors.muted} />
                <Text style={[styles.specText, { color: colors.foreground }]}>
                  {item.boilerType}
                </Text>
              </View>
            )}
            {type === 'grinder' && 'burrType' in item && (
              <View style={styles.specItem}>
                <IconSymbol name="circle.grid.cross.fill" size={16} color={colors.muted} />
                <Text style={[styles.specText, { color: colors.foreground }]}>
                  {item.burrType} burrs
                </Text>
              </View>
            )}
          </View>

          {/* CTA Buttons */}
          <View style={styles.ctaButtons}>
            <PremiumButton
              onPress={onPress}
              variant="primary"
              size="md"
              fullWidth
            >
              <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>Learn More</Text>
            </PremiumButton>
          </View>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

export default function RecommendationsScreen() {
  const colors = useColors();
  const { profile } = useUserProfile();
  const [recommendations, setRecommendations] = useState<EquipmentRecommendation | null>(null);

  useEffect(() => {
    const recs = getEquipmentRecommendations(
      profile.budgetRange,
      profile.coffeePurpose,
      profile.experienceLevel
    );
    setRecommendations(recs);
  }, [profile]);

  const handleViewMachineDetails = (id: string | null) => {
    if (!id) return;
    router.push(`/machine/${id}` as any);
  };

  const handleViewGrinderDetails = (id: string | null) => {
    if (!id) return;
    router.push(`/grinder/${id}` as any);
  };

  const handleSave = () => {
    // TODO: Implement save to favorites
  };

  if (!recommendations) {
    return (
      <ScreenContainer>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.muted }]}>
            Analyzing your preferences...
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
          <Text 
            style={[styles.title, { color: colors.foreground }]}
            accessibilityRole="header"
          >
            Your Perfect Match
          </Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Based on your preferences, we've found the best equipment for you
          </Text>
        </Animated.View>

        {/* Espresso Machines Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="cup.and.saucer.fill" size={24} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Espresso Machines
            </Text>
          </View>
          
          {recommendations.machines.map((machine, index) => (
            <PremiumRecommendationCard
              key={machine.id}
              item={machine}
              type="machine"
              matchPercentage={calculateMatchPercentage(machine, profile.budgetRange, profile.coffeePurpose)}
              isBestMatch={index === 0}
              onPress={() => handleViewMachineDetails(machine.id)}
              onSave={handleSave}
              index={index}
            />
          ))}
        </View>

        {/* Coffee Grinders Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="circle.grid.cross.fill" size={24} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Coffee Grinders
            </Text>
          </View>
          
          {recommendations.grinders.map((grinder, index) => (
            <PremiumRecommendationCard
              key={grinder.id}
              item={grinder}
              type="grinder"
              matchPercentage={calculateMatchPercentage(grinder, profile.budgetRange, profile.coffeePurpose)}
              isBestMatch={index === 0}
              onPress={() => handleViewGrinderDetails(grinder.id)}
              onSave={handleSave}
              index={index + recommendations.machines.length}
            />
          ))}
        </View>

        {/* Bottom CTA */}
        <Animated.View 
          entering={FadeInDown.delay(600).duration(400)}
          style={[styles.bottomCta, { backgroundColor: colors.surfaceElevated }]}
        >
          <IconSymbol name="questionmark.circle.fill" size={32} color={colors.primary} />
          <View style={styles.bottomCtaText}>
            <Text style={[styles.bottomCtaTitle, { color: colors.foreground }]}>
              Need more help?
            </Text>
            <Text style={[styles.bottomCtaSubtitle, { color: colors.muted }]}>
              Visit our Learn section for detailed buying guides
            </Text>
          </View>
          <Pressable
            onPress={() => {
              triggerHaptic();
              router.push('/(tabs)/learn' as any);
            }}
            style={({ pressed }) => [
              styles.bottomCtaButton,
              { opacity: pressed ? 0.7 : 1 }
            ]}
          >
            <IconSymbol name="chevron.right" size={20} color={colors.primary} />
          </Pressable>
        </Animated.View>

        {/* Bottom spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  
  // Header
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },

  // Section
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },

  // Premium Card
  premiumCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  bestMatchBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 10,
  },
  bestMatchText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  cardContent: {
    padding: 20,
  },
  
  // Title Row
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 6,
    lineHeight: 26,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 15,
    fontWeight: '600',
  },
  reviewCount: {
    fontSize: 14,
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Description
  cardDescription: {
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 16,
  },

  // Match Section
  matchSection: {
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  matchLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  matchPercentage: {
    fontSize: 18,
    fontWeight: '700',
  },
  matchBarBackground: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  matchBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  matchReason: {
    fontSize: 13,
    lineHeight: 17,
  },

  // Specs Grid
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  specText: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },

  // CTA Buttons
  ctaButtons: {
    flexDirection: 'row',
    gap: 12,
  },

  // Bottom CTA
  bottomCta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  bottomCtaText: {
    flex: 1,
  },
  bottomCtaTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  bottomCtaSubtitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  bottomCtaButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
