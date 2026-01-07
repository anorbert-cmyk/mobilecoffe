import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Appearance, View, useColorScheme as useSystemColorScheme } from "react-native";
import { colorScheme as nativewindColorScheme, vars } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { SchemeColors, type ColorScheme } from "@/constants/theme";

// Theme preference: 'light', 'dark', or 'auto' (follow system)
export type ThemePreference = 'light' | 'dark' | 'auto';

const THEME_STORAGE_KEY = '@coffee_craft_theme_preference';

type ThemeContextValue = {
  colorScheme: ColorScheme;
  themePreference: ThemePreference;
  setThemePreference: (preference: ThemePreference) => void;
  // Legacy support
  setColorScheme: (scheme: ColorScheme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemColorScheme() ?? "light";
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('auto');
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Compute actual color scheme based on preference
  const colorScheme: ColorScheme = useMemo(() => {
    if (themePreference === 'auto') {
      return systemScheme;
    }
    return themePreference;
  }, [themePreference, systemScheme]);

  // Load saved preference on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedPreference = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedPreference && ['light', 'dark', 'auto'].includes(savedPreference)) {
          setThemePreferenceState(savedPreference as ThemePreference);
        }
      } catch (error) {
        console.warn('Failed to load theme preference:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadThemePreference();
  }, []);

  const applyScheme = useCallback((scheme: ColorScheme) => {
    nativewindColorScheme.set(scheme);
    Appearance.setColorScheme?.(scheme);
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.dataset.theme = scheme;
      root.classList.toggle("dark", scheme === "dark");
      const palette = SchemeColors[scheme];
      Object.entries(palette).forEach(([token, value]) => {
        root.style.setProperty(`--color-${token}`, value);
      });
    }
  }, []);

  // Set theme preference and persist to storage
  const setThemePreference = useCallback(async (preference: ThemePreference) => {
    setThemePreferenceState(preference);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, preference);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  }, []);

  // Legacy setColorScheme - maps to preference
  const setColorScheme = useCallback((scheme: ColorScheme) => {
    setThemePreference(scheme);
  }, [setThemePreference]);

  // Apply scheme whenever it changes
  useEffect(() => {
    if (isLoaded) {
      applyScheme(colorScheme);
    }
  }, [applyScheme, colorScheme, isLoaded]);

  // Listen for system theme changes when in auto mode
  useEffect(() => {
    if (themePreference === 'auto') {
      const subscription = Appearance.addChangeListener(({ colorScheme: newScheme }) => {
        if (newScheme) {
          applyScheme(newScheme);
        }
      });
      return () => subscription.remove();
    }
  }, [themePreference, applyScheme]);

  const themeVariables = useMemo(
    () =>
      vars({
        "color-primary": SchemeColors[colorScheme].primary,
        "color-background": SchemeColors[colorScheme].background,
        "color-surface": SchemeColors[colorScheme].surface,
        "color-foreground": SchemeColors[colorScheme].foreground,
        "color-muted": SchemeColors[colorScheme].muted,
        "color-border": SchemeColors[colorScheme].border,
        "color-success": SchemeColors[colorScheme].success,
        "color-warning": SchemeColors[colorScheme].warning,
        "color-error": SchemeColors[colorScheme].error,
      }),
    [colorScheme],
  );

  const value = useMemo(
    () => ({
      colorScheme,
      themePreference,
      setThemePreference,
      setColorScheme,
    }),
    [colorScheme, themePreference, setThemePreference, setColorScheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <View style={[{ flex: 1 }, themeVariables]}>{children}</View>
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeContext must be used within ThemeProvider");
  }
  return ctx;
}
