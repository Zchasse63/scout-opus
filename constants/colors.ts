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
  green600: '#2E7D32',
  warning: '#FFB300',
  error: '#FF3D00',

  // Utility
  transparent: 'transparent',
};

export const colorScheme = {
  light: {
    background: colors.white,
    text: colors.black,
    textSecondary: colors.gray700,
    border: colors.gray300,
    disabled: colors.gray500,
  },
  dark: {
    background: colors.gray900,
    text: colors.white,
    textSecondary: colors.gray300,
    border: colors.gray700,
    disabled: colors.gray500,
  },
};
