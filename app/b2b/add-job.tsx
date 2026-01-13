import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { PremiumButton } from '@/components/ui/premium-button';
import { useColors } from '@/hooks/use-colors';
import { trpc } from '@/lib/trpc';
import { IconSymbol } from '@/components/ui/icon-symbol';

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


                {/* Boost Options */}
                <View style={{ marginTop: 32, marginBottom: 24 }}>
                    <Text style={[styles.title, { fontSize: 20, marginBottom: 16, color: colors.foreground }]}>
                        Boost Your Reach 🚀
                    </Text>

                    {[
                        { id: 'highlight', label: 'Highlight Post', cost: 2, desc: 'Your job stands out with a yellow background.' },
                        { id: 'pin', label: 'Pin to Top', cost: 5, desc: 'Keep your job at the top of the list for 7 days.' },
                        { id: 'smartMatch', label: 'Smart Match Email', cost: 10, desc: 'Email 50+ qualified candidates instantly.' },
                    ].map((option) => {
                        const isSelected = (formData as any)[option.id];
                        return (
                            <Pressable
                                key={option.id}
                                onPress={() => setFormData(prev => ({ ...prev, [option.id]: !isSelected }))}
                                style={[
                                    styles.boostCard,
                                    {
                                        backgroundColor: colors.surface,
                                        borderColor: isSelected ? colors.primary : 'transparent',
                                        borderWidth: 2
                                    }
                                ]}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.foreground }}>
                                            {option.label}
                                        </Text>
                                        <Text style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>
                                            {option.desc}
                                        </Text>
                                    </View>
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <Text style={{ fontWeight: 'bold', color: colors.primary }}>
                                            +{option.cost} Credits
                                        </Text>
                                        <View style={{
                                            width: 24, height: 24, borderRadius: 12, borderWidth: 2,
                                            borderColor: isSelected ? colors.primary : colors.border,
                                            marginTop: 8, alignItems: 'center', justifyContent: 'center',
                                            backgroundColor: isSelected ? colors.primary : 'transparent'
                                        }}>
                                            {isSelected && <IconSymbol name="checkmark" size={14} color="white" />}
                                        </View>
                                    </View>
                                </View>
                            </Pressable>
                        );
                    })}
                </View>

                <View style={{ marginTop: 24 }}>
                    <PremiumButton
                        variant="primary"
                        onPress={handleSubmit}
                        fullWidth
                        loading={createJob.isPending}
                    >
                        Post Job (Total: {5 + ((formData as any).highlight ? 2 : 0) + ((formData as any).pin ? 5 : 0) + ((formData as any).smartMatch ? 10 : 0)} Credits)
                    </PremiumButton>
                    <Text style={{ textAlign: 'center', color: colors.muted, marginTop: 12, fontSize: 12 }}>
                        Includes 5 credits base fee.
                    </Text>
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: { padding: 24, paddingBottom: 40 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
    formGroup: { marginBottom: 16 },
    label: { marginBottom: 8, fontWeight: '500' },
    input: { borderWidth: 1, borderRadius: 8, padding: 12 },
    boostCard: { padding: 16, borderRadius: 12, marginBottom: 12 },
});
