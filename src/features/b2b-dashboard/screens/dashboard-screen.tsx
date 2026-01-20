import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform, Dimensions, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    interpolate,
    useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

import { useColors } from '@/hooks/use-colors';
import { trpc } from '@/lib/trpc';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';

const { width } = Dimensions.get('window');
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ============ TYPES ============
interface StatCardProps {
    label: string;
    value: string;
    icon: IconSymbolName;
    trend?: string;
    trendUp?: boolean;
    color: string;
    index: number;
}

interface ActionCardProps {
    title: string;
    subtitle: string;
    icon: IconSymbolName;
    color: string;
    onPress: () => void;
}

// ============ COMPONENTS ============

function StatCard({ label, value, icon, trend, trendUp, color, index }: StatCardProps) {
    const colors = useColors();
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Animated.View
            entering={FadeInDown.delay(300 + index * 100).springify().damping(15)}
            style={[styles.statCard, { backgroundColor: colors.surface }]}
        >
            <AnimatedPressable
                onPressIn={() => { scale.value = withSpring(0.96); }}
                onPressOut={() => { scale.value = withSpring(1); }}
                style={[styles.statCardInner, animatedStyle]}
            >
                <View style={[styles.statIconContainer, { backgroundColor: `${color}20` }]}>
                    <IconSymbol name={icon} size={24} color={color} />
                </View>
                <Text style={[styles.statValue, { color: colors.foreground }]}>{value}</Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>{label}</Text>
                {trend && (
                    <View style={[styles.trendBadge, { backgroundColor: trendUp ? '#10B98120' : '#EF444420' }]}>
                        <IconSymbol
                            name={trendUp ? 'arrow.up.right' : 'arrow.down.right'}
                            size={10}
                            color={trendUp ? '#10B981' : '#EF4444'}
                        />
                        <Text style={[styles.trendText, { color: trendUp ? '#10B981' : '#EF4444' }]}>{trend}</Text>
                    </View>
                )}
            </AnimatedPressable>
        </Animated.View>
    );
}

function QuickActionCard({ title, subtitle, icon, color, onPress }: ActionCardProps) {
    const colors = useColors();
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePress = () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
    };

    return (
        <AnimatedPressable
            onPress={handlePress}
            onPressIn={() => { scale.value = withSpring(0.95); }}
            onPressOut={() => { scale.value = withSpring(1); }}
            style={[styles.actionCard, animatedStyle]}
        >
            <LinearGradient
                colors={[color, `${color}CC`]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionCardGradient}
            >
                <View style={styles.actionCardContent}>
                    <View style={styles.actionIconBg}>
                        <IconSymbol name={icon} size={28} color="#FFF" />
                    </View>
                    <View style={styles.actionTextContainer}>
                        <Text style={styles.actionTitle}>{title}</Text>
                        <Text style={styles.actionSubtitle}>{subtitle}</Text>
                    </View>
                </View>
                <BlurView intensity={20} style={styles.actionChevron}>
                    <IconSymbol name="chevron.right" size={16} color="#FFF" />
                </BlurView>
            </LinearGradient>
        </AnimatedPressable>
    );
}

function ActivityItem({ title, time, icon, color }: { title: string; time: string; icon: IconSymbolName; color: string }) {
    const colors = useColors();
    return (
        <View style={[styles.activityItem, { borderColor: colors.border }]}>
            <View style={[styles.activityIcon, { backgroundColor: `${color}15` }]}>
                <IconSymbol name={icon} size={18} color={color} />
            </View>
            <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, { color: colors.foreground }]}>{title}</Text>
                <Text style={[styles.activityTime, { color: colors.muted }]}>{time}</Text>
            </View>
        </View>
    );
}

// ============ MAIN SCREEN ============

