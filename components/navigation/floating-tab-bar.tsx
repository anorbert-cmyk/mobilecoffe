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
                    {state.routes
                        .filter((route) => {
                            // Strict whitelist for visible tabs
                            const VISIBLE_ROUTES = ['index', 'products', 'jobs/index'];
                            return VISIBLE_ROUTES.includes(route.name);
                        })
                        .map((route, index) => {
                            const { options } = descriptors[route.key];
                            const actualIndex = state.routes.findIndex(r => r.key === route.key);
                            const isFocused = state.index === actualIndex;

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

                            // Strict Icon Mapping
                            let iconName: IconSymbolName = 'house.fill';
                            let label = options.title || route.name;

                            if (route.name === 'index') {
                                iconName = 'chart.pie.fill'; // More business-like than house
                                label = 'Overview';
                            }
                            if (route.name === 'products') {
                                iconName = 'cup.and.saucer.fill';
                                label = 'Menu';
                            }
                            if (route.name === 'jobs/index') {
                                iconName = 'person.2.crop.square.stack.fill'; // or briefcase if available, fallback to staff icon
                                label = 'Jobs';
                            }

                            // If 'jobs/index' is active, highlight if any job sub-route is active? 
                            // Expo Router handles basic focus, but for nested stacks we might need logic.
                            // For now rely on state.index.

                            return (
                                <TabItem
                                    key={route.key}
                                    isFocused={isFocused}
                                    onPress={onPress}
                                    iconName={iconName}
                                    label={label}
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
    const opacity = useSharedValue(0.6);

    useEffect(() => {
        // Only opacity change, NO SCALE to prevent bouncing
        opacity.value = withTiming(isFocused ? 1 : 0.6, { duration: 200 });
    }, [isFocused]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value
    }));

    return (
        <Pressable onPress={onPress} style={styles.tabItem}>
            <Animated.View style={[styles.iconWrapper, animatedStyle]}>
                <IconSymbol
                    name={iconName}
                    size={24}
                    color={isFocused ? activeColor : inactiveColor}
                    weight={isFocused ? 'bold' : 'regular'}
                />
                {/* Text Label for clarity if needed, but user asked for "perfect icons" */}
                {/* <Text style={{ fontSize: 10, color: isFocused ? activeColor : inactiveColor }}>{label}</Text> */}

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
