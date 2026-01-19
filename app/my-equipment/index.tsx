import { View, Text, Pressable, ScrollView, StyleSheet, Alert , Platform } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { useMyEquipment } from '@/lib/equipment/my-equipment-provider';
import { coffeeBeans } from '@/data/beans';

export default function MyEquipmentScreen() {
  const colors = useColors();
  const { equipment, removeEquipment, getMaintenanceDueItems } = useMyEquipment();

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const maintenanceDue = getMaintenanceDueItems();

  const handleAddEquipment = () => {
    triggerHaptic();
    router.push('/my-equipment/add' as any);
  };

  const handleEquipmentDetail = (id: string) => {
    triggerHaptic();
    router.push(`/my-equipment/${id}` as any);
  };

  const handleRemoveEquipment = (id: string, name: string) => {
    triggerHaptic();
    Alert.alert(
      'Remove Equipment',
      `Remove ${name} from your equipment?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await removeEquipment(id);
          },
        },
      ]
    );
  };

  const getDaysUntilMaintenance = (dueDate: string | null) => {
    if (!dueDate) return null;
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <ScreenContainer>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>My Equipment</Text>
        <Pressable onPress={handleAddEquipment} style={styles.addButton}>
          <IconSymbol name="plus" size={24} color={colors.primary} />
        </Pressable>
      </View>

      {/* Maintenance Alert Banner */}
      {maintenanceDue.length > 0 && (
        <Animated.View
          entering={FadeIn.duration(400)}
          style={[styles.alertBanner, { backgroundColor: colors.warning + '15', borderColor: colors.warning }]}
        >
          <IconSymbol name="exclamationmark.triangle.fill" size={20} color={colors.warning} />
          <View style={styles.alertText}>
            <Text style={[styles.alertTitle, { color: colors.warning }]}>
              Maintenance Due
            </Text>
            <Text style={[styles.alertDescription, { color: colors.foreground }]}>
              {maintenanceDue.length} {maintenanceDue.length === 1 ? 'item needs' : 'items need'} maintenance soon
            </Text>
          </View>
        </Animated.View>
      )}

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {equipment.length === 0 ? (
          <Animated.View entering={FadeIn.duration(400)} style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.surface }]}>
              <IconSymbol name="wrench.and.screwdriver.fill" size={48} color={colors.muted} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              No Equipment Yet
            </Text>
            <Text style={[styles.emptyDescription, { color: colors.muted }]}>
              Add your espresso machine, grinder, or other coffee equipment to track maintenance and get personalized bean recommendations.
            </Text>
            <Pressable
              onPress={handleAddEquipment}
              style={({ pressed }) => [
                styles.addFirstButton,
                { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 }
              ]}
            >
              <IconSymbol name="plus" size={20} color="#FFF" />
              <Text style={styles.addFirstButtonText}>Add Equipment</Text>
            </Pressable>
          </Animated.View>
        ) : (
          <>
            {equipment.map((item, index) => {
              const daysUntilMaintenance = getDaysUntilMaintenance(item.nextMaintenanceDue);
              const isMaintenanceDue = daysUntilMaintenance !== null && daysUntilMaintenance <= 7;
              const favoriteBeansList = item.favoriteBeans
                .map(id => coffeeBeans.find(b => b.id === id))
                .filter(Boolean);

              return (
                <Animated.View
                  key={item.id}
                  entering={FadeInDown.delay(index * 100).duration(400)}
                >
                  <Pressable
                    onPress={() => handleEquipmentDetail(item.id)}
                    style={({ pressed }) => [
                      styles.equipmentCard,
                      {
                        backgroundColor: colors.surface,
                        borderColor: isMaintenanceDue ? colors.warning : colors.border,
                        opacity: pressed ? 0.8 : 1,
                      }
                    ]}
                  >
                    {/* Maintenance Badge */}
                    {isMaintenanceDue && (
                      <View style={[styles.maintenanceBadge, { backgroundColor: colors.warning }]}>
                        <IconSymbol name="wrench.fill" size={12} color="#FFF" />
                        <Text style={styles.maintenanceBadgeText}>
                          {daysUntilMaintenance === 0 ? 'Due Today' : `${daysUntilMaintenance}d`}
                        </Text>
                      </View>
                    )}

                    <View style={styles.equipmentHeader}>
                      <Image source={item.image} style={styles.equipmentImage} contentFit="contain" />
                      <View style={styles.equipmentInfo}>
                        <Text style={[styles.equipmentName, { color: colors.foreground }]}>
                          {item.name}
                        </Text>
                        <Text style={[styles.equipmentBrand, { color: colors.muted }]}>
                          {item.brand}
                        </Text>
                        <View style={styles.equipmentMeta}>
                          <View style={[styles.typeBadge, { backgroundColor: colors.primary + '20' }]}>
                            <Text style={[styles.typeBadgeText, { color: colors.primary }]}>
                              {item.type === 'machine' ? 'Machine' : 'Grinder'}
                            </Text>
                          </View>
                          {item.isCustom && (
                            <View style={[styles.customBadge, { backgroundColor: colors.muted + '20' }]}>
                              <Text style={[styles.customBadgeText, { color: colors.muted }]}>
                                Custom
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>

                      <Pressable
                        onPress={() => handleRemoveEquipment(item.id, item.name)}
                        style={styles.removeButton}
                      >
                        <IconSymbol name="trash.fill" size={18} color={colors.error} />
                      </Pressable>
                    </View>

                    {/* Favorite Beans */}
                    {favoriteBeansList.length > 0 && (
                      <View style={styles.favoriteBeans}>
                        <View style={styles.favoriteBeansHeader}>
                          <IconSymbol name="heart.fill" size={14} color={colors.error} />
                          <Text style={[styles.favoriteBeansTitle, { color: colors.muted }]}>
                            Favorite Beans ({favoriteBeansList.length})
                          </Text>
                        </View>
                        <View style={styles.beansList}>
                          {favoriteBeansList.slice(0, 2).map((bean: any) => (
                            <Text key={bean.id} style={[styles.beanName, { color: colors.foreground }]}>
                              • {bean.name}
                            </Text>
                          ))}
                          {favoriteBeansList.length > 2 && (
                            <Text style={[styles.beanName, { color: colors.muted }]}>
                              +{favoriteBeansList.length - 2} more
                            </Text>
                          )}
                        </View>
                      </View>
                    )}

                    {/* Maintenance Info */}
                    <View style={styles.maintenanceInfo}>
                      <View style={styles.maintenanceRow}>
                        <IconSymbol name="calendar" size={14} color={colors.muted} />
                        <Text style={[styles.maintenanceText, { color: colors.muted }]}>
                          {item.lastMaintenance
                            ? `Last: ${new Date(item.lastMaintenance).toLocaleDateString()}`
                            : 'No maintenance recorded'}
                        </Text>
                      </View>
                      {daysUntilMaintenance !== null && (
                        <View style={styles.maintenanceRow}>
                          <IconSymbol name="clock" size={14} color={isMaintenanceDue ? colors.warning : colors.muted} />
                          <Text style={[styles.maintenanceText, { color: isMaintenanceDue ? colors.warning : colors.muted }]}>
                            Next: {daysUntilMaintenance === 0 ? 'Today' : `${daysUntilMaintenance} days`}
                          </Text>
                        </View>
                      )}
                    </View>
                  </Pressable>
                </Animated.View>
              );
            })}

            {/* Add More Button */}
            <Pressable
              onPress={handleAddEquipment}
              style={({ pressed }) => [
                styles.addMoreButton,
                { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.7 : 1 }
              ]}
            >
              <IconSymbol name="plus.circle.fill" size={24} color={colors.primary} />
              <Text style={[styles.addMoreText, { color: colors.foreground }]}>
                Add More Equipment
              </Text>
            </Pressable>
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  backButton: { padding: 8 },
  headerTitle: { flex: 1, fontSize: 17, fontWeight: '600', textAlign: 'center' },
  addButton: { padding: 8 },
  alertBanner: { margin: 16, padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1 },
  alertText: { flex: 1 },
  alertTitle: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  alertDescription: { fontSize: 13 },
  content: { padding: 16, gap: 16 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 80, gap: 16 },
  emptyIcon: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 22, fontWeight: '700' },
  emptyDescription: { fontSize: 15, textAlign: 'center', lineHeight: 22, paddingHorizontal: 32 },
  addFirstButton: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, marginTop: 8 },
  addFirstButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  equipmentCard: { borderRadius: 16, padding: 16, borderWidth: 1, gap: 12 },
  maintenanceBadge: { position: 'absolute', top: 12, right: 12, flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, zIndex: 1 },
  maintenanceBadgeText: { color: '#FFF', fontSize: 11, fontWeight: '600' },
  equipmentHeader: { flexDirection: 'row', gap: 12 },
  equipmentImage: { width: 80, height: 80, borderRadius: 12 },
  equipmentInfo: { flex: 1, justifyContent: 'center', gap: 4 },
  equipmentName: { fontSize: 17, fontWeight: '600' },
  equipmentBrand: { fontSize: 14 },
  equipmentMeta: { flexDirection: 'row', gap: 6, marginTop: 4 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  typeBadgeText: { fontSize: 11, fontWeight: '600' },
  customBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  customBadgeText: { fontSize: 11, fontWeight: '600' },
  removeButton: { padding: 8 },
  favoriteBeans: { paddingTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', gap: 6 },
  favoriteBeansHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  favoriteBeansTitle: { fontSize: 12, fontWeight: '600' },
  beansList: { gap: 2 },
  beanName: { fontSize: 13 },
  maintenanceInfo: { gap: 6 },
  maintenanceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  maintenanceText: { fontSize: 12 },
  addMoreButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed' },
  addMoreText: { fontSize: 15, fontWeight: '500' },
});
