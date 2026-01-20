import { View, Text, StyleSheet, Pressable, Dimensions, Platform, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring, interpolate, useAnimatedScrollHandler } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

import { useColors } from '@/hooks/use-colors';
import { trpc } from '@/lib/trpc';
import { Icon, IconName } from '@/components/ui/app-icons';

const { width } = Dimensions.get('window');
const SPACING = 20;
const CARD_HEIGHT = 180;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Helper: Dynamic Greeting
function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
}

// Action Card Component (Learn-style)
function ActionCard({
    title,
    subtitle,
    icon,
    color,
    index,
    onPress
}: {
    title: string;
    subtitle: string;
    icon: IconName;
    color: string;
    index: number;
    onPress: () => void;
}) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Animated.View entering={FadeInDown.delay(300 + index * 100).springify().damping(15)} style={{ marginBottom: 16 }}>
            <AnimatedPressable
                onPress={() => {
                    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onPress();
                }}
                onPressIn={() => { scale.value = withSpring(0.97); }}
                onPressOut={() => { scale.value = withSpring(1); }}
                style={[styles.actionCard, animatedStyle]}
            >
                <LinearGradient
                    colors={[color + '30', color + '10', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.actionCardGradient}
                >
                    <View style={styles.actionCardContent}>
                        <View style={[styles.actionCardIcon, { backgroundColor: color + '40' }]}>
                            <Icon name={icon} size={28} color={color} />
                        </View>
                        <View style={styles.actionCardText}>
                            <Text style={styles.actionCardTitle}>{title}</Text>
                            <Text style={styles.actionCardSubtitle}>{subtitle}</Text>
                        </View>
                        <BlurView intensity={30} style={styles.chevronBadge}>
                            <Icon name="Forward" size={18} color="#FFF" />
                        </BlurView>
                    </View>
                </LinearGradient>
            </AnimatedPressable>
        </Animated.View>
    );
}

