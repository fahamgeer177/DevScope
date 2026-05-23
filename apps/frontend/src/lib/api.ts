// ============================================
// DevScope — API Client
// ============================================
// Centralized API client with interceptors, error handling,
// and automatic token management.

import type {
  ApiResponse,
  ApiError,
  DeveloperAnalytics,
  SearchHistoryItem,
  AuthResponse,
  UserProfile,
  TopRepo,
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

class ApiClient {
  private accessToken: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('devscope_token');
    }
  }

  setToken(token: string | null) {
    this.accessToken = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('devscope_token', token);
      } else {
        localStorage.removeItem('devscope_token');
      }
    }
  }

  getToken(): string | null {
    return this.accessToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          success: false,
          error: {
            code: 'UNKNOWN_ERROR',
            message: `HTTP ${response.status}: ${response.statusText}`,
          },
          timestamp: new Date().toISOString(),
        }));

        // Handle specific error codes
        if (response.status === 401) {
          this.setToken(null);
        }

        throw new ApiRequestError(
          errorData.error.message,
          errorData.error.code,
          response.status,
          errorData.error.details
        );
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiRequestError) {
        throw error;
      }

      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiRequestError(
          'Request timed out. Please try again.',
          'TIMEOUT',
          408
        );
      }

      throw new ApiRequestError(
        'Unable to connect to the server. Please check your connection.',
        'NETWORK_ERROR',
        0
      );
    }
  }

  // --- Auth ---
  async register(email: string, username: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const result = await this.request<ApiResponse<AuthResponse>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, username, password }),
    });
    if (result.data?.accessToken) {
      this.setToken(result.data.accessToken);
    }
    return result;
  }

  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const result = await this.request<ApiResponse<AuthResponse>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (result.data?.accessToken) {
      this.setToken(result.data.accessToken);
    }
    return result;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.setToken(null);
    }
  }

  async getMe(): Promise<ApiResponse<UserProfile>> {
    return this.request<ApiResponse<UserProfile>>('/auth/me');
  }

  // --- GitHub Analysis ---
  async analyzeProfile(username: string): Promise<ApiResponse<DeveloperAnalytics>> {
    return this.request<ApiResponse<DeveloperAnalytics>>(`/github/profile/${encodeURIComponent(username)}`);
  }

  async getRepos(username: string): Promise<ApiResponse<TopRepo[]>> {
    return this.request<ApiResponse<TopRepo[]>>(`/github/repos/${encodeURIComponent(username)}`);
  }

  // --- Search History ---
  async getSearchHistory(): Promise<ApiResponse<SearchHistoryItem[]>> {
    return this.request<ApiResponse<SearchHistoryItem[]>>('/search/history');
  }

  async deleteSearchEntry(id: string): Promise<ApiResponse<null>> {
    return this.request<ApiResponse<null>>(`/search/history/${id}`, {
      method: 'DELETE',
    });
  }

  async clearSearchHistory(): Promise<ApiResponse<null>> {
    return this.request<ApiResponse<null>>('/search/history', {
      method: 'DELETE',
    });
  }
}

// Custom error class
export class ApiRequestError extends Error {
  code: string;
  status: number;
  details?: Record<string, string[]>;

  constructor(
    message: string,
    code: string,
    status: number,
    details?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiRequestError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

// Singleton instance
export const api = new ApiClient();
