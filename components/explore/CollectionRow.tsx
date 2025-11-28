/**
 * CollectionRow - Horizontal scrolling collection of gyms
 */

import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions,
} from 'react-native';
import { ChevronRight, Star } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { spacing, padding, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import { haptics } from '../../utils/haptics';
import { Skeleton } from '../ui/Skeleton';
import type { Gym } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.65;

interface CollectionRowProps {
  title: string;
  subtitle?: string;
  gyms: Gym[];
  onGymPress: (gymId: string) => void;
  onSeeAllPress?: () => void;
  isLoading?: boolean;
}

export function CollectionRow({
  title,
  subtitle,
  gyms,
  onGymPress,
  onSeeAllPress,
  isLoading = false,
}: CollectionRowProps) {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Skeleton width={150} height={24} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.card}>
              <Skeleton width={CARD_WIDTH} height={140} borderRadius={radius.md} />
              <View style={styles.cardContent}>
                <Skeleton width={120} height={16} />
                <Skeleton width={80} height={14} />
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  if (gyms.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {onSeeAllPress && (
          <TouchableOpacity style={styles.seeAllButton} onPress={onSeeAllPress}>
            <Text style={styles.seeAllText}>See all</Text>
            <ChevronRight size={iconSizes.sm} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Horizontal scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {gyms.map((gym) => (
          <TouchableOpacity
            key={gym.id}
            style={styles.card}
            onPress={() => {
              haptics.selection();
              onGymPress(gym.id.toString());
            }}
            activeOpacity={0.9}
          >
            <Image
              source={{ uri: gym.photos?.[0] || 'https://via.placeholder.com/300x200' }}
              style={styles.cardImage}
            />
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>${gym.dayPassPrice}</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.gymName} numberOfLines={1}>{gym.name}</Text>
              <View style={styles.ratingRow}>
                <Star size={iconSizes.xs} color={colors.warning} fill={colors.warning} />
                <Text style={styles.rating}>{gym.rating.toFixed(1)}</Text>
                <Text style={styles.reviewCount}>({gym.reviewCount})</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: spacing.lg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: padding.screenHorizontal,
    marginBottom: spacing.md,
  },
  title: { ...typography.h4, color: colors.black },
  subtitle: { ...typography.small, color: colors.gray600, marginTop: spacing.xxs },
  seeAllButton: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs },
  seeAllText: { ...typography.small, color: colors.primary },
  scrollContent: { paddingHorizontal: padding.screenHorizontal, gap: spacing.md },
  card: { width: CARD_WIDTH, borderRadius: radius.lg, backgroundColor: colors.white, overflow: 'hidden', shadowColor: colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  cardImage: { width: '100%', height: 140, backgroundColor: colors.gray200 },
  priceTag: { position: 'absolute', top: spacing.sm, right: spacing.sm, backgroundColor: colors.white, paddingHorizontal: spacing.sm, paddingVertical: spacing.xxs, borderRadius: radius.sm },
  priceText: { ...typography.smallBold, color: colors.black },
  cardContent: { padding: spacing.md, gap: spacing.xs },
  gymName: { ...typography.bodyBold, color: colors.black },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs },
  rating: { ...typography.small, color: colors.gray700 },
  reviewCount: { ...typography.small, color: colors.gray500 },
});

export default CollectionRow;

