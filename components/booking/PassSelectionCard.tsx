/**
 * PassSelectionCard - Enhanced pass selection card with best value badge
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check, Sparkles } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import { haptics } from '../../utils/haptics';

export interface PassOption {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  duration: string;
  features: string[];
  isBestValue?: boolean;
  savings?: number;
}

interface PassSelectionCardProps {
  pass: PassOption;
  isSelected: boolean;
  onSelect: (passId: string) => void;
}

export function PassSelectionCard({ pass, isSelected, onSelect }: PassSelectionCardProps) {
  const hasDiscount = pass.originalPrice && pass.originalPrice > pass.price;
  const savingsPercent = hasDiscount
    ? Math.round(((pass.originalPrice! - pass.price) / pass.originalPrice!) * 100)
    : 0;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.containerSelected,
        pass.isBestValue && styles.containerBestValue,
      ]}
      onPress={() => {
        haptics.selection();
        onSelect(pass.id);
      }}
      activeOpacity={0.8}
    >
      {/* Best Value Badge */}
      {pass.isBestValue && (
        <View style={styles.bestValueBadge}>
          <Sparkles size={iconSizes.xs} color={colors.white} />
          <Text style={styles.bestValueText}>Best Value</Text>
        </View>
      )}

      {/* Selection indicator */}
      <View style={[styles.radio, isSelected && styles.radioSelected]}>
        {isSelected && <View style={styles.radioInner} />}
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={[styles.name, isSelected && styles.nameSelected]}>{pass.name}</Text>
          <Text style={styles.duration}>{pass.duration}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={[styles.price, isSelected && styles.priceSelected]}>${pass.price}</Text>
          {hasDiscount && (
            <>
              <Text style={styles.originalPrice}>${pass.originalPrice}</Text>
              <View style={styles.savingsBadge}>
                <Text style={styles.savingsText}>Save {savingsPercent}%</Text>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Features */}
      <View style={styles.features}>
        {pass.features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Check size={iconSizes.sm} color={isSelected ? colors.primary : colors.success} />
            <Text style={[styles.featureText, isSelected && styles.featureTextSelected]}>
              {feature}
            </Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}

// Pre-defined pass options
export const DEFAULT_PASS_OPTIONS: PassOption[] = [
  {
    id: 'day',
    name: 'Day Pass',
    price: 25,
    duration: '24 hours',
    features: ['Full gym access', 'Locker room', 'Towel service'],
  },
  {
    id: 'week',
    name: 'Week Pass',
    price: 75,
    originalPrice: 100,
    duration: '7 days',
    features: ['Full gym access', 'Locker room', 'Towel service', 'Group classes'],
    isBestValue: true,
    savings: 25,
  },
  {
    id: 'month',
    name: 'Month Pass',
    price: 150,
    originalPrice: 200,
    duration: '30 days',
    features: ['Full gym access', 'Locker room', 'Towel service', 'Group classes', 'Personal training session'],
    savings: 50,
  },
];

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    paddingLeft: spacing.xl + spacing.lg,
    borderWidth: 2,
    borderColor: colors.gray200,
    position: 'relative',
    overflow: 'hidden',
  },
  containerSelected: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  containerBestValue: { borderColor: colors.primary },
  bestValueBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderBottomLeftRadius: radius.md,
  },
  bestValueText: { ...typography.tiny, color: colors.white, fontWeight: '700' },
  radio: { position: 'absolute', top: spacing.lg, left: spacing.lg, width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.gray300, alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: colors.primary },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },
  header: { marginBottom: spacing.md },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  name: { ...typography.h4, color: colors.black },
  nameSelected: { color: colors.primary },
  duration: { ...typography.small, color: colors.gray600 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  price: { ...typography.h3, color: colors.black },
  priceSelected: { color: colors.primary },
  originalPrice: { ...typography.body, color: colors.gray500, textDecorationLine: 'line-through' },
  savingsBadge: { backgroundColor: colors.successLight, paddingHorizontal: spacing.sm, paddingVertical: spacing.xxs, borderRadius: radius.sm },
  savingsText: { ...typography.tiny, color: colors.success, fontWeight: '600' },
  features: { gap: spacing.sm },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  featureText: { ...typography.small, color: colors.gray700 },
  featureTextSelected: { color: colors.gray800 },
});

export default PassSelectionCard;

