import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/use-colors';
import { trpc } from '@/lib/trpc';
import { Icon } from '@/components/ui/app-icons';
import { GlassPanel } from '@/components/ui/glass-panel';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function JobList() {
    const router = useRouter();
    const colors = useColors();
    const { data: jobs, isLoading } = trpc.job.listMine.useQuery();

    const CONTENT_PADDING_BOTTOM = 100;

    const renderItem = ({ item, index }: { item: any, index: number }) => (
        <Animated.View entering={FadeInDown.delay(index * 100)}>
            <GlassPanel style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.jobTitle, { color: colors.foreground }]}>{item.title}</Text>
                        <Text style={[styles.jobType, { color: colors.muted }]}>{item.contractType}</Text>
                    </View>
                    <View style={[
                        styles.statusBadge,
                        { backgroundColor: item.status === 'active' ? '#10B98120' : '#6B728020' }
                    ]}>
                        <Text style={[
                            styles.statusText,
                            { color: item.status === 'active' ? '#10B981' : '#6B7280' }
                        ]}>
                            {item.status}
                        </Text>
                    </View>
                </View>

                <View style={styles.cardFooter}>
                    <View style={styles.statRow}>
                        <Icon name="User" size={14} color={colors.muted} />
                        <Text style={[styles.statText, { color: colors.muted }]}>{item.views || 0} views</Text>
                    </View>

                    <Pressable
                        onPress={() => router.push(`/b2b/edit-job?id=${item.id}` as any)}
                        style={({ pressed }) => [
                            styles.editBtn,
                            { backgroundColor: colors.surface, opacity: pressed ? 0.7 : 1 }
                        ]}
                    >
                        <Icon name="Settings" size={14} color={colors.foreground} />
                        <Text style={[styles.btnText, { color: colors.foreground }]}>Edit</Text>
                    </Pressable>
                </View>
            </GlassPanel>
        </Animated.View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <FlatList
                data={jobs || []}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 20, paddingBottom: CONTENT_PADDING_BOTTOM, gap: 16 }}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <Text style={[styles.subtitle, { color: colors.muted }]}>Manage your active listings</Text>
                        <Pressable
                            onPress={() => router.push('/b2b/dashboard/jobs/add' as any)}
                            style={[styles.addBtn, { backgroundColor: colors.primary }]}
                        >
                            <Icon name="Plus" size={20} color="#FFF" />
                            <Text style={styles.addBtnText}>Post Job</Text>
                        </Pressable>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    subtitle: {
        fontSize: 14,
    },
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        gap: 6,
    },
    addBtnText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 14,
    },
    card: {
        padding: 16,
        borderRadius: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    jobTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    jobType: {
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(150,150,150,0.1)',
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statText: {
        fontSize: 12,
    },
    editBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 6,
    },
    btnText: {
        fontSize: 12,
        fontWeight: '600',
    }
});
