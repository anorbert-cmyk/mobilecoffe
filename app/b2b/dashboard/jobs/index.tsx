import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Platform, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { useColors } from '@/hooks/use-colors';
import { trpc } from '@/lib/trpc';
import { IconSymbol } from '@/components/ui/icon-symbol';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function JobList() {
    const router = useRouter();
    const colors = useColors();
    const { data: jobs, isLoading, refetch } = trpc.job.listMine.useQuery();

    const CONTENT_PADDING_BOTTOM = 120;

    const renderItem = ({ item, index }: { item: any, index: number }) => {
        const scale = useSharedValue(1);

        const animatedStyle = useAnimatedStyle(() => ({
            transform: [{ scale: scale.value }],
        }));

        const handlePress = () => {
            if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push(`/b2b/edit-job?id=${item.id}` as any);
        };

        return (
            <Animated.View entering={FadeInDown.delay(index * 100).springify().damping(15)}>
                <AnimatedPressable
                    onPress={handlePress}
                    onPressIn={() => { scale.value = withSpring(0.97); }}
                    onPressOut={() => { scale.value = withSpring(1); }}
                    style={[styles.jobCard, animatedStyle, { backgroundColor: colors.surface }]}
                >
                    <View style={styles.cardHeader}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.jobTitle, { color: colors.foreground }]}>{item.title}</Text>
                            <View style={styles.metaRow}>
                                <View style={[styles.typeBadge, { backgroundColor: colors.primary + '20' }]}>
                                    <Text style={[styles.typeText, { color: colors.primary }]}>
                                        {item.contractType?.replace('-', ' ').toUpperCase()}
                                    </Text>
                                </View>
                                {item.status === 'active' && (
                                    <View style={[styles.statusBadge, { backgroundColor: '#10B98120' }]}>
                                        <Text style={{ color: '#10B981', fontSize: 10, fontWeight: '700' }}>ACTIVE</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                        <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                            <IconSymbol name="chevron.right" size={16} color={colors.muted} />
                        </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    <View style={styles.cardFooter}>
                        <View style={styles.statItem}>
                            <IconSymbol name="eye.fill" size={14} color={colors.muted} />
                            <Text style={[styles.statText, { color: colors.muted }]}>{item.views || 0} views</Text>
                        </View>
                        <View style={styles.statItem}>
                            <IconSymbol name="clock.fill" size={14} color={colors.muted} />
                            <Text style={[styles.statText, { color: colors.muted }]}>
                                {new Date(item.createdAt).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>
                </AnimatedPressable>
            </Animated.View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: colors.foreground }]}>Job Listings</Text>
                <Text style={[styles.headerSubtitle, { color: colors.muted }]}>
                    Find the perfect talent for your team
                </Text>
            </View>

            <FlatList
                data={jobs || []}
                renderItem={renderItem}
                contentContainerStyle={[styles.listContent, { paddingBottom: CONTENT_PADDING_BOTTOM }]}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={colors.foreground} />}
                ListEmptyComponent={() => (
                    <View style={styles.emptyState}>
                        <View style={[styles.emptyIconContainer, { backgroundColor: colors.surface }]}>
                            <IconSymbol name="person.crop.circle.badge.plus" size={48} color={colors.muted} />
                        </View>
                        <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No active jobs</Text>
                        <Text style={[styles.emptyDescription, { color: colors.muted }]}>
                            Create a job posting to start receiving applications from baristas.
                        </Text>
                    </View>
                )}
            />

            {/* Floating Add Button */}
            <Pressable
                onPress={() => {
                    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    router.push('/b2b/dashboard/jobs/add' as any);
                }}
                style={({ pressed }) => [styles.fab, { opacity: pressed ? 0.9 : 1 }]}
            >
                <LinearGradient
                    colors={['#10B981', '#059669']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.fabGradient}
                >
                    <IconSymbol name="plus" size={24} color="#FFF" />
                    <Text style={styles.fabText}>Post Job</Text>
                </LinearGradient>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '800',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 15,
    },
    listContent: {
        paddingHorizontal: 20,
        gap: 16,
    },
    jobCard: {
        borderRadius: 20,
        padding: 16,
        // Shadow (subtle)
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    jobTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    typeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    typeText: {
        fontSize: 10,
        fontWeight: '700',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    divider: {
        height: 1,
        width: '100%',
        marginVertical: 12,
        opacity: 0.5,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statText: {
        fontSize: 12,
        fontWeight: '500',
    },

    // Empty State
    emptyState: {
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 40,
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
    },
    emptyDescription: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },

    // FAB
    fab: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 100 : 80,
        right: 20,
        borderRadius: 28,
        overflow: 'hidden',
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 12,
    },
    fabGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 20,
        paddingVertical: 14,
    },
    fabText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '700',
    },
});
