/**
 * Performance monitoring utility for tracking Core Web Vitals
 * Integrates with Sentry for error tracking
 */

export interface WebVital {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType?: string;
}

/**
 * sendToAnalytics - Send performance metrics to analytics service
 */
function sendToAnalytics(metric: WebVital) {
  // Send to PostHog or your preferred analytics
  if (window.posthog) {
    window.posthog.capture('web_vital', {
      metric: metric.name,
      value: metric.value,
      rating: metric.rating,
    });
  }

  // Send to Sentry for performance tracking
  if (window.Sentry) {
    window.Sentry.captureMessage(`Web Vital: ${metric.name}=${metric.value}`, 'info');
  }

  // Console log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vital] ${metric.name}: ${metric.value.toFixed(0)}ms - ${metric.rating}`);
  }
}

/**
 * Initialize performance monitoring
 * Tracks Core Web Vitals: LCP, FID, CLS
 */
export function initializePerformanceMonitoring() {
  // Only run in browser
  if (typeof window === 'undefined') return;

  // Web Vitals tracking using the web-vitals library
  if ('PerformanceObserver' in window) {
    try {
      // Track Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Track Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!('hadRecentInput' in entry) || !entry.hadRecentInput) {
            clsValue += entry.value;
            console.log('CLS:', clsValue);
          }
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // Track First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log('FID:', entry.processingDuration);
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('Performance monitoring not available:', e);
    }
  }
}

/**
 * Measure function execution time
 */
export function measureExecutionTime(label: string) {
  const startTime = performance.now();

  return () => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
    return duration;
  };
}
