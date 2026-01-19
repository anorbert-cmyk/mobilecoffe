import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert, Pressable, Switch } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { PremiumButton } from '@/components/ui/premium-button';
import { PremiumCard } from '@/components/ui/premium-card';
import { useColors } from '@/hooks/use-colors';
import { trpc } from '@/lib/trpc';
import { IconSymbol } from '@/components/ui/icon-symbol';

const PRODUCT_TYPES = ['coffee', 'equipment', 'accessory'] as const;
const ROAST_LEVELS = ['light', 'medium', 'medium-dark', 'dark'] as const;

export default function EditProduct() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const colors = useColors();
    const utils = trpc.useUtils();

    const productId = typeof id === 'string' ? parseInt(id) : undefined;

    const { data: product, isLoading } = trpc.product.getProductById.useQuery(
        { id: productId! },
        { enabled: !!productId }
    );

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [type, setType] = useState<typeof PRODUCT_TYPES[number]>('coffee');
    const [roastLevel, setRoastLevel] = useState<typeof ROAST_LEVELS[number] | undefined>();
    const [isAvailable, setIsAvailable] = useState(true);

    useEffect(() => {
        if (product) {
            setName(product.name);
            setDescription(product.description || '');
            setPrice(product.price?.toString() || '');
            setType(product.type as typeof PRODUCT_TYPES[number]);
            setRoastLevel(product.roastLevel as typeof ROAST_LEVELS[number] | undefined);
            setIsAvailable(product.isAvailable ?? true);
        }
    }, [product]);

    const updateProduct = trpc.product.updateProduct.useMutation({
        onSuccess: () => {
            utils.product.listProducts.invalidate();
            Alert.alert('Success', 'Product updated');
            router.back();
        },
        onError: (error) => {
            Alert.alert('Error', error.message);
        }
    });

    const handleSave = () => {
        if (!productId) return;
        updateProduct.mutate({
            id: productId,
            name,
            description: description || undefined,
            price: parseInt(price) || undefined,
            type,
            roastLevel: type === 'coffee' ? roastLevel : undefined,
            isAvailable,
        });
    };

    if (isLoading || !product) {
        return (
            <ScreenContainer>
                <View style={styles.loadingContainer}>
                    <Text style={{ color: colors.muted }}>Loading product...</Text>
                </View>
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.header}>
                        <PremiumButton
                            variant="ghost"
                            onPress={() => router.back()}
                            leftIcon={<IconSymbol name="chevron.left" size={20} color={colors.foreground} />}
                        >
                            Back
                        </PremiumButton>
                        <Text style={[styles.title, { color: colors.foreground }]}>Edit Product</Text>
                    </View>

                    <PremiumCard style={styles.form}>
                        <View style={styles.field}>
                            <Text style={[styles.label, { color: colors.foreground }]}>Product Name *</Text>
                            <TextInput
                                style={[styles.input, { color: colors.foreground, backgroundColor: colors.surface, borderColor: colors.border }]}
                                value={name}
                                onChangeText={setName}
                                placeholder="e.g. Ethiopia Yirgacheffe"
                                placeholderTextColor={colors.muted}
                            />
                        </View>

                        <View style={styles.field}>
                            <Text style={[styles.label, { color: colors.foreground }]}>Description</Text>
                            <TextInput
                                style={[styles.input, styles.textArea, { color: colors.foreground, backgroundColor: colors.surface, borderColor: colors.border }]}
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Describe the product..."
                                placeholderTextColor={colors.muted}
                                multiline
                                numberOfLines={3}
                            />
                        </View>

                        <View style={styles.field}>
                            <Text style={[styles.label, { color: colors.foreground }]}>Type</Text>
                            <View style={styles.chipRow}>
                                {PRODUCT_TYPES.map((t) => (
                                    <Pressable
                                        key={t}
                                        onPress={() => setType(t)}
                                        style={[
                                            styles.chip,
                                            {
                                                backgroundColor: type === t ? colors.primary : colors.surface,
                                                borderColor: type === t ? colors.primary : colors.border,
                                            }
                                        ]}
                                    >
                                        <Text style={{ color: type === t ? '#FFF' : colors.foreground, fontSize: 12 }}>
                                            {t}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>

                        <View style={styles.field}>
                            <Text style={[styles.label, { color: colors.foreground }]}>Price (HUF) *</Text>
                            <TextInput
                                style={[styles.input, { color: colors.foreground, backgroundColor: colors.surface, borderColor: colors.border }]}
                                value={price}
                                onChangeText={setPrice}
                                placeholder="e.g. 4500"
                                placeholderTextColor={colors.muted}
                                keyboardType="numeric"
                            />
                        </View>

                        {type === 'coffee' && (
                            <View style={styles.field}>
                                <Text style={[styles.label, { color: colors.foreground }]}>Roast Level</Text>
                                <View style={styles.chipRow}>
                                    {ROAST_LEVELS.map((level) => (
                                        <Pressable
                                            key={level}
                                            onPress={() => setRoastLevel(level)}
                                            style={[
                                                styles.chip,
                                                {
                                                    backgroundColor: roastLevel === level ? colors.primary : colors.surface,
                                                    borderColor: roastLevel === level ? colors.primary : colors.border,
                                                }
                                            ]}
                                        >
                                            <Text style={{ color: roastLevel === level ? '#FFF' : colors.foreground, fontSize: 12 }}>
                                                {level}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </View>
                        )}

                        <View style={styles.switchRow}>
                            <Text style={[styles.label, { color: colors.foreground }]}>Available</Text>
                            <Switch
                                value={isAvailable}
                                onValueChange={setIsAvailable}
                                trackColor={{ false: colors.border, true: colors.primary }}
                            />
                        </View>
                    </PremiumCard>

                    <View style={styles.actions}>
                        <PremiumButton
                            variant="outline"
                            onPress={() => router.back()}
                            style={{ flex: 1 }}
                        >
                            Cancel
                        </PremiumButton>
                        <PremiumButton
                            onPress={handleSave}
                            loading={updateProduct.isPending}
                            style={{ flex: 1 }}
                        >
                            Save Changes
                        </PremiumButton>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        padding: 20,
        gap: 20,
    },
    header: {
        gap: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
    },
    form: {
        padding: 20,
        gap: 16,
    },
    field: {
        gap: 6,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 14,
        fontSize: 16,
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
});
