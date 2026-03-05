import * as Sentry from '@sentry/nestjs';

export function initializeSentry() {
  const sentryDsn = process.env.SENTRY_DSN;

  if (!sentryDsn) {
    console.log('Sentry DSN not configured - error tracking disabled');
    return;
  }

  Sentry.init({
    dsn: sentryDsn,
    integrations: [],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of transactions in development
    // Environment
    environment: process.env.NODE_ENV || 'development',
    // Enable debug mode in development
    debug: process.env.NODE_ENV === 'development',
  });

  console.log('Sentry error tracking initialized');
}

export { Sentry };
