/**
 * API Client Utility
 * Handles all API calls with token management
 */

import { AuthResponse, UserDto } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface ApiRequestInit extends RequestInit {
  headers?: Record<string, string>;
}

/**
 * Get stored access token
 */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

/**
 * Get stored refresh token
 */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refresh_token');
}

/**
 * Store tokens
 */
export function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
}

/**
 * Clear stored tokens
 */
export function clearTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

/**
 * Generic API request handler with auth
 */
export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const accessToken = getAccessToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 - try to refresh token
  if (response.status === 401) {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        const newTokens = await refreshAccessToken(refreshToken);
        setTokens(newTokens.access_token, newTokens.refresh_token);

        // Retry original request with new token
        headers['Authorization'] = `Bearer ${newTokens.access_token}`;
        const retryResponse = await fetch(url, {
          ...options,
          headers,
        });

        if (!retryResponse.ok) {
          throw new Error(`API Error: ${retryResponse.status}`);
        }

        return retryResponse.json();
      } catch (error) {
        clearTokens();
        throw new Error('Session expired. Please login again.');
      }
    }
    clearTokens();
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `API Error: ${response.status}`
    );
  }

  return response.json();
}

/**
 * Refresh access token using refresh token
 */
async function refreshAccessToken(
  refreshToken: string
): Promise<{ access_token: string; refresh_token: string }> {
  const url = `${API_BASE_URL}/auth/refresh`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Token refresh failed');
  }

  return response.json();
}

/**
 * Auth API endpoints
 */
export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> =>
    apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: async (
    email: string,
    password: string,
    name: string
  ): Promise<AuthResponse> =>
    apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),

  getCurrentUser: async (): Promise<UserDto> =>
    apiRequest<UserDto>('/auth/me', {
      method: 'GET',
    }),

  refreshToken: async (refreshToken: string): Promise<AuthResponse> =>
    apiRequest<AuthResponse>('/auth/refresh', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    }),
};

/**
 * User API endpoints
 */
export const userApi = {
  getProfile: async (): Promise<UserDto> =>
    apiRequest<UserDto>('/users/profile', {
      method: 'GET',
    }),

  updateProfile: async (
    name?: string,
    email?: string
  ): Promise<UserDto> =>
    apiRequest<UserDto>('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify({
        ...(name && { name }),
        ...(email && { email }),
      }),
    }),

  getPreferences: async () =>
    apiRequest('/users/preferences', {
      method: 'GET',
    }),

  createPreferences: async (
    risk_tolerance: string,
    liquidity_need: string,
    has_emergency_fund: boolean
  ) =>
    apiRequest('/users/preferences', {
      method: 'POST',
      body: JSON.stringify({
        risk_tolerance,
        liquidity_need,
        has_emergency_fund,
      }),
    }),

  updatePreferences: async (
    risk_tolerance?: string,
    liquidity_need?: string,
    has_emergency_fund?: boolean
  ) =>
    apiRequest('/users/preferences', {
      method: 'PATCH',
      body: JSON.stringify({
        ...(risk_tolerance && { risk_tolerance }),
        ...(liquidity_need && { liquidity_need }),
        ...(has_emergency_fund !== undefined && { has_emergency_fund }),
      }),
    }),
};
