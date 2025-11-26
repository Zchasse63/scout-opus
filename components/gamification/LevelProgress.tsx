import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, Award } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import { useGamificationStore } from '../../stores/gamificationStore';
import { Card } from '../ui/Card';

export const LevelProgress: React.FC = () => {
  const { totalPoints, calculateLevel, getProgressToNextLevel } = useGamificationStore();

  const currentLevel = calculateLevel();
  const progress = getProgressToNextLevel();

  const progressWidth = useSharedValue(0);

  React.useEffect(() => {
    progressWidth.value = withSpring(progress.percentage);
  }, [progress.percentage]);

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return (
    <Card style={styles.container} pressable={false}>
      <View style={styles.header}>
        <View style={styles.levelBadge}>
          <Award color={colors.primary} size={24} />
          <Text style={styles.levelNumber}>{currentLevel.level}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.levelTitle}>{currentLevel.title}</Text>
          <Text style={styles.points}>{totalPoints.toLocaleString()} points</Text>
        </View>
        <TrendingUp color={colors.success} size={24} />
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, animatedProgressStyle]} />
        </View>
        <Text style={styles.progressText}>
          {Math.round(progress.percentage)}% to Level {currentLevel.level + 1}
        </Text>
      </View>

      <View style={styles.benefits}>
        <Text style={styles.benefitsTitle}>Current Benefits:</Text>
        {currentLevel.benefits.map((benefit, index) => (
          <View key={index} style={styles.benefitItem}>
            <Text style={styles.benefitBullet}>•</Text>
            <Text style={styles.benefitText}>{benefit}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  levelBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    position: 'relative',
  },
  levelNumber: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: colors.primary,
    color: colors.white,
    fontSize: typography.sizes.xs,
    fontWeight: '700',
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
  },
  headerInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.black,
    marginBottom: spacing.xxs,
  },
  points: {
    fontSize: typography.sizes.sm,
    color: colors.gray600,
  },
  progressSection: {
    marginBottom: spacing.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.gray200,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: typography.sizes.sm,
    color: colors.gray600,
    textAlign: 'center',
  },
  benefits: {
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
    paddingTop: spacing.md,
  },
  benefitsTitle: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.black,
    marginBottom: spacing.sm,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  benefitBullet: {
    fontSize: typography.sizes.base,
    color: colors.primary,
    marginRight: spacing.sm,
  },
  benefitText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.gray700,
  },
});
