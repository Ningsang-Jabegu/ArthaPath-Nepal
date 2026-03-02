'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { AppLayout, SimulatorPage, Card, Button, Input } from '@/components';
import {
  simulatorApi,
  SimulatorInputDto,
  SimulatorResultDto,
} from '@/lib/api';

type FormErrors = Partial<Record<keyof SimulatorInputDto, string>>;

const STORAGE_KEY = 'arthapath-simulator-form';

const STEP_TITLES = [
  'Capital Input',
  'Risk Tolerance',
  'Timeline & Liquidity',
  'Review & Submit',
] as const;

const initialForm: SimulatorInputDto = {
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

function validateStep(step: number, formData: SimulatorInputDto): FormErrors {
  const errors: FormErrors = {};

  if (step === 1) {
    if (!Number.isFinite(formData.initial_capital) || formData.initial_capital < 5000) {
      errors.initial_capital = 'Initial capital must be at least NPR 5,000.';
    }
    if (!Number.isFinite(formData.monthly_contribution) || formData.monthly_contribution < 0) {
      errors.monthly_contribution = 'Monthly contribution must be 0 or more.';
    }
  }

  if (step === 2) {
    if (!['Low', 'Medium', 'High'].includes(formData.risk_tolerance)) {
      errors.risk_tolerance = 'Please choose your risk tolerance.';
    }
  }

  if (step === 3) {
    if (
      !Number.isFinite(formData.duration_years) ||
      formData.duration_years < 1 ||
      formData.duration_years > 50
    ) {
      errors.duration_years = 'Duration must be between 1 and 50 years.';
    }
    if (!['Low', 'Medium', 'High'].includes(formData.liquidity_need)) {
      errors.liquidity_need = 'Please choose your liquidity need.';
    }
  }

  return errors;
}

export default function Simulator() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<SimulatorInputDto>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SimulatorResultDto | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as Partial<SimulatorInputDto>;
      setFormData((prev) => ({ ...prev, ...parsed }));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const allocationRows = useMemo(() => {
    if (!result) return [];
    return Object.entries(result.allocation).filter(([, percent]) => percent > 0);
  }, [result]);

  const goNext = () => {
    const stepErrors = validateStep(step, formData);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) return;
    setApiError('');
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const goBack = () => {
    setErrors({});
    setApiError('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setStep(1);
    setErrors({});
    setApiError('');
    setResult(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleSubmit = async () => {
    const stepErrors = validateStep(3, formData);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) {
      setStep(3);
      return;
    }

    setApiError('');
    setIsSubmitting(true);
    try {
      const simulationResult = await simulatorApi.runSimulation(formData);
      setResult(simulationResult);
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : 'Unable to run simulation right now. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <SimulatorPage>
        <div className="grid lg:grid-cols-3 gap-(--spacing-lg)">
          <Card variant="summary" title={`Step ${step}: ${STEP_TITLES[step - 1]}`}>
            <div className="mb-(--spacing-md)">
              <div className="w-full h-2 rounded bg-(--color-border)">
                <div
                  className="h-2 rounded bg-(--color-primary) transition-all duration-200"
                  style={{ width: `${(step / 4) * 100}%` }}
                />
              </div>
              <p className="text-caption text-(--color-text-secondary) mt-2">
                Complete all four steps to generate your plan.
              </p>
            </div>

            <div className="space-y-4">
              {step === 1 && (
                <>
                  <Input
                    label="Initial Capital (NPR)"
                    type="number"
                    min={5000}
                    value={formData.initial_capital}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        initial_capital: Number(e.target.value || 0),
                      }))
                    }
                    error={errors.initial_capital}
                    helperText="Minimum NPR 5,000. This is your one-time starting amount."
                  />

                  <Input
                    label="Monthly Contribution (NPR)"
                    type="number"
                    min={0}
                    value={formData.monthly_contribution}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        monthly_contribution: Number(e.target.value || 0),
                      }))
                    }
                    error={errors.monthly_contribution}
                    helperText="Optional recurring monthly investment. You can keep this as 0."
                  />
                </>
              )}

              {step === 2 && (
                <div>
                  <label className="block text-label font-medium text-(--color-text-primary) mb-2">
                    Risk Tolerance
                  </label>
                  <select
                    value={formData.risk_tolerance}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        risk_tolerance: e.target.value as SimulatorInputDto['risk_tolerance'],
                      }))
                    }
                    className="w-full px-3 py-2 border border-(--color-border) rounded-md bg-(--color-background) text-(--color-text-primary)"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  {errors.risk_tolerance && (
                    <p className="mt-(--spacing-xs) text-sm text-(--color-error)">
                      {errors.risk_tolerance}
                    </p>
                  )}
                  <p className="text-caption text-(--color-text-secondary) mt-2">
                    High tolerance accepts more volatility for potentially higher returns.
                  </p>
                </div>
              )}

              {step === 3 && (
                <>
                  <Input
                    label="Investment Duration (Years)"
                    type="number"
                    min={1}
                    max={50}
                    value={formData.duration_years}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        duration_years: Number(e.target.value || 0),
                      }))
                    }
                    error={errors.duration_years}
                    helperText="Choose a period between 1 and 50 years."
                  />

                  <div>
                    <label className="block text-label font-medium text-(--color-text-primary) mb-2">
                      Liquidity Need
                    </label>
                    <select
                      value={formData.liquidity_need}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          liquidity_need: e.target.value as SimulatorInputDto['liquidity_need'],
                        }))
                      }
                      className="w-full px-3 py-2 border border-(--color-border) rounded-md bg-(--color-background) text-(--color-text-primary)"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                    {errors.liquidity_need && (
                      <p className="mt-(--spacing-xs) text-sm text-(--color-error)">
                        {errors.liquidity_need}
                      </p>
                    )}
                    <p className="text-caption text-(--color-text-secondary) mt-2">
                      High liquidity means you may need quick access to your money.
                    </p>
                  </div>

                  <label className="flex items-center gap-2 text-body text-(--color-text-primary)">
                    <input
                      type="checkbox"
                      checked={formData.has_emergency_fund}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          has_emergency_fund: e.target.checked,
                        }))
                      }
                    />
                    I already have an emergency fund
                  </label>
                </>
              )}

              {step === 4 && (
                <div className="space-y-3">
                  <p className="text-body text-(--color-text-secondary)">
                    Review your inputs before submitting.
                  </p>

                  <div className="rounded-md border border-(--color-border) p-(--spacing-md) space-y-2">
                    <p className="text-body">
                      <strong>Initial Capital:</strong> {formatCurrency(formData.initial_capital)}
                    </p>
                    <p className="text-body">
                      <strong>Monthly Contribution:</strong>{' '}
                      {formatCurrency(formData.monthly_contribution)}
                    </p>
                    <p className="text-body">
                      <strong>Duration:</strong> {formData.duration_years} years
                    </p>
                    <p className="text-body">
                      <strong>Risk Tolerance:</strong> {formData.risk_tolerance}
                    </p>
                    <p className="text-body">
                      <strong>Liquidity Need:</strong> {formData.liquidity_need}
                    </p>
                    <p className="text-body">
                      <strong>Emergency Fund:</strong>{' '}
                      {formData.has_emergency_fund ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              )}

              {apiError && (
                <p className="text-sm text-(--color-error) rounded-md border border-(--color-error) p-(--spacing-sm)">
                  {apiError}
                </p>
              )}

              <div className="flex gap-2 pt-2 flex-wrap">
                {step > 1 && (
                  <Button variant="secondary" onClick={goBack}>
                    Back
                  </Button>
                )}
                {step < 4 ? (
                  <Button variant="primary" onClick={goNext}>
                    Next
                  </Button>
                ) : (
                  <Button variant="primary" onClick={handleSubmit} isLoading={isSubmitting}>
                    Submit
                  </Button>
                )}
                <Button variant="secondary" onClick={resetForm}>
                  Reset
                </Button>
              </div>
            </div>
          </Card>

          <div className="lg:col-span-2 space-y-4">
            <Card variant="summary" title="Projection Results">
              {!result ? (
                <p className="text-body text-(--color-text-secondary)">
                  Submit the form to view projections.
                </p>
              ) : (
                <div className="space-y-4">
                  <p className="text-body">
                    <strong>Risk Profile:</strong> {result.risk_profile}
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="border-l-4 border-(--color-success) pl-4">
                      <p className="text-caption text-(--color-text-secondary)">Conservative</p>
                      <p className="text-2xl font-bold text-(--color-success)">
                        {formatCurrency(result.projection.conservative)}
                      </p>
                    </div>
                    <div className="border-l-4 border-(--color-warning) pl-4">
                      <p className="text-caption text-(--color-text-secondary)">Expected</p>
                      <p className="text-2xl font-bold text-(--color-warning)">
                        {formatCurrency(result.projection.expected)}
                      </p>
                    </div>
                    <div className="border-l-4 border-(--color-error) pl-4">
                      <p className="text-caption text-(--color-text-secondary)">Optimistic</p>
                      <p className="text-2xl font-bold text-(--color-error)">
                        {formatCurrency(result.projection.optimistic)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            <Card variant="summary" title="Suggested Allocation">
              {!result ? (
                <p className="text-body text-(--color-text-secondary)">
                  Allocation will appear after submission.
                </p>
              ) : (
                <div className="space-y-3">
                  {allocationRows.map(([name, percent]) => (
                    <div key={name} className="flex items-center gap-2">
                      <span className="text-label font-medium text-(--color-text-primary) w-32">
                        {name}
                      </span>
                      <div className="flex-1 bg-(--color-border) rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-(--color-primary) h-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-label font-medium text-(--color-primary) w-12 text-right">
                        {percent}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </SimulatorPage>
    </AppLayout>
  );
}
