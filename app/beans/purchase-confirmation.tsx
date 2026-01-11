import { View, Text, Pressable, StyleSheet, Linking } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { coffeeBeans } from '@/data/beans';

export default function PurchaseConfirmationScreen() {
  const colors = useColors();
  const params = useLocalSearchParams<{ beanId: string; roaster: string; affiliateUrl: string }>();
  
  const bean = coffeeBeans.find(b => b.id === params.beanId);

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleContinueToStore = () => {
    triggerHaptic();
    if (params.affiliateUrl) {
      Linking.openURL(params.affiliateUrl);
    }
  };

  const handleGoBack = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        {/* Success Animation */}
        <Animated.View 
          entering={ZoomIn.delay(200).duration(500)}
          style={[styles.successCircle, { backgroundColor: colors.success + '20' }]}
        >
          <IconSymbol name="checkmark.circle.fill" size={80} color={colors.success} />
        </Animated.View>

        <Animated.View entering={FadeIn.delay(400).duration(400)}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Great Choice!
          </Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            You're about to visit {params.roaster || 'the roaster'}'s website
          </Text>
        </Animated.View>

        {/* Bean Preview */}
        {bean && (
          <Animated.View 
            entering={FadeInDown.delay(500).duration(400)}
            style={[styles.beanCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Image source={bean.image} style={styles.beanImage} contentFit="cover" />
            <View style={styles.beanInfo}>
              <Text style={[styles.beanName, { color: colors.foreground }]}>{bean.name}</Text>
              <Text style={[styles.beanRoaster, { color: colors.muted }]}>{bean.roaster}</Text>
              <View style={styles.beanDetails}>
                <Text style={[styles.beanPrice, { color: colors.primary }]}>${bean.price.toFixed(2)}</Text>
                <Text style={[styles.beanWeight, { color: colors.muted }]}>/ {bean.weight}g</Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Info Box */}
        <Animated.View 
          entering={FadeInDown.delay(600).duration(400)}
          style={[styles.infoBox, { backgroundColor: colors.primary + '10', borderColor: colors.primary }]}
        >
          <IconSymbol name="info.circle.fill" size={20} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.foreground }]}>
            You'll be redirected to the roaster's official website to complete your purchase. 
            Coffee Craft may earn a small commission at no extra cost to you.
          </Text>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View 
          entering={FadeInDown.delay(700).duration(400)}
          style={styles.actions}
        >
          <Pressable
            onPress={handleContinueToStore}
            style={({ pressed }) => [
              styles.primaryButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 }
            ]}
          >
            <Text style={styles.primaryButtonText}>Continue to Store</Text>
            <IconSymbol name="arrow.up.right" size={18} color="#FFF" />
          </Pressable>

          <Pressable
            onPress={handleGoBack}
            style={({ pressed }) => [
              styles.secondaryButton,
              { borderColor: colors.border, opacity: pressed ? 0.7 : 1 }
            ]}
          >
            <Text style={[styles.secondaryButtonText, { color: colors.foreground }]}>
              Go Back
            </Text>
          </Pressable>
        </Animated.View>

        {/* Trust Badges */}
        <Animated.View 
          entering={FadeIn.delay(800).duration(400)}
          style={styles.trustBadges}
        >
          <View style={styles.trustBadge}>
            <IconSymbol name="lock.fill" size={14} color={colors.muted} />
            <Text style={[styles.trustText, { color: colors.muted }]}>Secure Checkout</Text>
          </View>
          <View style={styles.trustBadge}>
            <IconSymbol name="checkmark.shield.fill" size={14} color={colors.muted} />
            <Text style={[styles.trustText, { color: colors.muted }]}>Verified Roaster</Text>
          </View>
        </Animated.View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
  successCircle: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 24 },
  beanCard: { flexDirection: 'row', padding: 16, borderRadius: 16, borderWidth: 1, gap: 16, width: '100%', marginBottom: 16 },
  beanImage: { width: 80, height: 80, borderRadius: 12 },
  beanInfo: { flex: 1, justifyContent: 'center' },
  beanName: { fontSize: 17, fontWeight: '600', marginBottom: 4 },
  beanRoaster: { fontSize: 14, marginBottom: 8 },
  beanDetails: { flexDirection: 'row', alignItems: 'baseline' },
  beanPrice: { fontSize: 18, fontWeight: '700' },
  beanWeight: { fontSize: 14 },
  infoBox: { flexDirection: 'row', padding: 16, borderRadius: 12, borderWidth: 1, gap: 12, width: '100%', marginBottom: 24 },
  infoText: { flex: 1, fontSize: 13, lineHeight: 20 },
  actions: { width: '100%', gap: 12 },
  primaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, gap: 8 },
  primaryButtonText: { color: '#FFF', fontSize: 17, fontWeight: '600' },
  secondaryButton: { alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1 },
  secondaryButtonText: { fontSize: 17, fontWeight: '500' },
  trustBadges: { flexDirection: 'row', gap: 24, marginTop: 24 },
  trustBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  trustText: { fontSize: 12 },
});
