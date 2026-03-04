/**
 * Analytics Utility
 * Tracks user interactions and events for the ArthaPath application
 * Integrates with PostHog for user behavior tracking
 */

import posthog from 'posthog-js';

/**
 * Check if PostHog is available and enabled
 */
const isPostHogEnabled = (): boolean => {
  return typeof window !== 'undefined' && posthog.__loaded;
};

/**
 * Track an analytics event
 * @param eventName - Name of the event
 * @param properties - Optional properties associated with the event
 */
export const trackEvent = (
  eventName: string,
  properties?: Record<string, any>,
): void => {
  if (isPostHogEnabled()) {
    posthog.capture(eventName, properties);
  }

  // Log in development for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', eventName, properties);
  }
};

/**
 * Tracker for simulator-specific events
 */
export const trackSimulatorEvent = (
  eventType: 'input_changed' | 'simulation_run' | 'chart_viewed' | 'reset' | 'save',
  details?: Record<string, any>,
) => {
  const eventNames: Record<string, string> = {
    input_changed: 'simulator_input_changed',
    simulation_run: 'simulator_completed',
    chart_viewed: 'simulator_chart_viewed',
    reset: 'simulator_reset',
    save: 'simulator_save',
  };

  trackEvent(eventNames[eventType], details);
};

/**
 * Tracker for input field changes
 */
export const trackInputChange = (fieldName: string, newValue: any) => {
  trackSimulatorEvent('input_changed', {
    field_name: fieldName,
    new_value:
      typeof newValue === 'object' ? JSON.stringify(newValue) : String(newValue),
  });
};

/**
 * Tracker for simulation runs
 */
export const trackSimulationRun = (inputData: Record<string, any>) => {
  trackSimulatorEvent('simulation_run', {
    risk_tolerance: inputData.risk_tolerance,
    initial_capital: inputData.initial_capital,
    monthly_contribution: inputData.monthly_contribution,
    duration_years: inputData.duration_years,
    has_emergency_fund: inputData.has_emergency_fund,
  });
};

/**
 * Tracker for form resets
 */
export const trackFormReset = () => {
  trackSimulatorEvent('reset');
};
