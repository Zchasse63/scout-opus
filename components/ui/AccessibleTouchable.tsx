/**
 * Accessible touchable component with proper touch targets and VoiceOver support
 */
import React, { useCallback, useRef } from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, StyleProp, Animated, View } from 'react-native';
import { MIN_TOUCH_TARGET, A11yProps, useReduceMotion } from '../../utils/accessibility';
import { haptics } from '../../utils/haptics';
import { springConfigs, scaleValues } from '../../constants/animations';

interface AccessibleTouchableProps extends A11yProps {
  children: React.ReactNode;
  onPress: () => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
  hitSlop?: { top: number; bottom: number; left: number; right: number };
  disabled?: boolean;
  enableHaptics?: boolean;
  enableScaleAnimation?: boolean;
}

export function AccessibleTouchable({
  children,
  onPress,
  onLongPress,
  style,
  hitSlop,
  disabled = false,
  enableHaptics = true,
  enableScaleAnimation = true,
  ...a11yProps
}: AccessibleTouchableProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const reduceMotion = useReduceMotion();

  // Calculate hit slop to ensure minimum touch target
  const defaultHitSlop = { top: 8, bottom: 8, left: 8, right: 8 };

  const handlePressIn = useCallback(() => {
    if (!disabled && enableScaleAnimation && !reduceMotion) {
      Animated.spring(scale, { toValue: scaleValues.pressed, ...springConfigs.snappy, useNativeDriver: true }).start();
    }
  }, [disabled, enableScaleAnimation, reduceMotion, scale]);

  const handlePressOut = useCallback(() => {
    if (enableScaleAnimation && !reduceMotion) {
      Animated.spring(scale, { toValue: scaleValues.normal, ...springConfigs.bouncy, useNativeDriver: true }).start();
    }
  }, [enableScaleAnimation, reduceMotion, scale]);

  const handlePress = useCallback(() => {
    if (disabled) return;
    if (enableHaptics) haptics.light();
    onPress();
  }, [disabled, enableHaptics, onPress]);

  const handleLongPress = useCallback(() => {
    if (disabled || !onLongPress) return;
    if (enableHaptics) haptics.medium();
    onLongPress();
  }, [disabled, enableHaptics, onLongPress]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      onLongPress={handleLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={reduceMotion ? 0.7 : 1}
      hitSlop={hitSlop || defaultHitSlop}
      style={styles.touchable}
      {...a11yProps}
      accessibilityState={{ ...a11yProps.accessibilityState, disabled }}
    >
      <Animated.View style={[style, !reduceMotion && { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}

// Icon button with proper touch target
interface AccessibleIconButtonProps extends A11yProps {
  icon: React.ReactNode;
  onPress: () => void;
  size?: number;
  backgroundColor?: string;
  disabled?: boolean;
}

export function AccessibleIconButton({
  icon,
  onPress,
  size = 24,
  backgroundColor,
  disabled = false,
  ...a11yProps
}: AccessibleIconButtonProps) {
  // Ensure minimum touch target
  const touchSize = Math.max(size + 20, MIN_TOUCH_TARGET);

  return (
    <AccessibleTouchable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.iconButton,
        { width: touchSize, height: touchSize, borderRadius: touchSize / 2 },
        backgroundColor && { backgroundColor },
      ]}
      {...a11yProps}
    >
      {icon}
    </AccessibleTouchable>
  );
}

// Skip to content link for screen readers
interface SkipLinkProps {
  targetRef: React.RefObject<View>;
  label?: string;
}

export function SkipLink({ targetRef, label = 'Skip to main content' }: SkipLinkProps) {
  const handlePress = useCallback(() => {
    // In a real implementation, this would focus the target element
  }, [targetRef]);

  return (
    <AccessibleTouchable
      onPress={handlePress}
      accessibilityLabel={label}
      accessibilityRole="link"
      style={styles.skipLink}
    >
      <View />
    </AccessibleTouchable>
  );
}

const styles = StyleSheet.create({
  touchable: { alignSelf: 'flex-start' },
  iconButton: { justifyContent: 'center', alignItems: 'center' },
  skipLink: { position: 'absolute', top: -1000, left: 0, width: 1, height: 1, overflow: 'hidden' },
});

