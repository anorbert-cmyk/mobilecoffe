import { Pressable, StyleSheet , Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { IconSymbol } from './ui/icon-symbol';
import { useFavorites } from '@/lib/favorites/favorites-provider';
import { useColors } from '@/hooks/use-colors';

interface FavoriteButtonProps {
  id: string;
  type: 'coffee' | 'machine' | 'grinder' | 'bean' | 'article';
  size?: number;
}

export function FavoriteButton({ id, type, size = 24 }: FavoriteButtonProps) {
  const colors = useColors();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(id);

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    toggleFavorite(id, type);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.button,
        { opacity: pressed ? 0.6 : 1 }
      ]}
      hitSlop={8}
    >
      <IconSymbol
        name={favorite ? 'heart.fill' : 'heart'}
        size={size}
        color={favorite ? '#FF0066' : colors.muted}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 20,
  }
});
