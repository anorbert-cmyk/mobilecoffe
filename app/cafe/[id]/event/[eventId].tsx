import { View, Text, ScrollView, StyleSheet, Pressable, Linking , Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { ScreenContainer } from '@/components/screen-container';
import { PremiumCard } from '@/components/ui/premium-card';
import { PremiumButton } from '@/components/ui/premium-button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { demoCafes } from '@/data/cafes';
import { trpc } from '@/lib/trpc';

export default function EventDetailScreen() {
    const { eventId, id } = useLocalSearchParams<{ eventId: string; id: string }>();
    const rawId = id;
    const businessId = parseInt(rawId || '', 10);
    const isNumericId = !isNaN(businessId) && businessId > 0;

    const colors = useColors();
    const router = useRouter();

    // Query backend if numeric
    const { data: backendBusiness, isLoading: isBackendLoading } = trpc.business.getById.useQuery(
        { id: businessId },
        { enabled: isNumericId }
    );

    const triggerHaptic = () => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    let event: any;
    let cafeName: string = '';

    if (isNumericId && backendBusiness) {
        event = backendBusiness.events.find((e: any) => String(e.id) === eventId);
        cafeName = backendBusiness.name;
    } else if (!isNumericId && rawId) {
        const cafe = demoCafes.find(c => c.id === rawId);
        event = cafe?.events.find(e => e.id === eventId);
        cafeName = cafe?.name || '';
    }

    if (isNumericId && isBackendLoading) {
        return (
            <ScreenContainer>
                <View style={styles.center}>
                    <Text style={{ color: colors.muted }}>Loading event...</Text>
                </View>
            </ScreenContainer>
        );
    }

    if (!event) {
        return (
            <ScreenContainer>
                <View style={styles.center}>
                    <IconSymbol name="calendar.badge.exclamationmark" size={48} color={colors.muted} />
                    <Text style={{ color: colors.foreground, marginTop: 12, fontSize: 18 }}>Event not found</Text>
                    <PremiumButton variant="outline" onPress={() => router.back()} style={{ marginTop: 24 }}>
                        Go Back
                    </PremiumButton>
                </View>
            </ScreenContainer>
        );
    }

    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('hu-HU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const formattedTime = eventDate.toLocaleTimeString('hu-HU', {
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <ScreenContainer>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Hero Image */}
                <View style={styles.heroContainer}>
                    <Image
                        source={{ uri: event.imageUrl || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800' }}
                        style={styles.heroImage}
                        contentFit="cover"
                        transition={300}
                    />
                    <View style={styles.heroOverlay} />

                    <Pressable
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <View style={[styles.blurButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                            <IconSymbol name="chevron.left" size={20} color="#FFF" />
                        </View>
                    </Pressable>

                    <View style={styles.heroContent}>
                        <View style={[styles.dateBadge, { backgroundColor: colors.primary }]}>
                            <Text style={styles.dateDay}>{eventDate.getDate()}</Text>
                            <Text style={styles.dateMonth}>
                                {eventDate.toLocaleString('default', { month: 'short' }).toUpperCase()}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Content */}
                <Animated.View
                    entering={FadeInDown.duration(400)}
                    style={[styles.contentContainer, { backgroundColor: colors.background }]}
                >
                    <Text style={[styles.title, { color: colors.foreground }]}>{event.name}</Text>

                    {cafeName && (
                        <Text style={[styles.subtitle, { color: colors.muted, marginBottom: 16 }]}>
                            hosted by {cafeName}
                        </Text>
                    )}

                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <IconSymbol name="clock" size={16} color={colors.muted} />
                            <Text style={[styles.metaText, { color: colors.muted }]}>{formattedTime}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <IconSymbol name="mappin.and.ellipse" size={16} color={colors.muted} />
                            <Text style={[styles.metaText, { color: colors.muted }]}>
                                {event.location || (typeof event.address === 'string' ? event.address : 'See details')}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <IconSymbol name="ticket" size={16} color={colors.primary} />
                            <Text style={[styles.priceText, { color: colors.primary }]}>
                                {event.price > 0 ? `${event.price} ${event.currency}` : 'Free Entry'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <Text style={[styles.sectionTitle, { color: colors.foreground }]}>About Event</Text>
                    <Text style={[styles.description, { color: colors.muted }]}>
                        {event.description}
                    </Text>

                    {/* Booking Button */}
                    <PremiumButton
                        style={{ marginTop: 32 }}
                        onPress={() => {
                            triggerHaptic();
                            // Implementation for booking
                            alert('Booking feature coming soon!');
                        }}
                    >
                        Book a Spot
                    </PremiumButton>

                </Animated.View>
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroContainer: {
        height: 300,
        width: '100%',
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    heroContent: {
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    backButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 20,
        left: 20,
        zIndex: 10,
    },
    blurButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dateBadge: {
        width: 60,
        height: 60,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    dateDay: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: '800',
    },
    dateMonth: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '700',
    },
    contentContainer: {
        flex: 1,
        marginTop: -20,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingTop: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '500',
    },
    metaRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        fontSize: 15,
        fontWeight: '500',
    },
    priceText: {
        fontSize: 16,
        fontWeight: '700',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
        marginVertical: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        lineHeight: 26,
    },
});
