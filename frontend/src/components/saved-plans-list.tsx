'use client';

import React, { useEffect, useState } from 'react';
import { Card } from './card';
import { Button } from './button';
import { savedPlansApi, SavedPlanResponseDto } from '@/lib/api';

interface SavedPlansListProps {
  onLoadPlan?: (plan: SavedPlanResponseDto) => void;
}

export function SavedPlansList({ onLoadPlan }: SavedPlansListProps) {
  const [plans, setPlans] = useState<SavedPlanResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await savedPlansApi.getAll();
      setPlans(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load saved plans'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) {
      return;
    }

    setDeletingId(planId);

    try {
      await savedPlansApi.delete(planId);
      setPlans(plans.filter((p) => p.id !== planId));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete plan'
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditClick = (plan: SavedPlanResponseDto) => {
    setEditingId(plan.id);
    setEditName(plan.plan_name);
    setEditDescription(plan.description || '');
  };

  const handleSaveEdit = async (planId: string) => {
    try {
      const updated = await savedPlansApi.update(planId, {
        plan_name: editName,
        description: editDescription,
      });

      setPlans(plans.map((p) => (p.id === planId ? updated : p)));
      setEditingId(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update plan'
      );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <Card>
        <div className="p-(--spacing-lg) text-center">
          <p className="text-(--color-text-secondary)">Loading saved plans...</p>
        </div>
      </Card>
    );
  }

  if (plans.length === 0) {
    return (
      <Card>
        <div className="p-(--spacing-lg) text-center">
          <p className="text-(--color-text-secondary) mb-(--spacing-md)">
            No saved plans yet
          </p>
          <p className="text-sm text-(--color-text-tertiary)">
            Create and save an investment plan to see it here
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-(--spacing-md)">
      {error && (
        <div className="p-(--spacing-md) bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-md">
          <p className="text-sm font-medium text-red-700 dark:text-red-400">
            {error}
          </p>
        </div>
      )}

      {plans.map((plan) => (
        <Card key={plan.id}>
          <div className="p-(--spacing-lg)">
            {editingId === plan.id ? (
              // Edit Mode
              <div className="space-y-(--spacing-md)">
                <div>
                  <label className="block text-sm font-medium text-(--color-text-primary) mb-(--spacing-xs)">
                    Plan Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-(--spacing-md) py-(--spacing-sm) border border-(--color-border) rounded-md bg-(--color-background) text-(--color-text-primary)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-(--color-text-primary) mb-(--spacing-xs)">
                    Description
                  </label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={2}
                    className="w-full px-(--spacing-md) py-(--spacing-sm) border border-(--color-border) rounded-md bg-(--color-background) text-(--color-text-primary)"
                  />
                </div>
                <div className="flex gap-(--spacing-md) justify-end">
                  <Button
                    variant="secondary"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => handleSaveEdit(plan.id)}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              // Display Mode
              <>
                <div className="flex items-start justify-between mb-(--spacing-md)">
                  <div className="flex-1">
                    <h3 className="text-h5 font-semibold text-(--color-text-primary)">
                      {plan.plan_name}
                    </h3>
                    {plan.description && (
                      <p className="text-sm text-(--color-text-secondary) mt-(--spacing-xs)">
                        {plan.description}
                      </p>
                    )}
                    <p className="text-xs text-(--color-text-tertiary) mt-(--spacing-sm)">
                      Saved on {formatDate(plan.created_at)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-(--spacing-md) mb-(--spacing-md) p-(--spacing-md) bg-(--color-background-hover) rounded-md">
                  <div>
                    <p className="text-xs text-(--color-text-tertiary) uppercase tracking-wide">
                      Capital
                    </p>
                    <p className="text-sm font-semibold text-(--color-text-primary)">
                      Rs {plan.initial_capital.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-(--color-text-tertiary) uppercase tracking-wide">
                      Monthly
                    </p>
                    <p className="text-sm font-semibold text-(--color-text-primary)">
                      Rs {plan.monthly_contribution.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-(--color-text-tertiary) uppercase tracking-wide">
                      Duration
                    </p>
                    <p className="text-sm font-semibold text-(--color-text-primary)">
                      {plan.duration_years}y
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-(--color-text-tertiary) uppercase tracking-wide">
                      Expected Value
                    </p>
                    <p className="text-sm font-semibold text-(--color-text-primary)">
                      Rs {plan.projection.expected.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-(--spacing-md) justify-end">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEditClick(plan)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onLoadPlan?.(plan)}
                  >
                    Load Plan
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    disabled={deletingId === plan.id}
                    onClick={() => handleDelete(plan.id)}
                  >
                    {deletingId === plan.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
