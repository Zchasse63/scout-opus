/**
 * Haptic feedback utilities for Scout app
 * Provides tactile feedback for user interactions
 */

import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Check if haptics are available (iOS only for now)
const isHapticsAvailable = Platform.OS === 'ios';

/**
 * Light haptic feedback - for subtle interactions
 * Use for: filter selection, toggle switches, minor UI changes
 */
export async function lightHaptic(): Promise<void> {
  if (!isHapticsAvailable) return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch (error) {
    // Silently fail if haptics unavailable
  }
}

/**
 * Medium haptic feedback - for standard interactions
 * Use for: button presses, card taps, navigation
 */
export async function mediumHaptic(): Promise<void> {
  if (!isHapticsAvailable) return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch (error) {
    // Silently fail if haptics unavailable
  }
}

/**
 * Heavy haptic feedback - for significant interactions
 * Use for: important actions, confirmations, major state changes
 */
export async function heavyHaptic(): Promise<void> {
  if (!isHapticsAvailable) return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  } catch (error) {
    // Silently fail if haptics unavailable
  }
}

/**
 * Success haptic feedback - for positive outcomes
 * Use for: booking confirmation, save success, payment complete
 */
export async function successHaptic(): Promise<void> {
  if (!isHapticsAvailable) return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch (error) {
    // Silently fail if haptics unavailable
  }
}

/**
 * Warning haptic feedback - for cautionary feedback
 * Use for: validation warnings, low availability alerts
 */
export async function warningHaptic(): Promise<void> {
  if (!isHapticsAvailable) return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  } catch (error) {
    // Silently fail if haptics unavailable
  }
}

/**
 * Error haptic feedback - for negative outcomes
 * Use for: payment failure, validation errors, network errors
 */
export async function errorHaptic(): Promise<void> {
  if (!isHapticsAvailable) return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } catch (error) {
    // Silently fail if haptics unavailable
  }
}

/**
 * Selection haptic feedback - for selection changes
 * Use for: picker changes, slider adjustments, date selection
 */
export async function selectionHaptic(): Promise<void> {
  if (!isHapticsAvailable) return;
  try {
    await Haptics.selectionAsync();
  } catch (error) {
    // Silently fail if haptics unavailable
  }
}

/**
 * Heart toggle haptic - special pattern for favoriting
 * Double tap pattern for satisfying save feedback
 */
export async function heartHaptic(): Promise<void> {
  if (!isHapticsAvailable) return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeout(async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 100);
  } catch (error) {
    // Silently fail if haptics unavailable
  }
}

/**
 * Voice activation haptic - for voice search start
 */
export async function voiceActivationHaptic(): Promise<void> {
  if (!isHapticsAvailable) return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch (error) {
    // Silently fail if haptics unavailable
  }
}

/**
 * Celebration haptic - for booking confirmation
 * Multiple taps for celebratory feel
 */
export async function celebrationHaptic(): Promise<void> {
  if (!isHapticsAvailable) return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 150);
    setTimeout(async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 300);
  } catch (error) {
    // Silently fail if haptics unavailable
  }
}

// Convenience object for all haptic functions
export const haptics = {
  light: lightHaptic,
  medium: mediumHaptic,
  heavy: heavyHaptic,
  success: successHaptic,
  warning: warningHaptic,
  error: errorHaptic,
  selection: selectionHaptic,
  heart: heartHaptic,
  voice: voiceActivationHaptic,
  celebration: celebrationHaptic,
};

export default haptics;

