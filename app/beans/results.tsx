import { useState, useMemo } from 'react';
import { View, Text, Pressable, ScrollView, FlatList } from 'react-native';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { FavoriteButton } from '@/components/favorite-button';
import { useColors } from '@/hooks/use-colors';
import { coffeeBeans, flavorCategories, type CoffeeBean } from '@/data/beans';

export default function BeanResults() {
  const colors = useColors();
  const { roasters, flavors } = useLocalSearchParams<{ roasters?: string; flavors?: string }>();
  
  const [sortBy, setSortBy] = useState<'match' | 'price' | 'rating'>('match');

  // Filter beans based on wizard results
  const filteredBeans = useMemo(() => {
    let beans = [...coffeeBeans];

    if (roasters) {
      const roasterList = roasters.split(',');
      beans = beans.filter(bean => roasterList.includes(bean.roaster));
    }

    if (flavors) {
      const flavorList = flavors.split(',');
      const flavorNotes = flavorCategories
        .filter(cat => flavorList.includes(cat.id))
        .flatMap(cat => cat.flavorNotes);
      
      beans = beans.filter(bean =>
        bean.flavorNotes.some(note =>
          flavorNotes.some(fn => note.toLowerCase().includes(fn.toLowerCase()))
        )
      );
    }

    // Sort
    if (sortBy === 'price') {
      beans.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'rating') {
      beans.sort((a, b) => b.rating - a.rating);
    }

    return beans;
  }, [roasters, flavors, sortBy]);

  const renderBeanCard = ({ item: bean }: { item: CoffeeBean }) => (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(`/beans/${bean.id}`);
      }}
      style={({ pressed }) => [
        {
          transform: [{ scale: pressed ? 0.98 : 1 }],
          opacity: pressed ? 0.9 : 1
        }
      ]}
    >
      <View className="bg-surface rounded-3xl overflow-hidden border border-border mb-4">
        {/* Image */}
        <View className="h-48 overflow-hidden bg-background">
          <Image
            source={bean.image}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
          <View className="absolute top-3 right-3">
            <FavoriteButton id={bean.id} type="bean" size={24} />
          </View>
          {!bean.inStock && (
            <View className="absolute top-3 left-3 px-3 py-1 rounded-full bg-error">
              <Text className="text-white text-xs font-semibold">Out of Stock</Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View className="p-5">
          {/* Roaster & Origin */}
          <Text className="text-sm text-primary font-semibold mb-1">
            {bean.roaster}
          </Text>
          <Text className="text-xl font-bold text-foreground mb-2">
            {bean.name}
          </Text>
          <Text className="text-sm text-muted mb-3">
            {bean.origin}{bean.region ? ` • ${bean.region}` : ''}
          </Text>

          {/* Flavor Notes */}
          <View className="flex-row flex-wrap gap-2 mb-4">
            {bean.flavorNotes.slice(0, 3).map((note) => (
              <View key={note} className="px-3 py-1 rounded-full bg-background">
                <Text className="text-xs text-muted">{note}</Text>
              </View>
            ))}
          </View>

          {/* Rating & Price */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-warning text-base mr-1">★</Text>
              <Text className="text-base font-semibold text-foreground">
                {bean.rating}
              </Text>
              <Text className="text-sm text-muted ml-1">
                ({bean.reviewCount})
              </Text>
            </View>
            <Text className="text-xl font-bold text-foreground">
              ${bean.price}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer>
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4 flex-row items-center justify-between">
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <IconSymbol name="chevron.left" size={28} color={colors.foreground} />
          </Pressable>

          {/* Sort Menu */}
          <View className="flex-row gap-2">
            {(['match', 'price', 'rating'] as const).map((sort) => (
              <Pressable
                key={sort}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSortBy(sort);
                }}
                style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
              >
                <View
                  className={`px-4 py-2 rounded-full ${
                    sortBy === sort ? 'bg-primary' : 'bg-surface'
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold capitalize ${
                      sortBy === sort ? 'text-background' : 'text-foreground'
                    }`}
                  >
                    {sort}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Title */}
        <View className="px-6 mb-6">
          <Text className="text-3xl font-bold text-foreground mb-2">
            Your Perfect Beans
          </Text>
          <Text className="text-base text-muted">
            {filteredBeans.length} beans matched your preferences
          </Text>
        </View>

        {/* Bean List */}
        <FlatList
          data={filteredBeans}
          renderItem={renderBeanCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center justify-center py-12">
              <Text className="text-6xl mb-4">☕</Text>
              <Text className="text-xl font-bold text-foreground mb-2">
                No beans found
              </Text>
              <Text className="text-base text-muted text-center">
                Try adjusting your filters or explore all beans
              </Text>
            </View>
          }
        />
      </View>
    </ScreenContainer>
  );
}
