/**
 * PriceBubbleMarker - Custom map marker showing price bubble
 * Airbnb-style price markers for gyms on the map
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Star } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';

interface PriceBubbleMarkerProps {
  price: number;
  rating?: number;
  isSelected?: boolean;
  isViewed?: boolean;
  onPress?: () => void;
}

export function PriceBubbleMarker({
  price,
  rating,
  isSelected = false,
  isViewed = false,
  onPress,
}: PriceBubbleMarkerProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(isSelected ? 1.1 : 1) }],
  }));

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Animated.View
        style={[
          styles.container,
          isSelected && styles.containerSelected,
          isViewed && styles.containerViewed,
          animatedStyle,
        ]}
      >
        <Text
          style={[
            styles.price,
            isSelected && styles.priceSelected,
            isViewed && styles.priceViewed,
          ]}
        >
          ${price}
        </Text>
        
        {/* Pointer/arrow */}
        <View
          style={[
            styles.pointer,
            isSelected && styles.pointerSelected,
            isViewed && styles.pointerViewed,
          ]}
        />
        
        {/* Rating badge */}
        {rating && rating >= 4.5 && (
          <View style={styles.ratingBadge}>
            <Star size={iconSizes.xxs} color={colors.warning} fill={colors.warning} />
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

interface ClusterMarkerProps {
  count: number;
  onPress?: () => void;
}

export function ClusterMarker({ count, onPress }: ClusterMarkerProps) {
  return (
    <TouchableOpacity style={styles.cluster} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.clusterText}>{count > 99 ? '99+' : count}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.gray300,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  containerSelected: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  containerViewed: {
    backgroundColor: colors.gray100,
    borderColor: colors.gray300,
  },
  price: {
    ...typography.smallBold,
    color: colors.black,
  },
  priceSelected: {
    color: colors.white,
  },
  priceViewed: {
    color: colors.gray600,
  },
  pointer: {
    position: 'absolute',
    bottom: -6,
    left: '50%',
    marginLeft: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.white,
  },
  pointerSelected: {
    borderTopColor: colors.black,
  },
  pointerViewed: {
    borderTopColor: colors.gray100,
  },
  ratingBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  cluster: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  clusterText: {
    ...typography.smallBold,
    color: colors.white,
  },
});

export default PriceBubbleMarker;

