import { View, Text, Pressable, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image } from 'expo-image';
import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import * as Haptics from 'expo-haptics';
import { roasters, flavorCategories } from '@/data/beans';

export default function BeanWizardStep2() {
  const colors = useColors();
  const { choice } = useLocalSearchParams<{ choice: 'brand' | 'flavor' }>();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const isBrandMode = choice === 'brand';

  const toggleSelection = (item: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedItems(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const handleContinue = () => {
    if (selectedItems.length === 0) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const params = isBrandMode
      ? `roasters=${selectedItems.join(',')}`
      : `flavors=${selectedItems.join(',')}`;
    router.push(`/beans/results?${params}`);
  };

  return (
    <ScreenContainer>
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <IconSymbol name="chevron.left" size={28} color={colors.foreground} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          <View className="px-6">
            {/* Title */}
            <View className="mb-8">
              <Text className="text-3xl font-bold text-foreground mb-3">
                {isBrandMode ? 'Choose Your Roasters' : 'Pick Your Flavors'}
              </Text>
              <Text className="text-base text-muted leading-relaxed">
                {isBrandMode
                  ? 'Select one or more roasters you love. We\'ll show you their best beans.'
                  : 'Select flavor profiles that excite you. We\'ll match you with perfect beans.'}
              </Text>
              <Text className="text-sm text-primary mt-2">
                {selectedItems.length} selected
              </Text>
            </View>

            {/* Brand Mode: Roaster List */}
            {isBrandMode && (
              <View className="gap-3">
                {roasters.map((roaster) => {
                  const isSelected = selectedItems.includes(roaster);
                  return (
                    <Pressable
                      key={roaster}
                      onPress={() => toggleSelection(roaster)}
                      style={({ pressed }) => [
                        {
                          transform: [{ scale: pressed ? 0.98 : 1 }],
                          opacity: pressed ? 0.9 : 1
                        }
                      ]}
                    >
                      <View
                        className={`p-5 rounded-2xl border-2 flex-row items-center justify-between ${
                          isSelected
                            ? 'bg-primary/10 border-primary'
                            : 'bg-surface border-border'
                        }`}
                      >
                        <View className="flex-row items-center flex-1">
                          <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mr-4">
                            <Text className="text-2xl">☕</Text>
                          </View>
                          <Text className={`text-lg font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                            {roaster}
                          </Text>
                        </View>
                        {isSelected && (
                          <View className="w-8 h-8 rounded-full bg-primary items-center justify-center">
                            <Text className="text-white text-lg">✓</Text>
                          </View>
                        )}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}

            {/* Flavor Mode: Flavor Categories */}
            {!isBrandMode && (
              <View className="gap-4">
                {flavorCategories.map((category) => {
                  const isSelected = selectedItems.includes(category.id);
                  return (
                    <Pressable
                      key={category.id}
                      onPress={() => toggleSelection(category.id)}
                      style={({ pressed }) => [
                        {
                          transform: [{ scale: pressed ? 0.98 : 1 }],
                          opacity: pressed ? 0.9 : 1
                        }
                      ]}
                    >
                      <View
                        className={`rounded-3xl border-2 overflow-hidden ${
                          isSelected
                            ? 'border-primary'
                            : 'border-border'
                        }`}
                      >
                        {/* Image */}
                        <View className="h-32 overflow-hidden">
                          <Image
                            source={category.image}
                            style={{ width: '100%', height: '100%' }}
                            contentFit="cover"
                          />
                          {isSelected && (
                            <View className="absolute top-3 right-3 w-8 h-8 rounded-full bg-primary items-center justify-center">
                              <Text className="text-white text-lg">✓</Text>
                            </View>
                          )}
                        </View>
                        
                        {/* Content */}
                        <View className={`p-5 ${isSelected ? 'bg-primary/10' : 'bg-surface'}`}>
                          <View className="flex-row items-center mb-2">
                            <Text className="text-3xl mr-3">{category.icon}</Text>
                            <Text className={`text-xl font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                              {category.name}
                            </Text>
                          </View>
                          <Text className="text-sm text-muted mb-3">
                            {category.description}
                          </Text>
                          <View className="flex-row flex-wrap gap-2">
                            {category.flavorNotes.slice(0, 4).map((note) => (
                              <View key={note} className="px-3 py-1 rounded-full bg-background">
                                <Text className="text-xs text-muted">{note}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Fixed Bottom Button */}
        <View className="absolute bottom-0 left-0 right-0 p-6 bg-background border-t border-border">
          <Pressable
            onPress={handleContinue}
            disabled={selectedItems.length === 0}
            style={({ pressed }) => [
              {
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: selectedItems.length === 0 ? 0.5 : pressed ? 0.9 : 1
              }
            ]}
          >
            <View className="bg-primary rounded-full py-4 items-center">
              <Text className="text-background text-lg font-semibold">
                Show Me Beans ({selectedItems.length})
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
}
