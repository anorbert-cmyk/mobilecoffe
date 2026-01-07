import { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Pressable, 
  Dimensions,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, { 
  FadeIn,
  FadeInDown,
  FadeInRight,
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { coffeeRecipes, CoffeeRecipe } from '@/data/coffees';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_CARD_WIDTH = SCREEN_WIDTH - 40;
const HORIZONTAL_CARD_WIDTH = 280;
const SMALL_CARD_WIDTH = (SCREEN_WIDTH - 52) / 2;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Get featured coffee (first milk drink for variety)
const featuredCoffee = coffeeRecipes.find(c => c.id === 'flat-white') || coffeeRecipes[0];

// Categorize coffees
const espressoDrinks = coffeeRecipes.filter(c => c.category === 'espresso');
const milkDrinks = coffeeRecipes.filter(c => c.category === 'milk');
const alternativeDrinks = coffeeRecipes.filter(c => c.category === 'alternative');

// Category type for filtering
type CategoryType = 'all' | 'espresso' | 'milk' | 'alternative';

const categories: { key: CategoryType; label: string; icon: string }[] = [
  { key: 'all', label: 'All', icon: 'square.grid.2x2.fill' },
  { key: 'espresso', label: 'Espresso', icon: 'cup.and.saucer.fill' },
  { key: 'milk', label: 'Milk Drinks', icon: 'drop.fill' },
  { key: 'alternative', label: 'Alternative', icon: 'flame.fill' },
];

function getDifficultyColor(difficulty: string, colors: any) {
  switch (difficulty) {
    case 'beginner': return colors.success;
    case 'intermediate': return colors.warning;
    case 'advanced': return colors.error;
    default: return colors.muted;
  }
}

function triggerHaptic() {
  if (Platform.OS !== 'web') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

// Hero Featured Card Component
function HeroCard({ coffee }: { coffee: CoffeeRecipe }) {
  const colors = useColors();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    triggerHaptic();
    router.push(`/coffee/${coffee.id}` as any);
  };

  return (
    <Animated.View entering={FadeIn.duration(600)}>
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={() => { scale.value = withSpring(0.98); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        style={[animatedStyle, styles.heroCard]}
        accessibilityRole="button"
        accessibilityLabel={`Featured: ${coffee.name}`}
      >
        <Image
          source={coffee.image}
          style={styles.heroImage}
          contentFit="cover"
          transition={400}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.heroGradient}
        />
        <View style={styles.heroContent}>
          <View style={styles.heroLabelContainer}>
            <View style={[styles.heroLabel, { backgroundColor: colors.primary }]}>
              <Text style={styles.heroLabelText}>FEATURED</Text>
            </View>
          </View>
          <View style={styles.heroTextContent}>
            <Text style={styles.heroTitle}>{coffee.name}</Text>
            <Text style={styles.heroSubtitle}>{coffee.description}</Text>
            <View style={styles.heroMeta}>
              <View style={styles.heroMetaItem}>
                <IconSymbol name="clock.fill" size={14} color="#FFFFFF" />
                <Text style={styles.heroMetaText}>{coffee.prepTime}</Text>
              </View>
              <View style={styles.heroMetaItem}>
                <IconSymbol name="chart.bar.fill" size={14} color="#FFFFFF" />
                <Text style={styles.heroMetaText}>{coffee.difficulty}</Text>
              </View>
            </View>
          </View>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

// Horizontal Scroll Card Component
function HorizontalCard({ coffee, index }: { coffee: CoffeeRecipe; index: number }) {
  const colors = useColors();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    triggerHaptic();
    router.push(`/coffee/${coffee.id}` as any);
  };

  return (
    <Animated.View entering={FadeInRight.delay(index * 80).duration(400)}>
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={() => { scale.value = withSpring(0.97); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        style={[animatedStyle, styles.horizontalCard, { backgroundColor: colors.surface }]}
        accessibilityRole="button"
        accessibilityLabel={`${coffee.name}, ${coffee.subtitle}`}
      >
        <Image
          source={coffee.image}
          style={styles.horizontalCardImage}
          contentFit="cover"
          transition={300}
        />
        <View style={styles.horizontalCardContent}>
          <View style={[
            styles.difficultyDot,
            { backgroundColor: getDifficultyColor(coffee.difficulty, colors) }
          ]} />
          <Text style={[styles.horizontalCardTitle, { color: colors.foreground }]} numberOfLines={1}>
            {coffee.name}
          </Text>
          <Text style={[styles.horizontalCardSubtitle, { color: colors.muted }]} numberOfLines={1}>
            {coffee.subtitle}
          </Text>
          <View style={styles.horizontalCardMeta}>
            <Text style={[styles.horizontalCardMetaText, { color: colors.muted }]}>
              {coffee.prepTime} · {coffee.ratio}
            </Text>
          </View>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

// Small Grid Card Component
function SmallCard({ coffee, index }: { coffee: CoffeeRecipe; index: number }) {
  const colors = useColors();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    triggerHaptic();
    router.push(`/coffee/${coffee.id}` as any);
  };

  return (
    <Animated.View 
      entering={FadeInDown.delay(index * 60).duration(400)}
      style={[styles.smallCardWrapper]}
    >
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={() => { scale.value = withSpring(0.96); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        style={[animatedStyle, styles.smallCard, { backgroundColor: colors.surface }]}
        accessibilityRole="button"
        accessibilityLabel={`${coffee.name}`}
      >
        <View style={styles.smallCardImageContainer}>
          <Image
            source={coffee.image}
            style={styles.smallCardImage}
            contentFit="cover"
            transition={300}
          />
          <View style={[
            styles.smallCardBadge,
            { backgroundColor: getDifficultyColor(coffee.difficulty, colors) }
          ]}>
            <Text style={styles.smallCardBadgeText}>
              {coffee.difficulty.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={styles.smallCardContent}>
          <Text style={[styles.smallCardTitle, { color: colors.foreground }]} numberOfLines={1}>
            {coffee.name}
          </Text>
          <Text style={[styles.smallCardSubtitle, { color: colors.muted }]} numberOfLines={1}>
            {coffee.prepTime}
          </Text>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

// Category Pill Component
function CategoryPill({ 
  category, 
  isActive, 
  onPress 
}: { 
  category: { key: CategoryType; label: string; icon: string }; 
  isActive: boolean; 
  onPress: () => void;
}) {
  const colors = useColors();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={() => {
        triggerHaptic();
        onPress();
      }}
      onPressIn={() => { scale.value = withSpring(0.95); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      style={[
        animatedStyle,
        styles.categoryPill,
        { 
          backgroundColor: isActive ? colors.primary : colors.surface,
          borderColor: isActive ? colors.primary : colors.border,
        }
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
    >
      <IconSymbol 
        name={category.icon as any} 
        size={16} 
        color={isActive ? '#FFFFFF' : colors.muted} 
      />
      <Text style={[
        styles.categoryPillText,
        { color: isActive ? '#FFFFFF' : colors.foreground }
      ]}>
        {category.label}
      </Text>
    </AnimatedPressable>
  );
}

// Section Header Component
function SectionHeader({ 
  title, 
  subtitle,
  showSeeAll = false,
  onSeeAll,
}: { 
  title: string; 
  subtitle?: string;
  showSeeAll?: boolean;
  onSeeAll?: () => void;
}) {
  const colors = useColors();

  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderText}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.sectionSubtitle, { color: colors.muted }]}>{subtitle}</Text>
        )}
      </View>
      {showSeeAll && onSeeAll && (
        <Pressable 
          onPress={onSeeAll}
          style={({ pressed }) => [styles.seeAllButton, { opacity: pressed ? 0.7 : 1 }]}
        >
          <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
          <IconSymbol name="chevron.right" size={14} color={colors.primary} />
        </Pressable>
      )}
    </View>
  );
}

export default function MakeCoffeeScreen() {
  const colors = useColors();
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');

  const getFilteredCoffees = useCallback(() => {
    switch (activeCategory) {
      case 'espresso': return espressoDrinks;
      case 'milk': return milkDrinks;
      case 'alternative': return alternativeDrinks;
      default: return coffeeRecipes;
    }
  }, [activeCategory]);

  const filteredCoffees = getFilteredCoffees();

  return (
    <ScreenContainer>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={[styles.greeting, { color: colors.muted }]}>Good morning</Text>
          <Text style={[styles.title, { color: colors.foreground }]} accessibilityRole="header">
            Make Coffee
          </Text>
        </Animated.View>

        {/* Featured Hero Card */}
        <View style={styles.heroSection}>
          <HeroCard coffee={featuredCoffee} />
        </View>

        {/* Category Filter Pills */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <CategoryPill
                key={category.key}
                category={category}
                isActive={activeCategory === category.key}
                onPress={() => setActiveCategory(category.key)}
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Espresso Drinks - Horizontal Scroll */}
        {(activeCategory === 'all' || activeCategory === 'espresso') && espressoDrinks.length > 0 && (
          <View style={styles.section}>
            <SectionHeader 
              title="Espresso Drinks" 
              subtitle="Pure coffee perfection"
            />
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScrollContent}
            >
              {espressoDrinks.map((coffee, index) => (
                <HorizontalCard key={coffee.id} coffee={coffee} index={index} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Milk Drinks - Horizontal Scroll */}
        {(activeCategory === 'all' || activeCategory === 'milk') && milkDrinks.length > 0 && (
          <View style={styles.section}>
            <SectionHeader 
              title="Milk Drinks" 
              subtitle="Creamy & smooth"
            />
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScrollContent}
            >
              {milkDrinks.map((coffee, index) => (
                <HorizontalCard key={coffee.id} coffee={coffee} index={index} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Alternative Methods - Grid */}
        {(activeCategory === 'all' || activeCategory === 'alternative') && alternativeDrinks.length > 0 && (
          <View style={styles.section}>
            <SectionHeader 
              title="Alternative Methods" 
              subtitle="Beyond espresso"
            />
            <View style={styles.gridContainer}>
              {alternativeDrinks.map((coffee, index) => (
                <SmallCard key={coffee.id} coffee={coffee} index={index} />
              ))}
            </View>
          </View>
        )}

        {/* All Recipes Grid (when filtered) */}
        {activeCategory !== 'all' && (
          <View style={styles.section}>
            <SectionHeader 
              title={`All ${categories.find(c => c.key === activeCategory)?.label || ''}`}
              subtitle={`${filteredCoffees.length} recipes`}
            />
            <View style={styles.gridContainer}>
              {filteredCoffees.map((coffee, index) => (
                <SmallCard key={coffee.id} coffee={coffee} index={index} />
              ))}
            </View>
          </View>
        )}

        {/* Quick Tips Card */}
        <Animated.View 
          entering={FadeInDown.delay(400).duration(400)}
          style={styles.section}
        >
          <Pressable
            style={({ pressed }) => [
              styles.tipsCard,
              { 
                backgroundColor: colors.surfaceElevated,
                opacity: pressed ? 0.9 : 1,
              }
            ]}
            onPress={() => {
              triggerHaptic();
              router.push('/(tabs)/learn' as any);
            }}
          >
            <View style={[styles.tipsIconContainer, { backgroundColor: `${colors.primary}15` }]}>
              <IconSymbol name="lightbulb.fill" size={24} color={colors.primary} />
            </View>
            <View style={styles.tipsContent}>
              <Text style={[styles.tipsTitle, { color: colors.foreground }]}>
                New to coffee?
              </Text>
              <Text style={[styles.tipsSubtitle, { color: colors.muted }]}>
                Learn the basics of brewing great coffee at home
              </Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.muted} />
          </Pressable>
        </Animated.View>

        {/* Bottom spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 8,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  
  // Hero Section
  heroSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  heroCard: {
    width: HERO_CARD_WIDTH,
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
  },
  heroContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    padding: 16,
    justifyContent: 'space-between',
  },
  heroLabelContainer: {
    flexDirection: 'row',
  },
  heroLabel: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  heroLabelText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  heroTextContent: {
    gap: 6,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    lineHeight: 20,
    maxWidth: '90%',
  },
  heroMeta: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 4,
  },
  heroMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  heroMetaText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    fontWeight: '500',
    textTransform: 'capitalize',
  },

  // Categories
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 10,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryPillText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Section
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionHeaderText: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
  },
  seeAllText: {
    fontSize: 15,
    fontWeight: '600',
  },

  // Horizontal Scroll Cards
  horizontalScrollContent: {
    paddingHorizontal: 20,
    gap: 14,
  },
  horizontalCard: {
    width: HORIZONTAL_CARD_WIDTH,
    borderRadius: 16,
    overflow: 'hidden',
  },
  horizontalCardImage: {
    width: '100%',
    height: 160,
  },
  horizontalCardContent: {
    padding: 14,
  },
  difficultyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  horizontalCardTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  horizontalCardSubtitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  horizontalCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  horizontalCardMetaText: {
    fontSize: 13,
    fontWeight: '500',
  },

  // Small Grid Cards
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  smallCardWrapper: {
    width: SMALL_CARD_WIDTH,
  },
  smallCard: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  smallCardImageContainer: {
    position: 'relative',
    aspectRatio: 1.2,
  },
  smallCardImage: {
    width: '100%',
    height: '100%',
  },
  smallCardBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallCardBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  smallCardContent: {
    padding: 12,
  },
  smallCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  smallCardSubtitle: {
    fontSize: 13,
  },

  // Tips Card
  tipsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    gap: 14,
  },
  tipsIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipsContent: {
    flex: 1,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  tipsSubtitle: {
    fontSize: 14,
    lineHeight: 18,
  },
});
