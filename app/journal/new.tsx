import { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { useJournal } from '@/lib/journal/journal-provider';
import { coffeeRecipes } from '@/data/coffees';

export default function NewJournalEntry() {
  const colors = useColors();
  const { addEntry } = useJournal();
  const [coffee, setCoffee] = useState('');
  const [method, setMethod] = useState('espresso');
  const [grindSize, setGrindSize] = useState('');
  const [dose, setDose] = useState('');
  const [waterTemp, setWaterTemp] = useState('');
  const [brewTime, setBrewTime] = useState('');
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(0);

  const methods = ['espresso', 'pour-over', 'french-press', 'aeropress', 'moka-pot'];

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addEntry({
      coffeeName: coffee || 'Unknown Coffee',
      brewMethod: method,
      grindSize,
      coffeeAmount: parseFloat(dose) || 0,
      waterAmount: 0,
      brewTime: parseInt(brewTime) || 0,
      waterTemp: parseFloat(waterTemp) || 0,
      rating,
      notes,
      tastingNotes: [],
    });
    router.back();
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <Pressable onPress={() => router.back()} style={{ marginRight: 16 }}>
            <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
          </Pressable>
          <Text style={[styles.title, { color: colors.foreground }]}>New Brew Log</Text>
        </View>

        <Text style={[styles.label, { color: colors.foreground }]}>Coffee</Text>
        <TextInput
          value={coffee}
          onChangeText={setCoffee}
          placeholder="e.g., Ethiopian Yirgacheffe"
          placeholderTextColor={colors.muted}
          style={[styles.input, { backgroundColor: colors.surface, color: colors.foreground, borderColor: colors.border }]}
        />

        <Text style={[styles.label, { color: colors.foreground }]}>Brewing Method</Text>
        <View style={styles.methodGrid}>
          {methods.map(m => (
            <Pressable
              key={m}
              onPress={() => setMethod(m)}
              style={[styles.methodButton, { backgroundColor: method === m ? colors.primary : colors.surface, borderColor: colors.border }]}
            >
              <Text style={{ color: method === m ? '#FFF' : colors.foreground, textTransform: 'capitalize' }}>{m.replace('-', ' ')}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.label, { color: colors.foreground }]}>Grind Size</Text>
        <TextInput value={grindSize} onChangeText={setGrindSize} placeholder="e.g., Medium-fine" placeholderTextColor={colors.muted} style={[styles.input, { backgroundColor: colors.surface, color: colors.foreground, borderColor: colors.border }]} />

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: colors.foreground }]}>Dose (g)</Text>
            <TextInput value={dose} onChangeText={setDose} placeholder="18" keyboardType="numeric" placeholderTextColor={colors.muted} style={[styles.input, { backgroundColor: colors.surface, color: colors.foreground, borderColor: colors.border }]} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: colors.foreground }]}>Water Temp (°C)</Text>
            <TextInput value={waterTemp} onChangeText={setWaterTemp} placeholder="93" keyboardType="numeric" placeholderTextColor={colors.muted} style={[styles.input, { backgroundColor: colors.surface, color: colors.foreground, borderColor: colors.border }]} />
          </View>
        </View>

        <Text style={[styles.label, { color: colors.foreground }]}>Brew Time</Text>
        <TextInput value={brewTime} onChangeText={setBrewTime} placeholder="e.g., 25s" placeholderTextColor={colors.muted} style={[styles.input, { backgroundColor: colors.surface, color: colors.foreground, borderColor: colors.border }]} />

        <Text style={[styles.label, { color: colors.foreground }]}>Notes</Text>
        <TextInput value={notes} onChangeText={setNotes} placeholder="Tasting notes, adjustments..." placeholderTextColor={colors.muted} multiline numberOfLines={4} style={[styles.input, styles.textArea, { backgroundColor: colors.surface, color: colors.foreground, borderColor: colors.border }]} />

        <Text style={[styles.label, { color: colors.foreground }]}>Rating</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {[1, 2, 3, 4, 5].map(star => (
            <Pressable key={star} onPress={() => setRating(star)}>
              <IconSymbol name={star <= rating ? 'star.fill' : 'star'} size={32} color={star <= rating ? '#FFD700' : colors.muted} />
            </Pressable>
          ))}
        </View>

        <Pressable onPress={handleSave} style={[styles.saveButton, { backgroundColor: colors.primary }]}>
          <Text style={styles.saveButtonText}>Save Brew Log</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: 'bold' },
  label: { fontSize: 14, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  input: { borderRadius: 12, borderWidth: 1, padding: 12, fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  methodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  methodButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1 },
  saveButton: { marginTop: 32, padding: 16, borderRadius: 12, alignItems: 'center' },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
