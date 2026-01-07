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
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
          headerShadowVisible: false,
        }} 
      />
      <ScreenContainer edges={["left", "right", "bottom"]}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
              <IconSymbol name="dial.low.fill" size={48} color={colors.primary} />
            </View>
            <Text style={[styles.brand, { color: colors.muted }]}>{grinder.brand}</Text>
            <Text style={[styles.name, { color: colors.foreground }]}>{grinder.name}</Text>
            <View style={styles.badges}>
              <View style={[styles.badge, { backgroundColor: colors.surface }]}>
                <Text style={[styles.badgeText, { color: colors.foreground }]}>
                  {grinder.type}
                </Text>
              </View>
              <View style={[styles.badge, { backgroundColor: colors.surface }]}>
                <Text style={[styles.badgeText, { color: colors.foreground }]}>
                  {grinder.burrSize}mm {grinder.burrType}
                </Text>
              </View>
            </View>
          </View>

          {/* Espresso Settings */}
          <PremiumCard style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Espresso Settings
            </Text>
            
            <View style={styles.settingsGrid}>
              <View style={[styles.settingCard, { backgroundColor: colors.surfaceElevated }]}>
                <Text style={[styles.settingLabel, { color: colors.muted }]}>Starting Point</Text>
                <Text style={[styles.settingValue, { color: colors.primary }]}>
                  {grinder.espressoRange.startingPoint}
                </Text>
              </View>
              
              <View style={[styles.settingCard, { backgroundColor: colors.surfaceElevated }]}>
                <Text style={[styles.settingLabel, { color: colors.muted }]}>Range</Text>
                <Text style={[styles.settingValue, { color: colors.foreground }]}>
                  {grinder.espressoRange.min} - {grinder.espressoRange.max}
                </Text>
              </View>
            </View>

            {/* Visual Scale */}
            <View style={styles.grindScale}>
              <View style={styles.grindScaleLabels}>
                <Text style={[styles.grindScaleLabel, { color: colors.muted }]}>Finer</Text>
                <Text style={[styles.grindScaleLabel, { color: colors.muted }]}>Coarser</Text>
              </View>
              <View style={[styles.grindScaleBar, { backgroundColor: colors.surfaceElevated }]}>
                <View 
                  style={[
                    styles.grindScaleRange,
                    { 
                      backgroundColor: `${colors.primary}30`,
                      left: `${(grinder.espressoRange.min / 50) * 100}%`,
                      width: `${((grinder.espressoRange.max - grinder.espressoRange.min) / 50) * 100}%`,
                    }
                  ]} 
                />
                <View 
                  style={[
                    styles.grindScaleMarker,
                    { 
                      backgroundColor: colors.primary,
                      left: `${(grinder.espressoRange.startingPoint / 50) * 100}%`,
                    }
                  ]} 
                />
              </View>
            </View>

            <View style={[styles.noteBox, { backgroundColor: colors.surfaceElevated }]}>
              <IconSymbol name="info.circle.fill" size={18} color={colors.primary} />
              <Text style={[styles.noteText, { color: colors.muted }]}>
                {grinder.espressoRange.note}
              </Text>
            </View>
          </PremiumCard>

          {/* Filter Settings */}
          {grinder.filterRange && (
            <PremiumCard style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Filter/Pour-over Settings
              </Text>
              
              <View style={styles.settingsGrid}>
                <View style={[styles.settingCard, { backgroundColor: colors.surfaceElevated }]}>
                  <Text style={[styles.settingLabel, { color: colors.muted }]}>Range</Text>
                  <Text style={[styles.settingValue, { color: colors.foreground }]}>
                    {grinder.filterRange.min} - {grinder.filterRange.max}
                  </Text>
                </View>
              </View>
            </PremiumCard>
          )}

          {/* Tips */}
          <PremiumCard style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Pro Tips
            </Text>
            
            {grinder.tips.map((tip, index) => (
              <View key={index} style={styles.tipRow}>
                <View style={[styles.tipBullet, { backgroundColor: colors.primary }]} />
                <Text style={[styles.tipText, { color: colors.foreground }]}>
                  {tip}
                </Text>
              </View>
            ))}
          </PremiumCard>

          {/* Specifications */}
          <PremiumCard style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Specifications
            </Text>
            
            <InfoRow label="Type" value={grinder.type} />
            <InfoRow label="Burr Type" value={`${grinder.burrSize}mm ${grinder.burrType}`} />
            <InfoRow label="Price Range" value={grinder.priceRange.replace('-', ' ')} />
          </PremiumCard>

          <View style={{ height: 40 }} />
        </ScrollView>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  brand: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  section: {
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  settingsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  settingCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 4,
  },
  settingValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  noteBox: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 10,
    gap: 10,
    alignItems: 'flex-start',
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  grindScale: {
    marginBottom: 16,
  },
  grindScaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  grindScaleLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  grindScaleBar: {
    height: 8,
    borderRadius: 4,
    position: 'relative',
  },
  grindScaleRange: {
    position: 'absolute',
    top: 0,
    height: '100%',
    borderRadius: 4,
  },
  grindScaleMarker: {
    position: 'absolute',
    top: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    marginLeft: -8,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  infoLabel: {
    fontSize: 15,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
