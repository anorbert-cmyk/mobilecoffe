import { View, Text, ScrollView, StyleSheet, Pressable, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import { ScreenContainer } from '@/components/screen-container';
import { PremiumCard } from '@/components/ui/premium-card';
import { PremiumButton } from '@/components/ui/premium-button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { demoCafes } from '@/data/cafes';

export default function EventDetailScreen() {
    const { eventId, id } = useLocalSearchParams();
    const cafeId = id;
    const colors = useColors();
    const router = useRouter();

    // Find cafe and event
    const cafe = demoCafes.find(c => c.id === cafeId);
    const event = cafe?.events.find(e => e.id === eventId);

    const triggerHaptic = () => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    if (!event || !cafe) {
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

                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <IconSymbol name="clock" size={16} color={colors.muted} />
                            <Text style={[styles.metaText, { color: colors.muted }]}>{formattedTime}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <IconSymbol name="calendar" size={16} color={colors.muted} />
                            <Text style={[styles.metaText, { color: colors.muted }]}>{formattedDate}</Text>
                        </View>
                    </View>

                    <PremiumCard style={styles.venueCard}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                            <View style={[styles.venueIcon, { backgroundColor: colors.primary + '20' }]}>
                                <IconSymbol name="mappin.fill" size={20} color={colors.primary} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.venueName, { color: colors.foreground }]}>{cafe.name}</Text>
                                <Text style={[styles.venueAddress, { color: colors.muted }]}>{cafe.address}</Text>
                            </View>
                        </View>
                    </PremiumCard>

                    <Text style={[styles.sectionTitle, { color: colors.foreground }]}>About This Event</Text>
                    <Text style={[styles.description, { color: colors.muted }]}>{event.description}</Text>

                    {event.maxAttendees && (
                        <View style={[styles.attendeesCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <IconSymbol name="person.2.fill" size={20} color={colors.primary} />
                            <Text style={[styles.attendeesText, { color: colors.foreground }]}>
                                Maximum {event.maxAttendees} résztvevő
                            </Text>
                        </View>
                    )}

                    <View style={styles.priceSection}>
                        <View>
                            <Text style={[styles.priceLabel, { color: colors.muted }]}>Részvételi díj</Text>
                            <Text style={[styles.price, { color: colors.foreground }]}>
                                {event.price > 0 ? `${event.price.toLocaleString()} ${event.currency}` : 'Ingyenes'}
                            </Text>
                        </View>
                        <PremiumButton
                            onPress={() => {
                                triggerHaptic();
                                alert('Regisztráció elküldve! (Demo)');
                            }}
                            style={{ paddingHorizontal: 32 }}
                        >
                            Regisztráció
                        </PremiumButton>
                    </View>
                </Animated.View>
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroContainer: {
        height: 280,
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
    backButton: {
        position: 'absolute',
        top: 60,
        left: 20,
        zIndex: 10,
    },
    blurButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroContent: {
        position: 'absolute',
        bottom: 20,
        left: 20,
    },
    dateBadge: {
        width: 60,
        height: 70,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateDay: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
    },
    dateMonth: {
        fontSize: 12,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.9)',
    },
    contentContainer: {
        marginTop: -20,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        minHeight: 400,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    metaRow: {
        flexDirection: 'row',
        gap: 24,
        marginBottom: 20,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        fontSize: 14,
    },
    venueCard: {
        padding: 16,
        marginBottom: 24,
    },
    venueIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    venueName: {
        fontSize: 16,
        fontWeight: '600',
    },
    venueAddress: {
        fontSize: 13,
        marginTop: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        lineHeight: 24,
        marginBottom: 20,
    },
    attendeesCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 24,
    },
    attendeesText: {
        fontSize: 14,
        fontWeight: '500',
    },
    priceSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(150,150,150,0.2)',
    },
    priceLabel: {
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 4,
    },
});
