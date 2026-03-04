'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { AppLayout, DashboardPage, Card, Button, ExplanationPanel } from '@/components';
import { SavePlanModal } from '@/components/save-plan-modal';
import { SavedPlansList } from '@/components/saved-plans-list';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import {
  simulatorApi,
  type SimulatorInputDto,
  type SimulatorResultDto,
  type SavedPlanResponseDto,
} from '@/lib/api';
import { AllocationPieChart, ProjectionLineChart } from '@/components/charts';

const STORAGE_KEY = 'arthapath-simulator-form';

const defaultForm: SimulatorInputDto = {
  initial_capital: 100000,
  monthly_contribution: 5000,
  duration_years: 5,
  risk_tolerance: 'Medium',
  liquidity_need: 'Medium',
  has_emergency_fund: false,
};

function formatCurrency(value: number): string {
  return `NPR ${value.toLocaleString('en-IN')}`;
}

function getRiskBadgeStyles(risk: SimulatorResultDto['risk_profile'] | 'Not Set') {
  if (risk === 'Conservative') {
    return {
      backgroundColor: 'var(--color-success-light)',
      color: 'var(--color-success)',
    };
  }

  if (risk === 'Balanced') {
    return {
      backgroundColor: 'var(--color-info-light)',
      color: 'var(--color-info)',
    };
  }

  if (risk === 'Aggressive') {
    return {
      backgroundColor: 'var(--color-error-light)',
      color: 'var(--color-error)',
    };
  }

  return {
    backgroundColor: 'var(--color-background-tertiary)',
    color: 'var(--color-text-secondary)',
  };
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<SimulatorInputDto>(defaultForm);
  const [simulationResult, setSimulationResult] = useState<SimulatorResultDto | null>(null);
  const [isLoadingSimulation, setIsLoadingSimulation] = useState(false);
  const [simulationError, setSimulationError] = useState('');
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [showSavedPlans, setShowSavedPlans] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleSaveSuccess = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleLoadPlan = (plan: SavedPlanResponseDto) => {
    setFormData({
      initial_capital: plan.initial_capital,
      monthly_contribution: plan.monthly_contribution,
      duration_years: plan.duration_years,
      risk_tolerance: plan.risk_tolerance,
      liquidity_need: plan.liquidity_need,
      has_emergency_fund: plan.has_emergency_fund,
    });
    setShowSavedPlans(false);
  };

  useEffect(() => {
    const savedForm = localStorage.getItem(STORAGE_KEY);

    if (!savedForm) return;

    try {
      const parsed = JSON.parse(savedForm) as Partial<SimulatorInputDto>;
      setFormData((prev) => ({ ...prev, ...parsed }));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchSimulation = async () => {
      setIsLoadingSimulation(true);
      setSimulationError('');

      try {
        const result = await simulatorApi.runSimulation(formData);
        if (isMounted) {
          setSimulationResult(result);
        }
      } catch (error) {
        if (isMounted) {
          setSimulationResult(null);
          setSimulationError(
            error instanceof Error
              ? error.message
              : 'Unable to load simulation data right now.',
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingSimulation(false);
        }
      }
    };

    fetchSimulation();

    return () => {
      isMounted = false;
    };
  }, [formData]);

  const allocationChartData = useMemo(() => {
    if (!simulationResult) return [];

    return Object.entries(simulationResult.allocation)
      .filter(([, percentage]) => percentage > 0)
      .map(([name, percentage]) => ({
        name,
        percentage,
        value: simulationResult.capital_distribution[name] ?? 0,
      }));
  }, [simulationResult]);

  const projectionChartData = useMemo(() => {
    if (!simulationResult) return [];
    return simulationResult.yearly_projection;
  }, [simulationResult]);

  const projectedValueInFiveYears = useMemo(() => {
    if (!simulationResult) return null;
    const yearFive = simulationResult.yearly_projection.find((item) => item.year === 5);
    return yearFive?.expected ?? null;
  }, [simulationResult]);

  const growthPercentInFiveYears = useMemo(() => {
    if (!projectedValueInFiveYears) return null;
    if (formData.initial_capital <= 0) return null;

    return ((projectedValueInFiveYears - formData.initial_capital) / formData.initial_capital) * 100;
  }, [projectedValueInFiveYears, formData.initial_capital]);

  const riskLabel = simulationResult?.risk_profile ?? 'Not Set';
  const riskBadgeStyles = getRiskBadgeStyles(riskLabel);

  return (
    <ProtectedRoute>
      <AppLayout>
        <DashboardPage title={`Welcome, ${user?.name ?? 'Investor'}`}>
          {simulationError && (
            <div
              className="mb-6 rounded-md border px-4 py-3"
              style={{
                borderColor: 'var(--color-error)',
                backgroundColor: 'var(--color-error-light)',
                color: 'var(--color-error)',
              }}
            >
              {simulationError}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {/* Total Capital Card */}
            <Card variant="metric" title="Total Capital">
              <p className="text-3xl font-bold mt-2" style={{ color: 'var(--color-text-primary)' }}>
                {formatCurrency(formData.initial_capital)}
              </p>
              <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                Initial one-time investment
              </p>
            </Card>

            {/* Risk Profile Card */}
            <Card variant="metric" title="Risk Profile">
              <div className="mt-2 flex items-center gap-2">
                <span
                  className="inline-flex rounded-full px-3 py-1 text-sm font-semibold"
                  style={riskBadgeStyles}
                >
                  {riskLabel}
                </span>
              </div>
              <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                Based on your current inputs
              </p>
            </Card>

            {/* Monthly Contribution Card */}
            <Card variant="metric" title="Monthly Contribution">
              <p className="text-3xl font-bold mt-2" style={{ color: 'var(--color-text-primary)' }}>
                {formatCurrency(formData.monthly_contribution)}
              </p>
              <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                Recurring monthly amount
              </p>
            </Card>

            {/* Duration Card */}
            <Card variant="metric" title="Investment Duration">
              <p className="text-3xl font-bold mt-2" style={{ color: 'var(--color-text-primary)' }}>
                {formData.duration_years}
              </p>
              <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                Years
              </p>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
            {/* Projected Value (5 Years) */}
            <Card variant="metric" title="Projected Value (5 Years)">
              <p className="text-3xl font-bold mt-2" style={{ color: 'var(--color-text-primary)' }}>
                {projectedValueInFiveYears ? formatCurrency(projectedValueInFiveYears) : 'N/A'}
              </p>
              <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                {growthPercentInFiveYears !== null
                  ? `${growthPercentInFiveYears.toFixed(1)}% growth`
                  : 'Run at least a 5-year simulation'}
              </p>
            </Card>

            {/* Total Contributions */}
            <Card variant="metric" title="Total Contributions">
              <p className="text-3xl font-bold mt-2" style={{ color: 'var(--color-text-primary)' }}>
                {simulationResult
                  ? formatCurrency(simulationResult.projection.total_contributions)
                  : formatCurrency(
                      formData.initial_capital +
                        formData.monthly_contribution * formData.duration_years * 12,
                    )}
              </p>
              <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                Principal + recurring investment
              </p>
            </Card>

            {/* Estimated Gain */}
            <Card variant="metric" title="Estimated Gain">
              <p className="text-3xl font-bold mt-2" style={{ color: 'var(--color-text-primary)' }}>
                {simulationResult
                  ? formatCurrency(simulationResult.projection.estimated_gain_expected)
                  : 'N/A'}
              </p>
              <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                Expected scenario gain
              </p>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 mb-6">
            {/* Allocation Card with PieChart */}
            <Card variant="allocation" title="Allocation Breakdown" className="lg:col-span-1">
              {isLoadingSimulation ? (
                <p style={{ color: 'var(--color-text-secondary)' }}>Loading allocation...</p>
              ) : allocationChartData.length > 0 ? (
                <AllocationPieChart data={allocationChartData} className="h-90" />
              ) : (
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  No allocation data yet. Complete your simulator flow to populate this chart.
                </p>
              )}
            </Card>

            {/* Projection Chart (LineChart) */}
            <Card variant="chart" title="Projection Growth (Conservative / Expected / Optimistic)" className="lg:col-span-2">
              {isLoadingSimulation ? (
                <p style={{ color: 'var(--color-text-secondary)' }}>Loading projection chart...</p>
              ) : projectionChartData.length > 0 ? (
                <ProjectionLineChart data={projectionChartData} className="h-90" />
              ) : (
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  No projection data yet. Run a simulation to view growth scenarios.
                </p>
              )}
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card title="Quick Actions">
              <div className="space-y-2 flex flex-col">
                {saveSuccess && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 rounded-md">
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">
                      ✓ Plan saved successfully!
                    </p>
                  </div>
                )}
                <Button
                  variant="primary"
                  disabled={!simulationResult}
                  onClick={() => setIsSaveModalOpen(true)}
                >
                  {simulationResult ? 'Save This Plan' : 'Run Simulation First'}
                </Button>
                <Button variant="secondary" onClick={() => setShowSavedPlans(!showSavedPlans)}>
                  {showSavedPlans ? 'Hide' : 'View'} Saved Plans
                </Button>
                <Button variant="secondary" onClick={() => router.push('/simulator')}>
                  Start Assessment
                </Button>
                <Button variant="secondary" onClick={() => router.push('/education')}>
                  View Education
                </Button>
                <Button variant="danger" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </Card>

            {/* AI Explanation Panel */}
            <ExplanationPanel
              simulationResult={simulationResult}
              formData={formData}
              explanationType="narrative"
            />
          </div>

          {showSavedPlans && (
            <div className="mt-6">
              <h2 className="text-h4 font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                Your Saved Plans
              </h2>
              <SavedPlansList onLoadPlan={handleLoadPlan} />
            </div>
          )}

          <SavePlanModal
            isOpen={isSaveModalOpen}
            onClose={() => setIsSaveModalOpen(false)}
            simulationResult={simulationResult}
            formData={formData}
            onSaveSuccess={handleSaveSuccess}
          />
        </DashboardPage>
      </AppLayout>
    </ProtectedRoute>
  );
}
