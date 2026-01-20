import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, interpolate, SharedValue } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { useGreeting } from '../hooks/use-greeting';

interface DashboardHeroProps {
    scrollY: SharedValue<number>;
    businessName?: string | null;
    isPremium: boolean;
    onUpgrade: () => void;
    backgroundColor: string;
}

export function DashboardHero({
    scrollY,
    businessName,
    isPremium,
    onUpgrade,
    backgroundColor
}: DashboardHeroProps) {
    const greeting = useGreeting();

    const heroImageStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: interpolate(
                        scrollY.value,
                        [-200, 0, 200],
                        [-60, 0, 60]
                    ),
                },
                {
                    scale: interpolate(
                        scrollY.value,
                        [-200, 0],
                        [1.4, 1],
                        'clamp'
                    )
                }
            ],
        };
    });

    return (
        <View style={styles.heroContainer}>
            <Animated.Image
                source={require('@/assets/images/learn_hero.png')}
                style={[styles.heroImage, heroImageStyle]}
            />
            <LinearGradient
                colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.5)', backgroundColor]}
                style={styles.heroGradient}
                locations={[0, 0.5, 1]}
            />
            <View style={styles.heroContent}>
                <Animated.Text entering={FadeInDown.delay(100).springify()} style={styles.heroEyebrow}>
                    {greeting.toUpperCase()}
                </Animated.Text>
                <Animated.Text entering={FadeInDown.delay(200).springify()} style={styles.heroTitle}>
                    {businessName || 'Your Business'}
                </Animated.Text>
                {!isPremium && (
                    <Animated.View entering={FadeInDown.delay(300).springify()}>
                        <Pressable
                            onPress={onUpgrade}
                            style={styles.upgradeBtn}
                        >
                            <IconSymbol name="star.fill" size={16} color="#FFF" />
                            <Text style={styles.upgradeText}>Upgrade to Premium</Text>
                        </Pressable>
                    </Animated.View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    heroContainer: {
        height: 320,
        width: '100%',
        overflow: 'hidden',
        marginBottom: -30,
        justifyContent: 'flex-end',
    },
    heroImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    heroGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    heroContent: {
        padding: 24,
        paddingBottom: 60,
    },
    heroEyebrow: {
        color: '#D97706',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 2,
        marginBottom: 8,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    heroTitle: {
        color: '#FFF',
        fontSize: 36,
        fontWeight: '800',
        lineHeight: 42,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
        marginBottom: 16,
    },
    upgradeBtn: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#D97706',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
    },
    upgradeText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 14,
    },
});
