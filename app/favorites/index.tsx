import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
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

type Category = 'all' | 'coffee' | 'machine' | 'grinder' | 'bean' | 'article';

export default function FavoritesScreen() {
  const colors = useColors();
  const { favorites, getFavoritesByType } = useFavorites();
  const { hasAccess } = useSubscription();
  const [category, setCategory] = useState<Category>('all');

  if (!hasAccess('favorites')) {
    return <Paywall visible={true} onClose={() => router.back()} feature="favorites" featureName="Favorites" requiredTier="enthusiast" />;
  }

  const filtered = category === 'all' ? favorites : getFavoritesByType(category);

  return (
    <ScreenContainer>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs} contentContainerStyle={styles.tabsContent}>
        {(['all', 'coffee', 'machine', 'grinder', 'bean', 'article'] as Category[]).map(cat => (
          <Pressable
            key={cat}
            onPress={() => setCategory(cat)}
            style={[styles.tab, { backgroundColor: category === cat ? colors.primary : colors.surface }]}
          >
            <Text style={[styles.tabText, { color: category === cat ? '#FFF' : colors.foreground }]}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.list}>
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No Favorites Yet</Text>
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              Tap the heart icon on any item to add it to your favorites.
            </Text>
          </View>
        ) : (
          filtered.map(fav => {
            const item = getItemData(fav.id, fav.type);
            if (!item) return null;
            return (
              <Pressable
                key={fav.id}
                onPress={() => navigateToDetail(fav.id, fav.type)}
                style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <Text style={[styles.cardTitle, { color: colors.foreground }]}>{item.name}</Text>
                <Text style={[styles.cardType, { color: colors.muted }]}>{fav.type}</Text>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </ScreenContainer>
  );
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

function navigateToDetail(id: string, type: string) {
  if (type === 'coffee') router.push(`/coffee/${id}` as any);
  if (type === 'machine') router.push(`/machine/${id}` as any);
  if (type === 'grinder') router.push(`/grinder/${id}` as any);
  if (type === 'bean') router.push(`/beans/${id}` as any);
  if (type === 'article') router.push(`/learn/${id}` as any);
}

const styles = StyleSheet.create({
  tabs: { maxHeight: 60 },
  tabsContent: { padding: 16, gap: 8 },
  tab: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  tabText: { fontSize: 14, fontWeight: '600' },
  list: { padding: 16, gap: 12 },
  card: { padding: 16, borderRadius: 12, borderWidth: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  cardType: { fontSize: 13, textTransform: 'capitalize' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 80 },
  emptyTitle: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  emptyText: { fontSize: 15, textAlign: 'center', lineHeight: 22 }
});
