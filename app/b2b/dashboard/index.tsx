import { View, Text, StyleSheet, ScrollView, RefreshControl, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/use-colors';
import { trpc } from '@/lib/trpc';
import { Icon, IconName } from '@/components/ui/app-icons';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Pressable } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Helper: Dynamic Greeting
function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
}

export default function DashboardOverview() {
    const colors = useColors();
    const router = useRouter();

    const { data: apiBusiness, isLoading, refetch } = trpc.business.getMine.useQuery();
    const utils = trpc.useUtils();

    const isPremium = apiBusiness?.subscriptions?.[0]?.plan === 'premium';

    const upgradeToPremium = trpc.business.upgradeToPremium.useMutation({
        onSuccess: async () => {
            await utils.business.getMine.invalidate();
            alert("Upgraded to Premium (Mock)!");
        }
    });

    const CONTENT_PADDING_BOTTOM = 120; // For floating tab bar

    // Bento Grid Stat Cards Data
    const STATS: { label: string; value: string | number; icon: IconName; trend?: string; color: string }[] = [
        { label: 'Views', value: '1.2K', icon: 'Star', trend: '+12%', color: '#8B5CF6' },
        { label: 'Orders', value: 48, icon: 'Coffee', trend: '+5%', color: '#D97706' },
        { label: 'Applied', value: 12, icon: 'User', trend: '+2', color: '#10B981' },
    ];

    const QUICK_ACTIONS: { title: string; icon: IconName; route: string; color: string }[] = [
        { title: 'Post Job', icon: 'Plus', route: '/b2b/dashboard/jobs/add', color: '#10B981' },
        { title: 'Add Product', icon: 'Coffee', route: '/b2b/dashboard/products', color: '#D97706' },
    ];

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={{ paddingBottom: CONTENT_PADDING_BOTTOM, paddingHorizontal: 16, paddingTop: 8 }}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={colors.foreground} />}
        >
            {/* Greeting Header */}
            <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
                <View>
                    <Text style={[styles.greeting, { color: colors.muted }]}>{getGreeting()}</Text>
                    <Text style={[styles.businessName, { color: colors.foreground }]}>
                        {apiBusiness?.name || 'Demo Cafe'}
                    </Text>
                </View>
                <Pressable
                    onPress={() => {
                        if (apiBusiness?.id && !isPremium) {
                            upgradeToPremium.mutate({ businessId: apiBusiness.id });
                        }
                    }}
                    style={[styles.statusBadge, { backgroundColor: isPremium ? '#10B981' : '#D97706' }]}
                >
                    <Icon name={isPremium ? 'Check' : 'Star'} size={14} color="#FFF" />
                    <Text style={styles.badgeText}>{isPremium ? 'Premium' : 'Upgrade'}</Text>
                </Pressable>
            </Animated.View>

            {/* Bento Grid: Stats */}
            <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.bentoGrid}>
                {/* Main Stat (Larger) */}
                <Pressable style={({ pressed }) => [styles.bentoLarge, pressed && styles.pressed]}>
                    <LinearGradient
                        colors={['#8B5CF620', '#8B5CF605']}
                        style={styles.bentoGradient}
                    >
                        <View style={[styles.bentoIconBox, { backgroundColor: '#8B5CF630' }]}>
                            <Icon name="Star" size={28} color="#8B5CF6" />
                        </View>
                        <View style={styles.bentoTextBlock}>
                            <Text style={[styles.bentoValue, { color: colors.foreground }]}>1.2K</Text>
                            <Text style={[styles.bentoLabel, { color: colors.muted }]}>Total Views</Text>
                        </View>
                        <View style={styles.bentoTrendBadge}>
                            <Text style={styles.bentoTrendText}>+12%</Text>
                        </View>
                    </LinearGradient>
                </Pressable>

                {/* Small Stats (2 Column) */}
                <View style={styles.bentoSmallColumn}>
                    {STATS.slice(1).map((stat, i) => (
                        <Pressable
                            key={i}
                            style={({ pressed }) => [
                                styles.bentoSmall,
                                { backgroundColor: stat.color + '10' },
                                pressed && styles.pressed
                            ]}
                        >
                            <View style={[styles.bentoSmallIcon, { backgroundColor: stat.color + '30' }]}>
                                <Icon name={stat.icon} size={20} color={stat.color} />
                            </View>
                            <Text style={[styles.bentoSmallValue, { color: colors.foreground }]}>{stat.value}</Text>
                            <Text style={[styles.bentoSmallLabel, { color: colors.muted }]}>{stat.label}</Text>
                            {stat.trend && (
                                <Text style={[styles.bentoSmallTrend, { color: stat.color }]}>{stat.trend}</Text>
                            )}
                        </Pressable>
                    ))}
                </View>
            </Animated.View>

            {/* Quick Actions */}
            <Animated.View entering={FadeInDown.delay(400).springify()}>
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Quick Actions</Text>
                <View style={styles.actionsRow}>
                    {QUICK_ACTIONS.map((action, i) => (
                        <Pressable
                            key={i}
                            onPress={() => router.push(action.route as any)}
                            style={({ pressed }) => [
                                styles.actionBtn,
                                { backgroundColor: colors.surface, borderColor: colors.border },
                                pressed && styles.pressed
                            ]}
                        >
                            <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                                <Icon name={action.icon} size={22} color={action.color} />
                            </View>
                            <Text style={[styles.actionLabel, { color: colors.foreground }]}>{action.title}</Text>
                            <Icon name="Forward" size={18} color={colors.muted} />
                        </Pressable>
                    ))}
                </View>
            </Animated.View>

            {/* Insight Card */}
            <Animated.View entering={FadeInDown.delay(500).springify()}>
                <GlassPanel style={styles.insightCard}>
                    <View style={styles.insightHeader}>
                        <Icon name="Info" size={20} color={colors.primary} />
                        <Text style={[styles.insightTitle, { color: colors.foreground }]}>Business Tip</Text>
                    </View>
                    <Text style={[styles.insightText, { color: colors.muted }]}>
                        Your cafe profile is 85% complete. Adding more photos can increase engagement by up to 40%.
                    </Text>
                    <Pressable style={[styles.insightCta, { backgroundColor: colors.primary + '20' }]}>
                        <Text style={[styles.insightCtaText, { color: colors.primary }]}>Complete Profile</Text>
                    </Pressable>
                </GlassPanel>
            </Animated.View>
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
        marginBottom: 20,
        paddingTop: 4,
    },
    greeting: {
        fontSize: 14,
        fontWeight: '500',
    },
    businessName: {
        fontSize: 28,
        fontWeight: '800',
        letterSpacing: -0.5,
        marginTop: 2,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    badgeText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 12,
    },
    // Bento Grid
    bentoGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    bentoLarge: {
        flex: 1.2,
        borderRadius: 24,
        overflow: 'hidden',
    },
    bentoGradient: {
        padding: 20,
        minHeight: 180,
        justifyContent: 'space-between',
        borderRadius: 24,
    },
    bentoIconBox: {
        width: 52,
        height: 52,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bentoTextBlock: {
        marginTop: 12,
    },
    bentoValue: {
        fontSize: 36,
        fontWeight: '900',
        letterSpacing: -1,
    },
    bentoLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginTop: 2,
    },
    bentoTrendBadge: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: '#10B98120',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    bentoTrendText: {
        color: '#10B981',
        fontWeight: '700',
        fontSize: 12,
    },
    bentoSmallColumn: {
        flex: 1,
        gap: 12,
    },
    bentoSmall: {
        flex: 1,
        borderRadius: 20,
        padding: 14,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    bentoSmallIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    bentoSmallValue: {
        fontSize: 22,
        fontWeight: '800',
    },
    bentoSmallLabel: {
        fontSize: 12,
        fontWeight: '500',
        marginTop: 2,
    },
    bentoSmallTrend: {
        fontSize: 11,
        fontWeight: '700',
        marginTop: 6,
    },
    pressed: {
        opacity: 0.85,
        transform: [{ scale: 0.98 }],
    },
    // Section
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 14,
    },
    actionsRow: {
        gap: 12,
        marginBottom: 24,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 16,
        borderWidth: 1,
        gap: 12,
    },
    actionIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionLabel: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
    },
    // Insight Card
    insightCard: {
        padding: 18,
        borderRadius: 20,
    },
    insightHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
    },
    insightTitle: {
        fontSize: 15,
        fontWeight: '700',
    },
    insightText: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 14,
    },
    insightCta: {
        alignSelf: 'flex-start',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
    },
    insightCtaText: {
        fontWeight: '700',
        fontSize: 13,
    },
});
