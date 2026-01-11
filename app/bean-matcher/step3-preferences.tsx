import { useState, useMemo } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Linking } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

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

type FlavorPreference = 'chocolate-nutty' | 'fruity-bright' | 'balanced' | 'bold-strong';

interface FlavorOption {
  id: FlavorPreference;
  name: string;
  description: string;
  icon: string;
}

const FLAVOR_OPTIONS: FlavorOption[] = [
  { id: 'chocolate-nutty', name: 'Chocolate & Nutty', description: 'Rich, comforting, classic', icon: '🍫' },
  { id: 'fruity-bright', name: 'Fruity & Bright', description: 'Vibrant, complex, exciting', icon: '🍓' },
  { id: 'balanced', name: 'Balanced', description: 'Smooth, versatile, easy-drinking', icon: '⚖️' },
  { id: 'bold-strong', name: 'Bold & Strong', description: 'Intense, full-bodied, powerful', icon: '💪' },
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

  if (showResults) {
    return (
      <ScreenContainer>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Pressable onPress={() => setShowResults(false)} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={[styles.title, { color: colors.foreground }]}>Your Matches</Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>Based on your equipment</Text>
          </View>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Equipment Summary */}
          <Animated.View 
            entering={FadeIn.duration(400)}
            style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Text style={[styles.summaryTitle, { color: colors.foreground }]}>Your Setup</Text>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.muted }]}>Brewing:</Text>
              <Text style={[styles.summaryValue, { color: colors.foreground }]}>
                {machine?.name || params.method?.replace('-', ' ') || 'Espresso Machine'}
              </Text>
            </View>
            {grinder && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.muted }]}>Grinder:</Text>
                <Text style={[styles.summaryValue, { color: colors.foreground }]}>{grinder.name}</Text>
              </View>
            )}
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.muted }]}>Preference:</Text>
              <Text style={[styles.summaryValue, { color: colors.foreground }]}>
                {FLAVOR_OPTIONS.find(f => f.id === selectedFlavor)?.name || 'Any'}
              </Text>
            </View>
          </Animated.View>

          {/* Recommendations */}
          <Text style={[styles.resultsTitle, { color: colors.foreground }]}>
            Top {recommendations.length} Recommendations
          </Text>

          {recommendations.map((match, index) => (
            <Animated.View 
              key={match.bean.id}
              entering={FadeInDown.delay(index * 100).duration(400)}
            >
              <View style={[styles.beanCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.beanHeader}>
                  <Image
                    source={match.bean.image}
                    style={styles.beanImage}
                    contentFit="cover"
                  />
                  <View style={styles.beanInfo}>
                    <View style={styles.matchBadge}>
                      <Text style={[styles.matchScore, { color: colors.primary }]}>
                        {match.matchScore}% Match
                      </Text>
                    </View>
                    <Text style={[styles.beanName, { color: colors.foreground }]}>
                      {match.bean.name}
                    </Text>
                    <Text style={[styles.beanRoaster, { color: colors.muted }]}>
                      {match.bean.roaster}
                    </Text>
                    <Text style={[styles.beanPrice, { color: colors.primary }]}>
                      ${match.bean.price.toFixed(2)} / {match.bean.weight}g
                    </Text>
                  </View>
                </View>

                <View style={styles.flavorNotes}>
                  {match.bean.flavorNotes.slice(0, 3).map((note, i) => (
                    <View key={i} style={[styles.flavorTag, { backgroundColor: colors.primary + '15' }]}>
                      <Text style={[styles.flavorTagText, { color: colors.primary }]}>{note}</Text>
                    </View>
                  ))}
                </View>

                {match.matchReasons.length > 0 && (
                  <View style={styles.reasonsSection}>
                    <Text style={[styles.reasonsTitle, { color: colors.foreground }]}>Why it's a match:</Text>
                    {match.matchReasons.slice(0, 2).map((reason, i) => (
                      <View key={i} style={styles.reasonRow}>
                        <IconSymbol name="checkmark.circle.fill" size={16} color={colors.success} />
                        <Text style={[styles.reasonText, { color: colors.muted }]}>{reason}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {match.brewTips.length > 0 && (
                  <View style={[styles.tipsSection, { backgroundColor: colors.warning + '10' }]}>
                    <Text style={[styles.tipsTitle, { color: colors.warning }]}>💡 Brew Tips</Text>
                    {match.brewTips.slice(0, 2).map((tip, i) => (
                      <Text key={i} style={[styles.tipText, { color: colors.muted }]}>• {tip}</Text>
                    ))}
                  </View>
                )}

                <Pressable
                  onPress={() => handleBuyBean(match.bean.affiliateUrl)}
                  style={({ pressed }) => [
                    styles.buyButton,
                    { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 }
                  ]}
                >
                  <Text style={styles.buyButtonText}>Buy from {match.bean.roaster}</Text>
                  <IconSymbol name="arrow.up.right" size={16} color="#FFF" />
                </Pressable>
              </View>
            </Animated.View>
          ))}

          <View style={{ height: 40 }} />
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={[styles.title, { color: colors.foreground }]}>Find Your Coffee</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>Step 3 of 3</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(400)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            What flavors do you enjoy?
          </Text>
          <Text style={[styles.sectionDescription, { color: colors.muted }]}>
            Select your preference (optional)
          </Text>
        </Animated.View>

        <View style={styles.flavorGrid}>
          {FLAVOR_OPTIONS.map((flavor, index) => (
            <Animated.View 
              key={flavor.id} 
              entering={FadeInDown.delay(index * 50).duration(300)}
            >
              <Pressable
                onPress={() => handleFlavorSelect(flavor.id)}
                style={({ pressed }) => [
                  styles.flavorCard,
                  {
                    backgroundColor: selectedFlavor === flavor.id ? colors.primary : colors.surface,
                    borderColor: selectedFlavor === flavor.id ? colors.primary : colors.border,
                    opacity: pressed ? 0.8 : 1,
                  }
                ]}
              >
                <Text style={styles.flavorIcon}>{flavor.icon}</Text>
                <Text style={[
                  styles.flavorName,
                  { color: selectedFlavor === flavor.id ? '#FFF' : colors.foreground }
                ]}>
                  {flavor.name}
                </Text>
                <Text style={[
                  styles.flavorDescription,
                  { color: selectedFlavor === flavor.id ? 'rgba(255,255,255,0.8)' : colors.muted }
                ]}>
                  {flavor.description}
                </Text>
              </Pressable>
            </Animated.View>
          ))}
        </View>

        <Pressable
          onPress={() => { setSelectedFlavor(null); }}
          style={({ pressed }) => [
            styles.skipButton,
            { opacity: pressed ? 0.7 : 1 }
          ]}
        >
          <Text style={[styles.skipButtonText, { color: colors.muted }]}>
            Skip - Show all recommendations
          </Text>
        </Pressable>

        <View style={{ height: 120 }} />
      </ScrollView>

      <Animated.View 
        entering={FadeIn.duration(300)}
        style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}
      >
        <Pressable
          onPress={handleGetRecommendations}
          style={({ pressed }) => [
            styles.continueButton,
            { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 }
          ]}
        >
          <IconSymbol name="sparkles" size={20} color="#FFF" />
          <Text style={styles.continueButtonText}>Get Recommendations</Text>
        </Pressable>
      </Animated.View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  backButton: { padding: 8 },
  headerCenter: { flex: 1, alignItems: 'center' },
  title: { fontSize: 17, fontWeight: '600' },
  subtitle: { fontSize: 13, marginTop: 2 },
  placeholder: { width: 40 },
  content: { padding: 20 },
  sectionTitle: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  sectionDescription: { fontSize: 15, marginBottom: 20 },
  flavorGrid: { gap: 12 },
  flavorCard: { padding: 16, borderRadius: 16, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  flavorIcon: { fontSize: 32 },
  flavorName: { fontSize: 17, fontWeight: '600' },
  flavorDescription: { fontSize: 13, marginTop: 2 },
  skipButton: { alignItems: 'center', padding: 16, marginTop: 16 },
  skipButtonText: { fontSize: 15 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, borderTopWidth: 1 },
  continueButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, gap: 8 },
  continueButtonText: { color: '#FFF', fontSize: 17, fontWeight: '600' },
  // Results styles
  summaryCard: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 24 },
  summaryTitle: { fontSize: 15, fontWeight: '600', marginBottom: 12 },
  summaryRow: { flexDirection: 'row', marginBottom: 6 },
  summaryLabel: { width: 80, fontSize: 14 },
  summaryValue: { flex: 1, fontSize: 14, fontWeight: '500' },
  resultsTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  beanCard: { padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 16 },
  beanHeader: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  beanImage: { width: 80, height: 80, borderRadius: 12 },
  beanInfo: { flex: 1 },
  matchBadge: { marginBottom: 4 },
  matchScore: { fontSize: 13, fontWeight: '700' },
  beanName: { fontSize: 17, fontWeight: '600', marginBottom: 2 },
  beanRoaster: { fontSize: 13, marginBottom: 4 },
  beanPrice: { fontSize: 15, fontWeight: '600' },
  flavorNotes: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  flavorTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  flavorTagText: { fontSize: 12, fontWeight: '500' },
  reasonsSection: { marginBottom: 12 },
  reasonsTitle: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
  reasonRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  reasonText: { fontSize: 13, flex: 1 },
  tipsSection: { padding: 12, borderRadius: 8, marginBottom: 12 },
  tipsTitle: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
  tipText: { fontSize: 13, marginBottom: 2 },
  buyButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 10, gap: 6 },
  buyButtonText: { color: '#FFF', fontSize: 15, fontWeight: '600' },
});
