import { View, Text, Pressable, ScrollView, Linking } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { ScreenContainer } from '@/components/screen-container';
import { Breadcrumb } from '@/components/breadcrumb';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import * as Haptics from 'expo-haptics';
import { coffeeBeans } from '@/data/beans';

export default function BeanDetail() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const bean = coffeeBeans.find(b => b.id === id);

  if (!bean) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-2xl font-bold text-foreground mb-2">Bean not found</Text>
          <Pressable onPress={() => router.back()}>
            <Text className="text-primary">Go back</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  const handlePurchase = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(bean.affiliateUrl);
  };

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <View className="flex-1">
        {/* Header with back button */}
        <View className="absolute top-12 left-6 z-10">
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <View className="w-10 h-10 rounded-full bg-background/80 items-center justify-center">
              <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
            </View>
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Breadcrumb items={[
            { label: 'Home', href: '/' },
            { label: 'Beans', href: '/beans/wizard-step1' },
            { label: bean.name }
          ]} />
          {/* Hero Image */}
          <View className="h-80 overflow-hidden bg-background">
            <Image
              source={bean.image}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
          </View>

          {/* Content */}
          <View className="p-6">
            {/* Roaster */}
            <Text className="text-base text-primary font-semibold mb-2">
              {bean.roaster}
            </Text>

            {/* Name */}
            <Text className="text-4xl font-bold text-foreground mb-3">
              {bean.name}
            </Text>

            {/* Origin */}
            <Text className="text-lg text-muted mb-6">
              {bean.origin}{bean.region ? ` • ${bean.region}` : ''} • {bean.process} • {bean.roastLevel}
            </Text>

            {/* Rating & Price */}
            <View className="flex-row items-center justify-between mb-8 pb-6 border-b border-border">
              <View className="flex-row items-center">
                <Text className="text-warning text-2xl mr-2">★</Text>
                <Text className="text-2xl font-bold text-foreground">
                  {bean.rating}
                </Text>
                <Text className="text-base text-muted ml-2">
                  ({bean.reviewCount} reviews)
                </Text>
              </View>
              <View>
                <Text className="text-3xl font-bold text-foreground">
                  ${bean.price}
                </Text>
                <Text className="text-sm text-muted text-right">
                  per {bean.weight}g
                </Text>
              </View>
            </View>

            {/* Description */}
            <View className="mb-8">
              <Text className="text-xl font-bold text-foreground mb-3">
                About This Coffee
              </Text>
              <Text className="text-base text-foreground leading-relaxed">
                {bean.description}
              </Text>
            </View>

            {/* Flavor Notes */}
            <View className="mb-8">
              <Text className="text-xl font-bold text-foreground mb-3">
                Flavor Notes
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {bean.flavorNotes.map((note) => (
                  <View key={note} className="px-4 py-2 rounded-full bg-surface border border-border">
                    <Text className="text-base text-foreground capitalize">{note}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Taste Profile */}
            <View className="mb-8">
              <Text className="text-xl font-bold text-foreground mb-4">
                Taste Profile
              </Text>
              {Object.entries(bean.tasteProfile).map(([key, value]) => (
                <View key={key} className="mb-4">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-base text-foreground capitalize">{key}</Text>
                    <Text className="text-base text-muted">{value}/10</Text>
                  </View>
                  <View className="h-2 bg-surface rounded-full overflow-hidden">
                    <View
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(value / 10) * 100}%` }}
                    />
                  </View>
                </View>
              ))}
            </View>

            {/* Brew Methods */}
            <View className="mb-8">
              <Text className="text-xl font-bold text-foreground mb-3">
                Recommended Brew Methods
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {bean.brewMethods.map((method) => (
                  <View key={method} className="px-4 py-2 rounded-full bg-primary/10 border border-primary">
                    <Text className="text-base text-primary capitalize">
                      {method.replace('-', ' ')}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Stock Status */}
            {!bean.inStock && (
              <View className="mb-6 p-4 bg-error/10 rounded-2xl border border-error">
                <Text className="text-base text-error text-center font-semibold">
                  Currently Out of Stock
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Fixed Bottom Purchase Button */}
        <View className="p-6 bg-background border-t border-border">
          <Pressable
            onPress={handlePurchase}
            disabled={!bean.inStock}
            style={({ pressed }) => [
              {
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: !bean.inStock ? 0.5 : pressed ? 0.9 : 1
              }
            ]}
          >
            <View className="bg-primary rounded-full py-4 items-center">
              <Text className="text-background text-lg font-semibold">
                {bean.inStock ? 'Buy Now' : 'Out of Stock'}
              </Text>
            </View>
          </Pressable>
          <Text className="text-xs text-muted text-center mt-3">
            You'll be redirected to {bean.roaster}'s website
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}
