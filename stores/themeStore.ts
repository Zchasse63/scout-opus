import { create } from 'zustand';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeStore {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  mode: 'system',
  isDark: false,

  setMode: (mode: ThemeMode) => {
    set({ mode });
    // Update isDark based on mode and system preference
    if (mode === 'system') {
      const systemColorScheme = useColorScheme();
      set({ isDark: systemColorScheme === 'dark' });
    } else {
      set({ isDark: mode === 'dark' });
    }
  },

  toggleTheme: () => {
    const current = get().mode;
    if (current === 'system') {
      set({ mode: 'dark', isDark: true });
    } else if (current === 'dark') {
      set({ mode: 'light', isDark: false });
    } else {
      set({ mode: 'system' });
      const systemColorScheme = useColorScheme();
      set({ isDark: systemColorScheme === 'dark' });
    }
  },
}));

// Hook to get current theme colors
export const useThemeColors = () => {
  const isDark = useThemeStore((state) => state.isDark);

  return {
    isDark,
    colors: {
      // Primary colors remain the same
      primary: '#FF5A1F',
      primaryLight: '#FF7A45',
      primaryDark: '#E04A10',
      secondary: '#0066FF',
      secondaryLight: '#3385FF',
      secondaryDark: '#0052CC',

      // Semantic colors
      success: '#00C853',
      warning: '#FFB300',
      error: '#FF3D00',

      // Adaptive colors based on theme
      background: isDark ? '#000000' : '#FFFFFF',
      surface: isDark ? '#1A1A1A' : '#FFFFFF',
      card: isDark ? '#1E1E1E' : '#FFFFFF',

      text: isDark ? '#FFFFFF' : '#1A1A1A',
      textSecondary: isDark ? '#B0B0B0' : '#4A4A4A',
      textTertiary: isDark ? '#7A7A7A' : '#7A7A7A',

      border: isDark ? '#2D2D2D' : '#F0F0F0',
      divider: isDark ? '#2D2D2D' : '#E0E0E0',

      // Grays (adaptive)
      gray900: isDark ? '#E0E0E0' : '#2D2D2D',
      gray700: isDark ? '#B0B0B0' : '#4A4A4A',
      gray500: '#7A7A7A', // Same in both modes
      gray300: isDark ? '#4A4A4A' : '#B0B0B0',
      gray100: isDark ? '#2D2D2D' : '#F0F0F0',

      // Special
      overlay: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
      shimmer: isDark ? '#2D2D2D' : '#F0F0F0',
    },
  };
};
