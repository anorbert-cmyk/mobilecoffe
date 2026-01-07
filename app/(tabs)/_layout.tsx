import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, View, Platform } from "react-native";
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  useSharedValue,
} from "react-native-reanimated";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 16 : Math.max(insets.bottom, 12);
  const tabBarHeight = 64 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarStyle: {
          paddingTop: 10,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          // iOS 26 inspired subtle shadow
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Make",
          tabBarIcon: ({ color, focused }) => (
            <View style={focused && styles.activeIconContainer}>
              <IconSymbol size={26} name="cup.and.saucer.fill" color={color} />
            </View>
          ),
          tabBarAccessibilityLabel: "Make coffee recipes",
        }}
      />
      <Tabs.Screen
        name="find"
        options={{
          title: "Find",
          tabBarIcon: ({ color, focused }) => (
            <View style={focused && styles.activeIconContainer}>
              <IconSymbol size={26} name="location.fill" color={color} />
            </View>
          ),
          tabBarAccessibilityLabel: "Find nearby cafes",
        }}
      />
      <Tabs.Screen
        name="machines"
        options={{
          title: "Setup",
          tabBarIcon: ({ color, focused }) => (
            <View style={focused && styles.activeIconContainer}>
              <IconSymbol size={26} name="gearshape.fill" color={color} />
            </View>
          ),
          tabBarAccessibilityLabel: "Machine and grinder settings",
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: "Learn",
          tabBarIcon: ({ color, focused }) => (
            <View style={focused && styles.activeIconContainer}>
              <IconSymbol size={26} name="book.fill" color={color} />
            </View>
          ),
          tabBarAccessibilityLabel: "Learn about coffee",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeIconContainer: {
    // Subtle scale effect for active tab
    transform: [{ scale: 1.05 }],
  },
});
