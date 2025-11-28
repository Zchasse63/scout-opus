/**
 * MapPreviewCard - Airbnb-style slide-up preview card when tapping map markers
 */

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { Star, MapPin, Heart, ChevronRight, Dumbbell } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius, padding } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import { haptics } from '../../utils/haptics';
import { useTheme } from '../../contexts/ThemeContext';
import type { Gym } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - padding.screenHorizontal * 2;

interface MapPreviewCardProps {
  gym: Gym;
  onPress: () => void;
  onSaveToggle?: () => void;
  onDismiss?: () => void;
  isSaved?: boolean;
  distance?: string;
}

export function MapPreviewCard({
  gym,
  onPress,
  onSaveToggle,
  onDismiss,
  isSaved = false,
  distance,
}: MapPreviewCardProps) {
  const { colors: themeColors, isDark } = useTheme();

  const handlePress = () => {
    haptics.selection();
    onPress();
  };

  const handleSave = () => {
    haptics.light();
    onSaveToggle?.();
  };

  return (
    <Animated.View
      entering={FadeInDown.springify().damping(15)}
      exiting={FadeOutDown.springify().damping(15)}
      style={[styles.container, { backgroundColor: themeColors.card }]}
    >
      <TouchableOpacity
        style={styles.content}
        onPress={handlePress}
        activeOpacity={0.95}
        accessibilityLabel={`${gym.name}, ${gym.rating} stars, $${gym.dayPassPrice} per day`}
        accessibilityRole="button"
      >
        {/* Photo */}
        <View style={styles.imageContainer}>
          {gym.photos?.[0] ? (
            <Image source={{ uri: gym.photos[0] }} style={styles.image} />
          ) : (
            <View style={[styles.placeholder, { backgroundColor: themeColors.border }]}>
              <Dumbbell size={iconSizes.xl} color={themeColors.textSecondary} />
            </View>
          )}
          
          {/* Save button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel={isSaved ? 'Remove from saved' : 'Save gym'}
          >
            <Heart
              size={iconSizes.md}
              color={isSaved ? colors.error : colors.white}
              fill={isSaved ? colors.error : 'transparent'}
            />
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.info}>
          <View style={styles.topRow}>
            <Text style={[styles.name, { color: themeColors.text }]} numberOfLines={1}>
              {gym.name}
            </Text>
            <View style={styles.ratingContainer}>
              <Star size={iconSizes.sm} color={colors.warning} fill={colors.warning} />
              <Text style={[styles.rating, { color: themeColors.text }]}>
                {gym.rating.toFixed(1)}
              </Text>
              <Text style={[styles.reviewCount, { color: themeColors.textSecondary }]}>
                ({gym.reviewCount})
              </Text>
            </View>
          </View>

          <View style={styles.locationRow}>
            <MapPin size={iconSizes.xs} color={themeColors.textSecondary} />
            <Text style={[styles.address, { color: themeColors.textSecondary }]} numberOfLines={1}>
              {distance ? `${distance} · ` : ''}{gym.address}
            </Text>
          </View>

          <View style={styles.bottomRow}>
            <View style={styles.priceContainer}>
              <Text style={[styles.price, { color: themeColors.text }]}>
                ${gym.dayPassPrice}
              </Text>
              <Text style={[styles.priceLabel, { color: themeColors.textSecondary }]}>
                /day pass
              </Text>
            </View>
            <View style={styles.viewButton}>
              <Text style={styles.viewText}>View Details</Text>
              <ChevronRight size={iconSizes.sm} color={colors.primary} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: padding.screenHorizontal,
    right: padding.screenHorizontal,
    borderRadius: radius.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  content: { flexDirection: 'row', padding: spacing.md },
  imageContainer: { position: 'relative' },
  image: { width: 100, height: 100, borderRadius: radius.md },
  placeholder: { width: 100, height: 100, borderRadius: radius.md, justifyContent: 'center', alignItems: 'center' },
  saveButton: { position: 'absolute', top: spacing.xs, right: spacing.xs, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20, padding: spacing.xs },
  info: { flex: 1, marginLeft: spacing.md, justifyContent: 'space-between' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  name: { ...typography.bodyBold, flex: 1, marginRight: spacing.sm },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  rating: { ...typography.smallBold, marginLeft: 2 },
  reviewCount: { ...typography.small },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs },
  address: { ...typography.small, flex: 1 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceContainer: { flexDirection: 'row', alignItems: 'baseline' },
  price: { ...typography.h4 },
  priceLabel: { ...typography.small, marginLeft: 2 },
  viewButton: { flexDirection: 'row', alignItems: 'center' },
  viewText: { ...typography.smallBold, color: colors.primary },
});

export default MapPreviewCard;

