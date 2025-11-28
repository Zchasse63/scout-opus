import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Heart, Star, MapPin, Dumbbell, BadgeCheck, TrendingUp, Sparkles } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { spacing, padding, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import { haptics } from '../../utils/haptics';
import { PhotoCarousel } from './PhotoCarousel';
import { VerifiedBadge, PopularBadge, NewBadge } from '../ui/TrustBadges';
import type { Gym } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - padding.screenHorizontal * 2;

interface GymCardProps {
  gym: Gym;
  onPress: (gymId: string) => void;
  onSaveToggle?: (gymId: string) => void;
  isSaved?: boolean;
  isVerified?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  viewingCount?: number;
}

export default function GymCard({
  gym,
  onPress,
  onSaveToggle,
  isSaved,
  isVerified = false,
  isPopular = false,
  isNew = false,
  viewingCount,
}: GymCardProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(1) }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        style={({ pressed }) => [
          styles.container,
          pressed && styles.pressed,
        ]}
        onPress={() => {
          haptics.selection();
          onPress(gym.id.toString());
        }}
      >
        {/* Photo Carousel */}
        <View style={styles.imageContainer}>
          {gym.photos && gym.photos.length > 0 ? (
            <PhotoCarousel
              photos={gym.photos}
              height={200}
              width={CARD_WIDTH}
              borderRadius={0}
              showPagination={gym.photos.length > 1}
            />
          ) : (
            <View style={[styles.placeholderImage, { height: 200 }]}>
              <Dumbbell size={iconSizes.xxl} color={colors.gray400} strokeWidth={1.5} />
            </View>
          )}

          {/* Badges */}
          <View style={styles.badgeRow}>
            {isVerified && <VerifiedBadge size="sm" showLabel={false} />}
            {isPopular && <PopularBadge />}
            {isNew && <NewBadge />}
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              haptics.heart();
              onSaveToggle?.(gym.id.toString());
            }}
            activeOpacity={0.7}
          >
            <Heart
              size={iconSizes.md}
              color={isSaved ? colors.error : colors.white}
              fill={isSaved ? colors.error : 'transparent'}
              strokeWidth={2}
            />
          </TouchableOpacity>

          {/* Price Tag */}
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>${gym.dayPassPrice}</Text>
          </View>

          {/* Viewing count */}
          {viewingCount && viewingCount > 0 && (
            <View style={styles.viewingBadge}>
              <Text style={styles.viewingText}>{viewingCount} viewing</Text>
            </View>
          )}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.header}>
            <View style={styles.titleSection}>
              <View style={styles.nameRow}>
                <Text style={styles.name} numberOfLines={2}>
                  {gym.name}
                </Text>
                {isVerified && (
                  <BadgeCheck size={iconSizes.sm} color={colors.info} fill={colors.info} />
                )}
              </View>
              <View style={styles.ratingRow}>
                <Star size={iconSizes.sm} color={colors.warning} fill={colors.warning} />
                <Text style={styles.rating}>{gym.rating.toFixed(1)}</Text>
                <Text style={styles.reviewCount}>({gym.reviewCount})</Text>
              </View>
            </View>
          </View>

          {/* Amenities */}
          <View style={styles.amenitiesRow}>
            {gym.amenities.slice(0, 4).map((amenity, index) => (
              <View key={index} style={styles.amenityChip}>
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
            {gym.amenities.length > 4 && (
              <Text style={styles.moreAmenities}>+{gym.amenities.length - 4}</Text>
            )}
          </View>

          {/* Location */}
          <View style={styles.locationRow}>
            <MapPin size={iconSizes.sm} color={colors.gray500} />
            <Text style={styles.address} numberOfLines={1}>
              {gym.address}
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    marginVertical: spacing.md,
    marginHorizontal: padding.screenHorizontal,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pressed: {
    opacity: 0.95,
  },
  imageContainer: {
    height: 200,
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    backgroundColor: colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 48,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  saveButton: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveIcon: {
    fontSize: 20,
  },
  priceTag: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  priceText: {
    ...typography.bodyBold,
    color: colors.white,
  },
  badgeRow: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    flexDirection: 'row',
    gap: spacing.xs,
  },
  viewingBadge: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.sm,
  },
  viewingText: {
    ...typography.tiny,
    color: colors.white,
  },
  infoSection: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  header: {
    gap: spacing.sm,
  },
  titleSection: {
    gap: spacing.xs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  name: {
    ...typography.h4,
    color: colors.black,
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  rating: {
    ...typography.small,
    color: colors.gray700,
    marginLeft: spacing.xs,
  },
  reviewCount: {
    ...typography.small,
    color: colors.gray500,
  },
  amenitiesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  amenityChip: {
    backgroundColor: colors.gray100,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.sm,
  },
  amenityText: {
    ...typography.tiny,
    color: colors.gray700,
  },
  moreAmenities: {
    ...typography.small,
    color: colors.gray500,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  address: {
    ...typography.small,
    color: colors.gray700,
    flex: 1,
  },
});
