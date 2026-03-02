'use client';

import React from 'react';
import Link from 'next/link';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const menuItems = [
  { href: '/', label: 'Dashboard', icon: '📊' },
  { href: '/explore', label: 'Explore', icon: '🔍' },
  { href: '/simulator', label: 'Simulator', icon: '📈' },
  { href: '/education', label: 'Education', icon: '📚' },
];

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-16 left-0 h-[calc(100vh-64px)] w-64 bg-(--color-background) border-r border-(--color-border) transition-transform duration-200 z-40 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="flex flex-col gap-(--spacing-xs) p-(--spacing-md)">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-(--spacing-md) px-(--spacing-md) py-(--spacing-sm) rounded-lg text-body text-(--color-text-primary) hover:bg-(--color-background-hover) hover:text-(--color-primary) transition-all duration-200"
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Divider */}
        <div className="h-px bg-(--color-border) mx-(--spacing-md) my-(--spacing-md)" />

        {/* Help Section */}
        <div className="p-(--spacing-md)">
          <div className="bg-(--color-background-hover) border border-(--color-border) rounded-lg p-(--spacing-md)">
            <p className="text-label font-semibold text-(--color-text-primary) mb-(--spacing-xs)">
              Need Help?
            </p>
            <p className="text-caption text-(--color-text-secondary) mb-(--spacing-md)">
              Check our documentation or contact support.
            </p>
            <a
              href="/help"
              className="inline-block px-(--spacing-md) py-(--spacing-xs) bg-(--color-primary) text-(--color-background) rounded text-caption font-medium hover:opacity-90 transition-opacity"
            >
              Get Help
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
