/**
 * Animated UI components for Scout app
 * Provides delightful micro-interactions
 */

import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, Pressable, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withRepeat,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { Heart, Check } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { springConfigs, durations, scaleValues } from '../../constants/animations';
import { iconSizes } from '../../constants/icons';

interface AnimatedHeartProps {
  isSaved: boolean;
  onPress: () => void;
  size?: number;
  color?: string;
  savedColor?: string;
}

export function AnimatedHeart({
  isSaved,
  onPress,
  size = iconSizes.md,
  color = colors.gray600,
  savedColor = colors.error,
}: AnimatedHeartProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = useCallback(() => {
    scale.value = withSequence(
      withSpring(scaleValues.pop, springConfigs.bouncy),
      withSpring(1, springConfigs.gentle)
    );
    onPress();
  }, [scale, onPress]);

  return (
    <Pressable onPress={handlePress}>
      <Animated.View style={animatedStyle}>
        <Heart
          size={size}
          color={isSaved ? savedColor : color}
          fill={isSaved ? savedColor : 'transparent'}
          strokeWidth={2}
        />
      </Animated.View>
    </Pressable>
  );
}

interface AnimatedButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}

export function AnimatedButton({ children, onPress, style, disabled }: AnimatedButtonProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled ? 0.5 : 1,
  }));

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={() => !disabled && (scale.value = withSpring(scaleValues.pressed, springConfigs.snappy))}
      onPressOut={() => (scale.value = withSpring(1, springConfigs.snappy))}
    >
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </Pressable>
  );
}

export function PulsingDot({ size = 8, color = colors.success }: { size?: number; color?: string }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(withSequence(withTiming(1.5, { duration: 1000 }), withTiming(1, { duration: 1000 })), -1, false);
    opacity.value = withRepeat(withSequence(withTiming(0.5, { duration: 1000 }), withTiming(1, { duration: 1000 })), -1, false);
  }, [scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }], opacity: opacity.value }));
  return <Animated.View style={[{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }, animatedStyle]} />;
}

interface AnimatedCheckmarkProps {
  visible: boolean;
  size?: number;
  color?: string;
  onComplete?: () => void;
}

export function AnimatedCheckmark({ visible, size = iconSizes.xl, color = colors.success, onComplete }: AnimatedCheckmarkProps) {
  const scale = useSharedValue(0);
  const rotation = useSharedValue(-45);

  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, springConfigs.bouncy, () => { if (onComplete) runOnJS(onComplete)(); });
      rotation.value = withSpring(0, springConfigs.bouncy);
    } else {
      scale.value = 0;
      rotation.value = -45;
    }
  }, [visible, scale, rotation, onComplete]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }] }));
  if (!visible && scale.value === 0) return null;

  return (
    <Animated.View style={[styles.checkmarkContainer, animatedStyle]}>
      <View style={[styles.checkmarkCircle, { backgroundColor: color }]}>
        <Check size={size * 0.6} color={colors.white} strokeWidth={3} />
      </View>
    </Animated.View>
  );
}

export function Confetti({ visible, count = 30 }: { visible: boolean; count?: number }) {
  if (!visible) return null;
  return (
    <View style={styles.confettiContainer} pointerEvents="none">
      {Array.from({ length: count }).map((_, i) => <ConfettiPiece key={i} index={i} />)}
    </View>
  );
}

function ConfettiPiece({ index }: { index: number }) {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(0);
  const rot = useSharedValue(0);
  const opacity = useSharedValue(1);
  const confettiColors = [colors.primary, colors.success, colors.warning, colors.secondary];
  const pieceColor = confettiColors[index % confettiColors.length];
  const startX = Math.random() * 300 - 150;
  const endX = startX + (Math.random() * 100 - 50);

  useEffect(() => {
    const delay = Math.random() * 500;
    translateY.value = withDelay(delay, withTiming(400, { duration: durations.confetti }));
    translateX.value = withDelay(delay, withTiming(endX, { duration: durations.confetti }));
    rot.value = withDelay(delay, withTiming(360 * (Math.random() > 0.5 ? 1 : -1), { duration: durations.confetti }));
    opacity.value = withDelay(delay + 1500, withTiming(0, { duration: 500 }));
  }, [translateY, translateX, rot, opacity, endX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { rotate: `${rot.value}deg` }],
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.confettiPiece, { backgroundColor: pieceColor, left: `${50 + startX / 3}%` }, animatedStyle]} />;
}

const styles = StyleSheet.create({
  checkmarkContainer: { alignItems: 'center', justifyContent: 'center' },
  checkmarkCircle: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  confettiContainer: { ...StyleSheet.absoluteFillObject, alignItems: 'center', overflow: 'hidden' },
  confettiPiece: { position: 'absolute', top: 0, width: 10, height: 10, borderRadius: 2 },
});