export function DashboardScreen() {
    const colors = useColors();
    const router = useRouter();
    const scrollY = useSharedValue(0);

    const { data: business, isLoading, refetch } = trpc.business.getMine.useQuery();
    const utils = trpc.useUtils();

    const isPremium = business?.subscriptions?.[0]?.plan === 'premium';

    const upgradeToPremium = trpc.business.upgradeToPremium.useMutation({
        onSuccess: async () => {
            await utils.business.getMine.invalidate();
        },
    });

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    const heroImageStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: interpolate(scrollY.value, [-300, 0, 300], [-100, 0, 100]) },
            { scale: interpolate(scrollY.value, [-300, 0], [1.5, 1], 'clamp') },
        ],
    }));

    // Greeting based on time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const STATS: StatCardProps[] = [
        { label: 'Revenue', value: '$12.4K', icon: 'chart.line.uptrend.xyaxis', trend: '+12%', trendUp: true, color: '#10B981', index: 0 },
        { label: 'Orders', value: '248', icon: 'bag.fill', trend: '+8%', trendUp: true, color: '#D97706', index: 1 },
        { label: 'Visitors', value: '1.8K', icon: 'person.2.fill', trend: '+23%', trendUp: true, color: '#8B5CF6', index: 2 },
        { label: 'Rating', value: '4.9', icon: 'star.fill', trend: '+0.2', trendUp: true, color: '#F59E0B', index: 3 },
    ];

    const ACTIONS = [
        { title: 'Post a Job', subtitle: 'Find great staff', icon: 'plus.circle.fill' as IconSymbolName, color: '#10B981' },
        { title: 'Edit Menu', subtitle: 'Update products', icon: 'pencil.circle.fill' as IconSymbolName, color: '#D97706' },
        { title: 'View Reports', subtitle: 'Analytics & insights', icon: 'chart.bar.fill' as IconSymbolName, color: '#8B5CF6' },
    ];

    const RECENT_ACTIVITY = [
        { title: 'New order received #1247', time: '2 min ago', icon: 'bag.fill' as IconSymbolName, color: '#10B981' },
        { title: 'Product "Espresso" updated', time: '1 hour ago', icon: 'cup.and.saucer.fill' as IconSymbolName, color: '#D97706' },
        { title: 'Job posting viewed 24 times', time: '3 hours ago', icon: 'eye.fill' as IconSymbolName, color: '#8B5CF6' },
    ];

    return (
        <View style={[styles.screen, { backgroundColor: colors.background }]}>
            <Animated.ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={colors.foreground} />}
            >

                {/* ============ HERO SECTION ============ */}
                <View style={styles.heroContainer}>
                    <Animated.Image
                        source={{ uri: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80' }}
                        style={[styles.heroImage, heroImageStyle]}
                    />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.4)', colors.background]}
                        style={styles.heroGradient}
                        locations={[0, 0.5, 1]}
                    />
                    <View style={styles.heroContent}>
                        <Animated.Text entering={FadeInDown.delay(100).springify()} style={styles.heroEyebrow}>
                            {getGreeting().toUpperCase()}
                        </Animated.Text>
                        <Animated.Text entering={FadeInDown.delay(200).springify()} style={styles.heroTitle}>
                            {business?.name || 'Your Business'}
                        </Animated.Text>
                        {!isPremium && (
                            <Animated.View entering={FadeInDown.delay(300).springify()}>
                                <Pressable
                                    onPress={() => {
                                        if (business?.id) {
                                            if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                            upgradeToPremium.mutate({ businessId: business.id });
                                        }
                                    }}
                                    style={styles.premiumButton}
                                >
                                    <LinearGradient
                                        colors={['#D97706', '#F59E0B']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.premiumGradient}
                                    >
                                        <IconSymbol name="star.fill" size={16} color="#FFF" />
                                        <Text style={styles.premiumText}>Upgrade to Premium</Text>
                                    </LinearGradient>
                                </Pressable>
                            </Animated.View>
                        )}
                    </View>
                </View>

                {/* ============ STATS BENTO GRID ============ */}
                <View style={styles.statsGrid}>
                    {STATS.map((stat, i) => (
                        <StatCard key={stat.label} {...stat} index={i} />
                    ))}
                </View>

                {/* ============ QUICK ACTIONS ============ */}
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Quick Actions</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.actionsScroll}
                >
                    {ACTIONS.map((action, i) => (
                        <Animated.View key={action.title} entering={FadeInDown.delay(500 + i * 100).springify()}>
                            <QuickActionCard
                                {...action}
                                onPress={() => {
                                    if (action.title === 'Post a Job') router.push('/b2b/dashboard/jobs/add' as any);
                                    if (action.title === 'Edit Menu') router.push('/b2b/dashboard/products' as any);
                                }}
                            />
                        </Animated.View>
                    ))}
                </ScrollView>

                {/* ============ RECENT ACTIVITY ============ */}
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recent Activity</Text>
                <View style={[styles.activityCard, { backgroundColor: colors.surface }]}>
                    {RECENT_ACTIVITY.map((item, i) => (
                        <ActivityItem key={i} {...item} />
                    ))}
                </View>

            </Animated.ScrollView>
        </View>
    );
}

// ============ STYLES ============

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 140,
    },

    // Hero
    heroContainer: {
        height: 320,
        width: '100%',
        overflow: 'hidden',
        marginBottom: -30,
        justifyContent: 'flex-end',
    },
    heroImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    heroGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    heroContent: {
        padding: 24,
        paddingBottom: 60,
    },
    heroEyebrow: {
        color: '#D4A574',
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 2,
        marginBottom: 8,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    heroTitle: {
        color: '#FFF',
        fontSize: 36,
        fontWeight: '800',
        lineHeight: 42,
        marginBottom: 16,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    premiumButton: {
        alignSelf: 'flex-start',
        borderRadius: 24,
        overflow: 'hidden',
    },
    premiumGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    premiumText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
    },

    // Stats Grid (Bento)
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        gap: 12,
        marginBottom: 28,
    },
    statCard: {
        width: (width - 44) / 2,
        borderRadius: 20,
        overflow: 'hidden',
    },
    statCardInner: {
        padding: 16,
    },
    statIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 13,
        fontWeight: '500',
    },
    trendBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginTop: 8,
    },
    trendText: {
        fontSize: 11,
        fontWeight: '700',
    },

    // Section Title
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        paddingHorizontal: 20,
        marginBottom: 16,
    },

    // Quick Actions
    actionsScroll: {
        paddingHorizontal: 20,
        gap: 14,
        marginBottom: 28,
    },
    actionCard: {
        width: 180,
        height: 100,
        borderRadius: 20,
        overflow: 'hidden',
    },
    actionCardGradient: {
        flex: 1,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    actionCardContent: {
        flex: 1,
        gap: 8,
    },
    actionIconBg: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionTextContainer: {
        gap: 2,
    },
    actionTitle: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '700',
    },
    actionSubtitle: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: 12,
    },
    actionChevron: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.2)',
    },

    // Recent Activity
    activityCard: {
        marginHorizontal: 20,
        borderRadius: 20,
        overflow: 'hidden',
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 14,
        borderBottomWidth: 1,
    },
    activityIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activityContent: {
        flex: 1,
    },
    activityTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2,
    },
    activityTime: {
        fontSize: 12,
    },
});
