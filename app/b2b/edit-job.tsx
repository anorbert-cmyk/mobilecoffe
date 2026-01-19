import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { PremiumButton } from '@/components/ui/premium-button';
import { PremiumCard } from '@/components/ui/premium-card';
import { useColors } from '@/hooks/use-colors';
import { trpc } from '@/lib/trpc';
import { IconSymbol } from '@/components/ui/icon-symbol';

const CONTRACT_TYPES = ['full-time', 'part-time', 'contract', 'internship', 'seasonal'] as const;
const STATUSES = ['draft', 'active', 'paused', 'filled'] as const;

export default function EditJob() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const colors = useColors();
    const utils = trpc.useUtils();

    const jobId = typeof id === 'string' ? parseInt(id) : undefined;

    const { data: job, isLoading } = trpc.job.getById.useQuery(
        { id: jobId! },
        { enabled: !!jobId }
    );

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [salaryMin, setSalaryMin] = useState('');
    const [salaryMax, setSalaryMax] = useState('');
    const [contractType, setContractType] = useState<typeof CONTRACT_TYPES[number]>('full-time');
    const [workingHours, setWorkingHours] = useState('');
    const [status, setStatus] = useState<typeof STATUSES[number]>('active');

    useEffect(() => {
        if (job) {
            setTitle(job.title);
            setDescription(job.description);
            setSalaryMin(job.netSalaryMin?.toString() || '');
            setSalaryMax(job.netSalaryMax?.toString() || '');
            setContractType(job.contractType as typeof CONTRACT_TYPES[number]);
            setWorkingHours(job.workingHours || '');
            setStatus((job.status as typeof STATUSES[number]) || 'active');
        }
    }, [job]);

    const updateJob = trpc.job.update.useMutation({
        onSuccess: () => {
            utils.job.listByBusiness.invalidate();
            Alert.alert('Success', 'Job listing updated');
            router.back();
        },
        onError: (error) => {
            Alert.alert('Error', error.message);
        }
    });

    const handleSave = () => {
        if (!jobId) return;
        updateJob.mutate({
            id: jobId,
            title,
            description,
            netSalaryMin: parseInt(salaryMin) || undefined,
            netSalaryMax: parseInt(salaryMax) || undefined,
            contractType,
            workingHours: workingHours || undefined,
            status,
        });
    };

    if (isLoading || !job) {
        return (
            <ScreenContainer>
                <View style={styles.loadingContainer}>
                    <Text style={{ color: colors.muted }}>Loading job...</Text>
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
                        <Text style={[styles.title, { color: colors.foreground }]}>Edit Job</Text>
                    </View>

                    <PremiumCard style={styles.form}>
                        <View style={styles.field}>
                            <Text style={[styles.label, { color: colors.foreground }]}>Job Title *</Text>
                            <TextInput
                                style={[styles.input, { color: colors.foreground, backgroundColor: colors.surface, borderColor: colors.border }]}
                                value={title}
                                onChangeText={setTitle}
                                placeholder="e.g. Senior Barista"
                                placeholderTextColor={colors.muted}
                            />
                        </View>

                        <View style={styles.field}>
                            <Text style={[styles.label, { color: colors.foreground }]}>Description *</Text>
                            <TextInput
                                style={[styles.input, styles.textArea, { color: colors.foreground, backgroundColor: colors.surface, borderColor: colors.border }]}
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Describe the role..."
                                placeholderTextColor={colors.muted}
                                multiline
                                numberOfLines={4}
                            />
                        </View>

                        <View style={styles.field}>
                            <Text style={[styles.label, { color: colors.foreground }]}>Contract Type</Text>
                            <View style={styles.chipRow}>
                                {CONTRACT_TYPES.map((type) => (
                                    <Pressable
                                        key={type}
                                        onPress={() => setContractType(type)}
                                        style={[
                                            styles.chip,
                                            {
                                                backgroundColor: contractType === type ? colors.primary : colors.surface,
                                                borderColor: contractType === type ? colors.primary : colors.border,
                                            }
                                        ]}
                                    >
                                        <Text style={{ color: contractType === type ? '#FFF' : colors.foreground, fontSize: 12 }}>
                                            {type.replace('-', ' ')}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.field, { flex: 1 }]}>
                                <Text style={[styles.label, { color: colors.foreground }]}>Min Salary (Ft)</Text>
                                <TextInput
                                    style={[styles.input, { color: colors.foreground, backgroundColor: colors.surface, borderColor: colors.border }]}
                                    value={salaryMin}
                                    onChangeText={setSalaryMin}
                                    placeholder="200000"
                                    placeholderTextColor={colors.muted}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={[styles.field, { flex: 1 }]}>
                                <Text style={[styles.label, { color: colors.foreground }]}>Max Salary (Ft)</Text>
                                <TextInput
                                    style={[styles.input, { color: colors.foreground, backgroundColor: colors.surface, borderColor: colors.border }]}
                                    value={salaryMax}
                                    onChangeText={setSalaryMax}
                                    placeholder="350000"
                                    placeholderTextColor={colors.muted}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        <View style={styles.field}>
                            <Text style={[styles.label, { color: colors.foreground }]}>Working Hours</Text>
                            <TextInput
                                style={[styles.input, { color: colors.foreground, backgroundColor: colors.surface, borderColor: colors.border }]}
                                value={workingHours}
                                onChangeText={setWorkingHours}
                                placeholder="e.g. 9:00 - 17:00"
                                placeholderTextColor={colors.muted}
                            />
                        </View>

                        <View style={styles.field}>
                            <Text style={[styles.label, { color: colors.foreground }]}>Status</Text>
                            <View style={styles.chipRow}>
                                {STATUSES.map((s) => (
                                    <Pressable
                                        key={s}
                                        onPress={() => setStatus(s)}
                                        style={[
                                            styles.chip,
                                            {
                                                backgroundColor: status === s ? colors.primary : colors.surface,
                                                borderColor: status === s ? colors.primary : colors.border,
                                            }
                                        ]}
                                    >
                                        <Text style={{ color: status === s ? '#FFF' : colors.foreground, fontSize: 12 }}>
                                            {s}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
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
                            loading={updateJob.isPending}
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
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
});
