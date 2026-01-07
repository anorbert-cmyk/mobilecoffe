import { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TextInput, 
  Pressable,
  StyleSheet,
} from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { PremiumCard } from '@/components/ui/premium-card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { espressoMachines, coffeeGrinders } from '@/data/machines';

type TabType = 'machines' | 'grinders';

export default function MachinesScreen() {
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<TabType>('machines');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMachines = useMemo(() => {
    if (!searchQuery) return espressoMachines;
    const q = searchQuery.toLowerCase();
    return espressoMachines.filter(m => 
      m.name.toLowerCase().includes(q) || 
      m.brand.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const filteredGrinders = useMemo(() => {
    if (!searchQuery) return coffeeGrinders;
    const q = searchQuery.toLowerCase();
    return coffeeGrinders.filter(g => 
      g.name.toLowerCase().includes(q) || 
      g.brand.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const getPriceRangeLabel = (range: string) => {
    const labels: Record<string, string> = {
      'budget': '$',
      'mid-range': '$$',
      'premium': '$$$',
      'prosumer': '$$$$',
    };
    return labels[range] || range;
  };

  const renderMachineItem = ({ item }: { item: typeof espressoMachines[0] }) => (
    <PremiumCard
      onPress={() => router.push(`/machine/${item.id}` as any)}
      className="mb-4"
      style={styles.card}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardIcon}>
          <IconSymbol name="cup.and.saucer.fill" size={32} color={colors.primary} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={[styles.cardBrand, { color: colors.muted }]}>
            {item.brand}
          </Text>
          <Text 
            style={[styles.cardName, { color: colors.foreground }]}
            accessibilityRole="header"
          >
            {item.name}
          </Text>
          <View style={styles.cardMeta}>
            <View style={[styles.badge, { backgroundColor: colors.surfaceElevated }]}>
              <Text style={[styles.badgeText, { color: colors.muted }]}>
                {item.type.replace('-', ' ')}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: colors.surfaceElevated }]}>
              <Text style={[styles.badgeText, { color: colors.primary }]}>
                {getPriceRangeLabel(item.priceRange)}
              </Text>
            </View>
          </View>
        </View>
        <IconSymbol name="chevron.right" size={20} color={colors.muted} />
      </View>
    </PremiumCard>
  );

  const renderGrinderItem = ({ item }: { item: typeof coffeeGrinders[0] }) => (
    <PremiumCard
      onPress={() => router.push(`/grinder/${item.id}` as any)}
      className="mb-4"
      style={styles.card}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardIcon}>
          <IconSymbol name="dial.low.fill" size={32} color={colors.primary} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={[styles.cardBrand, { color: colors.muted }]}>
            {item.brand}
          </Text>
          <Text 
            style={[styles.cardName, { color: colors.foreground }]}
            accessibilityRole="header"
          >
            {item.name}
          </Text>
          <View style={styles.cardMeta}>
            <View style={[styles.badge, { backgroundColor: colors.surfaceElevated }]}>
              <Text style={[styles.badgeText, { color: colors.muted }]}>
                {item.type} • {item.burrSize}mm {item.burrType}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: colors.surfaceElevated }]}>
              <Text style={[styles.badgeText, { color: colors.primary }]}>
                {getPriceRangeLabel(item.priceRange)}
              </Text>
            </View>
          </View>
        </View>
        <IconSymbol name="chevron.right" size={20} color={colors.muted} />
      </View>
    </PremiumCard>
  );

  return (
    <ScreenContainer className="flex-1">
      {/* Header */}
      <View style={styles.header}>
        <Text 
          style={[styles.title, { color: colors.foreground }]}
          accessibilityRole="header"
        >
          My Setup
        </Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Find optimal settings for your equipment
        </Text>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <IconSymbol name="magnifyingglass" size={20} color={colors.muted} />
        <TextInput
          style={[styles.searchInput, { color: colors.foreground }]}
          placeholder="Search machines or grinders..."
          placeholderTextColor={colors.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          accessibilityLabel="Search equipment"
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <Pressable 
            onPress={() => setSearchQuery('')}
            accessibilityLabel="Clear search"
            accessibilityRole="button"
          >
            <IconSymbol name="xmark" size={18} color={colors.muted} />
          </Pressable>
        )}
      </View>

      {/* Tab Switcher */}
      <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
        <Pressable
          style={[
            styles.tab,
            activeTab === 'machines' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setActiveTab('machines')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'machines' }}
        >
          <Text style={[
            styles.tabText,
            { color: activeTab === 'machines' ? colors.background : colors.muted }
          ]}>
            Machines
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.tab,
            activeTab === 'grinders' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setActiveTab('grinders')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'grinders' }}
        >
          <Text style={[
            styles.tabText,
            { color: activeTab === 'grinders' ? colors.background : colors.muted }
          ]}>
            Grinders
          </Text>
        </Pressable>
      </View>

      {/* List */}
      {activeTab === 'machines' ? (
        <FlatList
          data={filteredMachines}
          renderItem={renderMachineItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <IconSymbol name="magnifyingglass" size={48} color={colors.muted} />
              <Text style={[styles.emptyText, { color: colors.muted }]}>
                No machines found
              </Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={filteredGrinders}
          renderItem={renderGrinderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <IconSymbol name="magnifyingglass" size={48} color={colors.muted} />
              <Text style={[styles.emptyText, { color: colors.muted }]}>
                No grinders found
              </Text>
            </View>
          }
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 22,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    lineHeight: 22,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 4,
    borderRadius: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  card: {
    padding: 16,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: 'rgba(93, 64, 55, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  cardBrand: {
    fontSize: 13,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  cardName: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 6,
  },
  cardMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 17,
  },
});
