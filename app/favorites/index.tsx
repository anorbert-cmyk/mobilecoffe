import { View, Text, Pressable, ScrollView, StyleSheet, Dimensions, Platform, Image as RNImage } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useFavorites } from '@/lib/favorites/favorites-provider';
import { useSubscription } from '@/lib/subscription/subscription-provider';
import { Paywall } from '@/components/subscription/paywall';
import { coffeeRecipes } from '@/data/coffees';
import { espressoMachines, coffeeGrinders } from '@/data/machines';
import { coffeeBeans } from '@/data/beans';
import { learningCategories } from '@/data/learning';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

type Category = 'all' | 'coffee' | 'machine' | 'grinder' | 'bean' | 'article';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_WIDTH = (SCREEN_WIDTH - 48) / 2;

const triggerHaptic = () => {
  if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

export default function FavoritesScreen() {
  const colors = useColors();
  const { favorites, getFavoritesByType } = useFavorites();
  const { hasAccess } = useSubscription();
  const [category, setCategory] = useState<Category>('all');

  if (!hasAccess('favorites')) {
    return <Paywall visible={true} onClose={() => router.back()} feature="favorites" featureName="Favorites" requiredTier="enthusiast" />;
  }

  const filtered = category === 'all' ? favorites : getFavoritesByType(category);

  const categories: { id: Category; label: string; icon: string }[] = [
    { id: 'all', label: 'All', icon: 'square.grid.2x2.fill' },
    { id: 'coffee', label: 'Brews', icon: 'cup.and.saucer.fill' },
    { id: 'bean', label: 'Beans', icon: 'bag.fill' },
    { id: 'machine', label: 'Gear', icon: 'gearshape.fill' },
    { id: 'article', label: 'Learn', icon: 'book.fill' },
  ];

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Your Favorites</Text>
        <Text style={[styles.headerSubtitle, { color: colors.muted }]}>
          {favorites.length} saved {favorites.length === 1 ? 'item' : 'items'}
        </Text>
      </View>

      {/* Glassmorphic Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {categories.map((cat, index) => (
            <Pressable
              key={cat.id}
              onPress={() => {
                triggerHaptic();
                setCategory(cat.id);
              }}
              style={[
                styles.tab,
                {
                  backgroundColor: category === cat.id ? colors.primary : colors.surface,
                  borderColor: category === cat.id ? colors.primary : 'rgba(255,255,255,0.1)',
                }
              ]}
            >
              <IconSymbol
                name={cat.icon as any}
                size={14}
                color={category === cat.id ? '#FFF' : colors.muted}
              />
              <Text style={[
                styles.tabText,
                { color: category === cat.id ? '#FFF' : colors.muted }
              ]}>
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.grid}>
        {filtered.length === 0 ? (
          <Animated.View
            entering={FadeInDown.springify()}
            style={styles.empty}
          >
            <View style={[styles.emptyIcon, { backgroundColor: colors.surface }]}>
              <IconSymbol name="heart.slash" size={40} color={colors.muted} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No Favorites Yet</Text>
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              Tap the heart icon on any item to add it to your collection.
            </Text>
          </Animated.View>
        ) : (
          <View style={styles.masonryGrid}>
            {filtered.map((fav, index) => {
              const item = getItemData(fav.id, fav.type);
              if (!item) return null;

              return (
                <Animated.View
                  key={fav.id}
                  entering={FadeInDown.delay(index * 50).springify()}
                  layout={Layout.springify()}
                  style={[styles.cardContainer, { width: COLUMN_WIDTH }]}
                >
                  <Pressable
                    onPress={() => {
                      triggerHaptic();
                      navigateToDetail(fav.id, fav.type);
                    }}
                    style={({ pressed }) => [
                      styles.card,
                      {
                        backgroundColor: colors.surface,
                        transform: [{ scale: pressed ? 0.96 : 1 }]
                      }
                    ]}
                  >
                    <View style={styles.cardImageContainer}>
                      <Image
                        source={getItemImage(item, fav.type)}
                        style={styles.cardImage}
                        contentFit="cover"
                        transition={200}
                      />
                      <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                        style={StyleSheet.absoluteFill}
                      />
                      <View style={styles.cardBadge}>
                        <IconSymbol
                          name={getCategoryIcon(fav.type)}
                          size={10}
                          color="#FFF"
                        />
                        <Text style={styles.cardBadgeText}>{fav.type}</Text>
                      </View>
                    </View>

                    <View style={styles.cardContent}>
                      <Text numberOfLines={2} style={[styles.cardTitle, { color: colors.foreground }]}>
                        {item.name}
                      </Text>
                      <View style={styles.cardFooter}>
                        <Text style={[styles.viewLink, { color: colors.primary }]}>View</Text>
                        <IconSymbol name="chevron.right" size={12} color={colors.primary} />
                      </View>
                    </View>
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

// Helpers
function getCategoryIcon(type: string): any {
  switch (type) {
    case 'coffee': return 'cup.and.saucer.fill';
    case 'bean': return 'bag.fill';
    case 'machine': return 'gearshape.fill';
    case 'grinder': return 'gearshape.2.fill';
    case 'article': return 'book.fill';
    default: return 'star.fill';
  }
}

function getItemData(id: string, type: string) {
  if (type === 'coffee') return coffeeRecipes.find((c: any) => c.id === id);
  if (type === 'machine') return espressoMachines.find((m: any) => m.id === id);
  if (type === 'grinder') return coffeeGrinders.find((g: any) => g.id === id);
  if (type === 'bean') return coffeeBeans.find((b: any) => b.id === id);
  if (type === 'article') {
    for (const cat of learningCategories) {
      const article = cat.articles.find((a: any) => a.id === id);
      if (article) return { ...article, name: article.title };
    }
  }
  return null;
}

function getItemImage(item: any, type: string) {
  if (item.image) return item.image;
  // Fallbacks
  if (type === 'coffee') return require('@/assets/images/espresso.png');
  if (type === 'bean') return require('@/assets/images/coffee-beans-bg.png');
  if (type === 'article') return require('@/assets/images/learning/brewing-basics.png');
  return require('@/assets/images/icon.png');
}

function navigateToDetail(id: string, type: string) {
  if (type === 'coffee') router.push(`/coffee/${id}` as any);
  if (type === 'machine') router.push(`/machine/${id}` as any);
  if (type === 'grinder') router.push(`/grinder/${id}` as any);
  if (type === 'bean') router.push(`/beans/${id}` as any);
  if (type === 'article') router.push(`/learn/${id}` as any);
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
  },
  headerSubtitle: {
    fontSize: 15,
    marginTop: 4,
  },
  tabsContainer: {
    marginBottom: 10,
  },
  tabsContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  grid: {
    padding: 20,
    paddingBottom: 100,
  },
  masonryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  cardContainer: {
    marginBottom: 8,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cardImageContainer: {
    height: 140,
    width: '100%',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
    height: 40,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewLink: {
    fontSize: 12,
    fontWeight: '700',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    maxWidth: 250,
    lineHeight: 22,
  },
});
