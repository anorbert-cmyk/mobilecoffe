import { ScrollView, Text, View, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { learningCategories, LearningCategory } from "@/data/learning";

export default function LearnCoffeeScreen() {
  const router = useRouter();
  const colors = useColors();

  const handleCategoryPress = (category: LearningCategory) => {
    router.push(`/learn/${category.id}` as any);
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>Learn Coffee</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Master the art of coffee
        </Text>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {learningCategories.map((category) => (
          <Pressable
            key={category.id}
            onPress={() => handleCategoryPress(category)}
            style={({ pressed }) => [
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border },
              pressed && styles.cardPressed
            ]}
          >
            <View style={styles.cardIcon}>
              <Text style={styles.emoji}>{category.emoji}</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: colors.foreground }]}>
                {category.title}
              </Text>
              <Text style={[styles.cardDescription, { color: colors.muted }]} numberOfLines={2}>
                {category.description}
              </Text>
              <Text style={[styles.articleCount, { color: colors.primary }]}>
                {category.articles.length} {category.articles.length === 1 ? 'article' : 'articles'}
              </Text>
            </View>
          </Pressable>
        ))}
        
        {/* Quick Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Quick Tips
          </Text>
          
          <View style={[styles.tipCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.tipTitle, { color: colors.foreground }]}>
              💡 Fresh is Best
            </Text>
            <Text style={[styles.tipText, { color: colors.muted }]}>
              Use coffee beans within 2-4 weeks of roasting for optimal flavor. Store in an airtight container away from light.
            </Text>
          </View>
          
          <View style={[styles.tipCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.tipTitle, { color: colors.foreground }]}>
              🌡️ Water Temperature
            </Text>
            <Text style={[styles.tipText, { color: colors.muted }]}>
              Ideal brewing temperature is 90-96°C (195-205°F). Boiling water can scorch the grounds and create bitter flavors.
            </Text>
          </View>
          
          <View style={[styles.tipCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.tipTitle, { color: colors.foreground }]}>
              ⚖️ Measure Everything
            </Text>
            <Text style={[styles.tipText, { color: colors.muted }]}>
              Use a scale for consistent results. The standard ratio is 1:15 to 1:18 (coffee to water) for filter coffee.
            </Text>
          </View>
        </View>
      </ScrollView>
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
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(139, 69, 19, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  emoji: {
    fontSize: 28,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  articleCount: {
    fontSize: 13,
    fontWeight: '600',
  },
  tipsSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  tipCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
