import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { Breadcrumb } from '@/components/breadcrumb';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { useJournal } from '@/lib/journal/journal-provider';

export default function JournalEntryDetail() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { entries, deleteEntry } = useJournal();
  const entry = entries.find(e => e.id === id);

  if (!entry) {
    return (
      <ScreenContainer>
        <Text style={{ color: colors.foreground, textAlign: 'center', marginTop: 100 }}>Entry not found</Text>
      </ScreenContainer>
    );
  }

  const handleDelete = () => {
    deleteEntry(id!);
    router.back();
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Journal', href: '/journal' },
          { label: entry.coffeeName }
        ]} />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <Pressable onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
          </Pressable>
          <Pressable onPress={handleDelete}>
            <IconSymbol name="trash" size={22} color={colors.error} />
          </Pressable>
        </View>

        <Text style={[styles.title, { color: colors.foreground }]}>{entry.coffeeName}</Text>
        <Text style={[styles.method, { color: colors.primary }]}>{entry.brewMethod.replace('-', ' ').toUpperCase()}</Text>
        <Text style={[styles.date, { color: colors.muted }]}>{new Date(entry.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Text>

        <View style={{ flexDirection: 'row', marginVertical: 16 }}>
          {[1, 2, 3, 4, 5].map(star => (
            <IconSymbol key={star} name={star <= entry.rating ? 'star.fill' : 'star'} size={24} color={star <= entry.rating ? '#FFD700' : colors.muted} />
          ))}
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recipe</Text>
          {entry.grindSize && <Text style={[styles.recipeItem, { color: colors.muted }]}>Grind: {entry.grindSize}</Text>}
          {entry.coffeeAmount > 0 && <Text style={[styles.recipeItem, { color: colors.muted }]}>Dose: {entry.coffeeAmount}g</Text>}
          {entry.waterTemp > 0 && <Text style={[styles.recipeItem, { color: colors.muted }]}>Water: {entry.waterTemp}°C</Text>}
          {entry.brewTime > 0 && <Text style={[styles.recipeItem, { color: colors.muted }]}>Time: {entry.brewTime}s</Text>}
        </View>

        {entry.notes && (
          <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Notes</Text>
            <Text style={[styles.notes, { color: colors.muted }]}>{entry.notes}</Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: 'bold' },
  method: { fontSize: 14, fontWeight: '600', marginTop: 4 },
  date: { fontSize: 14, marginTop: 8 },
  section: { marginTop: 20, padding: 16, borderRadius: 12, borderWidth: 1 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  recipeItem: { fontSize: 14, marginBottom: 6 },
  notes: { fontSize: 14, lineHeight: 20 },
});
