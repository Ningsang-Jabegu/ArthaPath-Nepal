'use client';

import React, { useState } from 'react';
import { Modal } from './modal';
import { Button } from './button';
import { Input } from './input';
import { savedPlansApi, SavedPlanResponseDto, SavePlanDto } from '@/lib/api';
import type { SimulatorResultDto, SimulatorInputDto } from '@/lib/api';
import { trackEvent } from '@/lib/analytics';

interface SavePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  simulationResult: SimulatorResultDto | null;
  formData: SimulatorInputDto;
  onSaveSuccess?: (plan: SavedPlanResponseDto) => void;
  onError?: (error: string) => void;
}

export function SavePlanModal({
  isOpen,
  onClose,
  simulationResult,
  formData,
  onSaveSuccess,
  onError,
}: SavePlanModalProps) {
  const [planName, setPlanName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const convertRiskProfile = (risk: string): 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE' => {
    const riskMap: Record<string, 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE'> = {
      Conservative: 'CONSERVATIVE',
      Balanced: 'BALANCED',
      Aggressive: 'AGGRESSIVE',
    };
    return riskMap[risk] || 'BALANCED';
  };

  const handleSave = async () => {
    // Validation
    if (!planName.trim()) {
      setError('Plan name is required');
      return;
    }

    if (!simulationResult) {
      setError('No simulation data available');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload: SavePlanDto = {
        plan_name: planName.trim(),
        description: description.trim() || undefined,
        initial_capital: formData.initial_capital,
        monthly_contribution: formData.monthly_contribution ?? 0,
        duration_years: formData.duration_years,
        risk_tolerance: formData.risk_tolerance,
        liquidity_need: formData.liquidity_need,
        has_emergency_fund: formData.has_emergency_fund,
        risk_profile: convertRiskProfile(simulationResult.risk_profile),
        allocation: simulationResult.allocation,
        capital_distribution: simulationResult.capital_distribution,
        projection: {
          conservative: simulationResult.projection.conservative,
          expected: simulationResult.projection.expected,
          optimistic: simulationResult.projection.optimistic,
          total_contributions: simulationResult.projection.total_contributions,
        },
      };

      const savedPlan = await savedPlansApi.savePlan(payload);
      setSuccess(true);
      
      // Track successful plan save
      trackEvent('plan_saved', {
        plan_name: planName.trim(),
        risk_profile: simulationResult.risk_profile,
        initial_capital: formData.initial_capital,
        duration_years: formData.duration_years,
      });
      
      onSaveSuccess?.(savedPlan);

      // Reset form and close after 1.5 seconds
      setTimeout(() => {
        setPlanName('');
        setDescription('');
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to save plan';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setPlanName('');
      setDescription('');
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Save Your Investment Plan"
      size="md"
      footer={
        <div className="flex gap-(--spacing-md) justify-end p-(--spacing-lg) border-t border-(--color-border)">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isLoading}
            isLoading={isLoading}
          >
            {success ? '✓ Saved!' : 'Save Plan'}
          </Button>
        </div>
      }
    >
      <div className="p-(--spacing-lg) space-y-(--spacing-md)">
        {/* Success Message */}
        {success && (
          <div className="p-(--spacing-md) bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 rounded-md">
            <p className="text-sm font-medium text-green-700 dark:text-green-400">
              ✓ Plan saved successfully!
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-(--spacing-md) bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-md">
            <p className="text-sm font-medium text-red-700 dark:text-red-400">
              {error}
            </p>
          </div>
        )}

        {/* Plan Name */}
        <div>
          <label className="block text-sm font-medium text-(--color-text-primary) mb-(--spacing-xs)">
            Plan Name *
          </label>
          <Input
            type="text"
            placeholder="e.g., 'Retirement Plan 2026', 'Education Fund'"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            disabled={isLoading}
            maxLength={255}
          />
          <p className="text-xs text-(--color-text-secondary) mt-(--spacing-xs)">
            {planName.length}/255 characters
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-(--color-text-primary) mb-(--spacing-xs)">
            Description (Optional)
          </label>
          <textarea
            placeholder="Add notes about this plan..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
            maxLength={500}
            rows={3}
            className="w-full px-(--spacing-md) py-(--spacing-sm) border border-(--color-border) rounded-md bg-(--color-background) text-(--color-text-primary) placeholder-text-(--color-text-tertiary) focus:outline-none focus:ring-2 focus:ring-(--color-primary) disabled:opacity-50 disabled:cursor-not-allowed font-body text-body"
          />
          <p className="text-xs text-(--color-text-secondary) mt-(--spacing-xs)">
            {description.length}/500 characters
          </p>
        </div>

        {/* Plan Summary */}
        {simulationResult && (
          <div className="p-(--spacing-md) bg-(--color-background-hover) rounded-md">
            <p className="text-xs font-medium text-(--color-text-secondary) uppercase tracking-wide mb-(--spacing-sm)">
              Plan Summary
            </p>
            <div className="grid grid-cols-2 gap-(--spacing-md) text-sm">
              <div>
                <p className="text-(--color-text-tertiary)">Initial Capital</p>
                <p className="font-semibold text-(--color-text-primary)">
                  Rs {formData.initial_capital.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-(--color-text-tertiary)">Monthly Investment</p>
                <p className="font-semibold text-(--color-text-primary)">
                  Rs {formData.monthly_contribution?.toLocaleString() || 0}
                </p>
              </div>
              <div>
                <p className="text-(--color-text-tertiary)">Duration</p>
                <p className="font-semibold text-(--color-text-primary)">
                  {formData.duration_years} years
                </p>
              </div>
              <div>
                <p className="text-(--color-text-tertiary)">Risk Profile</p>
                <p className="font-semibold text-(--color-text-primary)">
                  {simulationResult.risk_profile}
                </p>
              </div>
              <div>
                <p className="text-(--color-text-tertiary)">Expected Value</p>
                <p className="font-semibold text-(--color-text-primary)">
                  Rs {simulationResult.projection.expected.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-(--color-text-tertiary)">Estimated Gain</p>
                <p className="font-semibold text-(--color-text-primary)">
                  Rs{' '}
                  {(
                    simulationResult.projection.expected -
                    simulationResult.projection.total_contributions
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
