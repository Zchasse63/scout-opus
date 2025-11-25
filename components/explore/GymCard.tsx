import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
} from 'react-native';
import { colors } from '../../constants/colors';
import { spacing, padding, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import type { Gym } from '../../types';

interface GymCardProps {
  gym: Gym;
  onPress: (gymId: string) => void;
  onSaveToggle?: (gymId: string) => void;
  isSaved?: boolean;
}

export default function GymCard({
  gym,
  onPress,
  onSaveToggle,
  isSaved,
}: GymCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
      onPress={() => onPress(gym.id.toString())}
    >
      {/* Hero Image */}
      <View style={styles.imageContainer}>
        {gym.photos && gym.photos.length > 0 ? (
          <Image
            source={{ uri: gym.photos[0] }}
            style={styles.image}
          />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>🏋️</Text>
          </View>
        )}
        {/* Gradient Overlay */}
        <View style={styles.overlay} />

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => onSaveToggle?.(gym.id.toString())}
          activeOpacity={0.7}
        >
          <Text style={styles.saveIcon}>{isSaved ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>

        {/* Price Tag */}
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>${gym.dayPassPrice}</Text>
        </View>
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <Text style={styles.name} numberOfLines={2}>
              {gym.name}
            </Text>
            <View style={styles.ratingRow}>
              <Text style={styles.rating}>⭐ {gym.rating.toFixed(1)}</Text>
              <Text style={styles.reviewCount}>({gym.reviewCount})</Text>
            </View>
          </View>
        </View>

        {/* Amenities */}
        <View style={styles.amenitiesRow}>
          {gym.amenities.slice(0, 4).map((amenity, index) => (
            <Text key={index} style={styles.amenityIcon}>
              {amenity}
            </Text>
          ))}
          {gym.amenities.length > 4 && (
            <Text style={styles.moreAmenities}>+{gym.amenities.length - 4}</Text>
          )}
        </View>

        {/* Location */}
        <Text style={styles.address} numberOfLines={1}>
          📍 {gym.address}
        </Text>
      </View>
    </Pressable>
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
  name: {
    ...typography.h4,
    color: colors.black,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rating: {
    ...typography.small,
    color: colors.gray700,
  },
  reviewCount: {
    ...typography.small,
    color: colors.gray500,
  },
  amenitiesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  amenityIcon: {
    fontSize: 16,
  },
  moreAmenities: {
    ...typography.small,
    color: colors.gray500,
  },
  address: {
    ...typography.small,
    color: colors.gray700,
  },
});
