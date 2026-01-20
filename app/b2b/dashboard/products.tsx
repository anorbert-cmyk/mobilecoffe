import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert, Platform, Dimensions, RefreshControl } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    interpolate,
    useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

import { useColors } from '@/hooks/use-colors';
import { trpc } from '@/lib/trpc';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { demoBusiness } from '@/data/demoBusiness';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 52) / 2;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ProductType = 'all' | 'coffee' | 'equipment' | 'accessory';

// ============ COMPONENTS ============

function CategoryChip({ label, icon, isActive, onPress, color }: {
    label: string;
    icon: IconSymbolName;
    isActive: boolean;
    onPress: () => void;
    color: string;
}) {
    const colors = useColors();
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePress = () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
    };

    return (
        <AnimatedPressable
            onPress={handlePress}
            onPressIn={() => { scale.value = withSpring(0.95); }}
            onPressOut={() => { scale.value = withSpring(1); }}
            style={[
                styles.categoryChip,
                animatedStyle,
                isActive
                    ? { backgroundColor: color }
                    : { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }
            ]}
        >
            <IconSymbol name={icon} size={16} color={isActive ? '#FFF' : colors.muted} />
            <Text style={[styles.categoryChipText, { color: isActive ? '#FFF' : colors.foreground }]}>
                {label}
            </Text>
        </AnimatedPressable>
    );
}

function ProductCard({ item, index, onEdit, onDelete }: {
    item: any;
    index: number;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const colors = useColors();
    const router = useRouter();
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'coffee': return '#10B981';
            case 'equipment': return '#3B82F6';
            case 'accessory': return '#F59E0B';
            default: return colors.primary;
        }
    };

    const typeColor = getTypeColor(item.type);
    const hasImage = item.images?.[0];

    return (
        <Animated.View
            entering={FadeInDown.delay(100 + index * 80).springify().damping(15)}
            style={styles.productCardWrapper}
        >
            <AnimatedPressable
                onPressIn={() => { scale.value = withSpring(0.96); }}
                onPressOut={() => { scale.value = withSpring(1); }}
                style={[styles.productCard, animatedStyle, { backgroundColor: colors.surface }]}
            >
                {/* Image or Gradient Placeholder */}
                <View style={styles.productImageContainer}>
                    {hasImage ? (
                        <Image
                            source={{ uri: item.images[0] }}
                            style={styles.productImage}
                            contentFit="cover"
                            transition={300}
                        />
                    ) : (
                        <LinearGradient
                            colors={[typeColor, `${typeColor}99`]}
                            style={styles.productImagePlaceholder}
                        >
                            <IconSymbol
                                name={item.type === 'coffee' ? 'leaf.fill' : 'cube.fill'}
                                size={40}
                                color="rgba(255,255,255,0.8)"
                            />
                        </LinearGradient>
                    )}
                    {/* Type Badge */}
                    <View style={[styles.typeBadge, { backgroundColor: typeColor }]}>
                        <Text style={styles.typeBadgeText}>{item.type.toUpperCase()}</Text>
                    </View>
                    {/* Out of Stock Overlay */}
                    {!item.isAvailable && (
                        <View style={styles.outOfStockOverlay}>
                            <BlurView intensity={60} style={styles.outOfStockBlur}>
                                <Text style={styles.outOfStockText}>OUT OF STOCK</Text>
                            </BlurView>
                        </View>
                    )}
                </View>

                {/* Content */}
                <View style={styles.productContent}>
                    <Text style={[styles.productName, { color: colors.foreground }]} numberOfLines={2}>
                        {item.name}
                    </Text>

                    {item.roastLevel && (
                        <Text style={[styles.productMeta, { color: colors.muted }]}>
                            {item.roastLevel} roast {item.weight ? `• ${item.weight}g` : ''}
                        </Text>
                    )}

                    <View style={styles.priceRow}>
                        <Text style={[styles.productPrice, { color: colors.primary }]}>
                            {item.price?.toLocaleString()} {item.currency || 'Ft'}
                        </Text>
                    </View>
                </View>

                {/* Actions */}
                <View style={styles.cardActions}>
                    <Pressable
                        onPress={onEdit}
                        style={[styles.cardActionBtn, { backgroundColor: colors.background }]}
                    >
                        <IconSymbol name="pencil" size={14} color={colors.foreground} />
                    </Pressable>
                    <Pressable
                        onPress={onDelete}
                        style={[styles.cardActionBtn, { backgroundColor: colors.background }]}
                    >
                        <IconSymbol name="trash" size={14} color="#EF4444" />
                    </Pressable>
                </View>
            </AnimatedPressable>
        </Animated.View>
    );
}

