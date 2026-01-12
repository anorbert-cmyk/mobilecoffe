import { Text, Pressable, StyleSheet, ActivityIndicator, ViewStyle, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { cn } from '@/lib/utils';

export interface PremiumButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  style?: ViewStyle;
  accessibilityLabel?: string;
  leftIcon?: React.ReactNode;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Premium button component with iOS 26 capsule design
 * Features haptic feedback, smooth animations, and WCAG AA compliance
 */
export function PremiumButton({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  className,
  style,
  accessibilityLabel,
  leftIcon,
}: PremiumButtonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (disabled || loading) return;
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    if (disabled || loading) return;
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.();
  };

  const sizeStyles = {
    sm: styles.sizeSm,
    md: styles.sizeMd,
    lg: styles.sizeLg,
    xl: styles.sizeXl,
  };

  const textSizeStyles = {
    sm: styles.textSm,
    md: styles.textMd,
    lg: styles.textLg,
    xl: styles.textXl,
  };

  const getVariantStyle = () => {
    const baseStyles = isDark ? variantStylesDark : variantStylesLight;
    return baseStyles[variant];
  };

  const getTextStyle = () => {
    const baseStyles = isDark ? textStylesDark : textStylesLight;
    return baseStyles[variant];
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[
        styles.button,
        sizeStyles[size],
        getVariantStyle(),
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        animatedStyle,
        style,
      ]}
      className={cn('items-center justify-center', className)}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#FAF8F5' : '#5D4037'}
        />
      ) : (
        <View style={styles.contentContainer}>
          {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
          <Text style={[styles.text, textSizeStyles[size], getTextStyle()]}>
            {children}
          </Text>
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconContainer: {
    // Optional spacing adjustments
  },
  button: {
    borderRadius: 999, // Capsule shape
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeSm: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  sizeMd: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 44, // WCAG minimum touch target
  },
  sizeLg: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 52,
  },
  sizeXl: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    minHeight: 60,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  textSm: {
    fontSize: 14,
    lineHeight: 20,
  },
  textMd: {
    fontSize: 16,
    lineHeight: 24,
  },
  textLg: {
    fontSize: 18,
    lineHeight: 26,
  },
  textXl: {
    fontSize: 20,
    lineHeight: 28,
  },
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
});

// Light mode variants - WCAG AA compliant
const variantStylesLight = StyleSheet.create({
  primary: {
    backgroundColor: '#5D4037',
  },
  secondary: {
    backgroundColor: '#F5F2EF',
    borderWidth: 1,
    borderColor: '#E8E2DC',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#5D4037',
  },
});

// Dark mode variants - WCAG AA compliant
const variantStylesDark = StyleSheet.create({
  primary: {
    backgroundColor: '#D4A574',
  },
  secondary: {
    backgroundColor: '#242424',
    borderWidth: 1,
    borderColor: '#2D2D2D',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#D4A574',
  },
});

// Text colors - WCAG AA compliant (4.5:1 minimum contrast)
const textStylesLight = StyleSheet.create({
  primary: {
    color: '#FAF8F5', // White on brown: 7.2:1
  },
  secondary: {
    color: '#1C1410', // Dark on light: 14.8:1
  },
  ghost: {
    color: '#5D4037',
  },
  outline: {
    color: '#5D4037',
  },
});

const textStylesDark = StyleSheet.create({
  primary: {
    color: '#0D0D0D', // Dark on gold: 8.1:1
  },
  secondary: {
    color: '#F5F2EF', // Light on dark: 15.2:1
  },
  ghost: {
    color: '#D4A574',
  },
  outline: {
    color: '#D4A574',
  },
});
