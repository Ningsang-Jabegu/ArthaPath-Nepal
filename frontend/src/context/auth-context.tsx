'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, AuthResponse, UserDto } from '@/types/auth';
import { authApi, clearTokens, setTokens, getAccessToken } from '@/lib/api';
import { trackEvent } from '@/lib/analytics';
import posthog from '@/lib/posthog';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    const initializeAuth = async () => {
      const token = getAccessToken();
      
      if (token) {
        try {
          const userData: UserDto = await authApi.getCurrentUser();
          setUser(userData);
        } catch (err) {
          console.error('Failed to load user:', err);
          clearTokens();
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  /**
   * Login handler
   */
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response: AuthResponse = await authApi.login(email, password);
      
      setTokens(response.access_token, response.refresh_token);
      setUser(response.user);
      
      // Track successful login
      trackEvent('user_logged_in');
      
      // Identify user in PostHog
      if (posthog.__loaded) {
        posthog.identify(response.user.id, {
          email: response.user.email,
          name: response.user.name,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register handler
   */
  const register = async (
    email: string,
    password: string,
    name: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response: AuthResponse = await authApi.register(
        email,
        password,
        name
      );
      
      setTokens(response.access_token, response.refresh_token);
      setUser(response.user);
      
      // Track successful signup
      trackEvent('user_signed_up');
      
      // Identify user in PostHog
      if (posthog.__loaded) {
        posthog.identify(response.user.id, {
          email: response.user.email,
          name: response.user.name,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout handler
   */
  const logout = () => {
    // Track logout
    trackEvent('user_logged_out');
    
    // Reset PostHog identity
    if (posthog.__loaded) {
      posthog.reset();
    }
    
    clearTokens();
    setUser(null);
    setError(null);
  };

  /**
   * Clear error message
   */
  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use auth context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
