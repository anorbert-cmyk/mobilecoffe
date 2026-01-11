import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { espressoMachines } from '@/data/machines';

type BrewingMethod = 'espresso-machine' | 'pour-over' | 'french-press' | 'moka-pot' | 'aeropress';

interface BrewingMethodOption {
  id: BrewingMethod;
  name: string;
  description: string;
  icon: string;
}

const BREWING_METHODS: BrewingMethodOption[] = [
  { id: 'espresso-machine', name: 'Espresso Machine', description: 'Semi-auto, automatic, or super-auto', icon: '☕' },
  { id: 'pour-over', name: 'Pour Over', description: 'V60, Chemex, Kalita Wave', icon: '🫖' },
  { id: 'french-press', name: 'French Press', description: 'Immersion brewing', icon: '🍵' },
  { id: 'moka-pot', name: 'Moka Pot', description: 'Stovetop espresso', icon: '🔥' },
  { id: 'aeropress', name: 'AeroPress', description: 'Versatile manual brewer', icon: '💨' },
];

export default function BeanMatcherStep1() {
  const colors = useColors();
  const [selectedMethod, setSelectedMethod] = useState<BrewingMethod | null>(null);
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleMethodSelect = (method: BrewingMethod) => {
    triggerHaptic();
    setSelectedMethod(method);
    setSelectedMachineId(null);
  };

  const handleMachineSelect = (machineId: string) => {
    triggerHaptic();
    setSelectedMachineId(machineId);
  };

  const handleContinue = () => {
    if (!selectedMethod) return;
    triggerHaptic();
    
    const params = new URLSearchParams({
      method: selectedMethod,
      machineId: selectedMachineId || '',
    });
    
    router.push(`/bean-matcher/step2-grinder?${params.toString()}` as any);
  };

  const canContinue = selectedMethod && (selectedMethod !== 'espresso-machine' || selectedMachineId);

  return (
    <ScreenContainer>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={[styles.title, { color: colors.foreground }]}>Find Your Coffee</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>Step 1 of 3</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(400)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            What do you brew with?
          </Text>
          <Text style={[styles.sectionDescription, { color: colors.muted }]}>
            Select your primary brewing method
          </Text>
        </Animated.View>

        <View style={styles.methodGrid}>
          {BREWING_METHODS.map((method, index) => (
            <Animated.View 
              key={method.id} 
              entering={FadeInDown.delay(index * 50).duration(300)}
            >
              <Pressable
                onPress={() => handleMethodSelect(method.id)}
                style={({ pressed }) => [
                  styles.methodCard,
                  {
                    backgroundColor: selectedMethod === method.id ? colors.primary : colors.surface,
                    borderColor: selectedMethod === method.id ? colors.primary : colors.border,
                    opacity: pressed ? 0.8 : 1,
                  }
                ]}
              >
                <Text style={styles.methodIcon}>{method.icon}</Text>
                <Text style={[
                  styles.methodName,
                  { color: selectedMethod === method.id ? '#FFF' : colors.foreground }
                ]}>
                  {method.name}
                </Text>
                <Text style={[
                  styles.methodDescription,
                  { color: selectedMethod === method.id ? 'rgba(255,255,255,0.8)' : colors.muted }
                ]}>
                  {method.description}
                </Text>
              </Pressable>
            </Animated.View>
          ))}
        </View>

        {selectedMethod === 'espresso-machine' && (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.machineSection}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Select your machine
            </Text>
            <Text style={[styles.sectionDescription, { color: colors.muted }]}>
              Or skip if not listed
            </Text>

            <View style={styles.machineList}>
              {espressoMachines.map((machine, index) => (
                <Pressable
                  key={machine.id}
                  onPress={() => handleMachineSelect(machine.id)}
                  style={({ pressed }) => [
                    styles.machineCard,
                    {
                      backgroundColor: selectedMachineId === machine.id ? `${colors.primary}15` : colors.surface,
                      borderColor: selectedMachineId === machine.id ? colors.primary : colors.border,
                      opacity: pressed ? 0.8 : 1,
                    }
                  ]}
                >
                  {machine.image && (
                    <Image
                      source={machine.image}
                      style={styles.machineImage}
                      contentFit="contain"
                    />
                  )}
                  <View style={styles.machineInfo}>
                    <Text style={[styles.machineName, { color: colors.foreground }]}>
                      {machine.name}
                    </Text>
                    <Text style={[styles.machineBrand, { color: colors.muted }]}>
                      {machine.brand} • {machine.type.replace('-', ' ')}
                    </Text>
                  </View>
                  {selectedMachineId === machine.id && (
                    <IconSymbol name="checkmark.circle.fill" size={24} color={colors.primary} />
                  )}
                </Pressable>
              ))}
              
              <Pressable
                onPress={() => handleMachineSelect('other')}
                style={({ pressed }) => [
                  styles.machineCard,
                  {
                    backgroundColor: selectedMachineId === 'other' ? `${colors.primary}15` : colors.surface,
                    borderColor: selectedMachineId === 'other' ? colors.primary : colors.border,
                    opacity: pressed ? 0.8 : 1,
                  }
                ]}
              >
                <View style={[styles.otherIcon, { backgroundColor: colors.muted + '30' }]}>
                  <IconSymbol name="plus" size={24} color={colors.muted} />
                </View>
                <View style={styles.machineInfo}>
                  <Text style={[styles.machineName, { color: colors.foreground }]}>
                    Other Machine
                  </Text>
                  <Text style={[styles.machineBrand, { color: colors.muted }]}>
                    My machine is not listed
                  </Text>
                </View>
                {selectedMachineId === 'other' && (
                  <IconSymbol name="checkmark.circle.fill" size={24} color={colors.primary} />
                )}
              </Pressable>
            </View>
          </Animated.View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {canContinue && (
        <Animated.View 
          entering={FadeIn.duration(300)}
          style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}
        >
          <Pressable
            onPress={handleContinue}
            style={({ pressed }) => [
              styles.continueButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 }
            ]}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <IconSymbol name="chevron.right" size={20} color="#FFF" />
          </Pressable>
        </Animated.View>
      )}
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
  methodGrid: { gap: 12 },
  methodCard: { padding: 16, borderRadius: 16, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  methodIcon: { fontSize: 32 },
  methodName: { fontSize: 17, fontWeight: '600' },
  methodDescription: { fontSize: 13, marginTop: 2 },
  machineSection: { marginTop: 32 },
  machineList: { gap: 12 },
  machineCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1, gap: 12 },
  machineImage: { width: 60, height: 60, borderRadius: 8 },
  machineInfo: { flex: 1 },
  machineName: { fontSize: 15, fontWeight: '600' },
  machineBrand: { fontSize: 13, marginTop: 2 },
  otherIcon: { width: 60, height: 60, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, borderTopWidth: 1 },
  continueButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, gap: 8 },
  continueButtonText: { color: '#FFF', fontSize: 17, fontWeight: '600' },
});
