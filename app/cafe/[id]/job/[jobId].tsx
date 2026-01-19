import { View, Text, ScrollView, StyleSheet, Pressable, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import { ScreenContainer } from '@/components/screen-container';
import { PremiumCard } from '@/components/ui/premium-card';
import { PremiumButton } from '@/components/ui/premium-button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { demoCafes } from '@/data/cafes';

export default function JobDetailScreen() {
    const { jobId, id } = useLocalSearchParams();
    const cafeId = id;
    const colors = useColors();
    const router = useRouter();

    // Find cafe and job
    const cafe = demoCafes.find(c => c.id === cafeId);
    const job = cafe?.jobs.find(j => j.id === jobId);

    const triggerHaptic = () => {
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    if (!job || !cafe) {
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

    const jobTypeBadgeColor = job.type === 'full-time' ? '#10B981' : job.type === 'part-time' ? '#3B82F6' : '#F59E0B';
    const jobTypeLabel = job.type === 'full-time' ? 'Teljes munkaidő' : job.type === 'part-time' ? 'Részmunkaidő' : 'Szerződéses';

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
                        <Text style={[styles.jobTitle, { color: colors.foreground }]}>{job.title}</Text>
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
                                <Text style={[styles.companyName, { color: colors.foreground }]}>{cafe.name}</Text>
                                <Text style={[styles.companyAddress, { color: colors.muted }]}>{cafe.address}</Text>
                            </View>
                        </View>
                    </PremiumCard>

                    {/* Salary Section */}
                    <View style={[styles.salaryCard, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
                        <IconSymbol name="banknote.fill" size={24} color={colors.primary} />
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.salaryLabel, { color: colors.muted }]}>Nettó fizetés</Text>
                            <Text style={[styles.salaryValue, { color: colors.foreground }]}>
                                {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()} Ft
                            </Text>
                        </View>
                    </View>

                    {/* Description */}
                    <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Leírás</Text>
                    <Text style={[styles.description, { color: colors.muted }]}>{job.description}</Text>

                    {/* Benefits */}
                    <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Amit kínálunk</Text>
                    <View style={styles.benefitsList}>
                        {[
                            'Versenyképes fizetés',
                            'Ingyenes specialty kávé',
                            'Rugalmas munkaidő',
                            'Barátságos csapat',
                            'Szakmai fejlődés',
                        ].map((benefit, idx) => (
                            <View key={idx} style={styles.benefitItem}>
                                <IconSymbol name="checkmark.circle.fill" size={18} color={colors.primary} />
                                <Text style={[styles.benefitText, { color: colors.foreground }]}>{benefit}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Apply Button */}
                    <PremiumButton
                        onPress={() => {
                            triggerHaptic();
                            Linking.openURL(`mailto:karrier@${cafe.name.toLowerCase().replace(/\s/g, '')}.hu?subject=Jelentkezés: ${job.title}`);
                        }}
                        style={styles.applyButton}
                    >
                        Jelentkezem
                    </PremiumButton>

                    <Text style={[styles.disclaimer, { color: colors.muted }]}>
                        A jelentkezéseddel hozzájárulsz, hogy adataidat a munkáltató feldolgozza.
                    </Text>
                </Animated.View>
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 16,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
    },
    titleSection: {
        marginBottom: 20,
    },
    jobTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    typeBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    typeBadgeText: {
        fontSize: 13,
        fontWeight: '600',
    },
    companyCard: {
        padding: 16,
        marginBottom: 16,
    },
    companyIcon: {
        width: 50,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    companyName: {
        fontSize: 17,
        fontWeight: '600',
    },
    companyAddress: {
        fontSize: 13,
        marginTop: 2,
    },
    salaryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 28,
    },
    salaryLabel: {
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    salaryValue: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        lineHeight: 24,
        marginBottom: 28,
    },
    benefitsList: {
        gap: 12,
        marginBottom: 32,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    benefitText: {
        fontSize: 15,
    },
    applyButton: {
        marginBottom: 16,
    },
    disclaimer: {
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
    },
});
