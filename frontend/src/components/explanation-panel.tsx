'use client';

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Card } from '@/components';
import {
  aiExplanationApi,
  type AiExplanationRequestDto,
  type AiExplanationResponseDto,
  type SimulatorResultDto,
  type SimulatorInputDto,
} from '@/lib/api';

interface ExplanationPanelProps {
  simulationResult: SimulatorResultDto | null;
  formData: SimulatorInputDto;
  className?: string;
  explanationType?: 'allocation' | 'risk_profile' | 'time_horizon' | 'narrative';
}

interface ExplanationState {
  data: AiExplanationResponseDto | null;
  loading: boolean;
  error: string | null;
}

export function ExplanationPanel({
  simulationResult,
  formData,
  className = '',
  explanationType = 'narrative',
}: ExplanationPanelProps) {
  const [state, setState] = useState<ExplanationState>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!simulationResult) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    let isMounted = true;

    const fetchExplanation = async () => {
      setState({ data: null, loading: true, error: null });

      try {
        const requestPayload: AiExplanationRequestDto = {
          risk_profile: simulationResult.risk_profile,
          allocation: simulationResult.allocation,
          capital_distribution: simulationResult.capital_distribution,
          projection: {
            conservative: simulationResult.projection.conservative,
            expected: simulationResult.projection.expected,
            optimistic: simulationResult.projection.optimistic,
            total_contributions: simulationResult.projection.total_contributions,
          },
          time_horizon: formData.duration_years,
          monthly_contribution: formData.monthly_contribution,
          risk_tolerance: formData.risk_tolerance.toUpperCase(),
          liquidity_need: formData.liquidity_need.toUpperCase(),
          explanation_type: explanationType,
        };

        const result = await aiExplanationApi.generateExplanation(requestPayload);

        if (isMounted) {
          setState({ data: result, loading: false, error: null });
        }
      } catch (error) {
        if (isMounted) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to generate explanation',
          });
        }
      }
    };

    fetchExplanation();

    return () => {
      isMounted = false;
    };
  }, [simulationResult, formData, explanationType]);

  // Loading state
  if (state.loading) {
    return (
      <Card title="AI Financial Insights" className={className}>
        <div className="space-y-3">
          <div className="animate-pulse space-y-3">
            <div
              className="h-4 rounded"
              style={{ backgroundColor: 'var(--color-background-tertiary)', width: '100%' }}
            />
            <div
              className="h-4 rounded"
              style={{ backgroundColor: 'var(--color-background-tertiary)', width: '90%' }}
            />
            <div
              className="h-4 rounded"
              style={{ backgroundColor: 'var(--color-background-tertiary)', width: '95%' }}
            />
            <div
              className="h-4 rounded"
              style={{ backgroundColor: 'var(--color-background-tertiary)', width: '85%' }}
            />
          </div>
          <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            Generating personalized insights...
          </p>
        </div>
      </Card>
    );
  }

  // Error state with fallback content
  if (state.error) {
    return (
      <Card title="Financial Insights" className={className}>
        <div className="space-y-4">
          <div
            className="rounded-lg p-4"
            style={{
              backgroundColor: 'var(--color-warning-light)',
              border: '1px solid var(--color-warning)',
            }}
          >
            <p className="text-sm font-medium" style={{ color: 'var(--color-warning)' }}>
              ⚠️ Unable to load AI insights
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              {state.error}
            </p>
          </div>

          {/* Fallback educational content */}
          <div className="space-y-3">
            <h4 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              Understanding Your {simulationResult?.risk_profile} Profile
            </h4>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
              Your investment plan has been designed based on your financial situation and goals:
            </p>
            <ul className="list-disc pl-5 space-y-2" style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
              <li>
                <strong>Risk Profile:</strong> {simulationResult?.risk_profile} - This profile
                balances your risk tolerance with your investment timeline.
              </li>
              <li>
                <strong>Time Horizon:</strong> {formData.duration_years} years - Longer time
                horizons allow for potentially higher-growth investments.
              </li>
              <li>
                <strong>Diversification:</strong> Your allocation spreads investments across
                multiple asset classes to reduce overall risk.
              </li>
              <li>
                <strong>Regular Contributions:</strong>{' '}
                {formData.monthly_contribution > 0
                  ? `Monthly investments of NPR ${formData.monthly_contribution.toLocaleString('en-IN')} benefit from rupee-cost averaging.`
                  : 'Consider adding regular contributions to maximize compound growth.'}
              </li>
            </ul>

            <DisclaimerBadge />
          </div>
        </div>
      </Card>
    );
  }

  // No data yet (initial state)
  if (!state.data) {
    return (
      <Card title="AI Financial Insights" className={className}>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Complete a simulation to see personalized AI-generated insights.
        </p>
      </Card>
    );
  }

  // Success state - display AI explanation
  return (
    <Card title="AI Financial Insights" className={className}>
      <div className="space-y-4">
        <div
          className="prose prose-sm max-w-none"
          style={{
            color: 'var(--color-text-primary)',
            lineHeight: '1.7',
          }}
        >
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 style={{ color: 'var(--color-text-primary)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 style={{ color: 'var(--color-text-primary)', fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 style={{ color: 'var(--color-text-primary)', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-5 space-y-1" style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-5 space-y-1" style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                  {children}
                </li>
              ),
              strong: ({ children }) => (
                <strong style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                  {children}
                </strong>
              ),
              blockquote: ({ children }) => (
                <blockquote
                  style={{
                    borderLeft: '4px solid var(--color-primary)',
                    paddingLeft: '1rem',
                    color: 'var(--color-text-secondary)',
                    fontStyle: 'italic',
                    marginBottom: '1rem',
                  }}
                >
                  {children}
                </blockquote>
              ),
              hr: () => (
                <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '1.5rem 0' }} />
              ),
            }}
          >
            {state.data.explanation}
          </ReactMarkdown>
        </div>

        {/* Model info badge */}
        <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
            Generated by {state.data.model} •{' '}
            {new Date(state.data.generated_at).toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </Card>
  );
}

/**
 * Disclaimer Badge Component
 * Highlights the critical disclaimer prominently
 */
function DisclaimerBadge() {
  return (
    <div
      className="rounded-lg p-4 mt-4"
      style={{
        backgroundColor: 'var(--color-info-light)',
        border: '1px solid var(--color-info)',
      }}
    >
      <div className="flex items-start gap-2">
        <span style={{ color: 'var(--color-info)', fontSize: '1.2rem' }}>⚠️</span>
        <div>
          <h5 className="font-semibold text-sm mb-1" style={{ color: 'var(--color-info)' }}>
            IMPORTANT DISCLAIMER
          </h5>
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
            This information is for <strong>educational purposes only</strong> and does not
            constitute investment advice. Past performance does not guarantee future results. All
            investments carry risk, including possible loss of principal. Consult with a qualified
            financial advisor before making investment decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
