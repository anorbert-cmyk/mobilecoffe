import { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Platform, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
  interpolateColor
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { espressoMachines } from '@/data/machines';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type BrewingMethod = 'espresso-machine' | 'pour-over' | 'french-press' | 'moka-pot' | 'aeropress';

interface BrewingMethodOption {
  id: BrewingMethod;
  name: string;
  description: string;
  icon: string;
  gradient: [string, string];
}

const BREWING_METHODS: BrewingMethodOption[] = [
  {
    id: 'espresso-machine',
    name: 'Espresso Machine',
    description: 'Semi-auto, automatic, or super-auto',
    icon: '☕',
    gradient: ['#7C3AED', '#5B21B6']
  },
  {
    id: 'pour-over',
    name: 'Pour Over',
    description: 'V60, Chemex, Kalita Wave',
    icon: '🫖',
    gradient: ['#F59E0B', '#B45309']
  },
  {
    id: 'french-press',
    name: 'French Press',
    description: 'Immersion brewing',
    icon: '🍵',
    gradient: ['#10B981', '#047857']
  },
  {
    id: 'moka-pot',
    name: 'Moka Pot',
    description: 'Stovetop espresso',
    icon: '🔥',
    gradient: ['#EF4444', '#B91C1C']
  },
  {
    id: 'aeropress',
    name: 'AeroPress',
    description: 'Versatile manual brewer',
    icon: '💨',
    gradient: ['#3B82F6', '#1D4ED8']
  },
];

export default function BeanMatcherStep1() {
  const colors = useColors();
  const [selectedMethod, setSelectedMethod] = useState<BrewingMethod | null>(null);
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(0.33, { duration: 1000 });
  }, []);

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

  const progressBarAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <ScreenContainer>
      {/* Header with Progress */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
          </Pressable>
          <View style={styles.stepIndicator}>
            <Text style={[styles.stepText, { color: colors.muted }]}>Step 1 of 3</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
        <View style={[styles.progressBarContainer, { backgroundColor: colors.border }]}>
          <Animated.View style={[styles.progressBar, progressBarAnimatedStyle, { backgroundColor: colors.primary }]} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(100).duration(600)}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            How do you brew?
          </Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            We'll transform your coffee experience based on your equipment.
          </Text>
        </Animated.View>

        <View style={styles.grid}>
          {BREWING_METHODS.map((method, index) => {
            const isSelected = selectedMethod === method.id;
            return (
              <Animated.View
                key={method.id}
                entering={FadeInDown.delay(200 + index * 50).duration(500)}
                style={styles.gridItemContainer}
              >
                <Pressable
                  onPress={() => handleMethodSelect(method.id)}
                  style={({ pressed }) => [
                    styles.methodCard,
                    {
                      backgroundColor: isSelected ? colors.surface : colors.background,
                      borderColor: isSelected ? colors.primary : colors.border,
                      borderWidth: isSelected ? 2 : 1,
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    }
                  ]}
                >
                  {isSelected && (
                    <View style={[styles.selectedIndicator, { backgroundColor: colors.primary }]}>
                      <IconSymbol name="checkmark" size={12} color="#FFF" />
                    </View>
                  )}

                  <View style={[styles.iconContainer, { backgroundColor: isSelected ? `${method.gradient[0]}20` : colors.surface }]}>
                    <Text style={{ fontSize: 32 }}>{method.icon}</Text>
                  </View>

                  <View style={styles.cardContent}>
                    <Text style={[styles.methodName, { color: colors.foreground }]}>
                      {method.name}
                    </Text>
                    <Text style={[styles.methodDescription, { color: colors.muted }]}>
                      {method.description}
                    </Text>
                  </View>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>

        {selectedMethod === 'espresso-machine' && (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.machineSection}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Select your machine model
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.machineList}
            >
              {espressoMachines.map((machine) => {
                const isMachineSelected = selectedMachineId === machine.id;
                return (
                  <Pressable
                    key={machine.id}
                    onPress={() => handleMachineSelect(machine.id)}
                    style={({ pressed }) => [
                      styles.machineCard,
                      {
                        backgroundColor: isMachineSelected ? colors.primary : colors.surface,
                        transform: [{ scale: pressed ? 0.95 : 1 }],
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
                    <View style={styles.machineOverlay}>
                      <Text style={[
                        styles.machineName,
                        { color: isMachineSelected ? '#FFF' : colors.foreground }
                      ]}>
                        {machine.name}
                      </Text>
                    </View>
                    {isMachineSelected && (
                      <View style={styles.machineCheck}>
                        <IconSymbol name="checkmark.circle.fill" size={24} color="#FFF" />
                      </View>
                    )}
                  </Pressable>
                );
              })}

              <Pressable
                onPress={() => handleMachineSelect('other')}
                style={({ pressed }) => [
                  styles.machineCard,
                  styles.otherMachineCard,
                  {
                    backgroundColor: selectedMachineId === 'other' ? colors.primary : colors.surface,
                    borderColor: colors.border,
                    transform: [{ scale: pressed ? 0.95 : 1 }],
                  }
                ]}
              >
                <View style={[
                  styles.otherIcon,
                  { backgroundColor: selectedMachineId === 'other' ? 'rgba(255,255,255,0.2)' : colors.border }
                ]}>
                  <IconSymbol
                    name="plus"
                    size={24}
                    color={selectedMachineId === 'other' ? '#FFF' : colors.muted}
                  />
                </View>
                <Text style={[
                  styles.machineName,
                  { color: selectedMachineId === 'other' ? '#FFF' : colors.foreground }
                ]}>
                  Other
                </Text>
              </Pressable>
            </ScrollView>
          </Animated.View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button */}
      {canContinue && (
        <Animated.View
          entering={FadeInDown.duration(300)}
          style={styles.fabContainer}
        >
          <Pressable
            onPress={handleContinue}
            style={({ pressed }) => [
              styles.fab,
              {
                backgroundColor: colors.primary,
                transform: [{ scale: pressed ? 0.95 : 1 }],
              }
            ]}
          >
            <Text style={styles.fabText}>Continue</Text>
            <IconSymbol name="arrow.right" size={20} color="#FFF" />
          </Pressable>
        </Animated.View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 10,
    width: '100%',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  stepText: {
    fontSize: 13,
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 4,
    width: '100%',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 24,
    marginBottom: 32,
  },
  grid: {
    gap: 16,
  },
  gridItemContainer: {
    width: '100%',
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1, // Fallback for border color
  },
  selectedIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
  },
  methodName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  machineSection: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  machineList: {
    gap: 16,
    paddingRight: 24,
  },
  machineCard: {
    width: 140,
    height: 160,
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  otherMachineCard: {
    borderWidth: 1,
    justifyContent: 'center',
    gap: 12,
  },
  machineImage: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  machineOverlay: {
    width: '100%',
    alignItems: 'center',
  },
  machineName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  otherIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  machineCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    gap: 8,
  },
  fabText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
