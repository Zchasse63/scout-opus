/**
 * Accessibility utilities for Scout app
 * VoiceOver support, visual accessibility, motor accessibility helpers
 */
import { AccessibilityInfo, Platform } from 'react-native';
import { useEffect, useState, useCallback } from 'react';

// Check if screen reader is enabled
export function useScreenReader() {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then(setIsEnabled);
    const subscription = AccessibilityInfo.addEventListener('screenReaderChanged', setIsEnabled);
    return () => subscription.remove();
  }, []);

  return isEnabled;
}

// Check if reduce motion is enabled
export function useReduceMotion() {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setIsEnabled);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setIsEnabled);
    return () => subscription.remove();
  }, []);

  return isEnabled;
}

// Check if bold text is enabled (iOS only)
export function useBoldText() {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      AccessibilityInfo.isBoldTextEnabled().then(setIsEnabled);
      const subscription = AccessibilityInfo.addEventListener('boldTextChanged', setIsEnabled);
      return () => subscription.remove();
    }
  }, []);

  return isEnabled;
}

// Generate accessibility props for common components
export interface A11yProps {
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: 'button' | 'link' | 'image' | 'text' | 'header' | 'search' | 'adjustable' | 'none';
  accessibilityState?: { disabled?: boolean; selected?: boolean; checked?: boolean | 'mixed'; busy?: boolean; expanded?: boolean };
  accessibilityValue?: { min?: number; max?: number; now?: number; text?: string };
}

// Helper to create button accessibility props
export function buttonA11y(label: string, hint?: string, disabled = false): A11yProps {
  return {
    accessible: true,
    accessibilityLabel: label,
    accessibilityHint: hint,
    accessibilityRole: 'button',
    accessibilityState: { disabled },
  };
}

// Helper to create link accessibility props
export function linkA11y(label: string, hint?: string): A11yProps {
  return {
    accessible: true,
    accessibilityLabel: label,
    accessibilityHint: hint || 'Opens in browser',
    accessibilityRole: 'link',
  };
}

// Helper for image accessibility
export function imageA11y(description: string): A11yProps {
  return {
    accessible: true,
    accessibilityLabel: description,
    accessibilityRole: 'image',
  };
}

// Helper for headers
export function headerA11y(text: string): A11yProps {
  return {
    accessible: true,
    accessibilityLabel: text,
    accessibilityRole: 'header',
  };
}

// Helper for toggle/checkbox
export function toggleA11y(label: string, isChecked: boolean, hint?: string): A11yProps {
  return {
    accessible: true,
    accessibilityLabel: label,
    accessibilityHint: hint,
    accessibilityRole: 'button',
    accessibilityState: { checked: isChecked },
  };
}

// Helper for slider/adjustable
export function sliderA11y(label: string, value: number, min: number, max: number): A11yProps {
  return {
    accessible: true,
    accessibilityLabel: label,
    accessibilityRole: 'adjustable',
    accessibilityValue: { min, max, now: value, text: `${value}` },
  };
}

// Announce to screen reader
export function announce(message: string) {
  AccessibilityInfo.announceForAccessibility(message);
}

// Focus on element (iOS only)
export function setFocus(reactTag: number) {
  if (Platform.OS === 'ios') {
    AccessibilityInfo.setAccessibilityFocus(reactTag);
  }
}

// Minimum touch target size (44x44 per Apple HIG, 48x48 per Material Design)
export const MIN_TOUCH_TARGET = Platform.OS === 'ios' ? 44 : 48;

// Helper to ensure minimum touch target
export function ensureTouchTarget(size: number): number {
  return Math.max(size, MIN_TOUCH_TARGET);
}

// Color contrast ratios (WCAG AA requirements)
export const CONTRAST_RATIOS = {
  normalText: 4.5,
  largeText: 3,
  graphicsUI: 3,
};

// Check if text should be considered "large" (14pt bold or 18pt regular)
export function isLargeText(fontSize: number, isBold = false): boolean {
  return isBold ? fontSize >= 14 : fontSize >= 18;
}

