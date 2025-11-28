/**
 * PriceText component for consistent price display
 * Uses tabular numbers for proper alignment
 */

import React from 'react';
import { Text, StyleSheet, TextStyle, Platform } from 'react-native';
import { colors } from '../../constants/colors';
import { typography, fontSizes } from '../../constants/typography';

interface PriceTextProps {
  amount: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  strikethrough?: boolean;
  style?: TextStyle;
  showCents?: boolean;
}

export default function PriceText({
  amount,
  currency = '$',
  size = 'md',
  color = colors.gray900,
  strikethrough = false,
  style,
  showCents = false,
}: PriceTextProps) {
  const formattedAmount = showCents
    ? amount.toFixed(2)
    : Math.floor(amount).toString();

  return (
    <Text
      style={[
        styles.base,
        styles[size],
        { color },
        strikethrough && styles.strikethrough,
        style,
      ]}
    >
      {currency}
      {formattedAmount}
    </Text>
  );
}

// Savings badge component
interface SavingsBadgeProps {
  originalPrice: number;
  salePrice: number;
  style?: TextStyle;
}

export function SavingsBadge({ originalPrice, salePrice, style }: SavingsBadgeProps) {
  const savings = Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  
  if (savings <= 0) return null;

  return (
    <Text style={[styles.savingsBadge, style]}>
      Save {savings}%
    </Text>
  );
}

// Price range component
interface PriceRangeProps {
  min: number;
  max: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  style?: TextStyle;
}

export function PriceRange({
  min,
  max,
  currency = '$',
  size = 'md',
  color = colors.gray900,
  style,
}: PriceRangeProps) {
  return (
    <Text style={[styles.base, styles[size], { color }, style]}>
      {currency}{Math.floor(min)} - {currency}{Math.floor(max)}
    </Text>
  );
}

// Per unit price (e.g., "$25/day")
interface PerUnitPriceProps {
  amount: number;
  unit: string;
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  style?: TextStyle;
}

export function PerUnitPrice({
  amount,
  unit,
  currency = '$',
  size = 'md',
  color = colors.gray900,
  style,
}: PerUnitPriceProps) {
  return (
    <Text style={[styles.base, styles[size], { color }, style]}>
      {currency}{Math.floor(amount)}
      <Text style={styles.unit}>/{unit}</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontWeight: '700',
    // Use tabular numbers for proper alignment
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.5,
  },
  sm: {
    fontSize: fontSizes.sm,
    lineHeight: 20,
  },
  md: {
    fontSize: fontSizes.lg,
    lineHeight: 24,
  },
  lg: {
    fontSize: fontSizes.xxl,
    lineHeight: 32,
  },
  xl: {
    fontSize: fontSizes.display,
    lineHeight: 40,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: colors.gray500,
    fontWeight: '400',
  },
  savingsBadge: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
    color: colors.success,
    backgroundColor: colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  unit: {
    fontSize: fontSizes.sm,
    fontWeight: '400',
    color: colors.gray600,
  },
});

