/**
 * GymOwnerProfile - Owner/manager profile section with response rate and verification
 */

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { BadgeCheck, MessageCircle, Clock, Star, ChevronRight } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import { haptics } from '../../utils/haptics';
import { useTheme } from '../../contexts/ThemeContext';

interface GymOwnerProfileProps {
  owner: {
    id: string;
    name: string;
    avatar?: string;
    title?: string;
    isVerified?: boolean;
    responseRate?: number; // 0-100
    responseTime?: string; // e.g., "within an hour"
    memberSince?: string; // e.g., "2020"
    totalGyms?: number;
    rating?: number;
  };
  onContactPress?: () => void;
  onProfilePress?: () => void;
}

export function GymOwnerProfile({
  owner,
  onContactPress,
  onProfilePress,
}: GymOwnerProfileProps) {
  const { colors: themeColors } = useTheme();

  const handleContact = () => {
    haptics.light();
    onContactPress?.();
  };

  const handleProfile = () => {
    haptics.selection();
    onProfilePress?.();
  };

  const getResponseRateColor = (rate: number) => {
    if (rate >= 90) return colors.success;
    if (rate >= 70) return colors.warning;
    return colors.gray500;
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.card }]}>
      {/* Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={handleProfile}
        activeOpacity={0.7}
        accessibilityLabel={`View ${owner.name}'s profile`}
        accessibilityRole="button"
      >
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: owner.avatar || 'https://i.pravatar.cc/100' }}
            style={styles.avatar}
          />
          {owner.isVerified && (
            <View style={styles.verifiedBadge}>
              <BadgeCheck size={iconSizes.sm} color={colors.white} fill={colors.secondary} />
            </View>
          )}
        </View>

        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: themeColors.text }]}>{owner.name}</Text>
            {owner.rating && (
              <View style={styles.ratingBadge}>
                <Star size={iconSizes.xs} color={colors.warning} fill={colors.warning} />
                <Text style={styles.ratingText}>{owner.rating.toFixed(1)}</Text>
              </View>
            )}
          </View>
          {owner.title && (
            <Text style={[styles.title, { color: themeColors.textSecondary }]}>{owner.title}</Text>
          )}
          {owner.memberSince && (
            <Text style={[styles.memberSince, { color: themeColors.textSecondary }]}>
              Hosting since {owner.memberSince}
            </Text>
          )}
        </View>

        <ChevronRight size={iconSizes.md} color={themeColors.textSecondary} />
      </TouchableOpacity>

      {/* Stats */}
      <View style={[styles.statsContainer, { borderTopColor: themeColors.border }]}>
        {owner.responseRate !== undefined && (
          <View style={styles.stat}>
            <MessageCircle size={iconSizes.sm} color={getResponseRateColor(owner.responseRate)} />
            <Text style={[styles.statValue, { color: themeColors.text }]}>{owner.responseRate}%</Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Response rate</Text>
          </View>
        )}

        {owner.responseTime && (
          <View style={styles.stat}>
            <Clock size={iconSizes.sm} color={colors.info} />
            <Text style={[styles.statValue, { color: themeColors.text }]}>{owner.responseTime}</Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Avg. response</Text>
          </View>
        )}

        {owner.totalGyms && owner.totalGyms > 1 && (
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: themeColors.text }]}>{owner.totalGyms}</Text>
            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Locations</Text>
          </View>
        )}
      </View>

      {/* Contact button */}
      {onContactPress && (
        <TouchableOpacity
          style={[styles.contactButton, { borderColor: themeColors.border }]}
          onPress={handleContact}
          accessibilityLabel={`Contact ${owner.name}`}
          accessibilityRole="button"
        >
          <MessageCircle size={iconSizes.md} color={themeColors.text} />
          <Text style={[styles.contactText, { color: themeColors.text }]}>Contact host</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: radius.lg, padding: spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatarContainer: { position: 'relative' },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.gray200 },
  verifiedBadge: { position: 'absolute', bottom: -2, right: -2, backgroundColor: colors.white, borderRadius: 10, padding: 2 },
  headerInfo: { flex: 1, gap: spacing.xxs },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  name: { ...typography.h4 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: colors.gray100, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.full },
  ratingText: { ...typography.smallBold, color: colors.gray800 },
  title: { ...typography.body },
  memberSince: { ...typography.small },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: spacing.lg, paddingTop: spacing.lg, borderTopWidth: 1 },
  stat: { alignItems: 'center', gap: spacing.xxs },
  statValue: { ...typography.bodyBold },
  statLabel: { ...typography.tiny },
  contactButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, marginTop: spacing.lg, paddingVertical: spacing.md, borderRadius: radius.md, borderWidth: 1 },
  contactText: { ...typography.bodyBold },
});

export default GymOwnerProfile;

