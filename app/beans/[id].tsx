import { View, Text, Pressable, StyleSheet, Dimensions, Platform, ScrollView, useColorScheme } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import * as Haptics from 'expo-haptics';
import { coffeeBeans } from '@/data/beans';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  FadeInDown
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useMyEquipment } from '@/lib/equipment/my-equipment-provider';

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = 400;

export default function BeanDetail() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const bean = coffeeBeans.find(b => b.id === id);
  const { equipment } = useMyEquipment();

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    return {
      height: HEADER_HEIGHT,
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75],
            Extrapolation.CLAMP
          ),
        },
        {
          scale: interpolate(
            scrollY.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2, 1, 1],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  const headerContentOpacity = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value,
        [0, HEADER_HEIGHT / 2],
        [1, 0],
        Extrapolation.CLAMP
      ),
    };
  });

  // Calculate matching gear
  const compatibleGear = equipment.filter(item => {
    // Simple heuristic: if bean has 'espresso' and gear is a machine
    if (bean?.brewMethods.some(m => m.toLowerCase().includes('espresso')) && item.type === 'machine') {
      return true;
    }
    // If equipment is a grinder, it works with everything (technically)
    if (item.type === 'grinder') return true;
    return false;
  }).slice(0, 2); // Show max 2 items

  if (!bean) {
    return (
      <ScreenContainer>
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: colors.foreground }]}>Bean not found</Text>
          <Pressable onPress={() => router.back()}>
            <Text style={{ color: colors.primary, marginTop: 10 }}>Go back</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Search/Back Header (Glass) */}
      <View style={styles.glassHeader}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          style={({ pressed }) => [
            styles.backButton,
            { backgroundColor: colors.background, opacity: pressed ? 0.7 : 1 }
          ]}
        >
          <IconSymbol name="arrow.left" size={20} color={colors.foreground} />
        </Pressable>
      </View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Parallax Header */}
        <Animated.View style={[styles.headerContainer, headerStyle]}>
          <Image
            source={bean.image}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={StyleSheet.absoluteFill}
          />

          {/* Header Content */}
          <Animated.View style={[styles.headerContent, headerContentOpacity]}>
            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                <Text style={styles.badgeText}>{bean.roaster}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <Text style={styles.badgeText}>{bean.roastLevel}</Text>
              </View>
            </View>
            <Text style={styles.heroTitle}>{bean.name}</Text>
            <Text style={styles.heroSubtitle}>
              {bean.origin}{bean.region ? ` • ${bean.region}` : ''}
            </Text>
          </Animated.View>
        </Animated.View>

        {/* Main Content */}
        <View style={[styles.contentContainer, { backgroundColor: colors.background }]}>

          {/* Rating & Price Row */}
          <View style={styles.metaRow}>
            <View style={styles.ratingBox}>
              <IconSymbol name="star.fill" size={16} color="#FFD700" />
              <Text style={[styles.ratingText, { color: colors.foreground }]}>{bean.rating}</Text>
              <Text style={[styles.reviewText, { color: colors.muted }]}>({bean.reviewCount})</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.priceText, { color: colors.foreground }]}>${bean.price}</Text>
              <Text style={[styles.perText, { color: colors.muted }]}>per {bean.weight}g</Text>
            </View>
          </View>

          {/* Feature: Works with your gear */}
          {compatibleGear.length > 0 && (
            <Animated.View entering={FadeInDown.delay(200).springify()} style={[styles.gearSection, { borderColor: colors.border }]}>
              <View style={styles.gearHeader}>
                <IconSymbol name="checkmark.circle.fill" size={16} color={colors.primary} />
                <Text style={[styles.gearTitle, { color: colors.foreground }]}>Works with your gear</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingBottom: 16 }}>
                {compatibleGear.map((item) => (
                  <View key={item.id} style={[styles.gearCard, { backgroundColor: colors.surface }]}>
                    <Image source={item.image} style={styles.gearImage} contentFit="contain" />
                    <View>
                      <Text style={[styles.gearName, { color: colors.foreground }]}>{item.name}</Text>
                      <Text style={[styles.gearType, { color: colors.muted }]}>{item.type === 'machine' ? 'Brewer' : 'Grinder'}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </Animated.View>
          )}

          {/* Flavor Notes (Bento) */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Flavor Notes</Text>
            <View style={styles.notesGrid}>
              {bean.flavorNotes.map((note, index) => (
                <Animated.View
                  key={note}
                  entering={FadeInDown.delay(300 + (index * 50)).springify()}
                  style={[styles.noteChip, { backgroundColor: colors.surface, borderColor: colors.border }]}
                >
                  <Text style={[styles.noteText, { color: colors.foreground }]}>{note}</Text>
                </Animated.View>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>About</Text>
            <Text style={[styles.description, { color: colors.muted }]}>{bean.description}</Text>
          </View>

          {/* Taste Profile (Animated Bars) */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Taste Profile</Text>
            <View style={styles.profileContainer}>
              {Object.entries(bean.tasteProfile).map(([key, value], idx) => (
                <View key={key} style={styles.profileRow}>
                  <Text style={[styles.profileLabel, { color: colors.muted }]}>{key}</Text>
                  <View style={styles.barContainer}>
                    <View style={[styles.barBg, { backgroundColor: colors.surface }]} />
                    <Animated.View
                      entering={FadeInDown.delay(400 + (idx * 100)).duration(1000)}
                      style={[
                        styles.barFill,
                        {
                          width: `${(value / 10) * 100}%`,
                          backgroundColor: colors.primary
                        }
                      ]}
                    />
                  </View>
                  <Text style={[styles.profileValue, { color: colors.foreground }]}>{value}</Text>
                </View>
              ))}
            </View>
          </View>

        </View>
      </Animated.ScrollView>

      {/* Floating Buy Button */}
      <BlurView intensity={20} tint={colorScheme === 'dark' ? 'dark' : 'light'} style={[styles.bottomBar, { borderTopColor: colors.border }]}>
        <View style={styles.bottomBarContent}>
          <View>
            <Text style={[styles.totalLabel, { color: colors.muted }]}>Total Price</Text>
            <Text style={[styles.totalPrice, { color: colors.foreground }]}>${bean.price}</Text>
          </View>
          <Pressable
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
            style={({ pressed }) => [
              styles.buyButton,
              { backgroundColor: bean.inStock ? colors.primary : colors.muted, opacity: pressed ? 0.9 : 1 }
            ]}
            disabled={!bean.inStock}
          >
            <Text style={styles.buyButtonText}>
              {bean.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Text>
            {bean.inStock && <IconSymbol name="cart.fill" size={16} color="#FFF" />}
          </Pressable>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
  },
  glassHeader: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 100,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  headerContainer: {
    width: '100%',
    position: 'relative',
    backgroundColor: '#000',
  },
  headerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 40, // Overlap
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  contentContainer: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    paddingTop: 32,
    paddingHorizontal: 20,
    minHeight: 800,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,215,0,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '700',
  },
  reviewText: {
    fontSize: 14,
  },
  priceText: {
    fontSize: 24,
    fontWeight: '700',
  },
  perText: {
    fontSize: 12,
  },
  gearSection: {
    marginBottom: 24,
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gearHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
  },
  gearTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  gearCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    gap: 12,
    width: 200,
  },
  gearImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  gearName: {
    fontSize: 13,
    fontWeight: '600',
  },
  gearType: {
    fontSize: 11,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  notesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  noteChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  noteText: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  profileContainer: {
    gap: 16,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileLabel: {
    width: 80,
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  barContainer: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    position: 'relative',
  },
  barBg: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 3,
    opacity: 0.5,
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  profileValue: {
    width: 30,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 0.5,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    paddingTop: 16,
    paddingHorizontal: 20,
  },
  bottomBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '700',
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 100,
  },
  buyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
