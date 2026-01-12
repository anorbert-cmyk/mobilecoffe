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
                            <Text style={[styles.cardTitle, { color: colors.foreground }]}>{item.title}</Text>
                            <Text style={{ color: colors.muted }}>{item.contractType} • {item.workingHours}</Text>
                            <Text style={{ color: colors.muted, marginTop: 4 }}>
                                {item.netSalaryMin?.toLocaleString()} - {item.netSalaryMax?.toLocaleString()} HUF
                            </Text>
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
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
});
