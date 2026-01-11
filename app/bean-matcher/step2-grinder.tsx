import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { coffeeGrinders } from '@/data/machines';

export default function BeanMatcherStep2() {
  const colors = useColors();
  const params = useLocalSearchParams<{ method: string; machineId: string }>();
  const [selectedGrinderId, setSelectedGrinderId] = useState<string | null>(null);
  const [hasGrinder, setHasGrinder] = useState<boolean | null>(null);

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

  return (
    <ScreenContainer>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={[styles.title, { color: colors.foreground }]}>Find Your Coffee</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>Step 2 of 3</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(400)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Do you have a grinder?
          </Text>
          <Text style={[styles.sectionDescription, { color: colors.muted }]}>
            Fresh grinding makes a big difference
          </Text>
        </Animated.View>

        <View style={styles.optionRow}>
          <Pressable
            onPress={() => { triggerHaptic(); setHasGrinder(true); }}
            style={({ pressed }) => [
              styles.optionCard,
              {
                backgroundColor: hasGrinder === true ? colors.primary : colors.surface,
                borderColor: hasGrinder === true ? colors.primary : colors.border,
                opacity: pressed ? 0.8 : 1,
              }
            ]}
          >
            <Text style={[styles.optionIcon]}>✓</Text>
            <Text style={[
              styles.optionText,
              { color: hasGrinder === true ? '#FFF' : colors.foreground }
            ]}>
              Yes, I have a grinder
            </Text>
          </Pressable>

          <Pressable
            onPress={handleNoGrinder}
            style={({ pressed }) => [
              styles.optionCard,
              {
                backgroundColor: hasGrinder === false ? colors.primary : colors.surface,
                borderColor: hasGrinder === false ? colors.primary : colors.border,
                opacity: pressed ? 0.8 : 1,
              }
            ]}
          >
            <Text style={[styles.optionIcon]}>✗</Text>
            <Text style={[
              styles.optionText,
              { color: hasGrinder === false ? '#FFF' : colors.foreground }
            ]}>
              No, I use pre-ground
            </Text>
          </Pressable>
        </View>

        {hasGrinder === true && (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.grinderSection}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Select your grinder
            </Text>
            <Text style={[styles.sectionDescription, { color: colors.muted }]}>
              Or skip if not listed
            </Text>

            <View style={styles.grinderList}>
              {coffeeGrinders.map((grinder) => (
                <Pressable
                  key={grinder.id}
                  onPress={() => handleGrinderSelect(grinder.id)}
                  style={({ pressed }) => [
                    styles.grinderCard,
                    {
                      backgroundColor: selectedGrinderId === grinder.id ? `${colors.primary}15` : colors.surface,
                      borderColor: selectedGrinderId === grinder.id ? colors.primary : colors.border,
                      opacity: pressed ? 0.8 : 1,
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
                      {grinder.burrType} burr • {grinder.burrSize}mm
                    </Text>
                  </View>
                  {selectedGrinderId === grinder.id && (
                    <IconSymbol name="checkmark.circle.fill" size={24} color={colors.primary} />
                  )}
                </Pressable>
              ))}
              
              <Pressable
                onPress={() => handleGrinderSelect('other')}
                style={({ pressed }) => [
                  styles.grinderCard,
                  {
                    backgroundColor: selectedGrinderId === 'other' ? `${colors.primary}15` : colors.surface,
                    borderColor: selectedGrinderId === 'other' ? colors.primary : colors.border,
                    opacity: pressed ? 0.8 : 1,
                  }
                ]}
              >
                <View style={[styles.otherIcon, { backgroundColor: colors.muted + '30' }]}>
                  <IconSymbol name="plus" size={24} color={colors.muted} />
                </View>
                <View style={styles.grinderInfo}>
                  <Text style={[styles.grinderName, { color: colors.foreground }]}>
                    Other Grinder
                  </Text>
                  <Text style={[styles.grinderSpecs, { color: colors.muted }]}>
                    My grinder is not listed
                  </Text>
                </View>
                {selectedGrinderId === 'other' && (
                  <IconSymbol name="checkmark.circle.fill" size={24} color={colors.primary} />
                )}
              </Pressable>
            </View>
          </Animated.View>
        )}

        {hasGrinder === false && (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.tipCard}>
            <View style={[styles.tipIcon, { backgroundColor: colors.warning + '20' }]}>
              <Text style={{ fontSize: 24 }}>💡</Text>
            </View>
            <View style={styles.tipContent}>
              <Text style={[styles.tipTitle, { color: colors.foreground }]}>
                Pro Tip
              </Text>
              <Text style={[styles.tipText, { color: colors.muted }]}>
                We'll recommend beans that work well pre-ground, but consider investing in a grinder for the best flavor!
              </Text>
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
  optionRow: { gap: 12, marginBottom: 24 },
  optionCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1, gap: 12 },
  optionIcon: { fontSize: 20, fontWeight: '700' },
  optionText: { fontSize: 16, fontWeight: '500' },
  grinderSection: { marginTop: 8 },
  grinderList: { gap: 12 },
  grinderCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1, gap: 12 },
  grinderImage: { width: 60, height: 60, borderRadius: 8 },
  grinderInfo: { flex: 1 },
  grinderName: { fontSize: 15, fontWeight: '600' },
  grinderSpecs: { fontSize: 13, marginTop: 2 },
  otherIcon: { width: 60, height: 60, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  tipCard: { flexDirection: 'row', padding: 16, borderRadius: 12, gap: 12, marginTop: 16 },
  tipIcon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  tipContent: { flex: 1 },
  tipTitle: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  tipText: { fontSize: 14, lineHeight: 20 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, borderTopWidth: 1 },
  continueButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, gap: 8 },
  continueButtonText: { color: '#FFF', fontSize: 17, fontWeight: '600' },
});
