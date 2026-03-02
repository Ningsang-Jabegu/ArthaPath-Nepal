'use client';

import React from 'react';

export type BadgeVariant = 'low' | 'medium' | 'high' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  const baseStyles =
    'inline-flex items-center justify-center px-(--spacing-sm) py-(--spacing-xs) rounded text-label font-medium';

  const variantStyles: Record<BadgeVariant, string> = {
    low: 'bg-(--color-success-light) text-(--color-success-dark)',
    medium: 'bg-(--color-warning-light) text-(--color-warning-dark)',
    high: 'bg-(--color-error-light) text-(--color-error-dark)',
    default: 'bg-(--color-neutral-light) text-(--color-neutral-dark)',
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
}
