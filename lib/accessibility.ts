import { AccessibilityInfo, Platform } from 'react-native';

// Minimum touch target size (Apple HIG recommends 44pt)
export const MIN_TOUCH_TARGET = 44;

// Check if screen reader is enabled
export async function isScreenReaderEnabled(): Promise<boolean> {
  return AccessibilityInfo.isScreenReaderEnabled();
}

// Check if reduce motion is enabled
export async function isReduceMotionEnabled(): Promise<boolean> {
  return AccessibilityInfo.isReduceMotionEnabled();
}

// Announce message to screen reader
export function announceForAccessibility(message: string): void {
  AccessibilityInfo.announceForAccessibility(message);
}

// Color contrast utilities (WCAG 2.1 AA requires 4.5:1 for normal text, 3:1 for large text)
export function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function getContrastRatio(color1: string, color2: string): number {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function meetsContrastRequirement(
  foreground: string,
  background: string,
  isLargeText = false
): boolean {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Accessibility labels for common actions
export const a11yLabels = {
  // Navigation
  back: 'Go back',
  close: 'Close',
  menu: 'Open menu',
  search: 'Search',
  filter: 'Filter results',
  
  // Actions
  save: 'Save',
  delete: 'Delete',
  edit: 'Edit',
  share: 'Share',
  refresh: 'Refresh',
  
  // Gym specific
  viewGym: (name: string) => `View ${name} details`,
  bookGym: (name: string) => `Book a pass at ${name}`,
  saveGym: (name: string) => `Save ${name} to favorites`,
  unsaveGym: (name: string) => `Remove ${name} from favorites`,
  callGym: (name: string) => `Call ${name}`,
  getDirections: (name: string) => `Get directions to ${name}`,
  
  // Booking
  selectPass: (type: string, price: string) => `Select ${type} pass for ${price}`,
  viewQRCode: 'View QR code for check-in',
  cancelBooking: 'Cancel this booking',
  
  // Rating
  rating: (value: number, max: number = 5) => `Rating: ${value} out of ${max} stars`,
  setRating: (value: number) => `Set rating to ${value} stars`,
  
  // Form
  required: (label: string) => `${label}, required`,
  optional: (label: string) => `${label}, optional`,
  error: (label: string, error: string) => `${label}, error: ${error}`,
};

// Accessibility hints for common actions
export const a11yHints = {
  doubleTap: 'Double tap to activate',
  swipeToDelete: 'Swipe left to delete',
  pullToRefresh: 'Pull down to refresh',
  pinchToZoom: 'Pinch to zoom',
  dragToReorder: 'Drag to reorder',
};

// Platform-specific accessibility settings
export const a11ySettings = {
  // Minimum animation duration when reduce motion is enabled
  reducedMotionDuration: 0,
  
  // Standard animation duration
  standardDuration: 300,
  
  // Get appropriate animation duration based on user preference
  getAnimationDuration: async (standardDuration = 300): Promise<number> => {
    const reduceMotion = await isReduceMotionEnabled();
    return reduceMotion ? 0 : standardDuration;
  },
};

