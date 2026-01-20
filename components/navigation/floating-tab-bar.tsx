import React, { useEffect } from 'react';
import { View, StyleSheet, Pressable, Platform, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
    useAnimatedStyle,
    withSpring,
    withTiming,
    useSharedValue,
} from 'react-native-reanimated';
import { useColors } from '@/hooks/use-colors';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const { width } = Dimensions.get('window');


export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const colors = useColors();

    return (
        <View style={styles.container}>
            <BlurView
                intensity={80}
                tint={colors.background === '#000000' ? 'dark' : 'light'}
                style={[
                    styles.blurContainer,
                    {
                        borderColor: colors.border,
                        backgroundColor: colors.background === '#000000' ? 'rgba(20,20,20,0.6)' : 'rgba(255,255,255,0.6)'
                    }
                ]}
            >
                <View style={styles.tabsRow}>
                    {state.routes.map((route, index) => {
                        const { options } = descriptors[route.key];
                        const isFocused = state.index === index;

                        const onPress = () => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name);
                            }
                        };

                        // Map route names to icons using SF Symbols
                        let iconName: IconSymbolName = 'house.fill';
                        if (route.name === 'index') iconName = 'house.fill';
                        // Jobs removed
                        if (route.name === 'products') iconName = 'cup.and.saucer.fill'; // Menu

                        return (
                            <TabItem
                                key={route.key}
                                isFocused={isFocused}
                                onPress={onPress}
                                iconName={iconName}
                                label={options.title || route.name}
                                activeColor={colors.primary}
                                inactiveColor={colors.muted}
                            />
                        );
                    })}
                </View>
            </BlurView>
        </View>
    );
}

function TabItem({
    isFocused,
    onPress,
    iconName,
    label,
    activeColor,
    inactiveColor
}: any) {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0.6);

    useEffect(() => {
        scale.value = withSpring(isFocused ? 1.1 : 1, { damping: 15 });
        opacity.value = withTiming(isFocused ? 1 : 0.6, { duration: 200 });
    }, [isFocused]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value
    }));

    return (
        <Pressable onPress={onPress} style={styles.tabItem}>
            <Animated.View style={[styles.iconWrapper, animatedStyle]}>
                <IconSymbol
                    name={iconName}
                    size={24}
                    color={isFocused ? activeColor : inactiveColor}
                    weight={isFocused ? 'semibold' : 'regular'}
                />
                {isFocused && (
                    <Animated.View
                        entering={undefined}
                        style={[styles.indicator, { backgroundColor: activeColor }]}
                    />
                )}
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 34 : 20,
        left: 20,
        right: 20,
        alignItems: 'center',
    },
    blurContainer: {
        flexDirection: 'row',
        width: '100%',
        height: 70,
        borderRadius: 35,
        overflow: 'hidden',
        borderWidth: 1,
        borderCurve: 'continuous', // iOS style
        paddingHorizontal: 10,
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
    },
    tabsRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    iconWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    indicator: {
        width: 4,
        height: 4,
        borderRadius: 2,
        marginTop: 4,
        position: 'absolute',
        bottom: -8,
    }
});