export default function DashboardOverview() {
    const colors = useColors();
    const router = useRouter();
    const scrollY = useSharedValue(0);

    const { data: apiBusiness, isLoading, refetch } = trpc.business.getMine.useQuery();
    const utils = trpc.useUtils();

    const isPremium = apiBusiness?.subscriptions?.[0]?.plan === 'premium';

    const upgradeToPremium = trpc.business.upgradeToPremium.useMutation({
        onSuccess: async () => {
            await utils.business.getMine.invalidate();
            alert("Upgraded to Premium!");
        }
    });

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    const heroImageStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: interpolate(
                        scrollY.value,
                        [-200, 0, 200],
                        [-60, 0, 60]
                    ),
                },
                {
                    scale: interpolate(
                        scrollY.value,
                        [-200, 0],
                        [1.4, 1],
                        'clamp'
                    )
                }
            ],
        };
    });

    const STATS = [
        { label: 'Views', value: '1.2K', icon: 'Star' as IconName },
        { label: 'Orders', value: '48', icon: 'Coffee' as IconName },
        { label: 'Jobs', value: '3', icon: 'Jobs' as IconName },
    ];

    const ACTIONS = [
        { title: 'Post a Job', subtitle: 'Find baristas & staff', icon: 'Plus' as IconName, color: '#10B981', route: '/b2b/dashboard/jobs/add' },
        { title: 'Manage Menu', subtitle: 'Add or edit products', icon: 'Coffee' as IconName, color: '#D97706', route: '/b2b/dashboard/products' },
        { title: 'View Analytics', subtitle: 'Track your performance', icon: 'Star' as IconName, color: '#8B5CF6', route: '/b2b/dashboard/events' },
    ];

    return (
        <View style={[styles.screen, { backgroundColor: colors.background }]}>
            <Animated.ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#FFF" />}
            >
                {/* Hero Section */}
                <View style={styles.heroContainer}>
                    <Animated.Image
                        source={require('@/assets/images/learn_hero.png')}
                        style={[styles.heroImage, heroImageStyle]}
                    />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.5)', colors.background]}
                        style={styles.heroGradient}
                        locations={[0, 0.5, 1]}
                    />
                    <View style={styles.heroContent}>
                        <Animated.Text entering={FadeInDown.delay(100).springify()} style={styles.heroEyebrow}>
                            {getGreeting().toUpperCase()}
                        </Animated.Text>
                        <Animated.Text entering={FadeInDown.delay(200).springify()} style={styles.heroTitle}>
                            {apiBusiness?.name || 'Your Business'}
                        </Animated.Text>
                        {!isPremium && (
                            <Animated.View entering={FadeInDown.delay(300).springify()}>
                                <Pressable
                                    onPress={() => {
                                        if (apiBusiness?.id) {
                                            upgradeToPremium.mutate({ businessId: apiBusiness.id });
                                        }
                                    }}
                                    style={styles.upgradeBtn}
                                >
                                    <Icon name="Star" size={16} color="#FFF" />
                                    <Text style={styles.upgradeText}>Upgrade to Premium</Text>
                                </Pressable>
                            </Animated.View>
                        )}
                    </View>
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    {STATS.map((stat, i) => (
                        <BlurView
                            key={i}
                            intensity={Platform.OS === 'ios' ? 25 : 0}
                            style={[styles.statItem, { backgroundColor: Platform.OS === 'android' ? colors.surface : undefined }]}
                        >
                            <Icon name={stat.icon} size={20} color={colors.primary} />
                            <View>
                                <Text style={[styles.statValue, { color: colors.foreground }]}>{stat.value}</Text>
                                <Text style={[styles.statLabel, { color: colors.muted }]}>{stat.label}</Text>
                            </View>
                        </BlurView>
                    ))}
                </View>

                {/* Section Title */}
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Quick Actions</Text>

                {/* Action Cards */}
                {ACTIONS.map((action, i) => (
                    <ActionCard
                        key={i}
                        title={action.title}
                        subtitle={action.subtitle}
                        icon={action.icon}
                        color={action.color}
                        index={i}
                        onPress={() => router.push(action.route as any)}
                    />
                ))}

                {/* Tip Card */}
                <Animated.View entering={FadeInDown.delay(700).springify()}>
                    <BlurView intensity={Platform.OS === 'ios' ? 20 : 0} style={[styles.tipCard, { backgroundColor: Platform.OS === 'android' ? colors.surface : undefined }]}>
                        <View style={styles.tipHeader}>
                            <Icon name="Info" size={18} color={colors.primary} />
                            <Text style={[styles.tipTitle, { color: colors.foreground }]}>Business Tip</Text>
                        </View>
                        <Text style={[styles.tipText, { color: colors.muted }]}>
                            Complete your cafe profile to attract more customers and rank higher in search.
                        </Text>
                    </BlurView>
                </Animated.View>

            </Animated.ScrollView>
        </View>
    );
}

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
        resizeMode: 'cover',
    },
    heroGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    heroContent: {
        padding: 24,
        paddingBottom: 60,
    },
    heroEyebrow: {
        color: '#D97706',
        fontSize: 12,
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
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
        marginBottom: 16,
    },
    upgradeBtn: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#D97706',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
    },
    upgradeText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 14,
    },
    // Stats
    statsRow: {
        flexDirection: 'row',
        paddingHorizontal: SPACING,
        gap: 12,
        marginBottom: 28,
    },
    statItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
    },
    statLabel: {
        fontSize: 11,
    },
    // Section
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        paddingHorizontal: SPACING,
        marginBottom: 16,
    },
    // Action Cards
    actionCard: {
        marginHorizontal: SPACING,
        height: CARD_HEIGHT,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: '#1A1A1A',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    actionCardGradient: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    actionCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionCardIcon: {
        width: 56,
        height: 56,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionCardText: {
        flex: 1,
        marginLeft: 16,
    },
    actionCardTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
    },
    actionCardSubtitle: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
    },
    chevronBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    // Tip
    tipCard: {
        marginHorizontal: SPACING,
        marginTop: 8,
        padding: 18,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    tipHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    tipTitle: {
        fontSize: 15,
        fontWeight: '700',
    },
    tipText: {
        fontSize: 14,
        lineHeight: 20,
    },
});
