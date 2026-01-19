import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, TextInput, Alert, ActivityIndicator , Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';

import { ScreenContainer } from '@/components/screen-container';
import { PremiumButton } from '@/components/ui/premium-button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { demoCafes } from '@/data/cafes';

export default function CartScreen() {
    const { productId, cafeId } = useLocalSearchParams();
    const colors = useColors();
    const router = useRouter();
    const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
    const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
    const [isProcessing, setIsProcessing] = useState(false);

    // Mock Cart Item
    const cafe = demoCafes.find(c => c.id === cafeId);
    const product = cafe?.shop?.find(p => p.id === productId);

    const triggerHaptic = () => {
        if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handleCheckout = () => {
        triggerHaptic();
        setStep('checkout');
    };

    const handlePayment = async () => {
        triggerHaptic();
        setIsProcessing(true);
        // Simulate Apple Pay / Payment processing
        setTimeout(() => {
            setIsProcessing(false);
            setStep('success');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }, 2000);
    };

    if (step === 'success') {
        return (
            <ScreenContainer>
                <View style={styles.center}>
                    <View style={[styles.successIcon, { backgroundColor: colors.success + '20' }]}>
                        <IconSymbol name="checkmark" size={40} color={colors.success} />
                    </View>
                    <Text style={[styles.successTitle, { color: colors.foreground }]}>Order Confirmed!</Text>
                    <Text style={[styles.successDesc, { color: colors.muted }]}>
                        Thank you for your order. We&apos;ve sent a confirmation email to you.
                    </Text>
                    <PremiumButton onPress={() => router.replace(`/cafe/${cafeId}`)} style={{ marginTop: 32, width: 200 }}>
                        Back to Cafe
                    </PremiumButton>
                </View>
            </ScreenContainer>
        );
    }

    if (!product || !cafe) {
        return (
            <ScreenContainer>
                <View style={styles.center}><Text>Cart Error</Text></View>
            </ScreenContainer>
        );
    }

    const total = (product.price) + (deliveryMethod === 'delivery' ? 990 : 0);

    return (
        <ScreenContainer>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Pressable onPress={() => step === 'checkout' ? setStep('cart') : router.back()} style={styles.closeButton}>
                    <IconSymbol name={step === 'checkout' ? "chevron.left" : "xmark"} size={24} color={colors.foreground} />
                </Pressable>
                <Text style={[styles.headerTitle, { color: colors.foreground }]}>
                    {step === 'cart' ? 'My Cart' : 'Checkout'}
                </Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
                {step === 'cart' ? (
                    <>
                        {/* Cart Item */}
                        <View style={[styles.cartItem, { backgroundColor: colors.surface }]}>
                            <Image source={{ uri: product.imageUrl }} style={styles.itemImage} />
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.itemName, { color: colors.foreground }]}>{product.name}</Text>
                                <Text style={[styles.itemVariant, { color: colors.muted }]}>{product.weight || 'One Size'}</Text>
                                <Text style={[styles.itemPrice, { color: colors.primary }]}>{product.price.toLocaleString()} Ft</Text>
                            </View>
                            <View style={[styles.qtyControl, { borderColor: colors.border }]}>
                                <Text style={{ fontSize: 16 }}>1</Text>
                            </View>
                        </View>

                        <View style={[styles.summary, { backgroundColor: colors.surface }]}>
                            <View style={styles.summaryRow}>
                                <Text style={{ color: colors.muted }}>Subtotal</Text>
                                <Text style={{ color: colors.foreground }}>{product.price.toLocaleString()} Ft</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={{ color: colors.muted }}>Delivery</Text>
                                <Text style={{ color: colors.foreground }}>Calculated at checkout</Text>
                            </View>
                            <View style={[styles.divider, { backgroundColor: colors.border }]} />
                            <View style={styles.summaryRow}>
                                <Text style={[styles.totalLabel, { color: colors.foreground }]}>Total</Text>
                                <Text style={[styles.totalValue, { color: colors.foreground }]}>{product.price.toLocaleString()} Ft</Text>
                            </View>
                        </View>
                    </>
                ) : (
                    <>
                        {/* Checkout Step */}
                        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Delivery Method</Text>
                        <View style={styles.methodRow}>
                            <Pressable
                                onPress={() => setDeliveryMethod('delivery')}
                                style={[
                                    styles.methodCard,
                                    { borderColor: deliveryMethod === 'delivery' ? colors.primary : colors.border },
                                    deliveryMethod === 'delivery' && { backgroundColor: colors.primary + '10' }
                                ]}
                            >
                                <IconSymbol name="shippingbox.fill" size={24} color={deliveryMethod === 'delivery' ? colors.primary : colors.muted} />
                                <Text style={[styles.methodTitle, { color: colors.foreground }]}>Delivery</Text>
                                <Text style={{ color: colors.muted, fontSize: 12 }}>990 Ft</Text>
                            </Pressable>

                            <Pressable
                                onPress={() => setDeliveryMethod('pickup')}
                                style={[
                                    styles.methodCard,
                                    { borderColor: deliveryMethod === 'pickup' ? colors.primary : colors.border },
                                    deliveryMethod === 'pickup' && { backgroundColor: colors.primary + '10' }
                                ]}
                            >
                                <IconSymbol name="storefront.fill" size={24} color={deliveryMethod === 'pickup' ? colors.primary : colors.muted} />
                                <Text style={[styles.methodTitle, { color: colors.foreground }]}>Pickup</Text>
                                <Text style={{ color: colors.muted, fontSize: 12 }}>Free</Text>
                            </Pressable>
                        </View>

                        {deliveryMethod === 'delivery' && (
                            <View style={{ marginTop: 24 }}>
                                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Shipping Address</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: colors.surface, color: colors.foreground }]}
                                    placeholder="Full Name"
                                    placeholderTextColor={colors.muted}
                                    defaultValue="Norbert Barna"
                                />
                                <TextInput
                                    style={[styles.input, { backgroundColor: colors.surface, color: colors.foreground }]}
                                    placeholder="Street Address"
                                    placeholderTextColor={colors.muted}
                                    defaultValue="Kossuth Lajos tér 1-3"
                                />
                                <View style={{ flexDirection: 'row', gap: 12 }}>
                                    <TextInput
                                        style={[styles.input, { flex: 1, backgroundColor: colors.surface, color: colors.foreground }]}
                                        placeholder="City"
                                        placeholderTextColor={colors.muted}
                                        defaultValue="Budapest"
                                    />
                                    <TextInput
                                        style={[styles.input, { width: 100, backgroundColor: colors.surface, color: colors.foreground }]}
                                        placeholder="ZIP"
                                        placeholderTextColor={colors.muted}
                                        defaultValue="1055"
                                    />
                                </View>
                            </View>
                        )}

                        <Text style={[styles.sectionTitle, { color: colors.foreground, marginTop: 24 }]}>Payment</Text>
                        <View style={[styles.paymentCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                <IconSymbol name="apple.logo" size={24} color={colors.foreground} />
                                <Text style={{ fontSize: 16, fontWeight: '600', color: colors.foreground }}>Apple Pay</Text>
                            </View>
                            <IconSymbol name="checkmark.circle.fill" size={20} color={colors.primary} />
                        </View>
                        <View style={[styles.paymentCard, { backgroundColor: colors.surface, borderColor: colors.border, marginTop: 12 }]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                <IconSymbol name="creditcard.fill" size={24} color={colors.muted} />
                                <Text style={{ fontSize: 16, fontWeight: '600', color: colors.muted }}>Credit / Debit Card</Text>
                            </View>
                            <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: colors.border }} />
                        </View>

                        <View style={{ height: 100 }} />
                    </>
                )}
            </ScrollView>

            <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
                {step === 'checkout' && (
                    <View style={styles.checkoutTotalRow}>
                        <Text style={{ color: colors.muted }}>Total to pay</Text>
                        <Text style={{ fontSize: 18, fontWeight: '700', color: colors.foreground }}>{total.toLocaleString()} Ft</Text>
                    </View>
                )}
                <PremiumButton
                    onPress={step === 'cart' ? handleCheckout : handlePayment}
                    style={{ width: '100%' }}
                    loading={isProcessing}
                >
                    {step === 'cart' ? 'Proceed to Checkout' : `Pay with Apple Pay`}
                </PremiumButton>
            </View>

            {isProcessing && (
                <BlurView intensity={20} style={StyleSheet.absoluteFill}>
                    <View style={[styles.center, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                        <ActivityIndicator size="large" color="#FFF" />
                    </View>
                </BlurView>
            )}
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingTop: 60, borderBottomWidth: 1 },
    closeButton: { padding: 8 },
    headerTitle: { fontSize: 17, fontWeight: '600' },

    cartItem: { flexDirection: 'row', padding: 12, borderRadius: 16, marginBottom: 20, gap: 12 },
    itemImage: { width: 80, height: 80, borderRadius: 8, backgroundColor: '#eee' },
    itemName: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
    itemVariant: { fontSize: 14, marginBottom: 4 },
    itemPrice: { fontSize: 16, fontWeight: '600' },
    qtyControl: { paddingHorizontal: 12, justifyContent: 'center', borderWidth: 1, borderRadius: 8 },

    summary: { padding: 20, borderRadius: 16, gap: 12 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
    divider: { height: 1, marginVertical: 4 },
    totalLabel: { fontSize: 18, fontWeight: '700' },
    totalValue: { fontSize: 18, fontWeight: '800' },

    sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
    methodRow: { flexDirection: 'row', gap: 12 },
    methodCard: { flex: 1, padding: 16, borderRadius: 12, borderWidth: 1, alignItems: 'center', gap: 8 },
    methodTitle: { fontWeight: '600' },

    input: { height: 50, borderRadius: 12, paddingHorizontal: 16, fontSize: 16, marginBottom: 12 },
    paymentCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1 },

    footer: { padding: 20, paddingBottom: 40, borderTopWidth: 1, position: 'absolute', bottom: 0, left: 0, right: 0 },
    checkoutTotalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' },

    successIcon: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
    successTitle: { fontSize: 24, fontWeight: '800', marginBottom: 8 },
    successDesc: { textAlign: 'center', fontSize: 16, lineHeight: 24 },
});
