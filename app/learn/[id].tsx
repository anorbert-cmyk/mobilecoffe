import { useState } from "react";
import { ScrollView, Text, View, Pressable, StyleSheet, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import { ScreenContainer } from "@/components/screen-container";
import { Breadcrumb } from "@/components/breadcrumb";
import { IconSymbol } from "@/components/ui/icon-symbol";
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

  const category = getCategoryById(id);

  if (!category) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text style={{ color: colors.foreground }}>Category not found</Text>
      </ScreenContainer>
    );
  }

  if (selectedArticle) {
    const heroImage = articleHeroImages[category.id] || require('@/assets/images/espresso.png');
    
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <ScrollView 
          style={{ flex: 1, backgroundColor: colors.background }}
          contentContainerStyle={styles.articleContainer}
          showsVerticalScrollIndicator={false}
        >
          <Breadcrumb items={[
            { label: 'Home', href: '/' },
            { label: 'Learn', href: '/learn' },
            { label: selectedArticle.title }
          ]} />
          {/* Hero Section */}
          <View style={[styles.heroSection, { backgroundColor: colors.surface }]}>
            <Image
              source={heroImage}
              style={styles.heroImage}
              contentFit="cover"
              contentPosition="center"
              transition={300}
            />
            <LinearGradient
              colors={['transparent', colors.background]}
              style={styles.heroGradient}
            />
            
            {/* Back Button */}
            <Pressable
              onPress={() => {
                triggerHaptic();
                setSelectedArticle(null);
              }}
              style={[styles.floatingBackButton, { backgroundColor: `${colors.background}CC` }]}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <IconSymbol name="arrow.left" size={20} color={colors.foreground} />
            </Pressable>
          </View>

          {/* Article Content */}
          <Animated.View entering={FadeIn.duration(400)} style={styles.content}>
            {/* Category Badge */}
            <View style={[styles.categoryBadge, { backgroundColor: `${colors.primary}15` }]}>
              <Text style={[styles.categoryBadgeText, { color: colors.primary }]}>
                {category.title}
              </Text>
            </View>

            {/* Title */}
            <Text style={[styles.articleTitle, { color: colors.foreground }]}>
              {selectedArticle.title}
            </Text>

            {/* Meta Info */}
            <View style={styles.metaInfo}>
              <View style={styles.metaItem}>
                <IconSymbol name="clock.fill" size={16} color={colors.muted} />
                <Text style={[styles.metaText, { color: colors.muted }]}>
                  {selectedArticle.readTime || '5 min read'}
                </Text>
              </View>
              <View style={styles.metaDivider} />
              <View style={styles.metaItem}>
                <IconSymbol name="book.fill" size={16} color={colors.muted} />
                <Text style={[styles.metaText, { color: colors.muted }]}>
                  {category.title}
                </Text>
              </View>
            </View>

            {/* Render markdown-like content */}
            {selectedArticle.content.split('\n\n').map((paragraph, index) => {
              // Handle headers
              if (paragraph.startsWith('# ')) {
                return (
                  <Animated.Text 
                    key={index} 
                    entering={FadeInDown.delay(index * 50).duration(400)}
                    style={[styles.h1, { color: colors.foreground }]}
                  >
                    {paragraph.replace('# ', '')}
                  </Animated.Text>
                );
              }
              if (paragraph.startsWith('## ')) {
                return (
                  <Animated.Text 
                    key={index} 
                    entering={FadeInDown.delay(index * 50).duration(400)}
                    style={[styles.h2, { color: colors.foreground }]}
                  >
                    {paragraph.replace('## ', '')}
                  </Animated.Text>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <Animated.Text 
                    key={index} 
                    entering={FadeInDown.delay(index * 50).duration(400)}
                    style={[styles.h3, { color: colors.foreground }]}
                  >
                    {paragraph.replace('### ', '')}
                  </Animated.Text>
                );
              }
              
              // Handle pull quotes (> prefix)
              if (paragraph.startsWith('> ')) {
                return (
                  <Animated.View 
                    key={index} 
                    entering={FadeInDown.delay(index * 50).duration(400)}
                    style={[styles.pullQuote, { 
                      backgroundColor: `${colors.primary}10`,
                      borderLeftColor: colors.primary,
                    }]}
                  >
                    <IconSymbol name="quote.opening" size={24} color={colors.primary} style={styles.quoteIcon} />
                    <Text style={[styles.pullQuoteText, { color: colors.foreground }]}>
                      {paragraph.replace('> ', '')}
                    </Text>
                  </Animated.View>
                );
              }

              // Handle tip boxes (! prefix)
              if (paragraph.startsWith('! ')) {
                return (
                  <Animated.View 
                    key={index} 
                    entering={FadeInDown.delay(index * 50).duration(400)}
                    style={[styles.tipBox, { 
                      backgroundColor: `${colors.warning}15`,
                      borderColor: colors.warning,
                    }]}
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
              
              // Handle lists
              if (paragraph.includes('\n- ')) {
                const lines = paragraph.split('\n');
                return (
                  <Animated.View 
                    key={index} 
                    entering={FadeInDown.delay(index * 50).duration(400)}
                    style={styles.listContainer}
                  >
                    {lines.map((line, lineIndex) => {
                      if (line.startsWith('- ')) {
                        return (
                          <View key={lineIndex} style={styles.listItem}>
                            <View style={[styles.bulletPoint, { backgroundColor: colors.primary }]} />
                            <Text style={[styles.listText, { color: colors.foreground }]}>
                              {line.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '$1')}
                            </Text>
                          </View>
                        );
                      }
                      if (line.trim()) {
                        return (
                          <Text key={lineIndex} style={[styles.paragraph, { color: colors.foreground }]}>
                            {line.replace(/\*\*(.*?)\*\*/g, '$1')}
                          </Text>
                        );
                      }
                      return null;
                    })}
                  </Animated.View>
                );
              }
              
              // Regular paragraphs
              if (paragraph.trim()) {
                return (
                  <Animated.Text 
                    key={index} 
                    entering={FadeInDown.delay(index * 50).duration(400)}
                    style={[styles.paragraph, { color: colors.foreground }]}
                  >
                    {paragraph.replace(/\*\*(.*?)\*\*/g, '$1')}
                  </Animated.Text>
                );
              }
              
              return null;
            })}

            {/* Bottom Spacing */}
            <View style={{ height: 100 }} />
          </Animated.View>
        </ScrollView>
      </>
    );
  }

  // Category list view
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
                    opacity: pressed ? 0.7 : 1,
                  }
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Read ${article.title}`}
              >
                <View style={styles.articleCardContent}>
                  <Text style={[styles.articleCardTitle, { color: colors.foreground }]}>
                    {article.title}
                  </Text>
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
  // Article View
  articleContainer: {
    flexGrow: 1,
  },
  heroSection: {
    width: '100%',
    height: 280,
    position: 'relative',
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
    height: '60%',
  },
  floatingBackButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  categoryBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  articleTitle: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 40,
    marginBottom: 16,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: 12,
  },
  metaText: {
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Typography
  h1: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.4,
    lineHeight: 36,
    marginTop: 32,
    marginBottom: 16,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.3,
    lineHeight: 32,
    marginTop: 28,
    marginBottom: 14,
  },
  h3: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.2,
    lineHeight: 28,
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 17,
    lineHeight: 28,
    marginBottom: 20,
  },
  
  // Pull Quote
  pullQuote: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 24,
    paddingBottom: 24,
    borderLeftWidth: 4,
    borderRadius: 8,
    marginVertical: 24,
    position: 'relative',
  },
  quoteIcon: {
    position: 'absolute',
    top: 12,
    left: 12,
    opacity: 0.3,
  },
  pullQuoteText: {
    fontSize: 20,
    lineHeight: 32,
    fontWeight: '600',
    fontStyle: 'italic',
  },

  // Tip Box
  tipBox: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 20,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  tipText: {
    fontSize: 16,
    lineHeight: 24,
  },
  
  // Lists
  listContainer: {
    marginBottom: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 10,
    marginRight: 12,
  },
  listText: {
    flex: 1,
    fontSize: 17,
    lineHeight: 28,
  },

  // Category List View
  listContent: {
    padding: 20,
  },
  categoryDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  articleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  articleCardContent: {
    flex: 1,
    marginRight: 12,
  },
  articleCardTitle: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 24,
    marginBottom: 8,
  },
  articleCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  articleCardMetaText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
