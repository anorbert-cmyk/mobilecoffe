import { View, Text, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { trpc } from '@/lib/trpc';
import { PremiumButton } from '@/components/ui/premium-button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useState } from 'react';

const PLANS = [
    {
        id: 'free',
        name: 'Starter',
        price: 'Free',
        features: ['1 Active Job Listing', 'Basic Cafe Profile', '3 Products Max'],
        color: '#9CA3AF',
        btnText: 'Current Plan',
        disabled: true
    },
    {
        id: 'premium',
        name: 'Growth',
        price: '9.900 Ft',
        period: '/mo',
        features: ['5 Active Job Listings', 'Verified Badge', 'Unlimited Products', 'Priority Support'],
        color: '#3B82F6',
        popular: true,
        btnText: 'Upgrade to Growth'
    },
    {
        id: 'scale',
        name: 'Scale',
        price: '24.900 Ft',
        period: '/mo',
        features: ['Unlimited Jobs', 'Featured Listings (2x)', 'Advanced Analytics', 'SMS Candidates'],
        color: '#8B5CF6',
        btnText: 'Upgrade to Scale'
    }
];

export default function SubscriptionScreen() {
    const colors = useColors();
    const { data: business } = trpc.business.getMine.useQuery();
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

    const currentPlan = business?.subscriptions?.[0]?.plan || 'free';

    const handleUpgrade = (planId: string) => {
        setLoadingPlan(planId);
        // Mock API call
        setTimeout(() => {
            setLoadingPlan(null);
            Alert.alert('Upgrade Successful', `Welcome to the ${planId.toUpperCase()} plan! (Mock)`);
        }, 1500);
    };

    return (
        <ScreenContainer>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.foreground }]}>Choose Your Plan</Text>
                    <Text style={{ color: colors.muted, textAlign: 'center' }}>
                        Scale your coffee business with the right tools.
                    </Text>
                </View>

                <View style={styles.grid}>
                    {PLANS.map((plan) => {
                        const isCurrent = currentPlan === plan.id;
                        return (
                            <View
                                key={plan.id}
                                style={[
                                    styles.card,
                                    { backgroundColor: colors.surface, borderColor: plan.popular ? plan.color : 'transparent', borderWidth: plan.popular ? 2 : 0 }
                                ]}
                            >
                                {plan.popular && (
                                    <View style={[styles.badge, { backgroundColor: plan.color }]}>
                                        <Text style={styles.badgeText}>MOST POPULAR</Text>
                                    </View>
                                )}

                                <Text style={[styles.planName, { color: plan.popular ? plan.color : colors.foreground }]}>
                                    {plan.name}
                                </Text>
                                <View style={styles.priceRow}>
                                    <Text style={[styles.price, { color: colors.foreground }]}>{plan.price}</Text>
                                    {plan.period && <Text style={{ color: colors.muted }}>{plan.period}</Text>}
                                </View>

                                <View style={styles.divider} />

                                <View style={styles.features}>
                                    {plan.features.map((feature, i) => (
                                        <View key={i} style={styles.featureRow}>
                                            <IconSymbol name="checkmark.circle.fill" size={16} color={plan.color} />
                                            <Text style={[styles.featureText, { color: colors.muted }]}>{feature}</Text>
                                        </View>
                                    ))}
                                </View>

                                <View style={{ marginTop: 'auto', width: '100%', paddingTop: 20 }}>
                                    <PremiumButton
                                        variant={isCurrent ? 'ghost' : (plan.popular ? 'primary' : 'outline')}
                                        onPress={() => !isCurrent && handleUpgrade(plan.id)}
                                        loading={loadingPlan === plan.id}
                                        disabled={isCurrent || plan.disabled}
                                    >
                                        {isCurrent ? 'Active Plan' : plan.btnText}
                                    </PremiumButton>
                                </View>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 32,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    grid: {
        gap: 20,
    },
    card: {
        padding: 24,
        borderRadius: 24,
        alignItems: 'flex-start',
        position: 'relative',
        overflow: 'hidden',
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderBottomLeftRadius: 12,
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    planName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
        marginBottom: 20,
    },
    price: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        width: '100%',
        marginBottom: 20,
    },
    features: {
        gap: 12,
        marginBottom: 20,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    featureText: {
        fontSize: 14,
    },
});
