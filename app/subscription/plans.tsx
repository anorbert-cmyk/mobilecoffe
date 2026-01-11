import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useSubscription } from '@/lib/subscription/subscription-provider';
import { subscriptionPlans } from '@/data/subscriptions';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function SubscriptionPlansScreen() {
  const colors = useColors();
  const { tier, setSubscription } = useSubscription();

  const handleSelectPlan = async (planTier: 'free' | 'enthusiast' | 'pro') => {
    if (planTier === 'free') {
      await setSubscription('free', false);
      router.back();
    } else {
      // Mock subscription (in production, integrate Stripe)
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      await setSubscription(planTier, false, expiresAt.toISOString());
      router.back();
    }
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>Choose Your Plan</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Unlock premium features and master your coffee craft
          </Text>
        </View>

        {subscriptionPlans.map(plan => (
          <View key={plan.id} style={[styles.card, { backgroundColor: colors.surface, borderColor: plan.popular ? colors.primary : colors.border }]}>
            {plan.popular && (
              <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                <Text style={styles.badgeText}>MOST POPULAR</Text>
              </View>
            )}
            <Text style={[styles.planName, { color: colors.foreground }]}>{plan.name}</Text>
            <Text style={[styles.planTagline, { color: colors.muted }]}>{plan.tagline}</Text>
            <View style={styles.priceRow}>
              <Text style={[styles.price, { color: colors.foreground }]}>
                {plan.price === 0 ? 'Free' : `$${plan.price}`}
              </Text>
              {plan.price > 0 && <Text style={[styles.priceUnit, { color: colors.muted }]}>/month</Text>}
            </View>
            {plan.features.map((feature, idx) => (
              <View key={idx} style={styles.featureRow}>
                <IconSymbol name="checkmark" size={16} color={colors.primary} />
                <Text style={[styles.featureText, { color: colors.foreground }]}>{feature}</Text>
              </View>
            ))}
            <Pressable
              onPress={() => handleSelectPlan(plan.id)}
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: tier === plan.id ? colors.muted : colors.primary, opacity: pressed ? 0.8 : 1 }
              ]}
            >
              <Text style={styles.buttonText}>{tier === plan.id ? 'Current Plan' : 'Select Plan'}</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, gap: 16 },
  header: { marginBottom: 8 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 16, lineHeight: 24 },
  card: { borderRadius: 16, padding: 20, borderWidth: 2, gap: 12 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginBottom: 8 },
  badgeText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  planName: { fontSize: 24, fontWeight: '700' },
  planTagline: { fontSize: 14 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginVertical: 8 },
  price: { fontSize: 36, fontWeight: '700' },
  priceUnit: { fontSize: 16, marginLeft: 4 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureText: { flex: 1, fontSize: 15 },
  button: { marginTop: 8, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' }
});
