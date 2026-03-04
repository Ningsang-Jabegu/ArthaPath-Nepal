'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface AllocationDataPoint {
  name: string;
  value: number;
  percentage: number;
}

interface AllocationPieChartProps {
  data: AllocationDataPoint[];
  className?: string;
}

/**
 * AllocationPieChart Component
 * Displays investment allocation breakdown by category.
 * 
 * Features:
 * - Color-coded allocation categories
 * - Percentage labels on each slice
 * - Interactive tooltips with amounts
 * - Dark/light mode compatible
 * - Responsive sizing
 */
export const AllocationPieChart: React.FC<AllocationPieChartProps> = ({ data, className = '' }) => {
  // Color palette for different investment categories
  const COLORS = [
    'var(--color-risk-conservative)', // #10b981 - green
    'var(--color-risk-balanced)',     // #3b82f6 - blue
    'var(--color-risk-aggressive)',   // #ef4444 - red
    'var(--color-warning)',           // #f59e0b - orange
    'var(--color-info)',              // #3b82f6 - blue
    '#8b5cf6',                        // purple
    '#ec4899',                        // pink
    '#14b8a6',                        // teal
  ];

  // Format currency for tooltip
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Custom label to show percentage on pie slices
  const renderCustomLabel = (entry: any) => {
    if (entry.percentage < 5) return ''; // Hide label if slice too small
    return `${entry.percentage.toFixed(1)}%`;
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div 
          className="rounded-lg border p-3 shadow-lg"
          style={{
            backgroundColor: 'var(--color-background-secondary)',
            borderColor: 'var(--color-border)',
          }}
        >
          <p 
            className="mb-1 font-semibold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {data.name}
          </p>
          <p 
            className="text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Amount: {formatCurrency(data.value)}
          </p>
          <p 
            className="text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Percentage: {data.percentage.toFixed(2)}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom legend render function
  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className="flex flex-wrap justify-center gap-4 pt-4">
        {payload.map((entry: any, index: number) => (
          <li key={`legend-${index}`} className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span 
              className="text-sm"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {entry.value}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                stroke="var(--color-background)"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderLegend} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AllocationPieChart;
