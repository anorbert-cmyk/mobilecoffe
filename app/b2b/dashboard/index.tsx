import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { trpc } from '@/lib/trpc';
import { PremiumButton } from '@/components/ui/premium-button';
import { useRouter } from 'expo-router';

export default function DashboardOverview() {
    const colors = useColors();
    const router = useRouter();

    const { data: business, isLoading } = trpc.business.getMine.useQuery();

    if (isLoading) return <Text style={{ p: 20, color: colors.foreground }}>Loading...</Text>;
    if (!business) return <Text style={{ p: 20, color: colors.foreground }}>No business found.</Text>;

    return (
        <ScreenContainer>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={[styles.welcome, { color: colors.foreground }]}>
                    Welcome, {business.name}
                </Text>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.statValue, { color: colors.primary }]}>{business.subscriptions?.[0]?.plan?.toUpperCase() || 'FREE'}</Text>
                        <Text style={[styles.statLabel, { color: colors.muted }]}>Current Plan</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.statValue, { color: colors.foreground }]}>0</Text>
                        <Text style={[styles.statLabel, { color: colors.muted }]}>Profile Views</Text>
                    </View>
                </View>

                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Quick Actions</Text>
                <View style={styles.actions}>
                    <PremiumButton
                        variant="outline"
                        onPress={() => router.push('/b2b/add-product')}
                    >
                        Add Product
                    </PremiumButton>
                    <View style={{ height: 10 }} />
                    <PremiumButton
                        variant="outline"
                        onPress={() => router.push('/b2b/add-job')}
                    >
                        Post a Job
                    </PremiumButton>
                    <View style={{ height: 10 }} />
                    <PremiumButton
                        variant="secondary"
                        onPress={() => router.push('/cafe/' + business.id)}
                    >
                        View Public Profile
                    </PremiumButton>
                </View>

            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    welcome: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 32,
    },
    statCard: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    actions: {
        width: '100%',
    },
});
