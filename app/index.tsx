import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useUserProfile } from '@/lib/user-profile';
import { useColors } from '@/hooks/use-colors';

/**
 * Root index screen - handles initial routing based on onboarding status
 */
export default function RootIndex() {
  const { profile, isLoading } = useUserProfile();
  const colors = useColors();

  useEffect(() => {
    if (isLoading) return;

    // Navigate based on onboarding status
    if (profile.hasCompletedOnboarding) {
      router.replace('/(tabs)');
    } else {
      router.replace('/onboarding');
    }
  }, [isLoading, profile.hasCompletedOnboarding]);

  // Show loading indicator while checking profile
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
