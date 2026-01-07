import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, View, Platform } from "react-native";
import { BlurView } from "expo-blur";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  
  // iOS 26 HIG: Tab bar height is 49pt + safe area
  const bottomPadding = Platform.OS === "web" ? 16 : Math.max(insets.bottom, 8);
  const tabBarHeight = 49 + bottomPadding;

  // iOS 26 Liquid Glass effect - blur intensity based on theme
  const blurIntensity = colorScheme === 'dark' ? 80 : 60;
  const blurTint = colorScheme === 'dark' ? 'dark' : 'light';

  return (
    <Tabs
      screenOptions={{
        // iOS 26 HIG: Use system tint color for active state
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        headerShown: false,
        tabBarButton: HapticTab,
        
        // iOS 26 HIG: SF Pro Text Medium, 10pt for labels
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          marginTop: 0,
          marginBottom: Platform.OS === 'ios' ? 0 : 2,
        },
        
        // iOS 26 HIG: Icon size is 25x25pt for tab bar
        tabBarIconStyle: {
          marginTop: Platform.OS === 'ios' ? 0 : 4,
        },
        
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingTop: 8,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          // Transparent background for blur effect
          backgroundColor: Platform.OS === 'web' 
            ? `${colors.background}F2` // 95% opacity fallback for web
            : 'transparent',
          borderTopWidth: 0,
          // iOS 26 subtle top border
          borderTopColor: colorScheme === 'dark' 
            ? 'rgba(255,255,255,0.1)' 
            : 'rgba(0,0,0,0.1)',
          elevation: 0,
        },
        
        // iOS 26 Liquid Glass background
        tabBarBackground: () => (
          Platform.OS !== 'web' ? (
            <BlurView
              intensity={blurIntensity}
              tint={blurTint}
              style={StyleSheet.absoluteFill}
            >
              {/* Subtle gradient overlay for depth */}
              <View style={[
                StyleSheet.absoluteFill,
                { 
                  backgroundColor: colorScheme === 'dark'
                    ? 'rgba(30,32,34,0.7)'
                    : 'rgba(255,255,255,0.7)',
                }
              ]} />
              {/* Top border line */}
              <View style={[
                styles.topBorder,
                { 
                  backgroundColor: colorScheme === 'dark'
                    ? 'rgba(255,255,255,0.08)'
                    : 'rgba(0,0,0,0.06)',
                }
              ]} />
            </BlurView>
          ) : (
            <View style={[
              StyleSheet.absoluteFill,
              { 
                backgroundColor: colors.background,
                borderTopWidth: StyleSheet.hairlineWidth,
                borderTopColor: colors.border,
              }
            ]} />
          )
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Make",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIcon]}>
              <IconSymbol 
                size={focused ? 26 : 24} 
                name="cup.and.saucer.fill" 
                color={color} 
              />
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
            <View style={[styles.iconContainer, focused && styles.activeIcon]}>
              <IconSymbol 
                size={focused ? 26 : 24} 
                name="location.fill" 
                color={color} 
              />
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
            <View style={[styles.iconContainer, focused && styles.activeIcon]}>
              <IconSymbol 
                size={focused ? 26 : 24} 
                name="gearshape.fill" 
                color={color} 
              />
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
            <View style={[styles.iconContainer, focused && styles.activeIcon]}>
              <IconSymbol 
                size={focused ? 26 : 24} 
                name="book.fill" 
                color={color} 
              />
            </View>
          ),
          tabBarAccessibilityLabel: "Learn about coffee",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIcon]}>
              <IconSymbol 
                size={focused ? 26 : 24} 
                name="person.fill" 
                color={color} 
              />
            </View>
          ),
          tabBarAccessibilityLabel: "Your profile and settings",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
  },
  activeIcon: {
    // iOS 26: Subtle scale for active state
    transform: [{ scale: 1.08 }],
  },
  topBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
  },
});
