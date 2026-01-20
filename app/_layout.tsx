import "@/global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { Platform } from "react-native";
import "@/lib/_core/nativewind-pressable";
import { ThemeProvider } from "@/lib/theme-provider";
import {
  SafeAreaFrameContext,
  SafeAreaInsetsContext,
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import type { EdgeInsets, Metrics, Rect } from "react-native-safe-area-context";

import { trpc, createTRPCClient } from "@/lib/trpc";
import { initManusRuntime, subscribeSafeAreaInsets } from "@/lib/_core/manus-runtime";
import { UserProfileProvider } from "@/lib/user-profile";
import { SubscriptionProvider } from "@/lib/subscription/subscription-provider";
import { ComparisonProvider } from "@/lib/comparison/comparison-provider";
import { FavoritesProvider } from "@/lib/favorites/favorites-provider";
import { JournalProvider } from "@/lib/journal/journal-provider";
import { CourseProgressProvider } from "@/lib/course-progress/course-progress-provider";
import { ReadingProgressProvider } from '@/lib/reading-progress/reading-progress-provider';
import { MyEquipmentProvider } from '@/lib/equipment/my-equipment-provider';
import { NotificationPreferencesProvider } from '@/lib/notifications/notification-preferences-provider';
import { useColors } from "@/hooks/use-colors";
import { AuthProvider } from "@/src/features/auth";
import { ErrorBoundary } from '@/src/shared/components/error-boundary';

// ... (existing imports)

// ...



const DEFAULT_WEB_INSETS: EdgeInsets = { top: 0, right: 0, bottom: 0, left: 0 };
const DEFAULT_WEB_FRAME: Rect = { x: 0, y: 0, width: 0, height: 0 };

export const unstable_settings = {
  anchor: "(tabs)",
};

function AppStack() {
  const colors = useColors();

  // Apple HIG compliant header style
  const defaultHeaderOptions = {
    headerShown: true,
    headerBackTitle: "Back",
    headerBackTitleVisible: true,
    headerTintColor: colors.primary,
    headerStyle: {
      backgroundColor: colors.background,
    },
    headerTitleStyle: {
      fontWeight: '600' as const,
      fontSize: 17,
      color: colors.foreground,
    },
    headerShadowVisible: false,
    // Enable swipe-to-go-back gesture (iOS standard)
    gestureEnabled: true,
    // Animation style
    animation: 'slide_from_right' as const,
  };

  return (
    <>
      <Stack
        screenOptions={{
          ...defaultHeaderOptions,
          headerShown: false, // Default to hidden, screens opt-in
        }}
      >
        {/* Tab navigator - no header */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Onboarding - no back gesture */}
        <Stack.Screen
          name="onboarding/index"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />

        {/* OAuth callback - no header */}
        <Stack.Screen name="oauth/callback" options={{ headerShown: false }} />

        {/* Coffee detail - with header */}
        <Stack.Screen
          name="coffee/[id]"
          options={{
            ...defaultHeaderOptions,
            headerShown: true,
            headerTransparent: true,
            headerTitle: "",
            headerStyle: { backgroundColor: 'transparent' },
          }}
        />

        {/* Machine detail - with header */}
        <Stack.Screen
          name="machine/[id]"
          options={{
            ...defaultHeaderOptions,
            headerShown: true,
          }}
        />

        {/* Grinder detail - with header */}
        <Stack.Screen
          name="grinder/[id]"
          options={{
            ...defaultHeaderOptions,
            headerShown: true,
          }}
        />

        {/* Learn article/category detail - with header */}
        <Stack.Screen
          name="learn/[id]"
          options={{
            ...defaultHeaderOptions,
            headerShown: true,
          }}
        />

        {/* Equipment wizard - with header and back */}
        <Stack.Screen
          name="equipment-wizard"
          options={{
            ...defaultHeaderOptions,
            headerShown: true,
            headerTitle: "Equipment Finder",
            presentation: 'card',
          }}
        />

        {/* Recommendations - with header and back */}
        <Stack.Screen
          name="recommendations"
          options={{
            ...defaultHeaderOptions,
            headerShown: true,
            headerTitle: "Your Recommendations",
          }}
        />

        {/* Profile settings - with header */}
        <Stack.Screen
          name="profile"
          options={{
            ...defaultHeaderOptions,
            headerShown: true,
            headerTitle: "Profile Settings",
          }}
        />

        {/* App index (onboarding check) - no header */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

export default function RootLayout() {
  const initialInsets = initialWindowMetrics?.insets ?? DEFAULT_WEB_INSETS;
  const initialFrame = initialWindowMetrics?.frame ?? DEFAULT_WEB_FRAME;

  const [insets, setInsets] = useState<EdgeInsets>(initialInsets);
  const [frame, setFrame] = useState<Rect>(initialFrame);

  // Initialize Manus runtime for cookie injection from parent container
  useEffect(() => {
    initManusRuntime();
  }, []);

  const handleSafeAreaUpdate = useCallback((metrics: Metrics) => {
    setInsets(metrics.insets);
    setFrame(metrics.frame);
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    const unsubscribe = subscribeSafeAreaInsets(handleSafeAreaUpdate);
    return () => unsubscribe();
  }, [handleSafeAreaUpdate]);

  // Create clients once and reuse them
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Disable automatic refetching on window focus for mobile
            refetchOnWindowFocus: false,
            // Retry failed requests once
            retry: 1,
          },
        },
      }),
  );
  const [trpcClient] = useState(() => createTRPCClient());

  // Ensure minimum 8px padding for top and bottom on mobile
  const providerInitialMetrics = useMemo(() => {
    const metrics = initialWindowMetrics ?? { insets: initialInsets, frame: initialFrame };
    return {
      ...metrics,
      insets: {
        ...metrics.insets,
        top: Math.max(metrics.insets.top, 16),
        bottom: Math.max(metrics.insets.bottom, 12),
      },
    };
  }, [initialInsets, initialFrame]);

  const content = (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <SubscriptionProvider>
            <ComparisonProvider>
              <FavoritesProvider>
                <JournalProvider>
                  <CourseProgressProvider>
                    <ReadingProgressProvider>
                      <MyEquipmentProvider>
                        <NotificationPreferencesProvider>
                          <UserProfileProvider>
                            <trpc.Provider client={trpcClient} queryClient={queryClient}>
                              <QueryClientProvider client={queryClient}>
                                <AppStack />
                              </QueryClientProvider>
                            </trpc.Provider>
                          </UserProfileProvider>
                        </NotificationPreferencesProvider>
                      </MyEquipmentProvider>
                    </ReadingProgressProvider>
                  </CourseProgressProvider>
                </JournalProvider>
              </FavoritesProvider>
            </ComparisonProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );

  const shouldOverrideSafeArea = Platform.OS === "web";

  if (shouldOverrideSafeArea) {
    return (
      <ThemeProvider>
        <SafeAreaProvider initialMetrics={providerInitialMetrics}>
          <SafeAreaFrameContext.Provider value={frame}>
            <SafeAreaInsetsContext.Provider value={insets}>
              {content}
            </SafeAreaInsetsContext.Provider>
          </SafeAreaFrameContext.Provider>
        </SafeAreaProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider initialMetrics={providerInitialMetrics}>{content}</SafeAreaProvider>
    </ThemeProvider>
  );
}
