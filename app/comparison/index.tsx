import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useComparison } from '@/lib/comparison/comparison-provider';
import { useSubscription } from '@/lib/subscription/subscription-provider';
import { Paywall } from '@/components/subscription/paywall';
import { espressoMachines, coffeeGrinders } from '@/data/machines';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function ComparisonScreen() {
  const colors = useColors();
  const { items, removeItem, clearAll } = useComparison();
  const { hasAccess } = useSubscription();
  const [showPaywall, setShowPaywall] = useState(false);

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

  const comparisonData = items.map(item => {
    const data = item.type === 'machine' 
      ? espressoMachines.find((m: any) => m.id === item.id)
      : coffeeGrinders.find((g: any) => g.id === item.id);
    return { ...item, data };
  });

  if (items.length === 0) {
    return (
      <ScreenContainer>
        <View style={styles.emptyContainer}>
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
      <ScrollView horizontal contentContainerStyle={styles.scrollContent}>
        {comparisonData.map(({ data }, index) => {
          if (!data) return null;
          return (
            <View key={data.id} style={[styles.column, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Pressable onPress={() => removeItem(data.id)} style={styles.removeButton}>
                <IconSymbol name="xmark" size={20} color={colors.muted} />
              </Pressable>
              
              <Image source={data.image} style={styles.image} contentFit="contain" />
              <Text style={[styles.name, { color: colors.foreground }]}>{data.name}</Text>
              <Text style={[styles.price, { color: colors.primary }]}>${data.price}</Text>
              
              <View style={styles.specs}>
                <SpecRow label="Rating" value={`${data.rating}/5`} colors={colors} />
                {'boilerType' in data && <SpecRow label="Boiler" value={data.boilerType} colors={colors} />}
                {'burrSize' in data && <SpecRow label="Burr Size" value={`${data.burrSize}mm`} colors={colors} />}
                {'burrType' in data && <SpecRow label="Burr Type" value={data.burrType} colors={colors} />}
                {'grindSettings' in data && <SpecRow label="Grind Settings" value={String(data.grindSettings)} colors={colors} />}
              </View>
            </View>
          );
        })}
      </ScrollView>
      
      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <Pressable onPress={clearAll} style={({ pressed }) => [styles.clearButton, { opacity: pressed ? 0.6 : 1 }]}>
          <Text style={[styles.clearText, { color: colors.muted }]}>Clear All</Text>
        </Pressable>
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
  scrollContent: { padding: 16, gap: 16 },
  column: { width: 280, borderRadius: 16, padding: 16, borderWidth: 1 },
  removeButton: { alignSelf: 'flex-end', padding: 8 },
  image: { width: '100%', height: 180, marginBottom: 16 },
  name: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  price: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  specs: { gap: 12 },
  specRow: { flexDirection: 'row', justifyContent: 'space-between' },
  specLabel: { fontSize: 14 },
  specValue: { fontSize: 14, fontWeight: '500' },
  footer: { padding: 16, borderTopWidth: 1 },
  clearButton: { alignItems: 'center', paddingVertical: 12 },
  clearText: { fontSize: 16, fontWeight: '500' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyTitle: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  emptyText: { fontSize: 16, textAlign: 'center', lineHeight: 24, marginBottom: 32 },
  button: { paddingVertical: 14, paddingHorizontal: 32, borderRadius: 12 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' }
});
