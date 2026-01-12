import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { PremiumButton } from '@/components/ui/premium-button';
import { useColors } from '@/hooks/use-colors';
import { trpc } from '@/lib/trpc';
// Type selection simplified - no picker needed

export default function AddProductScreen() {
    const router = useRouter();
    const colors = useColors();
    const { data: business } = trpc.business.getMine.useQuery();

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        type: 'coffee',
        description: '',
    });

    const createProduct = trpc.product.createProduct.useMutation({
        onSuccess: () => {
            Alert.alert('Success', 'Product added!');
            router.back();
        },
        onError: (err) => Alert.alert('Error', err.message),
    });

    const handleSubmit = () => {
        if (!business) return;
        createProduct.mutate({
            businessId: business.id,
            name: formData.name,
            price: parseInt(formData.price),
            type: formData.type as any,
            description: formData.description,
        });
    };

    return (
        <ScreenContainer>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={[styles.title, { color: colors.foreground }]}>Add Product</Text>

                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.foreground }]}>Name</Text>
                    <TextInput
                        style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
                        value={formData.name}
                        onChangeText={(t) => setFormData(prev => ({ ...prev, name: t }))}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.foreground }]}>Price (HUF)</Text>
                    <TextInput
                        style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
                        value={formData.price}
                        keyboardType="numeric"
                        onChangeText={(t) => setFormData(prev => ({ ...prev, price: t }))}
                    />
                </View>

                {/* Type Selection - Simplified for demo */}

                <View style={{ marginTop: 24 }}>
                    <PremiumButton
                        variant="primary"
                        onPress={handleSubmit}
                        fullWidth
                        loading={createProduct.isPending}
                    >
                        Create Product
                    </PremiumButton>
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: { padding: 24 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
    formGroup: { marginBottom: 16 },
    label: { marginBottom: 8, fontWeight: '500' },
    input: { borderWidth: 1, borderRadius: 8, padding: 12 },
});
