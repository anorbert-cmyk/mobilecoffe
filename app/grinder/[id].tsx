import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { PremiumCard } from '@/components/ui/premium-card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { getGrinderById } from '@/data/machines';

export default function GrinderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const grinder = getGrinderById(id);

  if (!grinder) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center">
        <Text style={{ color: colors.foreground }}>Grinder not found</Text>
      </ScreenContainer>
    );
  }

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: colors.muted }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: colors.foreground }]}>{value}</Text>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: grinder.name,
          headerShown: true,
          headerBackTitle: "Back",
        }}
      />
      <ScreenContainer>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Specifications */}
          <PremiumCard style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Specifications
            </Text>
            
            <InfoRow label="Brand" value={grinder.brand} />
            <InfoRow label="Model" value={grinder.model} />
            <InfoRow label="Type" value={grinder.type.charAt(0).toUpperCase() + grinder.type.slice(1)} />
            <InfoRow label="Burr Type" value={grinder.burrType.charAt(0).toUpperCase() + grinder.burrType.slice(1)} />
            <InfoRow label="Burr Size" value={`${grinder.burrSize}mm`} />
            <InfoRow label="Price Range" value={grinder.priceRange.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} />
            <InfoRow label="Price" value={`$${grinder.price}`} />
            <InfoRow label="Rating" value={`${grinder.rating}/5.0`} />
            <InfoRow label="Grind Settings" value={typeof grinder.grindSettings === 'number' ? String(grinder.grindSettings) : 'Stepless'} />
            <InfoRow label="Retention" value={grinder.retention.charAt(0).toUpperCase() + grinder.retention.slice(1)} />
          </PremiumCard>

          {/* Description */}
          <PremiumCard style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Description
            </Text>
            <Text style={[styles.description, { color: colors.muted }]}>
              {grinder.description}
            </Text>
          </PremiumCard>

          {/* Features */}
          <PremiumCard style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Features
            </Text>
            {grinder.features.map((feature: string, index: number) => (
              <View key={index} style={styles.featureRow}>
                <IconSymbol name="checkmark.circle.fill" size={20} color={colors.success} />
                <Text style={[styles.featureText, { color: colors.foreground }]}>
                  {feature}
                </Text>
              </View>
            ))}
          </PremiumCard>

          {/* Best For */}
          <PremiumCard style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Best For
            </Text>
            {grinder.bestFor.map((use: string, index: number) => (
              <View key={index} style={styles.featureRow}>
                <IconSymbol name="star.fill" size={18} color={colors.primary} />
                <Text style={[styles.featureText, { color: colors.foreground }]}>
                  {use}
                </Text>
              </View>
            ))}
          </PremiumCard>

          {/* Tips */}
          <PremiumCard style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Pro Tips
            </Text>
            {grinder.tips.map((tip: string, index: number) => (
              <View key={index} style={styles.tipRow}>
                <View style={[styles.tipBullet, { backgroundColor: colors.primary }]} />
                <Text style={[styles.tipText, { color: colors.foreground }]}>
                  {tip}
                </Text>
              </View>
            ))}
          </PremiumCard>
        </ScrollView>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 24,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  featureText: {
    fontSize: 15,
    flex: 1,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  tipText: {
    fontSize: 15,
    lineHeight: 24,
    flex: 1,
  },
});
