import { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Platform, Dimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { coffeeGrinders } from '@/data/machines';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function BeanMatcherStep2() {
  const colors = useColors();
  const params = useLocalSearchParams<{ method: string; machineId: string }>();
  const [selectedGrinderId, setSelectedGrinderId] = useState<string | null>(null);
  const [hasGrinder, setHasGrinder] = useState<boolean | null>(null);

  const progress = useSharedValue(0.33);

  useEffect(() => {
    progress.value = withTiming(0.66, { duration: 1000 });
  }, []);

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleGrinderSelect = (grinderId: string) => {
    triggerHaptic();
    setSelectedGrinderId(grinderId);
    setHasGrinder(true);
  };

  const handleNoGrinder = () => {
    triggerHaptic();
    setHasGrinder(false);
    setSelectedGrinderId(null);
  };

  const handleContinue = () => {
    if (hasGrinder === null) return;
    triggerHaptic();

    const searchParams = new URLSearchParams({
      method: params.method || 'espresso-machine',
      machineId: params.machineId || '',
      grinderId: selectedGrinderId || '',
      hasGrinder: hasGrinder ? 'true' : 'false',
    });

    router.push(`/bean-matcher/step3-preferences?${searchParams.toString()}` as any);
  };

  const canContinue = hasGrinder !== null && (hasGrinder === false || selectedGrinderId !== null);

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
            <Text style={[styles.stepText, { color: colors.muted }]}>Step 2 of 3</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
        <View style={[styles.progressBarContainer, { backgroundColor: colors.border }]}>
          <Animated.View style={[styles.progressBar, progressBarAnimatedStyle, { backgroundColor: colors.primary }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(400)}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Do you have a grinder?
          </Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Fresh grinding makes the biggest difference in flavor.
          </Text>
        </Animated.View>

        <View style={styles.optionRow}>
          <Animated.View entering={FadeInDown.delay(100).duration(400)} style={{ flex: 1 }}>
            <Pressable
              onPress={() => { triggerHaptic(); setHasGrinder(true); }}
              style={({ pressed }) => [
                styles.optionCard,
                {
                  backgroundColor: hasGrinder === true ? colors.primary : colors.surface,
                  borderColor: hasGrinder === true ? colors.primary : colors.border,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                }
              ]}
            >
              <View style={[
                styles.optionIconContainer,
                { backgroundColor: hasGrinder === true ? 'rgba(255,255,255,0.2)' : colors.background }
              ]}>
                <IconSymbol name="checkmark" size={20} color={hasGrinder === true ? '#FFF' : colors.foreground} />
              </View>
              <Text style={[
                styles.optionText,
                { color: hasGrinder === true ? '#FFF' : colors.foreground }
              ]}>
                Yes, I do
              </Text>
            </Pressable>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(400)} style={{ flex: 1 }}>
            <Pressable
              onPress={handleNoGrinder}
              style={({ pressed }) => [
                styles.optionCard,
                {
                  backgroundColor: hasGrinder === false ? colors.primary : colors.surface,
                  borderColor: hasGrinder === false ? colors.primary : colors.border,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                }
              ]}
            >
              <View style={[
                styles.optionIconContainer,
                { backgroundColor: hasGrinder === false ? 'rgba(255,255,255,0.2)' : colors.background }
              ]}>
                <IconSymbol name="xmark" size={20} color={hasGrinder === false ? '#FFF' : colors.foreground} />
              </View>
              <Text style={[
                styles.optionText,
                { color: hasGrinder === false ? '#FFF' : colors.foreground }
              ]}>
                No, pre-ground
              </Text>
            </Pressable>
          </Animated.View>
        </View>

        {hasGrinder === true && (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.grinderSection}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Select your grinder
            </Text>
            <Text style={[styles.sectionDescription, { color: colors.muted }]}>
              We'll tailor the coarseness for you
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.grinderList}
            >
              {coffeeGrinders.map((grinder) => (
                <Pressable
                  key={grinder.id}
                  onPress={() => handleGrinderSelect(grinder.id)}
                  style={({ pressed }) => [
                    styles.grinderCard,
                    {
                      backgroundColor: selectedGrinderId === grinder.id ? `${colors.primary}15` : colors.surface,
                      borderColor: selectedGrinderId === grinder.id ? colors.primary : colors.border,
                      transform: [{ scale: pressed ? 0.95 : 1 }],
                    }
                  ]}
                >
                  {grinder.image && (
                    <Image
                      source={grinder.image}
                      style={styles.grinderImage}
                      contentFit="contain"
                    />
                  )}
                  <View style={styles.grinderInfo}>
                    <Text style={[styles.grinderName, { color: colors.foreground }]}>
                      {grinder.name}
                    </Text>
                    <Text style={[styles.grinderSpecs, { color: colors.muted }]}>
                      {grinder.burrType} burr
                    </Text>
                  </View>
                  {selectedGrinderId === grinder.id && (
                    <View style={styles.checkIcon}>
                      <IconSymbol name="checkmark.circle.fill" size={24} color={colors.primary} />
                    </View>
                  )}
                </Pressable>
              ))}

              <Pressable
                onPress={() => handleGrinderSelect('other')}
                style={({ pressed }) => [
                  styles.grinderCard,
                  styles.otherGrinderCard,
                  {
                    backgroundColor: selectedGrinderId === 'other' ? `${colors.primary}15` : colors.surface,
                    borderColor: selectedGrinderId === 'other' ? colors.primary : colors.border,
                    transform: [{ scale: pressed ? 0.95 : 1 }],
                  }
                ]}
              >
                <View style={[styles.otherIcon, { backgroundColor: colors.muted + '20' }]}>
                  <IconSymbol name="plus" size={24} color={colors.muted} />
                </View>
                <View style={styles.grinderInfo}>
                  <Text style={[styles.grinderName, { color: colors.foreground }]}>
                    Other
                  </Text>
                  <Text style={[styles.grinderSpecs, { color: colors.muted }]}>
                    Unlisted model
                  </Text>
                </View>
                {selectedGrinderId === 'other' && (
                  <View style={styles.checkIcon}>
                    <IconSymbol name="checkmark.circle.fill" size={24} color={colors.primary} />
                  </View>
                )}
              </Pressable>
            </ScrollView>
          </Animated.View>
        )}

        {hasGrinder === false && (
          <Animated.View entering={FadeInDown.duration(400)} style={[styles.tipCard, { backgroundColor: `${colors.warning}15`, borderColor: colors.warning }]}>
            <View style={[styles.tipIcon, { backgroundColor: colors.warning + '20' }]}>
              <Text style={{ fontSize: 24 }}>💡</Text>
            </View>
            <View style={styles.tipContent}>
              <Text style={[styles.tipTitle, { color: colors.warning }]}>
                Pro Tip
              </Text>
              <Text style={[styles.tipText, { color: colors.foreground }]}>
                We'll recommend beans that come in vacuum-sealed packs for freshness.
              </Text>
            </View>
          </Animated.View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {canContinue && (
        <Animated.View
          entering={FadeIn.duration(300)}
          style={styles.fabContainer}
        >
          <Pressable
            onPress={handleContinue}
            style={({ pressed }) => [
              styles.fab,
              { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 }
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
  optionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  optionCard: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    gap: 12,
    height: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  optionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  grinderSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 15,
    marginBottom: 20,
  },
  grinderList: {
    gap: 16,
    paddingRight: 24,
  },
  grinderCard: {
    width: 150,
    height: 180,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  otherGrinderCard: {
    borderStyle: 'dashed',
  },
  grinderImage: {
    width: 80,
    height: 90,
    marginBottom: 8,
  },
  grinderInfo: {
    alignItems: 'center',
    width: '100%',
  },
  grinderName: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  grinderSpecs: {
    fontSize: 12,
    textAlign: 'center',
  },
  checkIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  otherIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  tipCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    gap: 16,
    marginTop: 8,
  },
  tipIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipContent: {
    flex: 1,
    justifyContent: 'center',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
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
