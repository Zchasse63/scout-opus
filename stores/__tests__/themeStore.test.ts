import { renderHook, act } from '@testing-library/react-native';
import { useThemeStore } from '../themeStore';

describe('themeStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useThemeStore());
    act(() => {
      result.current.setMode('system');
    });
  });

  it('should initialize with system theme mode', () => {
    const { result } = renderHook(() => useThemeStore());
    expect(result.current.mode).toBe('system');
  });

  it('should set theme mode to light', () => {
    const { result } = renderHook(() => useThemeStore());

    act(() => {
      result.current.setMode('light');
    });

    expect(result.current.mode).toBe('light');
    expect(result.current.isDark).toBe(false);
  });

  it('should set theme mode to dark', () => {
    const { result } = renderHook(() => useThemeStore());

    act(() => {
      result.current.setMode('dark');
    });

    expect(result.current.mode).toBe('dark');
    expect(result.current.isDark).toBe(true);
  });

  it('should toggle theme through modes', () => {
    const { result } = renderHook(() => useThemeStore());

    // Start at system
    expect(result.current.mode).toBe('system');

    // Toggle to dark (system -> dark)
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.mode).toBe('dark');

    // Toggle to light (dark -> light)
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.mode).toBe('light');

    // Toggle back to system (light -> system)
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.mode).toBe('system');
  });
});
