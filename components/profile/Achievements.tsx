/**
 * Achievements - Gamification badges for profile
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Award, Star, Zap, Target, Crown, Medal, Sparkles, ChevronRight } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { iconSizes } from '../../constants/icons';
import { haptics } from '../../utils/haptics';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: 'award' | 'star' | 'zap' | 'target' | 'crown' | 'medal' | 'sparkles';
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

interface AchievementsProps {
  achievements: Achievement[];
  onViewAll: () => void;
}

const iconMap = {
  award: Award,
  star: Star,
  zap: Zap,
  target: Target,
  crown: Crown,
  medal: Medal,
  sparkles: Sparkles,
};

export function Achievements({ achievements, onViewAll }: AchievementsProps) {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const displayAchievements = achievements.slice(0, 4);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Achievements</Text>
        <Text style={styles.count}>{unlockedCount}/{achievements.length}</Text>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {displayAchievements.map((achievement) => {
          const IconComponent = iconMap[achievement.icon];
          return (
            <View key={achievement.id} style={[styles.badge, !achievement.unlocked && styles.badgeLocked]}>
              <View style={[styles.badgeIcon, !achievement.unlocked && styles.badgeIconLocked]}>
                <IconComponent 
                  size={iconSizes.lg} 
                  color={achievement.unlocked ? colors.warning : colors.gray400} 
                />
              </View>
              <Text style={[styles.badgeName, !achievement.unlocked && styles.badgeNameLocked]} numberOfLines={1}>
                {achievement.name}
              </Text>
              {achievement.progress !== undefined && !achievement.unlocked && (
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${(achievement.progress / (achievement.maxProgress || 1)) * 100}%` }]} />
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      <TouchableOpacity style={styles.viewAllButton} onPress={() => { haptics.light(); onViewAll(); }}>
        <Text style={styles.viewAllText}>View All Achievements</Text>
        <ChevronRight size={iconSizes.sm} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, backgroundColor: colors.white, marginTop: spacing.sm },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  title: { ...typography.h4, color: colors.black },
  count: { ...typography.bodyBold, color: colors.gray600 },
  scrollContent: { gap: spacing.md, paddingRight: spacing.lg },
  badge: { width: 80, alignItems: 'center' },
  badgeLocked: { opacity: 0.6 },
  badgeIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.warningLight, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xs },
  badgeIconLocked: { backgroundColor: colors.gray100 },
  badgeName: { ...typography.tiny, color: colors.black, textAlign: 'center' },
  badgeNameLocked: { color: colors.gray500 },
  progressBar: { width: '100%', height: 3, backgroundColor: colors.gray200, borderRadius: 2, marginTop: spacing.xxs },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 2 },
  viewAllButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: spacing.lg, gap: spacing.xxs },
  viewAllText: { ...typography.bodyBold, color: colors.primary },
});

export default Achievements;

