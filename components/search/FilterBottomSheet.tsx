/**
 * FilterBottomSheet - Advanced filters in a bottom sheet modal
 */

import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, SafeAreaView,
} from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { X, DollarSign, MapPin, Star, Clock, ChevronDown } from 'lucide-react-native';
import Slider from '@react-native-community/slider';
import { colors } from '../../constants/colors';
import { spacing, padding, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import { haptics } from '../../utils/haptics';

interface FilterState {
  priceRange: [number, number];
  distance: number;
  rating: number;
  openNow: boolean;
  amenities: string[];
}

interface FilterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  resultCount?: number;
  initialFilters?: Partial<FilterState>;
}

const AMENITIES = [
  { id: 'pool', label: 'Pool' },
  { id: 'sauna', label: 'Sauna' },
  { id: 'classes', label: 'Classes' },
  { id: 'towels', label: 'Towels' },
  { id: 'lockers', label: 'Lockers' },
  { id: 'parking', label: 'Parking' },
  { id: 'showers', label: 'Showers' },
  { id: 'wifi', label: 'WiFi' },
];

const DEFAULT_FILTERS: FilterState = {
  priceRange: [0, 100],
  distance: 10,
  rating: 0,
  openNow: false,
  amenities: [],
};

export function FilterBottomSheet({
  visible, onClose, onApply, resultCount, initialFilters,
}: FilterBottomSheetProps) {
  const [filters, setFilters] = useState<FilterState>({ ...DEFAULT_FILTERS, ...initialFilters });

  const handleReset = useCallback(() => {
    haptics.light();
    setFilters(DEFAULT_FILTERS);
  }, []);

  const handleApply = useCallback(() => {
    haptics.medium();
    onApply(filters);
    onClose();
  }, [filters, onApply, onClose]);

  const toggleAmenity = (id: string) => {
    haptics.selection();
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(id)
        ? prev.amenities.filter((a) => a !== id)
        : [...prev.amenities, id],
    }));
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={iconSizes.lg} color={colors.black} />
          </TouchableOpacity>
          <Text style={styles.title}>Filters</Text>
          <TouchableOpacity onPress={handleReset}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Price Range */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <DollarSign size={iconSizes.md} color={colors.black} />
              <Text style={styles.sectionTitle}>Price Range</Text>
            </View>
            <Text style={styles.rangeText}>
              ${filters.priceRange[0]} - ${filters.priceRange[1]}+
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={filters.priceRange[1]}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, priceRange: [0, Math.round(value)] }))
              }
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.gray300}
              thumbTintColor={colors.primary}
            />
          </View>

          {/* Distance */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MapPin size={iconSizes.md} color={colors.black} />
              <Text style={styles.sectionTitle}>Distance</Text>
            </View>
            <Text style={styles.rangeText}>Within {filters.distance} miles</Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={50}
              value={filters.distance}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, distance: Math.round(value) }))
              }
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.gray300}
              thumbTintColor={colors.primary}
            />
          </View>

          {/* Rating */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Star size={iconSizes.md} color={colors.black} />
              <Text style={styles.sectionTitle}>Minimum Rating</Text>
            </View>
            <View style={styles.ratingButtons}>
              {[0, 3, 3.5, 4, 4.5].map((rating) => (
                <TouchableOpacity
                  key={rating}
                  style={[styles.ratingButton, filters.rating === rating && styles.ratingButtonActive]}
                  onPress={() => { haptics.selection(); setFilters((prev) => ({ ...prev, rating })); }}
                >
                  <Text style={[styles.ratingText, filters.rating === rating && styles.ratingTextActive]}>
                    {rating === 0 ? 'Any' : `${rating}+`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Amenities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesGrid}>
              {AMENITIES.map((amenity) => (
                <TouchableOpacity
                  key={amenity.id}
                  style={[styles.amenityChip, filters.amenities.includes(amenity.id) && styles.amenityChipActive]}
                  onPress={() => toggleAmenity(amenity.id)}
                >
                  <Text style={[styles.amenityText, filters.amenities.includes(amenity.id) && styles.amenityTextActive]}>
                    {amenity.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>
              Show {resultCount !== undefined ? resultCount : ''} results
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: padding.screenHorizontal, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.gray200 },
  closeButton: { padding: spacing.xs },
  title: { ...typography.h4, color: colors.black },
  resetText: { ...typography.body, color: colors.primary },
  content: { flex: 1, paddingHorizontal: padding.screenHorizontal },
  section: { paddingVertical: spacing.xl, borderBottomWidth: 1, borderBottomColor: colors.gray200 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  sectionTitle: { ...typography.bodyBold, color: colors.black },
  rangeText: { ...typography.body, color: colors.gray700, marginBottom: spacing.sm },
  slider: { width: '100%', height: 40 },
  ratingButtons: { flexDirection: 'row', gap: spacing.sm },
  ratingButton: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, borderRadius: radius.full, backgroundColor: colors.gray100 },
  ratingButtonActive: { backgroundColor: colors.primary },
  ratingText: { ...typography.small, color: colors.gray700 },
  ratingTextActive: { color: colors.white },
  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  amenityChip: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: radius.full, backgroundColor: colors.gray100, borderWidth: 1, borderColor: colors.gray300 },
  amenityChipActive: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  amenityText: { ...typography.small, color: colors.gray700 },
  amenityTextActive: { color: colors.primary },
  footer: { paddingHorizontal: padding.screenHorizontal, paddingVertical: spacing.lg, borderTopWidth: 1, borderTopColor: colors.gray200 },
  applyButton: { backgroundColor: colors.primary, paddingVertical: spacing.lg, borderRadius: radius.md, alignItems: 'center' },
  applyButtonText: { ...typography.bodyBold, color: colors.white },
});

export default FilterBottomSheet;

