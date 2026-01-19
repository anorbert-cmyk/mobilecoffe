import { useState } from "react";
import { ScrollView, Text, View, Pressable, StyleSheet, Dimensions, Platform } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { ScreenContainer } from "@/components/screen-container";
import { Breadcrumb } from "@/components/breadcrumb";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { FavoriteButton } from "@/components/favorite-button";
import { getCategoryById, Article } from "@/data/learning";
import { useColors } from "@/hooks/use-colors";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function triggerHaptic() {
  if (Platform.OS !== 'web') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

// Hero image mapping for articles - using generated premium header images
const articleHeroImages: Record<string, any> = {
  'brewing-basics': require('@/assets/images/learning/brewing-basics.png'),
  'roast-levels': require('@/assets/images/learning/roast-levels.png'),
  'coffee-origins': require('@/assets/images/learning/coffee-origins.png'),
  'equipment-guide': require('@/assets/images/learning/equipment-guide.png'),
  'home-setup': require('@/assets/images/learning/home-setup.png'),
};

export default function LearnCategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const scrollY = useSharedValue(0);

  const category = getCategoryById(id);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  if (!category) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text style={{ color: colors.foreground }}>Category not found</Text>
      </ScreenContainer>
    );
  }

  if (selectedArticle) {
    const heroImage = articleHeroImages[category.id] || require('@/assets/images/espresso.png');

    const heroAnimatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateY: interpolate(
              scrollY.value,
              [-300, 0, 300],
              [-150, 0, 150],
              Extrapolation.CLAMP
            ),
          },
          {
            scale: interpolate(
              scrollY.value,
              [-300, 0],
              [2, 1],
              Extrapolation.CLAMP
            ),
          },
        ],
      };
    });

    const headerContentStyle = useAnimatedStyle(() => {
      return {
        opacity: interpolate(
          scrollY.value,
          [0, 200],
          [1, 0],
          Extrapolation.CLAMP
        ),
        transform: [
          {
            translateY: interpolate(
              scrollY.value,
              [0, 200],
              [0, 50],
              Extrapolation.CLAMP
            ),
          },
        ],
      };
    });

    return (
      <>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          {/* Fixed Back Button */}
          <Pressable
            onPress={() => {
              triggerHaptic();
              setSelectedArticle(null);
            }}
            style={[styles.floatingBackButton, { backgroundColor: 'rgba(0,0,0,0.3)' }]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <IconSymbol name="arrow.left" size={24} color="#FFF" />
          </Pressable>

          <Animated.ScrollView
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            style={{ flex: 1 }}
            contentContainerStyle={styles.articleScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Parallax Hero */}
            <View style={styles.heroContainer}>
              <Animated.View style={[styles.heroImageContainer, heroAnimatedStyle]}>
                <Image
                  source={heroImage}
                  style={styles.heroImage}
                  contentFit="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.6)']}
                  style={styles.heroOverlay}
                />
              </Animated.View>

              <Animated.View style={[styles.heroTextContainer, headerContentStyle]}>
                <View style={[styles.categoryBadge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.categoryBadgeText}>
                    {category.title}
                  </Text>
                </View>
                <Text style={styles.heroTitle}>{selectedArticle.title}</Text>
                <View style={styles.heroMeta}>
                  <IconSymbol name="clock.fill" size={14} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.heroMetaText}>{selectedArticle.readTime || '5 min read'}</Text>
                </View>
              </Animated.View>
            </View>

            {/* Content Body */}
            <View style={[styles.contentBody, { backgroundColor: colors.background }]}>
              {/* Render article content */}
              {selectedArticle.content.split('\n\n').map((paragraph, index) => {
                // Headers
                if (paragraph.startsWith('# ')) {
                  return (
                    <Animated.Text key={index} entering={FadeInDown.delay(100).duration(500)} style={[styles.h1, { color: colors.foreground }]}>
                      {paragraph.replace('# ', '')}
                    </Animated.Text>
                  );
                }
                if (paragraph.startsWith('## ')) {
                  return (
                    <Animated.Text key={index} entering={FadeInDown.delay(100).duration(500)} style={[styles.h2, { color: colors.foreground }]}>
                      {paragraph.replace('## ', '')}
                    </Animated.Text>
                  );
                }
                if (paragraph.startsWith('### ')) {
                  return (
                    <Animated.Text key={index} entering={FadeInDown.delay(100).duration(500)} style={[styles.h3, { color: colors.foreground }]}>
                      {paragraph.replace('### ', '')}
                    </Animated.Text>
                  );
                }

                // Pull Quotes
                if (paragraph.startsWith('> ')) {
                  return (
                    <Animated.View
                      key={index}
                      entering={FadeInDown.delay(200).duration(600)}
                      style={[styles.pullQuote, { borderColor: colors.primary }]}
                    >
                      <IconSymbol name="quote.opening" size={32} color={colors.primary} style={{ opacity: 0.2, marginBottom: 8 }} />
                      <Text style={[styles.pullQuoteText, { color: colors.foreground }]}>
                        {paragraph.replace('> ', '')}
                      </Text>
                    </Animated.View>
                  );
                }

                // Pro Tips
                if (paragraph.startsWith('! ')) {
                  return (
                    <Animated.View
                      key={index}
                      entering={FadeInDown.delay(200).duration(600)}
                      style={[styles.tipBox, { backgroundColor: `${colors.warning}10`, borderColor: `${colors.warning}30` }]}
                    >
                      <View style={styles.tipHeader}>
                        <IconSymbol name="lightbulb.fill" size={20} color={colors.warning} />
                        <Text style={[styles.tipTitle, { color: colors.warning }]}>Pro Tip</Text>
                      </View>
                      <Text style={[styles.tipText, { color: colors.foreground }]}>
                        {paragraph.replace('! ', '')}
                      </Text>
                    </Animated.View>
                  );
                }

                // Lists
                if (paragraph.includes('\n- ')) {
                  const lines = paragraph.split('\n');
                  return (
                    <View key={index} style={styles.listContainer}>
                      {lines.map((line, i) => {
                        if (line.startsWith('- ')) {
                          return (
                            <View key={i} style={styles.listItem}>
                              <View style={[styles.bullet, { backgroundColor: colors.primary }]} />
                              <Text style={[styles.listText, { color: colors.foreground }]}>
                                {line.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '$1')}
                              </Text>
                            </View>
                          );
                        }
                        return <Text key={i} style={[styles.paragraph, { color: colors.foreground }]}>{line}</Text>;
                      })}
                    </View>
                  );
                }

                // Paragraphs
                if (paragraph.trim()) {
                  return (
                    <Text key={index} style={[styles.paragraph, { color: colors.foreground, opacity: 0.9 }]}>
                      {paragraph.replace(/\*\*(.*?)\*\*/g, '$1')}
                    </Text>
                  );
                }
                return null;
              })}

              <View style={{ height: 100 }} />
            </View>
          </Animated.ScrollView>
        </View>
      </>
    );
  }

  // Category list view (unchanged but cleaned up styles)
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: category.title,
          headerBackTitle: "Back",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.primary,
          headerTitleStyle: { color: colors.foreground },
        }}
      />
      <ScreenContainer>
        <ScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.categoryDescription, { color: colors.muted }]}>
            {category.description}
          </Text>

          {category.articles.map((article, index) => (
            <Animated.View key={article.id} entering={FadeInDown.delay(index * 100).duration(400)}>
              <Pressable
                onPress={() => {
                  triggerHaptic();
                  setSelectedArticle(article);
                }}
                style={({ pressed }) => [
                  styles.articleCard,
                  {
                    backgroundColor: colors.surface,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  }
                ]}
              >
                <View style={styles.articleCardContent}>
                  <View style={styles.articleCardHeader}>
                    <Text style={[styles.articleCardTitle, { color: colors.foreground }]}>
                      {article.title}
                    </Text>
                    <FavoriteButton id={article.id} type="article" size={20} />
                  </View>
                  <View style={styles.articleCardMeta}>
                    <IconSymbol name="clock.fill" size={14} color={colors.muted} />
                    <Text style={[styles.articleCardMetaText, { color: colors.muted }]}>
                      {article.readTime || '5 min'}
                    </Text>
                  </View>
                </View>
                <IconSymbol name="chevron.right" size={20} color={colors.muted} />
              </Pressable>
            </Animated.View>
          ))}
        </ScrollView>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  // Hero
  heroContainer: {
    height: 400,
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  heroImageContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  heroTextContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -0.5,
    marginBottom: 12,
    lineHeight: 42,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroMetaText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryBadge: {
    backgroundColor: '#000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  categoryBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  floatingBackButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },

  // Content Body
  contentBody: {
    flex: 1,
    marginTop: -24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    minHeight: 500,
  },
  articleScrollContent: {
    flexGrow: 1,
  },

  // Typography
  h1: { fontSize: 28, fontWeight: '800', marginBottom: 16, marginTop: 32 },
  h2: { fontSize: 24, fontWeight: '700', marginBottom: 16, marginTop: 32 },
  h3: { fontSize: 20, fontWeight: '700', marginBottom: 12, marginTop: 24 },
  paragraph: { fontSize: 18, lineHeight: 30, marginBottom: 20, letterSpacing: 0.1 },

  // Components
  pullQuote: {
    marginVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderLeftWidth: 0, // Override default
  },
  pullQuoteText: {
    fontSize: 22,
    lineHeight: 34,
    fontWeight: '500',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  tipBox: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginVertical: 24,
  },
  tipHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  tipTitle: { fontSize: 16, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  tipText: { fontSize: 16, lineHeight: 26 },

  // Lists
  listContainer: { marginBottom: 24 },
  listItem: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  bullet: { width: 6, height: 6, borderRadius: 3, marginTop: 12 },
  listText: { flex: 1, fontSize: 18, lineHeight: 30 },

  // Category List
  listContent: { padding: 20 },
  categoryDescription: { fontSize: 16, lineHeight: 24, marginBottom: 24 },
  articleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  articleCardContent: { flex: 1, marginRight: 12 },
  articleCardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  articleCardTitle: { flex: 1, fontSize: 18, fontWeight: '700', marginRight: 8 },
  articleCardMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  articleCardMetaText: { fontSize: 14, fontWeight: '500' },
});
