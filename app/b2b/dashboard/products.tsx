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

export default function ProductsManager() {
    const colors = useColors();
    const router = useRouter();

    const { data: business } = trpc.business.getMine.useQuery();
    const { data: products, refetch } = trpc.product.listProducts.useQuery(
        { businessId: business?.id! },
        { enabled: !!business }
    );

    const deleteProduct = trpc.product.deleteProduct.useMutation({
        onSuccess: () => refetch()
    });

    const confirmDelete = (id: number, name: string) => {
        Alert.alert(
            'Delete Product',
            `Are you sure you want to delete "${name}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deleteProduct.mutate({ id }) }
            ]
        );
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'coffee': return 'leaf.fill';
            case 'equipment': return 'gearshape.fill';
            case 'accessory': return 'bag.fill';
            default: return 'cube.fill';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'coffee': return '#10B981';
            case 'equipment': return '#3B82F6';
            case 'accessory': return '#F59E0B';
            default: return colors.primary;
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

    const coffeeProducts = products?.filter(p => p.type === 'coffee') || [];
    const equipmentProducts = products?.filter(p => p.type === 'equipment' || p.type === 'accessory') || [];

    return (
        <ScreenContainer>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
                </Pressable>
                <View style={styles.headerRow}>
                    <View>
                        <Text style={[styles.title, { color: colors.foreground }]}>Products</Text>
                        <Text style={[styles.subtitle, { color: colors.muted }]}>
                            {coffeeProducts.length} coffee, {equipmentProducts.length} equipment
                        </Text>
                    </View>
                    <PremiumButton
                        size="sm"
                        onPress={() => router.push('/b2b/add-product')}
                        leftIcon={<IconSymbol name="plus" size={16} color="#FFF" />}
                    >
                        Add
                    </PremiumButton>
                </View>
            </View>

            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <View style={styles.emptyState}>
                        <IconSymbol name="cup.and.saucer.fill" size={64} color={colors.muted} />
                        <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No products yet</Text>
                        <Text style={[styles.emptyDescription, { color: colors.muted }]}>
                            Add your coffee beans, equipment, and accessories to showcase in your profile.
                        </Text>
                        <PremiumButton
                            onPress={() => router.push('/b2b/add-product')}
                            style={{ marginTop: 20 }}
                        >
                            Add Your First Product
                        </PremiumButton>
                    </View>
                )}
                renderItem={({ item, index }) => (
                    <Animated.View entering={FadeInDown.delay(index * 60).springify()}>
                        <PremiumCard style={styles.card} elevated>
                            <View style={styles.cardRow}>
                                {/* Product Image or Icon */}
                                {(item.images as string[] | null)?.[0] ? (
                                    <Image
                                        source={{ uri: (item.images as string[])[0] }}
                                        style={styles.productImage}
                                        contentFit="cover"
                                    />
                                ) : (
                                    <View style={[styles.iconPlaceholder, { backgroundColor: getTypeColor(item.type) + '20' }]}>
                                        <IconSymbol
                                            name={getTypeIcon(item.type) as any}
                                            size={28}
                                            color={getTypeColor(item.type)}
                                        />
                                    </View>
                                )}

                                {/* Product Info */}
                                <View style={styles.productInfo}>
                                    <View style={styles.nameRow}>
                                        <Text style={[styles.productName, { color: colors.foreground }]} numberOfLines={1}>
                                            {item.name}
                                        </Text>
                                        {!item.isAvailable && (
                                            <View style={[styles.outOfStock, { backgroundColor: colors.destructive + '20' }]}>
                                                <Text style={{ color: colors.destructive, fontSize: 9, fontWeight: '700' }}>
                                                    OUT OF STOCK
                                                </Text>
                                            </View>
                                        )}
                                    </View>

                                    <View style={styles.metaRow}>
                                        <View style={[styles.typeBadge, { backgroundColor: getTypeColor(item.type) + '20' }]}>
                                            <Text style={{ color: getTypeColor(item.type), fontSize: 10, fontWeight: '700' }}>
                                                {item.type.toUpperCase()}
                                            </Text>
                                        </View>
                                        {item.roastLevel && (
                                            <Text style={[styles.roastText, { color: colors.muted }]}>
                                                {item.roastLevel} roast
                                            </Text>
                                        )}
                                        {item.weight && (
                                            <Text style={[styles.weightText, { color: colors.muted }]}>
                                                {item.weight}g
                                            </Text>
                                        )}
                                    </View>

                                    <Text style={[styles.price, { color: colors.primary }]}>
                                        {item.price?.toLocaleString()} {item.currency}
                                    </Text>
                                </View>

                                {/* Actions */}
                                <View style={styles.actions}>
                                    <Pressable
                                        onPress={() => router.push({ pathname: '/b2b/edit-product', params: { id: item.id } })}
                                        style={[styles.actionButton, { backgroundColor: colors.surface }]}
                                    >
                                        <IconSymbol name="pencil" size={16} color={colors.foreground} />
                                    </Pressable>
                                    <Pressable
                                        onPress={() => confirmDelete(item.id, item.name)}
                                        style={[styles.actionButton, { backgroundColor: colors.surface }]}
                                    >
                                        <IconSymbol name="trash" size={16} color={colors.destructive} />
                                    </Pressable>
                                </View>
                            </View>

                            {item.description && (
                                <Text style={[styles.description, { color: colors.muted }]} numberOfLines={2}>
                                    {item.description}
                                </Text>
                            )}

                            {((item.flavorNotes as string[] | null)?.length ?? 0) > 0 && (
                                <View style={styles.flavorRow}>
                                    {(item.flavorNotes as string[]).slice(0, 4).map((note, i) => (
                                        <View key={i} style={[styles.flavorChip, { backgroundColor: colors.surface }]}>
                                            <Text style={{ color: colors.foreground, fontSize: 11 }}>{note}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}
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
        gap: 12,
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
        gap: 10,
    },
    cardRow: {
        flexDirection: 'row',
        gap: 12,
    },
    productImage: {
        width: 64,
        height: 64,
        borderRadius: 10,
    },
    iconPlaceholder: {
        width: 64,
        height: 64,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    productInfo: {
        flex: 1,
        gap: 4,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    productName: {
        fontSize: 16,
        fontWeight: '700',
        flex: 1,
    },
    outOfStock: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    typeBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    roastText: {
        fontSize: 12,
        textTransform: 'capitalize',
    },
    weightText: {
        fontSize: 12,
    },
    price: {
        fontSize: 15,
        fontWeight: '700',
        marginTop: 2,
    },
    actions: {
        flexDirection: 'column',
        gap: 6,
    },
    actionButton: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    description: {
        fontSize: 13,
        lineHeight: 18,
    },
    flavorRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    flavorChip: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
});
