/**
 * SimilarGyms - Horizontal carousel of related/similar gym listings
 */

import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Star, MapPin, Dumbbell, ChevronRight } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius, padding } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import { haptics } from '../../utils/haptics';
import { useTheme } from '../../contexts/ThemeContext';
import { Skeleton } from '../ui/Skeleton';
import type { Gym } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - padding.screenHorizontal * 2 - spacing.md) / 2.2;

interface SimilarGymsProps {
  gyms: Gym[];
  title?: string;
  subtitle?: string;
  onGymPress: (gymId: string) => void;
  onSeeAllPress?: () => void;
  isLoading?: boolean;
  accessibilityLabel?: string;
}

export function SimilarGyms({
  gyms,
  title = 'Similar gyms nearby',
  subtitle,
  onGymPress,
  onSeeAllPress,
  isLoading = false,
  accessibilityLabel,
}: SimilarGymsProps) {
  const { colors: themeColors } = useTheme();

  const handleGymPress = (gymId: string) => {
    haptics.selection();
    onGymPress(gymId);
  };

  if (isLoading) {
    return (
      <View style={styles.container} accessibilityLabel="Loading similar gyms">
        <View style={styles.header}>
          <Skeleton width={150} height={24} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={[styles.card, { width: CARD_WIDTH }]}>
              <Skeleton width={CARD_WIDTH} height={100} borderRadius={radius.md} />
              <View style={styles.cardContent}>
                <Skeleton width={100} height={16} />
                <Skeleton width={70} height={14} />
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  if (gyms.length === 0) return null;

  return (
    <View style={styles.container} accessibilityLabel={accessibilityLabel || title}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: themeColors.text }]}>{title}</Text>
          {subtitle && <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>{subtitle}</Text>}
        </View>
        {onSeeAllPress && (
          <TouchableOpacity
            style={styles.seeAllButton}
            onPress={() => { haptics.light(); onSeeAllPress(); }}
            accessibilityLabel="See all similar gyms"
            accessibilityRole="button"
          >
            <Text style={styles.seeAllText}>See all</Text>
            <ChevronRight size={iconSizes.sm} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Carousel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {gyms.map((gym) => (
          <TouchableOpacity
            key={gym.id}
            style={[styles.card, { width: CARD_WIDTH, backgroundColor: themeColors.card }]}
            onPress={() => handleGymPress(gym.id.toString())}
            activeOpacity={0.9}
            accessibilityLabel={`${gym.name}, ${gym.rating} stars, $${gym.dayPassPrice} per day`}
            accessibilityRole="button"
          >
            {gym.photos?.[0] ? (
              <Image source={{ uri: gym.photos[0] }} style={styles.cardImage} />
            ) : (
              <View style={[styles.placeholder, { backgroundColor: themeColors.border }]}>
                <Dumbbell size={iconSizes.lg} color={themeColors.textSecondary} />
              </View>
            )}

            {/* Price tag */}
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>${gym.dayPassPrice}</Text>
            </View>

            <View style={styles.cardContent}>
              <Text style={[styles.gymName, { color: themeColors.text }]} numberOfLines={1}>
                {gym.name}
              </Text>

              <View style={styles.infoRow}>
                <Star size={iconSizes.xs} color={colors.warning} fill={colors.warning} />
                <Text style={[styles.rating, { color: themeColors.text }]}>{gym.rating.toFixed(1)}</Text>
                <Text style={[styles.reviewCount, { color: themeColors.textSecondary }]}>
                  ({gym.reviewCount})
                </Text>
              </View>

              <View style={styles.locationRow}>
                <MapPin size={iconSizes.xxs} color={themeColors.textSecondary} />
                <Text style={[styles.address, { color: themeColors.textSecondary }]} numberOfLines={1}>
                  {gym.address.split(',')[0]}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: padding.screenHorizontal, marginBottom: spacing.md },
  title: { ...typography.h4 },
  subtitle: { ...typography.small, marginTop: spacing.xxs },
  seeAllButton: { flexDirection: 'row', alignItems: 'center' },
  seeAllText: { ...typography.smallBold, color: colors.primary },
  scrollContent: { paddingHorizontal: padding.screenHorizontal, gap: spacing.md },
  card: { borderRadius: radius.md, overflow: 'hidden' },
  cardImage: { width: '100%', height: 100, backgroundColor: colors.gray200 },
  placeholder: { width: '100%', height: 100, justifyContent: 'center', alignItems: 'center' },
  priceTag: { position: 'absolute', top: spacing.sm, right: spacing.sm, backgroundColor: colors.white, paddingHorizontal: spacing.sm, paddingVertical: spacing.xxs, borderRadius: radius.sm },
  priceText: { ...typography.smallBold, color: colors.black },
  cardContent: { padding: spacing.sm, gap: spacing.xxs },
  gymName: { ...typography.bodyBold },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  rating: { ...typography.smallBold, marginLeft: 2 },
  reviewCount: { ...typography.small },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  address: { ...typography.tiny, flex: 1 },
});

export default SimilarGyms;