function StatPill({ label, value, icon, color }: { label: string; value: string | number; icon: IconSymbolName; color: string }) {
    const colors = useColors();
    return (
        <View style={[styles.statPill, { backgroundColor: colors.surface }]}>
            <View style={[styles.statPillIcon, { backgroundColor: `${color}20` }]}>
                <IconSymbol name={icon} size={16} color={color} />
            </View>
            <View>
                <Text style={[styles.statPillValue, { color: colors.foreground }]}>{value}</Text>
                <Text style={[styles.statPillLabel, { color: colors.muted }]}>{label}</Text>
            </View>
        </View>
    );
}

// ============ MAIN SCREEN ============

export default function ProductsManager() {
    const colors = useColors();
    const router = useRouter();
    const [activeFilter, setActiveFilter] = useState<ProductType>('all');
    const scrollY = useSharedValue(0);

    const { data: apiBusiness, isLoading, refetch } = trpc.business.getMine.useQuery();
    const products = apiBusiness?.products ?? demoBusiness?.products ?? [];

    const deleteProduct = trpc.product.deleteProduct.useMutation({
        onSuccess: () => refetch()
    });

    const confirmDelete = (id: number, name: string) => {
        Alert.alert('Delete Product', `Delete "${name}"?`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => deleteProduct.mutate({ id }) }
        ]);
    };

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => { scrollY.value = event.contentOffset.y; },
    });

    // Filter products
    const filteredProducts = activeFilter === 'all'
        ? products
        : products.filter(p => p.type === activeFilter);

    // Stats
    const coffeeCount = products.filter(p => p.type === 'coffee').length;
    const equipmentCount = products.filter(p => p.type === 'equipment' || p.type === 'accessory').length;

    const CATEGORIES = [
        { type: 'all' as ProductType, label: 'All', icon: 'square.grid.2x2.fill' as IconSymbolName, color: colors.primary },
        { type: 'coffee' as ProductType, label: 'Coffee', icon: 'leaf.fill' as IconSymbolName, color: '#10B981' },
        { type: 'equipment' as ProductType, label: 'Equipment', icon: 'gearshape.fill' as IconSymbolName, color: '#3B82F6' },
        { type: 'accessory' as ProductType, label: 'Accessories', icon: 'bag.fill' as IconSymbolName, color: '#F59E0B' },
    ];

    return (
        <View style={[styles.screen, { backgroundColor: colors.background }]}>
            <Animated.ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={colors.foreground} />}
            >
                {/* Header */}
                <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
                    <Text style={[styles.headerTitle, { color: colors.foreground }]}>Your Menu</Text>
                    <Text style={[styles.headerSubtitle, { color: colors.muted }]}>
                        Manage your products and pricing
                    </Text>
                </Animated.View>

                {/* Stats Row */}
                <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.statsRow}>
                    <StatPill label="Total Items" value={products.length} icon="cube.fill" color={colors.primary} />
                    <StatPill label="Coffee" value={coffeeCount} icon="leaf.fill" color="#10B981" />
                    <StatPill label="Equipment" value={equipmentCount} icon="gearshape.fill" color="#3B82F6" />
                </Animated.View>

                {/* Category Filters */}
                <Animated.View entering={FadeInDown.delay(300).springify()}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoriesScroll}
                    >
                        {CATEGORIES.map(cat => (
                            <CategoryChip
                                key={cat.type}
                                label={cat.label}
                                icon={cat.icon}
                                color={cat.color}
                                isActive={activeFilter === cat.type}
                                onPress={() => setActiveFilter(cat.type)}
                            />
                        ))}
                    </ScrollView>
                </Animated.View>

                {/* Products Grid */}
                {filteredProducts.length > 0 ? (
                    <View style={styles.productsGrid}>
                        {filteredProducts.map((item: any, index: number) => (
                            <ProductCard
                                key={item.id}
                                item={item}
                                index={index}
                                onEdit={() => router.push({ pathname: '/b2b/edit-product', params: { id: item.id } })}
                                onDelete={() => confirmDelete(item.id, item.name)}
                            />
                        ))}
                    </View>
                ) : (
                    <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.emptyState}>
                        <View style={[styles.emptyIconContainer, { backgroundColor: `${colors.primary}20` }]}>
                            <IconSymbol name="cup.and.saucer.fill" size={48} color={colors.primary} />
                        </View>
                        <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No products yet</Text>
                        <Text style={[styles.emptyDescription, { color: colors.muted }]}>
                            Add your coffee beans, equipment, and accessories to showcase in your profile.
                        </Text>
                    </Animated.View>
                )}
            </Animated.ScrollView>

            {/* Floating Add Button */}
            <Pressable
                onPress={() => {
                    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    router.push('/b2b/add-product');
                }}
                style={({ pressed }) => [styles.fab, { opacity: pressed ? 0.9 : 1 }]}
            >
                <LinearGradient
                    colors={['#D97706', '#F59E0B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.fabGradient}
                >
                    <IconSymbol name="plus" size={24} color="#FFF" />
                    <Text style={styles.fabText}>Add Product</Text>
                </LinearGradient>
            </Pressable>
        </View>
    );
}

