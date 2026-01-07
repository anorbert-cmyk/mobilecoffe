import { View, StyleSheet, Platform, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { cn } from '@/lib/utils';

interface GlassViewProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'light' | 'medium' | 'strong';
  style?: ViewStyle;
}

/**
 * iOS 26 Liquid Glass inspired component
 * Creates a frosted glass effect with subtle transparency
 */
export function GlassView({ 
  children, 
  className, 
  intensity = 'medium',
  style 
}: GlassViewProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const intensityMap = {
    light: 20,
    medium: 40,
    strong: 60,
  };

  // Web fallback - use semi-transparent background
  if (Platform.OS === 'web') {
    const webStyle: ViewStyle = {
      overflow: 'hidden',
      backgroundColor: isDark ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    };

    return (
      <View 
        className={cn('overflow-hidden rounded-2xl', className)}
        style={[webStyle, style]}
      >
        {children}
      </View>
    );
  }

  return (
    <BlurView
      intensity={intensityMap[intensity]}
      tint={isDark ? 'dark' : 'light'}
      style={[styles.blur, style]}
      className={cn('overflow-hidden rounded-2xl', className)}
    >
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  blur: {
    overflow: 'hidden',
  },
});
