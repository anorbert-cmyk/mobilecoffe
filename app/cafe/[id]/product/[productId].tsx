import { View, Text, ScrollView, StyleSheet, Pressable , Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';

import { ScreenContainer } from '@/components/screen-container';
import { PremiumButton } from '@/components/ui/premium-button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { demoCafes, ShopProduct } from '@/data/cafes';

// Map specific IDs to local assets for the demo
// Note: These assets must exist in assets/images/
const PRODUCT_IMAGES: Record<string, any> = {
    'ethiopia-yirgacheffe': require('@/assets/images/ethiopia_bag.png'),
    'colombia-huila': require('@/assets/images/colombia_bag.png'),
};

export default function ProductDetailScreen() {
    const { productId, id } = useLocalSearchParams();
    const cafeId = id; // useLocalSearchParams returns id as string | string[]
    const rawCafeId = Array.isArray(cafeId) ? cafeId[0] : cafeId;
    const rawProductId = Array.isArray(productId) ? productId[0] : productId;

    const colors = useColors();
    const router = useRouter();

    const cafe = demoCafes.find(c => c.id === rawCafeId);
    const product = cafe?.shop?.find(p => p.id === rawProductId);

    const triggerHaptic = () => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    if (!product || !cafe) {
        return (
            <ScreenContainer>
                <View style={[styles.center, { backgroundColor: colors.background }]}>
                    <Text style={{ color: colors.foreground }}>Product not found: {rawProductId}</Text>
                    <PremiumButton variant="outline" onPress={() => router.back()} style={{ marginTop: 24 }}>
                        Go Back
                    </PremiumButton>
                </View>
            </ScreenContainer>
        );
    }

    const imageSource = (rawProductId && PRODUCT_IMAGES[rawProductId])
        ? PRODUCT_IMAGES[rawProductId]
        : { uri: product.imageUrl };

    return (
        <ScreenContainer>
            <View style={{ flex: 1, backgroundColor: colors.background }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.imageContainer}>
                        <Image source={imageSource} style={styles.image} contentFit="contain" />
                        <Pressable
                            onPress={() => router.back()}
                            style={[styles.backButton, { top: Platform.OS === 'ios' ? 60 : 20 }]}
                        >
                            <BlurView intensity={20} style={styles.blurButton}>
                                <IconSymbol name="chevron.left" size={24} color="#000" />
                            </BlurView>
                        </Pressable>
                    </View>

                    <Animated.View entering={FadeInDown.duration(400)} style={[styles.content, { backgroundColor: colors.background }]}>
                        <View style={styles.header}>
                            <View>
                                <Text style={[styles.brand, { color: colors.primary }]}>{cafe.name.toUpperCase()}</Text>
                                <Text style={[styles.title, { color: colors.foreground }]}>{product.name}</Text>
                            </View>
                            <Text style={[styles.price, { color: colors.foreground }]}>{product.price.toLocaleString()} Ft</Text>
                        </View>

                        {product.weight && (
                            <View style={[styles.tag, { borderColor: colors.border }]}>
                                <IconSymbol name="scalemass" size={16} color={colors.muted} />
                                <Text style={[styles.tagText, { color: colors.muted }]}>{product.weight}</Text>
                            </View>
                        )}

                        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Description</Text>
                        <Text style={[styles.description, { color: colors.muted }]}>{product.description}</Text>

                        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Delivery Options</Text>
                        <View style={styles.deliveryRow}>
                            <View style={[styles.deliveryItem, { borderColor: colors.border }]}>
                                <IconSymbol name="shippingbox.fill" size={20} color={colors.primary} />
                                <Text style={[styles.deliveryText, { color: colors.foreground }]}>Home Delivery</Text>
                                <Text style={[styles.deliverySub, { color: colors.muted }]}>1-2 days</Text>
                            </View>
                            <View style={[styles.deliveryItem, { borderColor: colors.border }]}>
                                <IconSymbol name="storefront.fill" size={20} color={colors.primary} />
                                <Text style={[styles.deliveryText, { color: colors.foreground }]}>Store Pickup</Text>
                                <Text style={[styles.deliverySub, { color: colors.muted }]}>In 1 hour</Text>
                            </View>
                        </View>

                        <View style={{ height: 100 }} />
                    </Animated.View>
                </ScrollView>

                <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
                    <PremiumButton
                        onPress={() => {
                            triggerHaptic();
                            router.push(`/cart?productId=${product.id}&cafeId=${cafe.id}`);
                        }}
                        style={{ width: '100%', flexDirection: 'row', gap: 8 }}
                    >
                        <IconSymbol name="cart.fill" size={20} color="#FFF" />
                        <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Add to Cart - {product.price.toLocaleString()} Ft</Text>
                    </PremiumButton>
                </View>
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    imageContainer: { height: 400, backgroundColor: '#F5F5F7', alignItems: 'center', justifyContent: 'center' },
    image: { width: '80%', height: '80%' },
    backButton: { position: 'absolute', left: 20 },
    blurButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.5)' },
    content: { flex: 1, padding: 24, marginTop: -30, borderTopLeftRadius: 30, borderTopRightRadius: 30, minHeight: 500 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
    brand: { fontSize: 13, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
    title: { fontSize: 24, fontWeight: '800', maxWidth: 200 },
    price: { fontSize: 24, fontWeight: '700' },
    tag: { flexDirection: 'row', gap: 6, alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100, borderWidth: 1, marginBottom: 24 },
    tagText: { fontSize: 14, fontWeight: '500' },
    sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12, marginTop: 12 },
    description: { fontSize: 16, lineHeight: 26, marginBottom: 24 },
    deliveryRow: { flexDirection: 'row', gap: 12 },
    deliveryItem: { flex: 1, padding: 16, borderRadius: 16, borderWidth: 1, alignItems: 'center', gap: 8 },
    deliveryText: { fontWeight: '600', fontSize: 14 },
    deliverySub: { fontSize: 12 },
    footer: { padding: 20, paddingBottom: 40, borderTopWidth: 1, position: 'absolute', bottom: 0, left: 0, right: 0 },
});
