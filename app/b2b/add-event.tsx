import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { PremiumButton } from '@/components/ui/premium-button';
import { useColors } from '@/hooks/use-colors';
import { trpc } from '@/lib/trpc';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function AddEvent() {
    const router = useRouter();
    const colors = useColors();

    const { data: business } = trpc.business.getMine.useQuery();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        date: new Date().toISOString(), // Simplified for now, should use a DatePicker
        location: '',
        price: '',
    });

    const createEvent = trpc.event.create.useMutation({
        onSuccess: () => {
            Alert.alert('Success', 'Event created!');
            router.back();
        },
        onError: (err) => Alert.alert('Error', err.message)
    });

    const handleSubmit = () => {
        if (!business) return;
        if (!formData.name || !formData.date || !formData.location) {
            Alert.alert('Error', 'Please fill required fields');
            return;
        }

        createEvent.mutate({
            businessId: business.id,
            name: formData.name,
            description: formData.description,
            date: formData.date,
            location: formData.location,
            price: Number(formData.price) || 0,
        });
    };

    return (
        <ScreenContainer>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()}>
                    <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
                </Pressable>
                <Text style={[styles.title, { color: colors.foreground, marginLeft: 16 }]}>New Event</Text>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.foreground }]}>Event Name</Text>
                    <TextInput
                        style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
                        placeholder="e.g. Cupping Session"
                        placeholderTextColor={colors.muted}
                        value={formData.name}
                        onChangeText={(t) => setFormData(prev => ({ ...prev, name: t }))}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.foreground }]}>Date (YYYY-MM-DD)</Text>
                    <TextInput
                        style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
                        placeholder="2026-05-20"
                        placeholderTextColor={colors.muted}
                        value={formData.date}
                        onChangeText={(t) => setFormData(prev => ({ ...prev, date: t }))}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.foreground }]}>Location</Text>
                    <TextInput
                        style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
                        placeholder="e.g. Main Roastery Room"
                        placeholderTextColor={colors.muted}
                        value={formData.location}
                        onChangeText={(t) => setFormData(prev => ({ ...prev, location: t }))}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.foreground }]}>Price (HUF)</Text>
                    <TextInput
                        style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
                        placeholder="0 for free"
                        placeholderTextColor={colors.muted}
                        value={formData.price}
                        keyboardType="numeric"
                        onChangeText={(t) => setFormData(prev => ({ ...prev, price: t }))}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.foreground }]}>Description</Text>
                    <TextInput
                        style={[styles.input, { color: colors.foreground, borderColor: colors.border, height: 100 }]}
                        placeholder="Tell us about the event..."
                        placeholderTextColor={colors.muted}
                        multiline
                        textAlignVertical="top"
                        value={formData.description}
                        onChangeText={(t) => setFormData(prev => ({ ...prev, description: t }))}
                    />
                </View>

                <PremiumButton
                    onPress={handleSubmit}
                    loading={createEvent.isPending}
                    fullWidth
                >
                    Create Event
                </PremiumButton>

            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    header: {
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    container: {
        padding: 20,
        paddingTop: 0,
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
