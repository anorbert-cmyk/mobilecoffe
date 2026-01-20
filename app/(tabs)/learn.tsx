import { View, Text, FlatList, StyleSheet, Pressable, Dimensions, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring, interpolate, useAnimatedScrollHandler } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { learningCategories, LearningCategory } from '@/data/learning';
import { courses, Course } from '@/data/courses';

const { width } = Dimensions.get('window');
const SPACING = 20;
const ITEM_HEIGHT = 220;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Mapping categories to the generated assets
const categoryImages: Record<string, any> = {
  'brewing-basics': require('@/assets/images/learn_brewing.png'),
  'roast-levels': require('@/assets/images/learn_roasting.png'),
  'bean-origins': require('@/assets/images/learn_origins.png'), // Mapped from 'coffee-origins' equivalent in earlier mental model, checking data
  'equipment': require('@/assets/images/learn_equipment.png'),
  'home-setup': require('@/assets/images/learn_home.png'),
};

function LearningCard({ item, index }: { item: LearningCategory; index: number }) {
  const colors = useColors();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const imageSource = categoryImages[item.id] || categoryImages['brewing-basics']; // Fallback

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/learn/${item.id}` as any);
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify().damping(15)}
      style={{ marginBottom: 20 }}
    >
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={() => { scale.value = withSpring(0.97); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        style={[styles.cardContainer, animatedStyle]}
      >
        <Image
          source={imageSource}
          style={styles.cardInfoImage}
          contentFit="cover"
          transition={300}
        />

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)']}
          style={styles.cardGradient}
        />

        <View style={styles.cardContent}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.badgeContainer}>
              <BlurView intensity={30} style={styles.badgeBlur}>
                <Text style={styles.badgeText}>{item.articles.length} LESSONS</Text>
              </BlurView>
            </View>
            <BlurView intensity={30} style={styles.iconBadge}>
              <IconSymbol name="chevron.right" size={16} color="#FFF" />
            </BlurView>
          </View>

          <View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

export default function LearnCoffeeScreen() {
  const colors = useColors();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const heroImageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [-300, 0, 300],
            [-100, 0, 100] // Parallax effect
          ),
        },
        {
          scale: interpolate(
            scrollY.value,
            [-300, 0],
            [1.5, 1], // Zoom on pull down
            'clamp'
          )
        }
      ],
    };
  });

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <Animated.FlatList
        data={learningCategories}
        renderItem={({ item, index }) => <LearningCard item={item} index={index} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <View style={styles.heroContainer}>
              <Animated.Image
                source={require('@/assets/images/learn_hero.png')}
                style={[styles.heroImage, heroImageStyle]}
              />
              <LinearGradient
                colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.4)', colors.background]}
                style={styles.heroGradient}
                locations={[0, 0.6, 1]}
              />
              <View style={styles.heroContent}>
                <Animated.Text
                  entering={FadeInDown.delay(200).springify()}
                  style={styles.heroEyebrow}
                >
                  CRYSTAL ACADEMY
                </Animated.Text>
                <Animated.Text
                  entering={FadeInDown.delay(300).springify()}
                  style={styles.heroTitle}
                >
                  Master the Art of Coffee
                </Animated.Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <BlurView intensity={Platform.OS === 'ios' ? 20 : 0} style={[styles.statItem, { backgroundColor: Platform.OS === 'android' ? colors.surface : undefined }]}>
                <IconSymbol name="book.fill" size={20} color={colors.primary} />
                <View>
                  <Text style={[styles.statValue, { color: colors.foreground }]}>{learningCategories.length}</Text>
                  <Text style={[styles.statLabel, { color: colors.muted }]}>Courses</Text>
                </View>
              </BlurView>
              <BlurView intensity={Platform.OS === 'ios' ? 20 : 0} style={[styles.statItem, { backgroundColor: Platform.OS === 'android' ? colors.surface : undefined }]}>
                <IconSymbol name="doc.text.fill" size={20} color={colors.primary} />
                <View>
                  <Text style={[styles.statValue, { color: colors.foreground }]}>
                    {learningCategories.reduce((acc, cat) => acc + cat.articles.length, 0)}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.muted }]}>Articles</Text>
                </View>
              </BlurView>
              <BlurView intensity={Platform.OS === 'ios' ? 20 : 0} style={[styles.statItem, { backgroundColor: Platform.OS === 'android' ? colors.surface : undefined }]}>
                <IconSymbol name="clock.fill" size={20} color={colors.primary} />
                <View>
                  <Text style={[styles.statValue, { color: colors.foreground }]}>45m</Text>
                  <Text style={[styles.statLabel, { color: colors.muted }]}>Content</Text>
                </View>
              </BlurView>
            </View>

            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Video Courses</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: SPACING, gap: 16 }} style={{ marginBottom: 24 }}>
              {courses.map((course, idx) => (
                <Pressable
                  key={course.id}
                  onPress={() => {
                    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push(`/courses/${course.id}` as any);
                  }}
                  style={[styles.courseCard, { backgroundColor: colors.surface }]}
                >
                  <Image source={course.thumbnail} style={styles.courseThumbnail} contentFit="cover" />
                  <View style={styles.courseContent}>
                    <View style={[styles.levelBadge, { backgroundColor: course.level === 'beginner' ? '#4CAF50' : course.level === 'intermediate' ? '#FF9800' : '#F44336' }]}>
                      <Text style={styles.levelText}>{course.level.toUpperCase()}</Text>
                    </View>
                    <Text style={[styles.courseTitle, { color: colors.foreground }]} numberOfLines={2}>{course.title}</Text>
                    <Text style={[styles.courseSubtitle, { color: colors.muted }]} numberOfLines={1}>{course.subtitle}</Text>
                    <View style={styles.courseMetaRow}>
                      <IconSymbol name="play.circle.fill" size={14} color={colors.primary} />
                      <Text style={[styles.courseMeta, { color: colors.muted }]}>{course.totalDuration}min</Text>
                      <IconSymbol name="star.fill" size={14} color="#FFB800" />
                      <Text style={[styles.courseMeta, { color: colors.muted }]}>{course.rating}</Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </ScrollView>

            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Explore Articles</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 20,
  },
  heroContainer: {
    height: 400,
    width: '100%',
    overflow: 'hidden',
    marginBottom: -40, // overlap with stats
    justifyContent: 'flex-end',
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    padding: 24,
    paddingBottom: 80,
  },
  heroEyebrow: {
    color: '#D4A574', // Goldish
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroTitle: {
    color: '#FFF',
    fontSize: 42,
    fontWeight: '800',
    lineHeight: 48,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 30,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  cardContainer: {
    marginHorizontal: 20,
    height: ITEM_HEIGHT,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#000', // fallback
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  cardInfoImage: {
    ...StyleSheet.absoluteFillObject,
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badgeContainer: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  badgeBlur: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  cardDescription: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
    lineHeight: 20,
  },
  courseCard: {
    width: 200,
    borderRadius: 16,
    overflow: 'hidden',
  },
  courseThumbnail: {
    width: '100%',
    height: 110,
  },
  courseContent: {
    padding: 12,
    gap: 4,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 4,
  },
  levelText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '700',
  },
  courseTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  courseSubtitle: {
    fontSize: 12,
  },
  courseMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  courseMeta: {
    fontSize: 11,
    marginRight: 8,
  },
});
