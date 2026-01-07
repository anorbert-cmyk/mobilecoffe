import { View, Text, FlatList, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import Animated, { 
  FadeInDown,
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
} from 'react-native-reanimated';

import { ScreenContainer } from '@/components/screen-container';
import { PremiumCard } from '@/components/ui/premium-card';
import { useColors } from '@/hooks/use-colors';
import { coffeeRecipes, CoffeeRecipe } from '@/data/coffees';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48 - 12) / 2; // 20px padding each side + 12px gap

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function getDifficultyColor(difficulty: string, colors: any) {
  switch (difficulty) {
    case 'beginner':
      return colors.success;
    case 'intermediate':
      return colors.warning;
    case 'advanced':
      return colors.error;
    default:
      return colors.muted;
  }
}

// Separate component for coffee card to properly use hooks
function CoffeeCard({ item, index }: { item: CoffeeRecipe; index: number }) {
  const colors = useColors();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify()}
      style={[styles.cardWrapper, { width: CARD_WIDTH }]}
    >
      <AnimatedPressable
        onPress={() => router.push(`/coffee/${item.id}` as any)}
        onPressIn={() => { scale.value = withSpring(0.97); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        style={[animatedStyle]}
        accessibilityRole="button"
        accessibilityLabel={`${item.name}, ${item.subtitle}`}
      >
        <PremiumCard elevated>
          <View style={styles.imageContainer}>
            <Image
              source={item.image}
              style={styles.image}
              contentFit="cover"
              transition={300}
            />
            {/* Difficulty badge */}
            <View style={[
              styles.difficultyBadge,
              { backgroundColor: getDifficultyColor(item.difficulty, colors) }
            ]}>
              <Text style={styles.difficultyText}>
                {item.difficulty}
              </Text>
            </View>
          </View>
          <View style={styles.cardContent}>
            <Text 
              style={[styles.cardTitle, { color: colors.foreground }]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <Text 
              style={[styles.cardSubtitle, { color: colors.muted }]}
              numberOfLines={1}
            >
              {item.subtitle}
            </Text>
            {/* Quick info */}
            <View style={styles.quickInfo}>
              <View style={[styles.infoPill, { backgroundColor: colors.surfaceElevated }]}>
                <Text style={[styles.infoPillText, { color: colors.muted }]}>
                  {item.prepTime}
                </Text>
              </View>
              <View style={[styles.infoPill, { backgroundColor: colors.surfaceElevated }]}>
                <Text style={[styles.infoPillText, { color: colors.muted }]}>
                  {item.ratio}
                </Text>
              </View>
            </View>
          </View>
        </PremiumCard>
      </AnimatedPressable>
    </Animated.View>
  );
}

export default function MakeCoffeeScreen() {
  const colors = useColors();

  const renderCoffeeItem = ({ item, index }: { item: CoffeeRecipe; index: number }) => (
    <CoffeeCard item={item} index={index} />
  );

  return (
    <ScreenContainer>
      <FlatList
        data={coffeeRecipes}
        renderItem={renderCoffeeItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Animated.Text 
              entering={FadeInDown.delay(0).springify()}
              style={[styles.title, { color: colors.foreground }]}
              accessibilityRole="header"
            >
              Make Coffee
            </Animated.Text>
            <Animated.Text 
              entering={FadeInDown.delay(100).springify()}
              style={[styles.subtitle, { color: colors.muted }]}
            >
              Choose a drink to brew
            </Animated.Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 4,
    paddingTop: 8,
    paddingBottom: 20,
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
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardWrapper: {
    flex: 1,
    maxWidth: CARD_WIDTH,
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  difficultyBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  difficultyText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    marginBottom: 8,
  },
  quickInfo: {
    flexDirection: 'row',
    gap: 6,
  },
  infoPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  infoPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
