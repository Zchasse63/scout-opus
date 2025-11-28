/**
 * Theme Context for Scout app
 * Provides theme state and colors throughout the app
 */

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import { lightTheme, darkTheme, ThemeColors } from '../constants/colors';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: ThemeMode;
}

export function ThemeProvider({ children, initialTheme = 'system' }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeMode>(initialTheme);

  // Determine if dark mode is active
  const isDark = useMemo(() => {
    if (theme === 'system') {
      return systemColorScheme === 'dark';
    }
    return theme === 'dark';
  }, [theme, systemColorScheme]);

  // Get the appropriate color palette
  const colors = useMemo(() => {
    return isDark ? darkTheme : lightTheme;
  }, [isDark]);

  // Toggle between light and dark
  const toggleTheme = () => {
    setTheme(current => {
      if (current === 'system') {
        return isDark ? 'light' : 'dark';
      }
      return current === 'light' ? 'dark' : 'light';
    });
  };

  // Listen for system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      // Only update if using system theme
      if (theme === 'system') {
        // Force re-render by updating state
        setTheme('system');
      }
    });

    return () => subscription.remove();
  }, [theme]);

  const value = useMemo(() => ({
    theme,
    isDark,
    colors,
    setTheme,
    toggleTheme,
  }), [theme, isDark, colors]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme context
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/**
 * Hook to get themed colors only
 */
export function useThemedColors(): ThemeColors {
  const { colors } = useTheme();
  return colors;
}

/**
 * Hook to check if dark mode is active
 */
export function useIsDarkMode(): boolean {
  const { isDark } = useTheme();
  return isDark;
}

/**
 * Hook to get system color scheme
 */
export function useSystemTheme(): 'light' | 'dark' {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? 'dark' : 'light';
}

