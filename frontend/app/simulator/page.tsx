'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  AppLayout,
  SimulatorPage as SimulatorPageLayout,
  Card,
  Button,
  RiskWarningModal,
} from '@/components';
import {
  simulatorApi,
  SimulatorInputDto,
  SimulatorResultDto,
} from '@/lib/api';
import { ProjectionLineChart, AllocationPieChart } from '@/components/charts';
import {
  trackInputChange,
  trackSimulationRun,
  trackFormReset,
} from '@/lib/analytics';

const STORAGE_KEY = 'arthapath-simulator-form';
const RISK_ACK_KEY = 'arthapath-risk-warning-acknowledged';

const defaultForm: SimulatorInputDto = {
  initial_capital: 100000,
  monthly_contribution: 5000,
  duration_years: 5,
  risk_tolerance: 'Medium',
  liquidity_need: 'Medium',
  has_emergency_fund: true,
};

function formatCurrency(value: number): string {
  return `NPR ${value.toLocaleString('en-IN')}`;
}

export default function SimulatorPage() {
  const [formData, setFormData] = useState<SimulatorInputDto>(defaultForm);
  const [result, setResult] = useState<SimulatorResultDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const [showRiskWarning, setShowRiskWarning] = useState(false);
  const [riskAcknowledged, setRiskAcknowledged] = useState(false);
  const [pendingRiskTolerance, setPendingRiskTolerance] = useState<
    SimulatorInputDto['risk_tolerance'] | null
  >(null);

  // Load saved form on mount
  useEffect(() => {
    const savedForm = localStorage.getItem(STORAGE_KEY);
    const riskAck = localStorage.getItem(RISK_ACK_KEY);

    if (riskAck === 'true') {
      setRiskAcknowledged(true);
    }

    if (!savedForm) return;

    try {
      const parsed = JSON.parse(savedForm) as Partial<SimulatorInputDto>;
      setFormData((prev) => ({ ...prev, ...parsed }));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Debounced simulation API call
  const runSimulation = useCallback(async (data: SimulatorInputDto) => {
    setIsLoading(true);
    setApiError('');

    try {
      const simulationResult = await simulatorApi.runSimulation(data);
      setResult(simulationResult);
      
      // Track successful simulation
      trackSimulationRun(data);
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : 'Unable to load simulation data right now.',
      );
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced handler for input changes
  const handleInputChange = useCallback(
    (newData: SimulatorInputDto) => {
      setFormData(newData);

      // Track the input change with analytics
      const changes = Object.keys(defaultForm).filter(
        (key) => newData[key as keyof SimulatorInputDto] !== formData[key as keyof SimulatorInputDto],
      );
      changes.forEach((key) => {
        trackInputChange(key, newData[key as keyof SimulatorInputDto]);
      });

      // Clear existing timer
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      // Set new debounced timer
      const timer = setTimeout(() => {
        runSimulation(newData);
      }, 300); // 300ms debounce

      setDebounceTimer(timer);
    },
    [debounceTimer, runSimulation, formData],
  );

  const handleReset = () => {
    setFormData(defaultForm);
    setResult(null);
    setApiError('');
    localStorage.removeItem(STORAGE_KEY);

    // Track reset action
    trackFormReset();

    // Run simulation with default values
    runSimulation(defaultForm);
  };

  const handleRiskSelection = (risk: SimulatorInputDto['risk_tolerance']) => {
    if (risk === 'High' && !riskAcknowledged) {
      setPendingRiskTolerance(risk);
      setShowRiskWarning(true);
      return;
    }

    handleInputChange({
      ...formData,
      risk_tolerance: risk,
    });
  };

  const handleRiskWarningAcknowledge = () => {
    setRiskAcknowledged(true);
    localStorage.setItem(RISK_ACK_KEY, 'true');
    setShowRiskWarning(false);

    if (pendingRiskTolerance) {
      handleInputChange({
        ...formData,
        risk_tolerance: pendingRiskTolerance,
      });
      setPendingRiskTolerance(null);
    }
  };

  // Chart data
  const allocationChartData = useMemo(() => {
    if (!result) return [];

    return Object.entries(result.allocation)
      .filter(([, percentage]) => percentage > 0)
      .map(([name, percentage]) => ({
        name,
        percentage,
        value: result.capital_distribution[name as keyof typeof result.capital_distribution] ?? 0,
      }));
  }, [result]);

  const projectionChartData = useMemo(() => {
    if (!result) return [];
    return result.yearly_projection;
  }, [result]);

  // Scenario comparison data
  const scenarios = useMemo(() => {
    if (!result) return [];
    return [
      {
        name: 'Conservative',
        value: result.projection.conservative,
        gain: result.projection.estimated_gain_conservative,
        color: 'var(--color-success)',
      },
      {
        name: 'Expected',
        value: result.projection.expected,
        gain: result.projection.estimated_gain_expected,
        color: 'var(--color-warning)',
      },
      {
        name: 'Optimistic',
        value: result.projection.optimistic,
        gain: result.projection.estimated_gain_optimistic,
        color: 'var(--color-error)',
      },
    ];
  }, [result]);

  // Run initial simulation on mount
  useEffect(() => {
    runSimulation(formData);
  }, []); // Only run once on mount

  return (
    <AppLayout>
      <SimulatorPageLayout>
        {apiError && (
          <div className="mb-(--spacing-lg) p-(--spacing-md) bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-md">
            <p className="text-sm font-medium text-red-700 dark:text-red-400">
              {apiError}
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-(--spacing-lg) mb-(--spacing-lg)">
          {/* Input Controls Panel */}
          <Card variant="summary" title="Adjust Your Inputs">
            <div className="space-y-(--spacing-md)">
              {/* Capital Amount */}
              <div>
                <div className="flex justify-between items-center mb-(--spacing-sm)">
                  <label className="block text-label font-medium text-(--color-text-primary)">
                    Initial Capital
                  </label>
                  <span className="text-body font-semibold text-(--color-primary)">
                    {formatCurrency(formData.initial_capital)}
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="10000000"
                  step="5000"
                  value={formData.initial_capital}
                  onChange={(e) =>
                    handleInputChange({
                      ...formData,
                      initial_capital: Number(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-(--color-border) rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-(--color-text-tertiary) text-xs mt-(--spacing-xs)">
                  <span>₹5,000</span>
                  <span>₹1Cr+</span>
                </div>
              </div>

              {/* Monthly Contribution */}
              <div>
                <div className="flex justify-between items-center mb-(--spacing-sm)">
                  <label className="block text-label font-medium text-(--color-text-primary)">
                    Monthly Contribution
                  </label>
                  <span className="text-body font-semibold text-(--color-primary)">
                    {formatCurrency(formData.monthly_contribution)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="5000"
                  value={formData.monthly_contribution}
                  onChange={(e) =>
                    handleInputChange({
                      ...formData,
                      monthly_contribution: Number(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-(--color-border) rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-(--color-text-tertiary) text-xs mt-(--spacing-xs)">
                  <span>₹0</span>
                  <span>₹5L</span>
                </div>
              </div>

              {/* Duration */}
              <div>
                <div className="flex justify-between items-center mb-(--spacing-sm)">
                  <label className="block text-label font-medium text-(--color-text-primary)">
                    Duration
                  </label>
                  <span className="text-body font-semibold text-(--color-primary)">
                    {formData.duration_years} years
                  </span>
                </div>
                <select
                  value={formData.duration_years}
                  onChange={(e) =>
                    handleInputChange({
                      ...formData,
                      duration_years: Number(e.target.value),
                    })
                  }
                  className="w-full px-(--spacing-md) py-(--spacing-sm) border border-(--color-border) rounded-md bg-(--color-background) text-(--color-text-primary)"
                >
                  {Array.from({ length: 50 }, (_, i) => i + 1).map((year) => (
                    <option key={year} value={year}>
                      {year} {year === 1 ? 'year' : 'years'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Risk Tolerance */}
              <div>
                <label className="block text-label font-medium text-(--color-text-primary) mb-(--spacing-sm)">
                  Risk Tolerance
                </label>
                <div className="grid grid-cols-3 gap-(--spacing-sm)">
                  {(['Low', 'Medium', 'High'] as const).map((risk) => (
                    <button
                      key={risk}
                      onClick={() => handleRiskSelection(risk)}
                      className={`px-(--spacing-md) py-(--spacing-sm) rounded-md font-medium transition-colors ${
                        formData.risk_tolerance === risk
                          ? 'bg-(--color-primary) text-(--color-background)'
                          : 'bg-(--color-background) text-(--color-text-primary) border border-(--color-border) hover:bg-(--color-background-hover)'
                      }`}
                    >
                      {risk}
                    </button>
                  ))}
                </div>
                <p className="mt-(--spacing-sm) text-xs text-(--color-text-secondary)">
                  Higher risk selections can lead to larger swings and potential capital loss.
                </p>
              </div>

              {/* Liquidity Need */}
              <div>
                <label className="block text-label font-medium text-(--color-text-primary) mb-(--spacing-sm)">
                  Liquidity Need
                </label>
                <select
                  value={formData.liquidity_need}
                  onChange={(e) =>
                    handleInputChange({
                      ...formData,
                      liquidity_need: e.target.value as SimulatorInputDto['liquidity_need'],
                    })
                  }
                  className="w-full px-(--spacing-md) py-(--spacing-sm) border border-(--color-border) rounded-md bg-(--color-background) text-(--color-text-primary)"
                >
                  <option value="Low">Low - Long-term locked investment</option>
                  <option value="Medium">Medium - Flexible timing</option>
                  <option value="High">High - Need quick access</option>
                </select>
              </div>

              {/* Emergency Fund */}
              <label className="flex items-center gap-(--spacing-md) text-body text-(--color-text-primary) cursor-pointer hover:bg-(--color-background-hover) p-(--spacing-sm) rounded-md">
                <input
                  type="checkbox"
                  checked={formData.has_emergency_fund}
                  onChange={(e) =>
                    handleInputChange({
                      ...formData,
                      has_emergency_fund: e.target.checked,
                    })
                  }
                  className="w-5 h-5"
                />
                <span>I have a 3-6 month emergency fund</span>
              </label>

              {/* Reset Button */}
              <Button variant="secondary" onClick={handleReset} className="w-full">
                Reset to Default
              </Button>

              {isLoading && (
                <div className="text-center">
                  <p className="text-sm text-(--color-text-secondary)">
                    Recalculating...
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Results Display */}
          <div className="lg:col-span-2 space-y-(--spacing-lg)">
            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-(--spacing-md)">
              <Card variant="metric" title="Risk Profile">
                <p className="text-2xl font-bold mt-(--spacing-md)" style={{ color: 'var(--color-text-primary)' }}>
                  {result?.risk_profile ?? 'Calculating...'}
                </p>
                <p className="text-sm mt-(--spacing-md)" style={{ color: 'var(--color-text-secondary)' }}>
                  Based on your inputs
                </p>
              </Card>

              <Card variant="metric" title="Total Contributions">
                <p className="text-2xl font-bold mt-(--spacing-md)" style={{ color: 'var(--color-text-primary)' }}>
                  {result ? formatCurrency(result.projection.total_contributions) : 'Calculating...'}
                </p>
                <p className="text-sm mt-(--spacing-md)" style={{ color: 'var(--color-text-secondary)' }}>
                  Principal + recurring
                </p>
              </Card>

              <Card variant="metric" title="Expected Value">
                <p className="text-2xl font-bold mt-(--spacing-md)" style={{ color: 'var(--color-text-primary)' }}>
                  {result ? formatCurrency(result.projection.expected) : 'Calculating...'}
                </p>
                <p className="text-sm mt-(--spacing-md)" style={{ color: 'var(--color-text-secondary)' }}>
                  In {formData.duration_years} years
                </p>
              </Card>
            </div>

            {/* Projection Chart */}
            <Card variant="chart" title="Projection Growth (Conservative / Expected / Optimistic)">
              {projectionChartData.length > 0 ? (
                <ProjectionLineChart data={projectionChartData} className="h-96" />
              ) : (
                <p className="text-center py-12 text-(--color-text-secondary)">
                  Loading chart...
                </p>
              )}
            </Card>

            {/* Allocation Chart */}
            <Card variant="allocation" title="Allocation Breakdown">
              {allocationChartData.length > 0 ? (
                <AllocationPieChart data={allocationChartData} className="h-80" />
              ) : (
                <p className="text-center py-12 text-(--color-text-secondary)">
                  Loading allocation...
                </p>
              )}
            </Card>

            {/* Scenario Comparison Table */}
            <Card title="Scenario Comparison">
              {scenarios.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-(--color-border)">
                      <tr>
                        <th className="text-left py-(--spacing-md) px-(--spacing-md) font-semibold text-(--color-text-primary)">
                          Scenario
                        </th>
                        <th className="text-right py-(--spacing-md) px-(--spacing-md) font-semibold text-(--color-text-primary)">
                          Final Value
                        </th>
                        <th className="text-right py-(--spacing-md) px-(--spacing-md) font-semibold text-(--color-text-primary)">
                          Gain
                        </th>
                        <th className="text-right py-(--spacing-md) px-(--spacing-md) font-semibold text-(--color-text-primary)">
                          % Return
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {scenarios.map((scenario) => {
                        const returnPercent =
                          ((scenario.gain / formData.initial_capital) * 100).toFixed(1);
                        return (
                          <tr key={scenario.name} className="border-b border-(--color-border)">
                            <td className="py-(--spacing-md) px-(--spacing-md) font-medium text-(--color-text-primary)">
                              {scenario.name}
                            </td>
                            <td className="py-(--spacing-md) px-(--spacing-md) text-right font-semibold text-(--color-text-primary)">
                              {formatCurrency(scenario.value)}
                            </td>
                            <td className="py-(--spacing-md) px-(--spacing-md) text-right font-semibold" style={{ color: scenario.color }}>
                              {formatCurrency(scenario.gain)}
                            </td>
                            <td className="py-(--spacing-md) px-(--spacing-md) text-right font-semibold" style={{ color: scenario.color }}>
                              {returnPercent}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center py-12 text-(--color-text-secondary)">
                  Loading scenarios...
                </p>
              )}
            </Card>
          </div>
        </div>
      </SimulatorPageLayout>

      <RiskWarningModal
        isOpen={showRiskWarning}
        onClose={() => {
          setShowRiskWarning(false);
          setPendingRiskTolerance(null);
        }}
        onAcknowledge={handleRiskWarningAcknowledge}
        message="You selected High risk tolerance. This choice may materially increase volatility and downside risk in simulated allocations."
      />
    </AppLayout>
  );
}
