import { useState } from "react";
import { ScrollView, Text, View, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { getCategoryById, Article } from "@/data/learning";
import { useColors } from "@/hooks/use-colors";

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
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: selectedArticle.title,
            headerBackTitle: "Back",
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.primary,
            headerTitleStyle: { color: colors.foreground },
          }}
        />
        <ScreenContainer edges={["left", "right"]}>
          <ScrollView 
            contentContainerStyle={styles.articleContent}
            showsVerticalScrollIndicator={false}
          >
            <Pressable
              onPress={() => setSelectedArticle(null)}
              style={[styles.backButton, { backgroundColor: colors.surface }]}
            >
              <Text style={[styles.backButtonText, { color: colors.primary }]}>
                ← Back to {category.title}
              </Text>
            </Pressable>
            
            <Text style={[styles.articleTitle, { color: colors.foreground }]}>
              {selectedArticle.title}
            </Text>
            
            {/* Render markdown-like content */}
            {selectedArticle.content.split('\n\n').map((paragraph, index) => {
              // Handle headers
              if (paragraph.startsWith('# ')) {
                return (
                  <Text key={index} style={[styles.h1, { color: colors.foreground }]}>
                    {paragraph.replace('# ', '')}
                  </Text>
                );
              }
              if (paragraph.startsWith('## ')) {
                return (
                  <Text key={index} style={[styles.h2, { color: colors.foreground }]}>
                    {paragraph.replace('## ', '')}
                  </Text>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <Text key={index} style={[styles.h3, { color: colors.foreground }]}>
                    {paragraph.replace('### ', '')}
                  </Text>
                );
              }
              
              // Handle lists
              if (paragraph.includes('\n- ')) {
                const lines = paragraph.split('\n');
                return (
                  <View key={index} style={styles.listContainer}>
                    {lines.map((line, lineIndex) => {
                      if (line.startsWith('- ')) {
                        return (
                          <View key={lineIndex} style={styles.listItem}>
                            <Text style={[styles.bullet, { color: colors.primary }]}>•</Text>
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
                  </View>
                );
              }
              
              // Handle tables (simplified)
              if (paragraph.includes('|')) {
                const rows = paragraph.split('\n').filter(row => row.includes('|') && !row.includes('---'));
                return (
                  <View key={index} style={[styles.table, { borderColor: colors.border }]}>
                    {rows.map((row, rowIndex) => {
                      const cells = row.split('|').filter(cell => cell.trim());
                      return (
                        <View 
                          key={rowIndex} 
                          style={[
                            styles.tableRow, 
                            { borderBottomColor: colors.border },
                            rowIndex === 0 && { backgroundColor: colors.surface }
                          ]}
                        >
                          {cells.map((cell, cellIndex) => (
                            <Text 
                              key={cellIndex} 
                              style={[
                                styles.tableCell, 
                                { color: colors.foreground },
                                rowIndex === 0 && styles.tableHeader
                              ]}
                            >
                              {cell.trim()}
                            </Text>
                          ))}
                        </View>
                      );
                    })}
                  </View>
                );
              }
              
              // Regular paragraph
              if (paragraph.trim()) {
                // Remove bold markers for display
                const cleanText = paragraph.replace(/\*\*(.*?)\*\*/g, '$1');
                return (
                  <Text key={index} style={[styles.paragraph, { color: colors.foreground }]}>
                    {cleanText}
                  </Text>
                );
              }
              
              return null;
            })}
          </ScrollView>
        </ScreenContainer>
      </>
    );
  }

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
      <ScreenContainer edges={["left", "right"]}>
        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryEmoji}>{category.emoji}</Text>
            <Text style={[styles.categoryTitle, { color: colors.foreground }]}>
              {category.title}
            </Text>
            <Text style={[styles.categoryDescription, { color: colors.muted }]}>
              {category.description}
            </Text>
          </View>
          
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Articles
          </Text>
          
          {category.articles.map((article, index) => (
            <Pressable
              key={article.id}
              onPress={() => setSelectedArticle(article)}
              style={({ pressed }) => [
                styles.articleCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
                pressed && styles.articleCardPressed
              ]}
            >
              <View style={[styles.articleNumber, { backgroundColor: colors.primary }]}>
                <Text style={styles.articleNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.articleInfo}>
                <Text style={[styles.articleCardTitle, { color: colors.foreground }]}>
                  {article.title}
                </Text>
                <Text style={[styles.readTime, { color: colors.muted }]}>
                  {Math.ceil(article.content.split(' ').length / 200)} min read
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  categoryHeader: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 16,
  },
  categoryEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  categoryDescription: {
    fontSize: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  articleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  articleCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  articleNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  articleNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  articleInfo: {
    flex: 1,
  },
  articleCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  readTime: {
    fontSize: 13,
  },
  // Article view styles
  articleContent: {
    padding: 16,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  articleTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    lineHeight: 36,
  },
  h1: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 16,
  },
  h2: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 12,
  },
  h3: {
    fontSize: 17,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 16,
  },
  listContainer: {
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  listText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  table: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tableCell: {
    flex: 1,
    padding: 12,
    fontSize: 14,
  },
  tableHeader: {
    fontWeight: '600',
  },
});
