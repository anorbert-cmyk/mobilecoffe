import { View, Text, StyleSheet } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { trpc } from '@/lib/trpc';
import { PremiumButton } from '@/components/ui/premium-button';

export default function SubscriptionScreen() {
    const colors = useColors();
    const { data: business } = trpc.business.getMine.useQuery();

    const currentPlan = business?.subscriptions?.[0]?.plan || 'free';

    return (
        <ScreenContainer>
            <View style={styles.container}>
                <Text style={[styles.title, { color: colors.foreground }]}>Subscription Plan</Text>

                <View style={[styles.card, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.planName, { color: colors.primary }]}>{currentPlan.toUpperCase()}</Text>
                    <Text style={{ color: colors.muted, marginBottom: 16 }}>
                        {currentPlan === 'free'
                            ? 'Basic features. Upgrade for Job Board & Analytics.'
                            : 'All features unlocked.'}
                    </Text>

                    {currentPlan === 'free' ? (
                        <PremiumButton variant="primary" onPress={() => { /* Trigger Stripe */ }}>
                            Upgrade to Premium (9.900 Ft/mo)
                        </PremiumButton>
                    ) : (
                        <PremiumButton variant="outline" onPress={() => { /* Manage Stripe */ }}>
                            Manage Subscription
                        </PremiumButton>
                    )}
                </View>
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    card: {
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
    },
    planName: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
    },
});
