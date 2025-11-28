/**
 * Animated list item wrapper with stagger entrance and press feedback
 */
import React, { useEffect, useRef, useCallback } from 'react';
import { Animated, Pressable, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { durations, springConfigs, scaleValues, staggerDelays } from '../../constants/animations';
import { haptics } from '../../utils/haptics';

interface AnimatedListItemProps {
  index: number;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  staggerDelay?: keyof typeof staggerDelays;
  enableHaptics?: boolean;
}

export function AnimatedListItem({
  index,
  children,
  style,
  onPress,
  onLongPress,
  disabled = false,
  staggerDelay = 'normal',
  enableHaptics = true,
}: AnimatedListItemProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const scale = useRef(new Animated.Value(1)).current;

  // Stagger entrance animation
  useEffect(() => {
    const delay = index * staggerDelays[staggerDelay];
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: durations.normal, delay, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, ...springConfigs.gentle, delay, useNativeDriver: true }),
    ]).start();
  }, [index, staggerDelay, opacity, translateY]);

  const handlePressIn = useCallback(() => {
    if (disabled) return;
    Animated.spring(scale, { toValue: scaleValues.pressed, ...springConfigs.snappy, useNativeDriver: true }).start();
  }, [disabled, scale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scale, { toValue: scaleValues.normal, ...springConfigs.bouncy, useNativeDriver: true }).start();
  }, [scale]);

  const handlePress = useCallback(() => {
    if (disabled) return;
    if (enableHaptics) haptics.light();
    onPress?.();
  }, [disabled, enableHaptics, onPress]);

  const handleLongPress = useCallback(() => {
    if (disabled) return;
    if (enableHaptics) haptics.medium();
    onLongPress?.();
  }, [disabled, enableHaptics, onLongPress]);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }, { scale }] }, style]}>
      <Pressable
        onPress={handlePress}
        onLongPress={handleLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || (!onPress && !onLongPress)}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

// Simple fade-in wrapper
interface FadeInViewProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}

export function FadeInView({ children, delay = 0, duration = durations.normal, style }: FadeInViewProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration, delay, useNativeDriver: true }).start();
  }, [opacity, duration, delay]);

  return <Animated.View style={[{ opacity }, style]}>{children}</Animated.View>;
}

// Scale on press wrapper
interface PressableScaleProps {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  enableHaptics?: boolean;
}

export function PressableScale({ children, onPress, onLongPress, style, disabled = false, enableHaptics = true }: PressableScaleProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!disabled) Animated.spring(scale, { toValue: scaleValues.pressed, ...springConfigs.snappy, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: scaleValues.normal, ...springConfigs.bouncy, useNativeDriver: true }).start();
  };

  const handlePress = () => {
    if (disabled) return;
    if (enableHaptics) haptics.light();
    onPress?.();
  };

  return (
    <Pressable onPress={handlePress} onLongPress={onLongPress} onPressIn={handlePressIn} onPressOut={handlePressOut} disabled={disabled || !onPress}>
      <Animated.View style={[{ transform: [{ scale }] }, style]}>{children}</Animated.View>
    </Pressable>
  );
}

