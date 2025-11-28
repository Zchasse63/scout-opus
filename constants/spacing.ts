/**
 * Spacing constants for Scout app
 * Based on 4pt grid system
 */

// Base spacing scale (4pt grid)
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

// Border radius
export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
} as const;

// Padding presets
export const padding = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  screenHorizontal: 16,
  screenVertical: 24,
} as const;

// Card-specific spacing
export const cardSpacing = {
  padding: 16,
  paddingCompact: 12,
  gap: 12,
  imageHeight: 200,
  imageHeightCompact: 160,
  borderRadius: 16,
} as const;

// Section spacing for lists and content
export const sectionSpacing = {
  headerMarginBottom: 16,
  itemGap: 12,
  sectionGap: 24,
  listPadding: 16,
} as const;

// Layout constants
export const layout = {
  screenPaddingHorizontal: 16,
  screenPaddingVertical: 24,
  tabBarHeight: 84,
  headerHeight: 56,
  searchBarHeight: 48,
  buttonHeight: 48,
  buttonHeightSmall: 36,
  inputHeight: 48,
  cardMinHeight: 280,
  mapPreviewHeight: 200,
} as const;

// Safe area insets (defaults, will be overridden by device)
export const safeAreaDefaults = {
  top: 44,
  bottom: 34,
} as const;
