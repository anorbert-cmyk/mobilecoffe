import React from 'react';
import { View, Text, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

import { useColors } from '@/hooks/use-colors';
import { trpc } from '@/lib/trpc';
import { IconSymbolName } from '@/components/ui/icon-symbol';

import { DashboardHero } from '../components/dashboard-hero';
import { DashboardStats } from '../components/dashboard-stats';
import { ActionCard } from '../components/action-card';
import { InsightCard } from '../components/insight-card';
import { DashboardStat } from '../types';

export function DashboardScreen() {
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

    const STATS: DashboardStat[] = [
        { label: 'Monthly Sales', value: '$12.4K', icon: 'dollarsign.circle.fill', trend: '+12%', color: '#10B981' },
        { label: 'Active Orders', value: 48, icon: 'cup.and.saucer.fill', trend: '+5%', color: '#D97706' },
        { label: 'Profile Views', value: '1.2K', icon: 'eye.fill', trend: '+2%', color: '#8B5CF6' },
    ];

    const ACTIONS = [
        { title: 'Post a Job', subtitle: 'Find baristas & staff', icon: 'plus' as IconSymbolName, color: '#10B981', route: '/b2b/dashboard/jobs/add' },
        { title: 'Manage Menu', subtitle: 'Add or edit products', icon: 'cup.and.saucer.fill' as IconSymbolName, color: '#D97706', route: '/b2b/dashboard/products' },
        { title: 'View Analytics', subtitle: 'Track your performance', icon: 'star.fill' as IconSymbolName, color: '#8B5CF6', route: '/b2b/dashboard/events' },
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
                <DashboardHero
                    scrollY={scrollY}
                    businessName={apiBusiness?.name}
                    isPremium={isPremium}
                    onUpgrade={() => {
                        if (apiBusiness?.id) {
                            upgradeToPremium.mutate({ businessId: apiBusiness.id });
                        }
                    }}
                    backgroundColor={colors.background}
                />

                <DashboardStats stats={STATS} colors={colors} />

                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Quick Actions</Text>

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

                <InsightCard colors={colors} />

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
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
});
