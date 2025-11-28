import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PassType } from './CheckoutForm';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';

interface PassTypeSelectorProps {
  selectedType: PassType;
  onSelect: (type: PassType) => void;
  dayPrice: number;
  weekPrice?: number;
  monthPrice?: number;
}

export const PassTypeSelector: React.FC<PassTypeSelectorProps> = ({
  selectedType,
  onSelect,
  dayPrice,
  weekPrice,
  monthPrice,
}) => {
  const options = [
    {
      type: 'day' as PassType,
      label: 'Day Pass',
      price: dayPrice,
      description: 'Single day access',
      available: true,
    },
    {
      type: 'week' as PassType,
      label: 'Week Pass',
      price: weekPrice || dayPrice * 5,
      description: '7 days access',
      available: !!weekPrice,
      savings: weekPrice ? ((dayPrice * 7 - weekPrice) / (dayPrice * 7)) * 100 : 0,
    },
    {
      type: 'month' as PassType,
      label: 'Month Pass',
      price: monthPrice || dayPrice * 20,
      description: '30 days access',
      available: !!monthPrice,
      savings: monthPrice ? ((dayPrice * 30 - monthPrice) / (dayPrice * 30)) * 100 : 0,
    },
  ];

  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.type}
          style={[
            styles.option,
            selectedType === option.type && styles.optionSelected,
            !option.available && styles.optionDisabled,
          ]}
          onPress={() => option.available && onSelect(option.type)}
          disabled={!option.available}
        >
          <View style={styles.optionContent}>
            <Text style={[
              styles.label,
              selectedType === option.type && styles.labelSelected,
            ]}>
              {option.label}
            </Text>
            <Text style={[
              styles.description,
              selectedType === option.type && styles.descriptionSelected,
            ]}>
              {option.description}
            </Text>
            {option.savings && option.savings > 0 && (
              <Text style={styles.savings}>
                Save {option.savings?.toFixed(0)}%
              </Text>
            )}
          </View>
          <Text style={[
            styles.price,
            selectedType === option.type && styles.priceSelected,
          ]}>
            ${option.price}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.gray100,
    backgroundColor: colors.white,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}05`,
  },
  optionDisabled: {
    opacity: 0.5,
  },
  optionContent: {
    flex: 1,
  },
  label: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.black,
    marginBottom: spacing.xxs,
  },
  labelSelected: {
    color: colors.primary,
  },
  description: {
    fontSize: typography.sizes.sm,
    color: colors.gray500,
  },
  descriptionSelected: {
    color: colors.primary,
  },
  savings: {
    fontSize: typography.sizes.xs,
    color: colors.success,
    marginTop: spacing.xxs,
    fontWeight: '600',
  },
  price: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.black,
  },
  priceSelected: {
    color: colors.primary,
  },
});
