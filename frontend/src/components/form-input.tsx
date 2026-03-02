'use client';

import React from 'react';

interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

/**
 * Reusable Form Input Component
 * Handles label, error state, and styling
 */
export function FormInput(
  {
    label,
    error,
    helperText,
    className,
    ...props
  }: FormInputProps,
  ref: React.Ref<HTMLInputElement>
) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        ref={ref}
        className={`
          w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5
          text-gray-900 placeholder-gray-400 transition-colors
          hover:border-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black
          dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500
          dark:hover:border-gray-500 dark:focus:border-white dark:focus:ring-white
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:focus:border-red-500' : ''}
          ${className || ''}
        `}
        {...props}
      />
      {error && (
        <span className="text-sm font-medium text-red-600 dark:text-red-400">
          {error}
        </span>
      )}
      {helperText && !error && (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </span>
      )}
    </div>
  );
}

export default React.forwardRef(FormInput);
