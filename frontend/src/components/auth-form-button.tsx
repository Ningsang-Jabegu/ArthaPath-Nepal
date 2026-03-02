'use client';

import React from 'react';

interface AuthFormButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
}

/**
 * Reusable Button Component for Auth Forms
 */
export function AuthFormButton(
  {
    isLoading = false,
    disabled = false,
    children,
    className,
    ...props
  }: AuthFormButtonProps,
  ref: React.Ref<HTMLButtonElement>
) {
  return (
    <button
      ref={ref}
      disabled={isLoading || disabled}
      className={`
        w-full rounded-lg bg-black px-4 py-2.5 font-medium text-white
        transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
        disabled:cursor-not-allowed disabled:bg-gray-400 dark:hover:bg-gray-700
        dark:focus:ring-white dark:focus:ring-offset-black
        ${className || ''}
      `}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}

export default React.forwardRef(AuthFormButton);
