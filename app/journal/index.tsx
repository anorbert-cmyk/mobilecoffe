import { useState, useMemo } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import Svg, { Rect, Line, Text as SvgText, Circle } from 'react-native-svg';

import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useJournal, JournalEntry } from '@/lib/journal/journal-provider';
import { useSubscription } from '@/lib/subscription/subscription-provider';
import { Paywall } from '@/components/subscription/paywall';
import { IconSymbol } from '@/components/ui/icon-symbol';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 64;
const CHART_HEIGHT = 150;

function calculateAnalytics(entries: JournalEntry[]) {
  if (entries.length === 0) {
    return {
      totalBrews: 0,
      averageRating: 0,
      favoriteMethod: 'N/A',
      favoriteCoffee: 'N/A',
      thisWeekBrews: 0,
      lastWeekBrews: 0,
      ratingTrend: [] as { date: string; rating: number }[],
      methodDistribution: [] as { method: string; count: number }[],
      weeklyBrews: [] as { week: string; count: number }[],
    };
  }

  const totalBrews = entries.length;
  const averageRating = entries.reduce((acc, e) => acc + e.rating, 0) / entries.length;

  const methodCounts: Record<string, number> = {};
  entries.forEach(e => {
    methodCounts[e.brewMethod] = (methodCounts[e.brewMethod] || 0) + 1;
  });
  const methodDistribution = Object.entries(methodCounts)
    .map(([method, count]) => ({ method, count }))
    .sort((a, b) => b.count - a.count);
  const favoriteMethod = methodDistribution[0]?.method.replace('-', ' ') || 'N/A';

  const coffeeCounts: Record<string, number> = {};
  entries.forEach(e => {
    coffeeCounts[e.coffeeName] = (coffeeCounts[e.coffeeName] || 0) + 1;
  });
  const favoriteCoffee = Object.entries(coffeeCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  
  const thisWeekBrews = entries.filter(e => new Date(e.date) >= oneWeekAgo).length;
  const lastWeekBrews = entries.filter(e => {
    const date = new Date(e.date);
    return date >= twoWeeksAgo && date < oneWeekAgo;
  }).length;

  const ratingTrend = entries
    .slice(0, 10)
    .reverse()
    .map(e => ({
      date: new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      rating: e.rating
    }));

  const weeklyBrews: { week: string; count: number }[] = [];
  for (let i = 0; i < 4; i++) {
    const weekStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
    const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
    const count = entries.filter(e => {
      const date = new Date(e.date);
      return date >= weekStart && date < weekEnd;
    }).length;
    weeklyBrews.unshift({ week: `W${4 - i}`, count });
  }

  return {
    totalBrews,
    averageRating,
    favoriteMethod,
    favoriteCoffee,
    thisWeekBrews,
    lastWeekBrews,
    ratingTrend,
    methodDistribution,
    weeklyBrews,
  };
}

function BarChart({ data, colors }: { data: { label: string; value: number }[]; colors: any }) {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const barWidth = (CHART_WIDTH - 40) / data.length - 8;

  return (
    <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
      {[0, 1, 2, 3, 4].map(i => (
        <Line
          key={i}
          x1={30}
          y1={20 + (i * (CHART_HEIGHT - 50)) / 4}
          x2={CHART_WIDTH - 10}
          y2={20 + (i * (CHART_HEIGHT - 50)) / 4}
          stroke={colors.border}
          strokeWidth={1}
          strokeDasharray="4,4"
        />
      ))}
      
      {data.map((d, i) => {
        const barHeight = (d.value / maxValue) * (CHART_HEIGHT - 60);
        const x = 40 + i * (barWidth + 8);
        const y = CHART_HEIGHT - 30 - barHeight;
        
        return (
          <Rect
            key={i}
            x={x}
            y={y}
            width={barWidth}
            height={barHeight}
            rx={4}
            fill={colors.primary}
            opacity={0.8}
          />
        );
      })}
      
      {data.map((d, i) => {
        const barWidth2 = (CHART_WIDTH - 40) / data.length - 8;
        const x = 40 + i * (barWidth2 + 8);
        return (
          <SvgText
            key={`label-${i}`}
            x={x + barWidth2 / 2}
            y={CHART_HEIGHT - 10}
            fontSize={11}
            fill={colors.muted}
            textAnchor="middle"
          >
            {d.label}
          </SvgText>
        );
      })}
    </Svg>
  );
}

function RatingChart({ data, colors }: { data: { date: string; rating: number }[]; colors: any }) {
  if (data.length === 0) return null;
  
  const maxRating = 5;
  const pointSpacing = (CHART_WIDTH - 60) / Math.max(data.length - 1, 1);

  return (
    <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
      {[1, 2, 3, 4, 5].map(i => (
        <Line
          key={i}
          x1={30}
          y1={CHART_HEIGHT - 30 - ((i / maxRating) * (CHART_HEIGHT - 50))}
          x2={CHART_WIDTH - 10}
          y2={CHART_HEIGHT - 30 - ((i / maxRating) * (CHART_HEIGHT - 50))}
          stroke={colors.border}
          strokeWidth={1}
          strokeDasharray="4,4"
        />
      ))}
      
      {data.map((d, i) => {
        if (i === 0) return null;
        const prevD = data[i - 1];
        const x1 = 40 + (i - 1) * pointSpacing;
        const y1 = CHART_HEIGHT - 30 - ((prevD.rating / maxRating) * (CHART_HEIGHT - 50));
        const x2 = 40 + i * pointSpacing;
        const y2 = CHART_HEIGHT - 30 - ((d.rating / maxRating) * (CHART_HEIGHT - 50));
        
        return (
          <Line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={colors.primary} strokeWidth={2} />
        );
      })}
      
      {data.map((d, i) => {
        const x = 40 + i * pointSpacing;
        const y = CHART_HEIGHT - 30 - ((d.rating / maxRating) * (CHART_HEIGHT - 50));
        
        return (
          <Circle key={i} cx={x} cy={y} r={5} fill={colors.primary} stroke={colors.background} strokeWidth={2} />
        );
      })}
    </Svg>
  );
}

export default function JournalScreen() {
  const colors = useColors();
  const { entries } = useJournal();
  const { hasAccess } = useSubscription();
  const [showAnalytics, setShowAnalytics] = useState(true);

  const analytics = useMemo(() => calculateAnalytics(entries), [entries]);

  if (!hasAccess('brewing-journal')) {
    return <Paywall visible={true} onClose={() => router.back()} feature="brewing-journal" featureName="Brewing Journal" requiredTier="pro" />;
  }

  return (
    <ScreenContainer>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Brewing Journal</Text>
        <Pressable 
          onPress={() => router.push('/journal/new' as any)} 
          style={[styles.addButton, { backgroundColor: colors.primary }]}
        >
          <IconSymbol name="plus" size={20} color="#FFF" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {entries.length > 0 && (
          <Animated.View entering={FadeIn.duration(400)}>
            <Pressable 
              onPress={() => setShowAnalytics(!showAnalytics)}
              style={[styles.analyticsHeader, { backgroundColor: colors.surface }]}
            >
              <View style={styles.analyticsHeaderLeft}>
                <IconSymbol name="sparkles" size={20} color={colors.primary} />
                <Text style={[styles.analyticsTitle, { color: colors.foreground }]}>Your Stats</Text>
              </View>
              <IconSymbol 
                name={showAnalytics ? 'chevron.up' : 'chevron.down'} 
                size={20} 
                color={colors.muted} 
              />
            </Pressable>

            {showAnalytics && (
              <Animated.View entering={FadeInDown.duration(300)} style={styles.analyticsContent}>
                <View style={styles.statsGrid}>
                  <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.statValue, { color: colors.primary }]}>{analytics.totalBrews}</Text>
                    <Text style={[styles.statLabel, { color: colors.muted }]}>Total Brews</Text>
                  </View>
                  <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.statValue, { color: colors.primary }]}>
                      {analytics.averageRating.toFixed(1)}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.muted }]}>Avg Rating</Text>
                  </View>
                  <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.statValue, { color: colors.primary }]}>{analytics.thisWeekBrews}</Text>
                    <Text style={[styles.statLabel, { color: colors.muted }]}>This Week</Text>
                  </View>
                  <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.statValue, { color: colors.primary }]}>
                      {analytics.thisWeekBrews >= analytics.lastWeekBrews ? '↑' : '↓'}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.muted }]}>vs Last Week</Text>
                  </View>
                </View>

                <View style={[styles.favoritesRow, { backgroundColor: colors.surface }]}>
                  <View style={styles.favoriteItem}>
                    <Text style={[styles.favoriteLabel, { color: colors.muted }]}>Favorite Method</Text>
                    <Text style={[styles.favoriteValue, { color: colors.foreground }]} numberOfLines={1}>
                      {analytics.favoriteMethod}
                    </Text>
                  </View>
                  <View style={[styles.favoriteDivider, { backgroundColor: colors.border }]} />
                  <View style={styles.favoriteItem}>
                    <Text style={[styles.favoriteLabel, { color: colors.muted }]}>Top Coffee</Text>
                    <Text style={[styles.favoriteValue, { color: colors.foreground }]} numberOfLines={1}>
                      {analytics.favoriteCoffee}
                    </Text>
                  </View>
                </View>

                {analytics.ratingTrend.length > 1 && (
                  <View style={[styles.chartCard, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.chartTitle, { color: colors.foreground }]}>Rating Trend</Text>
                    <Text style={[styles.chartSubtitle, { color: colors.muted }]}>Last {analytics.ratingTrend.length} brews</Text>
                    <RatingChart data={analytics.ratingTrend} colors={colors} />
                  </View>
                )}

                {analytics.weeklyBrews.some(w => w.count > 0) && (
                  <View style={[styles.chartCard, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.chartTitle, { color: colors.foreground }]}>Weekly Activity</Text>
                    <Text style={[styles.chartSubtitle, { color: colors.muted }]}>Brews per week</Text>
                    <BarChart 
                      data={analytics.weeklyBrews.map(w => ({ label: w.week, value: w.count }))} 
                      colors={colors} 
                    />
                  </View>
                )}

                {analytics.methodDistribution.length > 0 && (
                  <View style={[styles.chartCard, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.chartTitle, { color: colors.foreground }]}>Brew Methods</Text>
                    <View style={styles.methodList}>
                      {analytics.methodDistribution.slice(0, 5).map((item, index) => (
                        <View key={item.method} style={styles.methodItem}>
                          <View style={styles.methodInfo}>
                            <Text style={[styles.methodRank, { color: colors.primary }]}>#{index + 1}</Text>
                            <Text style={[styles.methodName, { color: colors.foreground }]}>
                              {item.method.replace('-', ' ')}
                            </Text>
                          </View>
                          <View style={styles.methodBar}>
                            <View 
                              style={[
                                styles.methodBarFill, 
                                { 
                                  backgroundColor: colors.primary,
                                  width: `${(item.count / analytics.totalBrews) * 100}%`
                                }
                              ]} 
                            />
                          </View>
                          <Text style={[styles.methodCount, { color: colors.muted }]}>{item.count}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </Animated.View>
            )}
          </Animated.View>
        )}

        <View style={styles.entriesSection}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recent Brews</Text>
          
          {entries.length === 0 ? (
            <View style={styles.empty}>
              <IconSymbol name="cup.and.saucer.fill" size={48} color={colors.muted} />
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No Entries Yet</Text>
              <Text style={[styles.emptyText, { color: colors.muted }]}>
                Start logging your brewing sessions to track recipes and improve your craft.
              </Text>
            </View>
          ) : (
            entries.map((entry, index) => (
              <Animated.View key={entry.id} entering={FadeInDown.delay(index * 50).duration(300)}>
                <Pressable
                  onPress={() => router.push(`/journal/${entry.id}` as any)}
                  style={({ pressed }) => [
                    styles.card, 
                    { 
                      backgroundColor: colors.surface, 
                      borderColor: colors.border,
                      opacity: pressed ? 0.7 : 1
                    }
                  ]}
                >
                  <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, { color: colors.foreground }]}>{entry.coffeeName}</Text>
                    <View style={styles.ratingBadge}>
                      <IconSymbol name="star.fill" size={12} color={colors.warning} />
                      <Text style={[styles.ratingText, { color: colors.foreground }]}>{entry.rating}</Text>
                    </View>
                  </View>
                  <Text style={[styles.cardMethod, { color: colors.muted }]}>
                    {entry.brewMethod.replace('-', ' ').toUpperCase()}
                  </Text>
                  <View style={styles.cardDetails}>
                    <Text style={[styles.cardDetail, { color: colors.muted }]}>
                      {entry.coffeeAmount}g • {entry.waterAmount}ml • {entry.brewTime}s
                    </Text>
                  </View>
                  <View style={styles.cardFooter}>
                    <Text style={[styles.cardDate, { color: colors.muted }]}>
                      {new Date(entry.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </Text>
                    <IconSymbol name="chevron.right" size={16} color={colors.muted} />
                  </View>
                </Pressable>
              </Animated.View>
            ))
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  title: { fontSize: 28, fontWeight: '700' },
  addButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 16 },
  analyticsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 12 },
  analyticsHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  analyticsTitle: { fontSize: 17, fontWeight: '600' },
  analyticsContent: { gap: 12, marginBottom: 24 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { flex: 1, minWidth: '45%', padding: 16, borderRadius: 12, alignItems: 'center' },
  statValue: { fontSize: 28, fontWeight: '700', marginBottom: 4 },
  statLabel: { fontSize: 12, fontWeight: '500' },
  favoritesRow: { flexDirection: 'row', padding: 16, borderRadius: 12 },
  favoriteItem: { flex: 1 },
  favoriteDivider: { width: 1, marginHorizontal: 16 },
  favoriteLabel: { fontSize: 12, marginBottom: 4 },
  favoriteValue: { fontSize: 15, fontWeight: '600', textTransform: 'capitalize' },
  chartCard: { padding: 16, borderRadius: 12 },
  chartTitle: { fontSize: 17, fontWeight: '600', marginBottom: 4 },
  chartSubtitle: { fontSize: 13, marginBottom: 16 },
  methodList: { gap: 12, marginTop: 8 },
  methodItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  methodInfo: { flexDirection: 'row', alignItems: 'center', gap: 8, width: 100 },
  methodRank: { fontSize: 12, fontWeight: '700' },
  methodName: { fontSize: 14, fontWeight: '500', textTransform: 'capitalize' },
  methodBar: { flex: 1, height: 8, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 4, overflow: 'hidden' },
  methodBarFill: { height: '100%', borderRadius: 4 },
  methodCount: { fontSize: 12, fontWeight: '600', width: 30, textAlign: 'right' },
  entriesSection: { marginTop: 8 },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  card: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  cardTitle: { fontSize: 17, fontWeight: '600' },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 14, fontWeight: '600' },
  cardMethod: { fontSize: 12, fontWeight: '600', letterSpacing: 0.5, marginBottom: 8 },
  cardDetails: { marginBottom: 12 },
  cardDetail: { fontSize: 13 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardDate: { fontSize: 13 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyTitle: { fontSize: 22, fontWeight: '700' },
  emptyText: { fontSize: 15, textAlign: 'center', lineHeight: 22, paddingHorizontal: 32 }
});
