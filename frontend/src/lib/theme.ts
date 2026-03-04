/**
 * Theme Management Utilities
 * Handles dark/light mode switching with localStorage persistence
 */

export type Theme = 'light' | 'dark' | 'system';

const THEME_STORAGE_KEY = 'arthapath-theme';

/**
 * Get the current theme from localStorage or system preference
 */
export function getTheme(): Theme {
  if (typeof window === 'undefined') return 'system';

  const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
  if (stored) return stored;

  // Check system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

/**
 * Get the actual applied theme (resolving 'system' to actual theme)
 */
export function getAppliedTheme(): 'light' | 'dark' {
  const theme = getTheme();

  if (theme === 'system') {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  return theme;
}

/**
 * Set the theme and persist to localStorage
 */
export function setTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem(THEME_STORAGE_KEY, theme);

  // Update HTML attribute and class for CSS selectors
  const html = document.documentElement;

  if (theme === 'system') {
    html.removeAttribute('data-theme');
    // Let CSS media queries handle it
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  } else {
    html.setAttribute('data-theme', theme);
    // Add/remove dark class for Tailwind dark mode
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }

  // Trigger any listeners
  window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme } }));
}

/**
 * Toggle between light and dark themes
 */
export function toggleTheme(): Theme {
  const current = getTheme();
  const next: Theme = current === 'light' ? 'dark' : 'light';
  setTheme(next);
  return next;
}

/**
 * Listen for theme changes
 */
export function onThemeChange(callback: (theme: Theme) => void): () => void {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<{ theme: Theme }>;
    callback(customEvent.detail.theme);
  };

  window.addEventListener('theme-change', handler);

  // Return unsubscribe function
  return () => {
    window.removeEventListener('theme-change', handler);
  };
}

/**
 * Initialize theme on page load
 */
export function initializeTheme(): void {
  if (typeof window === 'undefined') return;

  const theme = getTheme();
  const html = document.documentElement;

  if (theme !== 'system') {
    html.setAttribute('data-theme', theme);
  }
}
