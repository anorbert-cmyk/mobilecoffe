import { useState, useEffect } from "react";
import { FlatList, Text, View, Pressable, StyleSheet, Linking, Platform, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import * as Location from "expo-location";
import Animated, { FadeInDown } from "react-native-reanimated";

import { ScreenContainer } from "@/components/screen-container";
import { PremiumCard } from "@/components/ui/premium-card";
import { PremiumButton } from "@/components/ui/premium-button";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { demoCafes, Cafe, sortCafesByDistance, formatDistance } from "@/data/cafes";

interface CafeWithDistance extends Cafe {
  distance: number;
}

export default function FindCoffeeScreen() {
  const colors = useColors();
  const [cafes, setCafes] = useState<CafeWithDistance[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('Enable location to see distances');
          const defaultLat = 47.4979;
          const defaultLon = 19.0402;
          const sortedCafes = sortCafesByDistance(demoCafes, defaultLat, defaultLon);
          setCafes(sortedCafes);
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        
        setUserLocation({
          lat: location.coords.latitude,
          lon: location.coords.longitude,
        });
        
        const sortedCafes = sortCafesByDistance(
          demoCafes,
          location.coords.latitude,
          location.coords.longitude
        );
        setCafes(sortedCafes);
      } catch (error) {
        setLocationError('Could not get location');
        const sortedCafes = sortCafesByDistance(demoCafes, 47.4979, 19.0402);
        setCafes(sortedCafes);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openMaps = (cafe: Cafe) => {
    const url = Platform.select({
      ios: `maps:0,0?q=${encodeURIComponent(cafe.name)}@${cafe.latitude},${cafe.longitude}`,
      android: `geo:0,0?q=${cafe.latitude},${cafe.longitude}(${encodeURIComponent(cafe.name)})`,
      default: `https://www.google.com/maps/search/?api=1&query=${cafe.latitude},${cafe.longitude}`,
    });
    if (url) Linking.openURL(url);
  };

  const openPhone = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const openWebsite = (website: string) => {
    Linking.openURL(website);
  };

  const renderPriceLevel = (level: number) => {
    return '€'.repeat(level);
  };

  const renderCafeCard = ({ item, index }: { item: CafeWithDistance; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 60).springify()}>
      <PremiumCard style={styles.card} elevated>
        {/* Image with overlays */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.cardImage}
            contentFit="cover"
            transition={300}
          />
          
          {/* Rating badge */}
          <View style={[styles.ratingBadge, { backgroundColor: colors.surface }]}>
            <IconSymbol name="star.fill" size={14} color="#FFB800" />
            <Text style={[styles.ratingBadgeText, { color: colors.foreground }]}>
              {item.rating.toFixed(1)}
            </Text>
          </View>
          
          {/* Distance badge */}
          <View style={[styles.distanceBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.distanceBadgeText}>
              {formatDistance(item.distance)}
            </Text>
          </View>
          
          {/* Status badge */}
          <View style={[
            styles.statusBadge,
            { backgroundColor: item.isOpen ? colors.success : colors.error }
          ]}>
            <Text style={styles.statusText}>
              {item.isOpen ? 'Open' : 'Closed'}
            </Text>
          </View>
        </View>
        
        <View style={styles.cardContent}>
          {/* Header */}
          <View style={styles.cardHeader}>
            <Text 
              style={[styles.cafeName, { color: colors.foreground }]} 
              numberOfLines={1}
              accessibilityRole="header"
            >
              {item.name}
            </Text>
            <Text style={[styles.neighborhood, { color: colors.muted }]}>
              {item.neighborhood} · {renderPriceLevel(item.priceLevel)}
            </Text>
          </View>
          
          {/* Address */}
          <View style={styles.addressRow}>
            <IconSymbol name="location.fill" size={14} color={colors.muted} />
            <Text style={[styles.address, { color: colors.muted }]} numberOfLines={1}>
              {item.address}
            </Text>
          </View>
          
          {/* Description */}
          <Text style={[styles.description, { color: colors.foreground }]} numberOfLines={2}>
            {item.description}
          </Text>
          
          {/* Features */}
          <View style={styles.features}>
            {item.features.slice(0, 3).map((feature, idx) => (
              <View 
                key={idx} 
                style={[styles.featureTag, { backgroundColor: colors.surfaceElevated }]}
              >
                <Text style={[styles.featureText, { color: colors.muted }]}>{feature}</Text>
              </View>
            ))}
            {item.features.length > 3 && (
              <View style={[styles.featureTag, { backgroundColor: colors.surfaceElevated }]}>
                <Text style={[styles.featureText, { color: colors.muted }]}>
                  +{item.features.length - 3}
                </Text>
              </View>
            )}
          </View>
          
          {/* Specialties */}
          <View style={styles.specialties}>
            <Text style={[styles.specialtiesLabel, { color: colors.muted }]}>Known for: </Text>
            <Text style={[styles.specialtiesText, { color: colors.foreground }]} numberOfLines={1}>
              {item.specialties.join(' · ')}
            </Text>
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actions}>
            <PremiumButton
              variant="primary"
              size="md"
              onPress={() => openMaps(item)}
              accessibilityLabel={`Navigate to ${item.name}`}
              className="flex-1"
            >
              Navigate
            </PremiumButton>
            
            {item.phone && (
              <Pressable
                onPress={() => openPhone(item.phone!)}
                style={({ pressed }) => [
                  styles.iconButton,
                  { backgroundColor: colors.surfaceElevated },
                  pressed && { opacity: 0.7 }
                ]}
                accessibilityLabel={`Call ${item.name}`}
                accessibilityRole="button"
              >
                <IconSymbol name="phone.fill" size={20} color={colors.foreground} />
              </Pressable>
            )}
            
            {item.website && (
              <Pressable
                onPress={() => openWebsite(item.website!)}
                style={({ pressed }) => [
                  styles.iconButton,
                  { backgroundColor: colors.surfaceElevated },
                  pressed && { opacity: 0.7 }
                ]}
                accessibilityLabel={`Visit ${item.name} website`}
                accessibilityRole="button"
              >
                <IconSymbol name="globe" size={20} color={colors.foreground} />
              </Pressable>
            )}
          </View>
        </View>
      </PremiumCard>
    </Animated.View>
  );

  if (loading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.muted }]}>
          Finding nearby cafes...
        </Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <FlatList
        data={cafes}
        renderItem={renderCafeCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Animated.Text 
              entering={FadeInDown.delay(0).springify()}
              style={[styles.title, { color: colors.foreground }]}
              accessibilityRole="header"
            >
              Find Coffee
            </Animated.Text>
            <Animated.Text 
              entering={FadeInDown.delay(100).springify()}
              style={[styles.subtitle, { color: colors.muted }]}
            >
              {locationError || `${cafes.length} specialty cafes nearby`}
            </Animated.Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 4,
    paddingTop: 8,
    paddingBottom: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 22,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 17,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  card: {
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 4,
  },
  ratingBadgeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  distanceBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  distanceBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    marginBottom: 8,
  },
  cafeName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  neighborhood: {
    fontSize: 14,
    fontWeight: '500',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  address: {
    fontSize: 14,
    flex: 1,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  featureTag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '600',
  },
  specialties: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  specialtiesLabel: {
    fontSize: 13,
  },
  specialtiesText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
});
