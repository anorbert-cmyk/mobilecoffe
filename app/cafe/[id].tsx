import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { trpc } from '@/lib/trpc';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PremiumButton } from '@/components/ui/premium-button';

export default function CafeDetailScreen() {
    const { id } = useLocalSearchParams();
    const colors = useColors();
    const router = useRouter();

    const businessId = typeof id === 'string' ? parseInt(id) : undefined;

    const { data: business, isLoading } = trpc.business.getById.useQuery(
        { id: businessId! },
        { enabled: !!businessId }
    );

    if (isLoading) return <ScreenContainer><Text style={{ padding: 20 }}>Loading...</Text></ScreenContainer>;
    if (!business) return <ScreenContainer><Text style={{ padding: 20 }}>Cafe not found.</Text></ScreenContainer>;

    return (
        <ScreenContainer>
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Header Image */}
                <View style={styles.headerImageContainer}>
                    {(business.headerImageUrls as string[] | null)?.[0] ? (
                        <Image source={{ uri: (business.headerImageUrls as string[])[0] }} style={styles.headerImage} />
                    ) : (
                        <View style={[styles.headerImage, { backgroundColor: colors.primary }]} />
                    )}
                    <View style={styles.headerOverlay}>
                        <Text style={[styles.cafeName, { color: 'white' }]}>{business.name}</Text>
                        <Text style={{ color: 'white', opacity: 0.9 }}>{(business.address as { city?: string } | null)?.city}</Text>
                    </View>
                </View>

                <View style={styles.content}>
                    {/* Action Bar */}
                    <View style={styles.actionBar}>
                        <PremiumButton
                            variant="primary"
                            size="sm"
                            onPress={() => { /* Navigate */ }}
                        >
                            Directions
                        </PremiumButton>
                        <PremiumButton
                            variant="outline"
                            size="sm"
                            onPress={() => { /* Call */ }}
                        >
                            Call
                        </PremiumButton>
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>About</Text>
                        <Text style={{ color: colors.muted, lineHeight: 22 }}>
                            {business.description || 'Welcome to our cafe. We serve specialty coffee grounded with passion.'}
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Menu</Text>
                        {/* Render categories */}
                        {(business.menuCategories as Array<{ id: number, name: string, items?: Array<{ id: number, name: string, price: number }> }>)?.map((category) => (
                            <View key={category.id} style={{ marginBottom: 16 }}>
                                <Text style={[styles.categoryTitle, { color: colors.primary }]}>{category.name}</Text>
                                {category.items?.map((item) => (
                                    <View key={item.id} style={styles.menuItem}>
                                        <Text style={{ color: colors.foreground, flex: 1 }}>{item.name}</Text>
                                        <Text style={{ color: colors.primary, fontWeight: 'bold' }}>{item.price} Ft</Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>

                </View>

            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    headerImageContainer: {
        height: 250,
        width: '100%',
        position: 'relative',
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    headerOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    cafeName: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    content: {
        padding: 20,
    },
    actionBar: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    categoryTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
    },
});
