import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Linking } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { ScreenContainer } from '@/components/screen-container';
import { PremiumButton } from '@/components/ui/premium-button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { useUserProfile } from '@/lib/user-profile';
import { getEquipmentRecommendations, EquipmentRecommendation } from '@/lib/equipment-recommender';
import { EspressoMachine, CoffeeGrinder } from '@/data/machines';

export default function RecommendationsScreen() {
  const colors = useColors();
  const { profile } = useUserProfile();
  const [recommendations, setRecommendations] = useState<EquipmentRecommendation | null>(null);
  const [expandedMachine, setExpandedMachine] = useState<string | null>(null);
  const [expandedGrinder, setExpandedGrinder] = useState<string | null>(null);

  useEffect(() => {
    const recs = getEquipmentRecommendations(
      profile.budgetRange,
      profile.coffeePurpose,
      profile.experienceLevel
    );
    setRecommendations(recs);
  }, [profile]);

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleMachinePress = (id: string) => {
    triggerHaptic();
    setExpandedMachine(expandedMachine === id ? null : id);
  };

  const handleGrinderPress = (id: string) => {
    triggerHaptic();
    setExpandedGrinder(expandedGrinder === id ? null : id);
  };

  const handleViewMachineDetails = (id: string) => {
    triggerHaptic();
    router.push(`/machine/${id}` as any);
  };

  const handleViewGrinderDetails = (id: string) => {
    triggerHaptic();
    router.push(`/grinder/${id}` as any);
  };

  if (!recommendations) {
    return (
      <ScreenContainer>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.muted }]}>
            Loading recommendations...
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
            Your Recommendations
          </Text>
        </Animated.View>

        {/* Reasoning Card */}
        <Animated.View 
          entering={FadeInDown.delay(100).duration(400)}
          style={[styles.reasoningCard, { backgroundColor: colors.surface }]}
        >
          <IconSymbol name="info.circle.fill" size={24} color={colors.primary} />
          <Text style={[styles.reasoningText, { color: colors.foreground }]}>
            {recommendations.reasoning}
          </Text>
        </Animated.View>

        {/* Machines Section */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Recommended Machines
          </Text>
          <View style={styles.cardsContainer}>
            {recommendations.machines.map((machine, index) => (
              <MachineCard
                key={machine.id}
                machine={machine}
                colors={colors}
                isExpanded={expandedMachine === machine.id}
                onPress={() => handleMachinePress(machine.id)}
                onViewDetails={() => handleViewMachineDetails(machine.id)}
                delay={index * 50}
              />
            ))}
          </View>
        </Animated.View>

        {/* Grinders Section */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Recommended Grinders
          </Text>
          <View style={styles.cardsContainer}>
            {recommendations.grinders.map((grinder, index) => (
              <GrinderCard
                key={grinder.id}
                grinder={grinder}
                colors={colors}
                isExpanded={expandedGrinder === grinder.id}
                onPress={() => handleGrinderPress(grinder.id)}
                onViewDetails={() => handleViewGrinderDetails(grinder.id)}
                delay={index * 50}
              />
            ))}
          </View>
        </Animated.View>

        {/* Tips Section */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Pro Tips
          </Text>
          <View style={[styles.tipsCard, { backgroundColor: colors.surface }]}>
            {recommendations.tips.map((tip, index) => (
              <View key={index} style={styles.tipRow}>
                <IconSymbol name="checkmark.circle.fill" size={20} color={colors.success} />
                <Text style={[styles.tipText, { color: colors.foreground }]}>
                  {tip}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* CTA */}
        <Animated.View 
          entering={FadeInDown.delay(500).duration(400)}
          style={styles.ctaContainer}
        >
          <PremiumButton
            variant="primary"
            size="lg"
            onPress={() => router.push('/(tabs)')}
            fullWidth
          >
            Start Brewing
          </PremiumButton>
          <Text style={[styles.ctaSubtext, { color: colors.muted }]}>
            You can always revisit recommendations in Setup tab
          </Text>
        </Animated.View>
      </ScrollView>
    </ScreenContainer>
  );
}

// Machine Card Component
function MachineCard({
  machine,
  colors,
  isExpanded,
  onPress,
  onViewDetails,
  delay,
}: {
  machine: EspressoMachine;
  colors: ReturnType<typeof useColors>;
  isExpanded: boolean;
  onPress: () => void;
  onViewDetails: () => void;
  delay: number;
}) {
  const getPriceLabel = (range: string) => {
    switch (range) {
      case 'budget': return '$100-300';
      case 'mid-range': return '$300-700';
      case 'premium': return '$700-1,500';
      case 'prosumer': return '$1,500+';
      default: return range;
    }
  };

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(300)}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          { 
            backgroundColor: colors.surface,
            borderColor: colors.border,
            opacity: pressed ? 0.9 : 1,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={`${machine.brand} ${machine.name}`}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Text style={[styles.cardBrand, { color: colors.muted }]}>
              {machine.brand}
            </Text>
            <Text style={[styles.cardName, { color: colors.foreground }]}>
              {machine.name}
            </Text>
          </View>
          <View style={[styles.priceTag, { backgroundColor: `${colors.primary}15` }]}>
            <Text style={[styles.priceText, { color: colors.primary }]}>
              {getPriceLabel(machine.priceRange)}
            </Text>
          </View>
        </View>

        <View style={styles.cardSpecs}>
          <View style={styles.specItem}>
            <IconSymbol name="thermometer" size={16} color={colors.muted} />
            <Text style={[styles.specText, { color: colors.muted }]}>
              {machine.boilerType.replace('-', ' ')}
            </Text>
          </View>
          <View style={styles.specItem}>
            <IconSymbol name="gauge" size={16} color={colors.muted} />
            <Text style={[styles.specText, { color: colors.muted }]}>
              {machine.pumpPressure} bar
            </Text>
          </View>
          <View style={styles.specItem}>
            <IconSymbol name="drop.fill" size={16} color={colors.muted} />
            <Text style={[styles.specText, { color: colors.muted }]}>
              {machine.waterTankMl}ml
            </Text>
          </View>
        </View>

        {isExpanded && (
          <Animated.View 
            entering={FadeIn.duration(200)}
            style={styles.expandedContent}
          >
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Text style={[styles.expandedLabel, { color: colors.muted }]}>
              Key Features
            </Text>
            <View style={styles.tipsList}>
              {machine.tips.slice(0, 2).map((tip, idx) => (
                <Text key={idx} style={[styles.expandedTip, { color: colors.foreground }]}>
                  • {tip}
                </Text>
              ))}
            </View>
            <PremiumButton
              variant="outline"
              size="sm"
              onPress={onViewDetails}
            >
              View Full Details
            </PremiumButton>
          </Animated.View>
        )}

        <View style={styles.expandIndicator}>
          <IconSymbol 
            name={isExpanded ? "chevron.up" : "chevron.down"} 
            size={20} 
            color={colors.muted} 
          />
        </View>
      </Pressable>
    </Animated.View>
  );
}

// Grinder Card Component
function GrinderCard({
  grinder,
  colors,
  isExpanded,
  onPress,
  onViewDetails,
  delay,
}: {
  grinder: CoffeeGrinder;
  colors: ReturnType<typeof useColors>;
  isExpanded: boolean;
  onPress: () => void;
  onViewDetails: () => void;
  delay: number;
}) {
  const getPriceLabel = (range: string) => {
    switch (range) {
      case 'budget': return '$50-150';
      case 'mid-range': return '$150-400';
      case 'premium': return '$400-800';
      case 'prosumer': return '$800+';
      default: return range;
    }
  };

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(300)}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          { 
            backgroundColor: colors.surface,
            borderColor: colors.border,
            opacity: pressed ? 0.9 : 1,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={`${grinder.brand} ${grinder.name}`}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Text style={[styles.cardBrand, { color: colors.muted }]}>
              {grinder.brand}
            </Text>
            <Text style={[styles.cardName, { color: colors.foreground }]}>
              {grinder.name}
            </Text>
          </View>
          <View style={[styles.priceTag, { backgroundColor: `${colors.primary}15` }]}>
            <Text style={[styles.priceText, { color: colors.primary }]}>
              {getPriceLabel(grinder.priceRange)}
            </Text>
          </View>
        </View>

        <View style={styles.cardSpecs}>
          <View style={styles.specItem}>
            <IconSymbol name="gearshape.fill" size={16} color={colors.muted} />
            <Text style={[styles.specText, { color: colors.muted }]}>
              {grinder.type}
            </Text>
          </View>
          <View style={styles.specItem}>
            <IconSymbol name="dial.low.fill" size={16} color={colors.muted} />
            <Text style={[styles.specText, { color: colors.muted }]}>
              {grinder.burrSize}mm {grinder.burrType}
            </Text>
          </View>
        </View>

        {isExpanded && (
          <Animated.View 
            entering={FadeIn.duration(200)}
            style={styles.expandedContent}
          >
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Text style={[styles.expandedLabel, { color: colors.muted }]}>
              Espresso Range
            </Text>
            <Text style={[styles.expandedTip, { color: colors.foreground }]}>
              {grinder.espressoRange.note}
            </Text>
            <View style={styles.tipsList}>
              {grinder.tips.slice(0, 2).map((tip, idx) => (
                <Text key={idx} style={[styles.expandedTip, { color: colors.foreground }]}>
                  • {tip}
                </Text>
              ))}
            </View>
            <PremiumButton
              variant="outline"
              size="sm"
              onPress={onViewDetails}
            >
              View Full Details
            </PremiumButton>
          </Animated.View>
        )}

        <View style={styles.expandIndicator}>
          <IconSymbol 
            name={isExpanded ? "chevron.up" : "chevron.down"} 
            size={20} 
            color={colors.muted} 
          />
        </View>
      </Pressable>
    </Animated.View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
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
  reasoningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 16,
    gap: 12,
    marginBottom: 24,
  },
  reasoningText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  cardsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardBrand: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 2,
  },
  cardName: {
    fontSize: 18,
    fontWeight: '700',
  },
  priceTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priceText: {
    fontSize: 13,
    fontWeight: '600',
  },
  cardSpecs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  specText: {
    fontSize: 13,
    textTransform: 'capitalize',
  },
  expandedContent: {
    marginTop: 12,
    gap: 8,
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  expandedLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tipsList: {
    gap: 4,
    marginBottom: 12,
  },
  expandedTip: {
    fontSize: 14,
    lineHeight: 20,
  },
  expandIndicator: {
    alignItems: 'center',
    marginTop: 8,
  },
  tipsCard: {
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 24,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  ctaContainer: {
    alignItems: 'center',
    gap: 12,
    paddingTop: 8,
  },
  ctaSubtext: {
    fontSize: 13,
    textAlign: 'center',
  },
});
