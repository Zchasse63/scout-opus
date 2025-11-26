import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Lock } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import { useGamificationStore, Badge } from '../../stores/gamificationStore';
import { Card } from '../ui/Card';

export const BadgeGrid: React.FC = () => {
  const { badges, unlockedBadges } = useGamificationStore();

  const renderBadge = (badge: Badge) => {
    const isUnlocked = unlockedBadges.includes(badge.id);

    return (
      <Card
        key={badge.id}
        style={[styles.badgeCard, !isUnlocked && styles.lockedBadge]}
        pressable={false}
      >
        <View style={styles.badgeIcon}>
          {isUnlocked ? (
            <Text style={styles.iconEmoji}>{badge.icon}</Text>
          ) : (
            <Lock color={colors.gray400} size={32} />
          )}
        </View>
        <Text style={[styles.badgeName, !isUnlocked && styles.lockedText]}>
          {badge.name}
        </Text>
        <Text style={[styles.badgeDescription, !isUnlocked && styles.lockedText]} numberOfLines={2}>
          {badge.description}
        </Text>
        <Text style={styles.badgePoints}>+{badge.points} pts</Text>
        {!isUnlocked && (
          <Text style={styles.requirement}>{badge.requirement}</Text>
        )}
      </Card>
    );
  };

  const categories = [
    { key: 'exploration', label: 'Exploration' },
    { key: 'consistency', label: 'Consistency' },
    { key: 'social', label: 'Social' },
    { key: 'achievement', label: 'Achievement' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Badges</Text>
        <Text style={styles.subtitle}>
          {unlockedBadges.length} of {badges.length} unlocked
        </Text>
      </View>

      {categories.map((category) => {
        const categoryBadges = badges.filter((b) => b.category === category.key);
        if (categoryBadges.length === 0) return null;

        return (
          <View key={category.key} style={styles.category}>
            <Text style={styles.categoryTitle}>{category.label}</Text>
            <View style={styles.badgeGrid}>
              {categoryBadges.map(renderBadge)}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: '700',
    color: colors.black,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.base,
    color: colors.gray600,
  },
  category: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  categoryTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    color: colors.black,
    marginBottom: spacing.md,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  badgeCard: {
    width: '47%',
    padding: spacing.md,
    alignItems: 'center',
  },
  lockedBadge: {
    opacity: 0.5,
  },
  badgeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  iconEmoji: {
    fontSize: 32,
  },
  badgeName: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.black,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  badgeDescription: {
    fontSize: typography.sizes.xs,
    color: colors.gray600,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  lockedText: {
    color: colors.gray400,
  },
  badgePoints: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.primary,
  },
  requirement: {
    fontSize: typography.sizes.xs,
    color: colors.gray500,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
