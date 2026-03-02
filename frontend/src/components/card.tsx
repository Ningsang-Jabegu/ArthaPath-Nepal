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
  const baseStyles =
    'rounded-lg bg-(--color-background) border border-(--color-border) transition-all duration-200';

  const variantStyles: Record<CardVariant, string> = {
    summary: 'p-(--spacing-lg) shadow-md',
    metric: 'p-(--spacing-md) shadow-sm',
    chart: 'p-(--spacing-lg) shadow-md',
    allocation: 'p-(--spacing-lg) shadow-md',
  };

  const interactiveStyles = interactive
    ? 'hover:shadow-lg hover:border-(--color-primary) cursor-pointer'
    : '';

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${interactiveStyles} ${className}`}>
      {title && (
        <h3 className="text-h4 font-semibold text-(--color-text-primary) mb-(--spacing-sm)">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-body-sm text-(--color-text-secondary) mb-(--spacing-md)">
          {description}
        </p>
      )}
      {children}
    </div>
  );
}
