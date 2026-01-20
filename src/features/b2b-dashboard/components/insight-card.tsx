import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

import { IconSymbol } from '@/components/ui/icon-symbol';

interface InsightCardProps {
    colors: {
        background: string;
        foreground: string;
        primary: string;
        muted: string;
        surface: string;
    };
}

export function InsightCard({ colors }: InsightCardProps) {
    return (
        <Animated.View entering={FadeInDown.delay(700).springify()}>
            <BlurView
                intensity={Platform.OS === 'ios' ? 20 : 0}
                style={[
                    styles.tipCard,
                    { backgroundColor: Platform.OS === 'android' ? colors.surface : undefined }
                ]}
            >
                <View style={styles.tipHeader}>
                    <IconSymbol name="info.circle.fill" size={18} color={colors.primary} />
                    <Text style={[styles.tipTitle, { color: colors.foreground }]}>Business Tip</Text>
                </View>
                <Text style={[styles.tipText, { color: colors.muted }]}>
                    Complete your cafe profile to attract more customers and rank higher in search.
                </Text>
            </BlurView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    tipCard: {
        marginHorizontal: 20,
        marginTop: 8,
        padding: 18,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    tipHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    tipTitle: {
        fontSize: 15,
        fontWeight: '700',
    },
    tipText: {
        fontSize: 14,
        lineHeight: 20,
    },
});
