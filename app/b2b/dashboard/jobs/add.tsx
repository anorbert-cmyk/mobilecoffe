import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { PremiumButton } from '@/components/ui/premium-button';
import { useColors } from '@/hooks/use-colors';
import { trpc } from '@/lib/trpc';
import * as z from 'zod';

export default function AddJob() {
    const router = useRouter();
    const colors = useColors();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        contractType: 'full-time' as const,
        netSalaryMin: '',
        netSalaryMax: '',
        contactEmail: '',
    });

    const createJob = trpc.job.create.useMutation({
        onSuccess: () => {
            Alert.alert('Success', 'Job posted successfully!');
            router.back();
        },
        onError: (err: any) => {
            Alert.alert('Error', err.message);
        }
    });

    const handleSubmit = () => {
        if (!formData.title || !formData.description || !formData.contactEmail) {
            Alert.alert('Error', 'Please fill in required fields');
            return;
        }

        createJob.mutate({
            ...formData,
            netSalaryMin: formData.netSalaryMin ? parseInt(formData.netSalaryMin) : undefined,
            netSalaryMax: formData.netSalaryMax ? parseInt(formData.netSalaryMax) : undefined,
        });
    };

    return (
        <ScreenContainer>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <PremiumButton variant="ghost" onPress={() => router.back()} style={{ marginBottom: 16 }}>
                        Back
                    </PremiumButton>
                    <Text style={[styles.title, { color: colors.foreground }]}>Post a Job</Text>
                </View>

                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.foreground }]}>Job Title</Text>
                    <TextInput
                        style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
                        placeholder="e.g. Senior Barista"
                        placeholderTextColor={colors.muted}
                        value={formData.title}
                        onChangeText={(t) => setFormData(p => ({ ...p, title: t }))}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.foreground }]}>Description</Text>
                    <TextInput
                        style={[styles.textArea, { color: colors.foreground, borderColor: colors.border }]}
                        placeholder="Describe the role..."
                        placeholderTextColor={colors.muted}
                        value={formData.description}
                        multiline
                        numberOfLines={4}
                        onChangeText={(t) => setFormData(p => ({ ...p, description: t }))}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.foreground }]}>Contract Type</Text>
                    <View style={styles.typeContainer}>
                        {(['full-time', 'part-time', 'contract', 'internship'] as const).map(type => (
                            <PremiumButton
                                key={type}
                                variant={formData.contractType === type ? 'primary' : 'ghost'}
                                onPress={() => setFormData(p => ({ ...p, contractType: type as any }))}
                                size="sm"
                                style={{ flex: 1, minWidth: '45%' }}
                            >
                                {type.replace('-', ' ')}
                            </PremiumButton>
                        ))}
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                        <Text style={[styles.label, { color: colors.foreground }]}>Min Salary (Net HUF)</Text>
                        <TextInput
                            style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
                            placeholder="300000"
                            placeholderTextColor={colors.muted}
                            keyboardType="numeric"
                            value={formData.netSalaryMin}
                            onChangeText={(t) => setFormData(p => ({ ...p, netSalaryMin: t }))}
                        />
                    </View>
                    <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                        <Text style={[styles.label, { color: colors.foreground }]}>Max Salary</Text>
                        <TextInput
                            style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
                            placeholder="450000"
                            placeholderTextColor={colors.muted}
                            keyboardType="numeric"
                            value={formData.netSalaryMax}
                            onChangeText={(t) => setFormData(p => ({ ...p, netSalaryMax: t }))}
                        />
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.foreground }]}>Contact Email</Text>
                    <TextInput
                        style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
                        placeholder="jobs@cafe.com"
                        placeholderTextColor={colors.muted}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={formData.contactEmail}
                        onChangeText={(t) => setFormData(p => ({ ...p, contactEmail: t }))}
                    />
                </View>

                <View style={{ marginTop: 24, marginBottom: 40 }}>
                    <PremiumButton
                        variant="primary"
                        onPress={handleSubmit}
                        fullWidth
                        loading={createJob.isPending}
                    >
                        Publish Job Listing
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
    header: {
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
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
    textArea: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        minHeight: 120,
        textAlignVertical: 'top',
    },
    typeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    row: {
        flexDirection: 'row',
    }
});
