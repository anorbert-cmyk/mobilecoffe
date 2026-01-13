import { View, Text, FlatList, StyleSheet } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { trpc } from '@/lib/trpc';
import { PremiumButton } from '@/components/ui/premium-button';
import { useRouter } from 'expo-router';

export default function ProductsScreen() {
    const colors = useColors();
    const router = useRouter();

    const { data: business } = trpc.business.getMine.useQuery();
    const { data: products, isLoading } = trpc.product.listProducts.useQuery(
        { businessId: business?.id! },
        { enabled: !!business?.id }
    );

    return (
        <ScreenContainer>
            <View style={{ padding: 16 }}>
                <PremiumButton onPress={() => router.push('/b2b/add-product')}>
                    Add New Product
                </PremiumButton>
            </View>

            {isLoading ? (
                <Text style={{ padding: 20, color: colors.foreground }}>Loading...</Text>
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ padding: 16 }}
                    renderItem={({ item }: { item: any }) => (
                        <View style={[styles.card, { backgroundColor: colors.surface }]}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.cardTitle, { color: colors.foreground }]}>{item.name}</Text>
                                    <View style={[styles.badge, { backgroundColor: colors.primary + '15', alignSelf: 'flex-start', marginTop: 4 }]}>
                                        <Text style={[styles.badgeText, { color: colors.primary }]}>{item.type.toUpperCase()}</Text>
                                    </View>
                                </View>
                                <Text style={[styles.priceTag, { color: colors.foreground }]}>
                                    {item.price?.toLocaleString()} Ft
                                </Text>
                            </View>

                            <Text style={{ color: colors.muted, marginBottom: 12, lineHeight: 20 }}>
                                {item.description}
                            </Text>

                            {/* Coffee Specific Details */}
                            {item.type === 'coffee' && (
                                <View style={styles.detailsGrid}>
                                    {item.roastLevel && (
                                        <View style={styles.detailItem}>
                                            <Text style={[styles.detailLabel, { color: colors.muted }]}>ROAST</Text>
                                            <Text style={[styles.detailValue, { color: colors.foreground }]}>{item.roastLevel}</Text>
                                        </View>
                                    )}
                                    {item.processMethod && (
                                        <View style={styles.detailItem}>
                                            <Text style={[styles.detailLabel, { color: colors.muted }]}>PROCESS</Text>
                                            <Text style={[styles.detailValue, { color: colors.foreground }]}>{item.processMethod}</Text>
                                        </View>
                                    )}
                                    {item.weight && (
                                        <View style={styles.detailItem}>
                                            <Text style={[styles.detailLabel, { color: colors.muted }]}>WEIGHT</Text>
                                            <Text style={[styles.detailValue, { color: colors.foreground }]}>{item.weight}g</Text>
                                        </View>
                                    )}
                                </View>
                            )}

                            {/* Flavor Notes */}
                            {item.flavorNotes && Array.isArray(item.flavorNotes) && item.flavorNotes.length > 0 && (
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                                    {item.flavorNotes.map((note: string, idx: number) => (
                                        <View key={idx} style={{ backgroundColor: colors.border, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }}>
                                            <Text style={{ fontSize: 12, color: colors.foreground }}>{note}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    )}
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', color: colors.muted, marginTop: 40 }}>
                            No products yet.
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
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    priceTag: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    detailsGrid: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 8,
        backgroundColor: '#00000005',
        padding: 8,
        borderRadius: 8,
    },
    detailItem: {
        alignItems: 'flex-start',
    },
    detailLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 14,
        textTransform: 'capitalize',
    }
});
