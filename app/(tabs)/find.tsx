import { useState, useEffect } from "react";
import { FlatList, Text, View, Pressable, StyleSheet, Linking, Platform, ActivityIndicator, TextInput, ScrollView } from "react-native";
import { Image } from "expo-image";
import * as Location from "expo-location";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { PremiumCard } from "@/components/ui/premium-card";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { demoCafes, Cafe, sortCafesByDistance, formatDistance } from "@/data/cafes";
import { coffeeBeans } from "@/data/beans";
import { useRouter } from "expo-router";
import { useMyEquipment } from "@/lib/equipment/my-equipment-provider";
import { trpc } from "@/lib/trpc";
import { perplexityService } from "@/lib/perplexity/perplexity-service";

interface CafeWithDistance extends Cafe {
  distance: number;
  beansAvailable?: string[]; // Bean IDs available at this cafe
}

type BeanFilter = {
  origin?: string;
  roastLevel?: string;
  flavorNote?: string;
};

export default function FindCoffeeScreen() {
  const colors = useColors();
  const router = useRouter();
  const { equipment } = useMyEquipment();

  const [cafes, setCafes] = useState<CafeWithDistance[]>([]);
  const [filteredCafes, setFilteredCafes] = useState<CafeWithDistance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchingReal, setSearchingReal] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [beanFilter, setBeanFilter] = useState<BeanFilter>({});
  const [showMyBeansOnly, setShowMyBeansOnly] = useState(false);

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Get user's favorite beans from equipment
  const userFavoriteBeans = equipment.flatMap(e => e.favoriteBeans);
  const uniqueFavoriteBeans = [...new Set(userFavoriteBeans)];

  // Get unique origins, roast levels, flavor notes for filters
  const origins = [...new Set(coffeeBeans.map(b => b.origin))].sort();
  const roastLevels = [...new Set(coffeeBeans.map(b => b.roastLevel))].sort();
  const allFlavorNotes = coffeeBeans.flatMap(b => b.flavorNotes);
  const flavorNotes = [...new Set(allFlavorNotes)].sort();

  useEffect(() => {
    applyFilters();
  }, [cafes, searchQuery, beanFilter, showMyBeansOnly]);

  const { data: remoteCafes, isLoading } = trpc.business.getAll.useQuery(undefined, {
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (remoteCafes) {
      mergeRemoteCafes(remoteCafes);
    } else if (!isLoading && !remoteCafes) {
      // Fallback to demo data if request failed or empty
      const sortedCafes = sortCafesByDistance(demoCafes, 47.4979, 19.0402);
      setCafes(sortedCafes as CafeWithDistance[]);
      setLoading(false);
    }
  }, [remoteCafes, isLoading]);

  const mergeRemoteCafes = async (backendCafes: any[]) => {
    // Transform backend cafes to Cafe type
    const mappedRemote: CafeWithDistance[] = backendCafes.map((b) => ({
      id: String(b.id),
      name: b.name,
      // Use seeded image or fallback
      image: b.headerImageUrls?.[0] || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=3547&auto=format&fit=crop",
      rating: 4.8, // Mock rating for now
      reviewCount: 120, // Mock reviews
      distance: 0, // Calculated later
      address: b.address?.street ? `${b.address.street}, ${b.address.city}` : b.address?.city || "Budapest",
      specialties: b.products?.filter((p: any) => p.type === 'coffee').map((p: any) => p.name) || ["Specialty Coffee"],
      priceLevel: 3,
      latitude: 47.4979, // Hardcoded for now, ideally in address
      longitude: 19.0402,
      description: b.description || "",
      openingHours: { monday: "9:00 - 17:00", tuesday: "9:00 - 17:00", wednesday: "9:00 - 17:00", thursday: "9:00 - 17:00", friday: "9:00 - 17:00", saturday: "10:00 - 16:00", sunday: "Closed" },
      phone: b.phone || undefined,
      website: b.website || undefined,
      isPromoted: b.subscriptions?.some((s: any) => s.plan === 'premium'),
      neighborhood: b.address?.city || "Budapest",
      isOpen: true,
      amenities: { wifi: true, dogFriendly: false, cardPayment: true, terrace: false, brunch: false, laptopFriendly: true, wheelchairAccessible: false, parking: false, reservations: false, takeaway: true, delivery: false, oatMilk: true, specialty: true },
      menu: [],
      events: [],
      jobs: [],
    }));

    // Merge with demo cafes
    const combined = [...mappedRemote, ...demoCafes];

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({ lat: location.coords.latitude, lon: location.coords.longitude });
        const sorted = sortCafesByDistance(combined, location.coords.latitude, location.coords.longitude);
        setCafes(sorted as CafeWithDistance[]);
      } else {
        const sorted = sortCafesByDistance(combined, 47.4979, 19.0402);
        setCafes(sorted as CafeWithDistance[]);
      }
    } catch (e) {
      console.warn("Location error", e);
      const sorted = sortCafesByDistance(combined, 47.4979, 19.0402);
      setCafes(sorted as CafeWithDistance[]);
    } finally {
      setLoading(false);
    }
  };

  // Keep searchRealCafes separate for Perplexity


  const searchRealCafes = async () => {
    if (!userLocation) {
      alert('Location not available');
      return;
    }

    triggerHaptic();
    setSearchingReal(true);

    try {
      // Build search query based on filters
      let query = 'specialty coffee shops near me';
      if (beanFilter.origin) query += ` with ${beanFilter.origin} coffee`;
      if (beanFilter.roastLevel) query += ` ${beanFilter.roastLevel} roast`;
      if (beanFilter.flavorNote) query += ` ${beanFilter.flavorNote} flavor`;

      const results = await perplexityService.searchCafes(
        userLocation.lat,
        userLocation.lon,
        query
      );

      if (results && results.length > 0) {
        // Merge with existing cafes (avoid duplicates)
        const existingNames = new Set(cafes.map(c => c.name.toLowerCase()));
        const newCafes = results.filter((r: any) => !existingNames.has(r.name.toLowerCase()));

        const allCafes = [...cafes, ...newCafes];
        const sorted = sortCafesByDistance(allCafes, userLocation.lat, userLocation.lon);
        setCafes(sorted as CafeWithDistance[]);
      }
    } catch (error) {
      console.error('Failed to search real cafes:', error);
      alert('Failed to search cafes. Using demo data.');
    } finally {
      setSearchingReal(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...cafes];

    // Text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(cafe =>
        cafe.name.toLowerCase().includes(query) ||
        cafe.specialties.some(s => s.toLowerCase().includes(query))
      );
    }

    // Bean filters
    if (Object.keys(beanFilter).length > 0) {
      filtered = filtered.filter(cafe => {
        // Check if cafe has beans matching the filter
        const matchingBeans = coffeeBeans.filter(bean => {
          if (beanFilter.origin && bean.origin !== beanFilter.origin) return false;
          if (beanFilter.roastLevel && bean.roastLevel !== beanFilter.roastLevel) return false;
          if (beanFilter.flavorNote && !bean.flavorNotes.includes(beanFilter.flavorNote)) return false;
          return true;
        });

        // For demo, assume cafes carry beans based on their specialty
        return matchingBeans.length > 0;
      });
    }

    // Show only cafes with user's favorite beans
    if (showMyBeansOnly && uniqueFavoriteBeans.length > 0) {
      filtered = filtered.filter(cafe => {
        // For demo, match cafe specialty with bean characteristics
        const favBeans = coffeeBeans.filter(b => uniqueFavoriteBeans.includes(b.id));
        return favBeans.some(bean =>
          cafe.specialties.some(s =>
            s.toLowerCase().includes(bean.origin.toLowerCase()) ||
            s.toLowerCase().includes(bean.roastLevel.toLowerCase())
          )
        );
      });
    }

    setFilteredCafes(filtered);
  };

  const clearFilters = () => {
    triggerHaptic();
    setBeanFilter({});
    setShowMyBeansOnly(false);
    setSearchQuery("");
  };

  const toggleMyBeans = () => {
    triggerHaptic();
    setShowMyBeansOnly(!showMyBeansOnly);
  };

  const openMaps = (cafe: Cafe) => {
    triggerHaptic();
    const url = Platform.select({
      ios: `maps:0,0?q=${encodeURIComponent(cafe.name)}@${cafe.latitude},${cafe.longitude}`,
      android: `geo:0,0?q=${cafe.latitude},${cafe.longitude}(${encodeURIComponent(cafe.name)})`,
      default: `https://www.google.com/maps/search/?api=1&query=${cafe.latitude},${cafe.longitude}`,
    });
    if (url) Linking.openURL(url);
  };

  const openPhone = (phone: string) => {
    triggerHaptic();
    Linking.openURL(`tel:${phone}`);
  };

  const openWebsite = (website: string) => {
    triggerHaptic();
    Linking.openURL(website);
  };

  const renderPriceLevel = (level: number) => {
    return '€'.repeat(level);
  };

  const renderCafeCard = ({ item, index }: { item: CafeWithDistance; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 60).springify()}>
      <Pressable
        onPress={() => {
          triggerHaptic();
          router.push({ pathname: '/cafe/[id]', params: { id: item.id } });
        }}
        accessibilityRole="button"
        accessibilityLabel={`View details for ${item.name}`}
      >
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
            {userLocation && (
              <View style={[styles.distanceBadge, { backgroundColor: colors.primary }]}>
                <IconSymbol name="location.fill" size={12} color="#FFF" />
                <Text style={styles.distanceBadgeText}>
                  {formatDistance(item.distance)}
                </Text>
              </View>
            )}
          </View>

          {/* Content */}
          <View style={styles.cardContent}>
            <Text style={[styles.cafeName, { color: colors.foreground }]}>
              {item.name}
            </Text>

            <View style={styles.cafeMetaRow}>
              <Text style={[styles.cafeSpecialty, { color: colors.primary }]}>
                {item.specialties[0] || 'Specialty Coffee'}
              </Text>
              <Text style={[styles.priceLevel, { color: colors.muted }]}>
                {renderPriceLevel(item.priceLevel)}
              </Text>
            </View>

            <Text style={[styles.cafeAddress, { color: colors.muted }]} numberOfLines={1}>
              {item.address}
            </Text>

            {/* Action buttons */}
            <View style={styles.actions}>
              <Pressable
                onPress={(e) => { e.stopPropagation(); openMaps(item); }}
                style={({ pressed }) => [
                  styles.actionButton,
                  { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 }
                ]}
              >
                <IconSymbol name="map.fill" size={18} color="#FFF" />
                <Text style={styles.actionButtonText}>Directions</Text>
              </Pressable>

              {item.phone && (
                <Pressable
                  onPress={(e) => { e.stopPropagation(); openPhone(item.phone!); }}
                  style={({ pressed }) => [
                    styles.actionButtonSecondary,
                    { borderColor: colors.border, opacity: pressed ? 0.7 : 1 }
                  ]}
                >
                  <IconSymbol name="phone.fill" size={18} color={colors.foreground} />
                </Pressable>
              )}

              {item.website && (
                <Pressable
                  onPress={(e) => { e.stopPropagation(); openWebsite(item.website!); }}
                  style={({ pressed }) => [
                    styles.actionButtonSecondary,
                    { borderColor: colors.border, opacity: pressed ? 0.7 : 1 }
                  ]}
                >
                  <IconSymbol name="globe" size={18} color={colors.foreground} />
                </Pressable>
              )}
            </View>
          </View>
        </PremiumCard>
      </Pressable>
    </Animated.View>
  );

  if (loading) {
    return (
      <ScreenContainer>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.muted }]}>
            Finding coffee shops near you...
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  const hasActiveFilters = Object.keys(beanFilter).length > 0 || showMyBeansOnly || searchQuery.trim();

  return (
    <ScreenContainer>
      <View style={styles.container}>
        {/* Header with search */}
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <IconSymbol name="magnifyingglass" size={20} color={colors.muted} />
            <TextInput
              style={[styles.searchInput, { color: colors.foreground }]}
              placeholder="Search cafes..."
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery("")}>
                <IconSymbol name="xmark" size={18} color={colors.muted} />
              </Pressable>
            )}
          </View>

          {/* Filter toggles */}
          <View style={styles.filterRow}>
            <Pressable
              onPress={() => { triggerHaptic(); setShowFilters(!showFilters); }}
              style={({ pressed }) => [
                styles.filterButton,
                {
                  backgroundColor: showFilters || hasActiveFilters ? colors.primary : colors.surface,
                  borderColor: colors.border,
                  opacity: pressed ? 0.8 : 1,
                }
              ]}
            >
              <IconSymbol
                name="slider.horizontal.3"
                size={18}
                color={showFilters || hasActiveFilters ? "#FFF" : colors.foreground}
              />
              <Text style={[
                styles.filterButtonText,
                { color: showFilters || hasActiveFilters ? "#FFF" : colors.foreground }
              ]}>
                Filters
              </Text>
              {hasActiveFilters && !showFilters && (
                <View style={[styles.filterBadge, { backgroundColor: "#FFF" }]}>
                  <Text style={[styles.filterBadgeText, { color: colors.primary }]}>
                    {Object.keys(beanFilter).length + (showMyBeansOnly ? 1 : 0)}
                  </Text>
                </View>
              )}
            </Pressable>

            {uniqueFavoriteBeans.length > 0 && (
              <Pressable
                onPress={toggleMyBeans}
                style={({ pressed }) => [
                  styles.myBeansButton,
                  {
                    backgroundColor: showMyBeansOnly ? colors.error : colors.surface,
                    borderColor: colors.border,
                    opacity: pressed ? 0.8 : 1,
                  }
                ]}
              >
                <IconSymbol
                  name="heart.fill"
                  size={18}
                  color={showMyBeansOnly ? "#FFF" : colors.error}
                />
                <Text style={[
                  styles.myBeansButtonText,
                  { color: showMyBeansOnly ? "#FFF" : colors.foreground }
                ]}>
                  My Beans
                </Text>
              </Pressable>
            )}

            <Pressable
              onPress={searchRealCafes}
              disabled={searchingReal || !userLocation}
              style={({ pressed }) => [
                styles.realSearchButton,
                {
                  backgroundColor: colors.success,
                  opacity: pressed || searchingReal || !userLocation ? 0.6 : 1,
                }
              ]}
            >
              {searchingReal ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <>
                  <IconSymbol name="sparkles" size={16} color="#FFF" />
                  <Text style={styles.realSearchButtonText}>Real Data</Text>
                </>
              )}
            </Pressable>
          </View>
        </View>

        {/* Filter Panel */}
        {showFilters && (
          <Animated.View
            entering={FadeIn.duration(300)}
            style={[styles.filterPanel, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}
          >
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
              {/* Origin filter */}
              <View style={styles.filterGroup}>
                <Text style={[styles.filterLabel, { color: colors.muted }]}>Origin</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.filterChips}>
                    {origins.map(origin => (
                      <Pressable
                        key={origin}
                        onPress={() => {
                          triggerHaptic();
                          setBeanFilter(prev =>
                            prev.origin === origin ? { ...prev, origin: undefined } : { ...prev, origin }
                          );
                        }}
                        style={({ pressed }) => [
                          styles.filterChip,
                          {
                            backgroundColor: beanFilter.origin === origin ? colors.primary : colors.background,
                            borderColor: colors.border,
                            opacity: pressed ? 0.7 : 1,
                          }
                        ]}
                      >
                        <Text style={[
                          styles.filterChipText,
                          { color: beanFilter.origin === origin ? "#FFF" : colors.foreground }
                        ]}>
                          {origin}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Roast Level filter */}
              <View style={styles.filterGroup}>
                <Text style={[styles.filterLabel, { color: colors.muted }]}>Roast</Text>
                <View style={styles.filterChips}>
                  {roastLevels.map(level => (
                    <Pressable
                      key={level}
                      onPress={() => {
                        triggerHaptic();
                        setBeanFilter(prev =>
                          prev.roastLevel === level ? { ...prev, roastLevel: undefined } : { ...prev, roastLevel: level }
                        );
                      }}
                      style={({ pressed }) => [
                        styles.filterChip,
                        {
                          backgroundColor: beanFilter.roastLevel === level ? colors.primary : colors.background,
                          borderColor: colors.border,
                          opacity: pressed ? 0.7 : 1,
                        }
                      ]}
                    >
                      <Text style={[
                        styles.filterChipText,
                        { color: beanFilter.roastLevel === level ? "#FFF" : colors.foreground }
                      ]}>
                        {level}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </ScrollView>

            {hasActiveFilters && (
              <Pressable onPress={clearFilters} style={styles.clearFiltersButton}>
                <Text style={[styles.clearFiltersText, { color: colors.error }]}>Clear All</Text>
              </Pressable>
            )}
          </Animated.View>
        )}

        {/* Results count */}
        <View style={styles.resultsHeader}>
          <Text style={[styles.resultsText, { color: colors.muted }]}>
            {filteredCafes.length} {filteredCafes.length === 1 ? 'cafe' : 'cafes'} found
          </Text>
          {locationError && (
            <Text style={[styles.locationError, { color: colors.warning }]}>
              {locationError}
            </Text>
          )}
        </View>

        {/* Cafe list */}
        <FlatList
          data={filteredCafes}
          renderItem={renderCafeCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <IconSymbol name="magnifyingglass" size={48} color={colors.muted} />
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
                No cafes found
              </Text>
              <Text style={[styles.emptyDescription, { color: colors.muted }]}>
                Try adjusting your filters or search query
              </Text>
            </View>
          }
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, gap: 12 },
  searchBar: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1, gap: 10 },
  searchInput: { flex: 1, fontSize: 16 },
  filterRow: { flexDirection: 'row', gap: 8 },
  filterButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1 },
  filterButtonText: { fontSize: 14, fontWeight: '600' },
  filterBadge: { width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  filterBadgeText: { fontSize: 11, fontWeight: '700' },
  myBeansButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1 },
  myBeansButtonText: { fontSize: 14, fontWeight: '600' },
  realSearchButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10 },
  realSearchButtonText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  filterPanel: { padding: 16, borderBottomWidth: 1, gap: 12 },
  filterScroll: { gap: 16 },
  filterGroup: { gap: 8 },
  filterLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  filterChips: { flexDirection: 'row', gap: 8 },
  filterChip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1 },
  filterChipText: { fontSize: 13, fontWeight: '500', textTransform: 'capitalize' },
  clearFiltersButton: { alignSelf: 'flex-end', paddingVertical: 6 },
  clearFiltersText: { fontSize: 13, fontWeight: '600' },
  resultsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8 },
  resultsText: { fontSize: 14, fontWeight: '500' },
  locationError: { fontSize: 12 },
  list: { padding: 16, gap: 16 },
  card: { borderRadius: 16, overflow: 'hidden' },
  imageContainer: { position: 'relative' },
  cardImage: { width: '100%', height: 200 },
  ratingBadge: { position: 'absolute', top: 12, right: 12, flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  ratingBadgeText: { fontSize: 14, fontWeight: '600' },
  distanceBadge: { position: 'absolute', bottom: 12, left: 12, flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  distanceBadgeText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  cardContent: { padding: 16, gap: 8 },
  cafeName: { fontSize: 20, fontWeight: '700' },
  cafeMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cafeSpecialty: { fontSize: 14, fontWeight: '600' },
  priceLevel: { fontSize: 14, fontWeight: '600' },
  cafeAddress: { fontSize: 14 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 8 },
  actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 10 },
  actionButtonText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  actionButtonSecondary: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderWidth: 1 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  loadingText: { fontSize: 16 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 12 },
  emptyTitle: { fontSize: 20, fontWeight: '700' },
  emptyDescription: { fontSize: 15, textAlign: 'center' },
});
