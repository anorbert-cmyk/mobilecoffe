import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image as RNImage, Pressable, Linking, Platform, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

import { ScreenContainer } from '@/components/screen-container';
import { PremiumCard } from '@/components/ui/premium-card';
import { PremiumButton } from '@/components/ui/premium-button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { trpc } from '@/lib/trpc';

import { getCafeById, Cafe } from '@/data/cafes';

type Tab = 'overview' | 'menu' | 'events' | 'jobs';

export default function CafeDetailScreen() {
    const { id } = useLocalSearchParams();
    const colors = useColors();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('overview');

    // Determine if ID is numeric (backend) or string (demo)
    const rawId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : undefined;
    const isNumericId = rawId ? !isNaN(parseInt(rawId)) : false;
    const businessId = isNumericId && rawId ? parseInt(rawId) : undefined;

    // Query backend only for numeric IDs
    const { data: backendBusiness, isLoading: isBackendLoading } = trpc.business.getById.useQuery(
        { id: businessId! },
        { enabled: !!businessId }
    );

    // For non-numeric IDs, use demo data
    const demoCafe = !isNumericId && rawId ? getCafeById(rawId) : undefined;

    // Unified loading state
    const isLoading = isNumericId ? isBackendLoading : false;

    // Convert demo cafe to a compatible shape (simplified for display)
    const business = backendBusiness || (demoCafe ? {
        id: 0,
        name: demoCafe.name,
        description: demoCafe.description,
        address: { street: demoCafe.address, city: demoCafe.neighborhood },
        phone: demoCafe.phone,
        website: demoCafe.website,
        headerImageUrls: [demoCafe.image],
        openingHours: { week: demoCafe.openingHours?.monday || 'Varies' },
        products: [],
        events: [],
        jobs: [],
        subscriptions: [],
        services: { wifi: demoCafe.amenities?.wifi ?? false },
    } : undefined);

    const triggerHaptic = () => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    if (isLoading) {
        return (
            <ScreenContainer>
                <View style={[styles.center, { gap: 12 }]}>
                    <Text style={{ color: colors.muted }}>Loading cafe details...</Text>
                </View>
            </ScreenContainer>
        );
    }

    if (!business) {
        return (
            <ScreenContainer>
                <View style={styles.center}>
                    <IconSymbol name="slash.circle" size={48} color={colors.muted} />
                    <Text style={{ color: colors.foreground, marginTop: 12, fontSize: 18 }}>Cafe not found</Text>
                    <PremiumButton variant="outline" onPress={() => router.back()} style={{ marginTop: 24 }}>
                        Go Back
                    </PremiumButton>
                </View>
            </ScreenContainer>
        );
    }

    const renderTabButton = (tab: Tab, label: string) => (
        <Pressable
            onPress={() => {
                triggerHaptic();
                setActiveTab(tab);
            }}
            style={[
                styles.tabButton,
                activeTab === tab && { backgroundColor: colors.primary, borderColor: colors.primary }
            ]}
        >
            <Text style={[
                styles.tabText,
                { color: activeTab === tab ? '#FFF' : colors.muted }
            ]}>
                {label}
            </Text>
        </Pressable>
    );

    // Group products by type for the Menu tab
    const coffeeProducts = business.products?.filter(p => p.type === 'coffee') || [];
    const equipmentProducts = business.products?.filter(p => p.type === 'equipment' || p.type === 'accessory') || [];

    const tabs = [
        { key: 'overview', label: 'Overview' },
        { key: 'menu', label: 'Menu' },
        { key: 'events', label: `Events (${business.events?.length || 0})` },
        { key: 'jobs', label: `Jobs (${business.jobs?.length || 0})` },
    ];

    const headerImageUrl = Array.isArray(business.headerImageUrls) && business.headerImageUrls.length > 0
        ? String(business.headerImageUrls[0])
        : "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=3547&auto=format&fit=crop";

    // Safely access address fields
    // Assuming business.address is stored as JSON in the backend and typed as unknown/json in schema,
    // but the router might return it as `any` or `unknown`. We need to cast it safely.
    const address = business.address as { street?: string; city?: string } | null;
    const displayAddress = address?.street || address?.city || 'Budapest';

    const openingHours = business.openingHours as Record<string, string> | null;

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                {/* Hero Section */}
                <View style={styles.heroContainer}>
                    <Image
                        source={{ uri: headerImageUrl }}
                        style={styles.heroImage}
                        contentFit="cover"
                        transition={300}
                    />
                    <View style={styles.heroOverlay} />

                    <Pressable
                        onPress={() => router.back()}
                        style={[styles.backButton, { top: Platform.OS === 'ios' ? 60 : 20 }]}
                    >
                        <BlurView intensity={30} style={styles.blurButton}>
                            <IconSymbol name="chevron.left" size={20} color="#FFF" />
                        </BlurView>
                    </Pressable>

                    <View style={styles.heroContent}>
                        <View style={styles.badgesRow}>
                            {business.subscriptions?.some((s) => s.plan === 'premium') && (
                                <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                                    <IconSymbol name="checkmark.seal.fill" size={12} color="#FFF" />
                                    <Text style={styles.badgeText}>Premium Partner</Text>
                                </View>
                            )}
                            <View style={[styles.badge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                                <IconSymbol name="star.fill" size={12} color="#FFB800" />
                                <Text style={styles.badgeText}>4.8 (120)</Text>
                            </View>
                        </View>

                        <Text style={styles.heroTitle}>{business.name}</Text>
                        <Text style={styles.heroAddress}>
                            <IconSymbol name="mappin.fill" size={14} color="rgba(255,255,255,0.8)" />
                            {' '}{displayAddress}
                        </Text>
                    </View>
                </View>

                {/* Content Container */}
                <View style={[styles.contentContainer, { backgroundColor: colors.background }]}>

                    {/* Tabs */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.tabsScroll}
                        contentContainerStyle={styles.tabsContent}
                    >
                        {tabs.map(tab => renderTabButton(tab.key as Tab, tab.label))}
                    </ScrollView>

                    <View style={{ padding: 20 }}>
                        {activeTab === 'overview' && (
                            <Animated.View entering={FadeInDown.duration(300)}>
                                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>About Us</Text>
                                <Text style={[styles.description, { color: colors.muted }]}>
                                    {business.description || "We are a dedicated team of coffee enthusiasts bringing you the best specialty coffee experience in town."}
                                </Text>

                                <View style={styles.infoGrid}>
                                    <PremiumCard style={styles.infoCard}>
                                        <IconSymbol name="clock.fill" size={24} color={colors.primary} />
                                        <Text style={[styles.infoLabel, { color: colors.muted }]}>Open Today</Text>
                                        <Text style={[styles.infoValue, { color: colors.foreground }]}>
                                            {openingHours?.week || "9:00 - 17:00"}
                                        </Text>
                                    </PremiumCard>

                                    <PremiumCard style={styles.infoCard}>
                                        <IconSymbol name="wifi" size={24} color={colors.primary} />
                                        <Text style={[styles.infoLabel, { color: colors.muted }]}>Wifi</Text>
                                        <Text style={[styles.infoValue, { color: colors.foreground }]}>Free Access</Text>
                                    </PremiumCard>
                                </View>

                                <Text style={[styles.sectionTitle, { color: colors.foreground, marginTop: 24 }]}>Contact</Text>
                                <View style={styles.contactRow}>
                                    <PremiumButton
                                        variant="outline"
                                        style={{ flex: 1 }}
                                        onPress={() => business.phone && Linking.openURL(`tel:${business.phone}`)}
                                    >
                                        <IconSymbol name="phone.fill" size={16} color={colors.foreground} />
                                        {' '}Call
                                    </PremiumButton>
                                    <PremiumButton
                                        variant="outline"
                                        style={{ flex: 1 }}
                                        onPress={() => business.website && Linking.openURL(business.website)}
                                    >
                                        <IconSymbol name="globe" size={16} color={colors.foreground} />
                                        {' '}Website
                                    </PremiumButton>
                                </View>
                            </Animated.View>
                        )}

                        {activeTab === 'menu' && (
                            <Animated.View entering={FadeInDown.duration(300)}>
                                {coffeeProducts.length > 0 && (
                                    <View style={{ marginBottom: 24 }}>
                                        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Coffee Beans</Text>
                                        {coffeeProducts.map((product: any) => (
                                            <PremiumCard key={product.id} style={styles.menuItemCard}>
                                                <Image source={{ uri: product.imageUrl }} style={styles.menuItemImage} />
                                                <View style={{ flex: 1 }}>
                                                    <Text style={[styles.menuItemName, { color: colors.foreground }]}>{product.name}</Text>
                                                    <Text style={[styles.menuItemDesc, { color: colors.muted }]} numberOfLines={2}>
                                                        {product.description}
                                                    </Text>
                                                    <Text style={[styles.menuItemPrice, { color: colors.primary }]}>{product.price} {product.currency}</Text>
                                                </View>
                                            </PremiumCard>
                                        ))}
                                    </View>
                                )}

                                {equipmentProducts.length > 0 && (
                                    <View>
                                        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Equipment</Text>
                                        {equipmentProducts.map((product: any) => (
                                            <PremiumCard key={product.id} style={styles.menuItemCard}>
                                                <Image source={{ uri: product.imageUrl }} style={styles.menuItemImage} />
                                                <View style={{ flex: 1 }}>
                                                    <Text style={[styles.menuItemName, { color: colors.foreground }]}>{product.name}</Text>
                                                    <Text style={[styles.menuItemPrice, { color: colors.primary }]}>{product.price} {product.currency}</Text>
                                                </View>
                                            </PremiumCard>
                                        ))}
                                    </View>
                                )}

                                {coffeeProducts.length === 0 && equipmentProducts.length === 0 && (
                                    <Text style={{ color: colors.muted, textAlign: 'center', marginTop: 20 }}>No menu items available.</Text>
                                )}
                            </Animated.View>
                        )}

                        {activeTab === 'events' && (
                            <Animated.View entering={FadeInDown.duration(300)}>
                                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Upcoming Events</Text>
                                {business.events?.length > 0 ? (
                                    business.events.map((event) => (
                                        <PremiumCard key={event.id} style={styles.eventCard}>
                                            <Image source={{ uri: event.imageUrl || undefined }} style={styles.eventImage} />
                                            <View style={styles.eventContent}>
                                                <View style={[styles.dateBadge, { backgroundColor: colors.surface }]}>
                                                    <Text style={[styles.dateDay, { color: colors.foreground }]}>
                                                        {new Date(event.date).getDate()}
                                                    </Text>
                                                    <Text style={[styles.dateMonth, { color: colors.primary }]}>
                                                        {new Date(event.date).toLocaleString('default', { month: 'short' }).toUpperCase()}
                                                    </Text>
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={[styles.eventName, { color: colors.foreground }]}>{event.name}</Text>
                                                    <Text style={[styles.eventLocation, { color: colors.muted }]}>
                                                        <IconSymbol name="mappin" size={12} color={colors.muted} /> {event.location}
                                                    </Text>
                                                    <Text style={[styles.eventPrice, { color: colors.primary }]}>
                                                        {event.price && event.price > 0 ? `${event.price} ${event.currency}` : 'Free'}
                                                    </Text>
                                                </View>
                                            </View>
                                            <PremiumButton size="sm" style={{ marginTop: 12 }}>Register</PremiumButton>
                                        </PremiumCard>
                                    ))
                                ) : (
                                    <Text style={{ color: colors.muted, textAlign: 'center', marginTop: 20 }}>No upcoming events.</Text>
                                )}
                            </Animated.View>
                        )}

                        {activeTab === 'jobs' && (
                            <Animated.View entering={FadeInDown.duration(300)}>
                                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Join Our Team</Text>
                                {business.jobs?.length > 0 ? (
                                    business.jobs.map((job) => (
                                        <PremiumCard key={job.id} style={styles.jobCard}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                                <Text style={[styles.jobTitle, { color: colors.foreground }]}>{job.title}</Text>
                                                <View style={[styles.jobTypeBadge, { backgroundColor: colors.surface }]}>
                                                    <Text style={[styles.jobTypeText, { color: colors.foreground }]}>{job.contractType}</Text>
                                                </View>
                                            </View>
                                            <Text style={[styles.jobSalary, { color: colors.success }]}>
                                                {job.netSalaryMin} - {job.netSalaryMax} Ft
                                            </Text>
                                            <Text style={[styles.jobDesc, { color: colors.muted }]} numberOfLines={2}>
                                                {job.description}
                                            </Text>
                                            <PremiumButton variant="outline" size="sm" style={{ marginTop: 12 }}>Apply Now</PremiumButton>
                                        </PremiumCard>
                                    ))
                                ) : (
                                    <Text style={{ color: colors.muted, textAlign: 'center', marginTop: 20 }}>No open positions.</Text>
                                )}
                            </Animated.View>
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={[styles.bottomBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
                <PremiumButton
                    onPress={() => openMaps()}
                    style={{ flex: 1 }}
                    leftIcon={<IconSymbol name="map.fill" size={18} color="#FFF" />}
                >
                    Directions
                </PremiumButton>
            </View>
        </View>
    );

    function openMaps() {
        if (!business) return;
        const url = Platform.select({
            ios: `maps:0,0?q=${encodeURIComponent(business.name)}@${displayAddress}`,
            android: `geo:0,0?q=${encodeURIComponent(business.name)}`,
            default: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.name)}`,
        });
        if (url) Linking.openURL(url);
    }
}

const styles = StyleSheet.create({
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    heroContainer: { height: 350, width: '100%', position: 'relative' },
    heroImage: { width: '100%', height: '100%' },
    heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
    heroContent: { position: 'absolute', bottom: 40, left: 20, right: 20 },
    backButton: { position: 'absolute', left: 20, zIndex: 10 },
    blurButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    heroTitle: { fontSize: 32, fontWeight: '800', color: '#FFF', marginBottom: 8, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
    heroAddress: { fontSize: 16, color: 'rgba(255,255,255,0.9)', fontWeight: '500' },
    badgesRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
    badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
    badgeText: { color: '#FFF', fontSize: 12, fontWeight: '700' },

    contentContainer: { flex: 1, marginTop: -20, borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' },
    tabsScroll: { borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
    tabsContent: { paddingHorizontal: 20, paddingVertical: 16, gap: 12 },
    tabButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)' },
    tabText: { fontWeight: '600', fontSize: 14 },

    sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
    description: { fontSize: 16, lineHeight: 24, marginBottom: 24 },
    infoGrid: { flexDirection: 'row', gap: 12, marginBottom: 24 },
    infoCard: { flex: 1, padding: 16, alignItems: 'center', gap: 8 },
    infoLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
    infoValue: { fontSize: 16, fontWeight: '700', textAlign: 'center' },
    contactRow: { flexDirection: 'row', gap: 12 },

    menuItemCard: { flexDirection: 'row', padding: 12, gap: 12, marginBottom: 12, alignItems: 'center' },
    menuItemImage: { width: 60, height: 60, borderRadius: 8, backgroundColor: '#eee' },
    menuItemName: { fontSize: 16, fontWeight: '700' },
    menuItemDesc: { fontSize: 14, marginTop: 2 },
    menuItemPrice: { fontSize: 15, fontWeight: '600', marginTop: 4 },

    eventCard: { padding: 0, overflow: 'hidden', marginBottom: 16 },
    eventImage: { width: '100%', height: 150 },
    eventContent: { padding: 16, flexDirection: 'row', gap: 12 },
    dateBadge: { width: 50, height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    dateDay: { fontSize: 18, fontWeight: '700' },
    dateMonth: { fontSize: 12, fontWeight: '700' },
    eventName: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
    eventLocation: { fontSize: 14, marginBottom: 4 },
    eventPrice: { fontSize: 14, fontWeight: '600' },

    jobCard: { padding: 16, marginBottom: 12 },
    jobTitle: { fontSize: 18, fontWeight: '700' },
    jobTypeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    jobTypeText: { fontSize: 12, fontWeight: '600' },
    jobSalary: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
    jobDesc: { fontSize: 14 },

    bottomBar: { padding: 16, paddingBottom: Platform.OS === 'ios' ? 32 : 16, borderTopWidth: 1, flexDirection: 'row' },
});
