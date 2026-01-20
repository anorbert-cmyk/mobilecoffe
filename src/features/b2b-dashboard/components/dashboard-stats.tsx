import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { DashboardStat } from '../types';

interface DashboardStatsProps {
    stats: DashboardStat[];
    colors: {
        background: string;
        foreground: string;
        primary: string;
        muted: string;
        surface: string;
    };
}

export function DashboardStats({ stats, colors }: DashboardStatsProps) {
    return (
        <View style={styles.statsRow}>
            {stats.map((stat, i) => (
                <BlurView
                    key={i}
                    intensity={Platform.OS === 'ios' ? 25 : 0}
                    style={[
                        styles.statItem,
                        { backgroundColor: Platform.OS === 'android' ? colors.surface : undefined }
                    ]}
                >
                    <IconSymbol name={stat.icon} size={20} color={colors.primary} />
                    <View>
                        <Text style={[styles.statValue, { color: colors.foreground }]}>{stat.value}</Text>
                        <Text style={[styles.statLabel, { color: colors.muted }]}>{stat.label}</Text>
                    </View>
                </BlurView>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    statsRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 28,
    },
    statItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
    },
    statLabel: {
        fontSize: 11,
    },
});
