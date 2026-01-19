import { View, Text, FlatList, StyleSheet, Pressable, Alert } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { PremiumCard } from '@/components/ui/premium-card';
import { useColors } from '@/hooks/use-colors';
import { trpc } from '@/lib/trpc';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PremiumButton } from '@/components/ui/premium-button';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function JobsManager() {
    const colors = useColors();
    const router = useRouter();

    const { data: business } = trpc.business.getMine.useQuery();
    const { data: jobs, refetch } = trpc.job.listByBusiness.useQuery(
        { businessId: business?.id! },
        { enabled: !!business }
    );

    const deleteJob = trpc.job.delete.useMutation({
        onSuccess: () => refetch()
    });

    const confirmDelete = (id: number, title: string) => {
        Alert.alert(
            'Delete Job Listing',
            `Are you sure you want to delete "${title}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deleteJob.mutate({ id }) }
            ]
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return colors.success;
            case 'paused': return colors.warning;
            case 'filled': return colors.primary;
            default: return colors.muted;
        }
    };

    const getContractIcon = (type: string) => {
        switch (type) {
            case 'full-time': return 'briefcase.fill';
            case 'part-time': return 'clock.fill';
            case 'contract': return 'doc.text.fill';
            case 'internship': return 'graduationcap.fill';
            case 'seasonal': return 'leaf.fill';
            default: return 'briefcase';
        }
    };

    if (!business) {
        return (
            <ScreenContainer>
                <View style={styles.loadingContainer}>
                    <Text style={{ color: colors.muted }}>Loading...</Text>
                </View>
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
                </Pressable>
                <View style={styles.headerRow}>
                    <View>
                        <Text style={[styles.title, { color: colors.foreground }]}>Job Listings</Text>
                        <Text style={[styles.subtitle, { color: colors.muted }]}>
                            {jobs?.filter(j => j.status === 'active').length || 0} active, {jobs?.length || 0} total
                        </Text>
                    </View>
                    <PremiumButton
                        size="sm"
                        onPress={() => router.push('/b2b/add-job')}
                        leftIcon={<IconSymbol name="plus" size={16} color="#FFF" />}
                    >
                        Post Job
                    </PremiumButton>
                </View>
            </View>

            <FlatList
                data={jobs}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <View style={styles.emptyState}>
                        <IconSymbol name="person.badge.plus" size={64} color={colors.muted} />
                        <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No job listings</Text>
                        <Text style={[styles.emptyDescription, { color: colors.muted }]}>
                            Post your first job to start finding great baristas and staff.
                        </Text>
                        <PremiumButton
                            onPress={() => router.push('/b2b/add-job')}
                            style={{ marginTop: 20 }}
                        >
                            Post Your First Job
                        </PremiumButton>
                    </View>
                )}
                renderItem={({ item, index }) => (
                    <Animated.View entering={FadeInDown.delay(index * 80).springify()}>
                        <PremiumCard style={styles.card} elevated>
                            <View style={styles.cardHeader}>
                                <View style={[styles.typeIcon, { backgroundColor: colors.primary + '20' }]}>
                                    <IconSymbol
                                        name={getContractIcon(item.contractType) as any}
                                        size={24}
                                        color={colors.primary}
                                    />
                                </View>
                                <View style={styles.titleSection}>
                                    <Text style={[styles.jobTitle, { color: colors.foreground }]} numberOfLines={1}>
                                        {item.title}
                                    </Text>
                                    <View style={styles.contractRow}>
                                        <View style={[styles.contractBadge, { backgroundColor: colors.surface }]}>
                                            <Text style={[styles.contractText, { color: colors.foreground }]}>
                                                {item.contractType?.replace('-', ' ').toUpperCase()}
                                            </Text>
                                        </View>
                                        {item.workingHours && (
                                            <Text style={[styles.hoursText, { color: colors.muted }]}>
                                                {item.workingHours}
                                            </Text>
                                        )}
                                    </View>
                                </View>
                                <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status || 'draft') }]} />
                            </View>

                            <View style={styles.salaryRow}>
                                <IconSymbol name="banknote" size={18} color={colors.success} />
                                <Text style={[styles.salaryText, { color: colors.success }]}>
                                    {item.netSalaryMin?.toLocaleString()} - {item.netSalaryMax?.toLocaleString()} Ft / month
                                </Text>
                            </View>

                            <Text style={[styles.description, { color: colors.muted }]} numberOfLines={2}>
                                {item.description}
                            </Text>

                            <View style={styles.footer}>
                                <Text style={[styles.dateText, { color: colors.muted }]}>
                                    Posted {new Date(item.createdAt).toLocaleDateString()}
                                </Text>
                                <View style={styles.actions}>
                                    <Pressable
                                        onPress={() => router.push({ pathname: '/b2b/edit-job', params: { id: item.id } })}
                                        style={[styles.actionButton, { backgroundColor: colors.surface }]}
                                    >
                                        <IconSymbol name="pencil" size={16} color={colors.foreground} />
                                    </Pressable>
                                    <Pressable
                                        onPress={() => confirmDelete(item.id, item.title)}
                                        style={[styles.actionButton, { backgroundColor: colors.surface }]}
                                    >
                                        <IconSymbol name="trash" size={16} color={colors.destructive} />
                                    </Pressable>
                                </View>
                            </View>
                        </PremiumCard>
                    </Animated.View>
                )}
            />
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        padding: 20,
        paddingBottom: 12,
    },
    backButton: {
        marginBottom: 16,
        width: 40,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
    },
    subtitle: {
        fontSize: 14,
        marginTop: 2,
    },
    listContent: {
        padding: 20,
        paddingTop: 8,
        gap: 16,
    },
    emptyState: {
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginTop: 16,
    },
    emptyDescription: {
        fontSize: 15,
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 22,
    },
    card: {
        padding: 16,
        gap: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    typeIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleSection: {
        flex: 1,
        gap: 6,
    },
    jobTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    contractRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    contractBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    contractText: {
        fontSize: 10,
        fontWeight: '700',
    },
    hoursText: {
        fontSize: 12,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    salaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    salaryText: {
        fontSize: 15,
        fontWeight: '600',
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    dateText: {
        fontSize: 12,
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
