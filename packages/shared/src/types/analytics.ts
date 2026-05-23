// ============================================
// DevScope Shared Types — Analytics & Intelligence
// ============================================

export interface LanguageDistribution {
  language: string;
  bytes: number;
  percentage: number;
  color: string;
}

export interface SkillScore {
  skill: string;
  score: number; // 0-100
  category: SkillCategory;
}

export type SkillCategory =
  | 'language'
  | 'framework'
  | 'tool'
  | 'domain'
  | 'practice';

export interface DeveloperScores {
  activityScore: number;      // 0-100
  engagementScore: number;    // 0-100
  consistencyScore: number;   // 0-100
  qualityScore: number;       // 0-100
  overallScore: number;       // 0-100
}

export interface RepoHealthScore {
  repoName: string;
  hasReadme: boolean;
  hasLicense: boolean;
  hasDescription: boolean;
  hasTopics: boolean;
  hasHomepage: boolean;
  isActive: boolean;         // pushed in last 6 months
  starsCount: number;
  forksCount: number;
  issuesCount: number;
  healthScore: number;       // 0-100
}

export interface ContributionTrend {
  date: string;              // ISO date string
  commits: number;
  repos: number;
  events: number;
}

export interface DeveloperAnalytics {
  username: string;
  avatarUrl: string;
  profileUrl: string;
  name: string | null;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string | null;
  twitterUsername: string | null;
  publicRepos: number;
  publicGists: number;
  followers: number;
  following: number;
  accountAge: string;        // Human-readable, e.g., "3 years, 2 months"
  accountCreated: string;    // ISO date
  languages: LanguageDistribution[];
  skills: SkillScore[];
  scores: DeveloperScores;
  repoHealthScores: RepoHealthScore[];
  contributionTrends: ContributionTrend[];
  topRepos: TopRepo[];
  summary: string;           // AI-style natural language summary
  generatedAt: string;       // ISO date
}

export interface TopRepo {
  name: string;
  fullName: string;
  url: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  issues: number;
  healthScore: number;
  updatedAt: string;
}

export interface SearchHistoryItem {
  id: string;
  githubUsername: string;
  searchedAt: string;
  resultSnapshot: {
    name: string | null;
    avatarUrl: string;
    publicRepos: number;
    followers: number;
    overallScore: number;
  } | null;
}
