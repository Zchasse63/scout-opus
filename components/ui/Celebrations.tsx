/**
 * Celebration components for success moments
 * Confetti, success animations, achievement unlocks
 */
import React, { useEffect, useRef, useCallback, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Modal } from 'react-native';
import { Check, Trophy, Star, Sparkles } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, radius } from '../../constants/spacing';
import { iconSizes } from '../../constants/icons';
import { durations, springConfigs } from '../../constants/animations';
import { haptics } from '../../utils/haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Confetti piece component
interface ConfettiPieceProps { delay: number; color: string; }
function ConfettiPiece({ delay, color }: ConfettiPieceProps) {
  const translateY = useRef(new Animated.Value(-20)).current;
  const translateX = useRef(new Animated.Value(Math.random() * SCREEN_WIDTH)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const initialX = useRef(Math.random() * SCREEN_WIDTH).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: SCREEN_HEIGHT + 50, duration: durations.confetti, delay, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: initialX + (Math.random() - 0.5) * 200, duration: durations.confetti, delay, useNativeDriver: true }),
      Animated.timing(rotate, { toValue: Math.random() * 10, duration: durations.confetti, delay, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: durations.confetti, delay: delay + 1500, useNativeDriver: true }),
    ]).start();
  }, []);

  const spin = rotate.interpolate({ inputRange: [0, 10], outputRange: ['0deg', '3600deg'] });
  return (
    <Animated.View style={[styles.confettiPiece, { backgroundColor: color, transform: [{ translateX }, { translateY }, { rotate: spin }], opacity }]} />
  );
}

// Confetti explosion
interface ConfettiProps { visible: boolean; onComplete?: () => void; }
export function Confetti({ visible, onComplete }: ConfettiProps) {
  const confettiColors = [colors.primary, colors.success, colors.warning, colors.info, '#9b59b6', '#1abc9c'];
  const pieces = Array.from({ length: 50 }, (_, i) => ({
    id: i, delay: Math.random() * 500, color: confettiColors[Math.floor(Math.random() * confettiColors.length)]
  }));

  useEffect(() => {
    if (visible) {
      haptics.success();
      const timer = setTimeout(() => onComplete?.(), durations.confetti + 500);
      return () => clearTimeout(timer);
    }
  }, [visible, onComplete]);

  if (!visible) return null;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {pieces.map(p => <ConfettiPiece key={p.id} delay={p.delay} color={p.color} />)}
    </View>
  );
}

// Success checkmark animation
interface SuccessCheckmarkProps { visible: boolean; size?: number; }
export function SuccessCheckmark({ visible, size = 80 }: SuccessCheckmarkProps) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      haptics.success();
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, ...springConfigs.bouncy, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: durations.fast, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, scale, opacity]);

  if (!visible) return null;
  return (
    <Animated.View style={[styles.checkmarkContainer, { width: size, height: size, borderRadius: size / 2, transform: [{ scale }], opacity }]}>
      <Check size={size * 0.5} color={colors.white} strokeWidth={3} />
    </Animated.View>
  );
}

// Achievement unlock modal
interface AchievementUnlockProps { visible: boolean; title: string; description: string; icon?: 'trophy' | 'star' | 'sparkles'; onDismiss: () => void; }
export function AchievementUnlock({ visible, title, description, icon = 'trophy', onDismiss }: AchievementUnlockProps) {
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const IconComponent = icon === 'trophy' ? Trophy : icon === 'star' ? Star : Sparkles;

  useEffect(() => {
    if (visible) {
      haptics.success();
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, ...springConfigs.bouncy, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: durations.fast, useNativeDriver: true }),
      ]).start();
      const timer = setTimeout(onDismiss, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onDismiss}>
      <View style={styles.achievementOverlay}>
        <Animated.View style={[styles.achievementCard, { transform: [{ scale }], opacity }]}>
          <View style={styles.achievementIcon}>
            <IconComponent size={iconSizes.xxl} color={colors.warning} />
          </View>
          <Text style={styles.achievementTitle}>{title}</Text>
          <Text style={styles.achievementDescription}>{description}</Text>
        </Animated.View>
      </View>
    </Modal>
  );
}

// Streak milestone celebration
interface StreakMilestoneProps { streak: number; visible: boolean; onDismiss: () => void; }
export function StreakMilestone({ streak, visible, onDismiss }: StreakMilestoneProps) {
  return (
    <AchievementUnlock
      visible={visible}
      title={`${streak} Day Streak! 🔥`}
      description={`You've worked out ${streak} days in a row. Keep it up!`}
      icon="sparkles"
      onDismiss={onDismiss}
    />
  );
}

const styles = StyleSheet.create({
  confettiPiece: { position: 'absolute', width: 10, height: 10, borderRadius: 2 },
  checkmarkContainer: { backgroundColor: colors.success, justifyContent: 'center', alignItems: 'center' },
  achievementOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  achievementCard: { backgroundColor: colors.white, borderRadius: radius.xl, padding: spacing.xxl, alignItems: 'center', width: '100%', maxWidth: 300 },
  achievementIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.warningLight, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.lg },
  achievementTitle: { ...typography.h2, color: colors.black, textAlign: 'center', marginBottom: spacing.sm },
  achievementDescription: { ...typography.body, color: colors.gray600, textAlign: 'center' },
});

