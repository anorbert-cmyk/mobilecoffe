import { useState, useEffect, useRef } from "react";
import { ScrollView, Text, View, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, Stack } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";

import { ScreenContainer } from "@/components/screen-container";
import { PremiumCard } from "@/components/ui/premium-card";
import { PremiumButton } from "@/components/ui/premium-button";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getCoffeeById } from "@/data/coffees";
import { useColors } from "@/hooks/use-colors";

type TabType = 'recipe' | 'about' | 'tips';

export default function CoffeeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return colors.success;
      case 'intermediate': return colors.warning;
      case 'advanced': return colors.error;
      default: return colors.muted;
    }
  };

  if (!coffee) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text style={{ color: colors.foreground }}>Coffee not found</Text>
      </ScreenContainer>
    );
  }

  const tabs: { key: TabType; label: string; icon: string }[] = [
    { key: 'recipe', label: 'Recipe', icon: 'list.bullet' },
    { key: 'about', label: 'About', icon: 'info.circle.fill' },
    { key: 'tips', label: 'Tips', icon: 'lightbulb.fill' },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "",
          headerBackTitle: "Back",
          headerTransparent: true,
          headerStyle: { backgroundColor: 'transparent' },
          headerTintColor: colors.primary,
        }}
      />
      <ScreenContainer edges={["left", "right"]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Hero Image */}
          <Animated.View entering={FadeIn.duration(400)}>
            <View style={styles.heroContainer}>
              <Image
                source={coffee.image}
                style={styles.heroImage}
                contentFit="cover"
                transition={300}
              />
              {/* Gradient overlay */}
              <View style={styles.heroGradient} />
            </View>
          </Animated.View>

          {/* Title Section */}
          <Animated.View 
            entering={FadeInDown.delay(100).springify()}
            style={styles.titleSection}
          >
            <View style={styles.titleRow}>
              <View style={styles.titleContent}>
                <Text 
                  style={[styles.title, { color: colors.foreground }]}
                  accessibilityRole="header"
                >
                  {coffee.name}
                </Text>
                <Text style={[styles.subtitle, { color: colors.muted }]}>
                  {coffee.subtitle}
                </Text>
              </View>
            </View>
            
            {/* Quick Info Pills */}
            <View style={styles.quickInfo}>
              <View style={[
                styles.difficultyPill, 
                { backgroundColor: `${getDifficultyColor(coffee.difficulty)}20` }
              ]}>
                <View style={[
                  styles.difficultyDot,
                  { backgroundColor: getDifficultyColor(coffee.difficulty) }
                ]} />
                <Text style={[
                  styles.difficultyText, 
                  { color: getDifficultyColor(coffee.difficulty) }
                ]}>
                  {coffee.difficulty}
                </Text>
              </View>
              <View style={[styles.infoPill, { backgroundColor: colors.surfaceElevated }]}>
                <IconSymbol name="clock.fill" size={14} color={colors.muted} />
                <Text style={[styles.infoPillText, { color: colors.foreground }]}>
                  {coffee.prepTime}
                </Text>
              </View>
              <View style={[styles.infoPill, { backgroundColor: colors.surfaceElevated }]}>
                <IconSymbol name="gauge" size={14} color={colors.muted} />
                <Text style={[styles.infoPillText, { color: colors.foreground }]}>
                  {coffee.ratio}
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Tabs */}
          <Animated.View 
            entering={FadeInDown.delay(200).springify()}
            style={[styles.tabContainer, { backgroundColor: colors.surface }]}
          >
            {tabs.map((tab) => (
              <Pressable
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={[
                  styles.tab,
                  activeTab === tab.key && { backgroundColor: colors.primary }
                ]}
                accessibilityRole="tab"
                accessibilityState={{ selected: activeTab === tab.key }}
              >
                <IconSymbol 
                  name={tab.icon as any} 
                  size={16} 
                  color={activeTab === tab.key ? '#FFFFFF' : colors.muted} 
                />
                <Text style={[
                  styles.tabText,
                  { color: activeTab === tab.key ? '#FFFFFF' : colors.muted }
                ]}>
                  {tab.label}
                </Text>
              </Pressable>
            ))}
          </Animated.View>

          {/* Tab Content */}
          <Animated.View 
            entering={FadeInDown.delay(300).springify()}
            style={styles.content}
          >
            {activeTab === 'recipe' && (
              <View>
                {/* Recipe Details Card */}
                <PremiumCard style={styles.recipeCard} elevated>
                  <Text style={[styles.cardTitle, { color: colors.foreground }]}>
                    Parameters
                  </Text>
                  
                  <View style={styles.recipeGrid}>
                    <View style={[styles.recipeItem, { backgroundColor: colors.surfaceElevated }]}>
                      <Text style={[styles.recipeLabel, { color: colors.muted }]}>Input</Text>
                      <Text style={[styles.recipeValue, { color: colors.foreground }]}>
                        {coffee.inputGrams}g
                      </Text>
                    </View>
                    
                    {coffee.outputGrams && (
                      <View style={[styles.recipeItem, { backgroundColor: colors.surfaceElevated }]}>
                        <Text style={[styles.recipeLabel, { color: colors.muted }]}>Output</Text>
                        <Text style={[styles.recipeValue, { color: colors.foreground }]}>
                          {coffee.outputGrams}g
                        </Text>
                      </View>
                    )}
                    
                    {coffee.outputMl && (
                      <View style={[styles.recipeItem, { backgroundColor: colors.surfaceElevated }]}>
                        <Text style={[styles.recipeLabel, { color: colors.muted }]}>Output</Text>
                        <Text style={[styles.recipeValue, { color: colors.foreground }]}>
                          {coffee.outputMl}ml
                        </Text>
                      </View>
                    )}
                    
                    {coffee.extractionTime && (
                      <View style={[styles.recipeItem, { backgroundColor: colors.surfaceElevated }]}>
                        <Text style={[styles.recipeLabel, { color: colors.muted }]}>Time</Text>
                        <Text style={[styles.recipeValue, { color: colors.foreground }]}>
                          {coffee.extractionTime}
                        </Text>
                      </View>
                    )}
                    
                    {coffee.milkMl && (
                      <View style={[styles.recipeItem, { backgroundColor: colors.surfaceElevated }]}>
                        <Text style={[styles.recipeLabel, { color: colors.muted }]}>Milk</Text>
                        <Text style={[styles.recipeValue, { color: colors.foreground }]}>
                          {coffee.milkMl}ml
                        </Text>
                      </View>
                    )}
                    
                    {coffee.waterMl && (
                      <View style={[styles.recipeItem, { backgroundColor: colors.surfaceElevated }]}>
                        <Text style={[styles.recipeLabel, { color: colors.muted }]}>Water</Text>
                        <Text style={[styles.recipeValue, { color: colors.foreground }]}>
                          {coffee.waterMl}ml
                        </Text>
                      </View>
                    )}
                    
                    {coffee.temperature && (
                      <View style={[styles.recipeItem, { backgroundColor: colors.surfaceElevated }]}>
                        <Text style={[styles.recipeLabel, { color: colors.muted }]}>Temp</Text>
                        <Text style={[styles.recipeValue, { color: colors.foreground }]}>
                          {coffee.temperature}
                        </Text>
                      </View>
                    )}
                  </View>
                </PremiumCard>

                {/* Timer Card */}
                <PremiumCard style={styles.timerCard} elevated>
                  <Text style={[styles.cardTitle, { color: colors.foreground }]}>
                    Extraction Timer
                  </Text>
                  <View style={[styles.timerDisplay, { backgroundColor: colors.surfaceElevated }]}>
                    <Text style={[styles.timerText, { color: colors.foreground }]}>
                      {formatTime(timerSeconds)}
                    </Text>
                  </View>
                  <View style={styles.timerButtons}>
                    <PremiumButton
                      variant={timerRunning ? "outline" : "primary"}
                      size="md"
                      onPress={handleTimerToggle}
                      accessibilityLabel={timerRunning ? "Stop timer" : "Start timer"}
                    >
                      {timerRunning ? 'Stop' : 'Start'}
                    </PremiumButton>
                    <PremiumButton
                      variant="ghost"
                      size="md"
                      onPress={resetTimer}
                      accessibilityLabel="Reset timer"
                    >
                      Reset
                    </PremiumButton>
                  </View>
                </PremiumCard>

                {/* Steps */}
                <PremiumCard style={styles.stepsCard} elevated>
                  <Text style={[styles.cardTitle, { color: colors.foreground }]}>
                    Steps
                  </Text>
                  {coffee.steps.map((step, index) => (
                    <View key={index} style={styles.stepRow}>
                      <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                        <Text style={styles.stepNumberText}>{index + 1}</Text>
                      </View>
                      <Text style={[styles.stepText, { color: colors.foreground }]}>
                        {step}
                      </Text>
                    </View>
                  ))}
                </PremiumCard>
              </View>
            )}

            {activeTab === 'about' && (
              <View>
                <PremiumCard style={styles.aboutCard} elevated>
                  <Text style={[styles.description, { color: colors.foreground }]}>
                    {coffee.description}
                  </Text>
                </PremiumCard>
                
                <PremiumCard style={styles.flavorCard} elevated>
                  <Text style={[styles.cardTitle, { color: colors.foreground }]}>
                    Flavor Profile
                  </Text>
                  <View style={styles.flavorTags}>
                    {coffee.flavorProfile.map((flavor, index) => (
                      <View 
                        key={index} 
                        style={[styles.flavorTag, { backgroundColor: `${colors.primary}15` }]}
                      >
                        <Text style={[styles.flavorTagText, { color: colors.primary }]}>
                          {flavor}
                        </Text>
                      </View>
                    ))}
                  </View>
                </PremiumCard>
              </View>
            )}

            {activeTab === 'tips' && (
              <View>
                {coffee.tips.map((tip, index) => (
                  <PremiumCard key={index} style={styles.tipCard} elevated>
                    <View style={styles.tipContent}>
                      <View style={[styles.tipIcon, { backgroundColor: `${colors.warning}15` }]}>
                        <IconSymbol name="lightbulb.fill" size={20} color={colors.warning} />
                      </View>
                      <Text style={[styles.tipText, { color: colors.foreground }]}>
                        {tip}
                      </Text>
                    </View>
                  </PremiumCard>
                ))}
              </View>
            )}
          </Animated.View>
        </ScrollView>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  heroContainer: {
    height: 300,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'transparent',
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContent: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 22,
  },
  quickInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  difficultyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  difficultyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  infoPillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    padding: 4,
    borderRadius: 14,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  recipeCard: {
    padding: 16,
    marginBottom: 16,
  },
  recipeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  recipeItem: {
    minWidth: '30%',
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  recipeLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  recipeValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  timerCard: {
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  timerDisplay: {
    width: '100%',
    paddingVertical: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  timerText: {
    fontSize: 48,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  timerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  stepsCard: {
    padding: 16,
    marginBottom: 16,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  aboutCard: {
    padding: 16,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  flavorCard: {
    padding: 16,
    marginBottom: 16,
  },
  flavorTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  flavorTag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  flavorTagText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tipCard: {
    padding: 16,
    marginBottom: 12,
  },
  tipContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
});
