'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ScenarioData {
  name: string;
  conservative: number;
  expected: number;
  optimistic: number;
}

interface ScenarioBarChartProps {
  data: ScenarioData[];
  className?: string;
  title?: string;
}

/**
 * ScenarioBarChart Component
 * Displays side-by-side comparison of investment scenarios.
 * Useful for comparing final values, gains, or contributions across scenarios.
 * 
 * Features:
 * - Grouped bar chart for easy comparison
 * - Color-coded scenarios (Conservative/Expected/Optimistic)
 * - Interactive tooltips with formatted currency
 * - Dark/light mode compatible
 * - Responsive sizing
 */
export const ScenarioBarChart: React.FC<ScenarioBarChartProps> = ({ 
  data, 
  className = '',
  title 
}) => {
  // Format currency for tooltip and axis
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div 
          className="rounded-lg border p-3 shadow-lg"
          style={{
            backgroundColor: 'var(--color-background-secondary)',
            borderColor: 'var(--color-border)',
          }}
        >
          <p 
            className="mb-2 font-semibold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <p 
              key={index} 
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
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
      {title && (
        <h3 
          className="mb-4 text-center font-semibold"
          style={{ 
            color: 'var(--color-text-primary)',
            fontSize: 'var(--text-h4-size)'
          }}
        >
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="var(--color-border)"
            opacity={0.3}
          />
          <XAxis
            dataKey="name"
            stroke="var(--color-text-secondary)"
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
          />
          <YAxis
            stroke="var(--color-text-secondary)"
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
            tickFormatter={(value) => {
              if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
              if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
              return value.toString();
            }}
            label={{ 
              value: 'Amount (NPR)', 
              angle: -90, 
              position: 'insideLeft',
              style: { fill: 'var(--color-text-secondary)' }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderLegend} />
          <Bar
            dataKey="conservative"
            fill="var(--color-risk-conservative)"
            name="Conservative"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="expected"
            fill="var(--color-risk-balanced)"
            name="Expected"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="optimistic"
            fill="var(--color-risk-aggressive)"
            name="Optimistic"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScenarioBarChart;
