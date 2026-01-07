import { useState, useEffect } from "react";
import { FlatList, Text, View, Pressable, StyleSheet, Linking, Platform, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import * as Location from "expo-location";

import { ScreenContainer } from "@/components/screen-container";
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
          // Use default Budapest center location
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
        // Fallback to default location
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

  const renderCafeCard = ({ item }: { item: CafeWithDistance }) => (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Image
        source={{ uri: item.image }}
        style={styles.cardImage}
        contentFit="cover"
        transition={200}
      />
      
      <View style={styles.cardContent}>
        {/* Header Row */}
        <View style={styles.cardHeader}>
          <View style={styles.titleRow}>
            <Text style={[styles.cafeName, { color: colors.foreground }]} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={[
              styles.statusBadge,
              { backgroundColor: item.isOpen ? colors.success : colors.error }
            ]}>
              <Text style={styles.statusText}>
                {item.isOpen ? 'Open' : 'Closed'}
              </Text>
            </View>
          </View>
          <Text style={[styles.neighborhood, { color: colors.muted }]}>
            {item.neighborhood} · {renderPriceLevel(item.priceLevel)}
          </Text>
        </View>
        
        {/* Rating & Distance Row */}
        <View style={styles.infoRow}>
          <View style={styles.ratingContainer}>
            <IconSymbol name="star.fill" size={16} color="#F59E0B" />
            <Text style={[styles.ratingText, { color: colors.foreground }]}>
              {item.rating.toFixed(1)}
            </Text>
            <Text style={[styles.reviewCount, { color: colors.muted }]}>
              ({item.reviewCount.toLocaleString()})
            </Text>
          </View>
          <Text style={[styles.distance, { color: colors.primary }]}>
            {formatDistance(item.distance)}
          </Text>
        </View>
        
        {/* Address */}
        <Text style={[styles.address, { color: colors.muted }]} numberOfLines={1}>
          {item.address}
        </Text>
        
        {/* Description */}
        <Text style={[styles.description, { color: colors.foreground }]} numberOfLines={2}>
          {item.description}
        </Text>
        
        {/* Features */}
        <View style={styles.features}>
          {item.features.slice(0, 4).map((feature, index) => (
            <View key={index} style={[styles.featureTag, { backgroundColor: colors.background }]}>
              <Text style={[styles.featureText, { color: colors.muted }]}>{feature}</Text>
            </View>
          ))}
          {item.features.length > 4 && (
            <View style={[styles.featureTag, { backgroundColor: colors.background }]}>
              <Text style={[styles.featureText, { color: colors.muted }]}>+{item.features.length - 4}</Text>
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
          <Pressable
            onPress={() => openMaps(item)}
            style={({ pressed }) => [
              styles.primaryButton,
              { backgroundColor: colors.primary },
              pressed && { opacity: 0.9 }
            ]}
          >
            <IconSymbol name="map.fill" size={18} color="#fff" />
            <Text style={styles.primaryButtonText}>Navigate</Text>
          </Pressable>
          
          {item.phone && (
            <Pressable
              onPress={() => openPhone(item.phone!)}
              style={({ pressed }) => [
                styles.secondaryButton,
                { borderColor: colors.border },
                pressed && { opacity: 0.7 }
              ]}
            >
              <IconSymbol name="phone.fill" size={18} color={colors.foreground} />
            </Pressable>
          )}
          
          {item.website && (
            <Pressable
              onPress={() => openWebsite(item.website!)}
              style={({ pressed }) => [
                styles.secondaryButton,
                { borderColor: colors.border },
                pressed && { opacity: 0.7 }
              ]}
            >
              <IconSymbol name="globe" size={18} color={colors.foreground} />
            </Pressable>
          )}
        </View>
      </View>
    </View>
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
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>Find Coffee</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          {locationError || `${cafes.length} specialty cafes nearby`}
        </Text>
      </View>
      
      <FlatList
        data={cafes}
        renderItem={renderCafeCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cafeName: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  neighborhood: {
    fontSize: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 15,
    fontWeight: '600',
  },
  reviewCount: {
    fontSize: 14,
  },
  distance: {
    fontSize: 15,
    fontWeight: '600',
  },
  address: {
    fontSize: 14,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
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
    paddingVertical: 5,
    borderRadius: 8,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '500',
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
    fontWeight: '500',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderWidth: 1,
  },
});
