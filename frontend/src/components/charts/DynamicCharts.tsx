'use client';

import dynamic from 'next/dynamic';
import React from 'react';

/**
 * Lazy-load chart components with dynamic imports
 * This prevents recharts from being bundled in the main JS
 * and only loads it when needed
 */

// Skeleton loader for charts
const ChartSkeleton = () => (
  <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse flex items-center justify-center">
    <span className="text-sm text-gray-500 dark:text-gray-400">
      Loading chart...
    </span>
  </div>
);

/**
 * Lazy-loaded LineChart component
 * Used for projection growth visualization
 */
export const DynamicLineChart = dynamic(
  () => import('recharts').then((module) => module.LineChart),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  },
);

/**
 * Lazy-loaded PieChart component
 * Used for allocation breakdown visualization
 */
export const DynamicPieChart = dynamic(
  () => import('recharts').then((module) => module.PieChart),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  },
);

/**
 * Lazy-loaded BarChart component
 * Used for scenario comparison
 */
export const DynamicBarChart = dynamic(
  () => import('recharts').then((module) => module.BarChart),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  },
);

/**
 * Re-export commonly used Chart components
 * Import from this file instead of directly from recharts
 */
export { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
