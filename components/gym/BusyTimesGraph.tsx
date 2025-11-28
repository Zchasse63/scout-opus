/**
 * BusyTimesGraph - Hour-by-hour popularity graph showing peak/off-peak times
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Clock, TrendingUp, TrendingDown } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import { useTheme } from '../../contexts/ThemeContext';

interface BusyTimesData {
  hour: number; // 0-23
  percentage: number; // 0-100 busyness
}

interface BusyTimesGraphProps {
  data?: BusyTimesData[];
  currentHour?: number;
  dayOfWeek?: string;
  accessibilityLabel?: string;
}

// Default mock data for demo
const DEFAULT_DATA: BusyTimesData[] = [
  { hour: 5, percentage: 10 }, { hour: 6, percentage: 25 },
  { hour: 7, percentage: 45 }, { hour: 8, percentage: 65 },
  { hour: 9, percentage: 50 }, { hour: 10, percentage: 35 },
  { hour: 11, percentage: 40 }, { hour: 12, percentage: 55 },
  { hour: 13, percentage: 45 }, { hour: 14, percentage: 35 },
  { hour: 15, percentage: 30 }, { hour: 16, percentage: 45 },
  { hour: 17, percentage: 75 }, { hour: 18, percentage: 90 },
  { hour: 19, percentage: 85 }, { hour: 20, percentage: 60 },
  { hour: 21, percentage: 40 }, { hour: 22, percentage: 20 },
];

export function BusyTimesGraph({
  data = DEFAULT_DATA,
  currentHour = new Date().getHours(),
  dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' }),
  accessibilityLabel,
}: BusyTimesGraphProps) {
  const { colors: themeColors } = useTheme();
  
  const formatHour = (hour: number) => {
    if (hour === 0) return '12a';
    if (hour === 12) return '12p';
    return hour < 12 ? `${hour}a` : `${hour - 12}p`;
  };

  const getBusynessLevel = (percentage: number): { label: string; color: string } => {
    if (percentage < 30) return { label: 'Not busy', color: colors.success };
    if (percentage < 60) return { label: 'Moderate', color: colors.warning };
    return { label: 'Very busy', color: colors.error };
  };

  const currentBusyness = useMemo(() => {
    const current = data.find(d => d.hour === currentHour);
    return current ? getBusynessLevel(current.percentage) : null;
  }, [data, currentHour]);

  const maxPercentage = Math.max(...data.map(d => d.percentage));
  const BAR_HEIGHT = 60;

  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.card }]}
      accessibilityLabel={accessibilityLabel || `Busy times for ${dayOfWeek}`}
      accessibilityRole="none"
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Clock size={iconSizes.md} color={themeColors.text} />
          <Text style={[styles.title, { color: themeColors.text }]}>Busy times</Text>
        </View>
        <Text style={[styles.dayLabel, { color: themeColors.textSecondary }]}>{dayOfWeek}</Text>
      </View>

      {/* Current status */}
      {currentBusyness && (
        <View style={[styles.currentStatus, { backgroundColor: `${currentBusyness.color}15` }]}>
          {currentBusyness.label === 'Not busy' ? (
            <TrendingDown size={iconSizes.sm} color={currentBusyness.color} />
          ) : (
            <TrendingUp size={iconSizes.sm} color={currentBusyness.color} />
          )}
          <Text style={[styles.statusText, { color: currentBusyness.color }]}>
            {currentBusyness.label} right now
          </Text>
        </View>
      )}

      {/* Graph */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.graphContainer}
      >
        {data.map((item) => {
          const barHeight = (item.percentage / maxPercentage) * BAR_HEIGHT;
          const isCurrent = item.hour === currentHour;
          const busyness = getBusynessLevel(item.percentage);

          return (
            <View
              key={item.hour}
              style={styles.barColumn}
              accessibilityLabel={`${formatHour(item.hour)}: ${busyness.label}`}
            >
              <View style={[styles.barWrapper, { height: BAR_HEIGHT }]}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: barHeight,
                      backgroundColor: isCurrent ? colors.primary : themeColors.border,
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.hourLabel,
                  { color: isCurrent ? colors.primary : themeColors.textSecondary },
                  isCurrent && styles.hourLabelCurrent,
                ]}
              >
                {formatHour(item.hour)}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
          <Text style={[styles.legendText, { color: themeColors.textSecondary }]}>Not busy</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.warning }]} />
          <Text style={[styles.legendText, { color: themeColors.textSecondary }]}>Moderate</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.error }]} />
          <Text style={[styles.legendText, { color: themeColors.textSecondary }]}>Very busy</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: radius.lg, padding: spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  title: { ...typography.bodyBold },
  dayLabel: { ...typography.small },
  currentStatus: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.full, alignSelf: 'flex-start', marginBottom: spacing.md },
  statusText: { ...typography.smallBold },
  graphContainer: { paddingVertical: spacing.sm, gap: spacing.xs },
  barColumn: { alignItems: 'center', width: 28 },
  barWrapper: { justifyContent: 'flex-end' },
  bar: { width: 16, borderRadius: 4, minHeight: 4 },
  hourLabel: { ...typography.tiny, marginTop: spacing.xs },
  hourLabelCurrent: { fontWeight: '700' },
  legend: { flexDirection: 'row', justifyContent: 'center', gap: spacing.lg, marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.gray200 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { ...typography.tiny },
});

export default BusyTimesGraph;

