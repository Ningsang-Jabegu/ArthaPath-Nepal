'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Initialize PostHog
if (typeof window !== 'undefined') {
  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';
  
  if (apiKey) {
    posthog.init(apiKey, {
      api_host: apiHost,
      capture_pageview: false, // We'll capture manually
      loaded: (posthog) => {
        // Opt out in development to save quota
        if (process.env.NODE_ENV === 'development') {
          posthog.opt_out_capturing();
        }
      },
    });
  }
}

// Page view tracker component
function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = url + '?' + searchParams.toString();
      }
      posthog.capture('$pageview', {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

// PostHog Provider wrapper
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  );
}

// Analytics tracking utility functions
export const analytics = {
  // Track simulator completion
  trackSimulatorCompletion: (data: {
    riskProfile: string;
    capital: number;
    monthlyContribution: number;
    duration: number;
    projectedValue: number;
  }) => {
    posthog.capture('simulator_completed', {
      risk_profile: data.riskProfile,
      capital: data.capital,
      monthly_contribution: data.monthlyContribution,
      duration: data.duration,
      projected_value: data.projectedValue,
    });
  },

  // Track plan save
  trackPlanSaved: (data: {
    planName: string;
    riskProfile: string;
    capital: number;
  }) => {
    posthog.capture('plan_saved', {
      plan_name: data.planName,
      risk_profile: data.riskProfile,
      capital: data.capital,
    });
  },

  // Track plan loaded
  trackPlanLoaded: (data: {
    planId: string;
    planName: string;
  }) => {
    posthog.capture('plan_loaded', {
      plan_id: data.planId,
      plan_name: data.planName,
    });
  },

  // Track education article view
  trackArticleView: (data: {
    articleId: string;
    articleTitle: string;
    category: string;
  }) => {
    posthog.capture('article_viewed', {
      article_id: data.articleId,
      article_title: data.articleTitle,
      category: data.category,
    });
  },

  // Track explore page filter usage
  trackExploreFilter: (data: {
    filterType: string;
    filterValue: string;
  }) => {
    posthog.capture('explore_filter_used', {
      filter_type: data.filterType,
      filter_value: data.filterValue,
    });
  },

  // Track authentication events
  trackSignUp: () => {
    posthog.capture('user_signed_up');
  },

  trackLogin: () => {
    posthog.capture('user_logged_in');
  },

  trackLogout: () => {
    posthog.capture('user_logged_out');
  },

  // Identify user (call after successful login)
  identifyUser: (userId: string, email: string, name: string) => {
    posthog.identify(userId, {
      email: email,
      name: name,
    });
  },

  // Reset user identity (call on logout)
  reset: () => {
    posthog.reset();
  },

  // Generic event tracking
  track: (eventName: string, properties?: Record<string, any>) => {
    posthog.capture(eventName, properties);
  },
};

export default posthog;
