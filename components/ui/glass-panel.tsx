import React from 'react';
import { StyleSheet, View, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useColors } from '@/hooks/use-colors';

interface GlassPanelProps {
    children: React.ReactNode;
    style?: ViewStyle | ViewStyle[];
    intensity?: number;
    tint?: 'light' | 'dark' | 'default';
    contentContainerStyle?: ViewStyle;
}

export function GlassPanel({
    children,
    style,
    intensity = 50,
    tint,
    contentContainerStyle
}: GlassPanelProps) {
    const colors = useColors();

    // Auto-detect tint based on current theme if not provided
    const resolvedTint = tint ?? (colors.foreground === '#ffffff' ? 'dark' : 'light');

    if (Platform.OS === 'android') {
        // Android fallback (BlurView support varies) - use translucent background
        return (
            <View style={[
                styles.androidContainer,
                {
                    backgroundColor: resolvedTint === 'dark' ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                    borderColor: colors.border
                },
                style
            ]}>
                <View style={[styles.content, contentContainerStyle]}>
                    {children}
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { borderColor: colors.border }, style]}>
            <BlurView intensity={intensity} tint={resolvedTint} style={StyleSheet.absoluteFill} />
            <View style={[styles.content, contentContainerStyle]}>
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        borderRadius: 24,
        borderWidth: 1,
        borderCurve: 'continuous', // Smooth iOS corners
    },
    androidContainer: {
        overflow: 'hidden',
        borderRadius: 24,
        borderWidth: 1,
    },
    content: {
        // Ensure content sits above blur
        zIndex: 1,
    }
});
