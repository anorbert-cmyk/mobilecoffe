import { View, Text, ScrollView, StyleSheet, Pressable, Linking , Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { ScreenContainer } from '@/components/screen-container';
import { PremiumCard } from '@/components/ui/premium-card';
import { PremiumButton } from '@/components/ui/premium-button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { demoCafes } from '@/data/cafes';
import { trpc } from '@/lib/trpc';

export default function JobDetailScreen() {
    const { jobId, id } = useLocalSearchParams<{ jobId: string; id: string }>();
    const rawId = id;
    const businessId = parseInt(rawId || '', 10);
    const isNumericId = !isNaN(businessId) && businessId > 0;

    const colors = useColors();
    const router = useRouter();

    // Query backend if numeric
    const { data: backendBusiness, isLoading: isBackendLoading } = trpc.business.getById.useQuery(
        { id: businessId },
        { enabled: isNumericId }
    );

    const triggerHaptic = () => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    let job: any;
    let cafeName: string = '';
    let cafeAddress: string = '';

    if (isNumericId && backendBusiness) {
        job = backendBusiness.jobs.find((j: any) => String(j.id) === jobId);
        cafeName = backendBusiness.name;
        // Handle address object safely
        const addr = backendBusiness.address as any;
        cafeAddress = addr?.street || addr?.city || 'Budapest';
    } else if (!isNumericId && rawId) {
        const cafe = demoCafes.find(c => c.id === rawId);
        job = cafe?.jobs.find(j => j.id === jobId);
        cafeName = cafe?.name || '';
        cafeAddress = cafe?.address || '';
    }

    if (isNumericId && isBackendLoading) {
        return (
            <ScreenContainer>
                <View style={styles.center}>
                    <Text style={{ color: colors.muted }}>Loading job...</Text>
                </View>
            </ScreenContainer>
        );
    }

    if (!job) {
        return (
            <ScreenContainer>
                <View style={styles.center}>
                    <IconSymbol name="briefcase.fill" size={48} color={colors.muted} />
                    <Text style={{ color: colors.foreground, marginTop: 12, fontSize: 18 }}>Job not found</Text>
                    <PremiumButton variant="outline" onPress={() => router.back()} style={{ marginTop: 24 }}>
                        Go Back
                    </PremiumButton>
                </View>
            </ScreenContainer>
        );
    }

    // Mapping for backend vs demo
    const jobType = job.type || job.contractType; // backend might use different field name
    const jobTitle = job.title;
    const salaryMin = job.netSalaryMin || job.salaryMin;
    const salaryMax = job.netSalaryMax || job.salaryMax;
    const description = job.description;

    const jobTypeBadgeColor = jobType === 'full-time' ? '#10B981' : jobType === 'part-time' ? '#3B82F6' : '#F59E0B';
    const jobTypeLabel = jobType === 'full-time' ? 'Teljes munkaidő' : jobType === 'part-time' ? 'Részmunkaidő' : 'Szerződéses';

    return (
        <ScreenContainer>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Header */}
                <View style={[styles.header, { backgroundColor: colors.surface }]}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
                    </Pressable>
                    <Text style={[styles.headerTitle, { color: colors.foreground }]}>Állásajánlat</Text>
                    <View style={{ width: 24 }} />
                </View>

                <Animated.View entering={FadeInDown.duration(400)} style={{ padding: 20 }}>
                    {/* Job Title and Badge */}
                    <View style={styles.titleSection}>
                        <Text style={[styles.jobTitle, { color: colors.foreground }]}>{jobTitle}</Text>
                        <View style={[styles.typeBadge, { backgroundColor: jobTypeBadgeColor + '20' }]}>
                            <Text style={[styles.typeBadgeText, { color: jobTypeBadgeColor }]}>{jobTypeLabel}</Text>
                        </View>
                    </View>

                    {/* Company Card */}
                    <PremiumCard style={styles.companyCard}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                            <View style={[styles.companyIcon, { backgroundColor: colors.primary + '20' }]}>
                                <IconSymbol name="cup.and.saucer.fill" size={24} color={colors.primary} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.companyName, { color: colors.foreground }]}>{cafeName}</Text>
                                <Text style={[styles.companyAddress, { color: colors.muted }]}>{cafeAddress}</Text>
                            </View>
                        </View>
                    </PremiumCard>

                    {/* Salary Section */}
                    <View style={[styles.salaryCard, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
                        <IconSymbol name="banknote.fill" size={24} color={colors.primary} />
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.salaryLabel, { color: colors.muted }]}>Nettó fizetés</Text>
                            <Text style={[styles.salaryValue, { color: colors.foreground }]}>
                                {salaryMin?.toLocaleString()} - {salaryMax?.toLocaleString()} Ft
                            </Text>
                        </View>
                    </View>

                    {/* Description */}
                    <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Leírás</Text>
                    <Text style={[styles.description, { color: colors.muted }]}>{description}</Text>

                    {/* Benefits */}
                    <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Amit kínálunk</Text>
                    <View style={styles.benefitsList}>
                        {[
                            'Versenyképes fizetés',
                            'Szakmai fejlődési lehetőség',
                            'Profi felszerelés (La Marzocco, Mahlkönig)',
                            'Jó hangulatú csapat',
                            'Személyzeti fogyasztás'
                        ].map((benefit, index) => (
                            <View key={index} style={styles.benefitItem}>
                                <IconSymbol name="checkmark.circle.fill" size={16} color={colors.success} />
                                <Text style={[styles.benefitText, { color: colors.muted }]}>{benefit}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Apply Button */}
                    <PremiumButton
                        style={{ marginTop: 32 }}
                        onPress={() => {
                            triggerHaptic();
                            Linking.openURL('mailto:karrier@kaveri.hu?subject=Jelentkezés: ' + jobTitle);
                        }}
                        leftIcon={<IconSymbol name="envelope.fill" size={18} color="#FFF" />}
                    >
                        Jelentkezem
                    </PremiumButton>
                </Animated.View>
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
    backButton: { padding: 4 },
    headerTitle: { fontSize: 16, fontWeight: '700' },
    titleSection: { marginBottom: 24 },
    jobTitle: { fontSize: 24, fontWeight: '800', marginBottom: 12 },
    typeBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    typeBadgeText: { fontSize: 13, fontWeight: '600' },
    companyCard: { padding: 16, marginBottom: 16 },
    companyIcon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    companyName: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
    companyAddress: { fontSize: 14 },
    salaryCard: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 32 },
    salaryLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginBottom: 4 },
    salaryValue: { fontSize: 18, fontWeight: '700' },
    sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12, marginTop: 12 },
    description: { fontSize: 16, lineHeight: 26, marginBottom: 24 },
    benefitsList: { gap: 12, marginBottom: 24 },
    benefitItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    benefitText: { fontSize: 15 },
});
