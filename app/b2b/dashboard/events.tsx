import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { trpc } from '@/lib/trpc';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PremiumButton } from '@/components/ui/premium-button';

export default function EventsManager() {
    const colors = useColors();
    const router = useRouter();

    const { data: business } = trpc.business.getMine.useQuery();
    const { data: events, refetch } = trpc.event.listByBusiness.useQuery(
        { businessId: business?.id! },
        { enabled: !!business }
    );

    const deleteEvent = trpc.event.delete.useMutation({
        onSuccess: () => refetch()
    });

    const handleDelete = (id: number) => {
        deleteEvent.mutate({ id });
    };

    if (!business) return <ScreenContainer><Text>Loading...</Text></ScreenContainer>;

    return (
        <ScreenContainer>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={{ marginBottom: 12 }}>
                    <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
                </Pressable>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={[styles.title, { color: colors.foreground }]}>Your Events</Text>
                    <PremiumButton size="sm" onPress={() => router.push('/b2b/add-event')}>
                        + Create
                    </PremiumButton>
                </View>
            </View>

            <FlatList
                data={events}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ gap: 16, padding: 20 }}
                ListEmptyComponent={() => (
                    <View style={{ alignItems: 'center', marginTop: 40 }}>
                        <Text style={{ color: colors.muted }}>No events found.</Text>
                        <Text style={{ color: colors.muted, fontSize: 14 }}>Create one to start hosting!</Text>
                    </View>
                )}
                renderItem={({ item }) => (
                    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.cardTitle, { color: colors.foreground }]}>{item.name}</Text>
                                <Text style={{ color: colors.muted, fontSize: 14, marginBottom: 4 }}>
                                    {new Date(item.date).toLocaleDateString()} • {item.location}
                                </Text>
                                <Text style={{ color: colors.foreground }}>
                                    {item.price === 0 ? 'Free' : `${item.price} ${item.currency}`}
                                </Text>
                            </View>
                            <Pressable onPress={() => handleDelete(item.id)} style={{ padding: 8 }}>
                                <IconSymbol name="trash.fill" size={20} color={colors.destructive} />
                            </Pressable>
                        </View>
                    </View>
                )}
            />
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    header: {
        padding: 20,
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    card: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    }
});
