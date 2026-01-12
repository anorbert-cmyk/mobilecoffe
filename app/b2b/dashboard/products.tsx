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
                <Text style={{ p: 20, color: colors.foreground }}>Loading...</Text>
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ padding: 16 }}
                    renderItem={({ item }) => (
                        <View style={[styles.card, { backgroundColor: colors.surface }]}>
                            <Text style={[styles.cardTitle, { color: colors.foreground }]}>{item.name}</Text>
                            <Text style={{ color: colors.muted }}>{item.price} {item.currency}</Text>
                            <Text style={{ color: colors.muted }}>{item.type}</Text>
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
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
});
