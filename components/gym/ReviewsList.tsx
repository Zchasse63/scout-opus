/**
 * ReviewsList - Paginated reviews list with filtering and sorting
 */

import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import { Filter, ChevronDown, X, Star, Search } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius, padding } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import { haptics } from '../../utils/haptics';
import { useTheme } from '../../contexts/ThemeContext';
import { ReviewCard } from './ReviewCard';
import { Skeleton } from '../ui/Skeleton';
import type { Review } from '../../hooks/useGymReviews';

type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful';
type FilterOption = 'all' | '5' | '4' | '3' | '2' | '1' | 'with_photos';

interface ReviewsListProps {
  reviews: Review[];
  totalCount: number;
  isLoading?: boolean;
  onLoadMore?: () => void;
  onHelpful?: (reviewId: string) => void;
  hasMore?: boolean;
  accessibilityLabel?: string;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'highest', label: 'Highest rated' },
  { value: 'lowest', label: 'Lowest rated' },
  { value: 'helpful', label: 'Most helpful' },
];

const FILTER_OPTIONS: { value: FilterOption; label: string }[] = [
  { value: 'all', label: 'All ratings' },
  { value: '5', label: '5 stars' },
  { value: '4', label: '4 stars' },
  { value: '3', label: '3 stars' },
  { value: '2', label: '2 stars' },
  { value: '1', label: '1 star' },
  { value: 'with_photos', label: 'With photos' },
];

export function ReviewsList({
  reviews,
  totalCount,
  isLoading = false,
  onLoadMore,
  onHelpful,
  hasMore = false,
  accessibilityLabel,
}: ReviewsListProps) {
  const { colors: themeColors } = useTheme();
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [showSortModal, setShowSortModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const filteredReviews = useCallback(() => {
    let result = [...reviews];
    if (filterBy !== 'all') {
      if (filterBy === 'with_photos') {
        result = result.filter(r => r.photos && r.photos.length > 0);
      } else {
        result = result.filter(r => r.rating === parseInt(filterBy));
      }
    }
    switch (sortBy) {
      case 'oldest': result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); break;
      case 'highest': result.sort((a, b) => b.rating - a.rating); break;
      case 'lowest': result.sort((a, b) => a.rating - b.rating); break;
      case 'helpful': result.sort((a, b) => b.helpful - a.helpful); break;
      default: result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return result;
  }, [reviews, sortBy, filterBy])();

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.headerText, { color: themeColors.text }]}>{totalCount} reviews</Text>
      <View style={styles.headerActions}>
        <TouchableOpacity
          style={[styles.filterButton, { borderColor: themeColors.border }]}
          onPress={() => { haptics.light(); setShowSortModal(true); }}
          accessibilityLabel={`Sort by ${SORT_OPTIONS.find(o => o.value === sortBy)?.label}`}
        >
          <Text style={[styles.filterButtonText, { color: themeColors.text }]}>
            {SORT_OPTIONS.find(o => o.value === sortBy)?.label}
          </Text>
          <ChevronDown size={iconSizes.sm} color={themeColors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filterBy !== 'all' && styles.filterButtonActive]}
          onPress={() => { haptics.light(); setShowFilterModal(true); }}
          accessibilityLabel="Filter reviews"
        >
          <Filter size={iconSizes.sm} color={filterBy !== 'all' ? colors.primary : themeColors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Search size={iconSizes.xxl} color={themeColors.textSecondary} />
      <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>No reviews match your filters</Text>
    </View>
  );

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <TouchableOpacity style={styles.loadMoreButton} onPress={onLoadMore}>
        <Text style={styles.loadMoreText}>Load more reviews</Text>
      </TouchableOpacity>
    );
  };

  const renderOptionModal = (visible: boolean, onClose: () => void, options: { value: string; label: string }[], selected: string, onSelect: (value: any) => void, title: string) => (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: themeColors.background }]}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}><X size={iconSizes.lg} color={themeColors.text} /></TouchableOpacity>
          <Text style={[styles.modalTitle, { color: themeColors.text }]}>{title}</Text>
          <View style={{ width: iconSizes.lg }} />
        </View>
        {options.map(option => (
          <TouchableOpacity
            key={option.value}
            style={[styles.optionItem, selected === option.value && styles.optionItemActive]}
            onPress={() => { haptics.selection(); onSelect(option.value); onClose(); }}
          >
            <Text style={[styles.optionText, { color: themeColors.text }, selected === option.value && styles.optionTextActive]}>
              {option.label}
            </Text>
            {selected === option.value && <Star size={iconSizes.sm} color={colors.primary} fill={colors.primary} />}
          </TouchableOpacity>
        ))}
      </SafeAreaView>
    </Modal>
  );

  if (isLoading) {
    return (
      <View accessibilityLabel="Loading reviews">
        {[1, 2, 3].map(i => (
          <View key={i} style={styles.skeletonCard}>
            <View style={styles.skeletonHeader}><Skeleton width={44} height={44} borderRadius={22} /><View style={{ flex: 1, gap: spacing.xs }}><Skeleton width={120} height={16} /><Skeleton width={80} height={14} /></View></View>
            <Skeleton width="100%" height={60} />
          </View>
        ))}
      </View>
    );
  }

  return (
    <View accessibilityLabel={accessibilityLabel || `${totalCount} reviews`}>
      <FlatList
        data={filteredReviews}
        renderItem={({ item }) => <ReviewCard review={item} onHelpful={onHelpful} />}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        scrollEnabled={false}
      />
      {renderOptionModal(showSortModal, () => setShowSortModal(false), SORT_OPTIONS, sortBy, setSortBy, 'Sort by')}
      {renderOptionModal(showFilterModal, () => setShowFilterModal(false), FILTER_OPTIONS, filterBy, setFilterBy, 'Filter by')}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.md },
  headerText: { ...typography.h4 },
  headerActions: { flexDirection: 'row', gap: spacing.sm },
  filterButton: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.full, borderWidth: 1, borderColor: colors.gray300 },
  filterButtonActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  filterButtonText: { ...typography.small },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxl, gap: spacing.md },
  emptyText: { ...typography.body },
  loadMoreButton: { alignItems: 'center', paddingVertical: spacing.lg },
  loadMoreText: { ...typography.bodyBold, color: colors.primary },
  skeletonCard: { paddingVertical: spacing.lg, gap: spacing.md },
  skeletonHeader: { flexDirection: 'row', gap: spacing.md },
  modalContainer: { flex: 1 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: padding.screenHorizontal, borderBottomWidth: 1, borderBottomColor: colors.gray200 },
  modalTitle: { ...typography.h4 },
  optionItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.lg, paddingHorizontal: padding.screenHorizontal, borderBottomWidth: 1, borderBottomColor: colors.gray100 },
  optionItemActive: { backgroundColor: colors.primaryLight },
  optionText: { ...typography.body },
  optionTextActive: { color: colors.primary, fontWeight: '600' },
});

export default ReviewsList;

