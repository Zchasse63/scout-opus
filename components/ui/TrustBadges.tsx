/**
 * Trust and Badge components for Scout app
 * Visual indicators for credibility and urgency
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { BadgeCheck, Flame, Sparkles, Clock, Users, MessageCircle } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { fontSizes } from '../../constants/typography';
import { spacing, radius } from '../../constants/spacing';
import { iconSizes } from '../../constants/icons';

// Verified badge for trusted gyms
interface VerifiedBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  style?: ViewStyle;
}

export function VerifiedBadge({ size = 'md', showLabel = true, style }: VerifiedBadgeProps) {
  const iconSize = size === 'sm' ? iconSizes.sm : size === 'lg' ? iconSizes.lg : iconSizes.md;
  const fontSize = size === 'sm' ? fontSizes.xs : size === 'lg' ? fontSizes.md : fontSizes.sm;

  return (
    <View style={[styles.badge, styles.verifiedBadge, style]}>
      <BadgeCheck size={iconSize} color={colors.secondary} />
      {showLabel && <Text style={[styles.badgeText, { fontSize, color: colors.secondary }]}>Verified</Text>}
    </View>
  );
}

// Popular badge for trending gyms
interface PopularBadgeProps {
  count?: number;
  style?: ViewStyle;
}

export function PopularBadge({ count, style }: PopularBadgeProps) {
  return (
    <View style={[styles.badge, styles.popularBadge, style]}>
      <Flame size={iconSizes.sm} color={colors.primary} />
      <Text style={[styles.badgeText, styles.popularText]}>
        {count ? `${count} booked today` : 'Popular'}
      </Text>
    </View>
  );
}

// New badge for recently added gyms
interface NewBadgeProps {
  style?: ViewStyle;
}

export function NewBadge({ style }: NewBadgeProps) {
  return (
    <View style={[styles.badge, styles.newBadge, style]}>
      <Sparkles size={iconSizes.sm} color={colors.success} />
      <Text style={[styles.badgeText, styles.newText]}>New</Text>
    </View>
  );
}

// Urgency indicator for limited availability
interface UrgencyIndicatorProps {
  passesLeft?: number;
  viewingCount?: number;
  style?: ViewStyle;
}

export function UrgencyIndicator({ passesLeft, viewingCount, style }: UrgencyIndicatorProps) {
  if (!passesLeft && !viewingCount) return null;

  const isUrgent = passesLeft !== undefined && passesLeft <= 3;

  return (
    <View style={[styles.urgencyContainer, style]}>
      {passesLeft !== undefined && (
        <View style={[styles.urgencyBadge, isUrgent && styles.urgentBadge]}>
          <Clock size={iconSizes.xs} color={isUrgent ? colors.error : colors.warning} />
          <Text style={[styles.urgencyText, isUrgent && styles.urgentText]}>
            {passesLeft === 0 ? 'Sold out' : `Only ${passesLeft} left`}
          </Text>
        </View>
      )}
      {viewingCount !== undefined && viewingCount > 0 && (
        <View style={styles.viewingBadge}>
          <Users size={iconSizes.xs} color={colors.gray600} />
          <Text style={styles.viewingText}>{viewingCount} viewing</Text>
        </View>
      )}
    </View>
  );
}

// Response rate indicator for gym owners
interface ResponseRateProps {
  rate: number; // 0-100
  avgResponseTime?: string;
  style?: ViewStyle;
}

export function ResponseRate({ rate, avgResponseTime, style }: ResponseRateProps) {
  const rateColor = rate >= 90 ? colors.success : rate >= 70 ? colors.warning : colors.gray500;

  return (
    <View style={[styles.responseContainer, style]}>
      <View style={styles.responseRow}>
        <MessageCircle size={iconSizes.sm} color={rateColor} />
        <Text style={[styles.responseRate, { color: rateColor }]}>{rate}% response rate</Text>
      </View>
      {avgResponseTime && (
        <Text style={styles.responseTime}>Usually responds {avgResponseTime}</Text>
      )}
    </View>
  );
}

// Great Value badge
interface ValueBadgeProps {
  savings?: number;
  style?: ViewStyle;
}

export function ValueBadge({ savings, style }: ValueBadgeProps) {
  return (
    <View style={[styles.badge, styles.valueBadge, style]}>
      <Text style={styles.valueText}>
        {savings ? `Save ${savings}%` : 'Great Value'}
      </Text>
    </View>
  );
}

// Badge group for displaying multiple badges
interface BadgeGroupProps {
  isVerified?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  bookingsToday?: number;
  style?: ViewStyle;
}

export function BadgeGroup({ isVerified, isPopular, isNew, bookingsToday, style }: BadgeGroupProps) {
  const hasBadges = isVerified || isPopular || isNew;
  if (!hasBadges) return null;

  return (
    <View style={[styles.badgeGroup, style]}>
      {isVerified && <VerifiedBadge size="sm" showLabel={false} />}
      {isPopular && <PopularBadge count={bookingsToday} />}
      {isNew && <NewBadge />}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    gap: spacing.xs,
  },
  badgeText: {
    fontWeight: '600',
  },
  verifiedBadge: {
    backgroundColor: colors.blue50,
  },
  popularBadge: {
    backgroundColor: colors.orange50,
  },
  popularText: {
    color: colors.primary,
    fontSize: fontSizes.xs,
  },
  newBadge: {
    backgroundColor: colors.successLight,
  },
  newText: {
    color: colors.success,
    fontSize: fontSizes.xs,
  },
  valueBadge: {
    backgroundColor: colors.success,
  },
  valueText: {
    color: colors.white,
    fontSize: fontSizes.xs,
    fontWeight: '700',
  },
  urgencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.warningLight,
    borderRadius: radius.sm,
  },
  urgentBadge: {
    backgroundColor: colors.errorLight,
  },
  urgencyText: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
    color: colors.warning,
  },
  urgentText: {
    color: colors.error,
  },
  viewingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  viewingText: {
    fontSize: fontSizes.xs,
    color: colors.gray600,
  },
  responseContainer: {
    gap: spacing.xs,
  },
  responseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  responseRate: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
  responseTime: {
    fontSize: fontSizes.xs,
    color: colors.gray500,
  },
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
});

