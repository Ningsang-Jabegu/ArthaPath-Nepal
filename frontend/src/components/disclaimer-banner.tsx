'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'arthapath-disclaimer-dismissed';

export function DisclaimerBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    setDismissed(saved === 'true');
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setDismissed(true);
  };

  if (!mounted || dismissed) {
    return null;
  }

  return (
    <div className="border-b border-amber-300/50 bg-amber-50 px-(--spacing-lg) py-(--spacing-sm) dark:border-amber-700/50 dark:bg-amber-950/30">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-(--spacing-md)">
        <p className="text-sm text-amber-900 dark:text-amber-200">
          <strong>Disclaimer:</strong> This platform does not provide financial advice. All projections are estimates based on historical data.
          <Link href="/disclaimer" className="ml-2 underline underline-offset-2 hover:opacity-80">
            Learn more
          </Link>
        </p>
        <button
          onClick={handleDismiss}
          className="shrink-0 rounded border border-amber-400 px-2 py-1 text-xs font-medium text-amber-900 transition-colors hover:bg-amber-100 dark:border-amber-700 dark:text-amber-200 dark:hover:bg-amber-900/50"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
