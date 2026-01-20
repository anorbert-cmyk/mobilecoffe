import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { PremiumButton } from '@/components/ui/premium-button';
import { useColors } from '@/hooks/use-colors';
import { trpc } from '@/lib/trpc';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function JobList() {
    const router = useRouter();
    const colors = useColors();

    const { data: jobs, isLoading, refetch } = trpc.job.listMine.useQuery();

    const renderItem = ({ item }: { item: any }) => (
        <View style={[styles.card, { backgroundColor: '#1c1917', borderColor: colors.border }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: colors.foreground }]}>{item.title}</Text>
                <View style={[styles.badge, { backgroundColor: item.status === 'active' ? '#10b981' : colors.muted }]}>
                    <Text style={styles.badgeText}>{item.status}</Text>
                </View>
            </View>
            <Text style={[styles.cardType, { color: colors.muted }]}>{item.contractType}</Text>
            <Text numberOfLines={2} style={[styles.cardDesc, { color: colors.muted }]}>
                {item.description}
            </Text>

            <View style={styles.cardFooter}>
                <Text style={{ color: colors.muted }}>
                    {item.views} views
                </Text>
                <PremiumButton
                    variant="ghost"
                    size="sm"
                    onPress={() => router.push(`/b2b/edit-job?id=${item.id}` as any)}
                >
                    Edit
                </PremiumButton>
            </View>
        </View>
    );

    return (
        <ScreenContainer>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.foreground }]}>My Job Posts</Text>
                <PremiumButton
                    variant="primary"
                    onPress={() => router.push('/b2b/dashboard/jobs/add' as any)}
                    leftIcon={<IconSymbol name="plus" size={20} color="white" />}
                >
                    Add Job
                </PremiumButton>
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
            ) : jobs && jobs.length > 0 ? (
                <FlatList
                    data={jobs}
                    renderItem={renderItem}
                    keyExtractor={(item) => String(item.id)}
                    contentContainerStyle={styles.list}
                    onRefresh={refetch}
                    refreshing={isLoading}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <IconSymbol name="briefcase" size={64} color={colors.muted} />
                    <Text style={[styles.emptyText, { color: colors.muted }]}>No job posts yet.</Text>
                    <PremiumButton
                        variant="secondary"
                        onPress={() => router.push('/b2b/dashboard/jobs/add' as any)}
                        style={{ marginTop: 16 }}
                    >
                        Create First Job
                    </PremiumButton>
                </View>
            )}
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    header: {
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    list: {
        padding: 24,
        paddingTop: 0,
    },
    card: {
        borderWidth: 1,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    cardType: {
        fontSize: 14,
        marginBottom: 8,
        textTransform: 'capitalize',
    },
    cardDesc: {
        fontSize: 14,
        marginBottom: 16,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
        paddingTop: 12,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    emptyText: {
        fontSize: 16,
        marginTop: 16,
        textAlign: 'center',
    },
});
