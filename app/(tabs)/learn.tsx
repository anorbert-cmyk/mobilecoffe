import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { ScreenContainer } from '@/components/screen-container';
import { PremiumCard } from '@/components/ui/premium-card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { learningCategories, LearningCategory } from '@/data/learning';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const categoryIcons: Record<string, string> = {
  'brewing-basics': 'cup.and.saucer.fill',
  'roast-levels': 'flame.fill',
  'coffee-origins': 'globe',
  'equipment-guide': 'wrench.fill',
  'home-setup': 'house.fill',
};

const categoryColors: Record<string, { light: string; dark: string }> = {
  'brewing-basics': { light: '#5D4037', dark: '#D4A574' },
  'roast-levels': { light: '#E65100', dark: '#FF9800' },
  'coffee-origins': { light: '#2E7D32', dark: '#66BB6A' },
  'equipment-guide': { light: '#1565C0', dark: '#42A5F5' },
  'home-setup': { light: '#6A1B9A', dark: '#AB47BC' },
};

// Separate component for category card to properly use hooks
function CategoryCard({ item, index }: { item: LearningCategory; index: number }) {
  const colors = useColors();
  const scale = useSharedValue(1);
  const iconName = categoryIcons[item.id] || 'book.fill';
  const categoryColor = categoryColors[item.id] || { light: colors.primary, dark: colors.primary };
  const accentColor = colors.foreground === '#1C1410' ? categoryColor.light : categoryColor.dark;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInDown.delay(index * 80).springify()}>
      <AnimatedPressable
        onPress={() => router.push(`/learn/${item.id}` as any)}
        onPressIn={() => { scale.value = withSpring(0.98); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        style={animatedStyle}
        accessibilityRole="button"
        accessibilityLabel={`Learn about ${item.title}`}
      >
        <PremiumCard style={styles.categoryCard} elevated>
          <View style={styles.cardContent}>
            {/* Icon */}
            <View style={[styles.iconContainer, { backgroundColor: `${accentColor}15` }]}>
              <IconSymbol name={iconName as any} size={28} color={accentColor} />
            </View>
            
            {/* Content */}
            <View style={styles.textContent}>
              <Text 
                style={[styles.categoryTitle, { color: colors.foreground }]}
                numberOfLines={1}
                accessibilityRole="header"
              >
                {item.title}
              </Text>
              <Text 
                style={[styles.categoryDescription, { color: colors.muted }]}
                numberOfLines={2}
              >
                {item.description}
              </Text>
              
              {/* Article count */}
              <View style={styles.metaRow}>
                <View style={[styles.articleCount, { backgroundColor: colors.surfaceElevated }]}>
                  <Text style={[styles.articleCountText, { color: colors.muted }]}>
                    {item.articles.length} {item.articles.length === 1 ? 'article' : 'articles'}
                  </Text>
                </View>
                <View style={[styles.readTime, { backgroundColor: colors.surfaceElevated }]}>
                  <IconSymbol name="clock.fill" size={12} color={colors.muted} />
                  <Text style={[styles.readTimeText, { color: colors.muted }]}>
                    {Math.ceil(item.articles.reduce((acc, a) => acc + a.readTime, 0))} min
                  </Text>
                </View>
              </View>
            </View>
            
            {/* Arrow */}
            <IconSymbol name="chevron.right" size={20} color={colors.muted} />
          </View>
        </PremiumCard>
      </AnimatedPressable>
    </Animated.View>
  );
}

export default function LearnCoffeeScreen() {
  const colors = useColors();

  const renderCategoryItem = ({ item, index }: { item: LearningCategory; index: number }) => (
    <CategoryCard item={item} index={index} />
  );

  // Quick tips data
  const quickTips = [
    {
      icon: 'info.circle.fill',
      title: 'Fresh is Best',
      text: 'Use coffee beans within 2-4 weeks of roasting for optimal flavor.',
    },
    {
      icon: 'thermometer',
      title: 'Water Temperature',
      text: 'Ideal brewing temperature is 90-96°C (195-205°F).',
    },
    {
      icon: 'gauge',
      title: 'Measure Everything',
      text: 'Use a scale for consistent results. Ratio: 1:15 to 1:18.',
    },
  ];

  return (
    <ScreenContainer>
      <FlatList
        data={learningCategories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Animated.Text 
              entering={FadeInDown.delay(0).springify()}
              style={[styles.title, { color: colors.foreground }]}
              accessibilityRole="header"
            >
              Learn Coffee
            </Animated.Text>
            <Animated.Text 
              entering={FadeInDown.delay(100).springify()}
              style={[styles.subtitle, { color: colors.muted }]}
            >
              Master the art of coffee making
            </Animated.Text>
            
            {/* Quick stats */}
            <Animated.View 
              entering={FadeInDown.delay(200).springify()}
              style={styles.statsRow}
            >
              <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                <Text style={[styles.statNumber, { color: colors.primary }]}>
                  {learningCategories.length}
                </Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>
                  Topics
                </Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                <Text style={[styles.statNumber, { color: colors.primary }]}>
                  {learningCategories.reduce((acc, cat) => acc + cat.articles.length, 0)}
                </Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>
                  Articles
                </Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                <Text style={[styles.statNumber, { color: colors.primary }]}>
                  {Math.ceil(learningCategories.reduce((acc, cat) => 
                    acc + cat.articles.reduce((a, art) => a + art.readTime, 0), 0
                  ))}
                </Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>
                  Minutes
                </Text>
              </View>
            </Animated.View>
          </View>
        }
        ListFooterComponent={
          <Animated.View 
            entering={FadeInDown.delay(500).springify()}
            style={styles.tipsSection}
          >
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Quick Tips
            </Text>
            {quickTips.map((tip, index) => (
              <View 
                key={index}
                style={[styles.tipCard, { backgroundColor: colors.surface }]}
              >
                <View style={[styles.tipIconContainer, { backgroundColor: `${colors.primary}15` }]}>
                  <IconSymbol name={tip.icon as any} size={20} color={colors.primary} />
                </View>
                <View style={styles.tipContent}>
                  <Text style={[styles.tipTitle, { color: colors.foreground }]}>
                    {tip.title}
                  </Text>
                  <Text style={[styles.tipText, { color: colors.muted }]}>
                    {tip.text}
                  </Text>
                </View>
              </View>
            ))}
          </Animated.View>
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 4,
    paddingTop: 8,
    paddingBottom: 24,
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
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  categoryCard: {
    padding: 16,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContent: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
  },
  articleCount: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  articleCountText: {
    fontSize: 11,
    fontWeight: '600',
  },
  readTime: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  readTimeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  tipsSection: {
    marginTop: 32,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  tipCard: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    gap: 12,
    alignItems: 'flex-start',
  },
  tipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
