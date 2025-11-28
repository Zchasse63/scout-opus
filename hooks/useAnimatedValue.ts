/**
 * Custom hooks for animations using react-native-reanimated
 */

import { useCallback, useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import { springConfigs, durations, scaleValues } from '../constants/animations';

/**
 * Hook for animated scale on press
 */
export function useAnimatedPress(onPressCallback?: () => void) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = useCallback(() => {
    scale.value = withSpring(scaleValues.pressed, springConfigs.snappy);
  }, [scale]);

  const onPressOut = useCallback(() => {
    scale.value = withSpring(1, springConfigs.snappy);
    if (onPressCallback) {
      runOnJS(onPressCallback)();
    }
  }, [scale, onPressCallback]);

  return { animatedStyle, onPressIn, onPressOut };
}

/**
 * Hook for heart/save toggle animation
 */
export function useHeartAnimation() {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const triggerAnimation = useCallback(() => {
    scale.value = withSequence(
      withSpring(scaleValues.pop, springConfigs.bouncy),
      withSpring(1, springConfigs.gentle)
    );
  }, [scale]);

  return { animatedStyle, triggerAnimation };
}

/**
 * Hook for skeleton shimmer animation
 */
export function useSkeletonAnimation() {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    const animate = () => {
      opacity.value = withSequence(
        withTiming(1, { duration: durations.skeleton / 2 }),
        withTiming(0.3, { duration: durations.skeleton / 2 })
      );
    };
    animate();
    const interval = setInterval(animate, durations.skeleton);
    return () => clearInterval(interval);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return { animatedStyle };
}

/**
 * Hook for fade in animation
 */
export function useFadeIn(delay = 0) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: durations.normal }));
    translateY.value = withDelay(delay, withSpring(0, springConfigs.gentle));
  }, [opacity, translateY, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return { animatedStyle };
}

/**
 * Hook for staggered list item animations
 */
export function useStaggeredAnimation(index: number, baseDelay = 50) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    const delay = index * baseDelay;
    opacity.value = withDelay(delay, withTiming(1, { duration: durations.normal }));
    translateY.value = withDelay(delay, withSpring(0, springConfigs.gentle));
  }, [opacity, translateY, index, baseDelay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return { animatedStyle };
}

/**
 * Hook for scroll-based parallax effect
 */
export function useParallaxScroll(scrollY: { value: number }, inputRange: number[], outputRange: number[]) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{
      translateY: interpolate(scrollY.value, inputRange, outputRange, Extrapolation.CLAMP),
    }],
  }));

  return { animatedStyle };
}

/**
 * Hook for success checkmark animation
 */
export function useSuccessAnimation() {
  const scale = useSharedValue(0);
  const rotation = useSharedValue(-45);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const triggerAnimation = useCallback(() => {
    scale.value = withSpring(1, springConfigs.bouncy);
    rotation.value = withSpring(0, springConfigs.bouncy);
  }, [scale, rotation]);

  const reset = useCallback(() => {
    scale.value = 0;
    rotation.value = -45;
  }, [scale, rotation]);

  return { animatedStyle, triggerAnimation, reset };
}

