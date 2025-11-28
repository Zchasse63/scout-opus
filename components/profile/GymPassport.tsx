/**
 * GymPassport - Stats display for visits, cities, streak
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin, Dumbbell, Flame, Trophy } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';

interface GymPassportProps {
  totalVisits: number;
  citiesVisited: number;
  currentStreak: number;
  longestStreak: number;
}

export function GymPassport({ totalVisits, citiesVisited, currentStreak, longestStreak }: GymPassportProps) {
  const stats = [
    { icon: Dumbbell, label: 'Total Visits', value: totalVisits, color: colors.primary },
    { icon: MapPin, label: 'Cities', value: citiesVisited, color: colors.secondary },
    { icon: Flame, label: 'Current Streak', value: `${currentStreak} days`, color: colors.warning },
    { icon: Trophy, label: 'Best Streak', value: `${longestStreak} days`, color: colors.success },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gym Passport</Text>
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: `${stat.color}15` }]}>
              <stat.icon size={iconSizes.lg} color={stat.color} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    marginTop: spacing.sm,
  },
  title: {
    ...typography.h4,
    color: colors.black,
    marginBottom: spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  statCard: {
    width: '47%',
    backgroundColor: colors.gray50,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    ...typography.h3,
    color: colors.black,
    marginBottom: spacing.xxs,
  },
  statLabel: {
    ...typography.small,
    color: colors.gray600,
    textAlign: 'center',
  },
});

export default GymPassport;

