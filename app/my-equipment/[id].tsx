import { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Alert, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { useMyEquipment } from '@/lib/equipment/my-equipment-provider';
import { coffeeBeans } from '@/data/beans';

export default function EquipmentDetailScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { equipment, updateEquipment, removeEquipment } = useMyEquipment();

  const [item, setItem] = useState(equipment.find(e => e.id === id));
  const [showBeanSelector, setShowBeanSelector] = useState(false);

  useEffect(() => {
    setItem(equipment.find(e => e.id === id));
  }, [equipment, id]);

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  if (!item) {
    return (
      <ScreenContainer>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.foreground }]}>Equipment not found</Text>
          <Pressable onPress={() => router.back()} style={[styles.errorButton, { backgroundColor: colors.primary }]}>
            <Text style={styles.errorButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  const handleToggleFavoriteBean = async (beanId: string) => {
    triggerHaptic();
    const newFavorites = item.favoriteBeans.includes(beanId)
      ? item.favoriteBeans.filter(id => id !== beanId)
      : [...item.favoriteBeans, beanId];

    await updateEquipment(item.id, { favoriteBeans: newFavorites });
  };

  const handleLogMaintenance = () => {
    triggerHaptic();
    Alert.alert(
      'Log Maintenance',
      'Mark maintenance as completed today?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            const now = new Date();
            const nextDue = new Date();
            nextDue.setMonth(nextDue.getMonth() + (item.type === 'grinder' ? 3 : 6));

            await updateEquipment(item.id, {
              lastMaintenance: now.toISOString(),
              nextMaintenanceDue: nextDue.toISOString(),
            });
          },
        },
      ]
    );
  };

  const handleRemove = () => {
    triggerHaptic();
    Alert.alert(
      'Remove Equipment',
      `Remove ${item.name} from your equipment?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await removeEquipment(item.id);
            router.back();
          },
        },
      ]
    );
  };

  const getDaysUntilMaintenance = () => {
    if (!item.nextMaintenanceDue) return null;
    const now = new Date();
    const due = new Date(item.nextMaintenanceDue);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilMaintenance = getDaysUntilMaintenance();
  const isMaintenanceDue = daysUntilMaintenance !== null && daysUntilMaintenance <= 7;
  const favoriteBeansList = item.favoriteBeans
    .map(id => coffeeBeans.find(b => b.id === id))
    .filter(Boolean);

  return (
    <ScreenContainer>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Equipment Details</Text>
        <Pressable onPress={handleRemove} style={styles.removeButton}>
          <IconSymbol name="trash.fill" size={20} color={colors.error} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Equipment Info */}
        <Animated.View entering={FadeInDown.delay(50).duration(400)} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Image source={item.image} style={styles.equipmentImage} contentFit="contain" />
          <Text style={[styles.equipmentName, { color: colors.foreground }]}>
            {item.name}
          </Text>
          <Text style={[styles.equipmentBrand, { color: colors.muted }]}>
            {item.brand}
          </Text>
          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: colors.primary + '20' }]}>
              <Text style={[styles.badgeText, { color: colors.primary }]}>
                {item.type === 'machine' ? 'Espresso Machine' : 'Grinder'}
              </Text>
            </View>
            {item.isCustom && (
              <View style={[styles.badge, { backgroundColor: colors.muted + '20' }]}>
                <Text style={[styles.badgeText, { color: colors.muted }]}>
                  Custom
                </Text>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Maintenance Status */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={[styles.card, { backgroundColor: colors.surface, borderColor: isMaintenanceDue ? colors.warning : colors.border }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIcon, { backgroundColor: isMaintenanceDue ? colors.warning + '20' : colors.primary + '20' }]}>
              <IconSymbol name="wrench.fill" size={20} color={isMaintenanceDue ? colors.warning : colors.primary} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>
              Maintenance
            </Text>
          </View>

          {isMaintenanceDue && (
            <View style={[styles.alertBanner, { backgroundColor: colors.warning + '15', borderColor: colors.warning }]}>
              <IconSymbol name="exclamationmark.triangle.fill" size={18} color={colors.warning} />
              <Text style={[styles.alertText, { color: colors.warning }]}>
                Maintenance {daysUntilMaintenance === 0 ? 'due today' : `due in ${daysUntilMaintenance} days`}
              </Text>
            </View>
          )}

          <View style={styles.maintenanceInfo}>
            <View style={styles.maintenanceRow}>
              <Text style={[styles.maintenanceLabel, { color: colors.muted }]}>Last Maintenance</Text>
              <Text style={[styles.maintenanceValue, { color: colors.foreground }]}>
                {item.lastMaintenance
                  ? new Date(item.lastMaintenance).toLocaleDateString()
                  : 'Not recorded'}
              </Text>
            </View>
            {daysUntilMaintenance !== null && (
              <View style={styles.maintenanceRow}>
                <Text style={[styles.maintenanceLabel, { color: colors.muted }]}>Next Due</Text>
                <Text style={[styles.maintenanceValue, { color: isMaintenanceDue ? colors.warning : colors.foreground }]}>
                  {daysUntilMaintenance === 0 ? 'Today' : `${daysUntilMaintenance} days`}
                </Text>
              </View>
            )}
          </View>

          <Pressable
            onPress={handleLogMaintenance}
            style={({ pressed }) => [
              styles.maintenanceButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 }
            ]}
          >
            <IconSymbol name="checkmark" size={18} color="#FFF" />
            <Text style={styles.maintenanceButtonText}>Log Maintenance</Text>
          </Pressable>
        </Animated.View>

        {/* Favorite Beans */}
        <Animated.View entering={FadeInDown.delay(150).duration(400)} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIcon, { backgroundColor: colors.error + '20' }]}>
              <IconSymbol name="heart.fill" size={20} color={colors.error} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>
              Favorite Beans
            </Text>
          </View>

          {favoriteBeansList.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: colors.muted }]}>
                No favorite beans yet. Add beans that work well with this equipment.
              </Text>
            </View>
          ) : (
            <View style={styles.beansList}>
              {favoriteBeansList.map((bean: any) => (
                <View key={bean.id} style={[styles.beanItem, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <View style={styles.beanInfo}>
                    <Text style={[styles.beanName, { color: colors.foreground }]}>
                      {bean.name}
                    </Text>
                    <Text style={[styles.beanOrigin, { color: colors.muted }]}>
                      {bean.origin} • {bean.roastLevel}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => handleToggleFavoriteBean(bean.id)}
                    style={styles.removeBeanButton}
                  >
                    <IconSymbol name="xmark" size={16} color={colors.muted} />
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          <Pressable
            onPress={() => setShowBeanSelector(!showBeanSelector)}
            style={({ pressed }) => [
              styles.addBeanButton,
              { backgroundColor: colors.background, borderColor: colors.border, opacity: pressed ? 0.7 : 1 }
            ]}
          >
            <IconSymbol name="plus" size={18} color={colors.primary} />
            <Text style={[styles.addBeanButtonText, { color: colors.primary }]}>
              Add Favorite Bean
            </Text>
          </Pressable>

          {/* Bean Selector */}
          {showBeanSelector && (
            <View style={[styles.beanSelector, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={[styles.beanSelectorTitle, { color: colors.foreground }]}>
                Select Beans
              </Text>
              <ScrollView style={styles.beanSelectorList} showsVerticalScrollIndicator={false}>
                {coffeeBeans.map((bean) => {
                  const isSelected = item.favoriteBeans.includes(bean.id);
                  return (
                    <Pressable
                      key={bean.id}
                      onPress={() => handleToggleFavoriteBean(bean.id)}
                      style={({ pressed }) => [
                        styles.beanSelectorItem,
                        {
                          backgroundColor: isSelected ? colors.primary + '15' : 'transparent',
                          borderColor: isSelected ? colors.primary : colors.border,
                          opacity: pressed ? 0.7 : 1,
                        }
                      ]}
                    >
                      <View style={styles.beanSelectorInfo}>
                        <Text style={[styles.beanSelectorName, { color: colors.foreground }]}>
                          {bean.name}
                        </Text>
                        <Text style={[styles.beanSelectorOrigin, { color: colors.muted }]}>
                          {bean.origin} • {bean.roastLevel}
                        </Text>
                      </View>
                      {isSelected && (
                        <IconSymbol name="checkmark.circle.fill" size={24} color={colors.primary} />
                      )}
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 17, fontWeight: '600' },
  removeButton: { padding: 8 },
  content: { padding: 16, gap: 16 },
  card: { borderRadius: 16, padding: 20, borderWidth: 1, gap: 16 },
  equipmentImage: { width: '100%', height: 200, borderRadius: 12 },
  equipmentName: { fontSize: 24, fontWeight: '700', textAlign: 'center' },
  equipmentBrand: { fontSize: 16, textAlign: 'center', marginTop: -8 },
  badges: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 18, fontWeight: '600' },
  alertBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 10, borderWidth: 1 },
  alertText: { fontSize: 14, fontWeight: '600' },
  maintenanceInfo: { gap: 12 },
  maintenanceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  maintenanceLabel: { fontSize: 14 },
  maintenanceValue: { fontSize: 14, fontWeight: '600' },
  maintenanceButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 10 },
  maintenanceButtonText: { color: '#FFF', fontSize: 15, fontWeight: '600' },
  emptyState: { paddingVertical: 20 },
  emptyText: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  beansList: { gap: 10 },
  beanItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderRadius: 10, borderWidth: 1 },
  beanInfo: { flex: 1, gap: 4 },
  beanName: { fontSize: 15, fontWeight: '600' },
  beanOrigin: { fontSize: 13 },
  removeBeanButton: { padding: 6 },
  addBeanButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 10, borderWidth: 1, borderStyle: 'dashed' },
  addBeanButtonText: { fontSize: 15, fontWeight: '600' },
  beanSelector: { padding: 16, borderRadius: 12, borderWidth: 1, gap: 12, maxHeight: 300 },
  beanSelectorTitle: { fontSize: 16, fontWeight: '600' },
  beanSelectorList: { maxHeight: 240 },
  beanSelectorItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 8 },
  beanSelectorInfo: { flex: 1, gap: 2 },
  beanSelectorName: { fontSize: 14, fontWeight: '600' },
  beanSelectorOrigin: { fontSize: 12 },
  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 32 },
  errorText: { fontSize: 18, fontWeight: '600' },
  errorButton: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10 },
  errorButtonText: { color: '#FFF', fontSize: 15, fontWeight: '600' },
});
