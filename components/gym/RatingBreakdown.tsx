/**
 * RatingBreakdown - Visual breakdown of ratings by category
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';

interface RatingBreakdownProps {
  averageRating: number;
  totalReviews: number;
  breakdown: { 5: number; 4: number; 3: number; 2: number; 1: number };
  categories?: {
    cleanliness: number;
    equipment: number;
    value: number;
    staff: number;
    location: number;
  };
}

export function RatingBreakdown({
  averageRating,
  totalReviews,
  breakdown,
  categories,
}: RatingBreakdownProps) {
  const maxCount = Math.max(...Object.values(breakdown));

  const categoryLabels: Record<string, string> = {
    cleanliness: 'Cleanliness',
    equipment: 'Equipment',
    value: 'Value',
    staff: 'Staff',
    location: 'Location',
  };

  return (
    <View style={styles.container}>
      {/* Overall rating */}
      <View style={styles.overallSection}>
        <Text style={styles.overallRating}>{averageRating.toFixed(1)}</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={iconSizes.md}
              color={star <= Math.round(averageRating) ? colors.warning : colors.gray300}
              fill={star <= Math.round(averageRating) ? colors.warning : 'transparent'}
            />
          ))}
        </View>
        <Text style={styles.totalReviews}>{totalReviews} reviews</Text>
      </View>

      {/* Star breakdown */}
      <View style={styles.breakdownSection}>
        {[5, 4, 3, 2, 1].map((stars) => (
          <View key={stars} style={styles.breakdownRow}>
            <Text style={styles.starLabel}>{stars}</Text>
            <Star size={iconSizes.xs} color={colors.warning} fill={colors.warning} />
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  { width: maxCount > 0 ? `${(breakdown[stars as keyof typeof breakdown] / maxCount) * 100}%` : '0%' },
                ]}
              />
            </View>
            <Text style={styles.countLabel}>{breakdown[stars as keyof typeof breakdown]}</Text>
          </View>
        ))}
      </View>

      {/* Category ratings */}
      {categories && (
        <View style={styles.categoriesSection}>
          <Text style={styles.categoriesTitle}>Rating by category</Text>
          {Object.entries(categories).map(([key, value]) => (
            <View key={key} style={styles.categoryRow}>
              <Text style={styles.categoryLabel}>{categoryLabels[key]}</Text>
              <View style={styles.categoryRating}>
                <View style={styles.categoryBarContainer}>
                  <View style={[styles.categoryBar, { width: `${(value / 5) * 100}%` }]} />
                </View>
                <Text style={styles.categoryValue}>{value.toFixed(1)}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xl },
  overallSection: { alignItems: 'center', gap: spacing.xs },
  overallRating: { fontSize: 48, fontWeight: '700', color: colors.black },
  starsRow: { flexDirection: 'row', gap: spacing.xxs },
  totalReviews: { ...typography.small, color: colors.gray600 },
  breakdownSection: { gap: spacing.sm },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  starLabel: { ...typography.small, color: colors.gray700, width: 12 },
  barContainer: { flex: 1, height: 8, backgroundColor: colors.gray200, borderRadius: 4, overflow: 'hidden' },
  bar: { height: '100%', backgroundColor: colors.warning, borderRadius: 4 },
  countLabel: { ...typography.small, color: colors.gray600, width: 24, textAlign: 'right' },
  categoriesSection: { gap: spacing.md },
  categoriesTitle: { ...typography.bodyBold, color: colors.black },
  categoryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoryLabel: { ...typography.body, color: colors.gray700, flex: 1 },
  categoryRating: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  categoryBarContainer: { flex: 1, height: 6, backgroundColor: colors.gray200, borderRadius: 3, overflow: 'hidden' },
  categoryBar: { height: '100%', backgroundColor: colors.primary, borderRadius: 3 },
  categoryValue: { ...typography.smallBold, color: colors.black, width: 28 },
});

export default RatingBreakdown;

