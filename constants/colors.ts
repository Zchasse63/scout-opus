/**
 * Color constants for Scout app
 * Supports light and dark mode
 */

export const colors = {
  // Primary Orange
  primary: '#FF5A1F',
  primaryLight: '#FF7A45',
  primaryDark: '#E04A10',
  orange50: '#FFF5F0',

  // Secondary Blue
  secondary: '#0066FF',
  blue50: '#E8F0FF',
  blue500: '#0066FF',
  blue600: '#0052CC',
  blue700: '#003D99',

  // Info Blue
  info: '#0066FF',
  infoLight: '#E8F0FF',

  // Grays
  black: '#1A1A1A',
  gray900: '#2D2D2D',
  gray800: '#3A3A3A',
  gray700: '#4A4A4A',
  gray600: '#666666',
  gray500: '#7A7A7A',
  gray400: '#999999',
  gray300: '#B0B0B0',
  gray200: '#D0D0D0',
  gray100: '#F0F0F0',
  gray50: '#F8F8F8',
  white: '#FFFFFF',

  // Status Colors
  success: '#00C853',
  successLight: '#E8F5E9',
  green600: '#2E7D32',
  warning: '#FFB300',
  warningLight: '#FFF8E1',
  error: '#FF3D00',
  errorLight: '#FFEBEE',

  // Utility
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
} as const;

// Light theme colors
export const lightTheme = {
  // Backgrounds
  background: colors.white,
  backgroundSecondary: colors.gray50,
  backgroundTertiary: colors.gray100,
  card: colors.white,
  cardElevated: colors.white,

  // Text
  text: colors.black,
  textSecondary: colors.gray600,
  textTertiary: colors.gray500,
  textInverse: colors.white,

  // Borders
  border: colors.gray200,
  borderLight: colors.gray100,

  // Interactive
  primary: colors.primary,
  primaryLight: colors.orange50,

  // Status
  success: colors.success,
  successBackground: colors.successLight,
  warning: colors.warning,
  warningBackground: colors.warningLight,
  error: colors.error,
  errorBackground: colors.errorLight,

  // Misc
  disabled: colors.gray400,
  placeholder: colors.gray400,
  skeleton: colors.gray200,
  overlay: colors.overlay,
  tabBar: colors.white,
  tabBarBorder: colors.gray100,
} as const;

// Dark theme colors
export const darkTheme = {
  // Backgrounds
  background: '#121212',
  backgroundSecondary: '#1E1E1E',
  backgroundTertiary: '#2A2A2A',
  card: '#1E1E1E',
  cardElevated: '#2A2A2A',

  // Text
  text: colors.white,
  textSecondary: colors.gray300,
  textTertiary: colors.gray400,
  textInverse: colors.black,

  // Borders
  border: colors.gray700,
  borderLight: colors.gray800,

  // Interactive
  primary: colors.primaryLight,
  primaryLight: 'rgba(255, 90, 31, 0.15)',

  // Status
  success: '#4CAF50',
  successBackground: 'rgba(76, 175, 80, 0.15)',
  warning: '#FFC107',
  warningBackground: 'rgba(255, 193, 7, 0.15)',
  error: '#FF5252',
  errorBackground: 'rgba(255, 82, 82, 0.15)',

  // Misc
  disabled: colors.gray600,
  placeholder: colors.gray500,
  skeleton: colors.gray800,
  overlay: 'rgba(0, 0, 0, 0.7)',
  tabBar: '#1E1E1E',
  tabBarBorder: colors.gray800,
} as const;

// Theme type - use a more flexible type that works for both themes
export type ThemeColors = {
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  card: string;
  cardElevated: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  border: string;
  borderLight: string;
  primary: string;
  primaryLight: string;
  success: string;
  successBackground: string;
  warning: string;
  warningBackground: string;
  error: string;
  errorBackground: string;
  disabled: string;
  placeholder: string;
  skeleton: string;
  overlay: string;
  tabBar: string;
  tabBarBorder: string;
};

// Legacy colorScheme export for backward compatibility
export const colorScheme = {
  light: {
    background: lightTheme.background,
    text: lightTheme.text,
    textSecondary: lightTheme.textSecondary,
    border: lightTheme.border,
    disabled: lightTheme.disabled,
  },
  dark: {
    background: darkTheme.background,
    text: darkTheme.text,
    textSecondary: darkTheme.textSecondary,
    border: darkTheme.border,
    disabled: darkTheme.disabled,
  },
};
