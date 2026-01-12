import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { PremiumButton } from '@/components/ui/premium-button';
import { useColors } from '@/hooks/use-colors';
import { trpc } from '@/lib/trpc';

export default function AddJobScreen() {
    const router = useRouter();
    const colors = useColors();
    const { data: business } = trpc.business.getMine.useQuery();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        netSalaryMin: '',
        netSalaryMax: '',
        contractType: 'full-time',
        workingHours: '40h/week',
        contactEmail: '',
    });

    const createJob = trpc.job.create.useMutation({
        onSuccess: () => {
            Alert.alert('Success', 'Job posted!');
            router.back();
        },
        onError: (err) => Alert.alert('Error', err.message),
    });

    const handleSubmit = () => {
        if (!business) return;
        createJob.mutate({
            businessId: business.id,
            title: formData.title,
            description: formData.description,
            netSalaryMin: parseInt(formData.netSalaryMin),
            netSalaryMax: parseInt(formData.netSalaryMax),
            contractType: formData.contractType as any,
            workingHours: formData.workingHours,
            startDate: new Date(), // Default to now
            contactEmail: formData.contactEmail || business.email,
        });
    };

    return (
        <ScreenContainer>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={[styles.title, { color: colors.foreground }]}>Post a Job</Text>

                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.foreground }]}>Job Title</Text>
                    <TextInput
                        style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
                        value={formData.title}
                        onChangeText={(t) => setFormData(prev => ({ ...prev, title: t }))}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.foreground }]}>Description</Text>
                    <TextInput
                        style={[styles.input, { color: colors.foreground, borderColor: colors.border, height: 100 }]}
                        multiline
                        value={formData.description}
                        onChangeText={(t) => setFormData(prev => ({ ...prev, description: t }))}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.foreground }]}>Contact Email</Text>
                    <TextInput
                        style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
                        value={formData.contactEmail}
                        onChangeText={(t) => setFormData(prev => ({ ...prev, contactEmail: t }))}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.foreground }]}>Salary Range (Min)</Text>
                    <TextInput
                        style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
                        value={formData.netSalaryMin}
                        keyboardType="numeric"
                        onChangeText={(t) => setFormData(prev => ({ ...prev, netSalaryMin: t }))}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: colors.foreground }]}>Salary Range (Max)</Text>
                    <TextInput
                        style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
                        value={formData.netSalaryMax}
                        keyboardType="numeric"
                        onChangeText={(t) => setFormData(prev => ({ ...prev, netSalaryMax: t }))}
                    />
                </View>


                <View style={{ marginTop: 24 }}>
                    <PremiumButton
                        variant="primary"
                        onPress={handleSubmit}
                        fullWidth
                        loading={createJob.isPending}
                    >
                        Post Job (5 Credits)
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
