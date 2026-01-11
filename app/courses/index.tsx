import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useSubscription } from '@/lib/subscription/subscription-provider';
import { Paywall } from '@/components/subscription/paywall';
import { courses } from '@/data/courses';

export default function CoursesScreen() {
  const colors = useColors();
  const { hasAccess } = useSubscription();

  if (!hasAccess('video-courses')) {
    return <Paywall visible={true} onClose={() => router.back()} feature="video-courses" featureName="Video Courses" requiredTier="pro" />;
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>Coffee Courses</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>Master your craft with expert-led courses</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {courses.map(course => (
          <Pressable
            key={course.id}
            onPress={() => router.push(`/courses/${course.id}` as any)}
            style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Image source={course.thumbnail} style={styles.thumbnail} contentFit="cover" />
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: colors.foreground }]}>{course.title}</Text>
              <Text style={[styles.cardDescription, { color: colors.muted }]}>{course.description}</Text>
              <View style={styles.cardFooter}>
                <Text style={[styles.cardDuration, { color: colors.muted }]}>{course.totalDuration} min</Text>
                <Text style={[styles.cardModules, { color: colors.primary }]}>{course.modules.length} modules</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { padding: 16, paddingBottom: 8 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 4 },
  subtitle: { fontSize: 15 },
  list: { padding: 16, gap: 16 },
  card: { borderRadius: 16, overflow: 'hidden', borderWidth: 1 },
  thumbnail: { width: '100%', height: 180 },
  cardContent: { padding: 16 },
  cardTitle: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  cardDescription: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  cardDuration: { fontSize: 13 },
  cardModules: { fontSize: 13, fontWeight: '600' }
});
