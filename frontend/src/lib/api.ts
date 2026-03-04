/**
 * API Client Utility
 * Handles all API calls with token management
 */

import { AuthResponse, UserDto } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      'Unable to connect to server. Please ensure backend is running on http://localhost:3001.'
    );
  }

  // Handle 401 - try to refresh token
  if (response.status === 401) {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        const newTokens = await refreshAccessToken(refreshToken);
        setTokens(newTokens.access_token, newTokens.refresh_token);

        // Retry original request with new token
        headers['Authorization'] = `Bearer ${newTokens.access_token}`;
        let retryResponse: Response;
        try {
          retryResponse = await fetch(url, {
            ...options,
            headers,
          });
        } catch {
          throw new Error(
            'Unable to connect to server. Please ensure backend is running on http://localhost:3001.'
          );
        }

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

export interface SimulatorInputDto {
  initial_capital: number;
  monthly_contribution: number;
  duration_years: number;
  risk_tolerance: 'Low' | 'Medium' | 'High';
  liquidity_need: 'Low' | 'Medium' | 'High';
  has_emergency_fund: boolean;
}

export interface SimulatorResultDto {
  risk_profile: 'Conservative' | 'Balanced' | 'Aggressive';
  allocation: {
    'Mutual Fund': number;
    Stocks: number;
    'Fixed Deposit': number;
    Bonds: number;
    Gold: number;
    'Real Estate': number;
    Business: number;
  };
  capital_distribution: Record<string, number>;
  projection: {
    conservative: number;
    expected: number;
    optimistic: number;
    total_contributions: number;
    estimated_gain_conservative: number;
    estimated_gain_expected: number;
    estimated_gain_optimistic: number;
  };
  yearly_projection: Array<{
    year: number;
    conservative: number;
    expected: number;
    optimistic: number;
  }>;
}

export const simulatorApi = {
  runSimulation: async (
    payload: SimulatorInputDto,
  ): Promise<SimulatorResultDto> =>
    apiRequest<SimulatorResultDto>('/simulator/run', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
export interface AiExplanationRequestDto {
  risk_profile: string;
  allocation: Record<string, number>;
  capital_distribution: Record<string, number>;
  projection: {
    conservative: number;
    expected: number;
    optimistic: number;
    total_contributions: number;
  };
  time_horizon: number;
  monthly_contribution?: number;
  risk_tolerance: string;
  liquidity_need: string;
  explanation_type?: 'allocation' | 'risk_profile' | 'time_horizon' | 'narrative';
}

export interface AiExplanationResponseDto {
  explanation: string;
  type: string;
  generated_at: Date;
  model: string;
}

export const aiExplanationApi = {
  generateExplanation: async (
    payload: AiExplanationRequestDto,
  ): Promise<AiExplanationResponseDto> =>
    apiRequest<AiExplanationResponseDto>('/ai-explanation/generate', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

// SavedPlan DTOs
export interface SavePlanDto {
  plan_name: string;
  description?: string;
  initial_capital: number;
  monthly_contribution: number;
  duration_years: number;
  risk_tolerance: 'Low' | 'Medium' | 'High';
  liquidity_need: 'Low' | 'Medium' | 'High';
  has_emergency_fund: boolean;
  risk_profile: 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE';
  allocation: Record<string, number>;
  capital_distribution: Record<string, number>;
  projection: {
    conservative: number;
    expected: number;
    optimistic: number;
    total_contributions: number;
  };
}

export interface UpdatePlanDto {
  plan_name?: string;
  description?: string;
}

export interface SavedPlanResponseDto extends SavePlanDto {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const savedPlansApi = {
  savePlan: async (payload: SavePlanDto): Promise<SavedPlanResponseDto> =>
    apiRequest<SavedPlanResponseDto>('/saved-plans', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getAll: async (): Promise<SavedPlanResponseDto[]> =>
    apiRequest<SavedPlanResponseDto[]>('/saved-plans', {
      method: 'GET',
    }),

  getById: async (planId: string): Promise<SavedPlanResponseDto> =>
    apiRequest<SavedPlanResponseDto>(`/saved-plans/${planId}`, {
      method: 'GET',
    }),

  update: async (
    planId: string,
    payload: UpdatePlanDto,
  ): Promise<SavedPlanResponseDto> =>
    apiRequest<SavedPlanResponseDto>(`/saved-plans/${planId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  delete: async (planId: string): Promise<void> =>
    apiRequest<void>(`/saved-plans/${planId}`, {
      method: 'DELETE',
    }),

  getCount: async (): Promise<{ count: number }> =>
    apiRequest<{ count: number }>('/saved-plans/stats/count', {
      method: 'GET',
    }),
};