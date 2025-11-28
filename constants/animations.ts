/**
 * Animation constants for Scout app
 * Centralized spring configs, timing, and gesture configurations
 */

// Duration constants (in ms)
export const durations = {
  instant: 0,
  micro: 100,
  fast: 150,
  normal: 300,
  slow: 500,
  celebration: 800,
  confetti: 2000,
  skeleton: 1500,
} as const;

// Legacy export for backward compatibility
export const animations = durations;

// Spring configurations for different interaction types
export const springConfigs = {
  gentle: { damping: 20, stiffness: 150, mass: 1 },
  snappy: { damping: 15, stiffness: 300, mass: 0.8 },
  bouncy: { damping: 10, stiffness: 200, mass: 1 },
  stiff: { damping: 25, stiffness: 400, mass: 0.5 },
  soft: { damping: 30, stiffness: 100, mass: 1.2 },
} as const;

// Legacy export
export const springConfig = {
  ...springConfigs.bouncy,
  overshootClamping: true,
};

// Scale values for press animations
export const scaleValues = {
  pressed: 0.97,
  active: 1.05,
  normal: 1,
  pop: 1.2,
  shrink: 0.8,
} as const;

// Opacity values
export const opacityValues = {
  hidden: 0,
  disabled: 0.5,
  muted: 0.7,
  visible: 1,
} as const;

// Gesture configurations
export const gestureConfigs = {
  swipe: { velocityThreshold: 500, distanceThreshold: 50 },
  longPress: { minDuration: 500 },
  pan: { activeOffsetX: [-10, 10], activeOffsetY: [-10, 10] },
  pinch: { minScale: 0.5, maxScale: 3 },
} as const;

// Animation presets for common use cases
export const animationPresets = {
  cardPress: { scale: scaleValues.pressed, duration: durations.micro },
  heartPop: { scale: scaleValues.pop, spring: springConfigs.bouncy },
  buttonFeedback: { scale: scaleValues.pressed, spring: springConfigs.snappy },
  skeletonShimmer: { duration: durations.skeleton, loop: true },
} as const;

// Stagger delays
export const staggerDelays = { fast: 50, normal: 100, slow: 150 } as const;

// Legacy easing export
export const easing = {
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  linear: 'linear',
};
