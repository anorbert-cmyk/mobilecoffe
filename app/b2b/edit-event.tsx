import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { PremiumButton } from '@/components/ui/premium-button';
import { PremiumCard } from '@/components/ui/premium-card';
import { useColors } from '@/hooks/use-colors';
import { trpc } from '@/lib/trpc';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function EditEvent() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const colors = useColors();
    const utils = trpc.useUtils();

    const eventId = typeof id === 'string' ? parseInt(id) : undefined;

    const { data: event, isLoading } = trpc.event.getById.useQuery(
        { id: eventId! },
        { enabled: !!eventId }
    );

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [price, setPrice] = useState('');
    const [maxAttendees, setMaxAttendees] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        if (event) {
            setName(event.name);
            setDescription(event.description);
            setLocation(event.location);
            setPrice(event.price?.toString() || '0');
            setMaxAttendees(event.maxAttendees?.toString() || '');
            setImageUrl(event.imageUrl || '');
        }
    }, [event]);

    const updateEvent = trpc.event.update.useMutation({
        onSuccess: () => {
            utils.event.listByBusiness.invalidate();
            Alert.alert('Success', 'Event updated successfully');
            router.back();
        },
        onError: (error) => {
            Alert.alert('Error', error.message);
        }
    });

    const handleSave = () => {
        if (!eventId) return;
        updateEvent.mutate({
            id: eventId,
            name,
            description,
            location,
            price: parseInt(price) || 0,
            maxAttendees: maxAttendees ? parseInt(maxAttendees) : undefined,
            imageUrl: imageUrl || undefined,
        });
    };

    if (isLoading || !event) {
        return (
            <ScreenContainer>
                <View style={styles.loadingContainer}>
                    <Text style={{ color: colors.muted }}>Loading event...</Text>
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
                        <Text style={[styles.title, { color: colors.foreground }]}>Edit Event</Text>
                    </View>

                    <PremiumCard style={styles.form}>
                        <View style={styles.field}>
                            <Text style={[styles.label, { color: colors.foreground }]}>Event Name *</Text>
                            <TextInput
                                style={[styles.input, { color: colors.foreground, backgroundColor: colors.surface, borderColor: colors.border }]}
                                value={name}
                                onChangeText={setName}
                                placeholder="e.g. Latte Art Workshop"
                                placeholderTextColor={colors.muted}
                            />
                        </View>

                        <View style={styles.field}>
                            <Text style={[styles.label, { color: colors.foreground }]}>Description *</Text>
                            <TextInput
                                style={[styles.input, styles.textArea, { color: colors.foreground, backgroundColor: colors.surface, borderColor: colors.border }]}
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Describe your event..."
                                placeholderTextColor={colors.muted}
                                multiline
                                numberOfLines={4}
                            />
                        </View>

                        <View style={styles.field}>
                            <Text style={[styles.label, { color: colors.foreground }]}>Location *</Text>
                            <TextInput
                                style={[styles.input, { color: colors.foreground, backgroundColor: colors.surface, borderColor: colors.border }]}
                                value={location}
                                onChangeText={setLocation}
                                placeholder="e.g. Our Cafe, Downtown"
                                placeholderTextColor={colors.muted}
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.field, { flex: 1 }]}>
                                <Text style={[styles.label, { color: colors.foreground }]}>Price (HUF)</Text>
                                <TextInput
                                    style={[styles.input, { color: colors.foreground, backgroundColor: colors.surface, borderColor: colors.border }]}
                                    value={price}
                                    onChangeText={setPrice}
                                    placeholder="0 = Free"
                                    placeholderTextColor={colors.muted}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={[styles.field, { flex: 1 }]}>
                                <Text style={[styles.label, { color: colors.foreground }]}>Max Attendees</Text>
                                <TextInput
                                    style={[styles.input, { color: colors.foreground, backgroundColor: colors.surface, borderColor: colors.border }]}
                                    value={maxAttendees}
                                    onChangeText={setMaxAttendees}
                                    placeholder="Optional"
                                    placeholderTextColor={colors.muted}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        <View style={styles.field}>
                            <Text style={[styles.label, { color: colors.foreground }]}>Image URL</Text>
                            <TextInput
                                style={[styles.input, { color: colors.foreground, backgroundColor: colors.surface, borderColor: colors.border }]}
                                value={imageUrl}
                                onChangeText={setImageUrl}
                                placeholder="https://..."
                                placeholderTextColor={colors.muted}
                                autoCapitalize="none"
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
                            loading={updateEvent.isPending}
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
        minHeight: 100,
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
});
