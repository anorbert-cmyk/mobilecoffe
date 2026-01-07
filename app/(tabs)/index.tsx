import { FlatList, Text, View, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { coffeeRecipes, CoffeeRecipe } from "@/data/coffees";
import { useColors } from "@/hooks/use-colors";

export default function MakeCoffeeScreen() {
  const router = useRouter();
  const colors = useColors();

  const handleCoffeePress = (coffee: CoffeeRecipe) => {
    router.push({ pathname: '/coffee/[id]', params: { id: coffee.id } });
  };

  const renderCoffeeCard = ({ item }: { item: CoffeeRecipe }) => (
    <Pressable
      onPress={() => handleCoffeePress(item)}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && styles.cardPressed
      ]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={item.image}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: colors.foreground }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.cardSubtitle, { color: colors.muted }]} numberOfLines={1}>
          {item.subtitle}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>Make Coffee</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Choose a drink to brew
        </Text>
      </View>
      
      <FlatList
        data={coffeeRecipes}
        renderItem={renderCoffeeCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
});
