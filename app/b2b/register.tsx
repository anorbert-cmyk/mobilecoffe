import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { PremiumButton } from '@/components/ui/premium-button';
import { useColors } from '@/hooks/use-colors';
import { trpc } from '@/lib/trpc';
import { useUserProfile } from '@/lib/user-profile';

export default function RegisterBusiness() {
    const router = useRouter();
    const colors = useColors();
    const { profile } = useUserProfile(); // Assuming this gives us user info

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        type: 'cafe' as const,
        phone: '',
    });

    const createBusiness = trpc.business.create.useMutation({
        onSuccess: () => {
            Alert.alert('Success', 'Business registered successfully!');
            router.replace('/b2b/dashboard');
        },
        onError: (err) => {
            Alert.alert('Error', err.message);
        }
    });

    const handleSubmit = () => {
        if (!formData.name || !formData.email) {
            Alert.alert('Error', 'Name and Email are required');
            return;
        }
        createBusiness.mutate(formData);
    };

    return (
        <ScreenContainer>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={[styles.title, { color: colors.foreground }]}>
                    Register Business
                </Text>

                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.foreground }]}>Business Name</Text>
                    <TextInput
                        style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
                        placeholder="e.g. My Awesome Cafe"
                        placeholderTextColor={colors.muted}
                        value={formData.name}
                        onChangeText={(t) => setFormData(prev => ({ ...prev, name: t }))}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.foreground }]}>Business Email</Text>
                    <TextInput
                        style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
                        placeholder="contact@cafe.com"
                        placeholderTextColor={colors.muted}
                        value={formData.email}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        onChangeText={(t) => setFormData(prev => ({ ...prev, email: t }))}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.foreground }]}>Phone (Optional)</Text>
                    <TextInput
                        style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
                        placeholder="+36..."
                        placeholderTextColor={colors.muted}
                        value={formData.phone}
                        keyboardType="phone-pad"
                        onChangeText={(t) => setFormData(prev => ({ ...prev, phone: t }))}
                    />
                </View>

                <View style={{ marginTop: 24 }}>
                    <PremiumButton
                        variant="primary"
                        onPress={handleSubmit}
                        fullWidth
                        loading={createBusiness.isPending}
                    >
                        Create Business Profile
                    </PremiumButton>
                </View>

            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 32,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
    },
});
