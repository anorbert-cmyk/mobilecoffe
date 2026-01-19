import { useState, useMemo, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Linking, Platform, Dimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  Layout
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { coffeeBeans } from '@/data/beans';
import { espressoMachines, coffeeGrinders } from '@/data/machines';
import {
  matchBeansToEquipment,
  EquipmentProfile,
  BeanMatch
} from '@/lib/bean-matcher/bean-matcher';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type FlavorPreference = 'chocolate-nutty' | 'fruity-bright' | 'balanced' | 'bold-strong';

interface FlavorOption {
  id: FlavorPreference;
  name: string;
  description: string;
  icon: string;
  gradient: [string, string];
}

const FLAVOR_OPTIONS: FlavorOption[] = [
  {
    id: 'chocolate-nutty',
    name: 'Chocolate & Nutty',
    description: 'Rich, comforting, classic profile',
    icon: '🍫',
    gradient: ['#78350F', '#451A03']
  },
  {
    id: 'fruity-bright',
    name: 'Fruity & Bright',
    description: 'Vibrant, complex, exciting acidity',
    icon: '🍓',
    gradient: ['#EC4899', '#BE185D']
  },
  {
    id: 'balanced',
    name: 'Balanced',
    description: 'Smooth, versatile, easy-drinking',
    icon: '⚖️',
    gradient: ['#10B981', '#047857']
  },
  {
    id: 'bold-strong',
    name: 'Bold & Strong',
    description: 'Intense, full-bodied, powerful kick',
    icon: '💪',
    gradient: ['#1F2937', '#000000']
  },
];

export default function BeanMatcherStep3() {
  const colors = useColors();
  const params = useLocalSearchParams<{
    method: string;
    machineId: string;
    grinderId: string;
    hasGrinder: string;
  }>();

  const [selectedFlavor, setSelectedFlavor] = useState<FlavorPreference | null>(null);
  const [showResults, setShowResults] = useState(false);
  const progress = useSharedValue(0.66);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 1000 });
  }, []);

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Get machine and grinder from data
  const machine = useMemo(() =>
    espressoMachines.find(m => m.id === params.machineId),
    [params.machineId]
  );

  const grinder = useMemo(() =>
    coffeeGrinders.find(g => g.id === params.grinderId),
    [params.grinderId]
  );

  // Build equipment profile
  const equipmentProfile: EquipmentProfile = useMemo(() => {
    const methodToType: Record<string, EquipmentProfile['machineType']> = {
      'espresso-machine': machine?.type || 'semi-automatic',
      'pour-over': 'pour-over',
      'french-press': 'french-press',
      'moka-pot': 'moka-pot',
      'aeropress': 'aeropress',
    };

    return {
      machineId: params.machineId || null,
      machineType: methodToType[params.method || 'espresso-machine'] || 'semi-automatic',
      grinderId: params.grinderId || null,
      grinderType: grinder?.type || null,
      burrType: grinder?.burrType || null,
    };
  }, [params, machine, grinder]);

  // Get bean recommendations
  const recommendations: BeanMatch[] = useMemo(() => {
    if (!showResults) return [];

    let filteredBeans = [...coffeeBeans];

    // Filter by flavor preference
    if (selectedFlavor) {
      const flavorKeywords: Record<FlavorPreference, string[]> = {
        'chocolate-nutty': ['chocolate', 'nutty', 'hazelnut', 'cocoa', 'almond', 'caramel'],
        'fruity-bright': ['fruity', 'berry', 'citrus', 'tropical', 'bright', 'apple', 'cherry'],
        'balanced': ['balanced', 'smooth', 'clean', 'mild'],
        'bold-strong': ['bold', 'intense', 'dark', 'smoky', 'tobacco', 'earthy'],
      };

      const keywords = flavorKeywords[selectedFlavor];
      filteredBeans = coffeeBeans.filter(bean =>
        bean.flavorNotes.some(note =>
          keywords.some(kw => note.toLowerCase().includes(kw))
        ) ||
        (selectedFlavor === 'bold-strong' && (bean.roastLevel === 'dark' || bean.roastLevel === 'medium-dark')) ||
        (selectedFlavor === 'balanced' && bean.roastLevel === 'medium')
      );

      // If no matches, use all beans
      if (filteredBeans.length === 0) {
        filteredBeans = coffeeBeans;
      }
    }

    return matchBeansToEquipment(filteredBeans, equipmentProfile, machine, grinder).slice(0, 5);
  }, [showResults, selectedFlavor, equipmentProfile, machine, grinder]);

  const handleFlavorSelect = (flavor: FlavorPreference) => {
    triggerHaptic();
    setSelectedFlavor(flavor);
  };

  const handleGetRecommendations = () => {
    triggerHaptic();
    setShowResults(true);
  };

  const handleBuyBean = (affiliateUrl: string) => {
    triggerHaptic();
    Linking.openURL(affiliateUrl);
  };

  const progressBarAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  if (showResults) {
    return (
      <ScreenContainer>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Pressable onPress={() => setShowResults(false)} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={[styles.title, { color: colors.foreground }]}>Your Matches</Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>Curated just for you</Text>
          </View>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.resultsContent} showsVerticalScrollIndicator={false}>
          {/* Equipment Summary */}
          <Animated.View
            entering={FadeIn.duration(400)}
            style={[styles.summaryCard, { backgroundColor: colors.surface + '80', borderColor: colors.border }]}
          >
            <View style={styles.summaryHeader}>
              <IconSymbol name="slider.horizontal.3" size={20} color={colors.primary} />
              <Text style={[styles.summaryTitle, { color: colors.foreground }]}>Your Configuration</Text>
            </View>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryLabel, { color: colors.muted }]}>Method</Text>
                <Text style={[styles.summaryValue, { color: colors.foreground }]}>
                  {machine?.name || params.method?.replace('-', ' ') || 'Espresso Machine'}
                </Text>
              </View>
              {grinder && (
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: colors.muted }]}>Grinder</Text>
                  <Text style={[styles.summaryValue, { color: colors.foreground }]}>{grinder.name}</Text>
                </View>
              )}
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryLabel, { color: colors.muted }]}>Profile</Text>
                <Text style={[styles.summaryValue, { color: colors.foreground }]}>
                  {FLAVOR_OPTIONS.find(f => f.id === selectedFlavor)?.name || 'Any'}
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Recommendations */}
          <Text style={[styles.resultsSectionTitle, { color: colors.foreground }]}>
            Top Recommendations
          </Text>

          {recommendations.map((match, index) => (
            <Animated.View
              key={match.bean.id}
              entering={FadeInDown.delay(index * 150).duration(600)}
              style={styles.resultItemContainer}
            >
              <View style={[styles.beanCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                {index === 0 && (
                  <View style={[styles.badgeContainer, { backgroundColor: colors.primary }]}>
                    <Text style={styles.badgeText}>BEST MATCH</Text>
                  </View>
                )}

                <View style={styles.beanHeader}>
                  <Image
                    source={match.bean.image}
                    style={styles.beanImage}
                    contentFit="cover"
                  />
                  <View style={styles.beanInfo}>
                    <Text style={[styles.beanRoaster, { color: colors.muted }]}>
                      {match.bean.roaster}
                    </Text>
                    <Text style={[styles.beanName, { color: colors.foreground }]}>
                      {match.bean.name}
                    </Text>

                    <View style={styles.matchScoreContainer}>
                      <View style={[styles.scoreCircle, { borderColor: colors.primary }]}>
                        <Text style={[styles.scoreText, { color: colors.primary }]}>{match.matchScore}</Text>
                      </View>
                      <Text style={[styles.scoreLabel, { color: colors.primary }]}>Match Score</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.flavorNotes}>
                  {match.bean.flavorNotes.slice(0, 3).map((note, i) => (
                    <View key={i} style={[styles.flavorTag, { backgroundColor: colors.background, borderColor: colors.border }]}>
                      <Text style={[styles.flavorTagText, { color: colors.foreground }]}>{note}</Text>
                    </View>
                  ))}
                </View>

                {match.matchReasons.length > 0 && (
                  <View style={[styles.reasonsSection, { backgroundColor: colors.background + '80' }]}>
                    <Text style={[styles.reasonsTitle, { color: colors.foreground }]}>Why it works:</Text>
                    {match.matchReasons.slice(0, 2).map((reason, i) => (
                      <View key={i} style={styles.reasonRow}>
                        <IconSymbol name="checkmark.circle.fill" size={16} color={colors.success} />
                        <Text style={[styles.reasonText, { color: colors.muted }]}>{reason}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <View style={styles.cardFooter}>
                  <View>
                    <Text style={[styles.priceLabel, { color: colors.muted }]}>Price</Text>
                    <Text style={[styles.beanPrice, { color: colors.foreground }]}>
                      ${match.bean.price.toFixed(2)}
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => handleBuyBean(match.bean.affiliateUrl)}
                    style={({ pressed }) => [
                      styles.buyButton,
                      { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 }
                    ]}
                  >
                    <Text style={styles.buyButtonText}>Get It</Text>
                    <IconSymbol name="arrow.up.right" size={16} color="#FFF" />
                  </Pressable>
                </View>
              </View>
            </Animated.View>
          ))}

          <View style={{ height: 40 }} />

          <Pressable onPress={() => router.push('/(tabs)/find')} style={styles.secondaryAction}>
            <Text style={[styles.secondaryActionText, { color: colors.muted }]}>Browse all coffees</Text>
          </Pressable>

          <View style={{ height: 60 }} />
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerTop}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
          </Pressable>
          <View style={styles.stepIndicator}>
            <Text style={[styles.stepText, { color: colors.muted }]}>Step 3 of 3</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
        <View style={[styles.progressBarContainer, { backgroundColor: colors.border }]}>
          <Animated.View style={[styles.progressBar, progressBarAnimatedStyle, { backgroundColor: colors.primary }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(400)}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            What flavors do you enjoy?
          </Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            We'll filter the perfect beans for your palate.
          </Text>
        </Animated.View>

        <View style={styles.flavorGrid}>
          {FLAVOR_OPTIONS.map((flavor, index) => (
            <Animated.View
              key={flavor.id}
              entering={FadeInDown.delay(index * 100).duration(500)}
            >
              <Pressable
                onPress={() => handleFlavorSelect(flavor.id)}
                style={({ pressed }) => [
                  styles.flavorCard,
                  {
                    backgroundColor: selectedFlavor === flavor.id ? colors.surface : colors.background,
                    borderColor: selectedFlavor === flavor.id ? colors.primary : colors.border,
                    borderWidth: selectedFlavor === flavor.id ? 2 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  }
                ]}
              >
                <View style={[
                  styles.flavorIconContainer,
                  selectedFlavor === flavor.id && { backgroundColor: flavor.gradient[0] + '20' }
                ]}>
                  <Text style={styles.flavorIcon}>{flavor.icon}</Text>
                </View>

                <View style={styles.flavorInfo}>
                  <Text style={[
                    styles.flavorName,
                    { color: selectedFlavor === flavor.id ? colors.primary : colors.foreground }
                  ]}>
                    {flavor.name}
                  </Text>
                  <Text style={[
                    styles.flavorDescription,
                    { color: colors.muted }
                  ]}>
                    {flavor.description}
                  </Text>
                </View>

                {selectedFlavor === flavor.id && (
                  <View style={[styles.checkCircle, { backgroundColor: colors.primary }]}>
                    <IconSymbol name="checkmark" size={14} color="#FFF" />
                  </View>
                )}
              </Pressable>
            </Animated.View>
          ))}
        </View>

        <Pressable
          onPress={() => { triggerHaptic(); setSelectedFlavor(null); setShowResults(true); }}
          style={({ pressed }) => [
            styles.skipButton,
            { opacity: pressed ? 0.7 : 1 }
          ]}
        >
          <Text style={[styles.skipButtonText, { color: colors.muted }]}>
            Skip and show all matches
          </Text>
        </Pressable>

        <View style={{ height: 120 }} />
      </ScrollView>

      {selectedFlavor && (
        <Animated.View
          entering={FadeInDown.duration(300)}
          style={styles.fabContainer}
        >
          <Pressable
            onPress={handleGetRecommendations}
            style={({ pressed }) => [
              styles.fab,
              { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 }
            ]}
          >
            <IconSymbol name="sparkles" size={20} color="#FFF" />
            <Text style={styles.fabText}>Reveal Matches</Text>
          </Pressable>
        </Animated.View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 10, width: '100%' },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 16 },
  backButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  stepIndicator: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.05)' },
  stepText: { fontSize: 13, fontWeight: '600' },
  progressBarContainer: { height: 4, width: '100%', overflow: 'hidden' },
  progressBar: { height: '100%' },
  content: { padding: 24 },
  title: { fontSize: 32, fontWeight: '800', marginBottom: 8, letterSpacing: -0.5 },
  subtitle: { fontSize: 17, lineHeight: 24, marginBottom: 32 },
  placeholder: { width: 40 },

  // Selection Styles
  flavorGrid: { gap: 16 },
  flavorCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  flavorIconContainer: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.03)' },
  flavorIcon: { fontSize: 28 },
  flavorInfo: { flex: 1 },
  flavorName: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  flavorDescription: { fontSize: 14, lineHeight: 20 },
  checkCircle: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  skipButton: { alignItems: 'center', padding: 20, marginTop: 16 },
  skipButtonText: { fontSize: 15, fontWeight: '500' },
  fabContainer: { position: 'absolute', bottom: 40, left: 20, right: 20 },
  fab: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 56, borderRadius: 28, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6, gap: 10 },
  fabText: { color: '#FFF', fontSize: 18, fontWeight: '700' },

  // Results Styles
  resultsContent: { padding: 20 },
  summaryCard: { padding: 20, borderRadius: 20, borderWidth: 1, marginBottom: 32, gap: 16 },
  summaryHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  summaryTitle: { fontSize: 18, fontWeight: '700' },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 24 },
  summaryItem: { minWidth: '40%' },
  summaryLabel: { fontSize: 13, marginBottom: 4, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  summaryValue: { fontSize: 16, fontWeight: '500' },

  resultsSectionTitle: { fontSize: 24, fontWeight: '800', marginBottom: 20 },
  resultItemContainer: { marginBottom: 24 },
  beanCard: { borderRadius: 24, borderWidth: 1, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 16, elevation: 4 },
  badgeContainer: { position: 'absolute', top: 0, right: 0, paddingHorizontal: 12, paddingVertical: 6, borderBottomLeftRadius: 16, zIndex: 10 },
  badgeText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  beanHeader: { padding: 20, flexDirection: 'row', gap: 16 },
  beanImage: { width: 100, height: 100, borderRadius: 16, backgroundColor: '#f0f0f0' },
  beanInfo: { flex: 1, justifyContent: 'center' },
  beanRoaster: { fontSize: 14, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  beanName: { fontSize: 20, fontWeight: '800', lineHeight: 26, marginBottom: 12 },
  matchScoreContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  scoreCircle: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  scoreText: { fontSize: 12, fontWeight: '800' },
  scoreLabel: { fontSize: 13, fontWeight: '600' },

  flavorNotes: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 20, marginBottom: 20 },
  flavorTag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100, borderWidth: 1 },
  flavorTagText: { fontSize: 13, fontWeight: '500' },

  reasonsSection: { padding: 20, gap: 8 },
  reasonsTitle: { fontSize: 14, fontWeight: '700', marginBottom: 4 },
  reasonRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  reasonText: { fontSize: 14, flex: 1, lineHeight: 20 },

  cardFooter: { padding: 20, paddingTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  priceLabel: { fontSize: 12, textTransform: 'uppercase', fontWeight: '600' },
  beanPrice: { fontSize: 20, fontWeight: '700' },
  buyButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14, gap: 8 },
  buyButtonText: { color: '#FFF', fontSize: 15, fontWeight: '700' },

  secondaryAction: { alignItems: 'center', padding: 16 },
  secondaryActionText: { fontSize: 15, fontWeight: '500' },
});
