// ============================================
// DevScope — Shared Frontend Types
// ============================================
// Re-exports from shared package + frontend-specific types

// Re-export shared types
import type {
  GitHubUser,
  GitHubRepo,
  GitHubLanguages,
  GitHubEvent,
  LanguageDistribution,
  SkillScore,
  SkillCategory,
  DeveloperScores,
  RepoHealthScore,
  ContributionTrend,
  DeveloperAnalytics,
  TopRepo,
  SearchHistoryItem,
  ApiResponse,
  ApiError,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UserProfile,
} from '@devscope/shared';
export type { GitHubUser, GitHubRepo, GitHubLanguages, GitHubEvent, LanguageDistribution, SkillScore, SkillCategory, DeveloperScores, RepoHealthScore, ContributionTrend, DeveloperAnalytics, TopRepo, SearchHistoryItem, ApiResponse, ApiError, LoginRequest, RegisterRequest, AuthResponse, UserProfile };

// Frontend-specific types
export interface ThemeMode {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export interface AuthState {
  user: {
    id: string;
    email: string;
    username: string;
  } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export interface SearchState {
  query: string;
  isSearching: boolean;
  error: string | null;
  results: DeveloperAnalytics | null;
}

export type ScoreLevel = 'exceptional' | 'high' | 'good' | 'moderate' | 'low' | 'minimal';

export function getScoreLevel(score: number): ScoreLevel {
  if (score >= 90) return 'exceptional';
  if (score >= 75) return 'high';
  if (score >= 60) return 'good';
  if (score >= 40) return 'moderate';
  if (score >= 20) return 'low';
  return 'minimal';
}

export function getScoreColor(score: number): string {
  if (score >= 90) return 'var(--score-exceptional)';
  if (score >= 75) return 'var(--score-high)';
  if (score >= 60) return 'var(--score-good)';
  if (score >= 40) return 'var(--score-moderate)';
  if (score >= 20) return 'var(--score-low)';
  return 'var(--score-minimal)';
}
