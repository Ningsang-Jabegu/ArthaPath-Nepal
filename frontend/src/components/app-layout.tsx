'use client';

import React, { useState, useEffect } from 'react';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { Footer } from './footer';
import { DisclaimerBanner } from './disclaimer-banner';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Close sidebar on larger screens
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-(--color-background) text-(--color-text-primary)">
      {/* Header */}
      <Header
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />

      <DisclaimerBanner />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 w-full overflow-auto">
          <div className="min-h-[calc(100vh-64px)] flex flex-col">
            {/* Page Content */}
            <div className="flex-1">
              {children}
            </div>

            {/* Footer */}
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
