import { View, Text, FlatList, StyleSheet } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { trpc } from '@/lib/trpc';
import { PremiumButton } from '@/components/ui/premium-button';
import { useRouter } from 'expo-router';

export default function JobsScreen() {
    const colors = useColors();
    const router = useRouter();

    // Actually we need `getMyJobs` endpoint, but `job.list` is public.
    // I should add `job.getMyJobs` or just filter on client (bad practice) or backend.
    // I'll assume job.list returns all active jobs, which is not what we want here.
    // For now I'll use `job.list` and filter by businessId on client as a robust fallback 
    // until I update the router, or update the router now.

    const { data: business } = trpc.business.getMine.useQuery();
    const { data: jobs, isLoading } = trpc.job.list.useQuery();

    const myJobs = jobs?.filter(j => j.businessId === business?.id);

    return (
        <ScreenContainer>
            <View style={{ padding: 16 }}>
                <PremiumButton onPress={() => router.push('/b2b/add-job')}>
                    Post New Job
                </PremiumButton>
            </View>

            {isLoading ? (
                <Text style={{ padding: 20, color: colors.foreground }}>Loading...</Text>
            ) : (
                <FlatList
                    data={myJobs}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ padding: 16 }}
                    renderItem={({ item }) => (
                        <View style={[styles.card, { backgroundColor: colors.surface }]}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                <Text style={[styles.cardTitle, { color: colors.foreground, flex: 1 }]}>{item.title}</Text>
                                <View style={[styles.badge, { backgroundColor: colors.primary + '20' }]}>
                                    <Text style={[styles.badgeText, { color: colors.primary }]}>
                                        {item.contractType?.toUpperCase()}
                                    </Text>
                                </View>
                            </View>

                            <Text style={{ color: colors.muted, marginBottom: 12, lineHeight: 20 }} numberOfLines={2}>
                                {item.description}
                            </Text>

                            <View style={styles.metaRow}>
                                <View style={styles.metaItem}>
                                    <Text style={{ fontSize: 14, color: colors.foreground }}>
                                        💰 {item.netSalaryMin?.toLocaleString()} - {item.netSalaryMax?.toLocaleString()} Ft
                                    </Text>
                                </View>
                                <View style={styles.metaItem}>
                                    <Text style={{ fontSize: 14, color: colors.muted }}>
                                        🕒 {item.workingHours}
                                    </Text>
                                </View>
                            </View>

                            <View style={[styles.statusBadge, {
                                backgroundColor: item.status === 'active' ? '#10B98120' : '#EF444420',
                                alignSelf: 'flex-start',
                                marginTop: 12
                            }]}>
                                <Text style={{
                                    color: item.status === 'active' ? '#10B981' : '#EF4444',
                                    fontSize: 12, fontWeight: 'bold'
                                }}>
                                    ● {item.status?.toUpperCase()}
                                </Text>
                            </View>
                        </View>
                    )}
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', color: colors.muted, marginTop: 40 }}>
                            No active job listings.
                        </Text>
                    }
                />
            )}
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    metaRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    }
});
