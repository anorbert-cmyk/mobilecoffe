import { View, Text, FlatList, StyleSheet, Pressable, Alert } from 'react-native';
import { Image } from 'expo-image';
import { ScreenContainer } from '@/components/screen-container';
import { PremiumCard } from '@/components/ui/premium-card';
import { useColors } from '@/hooks/use-colors';
import { trpc } from '@/lib/trpc';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PremiumButton } from '@/components/ui/premium-button';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function EventsManager() {
    const colors = useColors();
    const router = useRouter();

    const { data: business, refetch } = trpc.business.getMine.useQuery();
    const events = business?.events || [];

    const deleteEvent = trpc.event.delete.useMutation({
        onSuccess: () => {
            refetch();
        }
    });

    const confirmDelete = (id: number, name: string) => {
        Alert.alert(
            'Delete Event',
            `Are you sure you want to delete "${name}"? This action cannot be undone.`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deleteEvent.mutate({ id }) }
            ]
        );
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
                        <Text style={[styles.title, { color: colors.foreground }]}>Events</Text>
                        <Text style={[styles.subtitle, { color: colors.muted }]}>
                            {events?.length || 0} event{(events?.length || 0) !== 1 ? 's' : ''}
                        </Text>
                    </View>
                    <PremiumButton
                        size="sm"
                        onPress={() => router.push('/b2b/add-event')}
                        leftIcon={<IconSymbol name="plus" size={16} color="#FFF" />}
                    >
                        Create
                    </PremiumButton>
                </View>
            </View>

            <FlatList
                data={events}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <View style={styles.emptyState}>
                        <IconSymbol name="calendar.badge.plus" size={64} color={colors.muted} />
                        <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No events yet</Text>
                        <Text style={[styles.emptyDescription, { color: colors.muted }]}>
                            Create your first event to start hosting cuppings and workshops.
                        </Text>
                        <PremiumButton
                            onPress={() => router.push('/b2b/add-event')}
                            style={{ marginTop: 20 }}
                        >
                            Create Your First Event
                        </PremiumButton>
                    </View>
                )}
                renderItem={({ item, index }) => (
                    <Animated.View entering={FadeInDown.delay(index * 80).springify()}>
                        <PremiumCard style={styles.card} elevated>
                            {/* Event Image */}
                            {item.imageUrl ? (
                                <Image
                                    source={{ uri: item.imageUrl }}
                                    style={styles.eventImage}
                                    contentFit="cover"
                                />
                            ) : (
                                <View style={[styles.placeholderImage, { backgroundColor: colors.surface }]}>
                                    <IconSymbol name="photo" size={32} color={colors.muted} />
                                </View>
                            )}

                            <View style={styles.cardContent}>
                                {/* Date Badge */}
                                <View style={[styles.dateBadge, { backgroundColor: colors.primary }]}>
                                    <Text style={styles.dateDay}>
                                        {new Date(item.date).getDate()}
                                    </Text>
                                    <Text style={styles.dateMonth}>
                                        {new Date(item.date).toLocaleString('default', { month: 'short' }).toUpperCase()}
                                    </Text>
                                </View>

                                {/* Event Info */}
                                <View style={styles.eventInfo}>
                                    <Text style={[styles.eventName, { color: colors.foreground }]} numberOfLines={1}>
                                        {item.name}
                                    </Text>
                                    <View style={styles.metaRow}>
                                        <IconSymbol name="mappin" size={14} color={colors.muted} />
                                        <Text style={[styles.metaText, { color: colors.muted }]} numberOfLines={1}>
                                            {item.location}
                                        </Text>
                                    </View>
                                    <View style={styles.metaRow}>
                                        <IconSymbol name="ticket" size={14} color={colors.primary} />
                                        <Text style={[styles.priceText, { color: colors.primary }]}>
                                            {item.price === 0 ? 'Free' : `${item.price?.toLocaleString()} ${item.currency}`}
                                        </Text>
                                        {item.maxAttendees && (
                                            <Text style={[styles.attendeesText, { color: colors.muted }]}>
                                                • Max {item.maxAttendees} attendees
                                            </Text>
                                        )}
                                    </View>
                                </View>

                                {/* Actions */}
                                <View style={styles.actions}>
                                    <Pressable
                                        onPress={() => router.push({ pathname: '/b2b/edit-event', params: { id: item.id } })}
                                        style={[styles.actionButton, { backgroundColor: colors.surface }]}
                                    >
                                        <IconSymbol name="pencil" size={18} color={colors.foreground} />
                                    </Pressable>
                                    <Pressable
                                        onPress={() => confirmDelete(item.id, item.name)}
                                        style={[styles.actionButton, { backgroundColor: colors.surface }]}
                                        disabled={deleteEvent.isPending}
                                    >
                                        <IconSymbol name="trash" size={18} color={colors.destructive} />
                                    </Pressable>
                                </View>
                            </View>

                            {/* Status Badge */}
                            <View style={[
                                styles.statusBadge,
                                { backgroundColor: item.isPublished ? colors.success + '20' : colors.warning + '20' }
                            ]}>
                                <Text style={{
                                    color: item.isPublished ? colors.success : colors.warning,
                                    fontSize: 10,
                                    fontWeight: '700'
                                }}>
                                    {item.isPublished ? 'PUBLISHED' : 'DRAFT'}
                                </Text>
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
        overflow: 'hidden',
        padding: 0,
    },
    eventImage: {
        width: '100%',
        height: 140,
    },
    placeholderImage: {
        width: '100%',
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardContent: {
        padding: 16,
        flexDirection: 'row',
        gap: 12,
    },
    dateBadge: {
        width: 50,
        height: 54,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dateDay: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFF',
    },
    dateMonth: {
        fontSize: 11,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.8)',
    },
    eventInfo: {
        flex: 1,
        gap: 4,
    },
    eventName: {
        fontSize: 17,
        fontWeight: '700',
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 13,
        flex: 1,
    },
    priceText: {
        fontSize: 13,
        fontWeight: '600',
    },
    attendeesText: {
        fontSize: 12,
    },
    actions: {
        flexDirection: 'column',
        gap: 8,
    },
    actionButton: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
});
