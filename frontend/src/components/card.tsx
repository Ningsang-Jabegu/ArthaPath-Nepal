'use client';

import React from 'react';

export type CardVariant = 'summary' | 'metric' | 'chart' | 'allocation';

interface CardProps {
  variant?: CardVariant;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  interactive?: boolean;
}

export function Card({
  variant = 'summary',
  title,
  description,
  children,
  className = '',
  interactive = false,
}: CardProps) {
  const paddingByVariant: Record<CardVariant, string> = {
    summary: 'var(--spacing-lg)',
    metric: 'var(--spacing-md)',
    chart: 'var(--spacing-lg)',
    allocation: 'var(--spacing-lg)',
  };

  const shadowByVariant: Record<CardVariant, string> = {
    summary: 'var(--shadow-md)',
    metric: 'var(--shadow-sm)',
    chart: 'var(--shadow-md)',
    allocation: 'var(--shadow-md)',
  };

  return (
    <div
      className={`rounded-lg border transition-all duration-200 ${
        interactive ? 'cursor-pointer' : ''
      } ${className}`}
      style={{
        backgroundColor: 'var(--color-background)',
        borderColor: 'var(--color-border)',
        padding: paddingByVariant[variant],
        boxShadow: shadowByVariant[variant],
      }}
      onMouseEnter={
        interactive
          ? (e) => {
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              e.currentTarget.style.borderColor = 'var(--color-primary)';
            }
          : undefined
      }
      onMouseLeave={
        interactive
          ? (e) => {
              e.currentTarget.style.boxShadow = shadowByVariant[variant];
              e.currentTarget.style.borderColor = 'var(--color-border)';
            }
          : undefined
      }
    >
      {title && (
        <h3
          className="font-semibold mb-2"
          style={{
            fontSize: 'var(--text-h4-size)',
            color: 'var(--color-text-primary)',
          }}
        >
          {title}
        </h3>
      )}
      {description && (
        <p
          className="mb-3"
          style={{
            fontSize: 'var(--text-body-sm-size)',
            color: 'var(--color-text-secondary)',
          }}
        >
          {description}
        </p>
      )}
      {children}
    </div>
  );
}
