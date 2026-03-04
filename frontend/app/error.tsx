'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import { Button } from '@/components';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-md text-center">
        <h2 className="mb-4 text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
          Something went wrong!
        </h2>
        <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          We apologize for the inconvenience. The error has been logged and we'll look into it.
        </p>
        <Button
          onClick={reset}
          variant="primary"
          className="mx-auto"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
