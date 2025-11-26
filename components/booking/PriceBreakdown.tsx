import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';

interface PriceBreakdownProps {
  passPrice: number;
  platformFee: number;
  total: number;
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  passPrice,
  platformFee,
  total,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Pass Price</Text>
        <Text style={styles.value}>${passPrice.toFixed(2)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Service Fee (15%)</Text>
        <Text style={styles.value}>${platformFee.toFixed(2)}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray100,
    borderRadius: 12,
    padding: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: typography.sizes.base,
    color: colors.gray700,
  },
  value: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.black,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray300,
    marginVertical: spacing.sm,
  },
  totalLabel: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.black,
  },
  totalValue: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.primary,
  },
});
