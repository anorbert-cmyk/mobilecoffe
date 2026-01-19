import { View, Text, FlatList, StyleSheet, Pressable, ScrollView, Platform, Linking } from 'react-native';
import { useLocalSearchParams, router, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';

import { ScreenContainer } from '@/components/screen-container';
import { PremiumCard } from '@/components/ui/premium-card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PremiumButton } from '@/components/ui/premium-button';
import { useColors } from '@/hooks/use-colors';
import { getCafeById } from '@/data/cafes';
import { trpc } from '@/lib/trpc';
import type { ShopProduct, CafeEvent, CafeJob } from '@/data/cafes';

// Unified interface for UI consumption
interface CafeDetails {
    id: number | string;
    name: string;
    description: string;
    address: { street?: string; city?: string } | null;
    displayAddress: string;
    phone?: string;
    website?: string;
    headerImageUrl: string;
    openingHours: Record<string, string> | null;
    reviewCount?: number;
    rating?: number;
    isPremium?: boolean;

    products: {
        id: string | number;
        name: string;
        description: string;
        price: number;
        currency: string;
        imageUrl?: string;
        type: 'coffee' | 'equipment' | 'accessory';
        isPopular?: boolean;
        isVegan?: boolean;
    }[];

    events: (CafeEvent & { location: string })[];
    jobs: CafeJob[];
    shop: ShopProduct[];
    services: Record<string, boolean>; // map of key to boolean
}

type Tab = 'overview' | 'menu' | 'shop' | 'events' | 'jobs';

export default function CafeDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    // If id is numeric (from backend), use it. If string slug (from demo), treat as raw.
    // However, expo router params are always string.
    const rawId = id;
    const businessId = parseInt(rawId || '', 10); // NaN if slug
    const isNumericId = !isNaN(businessId) && businessId > 0;

    const colors = useColors();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('overview');

    // Query backend only for numeric IDs
    const { data: backendBusiness, isLoading: isBackendLoading } = trpc.business.getById.useQuery(
        { id: businessId },
        { enabled: isNumericId }
    );

    // For non-numeric IDs, use demo data
    const demoCafe = !isNumericId && rawId ? getCafeById(rawId) : undefined;

    // Unified loading state
    const isLoading = isNumericId ? isBackendLoading : false;

    // Transform backend or demo data to Unified Interface
    let business: CafeDetails | undefined;

    if (backendBusiness) {
        // Transform Backend Data
        const addressObj = backendBusiness.address as { street?: string; city?: string } | null;
        const displayAddress = addressObj?.street || addressObj?.city || 'Location Info';

        business = {
            id: backendBusiness.id,
            name: backendBusiness.name,
            description: backendBusiness.description || '',
            address: addressObj,
            displayAddress,
            phone: backendBusiness.phone || undefined,
            website: backendBusiness.website || undefined,
            headerImageUrl: (backendBusiness.headerImageUrls as string[])?.[0] || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
            openingHours: backendBusiness.openingHours as Record<string, string>,
            reviewCount: 120, // Mock for backend
            rating: 4.8,      // Mock for backend
            isPremium: backendBusiness.subscriptions?.some((s: any) => s.plan === 'premium'),

            products: backendBusiness.products.map((p: any) => ({
                id: p.id,
                name: p.name,
                description: p.description || '',
                price: p.price,
                currency: p.currency || 'HUF',
                imageUrl: (p.images as string[])?.[0], // Map first image
                type: p.type as 'coffee' | 'equipment' | 'accessory',
                isPopular: false,
                isVegan: false
            })),

            events: backendBusiness.events.map((e: any) => ({
                id: String(e.id),
                name: e.name,
                date: new Date(e.date),
                description: e.description || '',
                price: e.price || 0,
                currency: e.currency || 'HUF',
                imageUrl: e.imageUrl,
                maxAttendees: e.maxAttendees,
                location: displayAddress // Default to business address
            })),

            jobs: backendBusiness.jobs.map((j: any) => ({
                id: String(j.id),
                title: j.title,
                type: j.contractType as any,
                salaryMin: j.netSalaryMin,
                salaryMax: j.netSalaryMax,
                description: j.description
            })),

            shop: [], // Backend doesn't support shop separately yet
            services: (backendBusiness.services as Record<string, boolean>) || {},
        };
    } else if (demoCafe) {
        // Transform Demo Data
        business = {
            id: demoCafe.id,
            name: demoCafe.name,
            description: demoCafe.longDescription || demoCafe.description,
            address: { street: demoCafe.address, city: demoCafe.neighborhood },
            displayAddress: `${demoCafe.address}, ${demoCafe.neighborhood}`,
            phone: demoCafe.phone,
            website: demoCafe.website,
            headerImageUrl: demoCafe.image,
            openingHours: demoCafe.openingHours as any,
            reviewCount: demoCafe.reviewCount,
            rating: demoCafe.rating,
            isPremium: false,

            products: demoCafe.menu.flatMap((category, catIdx) =>
                category.items.map((item, itemIdx) => ({
                    id: `${catIdx}-${itemIdx}`,
                    name: item.name,
                    description: item.description || '',
                    price: item.price,
                    currency: 'HUF',
                    type: category.name.toLowerCase().includes('espresso') || category.name.toLowerCase().includes('filter') ? 'coffee' : 'accessory',
                    isPopular: item.isPopular,
                    isVegan: item.isVegan,
                    // Use fallback image if none provided in item
                    imageUrl: item.imageUrl || `https://source.unsplash.com/400x400/?coffee`
                }))
            ),

            events: demoCafe.events.map(e => ({
                ...e,
                location: demoCafe.address
            })),

            jobs: demoCafe.jobs,
            shop: demoCafe.shop || [],
            services: demoCafe.amenities as any,
        };
    }

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

    // Group products for Menu tab
    const coffeeProducts = business.products.filter(p => p.type === 'coffee');
    const equipmentProducts = business.products.filter(p => p.type === 'equipment' || p.type === 'accessory');

    const tabs = [
        { key: 'overview', label: 'Overview' },
        { key: 'menu', label: 'Menu' },
        { key: 'shop', label: 'Shop' },
        { key: 'events', label: `Events (${business.events.length})` },
        { key: 'jobs', label: `Jobs (${business.jobs.length})` },
    ];

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                {/* Hero Section */}
                <View style={styles.heroContainer}>
                    <Image
                        source={{ uri: business.headerImageUrl }}
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
                            {business.isPremium && (
                                <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                                    <IconSymbol name="checkmark.seal.fill" size={12} color="#FFF" />
                                    <Text style={styles.badgeText}>Premium Partner</Text>
                                </View>
                            )}
                            <View style={[styles.badge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                                <IconSymbol name="star.fill" size={12} color="#FFB800" />
                                <Text style={styles.badgeText}>{business.rating} ({business.reviewCount})</Text>
                            </View>
                        </View>

                        <Text style={styles.heroTitle}>{business.name}</Text>
                        <Text style={styles.heroAddress}>
                            <IconSymbol name="mappin.fill" size={14} color="rgba(255,255,255,0.8)" />
                            {' '}{business.displayAddress}
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

                                {/* Amenities Grid */}
                                <Text style={[styles.sectionTitle, { color: colors.foreground, marginTop: 24 }]}>Amenities</Text>
                                <View style={styles.amenitiesGrid}>
                                    {[
                                        { key: 'wifi', icon: 'wifi', label: 'WiFi' },
                                        { key: 'dogFriendly', icon: 'pawprint.fill', label: 'Dog Friendly' },
                                        { key: 'cardPayment', icon: 'creditcard.fill', label: 'Card Payment' },
                                        { key: 'terrace', icon: 'sun.max.fill', label: 'Terrace' },
                                        { key: 'brunch', icon: 'fork.knife', label: 'Brunch' },
                                        { key: 'laptopFriendly', icon: 'laptopcomputer', label: 'Laptop OK' },
                                        { key: 'wheelchairAccessible', icon: 'figure.roll', label: 'Accessible' },
                                        { key: 'parking', icon: 'parkingsign', label: 'Parking' },
                                        { key: 'reservations', icon: 'calendar.badge.clock', label: 'Reservations' },
                                        { key: 'takeaway', icon: 'bag.fill', label: 'Takeaway' },
                                        { key: 'oatMilk', icon: 'leaf.fill', label: 'Oat Milk' },
                                        { key: 'specialty', icon: 'star.fill', label: 'Specialty' },
                                    ].filter(a => business!.services?.[a.key]).map((amenity) => (
                                        <View key={amenity.key} style={[styles.amenityBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                            <IconSymbol name={amenity.icon as any} size={18} color={colors.primary} />
                                            <Text style={[styles.amenityLabel, { color: colors.foreground }]}>{amenity.label}</Text>
                                        </View>
                                    ))}
                                </View>

                                <View style={styles.infoGrid}>
                                    <PremiumCard style={styles.infoCard}>
                                        <IconSymbol name="clock.fill" size={24} color={colors.primary} />
                                        <Text style={[styles.infoLabel, { color: colors.muted }]}>Open Today</Text>
                                        <Text style={[styles.infoValue, { color: colors.foreground }]}>
                                            {business.openingHours?.monday || "9:00 - 17:00"}
                                        </Text>
                                    </PremiumCard>

                                    <PremiumCard style={styles.infoCard}>
                                        <IconSymbol name="star.fill" size={24} color="#FFB800" />
                                        <Text style={[styles.infoLabel, { color: colors.muted }]}>Rating</Text>
                                        <Text style={[styles.infoValue, { color: colors.foreground }]}>{business.rating} ★</Text>
                                    </PremiumCard>
                                </View>

                                <Text style={[styles.sectionTitle, { color: colors.foreground, marginTop: 24 }]}>Contact</Text>
                                <View style={styles.contactRow}>
                                    <PremiumButton
                                        variant="outline"
                                        style={{ flex: 1 }}
                                        onPress={() => business!.phone && Linking.openURL(`tel:${business!.phone}`)}
                                    >
                                        <IconSymbol name="phone.fill" size={16} color={colors.foreground} />
                                        {' '}Call
                                    </PremiumButton>
                                    <PremiumButton
                                        variant="outline"
                                        style={{ flex: 1 }}
                                        onPress={() => business!.website && Linking.openURL(business!.website)}
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
                                        {coffeeProducts.map((product) => (
                                            <PremiumCard key={product.id} style={styles.menuItemCard}>
                                                <Image
                                                    source={{ uri: product.imageUrl || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800' }}
                                                    style={styles.menuItemImage}
                                                    contentFit="cover"
                                                />
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
                                        {equipmentProducts.map((product) => (
                                            <PremiumCard key={product.id} style={styles.menuItemCard}>
                                                <Image
                                                    source={{ uri: product.imageUrl || 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800' }}
                                                    style={styles.menuItemImage}
                                                    contentFit="cover"
                                                />
                                                <View style={{ flex: 1 }}>
                                                    <Text style={[styles.menuItemName, { color: colors.foreground }]}>{product.name}</Text>
                                                    <Text style={[styles.menuItemPrice, { color: colors.primary }]}>{product.price} {product.currency}</Text>
                                                </View>
                                            </PremiumCard>
                                        ))}
                                    </View>
                                )}

                                {coffeeProducts.length === 0 && equipmentProducts.length === 0 && (
                                    <Text style={{ color: colors.muted, textAlign: 'center', marginTop: 20 }}>No menu items available (or check Shop tab).</Text>
                                )}
                            </Animated.View>
                        )}

                        {activeTab === 'events' && (
                            <Animated.View entering={FadeInDown.duration(300)}>
                                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Upcoming Events</Text>
                                {business.events.length > 0 ? (
                                    business.events.map((event) => (
                                        <Pressable
                                            key={event.id}
                                            onPress={() => {
                                                triggerHaptic();
                                                router.push(`/cafe/${rawId}/event/${event.id}`);
                                            }}
                                        >
                                            <PremiumCard style={styles.eventCard}>
                                                <Image
                                                    source={{ uri: event.imageUrl || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800' }}
                                                    style={styles.eventImage}
                                                    contentFit="cover"
                                                />
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
                                                            {event.price > 0 ? `${event.price} ${event.currency}` : 'Free'}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={{ padding: 16, paddingTop: 0 }}>
                                                    <PremiumButton size="sm">View Details</PremiumButton>
                                                </View>
                                            </PremiumCard>
                                        </Pressable>
                                    ))
                                ) : (
                                    <Text style={{ color: colors.muted, textAlign: 'center', marginTop: 20 }}>No upcoming events.</Text>
                                )}
                            </Animated.View>
                        )}

                        {activeTab === 'shop' && (
                            <Animated.View entering={FadeInDown.duration(300)}>
                                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Webshop</Text>
                                <View style={styles.shopGrid}>
                                    {business.shop.map((product) => (
                                        <Pressable
                                            key={product.id}
                                            style={[styles.shopCard, { backgroundColor: colors.surface }]}
                                            onPress={() => {
                                                triggerHaptic();
                                                router.push(`/cafe/${rawId}/product/${product.id}`);
                                            }}
                                        >
                                            <Image
                                                source={{ uri: product.imageUrl || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800' }}
                                                style={styles.shopImage}
                                                contentFit="cover"
                                            />
                                            <View style={{ padding: 12 }}>
                                                <Text style={[styles.shopCategory, { color: colors.primary }]}>{product.category ? product.category.toUpperCase() : 'PRODUCT'}</Text>
                                                <Text style={[styles.shopName, { color: colors.foreground }]} numberOfLines={2}>{product.name}</Text>
                                                <Text style={[styles.shopPrice, { color: colors.foreground }]}>{product.price.toLocaleString()} Ft</Text>
                                            </View>
                                        </Pressable>
                                    ))}
                                </View>
                                {business.shop.length === 0 && (
                                    <Text style={{ color: colors.muted, textAlign: 'center', marginTop: 20 }}>No products available.</Text>
                                )}
                            </Animated.View>
                        )}

                        {activeTab === 'jobs' && (
                            <Animated.View entering={FadeInDown.duration(300)}>
                                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Join Our Team</Text>
                                {business.jobs.length > 0 ? (
                                    business.jobs.map((job) => (
                                        <Pressable
                                            key={job.id}
                                            onPress={() => {
                                                triggerHaptic();
                                                router.push(`/cafe/${rawId}/job/${job.id}`);
                                            }}
                                        >
                                            <PremiumCard style={styles.jobCard}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                                    <Text style={[styles.jobTitle, { color: colors.foreground }]}>{job.title}</Text>
                                                    <View style={[styles.jobTypeBadge, { backgroundColor: job.type === 'full-time' ? '#10B98120' : '#3B82F620' }]}>
                                                        <Text style={[styles.jobTypeText, { color: job.type === 'full-time' ? '#10B981' : '#3B82F6' }]}>
                                                            {job.type === 'full-time' ? 'Full-time' : 'Part-time'}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <Text style={[styles.jobSalary, { color: colors.success }]}>
                                                    {job.salaryMin?.toLocaleString()} - {job.salaryMax?.toLocaleString()} Ft
                                                </Text>
                                                <Text style={[styles.jobDesc, { color: colors.muted }]} numberOfLines={2}>
                                                    {job.description}
                                                </Text>
                                                <PremiumButton variant="outline" size="sm" style={{ marginTop: 12 }}>View Details</PremiumButton>
                                            </PremiumCard>
                                        </Pressable>
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
            ios: `maps:0,0?q=${encodeURIComponent(business.name)}@${business.displayAddress}`,
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

    shopGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    shopCard: { width: '48%', borderRadius: 16, overflow: 'hidden', marginBottom: 12 },
    shopImage: { width: '100%', height: 140, backgroundColor: '#eee' },
    shopCategory: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5, marginBottom: 4 },
    shopName: { fontSize: 14, fontWeight: '700', marginBottom: 4, height: 40 },
    shopPrice: { fontSize: 14, fontWeight: '600' },

    amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
    amenityBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
    amenityLabel: { fontSize: 13, fontWeight: '500' },

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
