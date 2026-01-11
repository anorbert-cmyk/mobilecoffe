import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { Breadcrumb } from '@/components/breadcrumb';
import { PremiumCard } from '@/components/ui/premium-card';
import { PremiumButton } from '@/components/ui/premium-button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { getMachineById } from '@/data/machines';

export default function MachineDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const machine = getMachineById(id);

  if (!machine) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center">
        <Text style={{ color: colors.foreground }}>Machine not found</Text>
      </ScreenContainer>
    );
  }

  const InfoRow = ({ label, value, icon }: { label: string; value: string; icon?: string }) => (
    <View style={styles.infoRow}>
      {icon && <IconSymbol name={icon as any} size={20} color={colors.primary} />}
      <View style={styles.infoContent}>
        <Text style={[styles.infoLabel, { color: colors.muted }]}>{label}</Text>
        <Text style={[styles.infoValue, { color: colors.foreground }]}>{value}</Text>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: machine.name,
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
          <Breadcrumb items={[
            { label: 'Home', href: '/' },
            { label: 'Equipment', href: '/recommendations' },
            { label: machine.name }
          ]} />
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
              <IconSymbol name="cup.and.saucer.fill" size={48} color={colors.primary} />
            </View>
            <Text style={[styles.brand, { color: colors.muted }]}>{machine.brand}</Text>
            <Text style={[styles.name, { color: colors.foreground }]}>{machine.name}</Text>
            <View style={styles.badges}>
              <View style={[styles.badge, { backgroundColor: colors.surface }]}>
                <Text style={[styles.badgeText, { color: colors.foreground }]}>
                  {machine.type.replace('-', ' ')}
                </Text>
              </View>
              <View style={[styles.badge, { backgroundColor: colors.surface }]}>
                <Text style={[styles.badgeText, { color: colors.foreground }]}>
                  {machine.boilerType.replace('-', ' ')} boiler
                </Text>
              </View>
            </View>
          </View>

          {/* Optimal Settings */}
          <PremiumCard style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Optimal Settings
            </Text>
            
            <View style={styles.settingsGrid}>
              <View style={[styles.settingCard, { backgroundColor: colors.surfaceElevated }]}>
                <IconSymbol name="thermometer" size={24} color={colors.primary} />
                <Text style={[styles.settingValue, { color: colors.foreground }]}>
                  {machine.brewTemperature.celsius}°C
                </Text>
                <Text style={[styles.settingLabel, { color: colors.muted }]}>
                  Brew Temp
                </Text>
              </View>
              
              <View style={[styles.settingCard, { backgroundColor: colors.surfaceElevated }]}>
                <IconSymbol name="gauge" size={24} color={colors.primary} />
                <Text style={[styles.settingValue, { color: colors.foreground }]}>
                  {machine.pumpPressure} bar
                </Text>
                <Text style={[styles.settingLabel, { color: colors.muted }]}>
                  Pressure
                </Text>
              </View>
              
              <View style={[styles.settingCard, { backgroundColor: colors.surfaceElevated }]}>
                <IconSymbol name="dial.low.fill" size={24} color={colors.primary} />
                <Text style={[styles.settingValue, { color: colors.foreground }]}>
                  {machine.grindSetting.sweet_spot}
                </Text>
                <Text style={[styles.settingLabel, { color: colors.muted }]}>
                  Grind Level
                </Text>
              </View>
              
              {machine.preInfusion?.available && (
                <View style={[styles.settingCard, { backgroundColor: colors.surfaceElevated }]}>
                  <IconSymbol name="drop.fill" size={24} color={colors.primary} />
                  <Text style={[styles.settingValue, { color: colors.foreground }]}>
                    {machine.preInfusion.recommendedSeconds || 3}s
                  </Text>
                  <Text style={[styles.settingLabel, { color: colors.muted }]}>
                    Pre-infusion
                  </Text>
                </View>
              )}
            </View>

            {machine.brewTemperature.note && (
              <View style={[styles.noteBox, { backgroundColor: colors.surfaceElevated }]}>
                <IconSymbol name="info.circle.fill" size={18} color={colors.primary} />
                <Text style={[styles.noteText, { color: colors.muted }]}>
                  {machine.brewTemperature.note}
                </Text>
              </View>
            )}
          </PremiumCard>

          {/* Grind Settings */}
          <PremiumCard style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Grind Settings
            </Text>
            
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
                      left: `${(machine.grindSetting.min / 10) * 100}%`,
                      width: `${((machine.grindSetting.max - machine.grindSetting.min) / 10) * 100}%`,
                    }
                  ]} 
                />
                <View 
                  style={[
                    styles.grindScaleMarker,
                    { 
                      backgroundColor: colors.primary,
                      left: `${(machine.grindSetting.sweet_spot / 10) * 100}%`,
                    }
                  ]} 
                />
              </View>
              <View style={styles.grindScaleNumbers}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                  <Text 
                    key={n} 
                    style={[
                      styles.grindScaleNumber, 
                      { color: n === machine.grindSetting.sweet_spot ? colors.primary : colors.muted }
                    ]}
                  >
                    {n}
                  </Text>
                ))}
              </View>
            </View>

            <View style={[styles.noteBox, { backgroundColor: colors.surfaceElevated }]}>
              <IconSymbol name="info.circle.fill" size={18} color={colors.primary} />
              <Text style={[styles.noteText, { color: colors.muted }]}>
                {machine.grindSetting.note}
              </Text>
            </View>
          </PremiumCard>

          {/* Tips */}
          <PremiumCard style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Pro Tips
            </Text>
            
                {machine.tips.map((tip: string, index: number) => (
              <View key={index} style={styles.tipRow}>
                <View style={[styles.tipBullet, { backgroundColor: colors.primary }]} />
                <Text style={[styles.tipText, { color: colors.foreground }]}>
                  {tip}
                </Text>
              </View>
            ))}
          </PremiumCard>

          {/* Maintenance */}
          <PremiumCard style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Maintenance Schedule
            </Text>
            
            <InfoRow 
              icon="clock.fill"
              label="Group Head Clean" 
              value={machine.maintenance.groupHeadClean} 
            />
            
            {machine.maintenance.backflush && (
              <InfoRow 
                icon="drop.fill"
                label="Backflush" 
                value={machine.maintenance.backflushFrequency || 'Weekly'} 
              />
            )}
            
            <InfoRow 
              icon="wrench.fill"
              label="Descale" 
              value={machine.maintenance.descaleFrequency} 
            />
          </PremiumCard>

          {/* Specifications */}
          <PremiumCard style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Specifications
            </Text>
            
            <InfoRow label="Water Tank" value={`${machine.waterTankMl}ml`} />
            <InfoRow label="Boiler Type" value={machine.boilerType.replace('-', ' ')} />
            <InfoRow label="Pump Pressure" value={`${machine.pumpPressure} bar`} />
            <InfoRow label="Pre-infusion" value={machine.preInfusion?.available ? 'Yes' : 'No'} />
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
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  settingCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 24,
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
    marginBottom: 8,
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
  grindScaleNumbers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  grindScaleNumber: {
    fontSize: 11,
    fontWeight: '500',
    width: 20,
    textAlign: 'center',
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
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
});
