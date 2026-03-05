'use client';

import React, { Suspense, lazy } from 'react';

// Lazy load chart components
const LazyLineChart = lazy(() =>
  import('recharts').then((module) => ({
    default: module.LineChart,
  })),
);

const LazyPieChart = lazy(() =>
  import('recharts').then((module) => ({
    default: module.PieChart,
  })),
);

const LazyBarChart = lazy(() =>
  import('recharts').then((module) => ({
    default: module.BarChart,
  })),
);

/**
 * Fallback component while chart is loading
 */
function ChartSkeleton() {
  return (
    <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse flex items-center justify-center">
      <span className="text-gray-500 dark:text-gray-400">Loading chart...</span>
    </div>
  );
}

/**
 * Wrapper component for lazy-loaded charts
 */
export function LazyChartLoader({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<ChartSkeleton />}>{children}</Suspense>;
}

export { LazyLineChart, LazyPieChart, LazyBarChart };
