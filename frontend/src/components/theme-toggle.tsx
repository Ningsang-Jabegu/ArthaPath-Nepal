'use client';

import { useEffect, useState } from 'react';
import { getTheme, setTheme, toggleTheme, onThemeChange, type Theme } from '@/lib/theme';

/**
 * Theme Toggle Component
 * Provides button to switch between light and dark themes
 */
export function ThemeToggle() {
  const [theme, setCurrentTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  /**
   * Initialize theme on mount
   */
  useEffect(() => {
    setMounted(true);
    setCurrentTheme(getTheme());

    // Listen for theme changes from other components/tabs
    const unsubscribe = onThemeChange((newTheme) => {
      setCurrentTheme(newTheme);
    });

    return unsubscribe;
  }, []);

  /**
   * Handle theme toggle
   */
  const handleToggle = () => {
    const newTheme = toggleTheme();
    setCurrentTheme(newTheme);
  };

  if (!mounted) return null;

  const isDark = theme === 'dark';

  return (
    <button
      onClick={handleToggle}
      className={`
        relative inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium
        transition-colors
        ${
          isDark
            ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }
      `}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <>
          <span>☀️</span>
          <span>Light</span>
        </>
      ) : (
        <>
          <span>🌙</span>
          <span>Dark</span>
        </>
      )}
    </button>
  );
}

/**
 * Hook to use current theme
 */
export function useTheme() {
  const [theme, setCurrentTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentTheme(getTheme());

    const unsubscribe = onThemeChange(setCurrentTheme);
    return unsubscribe;
  }, []);

  return {
    theme,
    toggleTheme: () => {
      const newTheme = toggleTheme();
      setCurrentTheme(newTheme);
    },
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme);
      setCurrentTheme(newTheme);
    },
    mounted,
  };
}
