import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useColors } from '@/hooks/use-colors';
import { Icon } from '@/components/ui/app-icons';
import { LinearGradient } from 'expo-linear-gradient';

export interface CafeCardProps {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    rating?: number;
    distance?: string;
    amenities: ('wifi' | 'power' | 'coffee' | 'pet' | 'food')[];
    priceLevel: 1 | 2 | 3;
    onPress: () => void;
    index?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CafeCardV2({
    name,
    description,
    imageUrl,
    rating = 4.5,
    distance = "1.2 km",
    amenities = [],
    priceLevel = 2,
    onPress,
    index = 0
}: CafeCardProps) {
    const colors = useColors();
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    const onPressIn = () => {
        scale.value = withSpring(0.97, { damping: 10 });
    };

    const onPressOut = () => {
        scale.value = withSpring(1, { damping: 10 });
    };

    return (
        <AnimatedPressable
            entering={FadeIn.delay(index * 100).springify()}
            onPress={onPress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            style={[styles.container, animatedStyle]}
        >
            {/* Image & Gradient Overlay */}
            <View style={styles.imageContainer}>
                <Image source={{ uri: imageUrl || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93' }} style={styles.image} />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.gradient}
                />

                {/* Distance Badge */}
                <BlurView intensity={30} tint="dark" style={styles.distanceBadge}>
                    <Icon name="Location" size={12} color="#FFF" />
                    <Text style={styles.distanceText}>{distance}</Text>
                </BlurView>
            </View>

            {/* Content Block */}
            <View style={[styles.content, { backgroundColor: colors.surface }]}>
                <View style={styles.headerRow}>
                    <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>{name}</Text>
                    <View style={styles.ratingRow}>
                        <Icon name="Star" size={14} color="#F59E0B" style={{ marginRight: 4 }} />
                        <Text style={[styles.rating, { color: colors.foreground }]}>{rating.toFixed(1)}</Text>
                    </View>
                </View>

                <Text style={[styles.description, { color: colors.muted }]} numberOfLines={1}>
                    {description}
                </Text>

                <View style={styles.footerRow}>
                    <View style={styles.amenitiesRow}>
                        {amenities.slice(0, 3).map((a, i) => (
                            <View key={i} style={[styles.pill, { backgroundColor: colors.surface }]}>
                                <Icon name={getAmenityIcon(a)} size={12} color={colors.foreground} />
                                <Text style={[styles.pillText, { color: colors.foreground }]}>{capitalize(a)}</Text>
                            </View>
                        ))}
                        {amenities.length > 3 && (
                            <View style={[styles.pill, { backgroundColor: colors.surface }]}>
                                <Text style={[styles.pillText, { color: colors.foreground }]}>+{amenities.length - 3}</Text>
                            </View>
                        )}
                    </View>
                    <Text style={[styles.price, { color: colors.muted }]}>{'$'.repeat(priceLevel)}</Text>
                </View>
            </View>
        </AnimatedPressable>
    );
}

// Helpers
function getAmenityIcon(type: string): any {
    switch (type) {
        case 'wifi': return 'Wifi';
        case 'power': return 'Power';
        case 'coffee': return 'Coffee';
        case 'pet': return 'Info'; // Need explicit mapping in AppIcons
        default: return 'Check';
    }
}

function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 20,
        backgroundColor: 'transparent',
    },
    imageContainer: {
        height: 200,
        width: '100%',
        backgroundColor: '#e5e5e5',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
    },
    distanceBadge: {
        position: 'absolute',
        top: 16,
        right: 16,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        overflow: 'hidden',
        gap: 4,
    },
    distanceText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    },
    content: {
        padding: 16,
        paddingTop: 12,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        marginTop: -20, // Overlap slightly or just sit flush? Let's sit flush but style background
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    name: {
        fontSize: 18,
        fontWeight: '700',
        flex: 1,
        marginRight: 10,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderRadius: 8,
    },
    rating: {
        fontSize: 14,
        fontWeight: '700',
    },
    description: {
        fontSize: 14,
        marginBottom: 12,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    amenitiesRow: {
        flexDirection: 'row',
        gap: 8,
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    pillText: {
        fontSize: 11,
        fontWeight: '600',
    },
    price: {
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 1,
    }
});
