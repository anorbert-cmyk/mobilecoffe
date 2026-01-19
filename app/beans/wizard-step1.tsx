import { View, Text, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { Breadcrumb } from '@/components/breadcrumb';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import * as Haptics from 'expo-haptics';

export default function BeanWizardStep1() {
  const colors = useColors();

  const handleChoice = (choice: 'brand' | 'flavor') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/beans/wizard-step2?choice=${choice}`);
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Find Beans' }
        ]} />
        <View className="flex-1 p-6">
          {/* Header */}
          <View className="mb-8">
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

          {/* Title */}
          <View className="mb-12">
            <Text className="text-3xl font-bold text-foreground mb-3">
              Find Your Perfect Beans
            </Text>
            <Text className="text-base text-muted leading-relaxed">
              Let&apos;s discover specialty coffee beans that match your taste. How do you prefer to choose your coffee?
            </Text>
          </View>

          {/* Choices */}
          <View className="gap-4 flex-1">
            {/* Brand Choice */}
            <Pressable
              onPress={() => handleChoice('brand')}
              style={({ pressed }) => [
                {
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                  opacity: pressed ? 0.9 : 1
                }
              ]}
            >
              <View className="bg-surface rounded-3xl p-6 border border-border">
                <View className="flex-row items-center mb-4">
                  <View className="w-14 h-14 rounded-full bg-primary/10 items-center justify-center mr-4">
                    <Text className="text-3xl">☕</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-xl font-bold text-foreground mb-1">
                      By Favorite Roasters
                    </Text>
                    <Text className="text-sm text-muted">
                      I have brands I trust
                    </Text>
                  </View>
                  <IconSymbol name="chevron.right" size={24} color={colors.muted} />
                </View>
                <Text className="text-sm text-muted leading-relaxed">
                  Choose from your favorite coffee roasters like Blue Bottle, Intelligentsia, Counter Culture, and more.
                </Text>
              </View>
            </Pressable>

            {/* Flavor Choice */}
            <Pressable
              onPress={() => handleChoice('flavor')}
              style={({ pressed }) => [
                {
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                  opacity: pressed ? 0.9 : 1
                }
              ]}
            >
              <View className="bg-surface rounded-3xl p-6 border border-border">
                <View className="flex-row items-center mb-4">
                  <View className="w-14 h-14 rounded-full bg-primary/10 items-center justify-center mr-4">
                    <Text className="text-3xl">🎨</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-xl font-bold text-foreground mb-1">
                      By Flavor Profile
                    </Text>
                    <Text className="text-sm text-muted">
                      I explore by taste
                    </Text>
                  </View>
                  <IconSymbol name="chevron.right" size={24} color={colors.muted} />
                </View>
                <Text className="text-sm text-muted leading-relaxed">
                  Discover beans based on flavor notes you love: fruity, chocolatey, floral, earthy, or sweet.
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Info */}
          <View className="mt-8 p-4 bg-primary/5 rounded-2xl">
            <Text className="text-sm text-muted text-center leading-relaxed">
              💡 Don&apos;t worry, you can always browse all beans later
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