// ============ STYLES ============

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 120,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '800',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 15,
    },

    // Stats
    statsRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 20,
    },
    statPill: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 12,
        borderRadius: 14,
    },
    statPillIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statPillValue: {
        fontSize: 18,
        fontWeight: '700',
    },
    statPillLabel: {
        fontSize: 11,
    },

    // Categories
    categoriesScroll: {
        paddingHorizontal: 20,
        gap: 10,
        marginBottom: 20,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
    },
    categoryChipText: {
        fontSize: 13,
        fontWeight: '600',
    },

    // Products Grid
    productsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        gap: 12,
    },
    productCardWrapper: {
        width: CARD_WIDTH,
    },
    productCard: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    productImageContainer: {
        height: 140,
        position: 'relative',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    productImagePlaceholder: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    typeBadge: {
        position: 'absolute',
        top: 10,
        left: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    typeBadgeText: {
        color: '#FFF',
        fontSize: 9,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    outOfStockOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    outOfStockBlur: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        overflow: 'hidden',
    },
    outOfStockText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '700',
    },
    productContent: {
        padding: 12,
        gap: 4,
    },
    productName: {
        fontSize: 14,
        fontWeight: '700',
        lineHeight: 18,
    },
    productMeta: {
        fontSize: 11,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: '700',
    },
    cardActions: {
        position: 'absolute',
        top: 10,
        right: 10,
        flexDirection: 'column',
        gap: 6,
    },
    cardActionBtn: {
        width: 28,
        height: 28,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Empty State
    emptyState: {
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingTop: 60,
    },
    emptyIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 8,
    },
    emptyDescription: {
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
    },

    // FAB
    fab: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 100 : 80,
        right: 20,
        borderRadius: 28,
        overflow: 'hidden',
        shadowColor: '#D97706',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 12,
    },
    fabGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 20,
        paddingVertical: 14,
    },
    fabText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '700',
    },
});
