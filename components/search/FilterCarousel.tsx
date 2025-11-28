import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { X } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { DEFAULT_FILTERS } from '../../constants/filters';
import { iconSizes } from '../../constants/icons';
import { haptics } from '../../utils/haptics';

interface FilterCarouselProps {
  selectedFilters: string[];
  onFilterChange: (filterId: string) => void;
  onClearAll?: () => void;
  resultCount?: number;
}

export default function FilterCarousel({
  selectedFilters,
  onFilterChange,
  onClearAll,
  resultCount,
}: FilterCarouselProps) {
  const hasActiveFilters = selectedFilters.length > 0;

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {/* Clear All button when filters active */}
        {hasActiveFilters && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              haptics.light();
              onClearAll?.();
            }}
            activeOpacity={0.7}
          >
            <X size={iconSizes.xs} color={colors.gray700} />
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}

        {DEFAULT_FILTERS.map((filter) => {
          const isActive = selectedFilters.includes(filter.id);
          const IconComponent = filter.icon;

          return (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.chip,
                isActive && styles.activeChip,
              ]}
              onPress={() => {
                haptics.light();
                onFilterChange(filter.id);
              }}
              activeOpacity={0.7}
            >
              <IconComponent
                size={iconSizes.sm}
                color={isActive ? colors.white : colors.gray700}
                strokeWidth={2}
              />
              <Text
                style={[
                  styles.chipText,
                  isActive && styles.activeChipText,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Filter count badge and result preview */}
      {hasActiveFilters && (
        <View style={styles.filterInfo}>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{selectedFilters.length}</Text>
          </View>
          {resultCount !== undefined && (
            <Text style={styles.resultPreview}>
              {resultCount} {resultCount === 1 ? 'result' : 'results'}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.sm,
  },
  container: {
    marginHorizontal: -spacing.md,
  },
  content: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.gray200,
  },
  clearButtonText: {
    ...typography.small,
    color: colors.gray700,
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
  chipText: {
    ...typography.small,
    color: colors.gray700,
  },
  activeChipText: {
    color: colors.white,
  },
  filterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  countBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  countText: {
    ...typography.smallBold,
    color: colors.white,
    fontSize: 11,
  },
  resultPreview: {
    ...typography.small,
    color: colors.gray600,
  },
});
