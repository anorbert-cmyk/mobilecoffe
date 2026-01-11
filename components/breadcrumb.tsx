import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { IconSymbol } from './ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const colors = useColors();

  const handlePress = (href?: string) => {
    if (href) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.push(href as any);
    }
  };

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          {index > 0 && (
            <IconSymbol 
              name="chevron.right" 
              size={14} 
              color={colors.muted} 
              style={styles.separator}
            />
          )}
          {item.href ? (
            <Pressable 
              onPress={() => handlePress(item.href)}
              style={({ pressed }) => [
                styles.link,
                { opacity: pressed ? 0.6 : 1 }
              ]}
            >
              <Text style={[styles.linkText, { color: colors.primary }]}>
                {item.label}
              </Text>
            </Pressable>
          ) : (
            <Text style={[styles.currentText, { color: colors.foreground }]}>
              {item.label}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    marginHorizontal: 8,
  },
  link: {
    paddingVertical: 4,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '500',
  },
  currentText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
