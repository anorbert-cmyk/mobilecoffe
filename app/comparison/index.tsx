import { View, Text, Pressable, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useComparison } from '@/lib/comparison/comparison-provider';
import { useSubscription } from '@/lib/subscription/subscription-provider';
import { Paywall } from '@/components/subscription/paywall';
import { espressoMachines, coffeeGrinders } from '@/data/machines';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { perplexityService, EquipmentData } from '@/lib/perplexity/perplexity-service';

interface EnhancedComparisonItem {
  id: string;
  type: 'machine' | 'grinder';
  staticData: any;
  liveData: EquipmentData | null;
  isLoading: boolean;
}

export default function ComparisonScreen() {
  const colors = useColors();
  const { items, removeItem, clearAll } = useComparison();
  const { hasAccess } = useSubscription();
  const [enhancedItems, setEnhancedItems] = useState<EnhancedComparisonItem[]>([]);
  const [isLoadingLive, setIsLoadingLive] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Check access
  if (!hasAccess('equipment-comparison')) {
    return (
      <Paywall
        visible={true}
        onClose={() => router.back()}
        feature="equipment-comparison"
        featureName="Equipment Comparison"
        requiredTier="enthusiast"
      />
    );
  }

  // Initialize enhanced items from static data
  useEffect(() => {
    const enhanced = items.map(item => {
      const staticData = item.type === 'machine'
        ? espressoMachines.find((m: any) => m.id === item.id)
        : coffeeGrinders.find((g: any) => g.id === item.id);
      return {
        id: item.id,
        type: item.type,
        staticData,
        liveData: null,
        isLoading: false,
      };
    });
    setEnhancedItems(enhanced);
  }, [items]);

  // Fetch live data from Perplexity
  const fetchLiveData = useCallback(async () => {
    if (enhancedItems.length === 0) return;
    
    setIsLoadingLive(true);
    triggerHaptic();

    try {
      // Fetch comparison data for all items
      const itemNames = enhancedItems.map(item => item.staticData?.name).filter(Boolean);
      const itemType = enhancedItems[0]?.type === 'machine' ? 'espresso-machine' : 'grinder';
      
      const comparisonResult = await perplexityService.compareEquipment(itemNames, itemType);
      
      if (comparisonResult) {
        setAiRecommendation(comparisonResult.recommendation);
        
        // Update items with live data
        setEnhancedItems(prev => prev.map((item, index) => ({
          ...item,
          liveData: comparisonResult.items[index] || null,
          isLoading: false,
        })));
      }
    } catch (error) {
      console.error('Failed to fetch live data:', error);
    } finally {
      setIsLoadingLive(false);
    }
  }, [enhancedItems]);

  if (items.length === 0) {
    return (
      <ScreenContainer>
        <View style={styles.emptyContainer}>
          <IconSymbol name="arrow.left.arrow.right" size={48} color={colors.muted} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No Items to Compare</Text>
          <Text style={[styles.emptyText, { color: colors.muted }]}>
            Add machines or grinders from the recommendations screen to compare them side-by-side.
          </Text>
          <Pressable
            onPress={() => router.push('/recommendations' as any)}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 }
            ]}
          >
            <Text style={styles.buttonText}>Browse Equipment</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Compare Equipment</Text>
        <Pressable 
          onPress={fetchLiveData}
          disabled={isLoadingLive}
          style={({ pressed }) => [styles.refreshButton, { opacity: pressed || isLoadingLive ? 0.5 : 1 }]}
        >
          {isLoadingLive ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <IconSymbol name="arrow.counterclockwise" size={20} color={colors.primary} />
          )}
        </Pressable>
      </View>

      {/* AI Recommendation Banner */}
      {aiRecommendation && (
        <Animated.View 
          entering={FadeIn.duration(400)}
          style={[styles.aiBanner, { backgroundColor: colors.primary + '15', borderColor: colors.primary }]}
        >
          <View style={styles.aiBannerHeader}>
            <IconSymbol name="sparkles" size={20} color={colors.primary} />
            <Text style={[styles.aiBannerTitle, { color: colors.primary }]}>AI Recommendation</Text>
          </View>
          <Text style={[styles.aiBannerText, { color: colors.foreground }]}>{aiRecommendation}</Text>
        </Animated.View>
      )}

      <ScrollView horizontal contentContainerStyle={styles.scrollContent} showsHorizontalScrollIndicator={false}>
        {enhancedItems.map((item, index) => {
          const data = item.staticData;
          const live = item.liveData;
          if (!data) return null;
          
          return (
            <Animated.View 
              key={data.id}
              entering={FadeInDown.delay(index * 100).duration(400)}
            >
              <View style={[styles.column, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Pressable 
                  onPress={() => { triggerHaptic(); removeItem(data.id); }} 
                  style={styles.removeButton}
                >
                  <IconSymbol name="xmark" size={20} color={colors.muted} />
                </Pressable>
                
                <Image source={data.image} style={styles.image} contentFit="contain" />
                <Text style={[styles.name, { color: colors.foreground }]}>{data.name}</Text>
                
                {/* Price with live update indicator */}
                <View style={styles.priceRow}>
                  <Text style={[styles.price, { color: colors.primary }]}>
                    ${live?.currentPrice || data.price}
                  </Text>
                  {live && (
                    <View style={[styles.liveBadge, { backgroundColor: colors.success + '20' }]}>
                      <Text style={[styles.liveBadgeText, { color: colors.success }]}>Live</Text>
                    </View>
                  )}
                </View>
                
                {/* Rating */}
                <View style={styles.ratingRow}>
                  <IconSymbol name="star.fill" size={16} color={colors.warning} />
                  <Text style={[styles.ratingText, { color: colors.foreground }]}>
                    {live?.rating || data.rating}/5
                  </Text>
                  {live?.reviewCount && (
                    <Text style={[styles.reviewCount, { color: colors.muted }]}>
                      ({live.reviewCount.toLocaleString()} reviews)
                    </Text>
                  )}
                </View>
                
                <View style={styles.specs}>
                  {'boilerType' in data && <SpecRow label="Boiler" value={data.boilerType} colors={colors} />}
                  {'pumpPressure' in data && <SpecRow label="Pressure" value={`${data.pumpPressure} bar`} colors={colors} />}
                  {'burrSize' in data && <SpecRow label="Burr Size" value={`${data.burrSize}mm`} colors={colors} />}
                  {'burrType' in data && <SpecRow label="Burr Type" value={data.burrType} colors={colors} />}
                  {'grindSettings' in data && <SpecRow label="Grind Settings" value={String(data.grindSettings)} colors={colors} />}
                  {'retention' in data && <SpecRow label="Retention" value={data.retention} colors={colors} />}
                </View>

                {/* Pros/Cons from live data */}
                {live && (
                  <View style={styles.prosConsSection}>
                    {live.pros.slice(0, 2).map((pro, i) => (
                      <View key={`pro-${i}`} style={styles.proConRow}>
                        <IconSymbol name="checkmark.circle.fill" size={14} color={colors.success} />
                        <Text style={[styles.proConText, { color: colors.muted }]} numberOfLines={2}>{pro}</Text>
                      </View>
                    ))}
                    {live.cons.slice(0, 1).map((con, i) => (
                      <View key={`con-${i}`} style={styles.proConRow}>
                        <IconSymbol name="xmark.circle.fill" size={14} color={colors.error} />
                        <Text style={[styles.proConText, { color: colors.muted }]} numberOfLines={2}>{con}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Last updated */}
                {live?.lastUpdated && (
                  <Text style={[styles.lastUpdated, { color: colors.muted }]}>
                    Updated: {new Date(live.lastUpdated).toLocaleDateString()}
                  </Text>
                )}
              </View>
            </Animated.View>
          );
        })}
      </ScrollView>
      
      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <Pressable 
          onPress={() => { triggerHaptic(); clearAll(); }} 
          style={({ pressed }) => [styles.clearButton, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Text style={[styles.clearText, { color: colors.muted }]}>Clear All</Text>
        </Pressable>
        
        {!aiRecommendation && (
          <Pressable
            onPress={fetchLiveData}
            disabled={isLoadingLive}
            style={({ pressed }) => [
              styles.fetchButton,
              { backgroundColor: colors.primary, opacity: pressed || isLoadingLive ? 0.8 : 1 }
            ]}
          >
            {isLoadingLive ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <>
                <IconSymbol name="sparkles" size={18} color="#FFF" />
                <Text style={styles.fetchButtonText}>Get AI Insights</Text>
              </>
            )}
          </Pressable>
        )}
      </View>
    </ScreenContainer>
  );
}

function SpecRow({ label, value, colors }: { label: string; value: string; colors: any }) {
  return (
    <View style={styles.specRow}>
      <Text style={[styles.specLabel, { color: colors.muted }]}>{label}</Text>
      <Text style={[styles.specValue, { color: colors.foreground }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  backButton: { padding: 8 },
  headerTitle: { flex: 1, fontSize: 17, fontWeight: '600', textAlign: 'center' },
  refreshButton: { padding: 8 },
  aiBanner: { margin: 16, padding: 16, borderRadius: 12, borderWidth: 1 },
  aiBannerHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  aiBannerTitle: { fontSize: 14, fontWeight: '600' },
  aiBannerText: { fontSize: 14, lineHeight: 20 },
  scrollContent: { padding: 16, gap: 16 },
  column: { width: 280, borderRadius: 16, padding: 16, borderWidth: 1 },
  removeButton: { alignSelf: 'flex-end', padding: 8 },
  image: { width: '100%', height: 160, marginBottom: 12 },
  name: { fontSize: 17, fontWeight: '600', marginBottom: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  price: { fontSize: 20, fontWeight: '700' },
  liveBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  liveBadgeText: { fontSize: 11, fontWeight: '600' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 16 },
  ratingText: { fontSize: 14, fontWeight: '600' },
  reviewCount: { fontSize: 12 },
  specs: { gap: 10, marginBottom: 16 },
  specRow: { flexDirection: 'row', justifyContent: 'space-between' },
  specLabel: { fontSize: 13 },
  specValue: { fontSize: 13, fontWeight: '500', textTransform: 'capitalize' },
  prosConsSection: { gap: 6, marginBottom: 12 },
  proConRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  proConText: { fontSize: 12, flex: 1 },
  lastUpdated: { fontSize: 11, textAlign: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderTopWidth: 1 },
  clearButton: { paddingVertical: 12, paddingHorizontal: 16 },
  clearText: { fontSize: 15, fontWeight: '500' },
  fetchButton: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 },
  fetchButtonText: { color: '#FFF', fontSize: 15, fontWeight: '600' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, gap: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '700' },
  emptyText: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
  button: { paddingVertical: 14, paddingHorizontal: 32, borderRadius: 12 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' }
});
