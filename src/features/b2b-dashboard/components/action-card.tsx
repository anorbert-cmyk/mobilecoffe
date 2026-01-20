import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';

const CARD_HEIGHT = 180;
const SPACING = 20;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ActionCardProps {
    title: string;
    subtitle: string;
    icon: IconSymbolName;
    color: string;
    index: number;
    onPress: () => void;
}

export function ActionCard({
    title,
    subtitle,
    icon,
    color,
    index,
    onPress
}: ActionCardProps) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Animated.View entering={FadeInDown.delay(300 + index * 100).springify().damping(15)} style={{ marginBottom: 16 }}>
            <AnimatedPressable
                onPress={() => {
                    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onPress();
                }}
                onPressIn={() => { scale.value = withSpring(0.97); }}
                onPressOut={() => { scale.value = withSpring(1); }}
                style={[styles.actionCard, animatedStyle]}
            >
                <LinearGradient
                    colors={[color + '30', color + '10', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.actionCardGradient}
                >
                    <View style={styles.actionCardContent}>
                        <View style={[styles.actionCardIcon, { backgroundColor: color + '40' }]}>
                            <IconSymbol name={icon} size={28} color={color} />
                        </View>
                        <View style={styles.actionCardText}>
                            <Text style={styles.actionCardTitle}>{title}</Text>
                            <Text style={styles.actionCardSubtitle}>{subtitle}</Text>
                        </View>
                        <BlurView intensity={30} style={styles.chevronBadge}>
                            <IconSymbol name="chevron.right" size={18} color="#FFF" />
                        </BlurView>
                    </View>
                </LinearGradient>
            </AnimatedPressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    actionCard: {
        marginHorizontal: SPACING,
        height: CARD_HEIGHT,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: '#1A1A1A',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    actionCardGradient: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    actionCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionCardIcon: {
        width: 56,
        height: 56,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionCardText: {
        flex: 1,
        marginLeft: 16,
    },
    actionCardTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
    },
    actionCardSubtitle: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
    },
    chevronBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
});
