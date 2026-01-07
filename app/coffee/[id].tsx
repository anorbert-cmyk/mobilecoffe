import { useState, useEffect, useRef } from "react";
import { ScrollView, Text, View, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { getCoffeeById, CoffeeRecipe } from "@/data/coffees";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

type TabType = 'recipe' | 'about' | 'tips';

export default function CoffeeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<TabType>('recipe');
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const coffee = getCoffeeById(id);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleTimerToggle = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    if (timerRunning) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setTimerRunning(false);
    } else {
      setTimerSeconds(0);
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
      setTimerRunning(true);
    }
  };

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTimerRunning(false);
    setTimerSeconds(0);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!coffee) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text style={{ color: colors.foreground }}>Coffee not found</Text>
      </ScreenContainer>
    );
  }

  const tabs: { key: TabType; label: string }[] = [
    { key: 'recipe', label: 'Recipe' },
    { key: 'about', label: 'About' },
    { key: 'tips', label: 'Tips' },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: coffee.name,
          headerBackTitle: "Back",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.primary,
          headerTitleStyle: { color: colors.foreground },
        }}
      />
      <ScreenContainer edges={["left", "right"]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Hero Image */}
          <View style={styles.heroContainer}>
            <Image
              source={coffee.image}
              style={styles.heroImage}
              contentFit="cover"
              transition={300}
            />
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={[styles.title, { color: colors.foreground }]}>
              {coffee.name}
            </Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>
              {coffee.subtitle}
            </Text>
            
            {/* Quick Info */}
            <View style={styles.quickInfo}>
              <View style={[styles.infoBadge, { backgroundColor: colors.surface }]}>
                <Text style={[styles.infoBadgeText, { color: colors.foreground }]}>
                  {coffee.difficulty}
                </Text>
              </View>
              <View style={[styles.infoBadge, { backgroundColor: colors.surface }]}>
                <Text style={[styles.infoBadgeText, { color: colors.foreground }]}>
                  {coffee.prepTime}
                </Text>
              </View>
              <View style={[styles.infoBadge, { backgroundColor: colors.surface }]}>
                <Text style={[styles.infoBadgeText, { color: colors.foreground }]}>
                  {coffee.ratio}
                </Text>
              </View>
            </View>
          </View>

          {/* Tabs */}
          <View style={[styles.tabContainer, { borderBottomColor: colors.border }]}>
            {tabs.map((tab) => (
              <Pressable
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={[
                  styles.tab,
                  activeTab === tab.key && { borderBottomColor: colors.primary, borderBottomWidth: 2 }
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: activeTab === tab.key ? colors.primary : colors.muted }
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Tab Content */}
          <View style={styles.content}>
            {activeTab === 'recipe' && (
              <View>
                {/* Recipe Details */}
                <View style={[styles.recipeCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <View style={styles.recipeRow}>
                    <Text style={[styles.recipeLabel, { color: colors.muted }]}>Input</Text>
                    <Text style={[styles.recipeValue, { color: colors.foreground }]}>
                      {coffee.inputGrams}g ground coffee
                    </Text>
                  </View>
                  
                  {coffee.outputGrams && (
                    <View style={styles.recipeRow}>
                      <Text style={[styles.recipeLabel, { color: colors.muted }]}>Output</Text>
                      <Text style={[styles.recipeValue, { color: colors.foreground }]}>
                        {coffee.outputGrams}g espresso
                      </Text>
                    </View>
                  )}
                  
                  {coffee.outputMl && (
                    <View style={styles.recipeRow}>
                      <Text style={[styles.recipeLabel, { color: colors.muted }]}>Output</Text>
                      <Text style={[styles.recipeValue, { color: colors.foreground }]}>
                        {coffee.outputMl}ml
                      </Text>
                    </View>
                  )}
                  
                  {coffee.extractionTime && (
                    <View style={styles.recipeRow}>
                      <Text style={[styles.recipeLabel, { color: colors.muted }]}>Time</Text>
                      <Text style={[styles.recipeValue, { color: colors.foreground }]}>
                        {coffee.extractionTime}
                      </Text>
                    </View>
                  )}
                  
                  {coffee.milkMl && (
                    <View style={styles.recipeRow}>
                      <Text style={[styles.recipeLabel, { color: colors.muted }]}>Milk</Text>
                      <Text style={[styles.recipeValue, { color: colors.foreground }]}>
                        {coffee.milkMl}ml steamed
                      </Text>
                    </View>
                  )}
                  
                  {coffee.waterMl && (
                    <View style={styles.recipeRow}>
                      <Text style={[styles.recipeLabel, { color: colors.muted }]}>Water</Text>
                      <Text style={[styles.recipeValue, { color: colors.foreground }]}>
                        {coffee.waterMl}ml hot water
                      </Text>
                    </View>
                  )}
                  
                  {coffee.temperature && (
                    <View style={styles.recipeRow}>
                      <Text style={[styles.recipeLabel, { color: colors.muted }]}>Temp</Text>
                      <Text style={[styles.recipeValue, { color: colors.foreground }]}>
                        {coffee.temperature}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Timer */}
                <View style={[styles.timerCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Text style={[styles.timerLabel, { color: colors.muted }]}>Extraction Timer</Text>
                  <Text style={[styles.timerDisplay, { color: colors.foreground }]}>
                    {formatTime(timerSeconds)}
                  </Text>
                  <View style={styles.timerButtons}>
                    <Pressable
                      onPress={handleTimerToggle}
                      style={[styles.timerButton, { backgroundColor: colors.primary }]}
                    >
                      <Text style={styles.timerButtonText}>
                        {timerRunning ? 'Stop' : 'Start'}
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={resetTimer}
                      style={[styles.timerButtonSecondary, { borderColor: colors.border }]}
                    >
                      <Text style={[styles.timerButtonSecondaryText, { color: colors.foreground }]}>
                        Reset
                      </Text>
                    </Pressable>
                  </View>
                </View>

                {/* Steps */}
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Steps</Text>
                {coffee.steps.map((step, index) => (
                  <View key={index} style={styles.stepRow}>
                    <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                      <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={[styles.stepText, { color: colors.foreground }]}>{step}</Text>
                  </View>
                ))}
              </View>
            )}

            {activeTab === 'about' && (
              <View>
                <Text style={[styles.description, { color: colors.foreground }]}>
                  {coffee.description}
                </Text>
                
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                  Flavor Profile
                </Text>
                <View style={styles.flavorTags}>
                  {coffee.flavorProfile.map((flavor, index) => (
                    <View key={index} style={[styles.flavorTag, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                      <Text style={[styles.flavorTagText, { color: colors.foreground }]}>{flavor}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {activeTab === 'tips' && (
              <View>
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Pro Tips</Text>
                {coffee.tips.map((tip, index) => (
                  <View key={index} style={[styles.tipCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.tipText, { color: colors.foreground }]}>{tip}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  heroContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f5f5f5',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  titleSection: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  quickInfo: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  infoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  infoBadgeText: {
    fontSize: 13,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  recipeCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  recipeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  recipeLabel: {
    fontSize: 15,
  },
  recipeValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  timerCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    marginBottom: 24,
    alignItems: 'center',
  },
  timerLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  timerDisplay: {
    fontSize: 48,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    marginBottom: 16,
  },
  timerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  timerButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  timerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  timerButtonSecondary: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
  },
  timerButtonSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 8,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  flavorTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  flavorTag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  flavorTagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tipCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  tipText: {
    fontSize: 15,
    lineHeight: 22,
  },
});
