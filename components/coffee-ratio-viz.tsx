import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Line, Circle } from 'react-native-svg';
import { useColors } from '@/hooks/use-colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const VIZ_WIDTH = Math.min(SCREEN_WIDTH - 80, 300);
const VIZ_HEIGHT = 280;

export interface CoffeeRatio {
  espresso?: number;
  milk?: number;
  foam?: number;
  water?: number;
}

interface CoffeeRatioVizProps {
  ratio: CoffeeRatio;
  title: string;
}

/**
 * Coffee Ratio Visualization Component
 * Displays an interactive SVG layer diagram showing espresso/milk/foam/water ratios
 */
export function CoffeeRatioViz({ ratio, title }: CoffeeRatioVizProps) {
  const colors = useColors();
  
  // Calculate total and percentages
  const total = (ratio.espresso || 0) + (ratio.milk || 0) + (ratio.foam || 0) + (ratio.water || 0);
  const espressoPercent = ((ratio.espresso || 0) / total) * 100;
  const milkPercent = ((ratio.milk || 0) / total) * 100;
  const foamPercent = ((ratio.foam || 0) / total) * 100;
  const waterPercent = ((ratio.water || 0) / total) * 100;

  // Calculate layer heights
  const glassHeight = VIZ_HEIGHT - 60;
  const glassWidth = VIZ_WIDTH * 0.6;
  const glassX = (VIZ_WIDTH - glassWidth) / 2;
  const glassY = 40;

  // Layer positions (from bottom to top)
  let currentY = glassY + glassHeight;
  const layers: Array<{ color: string; height: number; y: number; label: string; value: number }> = [];

  if (ratio.espresso) {
    const height = (espressoPercent / 100) * glassHeight;
    currentY -= height;
    layers.push({
      color: '#4A2C2A',
      height,
      y: currentY,
      label: 'Espresso',
      value: ratio.espresso,
    });
  }

  if (ratio.milk) {
    const height = (milkPercent / 100) * glassHeight;
    currentY -= height;
    layers.push({
      color: '#F5F5DC',
      height,
      y: currentY,
      label: 'Steamed Milk',
      value: ratio.milk,
    });
  }

  if (ratio.foam) {
    const height = (foamPercent / 100) * glassHeight;
    currentY -= height;
    layers.push({
      color: '#FFFFFF',
      height,
      y: currentY,
      label: 'Milk Foam',
      value: ratio.foam,
    });
  }

  if (ratio.water) {
    const height = (waterPercent / 100) * glassHeight;
    currentY -= height;
    layers.push({
      color: '#A0C4E8',
      height,
      y: currentY,
      label: 'Water',
      value: ratio.water,
    });
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
      
      <View style={styles.vizContainer}>
        <Svg width={VIZ_WIDTH} height={VIZ_HEIGHT}>
          {/* Glass outline */}
          <Rect
            x={glassX}
            y={glassY}
            width={glassWidth}
            height={glassHeight}
            fill="none"
            stroke={colors.border}
            strokeWidth={2}
            rx={8}
          />

          {/* Layers */}
          {layers.map((layer, index) => (
            <Rect
              key={index}
              x={glassX + 2}
              y={layer.y}
              width={glassWidth - 4}
              height={layer.height}
              fill={layer.color}
              opacity={0.9}
            />
          ))}

          {/* Measurement lines and labels */}
          {layers.map((layer, index) => {
            const lineY = layer.y + layer.height / 2;
            const lineEndX = glassX + glassWidth + 10;
            const labelX = lineEndX + 8;
            
            return (
              <React.Fragment key={`label-${index}`}>
                {/* Horizontal line */}
                <Line
                  x1={glassX + glassWidth}
                  y1={lineY}
                  x2={lineEndX}
                  y2={lineY}
                  stroke={colors.muted}
                  strokeWidth={1}
                  strokeDasharray="2,2"
                />
                {/* Dot */}
                <Circle
                  cx={lineEndX}
                  cy={lineY}
                  r={3}
                  fill={layer.color}
                  stroke={colors.muted}
                  strokeWidth={1}
                />
              </React.Fragment>
            );
          })}
        </Svg>

        {/* Legend */}
        <View style={styles.legend}>
          {layers.map((layer, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: layer.color }]} />
              <View style={styles.legendText}>
                <Text style={[styles.legendLabel, { color: colors.foreground }]}>
                  {layer.label}
                </Text>
                <Text style={[styles.legendValue, { color: colors.muted }]}>
                  {layer.value}ml ({Math.round((layer.value / total) * 100)}%)
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Total */}
      <View style={[styles.totalContainer, { backgroundColor: `${colors.primary}10` }]}>
        <Text style={[styles.totalLabel, { color: colors.muted }]}>Total Volume</Text>
        <Text style={[styles.totalValue, { color: colors.primary }]}>{total}ml</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  vizContainer: {
    alignItems: 'center',
  },
  legend: {
    marginTop: 20,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 12,
  },
  legendText: {
    flex: 1,
  },
  legendLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  legendValue: {
    fontSize: 13,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
  },
});
