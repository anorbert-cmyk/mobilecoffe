import { View, Text, Pressable, ScrollView, StyleSheet, Alert , Platform } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useSubscription } from '@/lib/subscription/subscription-provider';
import { subscriptionPlans } from '@/data/subscriptions';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function SubscriptionPlansScreen() {
  const colors = useColors();
  const { tier, trial, setSubscription, startTrial, getTrialStatus } = useSubscription();
  const trialStatus = getTrialStatus();

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleSelectPlan = async (planTier: 'free' | 'enthusiast' | 'pro') => {
    triggerHaptic();
    
    // Downgrade confirmation
    if (planTier === 'free' && tier !== 'free') {
      Alert.alert(
        'Downgrade to Free?',
        'You will lose access to premium features immediately. Are you sure?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Downgrade', 
            style: 'destructive',
            onPress: async () => {
              await setSubscription('free', false);
              router.back();
            }
          },
        ]
      );
      return;
    }

    // Same tier - do nothing
    if (planTier === tier) {
      return;
    }

    // Upgrade flow
    if (planTier !== 'free') {
      const plan = subscriptionPlans.find(p => p.id === planTier);
      const isUpgrade = tier === 'free' || (tier === 'enthusiast' && planTier === 'pro');
      
      Alert.alert(
        isUpgrade ? `Upgrade to ${plan?.name}?` : `Switch to ${plan?.name}?`,
        `You will be charged $${plan?.price}/month. This is a mock subscription for demo purposes.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Confirm', 
            onPress: async () => {
              const expiresAt = new Date();
              expiresAt.setMonth(expiresAt.getMonth() + 1);
              await setSubscription(planTier, false, expiresAt.toISOString());
              
              Alert.alert(
                '🎉 Welcome!',
                `You're now a ${plan?.name} member. Enjoy your premium features!`,
                [{ text: 'OK', onPress: () => router.back() }]
              );
            }
          },
        ]
      );
    }
  };

  const handleStartTrial = async () => {
    triggerHaptic();
    
    if (trialStatus.hasUsedTrial) {
      Alert.alert(
        'Trial Already Used',
        'You have already used your free trial. Subscribe to continue enjoying premium features.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Start 30-Day Free Trial?',
      'Get full Pro access for 30 days. No payment required. Cancel anytime.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start Trial', 
          onPress: async () => {
            const success = await startTrial();
            if (success) {
              Alert.alert(
                '🎉 Trial Started!',
                'You now have 30 days of Pro access. Enjoy all premium features!',
                [{ text: 'OK', onPress: () => router.back() }]
              );
            }
          }
        },
      ]
    );
  };

  const getButtonText = (planId: string) => {
    if (tier === planId) return 'Current Plan';
    if (trialStatus.isTrialActive && planId === 'pro') return 'Trial Active';
    if (tier === 'free' && planId !== 'free') return 'Subscribe';
    if (tier === 'enthusiast' && planId === 'pro') return 'Upgrade';
    if (tier === 'pro' && planId === 'enthusiast') return 'Downgrade';
    if (planId === 'free') return 'Downgrade';
    return 'Select Plan';
  };

  return (
    <ScreenContainer>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Subscription</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(400)} style={styles.heroSection}>
          <Text style={[styles.title, { color: colors.foreground }]}>Choose Your Plan</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Unlock premium features and master your coffee craft
          </Text>
        </Animated.View>

        {/* Trial Banner */}
        {!trialStatus.hasUsedTrial && tier === 'free' && (
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <Pressable
              onPress={handleStartTrial}
              style={({ pressed }) => [
                styles.trialBanner,
                { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 }
              ]}
            >
              <View style={styles.trialContent}>
                <Text style={styles.trialEmoji}>🎁</Text>
                <View style={styles.trialText}>
                  <Text style={styles.trialTitle}>Try Pro Free for 30 Days</Text>
                  <Text style={styles.trialDescription}>No payment required • Cancel anytime</Text>
                </View>
              </View>
              <IconSymbol name="chevron.right" size={24} color="rgba(255,255,255,0.8)" />
            </Pressable>
          </Animated.View>
        )}

        {/* Active Trial Status */}
        {trialStatus.isTrialActive && (
          <Animated.View 
            entering={FadeInDown.delay(100).duration(400)}
            style={[styles.trialStatus, { backgroundColor: colors.warning + '15', borderColor: colors.warning }]}
          >
            <IconSymbol name="sparkles" size={20} color={colors.warning} />
            <View style={styles.trialStatusText}>
              <Text style={[styles.trialStatusTitle, { color: colors.warning }]}>
                Pro Trial Active
              </Text>
              <Text style={[styles.trialStatusDays, { color: colors.foreground }]}>
                {trialStatus.trialDaysRemaining} days remaining
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Subscription Plans */}
        {subscriptionPlans.map((plan, index) => {
          const isCurrentPlan = tier === plan.id;
          const isTrialPlan = trialStatus.isTrialActive && plan.id === 'pro';
          
          return (
            <Animated.View 
              key={plan.id}
              entering={FadeInDown.delay((index + 2) * 100).duration(400)}
            >
              <View style={[
                styles.card, 
                { 
                  backgroundColor: colors.surface, 
                  borderColor: plan.popular ? colors.primary : colors.border,
                  borderWidth: plan.popular ? 2 : 1,
                }
              ]}>
                {plan.popular && (
                  <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.badgeText}>MOST POPULAR</Text>
                  </View>
                )}
                
                <View style={styles.planHeader}>
                  <Text style={[styles.planName, { color: colors.foreground }]}>{plan.name}</Text>
                  {isCurrentPlan && (
                    <View style={[styles.currentBadge, { backgroundColor: colors.success + '20' }]}>
                      <Text style={[styles.currentBadgeText, { color: colors.success }]}>Current</Text>
                    </View>
                  )}
                </View>
                
                <Text style={[styles.planTagline, { color: colors.muted }]}>{plan.tagline}</Text>
                
                <View style={styles.priceRow}>
                  <Text style={[styles.price, { color: colors.foreground }]}>
                    {plan.price === 0 ? 'Free' : `$${plan.price}`}
                  </Text>
                  {plan.price > 0 && (
                    <Text style={[styles.priceUnit, { color: colors.muted }]}>/month</Text>
                  )}
                </View>

                {plan.priceYearly > 0 && (
                  <Text style={[styles.yearlyPrice, { color: colors.muted }]}>
                    or ${plan.priceYearly}/year (save {Math.round((1 - plan.priceYearly / (plan.price * 12)) * 100)}%)
                  </Text>
                )}

                <View style={styles.divider} />

                {plan.features.map((feature, idx) => (
                  <View key={idx} style={styles.featureRow}>
                    <IconSymbol name="checkmark.circle.fill" size={18} color={colors.success} />
                    <Text style={[styles.featureText, { color: colors.foreground }]}>{feature}</Text>
                  </View>
                ))}

                {plan.limitations && plan.limitations.map((limitation, idx) => (
                  <View key={`lim-${idx}`} style={styles.featureRow}>
                    <IconSymbol name="xmark.circle.fill" size={18} color={colors.muted} />
                    <Text style={[styles.featureText, { color: colors.muted }]}>{limitation}</Text>
                  </View>
                ))}

                <Pressable
                  onPress={() => handleSelectPlan(plan.id)}
                  disabled={isCurrentPlan || isTrialPlan}
                  style={({ pressed }) => [
                    styles.button,
                    { 
                      backgroundColor: isCurrentPlan || isTrialPlan ? colors.muted + '30' : colors.primary, 
                      opacity: pressed ? 0.8 : 1 
                    }
                  ]}
                >
                  <Text style={[
                    styles.buttonText,
                    { color: isCurrentPlan || isTrialPlan ? colors.muted : '#FFF' }
                  ]}>
                    {getButtonText(plan.id)}
                  </Text>
                </Pressable>
              </View>
            </Animated.View>
          );
        })}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.muted }]}>
            Subscriptions are for demo purposes only.
          </Text>
          <Text style={[styles.footerText, { color: colors.muted }]}>
            In production, payments would be processed via Stripe.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  backButton: { padding: 8 },
  headerTitle: { flex: 1, fontSize: 17, fontWeight: '600', textAlign: 'center' },
  placeholder: { width: 40 },
  scroll: { padding: 16, gap: 16 },
  heroSection: { marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 16, lineHeight: 24 },
  trialBanner: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16 },
  trialContent: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  trialEmoji: { fontSize: 32 },
  trialText: {},
  trialTitle: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  trialDescription: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2 },
  trialStatus: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1, gap: 12 },
  trialStatusText: {},
  trialStatusTitle: { fontSize: 14, fontWeight: '600' },
  trialStatusDays: { fontSize: 15, fontWeight: '700', marginTop: 2 },
  card: { borderRadius: 16, padding: 20, gap: 10 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginBottom: 4 },
  badgeText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  planHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  planName: { fontSize: 22, fontWeight: '700' },
  currentBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  currentBadgeText: { fontSize: 12, fontWeight: '600' },
  planTagline: { fontSize: 14 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: 4 },
  price: { fontSize: 32, fontWeight: '700' },
  priceUnit: { fontSize: 16 },
  yearlyPrice: { fontSize: 13 },
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.1)', marginVertical: 8 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureText: { fontSize: 14, flex: 1 },
  button: { marginTop: 8, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  buttonText: { fontSize: 16, fontWeight: '600' },
  footer: { alignItems: 'center', paddingVertical: 16, gap: 4 },
  footerText: { fontSize: 12, textAlign: 'center' },
});
