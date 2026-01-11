import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, TextInput, Platform } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { useMyEquipment } from '@/lib/equipment/my-equipment-provider';
import { espressoMachines } from '@/data/machines';
import { coffeeGrinders } from '@/data/machines';

type EquipmentType = 'machine' | 'grinder';
type AddMode = 'select-type' | 'catalog' | 'custom';

export default function AddEquipmentScreen() {
  const colors = useColors();
  const { addEquipment } = useMyEquipment();

  const [mode, setMode] = useState<AddMode>('select-type');
  const [equipmentType, setEquipmentType] = useState<EquipmentType>('machine');
  const [customName, setCustomName] = useState('');
  const [customBrand, setCustomBrand] = useState('');

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleSelectType = (type: EquipmentType) => {
    triggerHaptic();
    setEquipmentType(type);
    setMode('catalog');
  };

  const handleSelectFromCatalog = async (item: any) => {
    triggerHaptic();
    
    const newEquipment = {
      name: item.name,
      brand: item.brand,
      type: equipmentType,
      image: item.image,
      isCustom: false,
      catalogId: item.id,
      favoriteBeans: [],
      addedDate: new Date().toISOString(),
      purchaseDate: new Date().toISOString(),
      lastMaintenance: null,
      nextMaintenanceDue: calculateNextMaintenance(equipmentType),
      notes: '',
    };

    await addEquipment(newEquipment);
    router.back();
  };

  const handleAddCustom = async () => {
    if (!customName.trim() || !customBrand.trim()) {
      alert('Please enter equipment name and brand');
      return;
    }

    triggerHaptic();

    const newEquipment = {
      name: customName.trim(),
      brand: customBrand.trim(),
      type: equipmentType,
      image: equipmentType === 'machine' 
        ? 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&q=80'
        : 'https://images.unsplash.com/photo-1587049352846-4a222e784acc?w=400&q=80',
      isCustom: true,
      catalogId: null,
      favoriteBeans: [],
      addedDate: new Date().toISOString(),
      purchaseDate: new Date().toISOString(),
      lastMaintenance: null,
      nextMaintenanceDue: calculateNextMaintenance(equipmentType),
      notes: '',
    };

    await addEquipment(newEquipment);
    router.back();
  };

  const calculateNextMaintenance = (type: EquipmentType): string => {
    const now = new Date();
    const months = type === 'grinder' ? 3 : 6;
    now.setMonth(now.getMonth() + months);
    return now.toISOString();
  };

  const catalog = equipmentType === 'machine' ? espressoMachines : coffeeGrinders;

  return (
    <ScreenContainer>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => mode === 'select-type' ? router.back() : setMode('select-type')} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          {mode === 'select-type' ? 'Add Equipment' : mode === 'catalog' ? 'Select from Catalog' : 'Custom Equipment'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Step 1: Select Type */}
        {mode === 'select-type' && (
          <>
            <Animated.View entering={FadeInDown.delay(50).duration(400)} style={styles.intro}>
              <Text style={[styles.introTitle, { color: colors.foreground }]}>
                What would you like to add?
              </Text>
              <Text style={[styles.introDescription, { color: colors.muted }]}>
                Choose the type of equipment you want to register
              </Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(100).duration(400)}>
              <Pressable
                onPress={() => handleSelectType('machine')}
                style={({ pressed }) => [
                  styles.typeCard,
                  { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.8 : 1 }
                ]}
              >
                <View style={[styles.typeIcon, { backgroundColor: colors.primary + '20' }]}>
                  <IconSymbol name="cup.and.saucer.fill" size={32} color={colors.primary} />
                </View>
                <View style={styles.typeInfo}>
                  <Text style={[styles.typeName, { color: colors.foreground }]}>
                    Espresso Machine
                  </Text>
                  <Text style={[styles.typeDescription, { color: colors.muted }]}>
                    Register your espresso machine or coffee maker
                  </Text>
                </View>
                <IconSymbol name="chevron.right" size={24} color={colors.muted} />
              </Pressable>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(150).duration(400)}>
              <Pressable
                onPress={() => handleSelectType('grinder')}
                style={({ pressed }) => [
                  styles.typeCard,
                  { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.8 : 1 }
                ]}
              >
                <View style={[styles.typeIcon, { backgroundColor: colors.warning + '20' }]}>
                  <IconSymbol name="dial.low.fill" size={32} color={colors.warning} />
                </View>
                <View style={styles.typeInfo}>
                  <Text style={[styles.typeName, { color: colors.foreground }]}>
                    Coffee Grinder
                  </Text>
                  <Text style={[styles.typeDescription, { color: colors.muted }]}>
                    Register your coffee grinder
                  </Text>
                </View>
                <IconSymbol name="chevron.right" size={24} color={colors.muted} />
              </Pressable>
            </Animated.View>
          </>
        )}

        {/* Step 2: Catalog or Custom */}
        {mode === 'catalog' && (
          <>
            <Animated.View entering={FadeInDown.delay(50).duration(400)} style={styles.modeSelector}>
              <Pressable
                onPress={() => setMode('catalog')}
                style={[styles.modeButton, { backgroundColor: colors.primary }]}
              >
                <IconSymbol name="list.bullet" size={20} color="#FFF" />
                <Text style={styles.modeButtonText}>From Catalog</Text>
              </Pressable>
              <Pressable
                onPress={() => setMode('custom')}
                style={[styles.modeButton, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}
              >
                <IconSymbol name="plus" size={20} color={colors.foreground} />
                <Text style={[styles.modeButtonTextSecondary, { color: colors.foreground }]}>Custom</Text>
              </Pressable>
            </Animated.View>

            {catalog.map((item: any, index: number) => (
              <Animated.View key={item.id} entering={FadeInDown.delay(100 + index * 50).duration(400)}>
                <Pressable
                  onPress={() => handleSelectFromCatalog(item)}
                  style={({ pressed }) => [
                    styles.catalogCard,
                    { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.8 : 1 }
                  ]}
                >
                  <Image source={item.image} style={styles.catalogImage} contentFit="contain" />
                  <View style={styles.catalogInfo}>
                    <Text style={[styles.catalogName, { color: colors.foreground }]}>
                      {item.name}
                    </Text>
                    <Text style={[styles.catalogBrand, { color: colors.muted }]}>
                      {item.brand}
                    </Text>
                    <Text style={[styles.catalogPrice, { color: colors.primary }]}>
                      ${item.price}
                    </Text>
                  </View>
                  <IconSymbol name="plus.circle.fill" size={28} color={colors.primary} />
                </Pressable>
              </Animated.View>
            ))}
          </>
        )}

        {/* Step 3: Custom Entry */}
        {mode === 'custom' && (
          <>
            <Animated.View entering={FadeInDown.delay(50).duration(400)} style={styles.modeSelector}>
              <Pressable
                onPress={() => setMode('catalog')}
                style={[styles.modeButton, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}
              >
                <IconSymbol name="list.bullet" size={20} color={colors.foreground} />
                <Text style={[styles.modeButtonTextSecondary, { color: colors.foreground }]}>From Catalog</Text>
              </Pressable>
              <Pressable
                onPress={() => setMode('custom')}
                style={[styles.modeButton, { backgroundColor: colors.primary }]}
              >
                <IconSymbol name="plus" size={20} color="#FFF" />
                <Text style={styles.modeButtonText}>Custom</Text>
              </Pressable>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(100).duration(400)} style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.formTitle, { color: colors.foreground }]}>
                Add Custom {equipmentType === 'machine' ? 'Machine' : 'Grinder'}
              </Text>
              <Text style={[styles.formDescription, { color: colors.muted }]}>
                Enter the details of your equipment
              </Text>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.foreground }]}>Equipment Name *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground }]}
                  placeholder={equipmentType === 'machine' ? 'e.g., Breville Barista Express' : 'e.g., Baratza Encore'}
                  placeholderTextColor={colors.muted}
                  value={customName}
                  onChangeText={setCustomName}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.foreground }]}>Brand *</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground }]}
                  placeholder={equipmentType === 'machine' ? 'e.g., Breville' : 'e.g., Baratza'}
                  placeholderTextColor={colors.muted}
                  value={customBrand}
                  onChangeText={setCustomBrand}
                />
              </View>

              <View style={[styles.infoBox, { backgroundColor: colors.primary + '15', borderColor: colors.primary }]}>
                <IconSymbol name="info.circle.fill" size={20} color={colors.primary} />
                <Text style={[styles.infoText, { color: colors.foreground }]}>
                  You can add favorite beans and set maintenance schedules after adding the equipment.
                </Text>
              </View>

              <Pressable
                onPress={handleAddCustom}
                style={({ pressed }) => [
                  styles.addButton,
                  { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 }
                ]}
              >
                <IconSymbol name="checkmark" size={20} color="#FFF" />
                <Text style={styles.addButtonText}>Add Equipment</Text>
              </Pressable>
            </Animated.View>
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 17, fontWeight: '600' },
  content: { padding: 16, gap: 16 },
  intro: { alignItems: 'center', paddingVertical: 24, gap: 8 },
  introTitle: { fontSize: 24, fontWeight: '700', textAlign: 'center' },
  introDescription: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
  typeCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 16, borderWidth: 1, gap: 16 },
  typeIcon: { width: 64, height: 64, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  typeInfo: { flex: 1, gap: 4 },
  typeName: { fontSize: 18, fontWeight: '600' },
  typeDescription: { fontSize: 14, lineHeight: 20 },
  modeSelector: { flexDirection: 'row', gap: 12 },
  modeButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 12 },
  modeButtonText: { color: '#FFF', fontSize: 15, fontWeight: '600' },
  modeButtonTextSecondary: { fontSize: 15, fontWeight: '600' },
  catalogCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, gap: 16 },
  catalogImage: { width: 80, height: 80, borderRadius: 12 },
  catalogInfo: { flex: 1, gap: 4 },
  catalogName: { fontSize: 16, fontWeight: '600' },
  catalogBrand: { fontSize: 14 },
  catalogPrice: { fontSize: 15, fontWeight: '600', marginTop: 4 },
  formCard: { padding: 24, borderRadius: 16, borderWidth: 1, gap: 20 },
  formTitle: { fontSize: 20, fontWeight: '700' },
  formDescription: { fontSize: 14, marginTop: -12 },
  formGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600' },
  input: { padding: 14, borderRadius: 10, borderWidth: 1, fontSize: 16 },
  infoBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 14, borderRadius: 10, borderWidth: 1 },
  infoText: { flex: 1, fontSize: 13, lineHeight: 18 },
  addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 12 },
  addButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
