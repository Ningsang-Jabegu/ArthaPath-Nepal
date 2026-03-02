'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'outlined' | 'filled';
}

export function Input({
  label,
  error,
  helperText,
  variant = 'outlined',
  className = '',
  ...props
}: InputProps) {
  const baseStyles =
    'w-full px-(--spacing-sm) py-(--spacing-sm) rounded-md text-base transition-colors duration-200 focus:outline-none focus:ring-2';

  const variantStyles: Record<string, string> = {
    outlined: `border border-(--color-border) bg-(--color-background) text-(--color-text-primary) placeholder:(--color-text-secondary) focus:ring-(--color-primary) focus:border-(--color-primary) ${
      error ? 'border-(--color-error) focus:border-(--color-error) focus:ring-(--color-error)' : ''
    }`,
    filled: `border-b-2 border-(--color-border) bg-(--color-background-hover) text-(--color-text-primary) placeholder:(--color-text-secondary) focus:ring-0 focus:border-(--color-primary) ${
      error ? 'border-(--color-error) focus:border-(--color-error)' : ''
    }`,
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-label font-medium text-(--color-text-primary) mb-(--spacing-xs)">
          {label}
        </label>
      )}
      <input
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        {...props}
      />
      {error && <p className="mt-(--spacing-xs) text-sm text-(--color-error)">{error}</p>}
      {helperText && !error && (
        <p className="mt-(--spacing-xs) text-sm text-(--color-text-secondary)">{helperText}</p>
      )}
    </div>
  );
}
