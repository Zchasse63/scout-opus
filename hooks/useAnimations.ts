/**
 * Animation hooks for Scout app
 * Provides reusable animation utilities for components
 */
import { useCallback, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { durations, springConfigs, scaleValues, staggerDelays } from '../constants/animations';

// Shared animated value hook with scale animation
export function useScaleAnimation(initialValue = 1) {
  const scale = useRef(new Animated.Value(initialValue)).current;

  const animatePress = useCallback(() => {
    Animated.spring(scale, { toValue: scaleValues.pressed, ...springConfigs.snappy, useNativeDriver: true }).start();
  }, [scale]);

  const animateRelease = useCallback(() => {
    Animated.spring(scale, { toValue: scaleValues.normal, ...springConfigs.bouncy, useNativeDriver: true }).start();
  }, [scale]);

  const animatePop = useCallback(() => {
    Animated.sequence([
      Animated.spring(scale, { toValue: scaleValues.pop, ...springConfigs.bouncy, useNativeDriver: true }),
      Animated.spring(scale, { toValue: scaleValues.normal, ...springConfigs.gentle, useNativeDriver: true }),
    ]).start();
  }, [scale]);

  return { scale, animatePress, animateRelease, animatePop };
}

// Fade animation hook
export function useFadeAnimation(initialValue = 0) {
  const opacity = useRef(new Animated.Value(initialValue)).current;

  const fadeIn = useCallback((duration = durations.normal) => {
    Animated.timing(opacity, { toValue: 1, duration, useNativeDriver: true, easing: Easing.out(Easing.ease) }).start();
  }, [opacity]);

  const fadeOut = useCallback((duration = durations.normal) => {
    Animated.timing(opacity, { toValue: 0, duration, useNativeDriver: true, easing: Easing.in(Easing.ease) }).start();
  }, [opacity]);

  return { opacity, fadeIn, fadeOut };
}

// Slide animation hook
export function useSlideAnimation(initialValue = 100) {
  const translateY = useRef(new Animated.Value(initialValue)).current;

  const slideIn = useCallback((duration = durations.normal) => {
    Animated.spring(translateY, { toValue: 0, ...springConfigs.gentle, useNativeDriver: true }).start();
  }, [translateY]);

  const slideOut = useCallback((toValue = 100) => {
    Animated.spring(translateY, { toValue, ...springConfigs.snappy, useNativeDriver: true }).start();
  }, [translateY]);

  return { translateY, slideIn, slideOut };
}

// Stagger animation for lists
export function useStaggerAnimation(itemCount: number, staggerType: keyof typeof staggerDelays = 'normal') {
  const animations = useRef(Array.from({ length: itemCount }, () => new Animated.Value(0))).current;

  const staggerIn = useCallback(() => {
    const delay = staggerDelays[staggerType];
    const anims = animations.map((anim, i) => 
      Animated.timing(anim, { toValue: 1, duration: durations.normal, delay: i * delay, useNativeDriver: true, easing: Easing.out(Easing.ease) })
    );
    Animated.parallel(anims).start();
  }, [animations, staggerType]);

  const reset = useCallback(() => {
    animations.forEach(anim => anim.setValue(0));
  }, [animations]);

  return { animations, staggerIn, reset };
}

// Shake animation for errors
export function useShakeAnimation() {
  const translateX = useRef(new Animated.Value(0)).current;

  const shake = useCallback(() => {
    Animated.sequence([
      Animated.timing(translateX, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(translateX, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  }, [translateX]);

  return { translateX, shake };
}

// Pulse animation for attention
export function usePulseAnimation() {
  const scale = useRef(new Animated.Value(1)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  const startPulse = useCallback(() => {
    loopRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.1, duration: durations.slow, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: durations.slow, useNativeDriver: true }),
      ])
    );
    loopRef.current.start();
  }, [scale]);

  const stopPulse = useCallback(() => {
    loopRef.current?.stop();
    scale.setValue(1);
  }, [scale]);

  return { scale, startPulse, stopPulse };
}

// Rotate animation
export function useRotateAnimation() {
  const rotation = useRef(new Animated.Value(0)).current;

  const spin = useCallback((duration = durations.celebration) => {
    Animated.timing(rotation, { toValue: 1, duration, useNativeDriver: true, easing: Easing.linear }).start(() => rotation.setValue(0));
  }, [rotation]);

  const rotateInterpolate = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return { rotation, spin, rotateInterpolate };
}

// Combined entrance animation
export function useEntranceAnimation() {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const scale = useRef(new Animated.Value(0.95)).current;

  const animateIn = useCallback((delay = 0) => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: durations.normal, delay, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, ...springConfigs.gentle, delay, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, ...springConfigs.gentle, delay, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY, scale]);

  return { opacity, translateY, scale, animateIn };
}

