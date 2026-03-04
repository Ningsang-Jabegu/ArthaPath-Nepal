# Chart Components - Usage Guide

This directory contains three chart components built with Recharts for data visualization in ArthaPath Nepal.

## Components

### 1. ProjectionLineChart
Displays investment projection growth over time with three scenarios.

**Props:**
- `data: ProjectionDataPoint[]` - Array of data points with year, conservative, expected, and optimistic values
- `className?: string` - Optional CSS class

**Example:**
```tsx
import { ProjectionLineChart } from '@/components/charts';

const data = [
  { year: 0, conservative: 100000, expected: 100000, optimistic: 100000 },
  { year: 1, conservative: 106000, expected: 110000, optimistic: 115000 },
  { year: 5, conservative: 133823, expected: 161051, optimistic: 201136 },
];

<ProjectionLineChart data={data} />
```

### 2. AllocationPieChart
Displays investment allocation breakdown by category.

**Props:**
- `data: AllocationDataPoint[]` - Array with name, value, and percentage for each category
- `className?: string` - Optional CSS class

**Example:**
```tsx
import { AllocationPieChart } from '@/components/charts';

const data = [
  { name: 'Stocks', value: 30000, percentage: 30 },
  { name: 'Bonds', value: 40000, percentage: 40 },
  { name: 'Fixed Deposit', value: 30000, percentage: 30 },
];

<AllocationPieChart data={data} />
```

### 3. ScenarioBarChart
Displays side-by-side comparison of investment scenarios.

**Props:**
- `data: ScenarioData[]` - Array with name, conservative, expected, and optimistic values
- `className?: string` - Optional CSS class
- `title?: string` - Optional chart title

**Example:**
```tsx
import { ScenarioBarChart } from '@/components/charts';

const data = [
  { 
    name: 'Final Value', 
    conservative: 150000, 
    expected: 180000, 
    optimistic: 220000 
  },
  { 
    name: 'Total Gain', 
    conservative: 50000, 
    expected: 80000, 
    optimistic: 120000 
  },
];

<ScenarioBarChart 
  data={data} 
  title="Investment Scenario Comparison"
/>
```

## Features

All chart components include:
- ✅ **Dark/Light Mode Support** - Uses CSS variables that automatically adapt to theme
- ✅ **Responsive Design** - ResponsiveContainer ensures proper sizing
- ✅ **Interactive Tooltips** - Formatted currency display (NPR)
- ✅ **Legends** - Clear identification of data series
- ✅ **Accessibility** - Proper labels and ARIA support
- ✅ **Color Consistency** - Uses design system color tokens
  - Conservative: `var(--color-risk-conservative)` (green)
  - Expected/Balanced: `var(--color-risk-balanced)` (blue)
  - Optimistic/Aggressive: `var(--color-risk-aggressive)` (red)

## Styling

All charts work with Tailwind CSS classes via the `className` prop:

```tsx
<ProjectionLineChart 
  data={data} 
  className="w-full rounded-lg bg-white p-4 shadow-lg dark:bg-gray-900"
/>
```

## TypeScript Support

All components are fully typed with TypeScript interfaces. Import types from the charts module:

```tsx
import type { 
  ProjectionLineChartType,
  AllocationPieChartType,
  ScenarioBarChartType 
} from '@/components/charts';
```

## Number Formatting

- **Tooltip amounts**: Full NPR currency format (e.g., "Rs 1,50,000")
- **Axis labels**: Abbreviated format (e.g., "150K", "1.5M")
- **Percentages**: Two decimal places in tooltips, one decimal in pie labels

## Theme Variables Used

```css
--color-risk-conservative   /* Green for conservative scenarios */
--color-risk-balanced       /* Blue for expected/balanced scenarios */
--color-risk-aggressive     /* Red for optimistic/aggressive scenarios */
--color-text-primary        /* Main text color */
--color-text-secondary      /* Secondary text color */
--color-background-secondary /* Tooltip background */
--color-border              /* Grid lines and borders */
```
