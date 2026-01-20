import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/use-colors';
import { trpc } from '@/lib/trpc';
import { Icon } from '@/components/ui/app-icons';
import { PremiumCard } from '@/components/ui/premium-card';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function DashboardOverview() {
    const colors = useColors();
    const router = useRouter();

    const { data: apiBusiness, isLoading, refetch } = trpc.business.getMine.useQuery();
    const utils = trpc.useUtils();

    const isDemo = !apiBusiness;
    const isPremium = apiBusiness?.subscriptions?.[0]?.plan === 'premium';

    const upgradeToPremium = trpc.business.upgradeToPremium.useMutation({
        onSuccess: async () => {
            await utils.business.getMine.invalidate();
            alert("Upgraded to Premium (Mock)!");
        }
    });

    // Content Padding for Float Bar
    const CONTENT_PADDING_BOTTOM = 100;

    const STATS = [
        { label: 'Views', value: 1240, icon: 'Graph' as const, trend: '+12%' },
        { label: 'Orders', value: 48, icon: 'ShoppingBag' as const, trend: '+5%' },
        { label: 'Applied', value: 12, icon: 'User' as const, trend: '+2' },
    ];

    const QUICK_ACTIONS = [
        { title: 'Post Job', icon: 'Plus', route: '/b2b/dashboard/jobs/add', color: '#10B981' },
        { title: 'New Product', icon: 'Coffee', route: '/b2b/dashboard/products', color: '#F59E0B' },
        { title: 'Edit Profile', icon: 'Settings', route: '/b2b/dashboard/settings', color: '#3B82F6' },
    ];

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={{ paddingBottom: CONTENT_PADDING_BOTTOM, padding: 20 }}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={colors.foreground} />}
        >
            {/* Header / Welcome */}
            <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
                <View>
                    <Text style={[styles.welcome, { color: colors.muted }]}>Welcome back,</Text>
                    <Text style={[styles.businessName, { color: colors.foreground }]}>
                        {apiBusiness?.name || 'Demo Coffee Shop'}
                    </Text>
                </View>
                {!isPremium ? (
                    <Pressable onPress={() => {
                        if (apiBusiness?.id) {
                            upgradeToPremium.mutate({ businessId: apiBusiness.id });
                        }
                    }} style={styles.upgradeBtn}>
                        <Icon name="Star" size={16} color="#FFF" />
                        <Text style={styles.upgradeText}>Upgrade</Text>
                    </Pressable>
                ) : (
                    <View style={styles.premiumBadge}>
                        <Icon name="Check" size={14} color="#FFF" />
                        <Text style={styles.premiumText}>Premium</Text>
                    </View>
                )}
            </Animated.View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
                {STATS.map((stat, i) => (
                    <Animated.View key={i} entering={FadeInDown.delay(200 + i * 50)} style={{ flex: 1 }}>
                        <GlassPanel style={styles.statCard}>
                            <Text style={[styles.statValue, { color: colors.foreground }]}>{stat.value}</Text>
                            <Text style={[styles.statLabel, { color: colors.muted }]}>{stat.label}</Text>
                            <Text style={styles.trend}>{stat.trend}</Text>
                        </GlassPanel>
                    </Animated.View>
                ))}
            </View>

            {/* Main Action Card */}
            <Animated.View entering={FadeInDown.delay(400)}>
                <PremiumCard style={styles.actionCard} elevated>
                    <View style={styles.cardHeader}>
                        <View style={[styles.iconBox, { backgroundColor: colors.primary + '20' }]}>
                            <Icon name="Dashboard" size={24} color={colors.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Business Health</Text>
                            <Text style={[styles.cardDesc, { color: colors.muted }]}>Your profile is 85% complete. Add more photos to attract customers.</Text>
                        </View>
                    </View>
                </PremiumCard>
            </Animated.View>

            {/* Quick Actions */}
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
                {QUICK_ACTIONS.map((action, i) => (
                    <Pressable
                        key={i}
                        onPress={() => router.push(action.route as any)}
                        style={({ pressed }) => [
                            styles.actionBtn,
                            { backgroundColor: colors.surface, transform: [{ scale: pressed ? 0.98 : 1 }] }
                        ]}
                    >
                        <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                            <Icon name={action.icon as any} size={20} color={action.color} />
                        </View>
                        <Text style={[styles.actionLabel, { color: colors.foreground }]}>{action.title}</Text>
                    </Pressable>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    welcome: {
        fontSize: 14,
        fontWeight: '500',
    },
    businessName: {
        fontSize: 24,
        fontWeight: '800',
        marginTop: 4,
    },
    upgradeBtn: {
        backgroundColor: '#F59E0B',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    upgradeText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 12,
    },
    premiumBadge: {
        backgroundColor: '#10B981',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    premiumText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 12,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        padding: 16,
        alignItems: 'center',
        borderRadius: 16,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 8,
    },
    trend: {
        fontSize: 10,
        fontWeight: '700',
        color: '#10B981',
        backgroundColor: '#10B98120',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
        marginTop: 8,
    },
    actionCard: {
        padding: 20,
        marginBottom: 24,
    },
    cardHeader: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    cardDesc: {
        fontSize: 13,
        lineHeight: 18,
    },
    actionsGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    actionBtn: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        gap: 12,
    },
    actionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionLabel: {
        fontSize: 12,
        fontWeight: '600',
    }
});
