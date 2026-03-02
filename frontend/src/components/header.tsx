'use client';

import React, { useState, useEffect } from 'react';
import { ThemeToggle } from './theme-toggle';

interface HeaderProps {
  onMenuClick?: () => void;
  sidebarOpen?: boolean;
}

export function Header({ onMenuClick, sidebarOpen = false }: HeaderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-40 bg-(--color-background) border-b border-(--color-border) shadow-sm">
      <div className="flex items-center justify-between px-(--spacing-lg) py-(--spacing-md) h-16">
        {/* Logo & Menu Toggle */}
        <div className="flex items-center gap-(--spacing-md)">
          <button
            onClick={onMenuClick}
            className="p-(--spacing-sm) rounded-md hover:bg-(--color-background-hover) transition-colors lg:hidden"
            aria-label="Toggle sidebar"
          >
            <svg
              className={`w-6 h-6 text-(--color-text-primary) transition-transform duration-200 ${
                sidebarOpen ? 'rotate-90' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div className="flex items-center gap-(--spacing-xs)">
            <div className="w-8 h-8 rounded-md bg-(--color-primary) flex items-center justify-center">
              <span className="text-(--color-background) font-bold">AP</span>
            </div>
            <h1 className="text-h4 font-bold text-(--color-text-primary) hidden sm:block">
              ArthaPath
            </h1>
          </div>
        </div>

        {/* Navigation & Actions */}
        <nav className="hidden md:flex items-center gap-(--spacing-lg)">
          <a
            href="/"
            className="text-body text-(--color-text-primary) hover:text-(--color-primary) transition-colors"
          >
            Dashboard
          </a>
          <a
            href="/explore"
            className="text-body text-(--color-text-primary) hover:text-(--color-primary) transition-colors"
          >
            Explore
          </a>
          <a
            href="/simulator"
            className="text-body text-(--color-text-primary) hover:text-(--color-primary) transition-colors"
          >
            Simulator
          </a>
          <a
            href="/education"
            className="text-body text-(--color-text-primary) hover:text-(--color-primary) transition-colors"
          >
            Education
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-(--spacing-md)">
          <ThemeToggle />

          {/* Profile Menu */}
          <div className="relative group">
            <button className="p-(--spacing-sm) rounded-full bg-(--color-background-hover) hover:bg-(--color-border) transition-colors">
              <svg
                className="w-6 h-6 text-(--color-text-primary)"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-48 bg-(--color-background) border border-(--color-border) rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <a
                href="/profile"
                className="block px-(--spacing-md) py-(--spacing-sm) text-body text-(--color-text-primary) hover:bg-(--color-background-hover) first:rounded-t-lg"
              >
                Profile
              </a>
              <a
                href="/settings"
                className="block px-(--spacing-md) py-(--spacing-sm) text-body text-(--color-text-primary) hover:bg-(--color-background-hover)"
              >
                Settings
              </a>
              <button className="w-full text-left px-(--spacing-md) py-(--spacing-sm) text-body text-(--color-error) hover:bg-(--color-background-hover) last:rounded-b-lg">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
