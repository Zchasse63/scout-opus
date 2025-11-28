/**
 * Themed StyleSheet utilities
 * Creates theme-aware styles for components
 */

import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { ThemeColors, lightTheme, darkTheme } from '../constants/colors';

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };
type StyleFactory<T> = (colors: ThemeColors) => T;

/**
 * Creates a themed StyleSheet that updates based on theme
 */
export function createThemedStyles<T extends NamedStyles<T>>(
  styleFactory: StyleFactory<T>
): { light: T; dark: T } {
  return {
    light: StyleSheet.create(styleFactory(lightTheme)) as T,
    dark: StyleSheet.create(styleFactory(darkTheme)) as T,
  };
}

/**
 * Hook-compatible style getter
 */
export function getThemedStyles<T extends NamedStyles<T>>(
  styles: { light: T; dark: T },
  isDark: boolean
): T {
  return isDark ? styles.dark : styles.light;
}

/**
 * Common themed style patterns
 */
export const commonThemedStyles = createThemedStyles((colors) => ({
  // Containers
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardElevated: {
    backgroundColor: colors.cardElevated,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  // Text
  textPrimary: {
    color: colors.text,
  },
  textSecondary: {
    color: colors.textSecondary,
  },
  textTertiary: {
    color: colors.textTertiary,
  },
  
  // Borders
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  
  // Inputs
  input: {
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    color: colors.text,
  },
  
  // Buttons
  buttonPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  buttonSecondary: {
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
  },
}));

/**
 * Dark mode map style for Google Maps / MapView
 */
export const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b9a76' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3d19c' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#17263c' }],
  },
];

// Light map style (default, but can be customized)
export const lightMapStyle: typeof darkMapStyle = [];

