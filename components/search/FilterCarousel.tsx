import React, { useMemo } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { DEFAULT_FILTERS } from '../../constants/filters';

interface FilterCarouselProps {
  selectedFilters: string[];
  onFilterChange: (filterId: string) => void;
}

export default function FilterCarousel({ selectedFilters, onFilterChange }: FilterCarouselProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {DEFAULT_FILTERS.map((filter) => (
        <TouchableOpacity
          key={filter.id}
          style={[
            styles.chip,
            selectedFilters.includes(filter.id) && styles.activeChip,
          ]}
          onPress={() => onFilterChange(filter.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.chipIcon}>{filter.icon}</Text>
          <Text
            style={[
              styles.chipText,
              selectedFilters.includes(filter.id) && styles.activeChipText,
            ]}
          >
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: -spacing.md,
  },
  content: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.gray100,
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  activeChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipIcon: {
    fontSize: 14,
  },
  chipText: {
    ...typography.small,
    color: colors.gray700,
  },
  activeChipText: {
    color: colors.white,
  },
});
