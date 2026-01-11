import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useJournal } from '@/lib/journal/journal-provider';
import { useSubscription } from '@/lib/subscription/subscription-provider';
import { Paywall } from '@/components/subscription/paywall';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function JournalScreen() {
  const colors = useColors();
  const { entries } = useJournal();
  const { hasAccess } = useSubscription();

  if (!hasAccess('brewing-journal')) {
    return <Paywall visible={true} onClose={() => router.back()} feature="brewing-journal" featureName="Brewing Journal" requiredTier="pro" />;
  }

  return (
    <ScreenContainer>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Brewing Journal</Text>
        <Pressable onPress={() => router.push('/journal/new' as any)} style={[styles.addButton, { backgroundColor: colors.primary }]}>
          <IconSymbol name="plus" size={20} color="#FFF" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {entries.length === 0 ? (
          <View style={styles.empty}>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No Entries Yet</Text>
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              Start logging your brewing sessions to track recipes and improve your craft.
            </Text>
          </View>
        ) : (
          entries.map(entry => (
            <Pressable
              key={entry.id}
              onPress={() => router.push(`/journal/${entry.id}` as any)}
              style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <Text style={[styles.cardTitle, { color: colors.foreground }]}>{entry.coffeeName}</Text>
              <Text style={[styles.cardMethod, { color: colors.muted }]}>{entry.brewMethod}</Text>
              <View style={styles.cardFooter}>
                <Text style={[styles.cardDate, { color: colors.muted }]}>{new Date(entry.date).toLocaleDateString()}</Text>
                <Text style={[styles.cardRating, { color: colors.primary }]}>★ {entry.rating}/5</Text>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  title: { fontSize: 28, fontWeight: '700' },
  addButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  list: { padding: 16, gap: 12 },
  card: { padding: 16, borderRadius: 12, borderWidth: 1 },
  cardTitle: { fontSize: 17, fontWeight: '600', marginBottom: 4 },
  cardMethod: { fontSize: 14, marginBottom: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  cardDate: { fontSize: 13 },
  cardRating: { fontSize: 13, fontWeight: '600' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 80 },
  emptyTitle: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  emptyText: { fontSize: 15, textAlign: 'center', lineHeight: 22, paddingHorizontal: 32 }
});
