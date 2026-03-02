'use client';

import React from 'react';

interface SkeletonProps {
  variant?: 'text' | 'rect' | 'circle';
  width?: string;
  height?: string;
  className?: string;
}

export function Skeleton({
  variant = 'text',
  width = '100%',
  height = '1rem',
  className = '',
}: SkeletonProps) {
  const baseStyles =
    'bg-(--color-background-hover) animate-pulse rounded';

  const variantStyles: Record<string, string> = {
    text: 'rounded-sm',
    rect: 'rounded-md',
    circle: 'rounded-full',
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={{
        width,
        height,
      }}
    />
  );
}

/**
 * SkeletonGroup component for loading multiple items
 */
interface SkeletonGroupProps {
  count?: number;
  height?: string;
  spacing?: string;
  className?: string;
}

export function SkeletonGroup({
  count = 3,
  height = '4rem',
  spacing = '--spacing-md',
  className = '',
}: SkeletonGroupProps) {
  return (
    <div className={`flex flex-col gap-${spacing} ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="space-y-2"
        >
          <Skeleton height="1rem" />
          <Skeleton height={height} />
        </div>
      ))}
    </div>
  );
}
