'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProjectionDataPoint {
  year: number;
  conservative: number;
  expected: number;
  optimistic: number;
}

interface ProjectionLineChartProps {
  data: ProjectionDataPoint[];
  className?: string;
}

/**
 * ProjectionLineChart Component
 * Displays investment projection growth over time with three scenarios:
 * - Conservative (green)
 * - Expected (blue)
 * - Optimistic (red/orange)
 * 
 * Features:
 * - Responsive sizing
 * - Dark/light mode compatible
 * - Interactive tooltips with formatted currency
 * - Legend for scenario identification
 */
export const ProjectionLineChart: React.FC<ProjectionLineChartProps> = ({ data, className = '' }) => {
  // Format currency for tooltip
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
            Year {label}
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

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="var(--color-border)"
            opacity={0.3}
          />
          <XAxis
            dataKey="year"
            stroke="var(--color-text-secondary)"
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
            label={{ 
              value: 'Years', 
              position: 'insideBottom', 
              offset: -5,
              style: { fill: 'var(--color-text-secondary)' }
            }}
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
              value: 'Value (NPR)', 
              angle: -90, 
              position: 'insideLeft',
              style: { fill: 'var(--color-text-secondary)' }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ 
              paddingTop: '20px',
              color: 'var(--color-text-primary)'
            }}
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="conservative"
            stroke="var(--color-risk-conservative)"
            strokeWidth={2}
            dot={false}
            name="Conservative"
            activeDot={{ r: 6 }}
            animationDuration={500}
            isAnimationActive={true}
          />
          <Line
            type="monotone"
            dataKey="expected"
            stroke="var(--color-risk-balanced)"
            strokeWidth={2}
            dot={false}
            name="Expected"
            activeDot={{ r: 6 }}
            animationDuration={500}
            isAnimationActive={true}
          />
          <Line
            type="monotone"
            dataKey="optimistic"
            stroke="var(--color-risk-aggressive)"
            strokeWidth={2}
            dot={false}
            name="Optimistic"
            activeDot={{ r: 6 }}
            animationDuration={500}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProjectionLineChart;
