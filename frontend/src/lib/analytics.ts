/**
 * Analytics Utility
 * Tracks user interactions and events for the ArthaPath application
 * Events are stored locally and can be sent to analytics service
 */

interface AnalyticsEvent {
  event_name: string;
  event_category: string;
  event_value?: number | string;
  timestamp: number;
  page?: string;
  user_id?: string;
  session_id?: string;
  metadata?: Record<string, any>;
}

class AnalyticsTracker {
  private sessionId: string;
  private events: AnalyticsEvent[] = [];
  private readonly SESSION_STORAGE_KEY = 'arthapath-session-id';
  private readonly EVENTS_STORAGE_KEY = 'arthapath-events';

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.loadEventsFromStorage();
  }

  /**
   * Get or create a session ID for tracking user behavior across page loads
   */
  private getOrCreateSessionId(): string {
    // Check if we're in the browser
    if (typeof sessionStorage === 'undefined') {
      return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    let sessionId = sessionStorage.getItem(this.SESSION_STORAGE_KEY);
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem(this.SESSION_STORAGE_KEY, sessionId);
    }
    return sessionId;
  }

  /**
   * Load previously stored events from localStorage
   */
  private loadEventsFromStorage(): void {
    try {
      if (typeof localStorage === 'undefined') {
        this.events = [];
        return;
      }

      const stored = localStorage.getItem(this.EVENTS_STORAGE_KEY);
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load analytics events from storage:', error);
      this.events = [];
    }
  }

  /**
   * Track an analytics event
   * @param eventName - Name of the event (e.g., 'simulator_input_changed')
   * @param category - Category of the event (e.g., 'simulator')
   * @param value - Optional value associated with the event
   * @param metadata - Optional metadata object
   */
  public trackEvent(
    eventName: string,
    category: string,
    value?: number | string,
    metadata?: Record<string, any>,
  ): void {
    const event: AnalyticsEvent = {
      event_name: eventName,
      event_category: category,
      event_value: value,
      timestamp: Date.now(),
      page: typeof window !== 'undefined' ? window.location.pathname : undefined,
      session_id: this.sessionId,
      metadata: metadata || {},
    };

    this.events.push(event);
    this.saveEventsToStorage();

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event);
    }
  }

  /**
   * Save events to localStorage for persistence
   */
  private saveEventsToStorage(): void {
    try {
      if (typeof localStorage === 'undefined') {
        return;
      }

      // Keep only the last 100 events
      const recentEvents = this.events.slice(-100);
      localStorage.setItem(this.EVENTS_STORAGE_KEY, JSON.stringify(recentEvents));
    } catch (error) {
      console.error('Failed to save analytics events to storage:', error);
    }
  }

  /**
   * Get all tracked events
   */
  public getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  /**
   * Clear all events
   */
  public clearEvents(): void {
    this.events = [];
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.EVENTS_STORAGE_KEY);
    }
  }

  /**
   * Get events by category
   */
  public getEventsByCategory(category: string): AnalyticsEvent[] {
    return this.events.filter((e) => e.event_category === category);
  }

  /**
   * Get event statistics
   */
  public getStatistics() {
    return {
      total_events: this.events.length,
      session_id: this.sessionId,
      categories: this.events.reduce(
        (acc, event) => {
          acc[event.event_category] = (acc[event.event_category] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ),
      time_range: {
        start: this.events.length > 0 ? this.events[0].timestamp : null,
        end: this.events.length > 0 ? this.events[this.events.length - 1].timestamp : null,
      },
    };
  }
}

// Global analytics instance
const analyticsTracker = new AnalyticsTracker();

export default analyticsTracker;

/**
 * Tracker for simulator-specific events
 */
export const trackSimulatorEvent = (
  eventType: 'input_changed' | 'simulation_run' | 'chart_viewed' | 'reset' | 'save',
  details?: Record<string, any>,
) => {
  const eventNames: Record<string, string> = {
    input_changed: 'simulator_input_changed',
    simulation_run: 'simulator_simulation_run',
    chart_viewed: 'simulator_chart_viewed',
    reset: 'simulator_reset',
    save: 'simulator_save',
  };

  analyticsTracker.trackEvent(eventNames[eventType], 'simulator', undefined, details);
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
    inputs_provided: Object.keys(inputData).length,
  });
};

/**
 * Tracker for form resets
 */
export const trackFormReset = () => {
  trackSimulatorEvent('reset');
};
