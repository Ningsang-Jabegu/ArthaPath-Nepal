'use client';

import { useEffect, useState } from 'react';

/**
 * Simple Theme Toggle Button
 * Lightweight toggle button for pages without full layout (login/register)
 */
export function SimpleThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Get initial theme
    const storedTheme = localStorage.getItem('arthapath-theme');
    const initialTheme = storedTheme === 'dark' ? 'dark' : 'light';
    setTheme(initialTheme);
  }, []);

  const handleToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    
    // Update DOM
    const html = document.documentElement;
    html.setAttribute('data-theme', newTheme);
    
    if (newTheme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    
    // Save to localStorage
    localStorage.setItem('arthapath-theme', newTheme);
    
    // Update state
    setTheme(newTheme);
  };

  // Don't render on server
  if (!mounted) {
    return (
      <div className="h-10 w-20 rounded-lg" style={{ backgroundColor: 'var(--color-background-tertiary)' }} />
    );
  }

  return (
    <button
      onClick={handleToggle}
      className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:opacity-80"
      style={{
        backgroundColor: 'var(--color-background-tertiary)',
        color: 'var(--color-text-primary)'
      }}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}
