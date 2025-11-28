/**
 * StickyBookingBar - Sticky bottom bar for booking with price and urgency
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import Animated, { useAnimatedStyle, interpolate, SharedValue } from 'react-native-reanimated';
import { AlertCircle } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { spacing, padding, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import { haptics } from '../../utils/haptics';

interface StickyBookingBarProps {
  price: number;
  onBook: () => void;
  passesLeft?: number;
  isAvailable?: boolean;
  scrollY?: SharedValue<number>;
}

export function StickyBookingBar({
  price,
  onBook,
  passesLeft,
  isAvailable = true,
  scrollY,
}: StickyBookingBarProps) {
  const animatedStyle = useAnimatedStyle(() => {
    if (!scrollY) return {};
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, 100],
            [100, 0],
            'clamp'
          ),
        },
      ],
    };
  });

  const showUrgency = passesLeft !== undefined && passesLeft <= 5;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.safeArea}>
        <View style={styles.content}>
          {/* Price section */}
          <View style={styles.priceSection}>
            <Text style={styles.price}>${price}</Text>
            <Text style={styles.priceLabel}>/ day pass</Text>
          </View>

          {/* Urgency indicator */}
          {showUrgency && (
            <View style={styles.urgencyBadge}>
              <AlertCircle size={iconSizes.xs} color={colors.error} />
              <Text style={styles.urgencyText}>Only {passesLeft} left!</Text>
            </View>
          )}

          {/* Book button */}
          <TouchableOpacity
            style={[styles.bookButton, !isAvailable && styles.bookButtonDisabled]}
            onPress={() => {
              haptics.medium();
              onBook();
            }}
            disabled={!isAvailable}
            activeOpacity={0.8}
          >
            <Text style={styles.bookButtonText}>
              {isAvailable ? `Book for $${price}` : 'Sold Out'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  safeArea: {
    backgroundColor: colors.white,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: padding.screenHorizontal,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xxs,
  },
  price: {
    ...typography.h3,
    color: colors.black,
  },
  priceLabel: {
    ...typography.small,
    color: colors.gray600,
  },
  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    backgroundColor: colors.errorLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.sm,
  },
  urgencyText: {
    ...typography.tiny,
    color: colors.error,
    fontWeight: '600',
  },
  bookButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  bookButtonDisabled: {
    backgroundColor: colors.gray400,
  },
  bookButtonText: {
    ...typography.bodyBold,
    color: colors.white,
  },
});

export default StickyBookingBar;

