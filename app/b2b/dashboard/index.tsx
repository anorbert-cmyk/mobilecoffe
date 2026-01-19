import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { trpc } from '@/lib/trpc';
import { PremiumButton } from '@/components/ui/premium-button';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function DashboardOverview() {
    const colors = useColors();
    const router = useRouter();

    const { data: business, isLoading } = trpc.business.getMine.useQuery();

    if (isLoading) return (
        <ScreenContainer>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: colors.foreground }}>Loading...</Text>
            </View>
        </ScreenContainer>
    );

    if (!business) return (
        <ScreenContainer>
            <View style={{ padding: 20, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, marginBottom: 16, color: colors.foreground }}>No business profile found.</Text>
                <PremiumButton onPress={() => router.push('/b2b/register')}>
                    Create Business Profile
                </PremiumButton>
            </View>
        </ScreenContainer>
    );

    const menuItems = [
        {
            title: 'Manage Jobs',
            subtitle: 'Post and track job listings',
            icon: 'briefcase.fill',
            color: '#3B82F6',
            route: '/b2b/dashboard/jobs',
        },
        {
            title: 'Manage Products',
            subtitle: 'Update menu and shop items',
            icon: 'cup.and.saucer.fill',
            color: '#F59E0B',
            route: '/b2b/dashboard/products',
        },
        {
            title: 'Manage Events',
            subtitle: 'Host cuppings and workshops',
            icon: 'calendar',
            color: '#EC4899',
            route: '/b2b/dashboard/events',
        },
        {
            title: 'Business Profile',
            subtitle: 'Edit details and appearance',
            icon: 'building.2.fill',
            color: '#10B981',
            route: '/b2b/register',
        },
    ];

    const upgradeToPremium = trpc.business.upgradeToPremium.useMutation({
        onSuccess: () => {
            // force refetch or just alert
            alert("Upgraded to Premium (Mock)!");
        }
    });

    const isPremium = business.subscriptions?.[0]?.plan === 'premium';

    return (
        <ScreenContainer>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View>
                            <Text style={[styles.welcome, { color: colors.foreground }]}>
                                {business.name}
                            </Text>
                            <Text style={[styles.role, { color: colors.muted }]}>
                                {business.type.toUpperCase()} • {(business.address as any)?.city || 'Location not set'}
                            </Text>
                        </View>
                        <View style={{ backgroundColor: colors.surface, padding: 8, borderRadius: 12, borderWidth: 1, borderColor: colors.border }}>
                            <Text style={{ fontSize: 10, color: colors.muted, textAlign: 'center' }}>BALANCE</Text>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.primary }}>125 CR</Text>
                        </View>
                    </View>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.statValue, { color: colors.primary }]}>
                            {business.subscriptions?.[0]?.plan?.toUpperCase() || 'FREE'}
                        </Text>
                        <Text style={[styles.statLabel, { color: colors.muted }]}>Current Plan</Text>
                        {!isPremium && (
                            <Pressable disabled={upgradeToPremium.isPending} onPress={() => upgradeToPremium.mutate({ businessId: business.id })}>
                                <Text style={{ color: colors.primary, fontSize: 12, marginTop: 4, fontWeight: 'bold' }}>
                                    {upgradeToPremium.isPending ? 'Upgrading...' : 'UPGRADE NOW'}
                                </Text>
                            </Pressable>
                        )}
                    </View>
                    <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.statValue, { color: colors.foreground }]}>Active</Text>
                        <Text style={[styles.statLabel, { color: colors.muted }]}>Status</Text>
                    </View>
                </View>

                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Management</Text>

                <View style={styles.menuGrid}>
                    {menuItems.map((item, index) => (
                        <Pressable
                            key={index}
                            style={({ pressed }) => [
                                styles.menuCard,
                                {
                                    backgroundColor: colors.surface,
                                    transform: [{ scale: pressed ? 0.98 : 1 }],
                                    opacity: pressed ? 0.8 : 1
                                }
                            ]}
                            onPress={() => router.push(item.route as any)}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                                <IconSymbol name={item.icon as any} size={24} color={item.color} />
                            </View>
                            <Text style={[styles.menuTitle, { color: colors.foreground }]}>{item.title}</Text>
                            <Text style={[styles.menuSubtitle, { color: colors.muted }]}>{item.subtitle}</Text>
                        </Pressable>
                    ))}
                </View>

                <View style={{ height: 24 }} />

                <PremiumButton
                    variant="outline"
                    onPress={() => router.push({ pathname: '/cafe/[id]', params: { id: business.id } })}
                    leftIcon={<IconSymbol name="eye.fill" size={20} color={colors.primary} />}
                >
                    View Public Page
                </PremiumButton>

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
        marginBottom: 24,
    },
    welcome: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    role: {
        fontSize: 16,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 32,
    },
    statCard: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
    },
    menuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    menuCard: {
        width: '48%', // roughly half width with gap
        padding: 16,
        borderRadius: 16,
        marginBottom: 4,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    menuSubtitle: {
        fontSize: 13,
        lineHeight: 18,
    },
});
