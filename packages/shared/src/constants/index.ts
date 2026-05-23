// ============================================
// DevScope Shared Constants
// ============================================

// Language colors for charts (matching GitHub's language colors)
export const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Scala: '#c22d40',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Sass: '#a53b70',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Lua: '#000080',
  R: '#198CE7',
  MATLAB: '#e16737',
  Jupyter: '#DA5B0B',
  Haskell: '#5e5086',
  Elixir: '#6e4a7e',
  Clojure: '#db5855',
  Perl: '#0298c3',
  Objective_C: '#438eff',
  Assembly: '#6E4C13',
  PowerShell: '#012456',
  Dockerfile: '#384d54',
  Makefile: '#427819',
  HCL: '#844FBA',
  Nix: '#7e7eff',
};

// Skill categories mapped from languages/topics
export const SKILL_MAPPING: Record<string, { skill: string; category: string }[]> = {
  JavaScript: [
    { skill: 'JavaScript', category: 'language' },
    { skill: 'Web Development', category: 'domain' },
  ],
  TypeScript: [
    { skill: 'TypeScript', category: 'language' },
    { skill: 'Web Development', category: 'domain' },
  ],
  Python: [
    { skill: 'Python', category: 'language' },
    { skill: 'Backend Development', category: 'domain' },
  ],
  Java: [
    { skill: 'Java', category: 'language' },
    { skill: 'Enterprise Development', category: 'domain' },
  ],
  Go: [
    { skill: 'Go', category: 'language' },
    { skill: 'Systems Programming', category: 'domain' },
  ],
  Rust: [
    { skill: 'Rust', category: 'language' },
    { skill: 'Systems Programming', category: 'domain' },
  ],
  Ruby: [
    { skill: 'Ruby', category: 'language' },
    { skill: 'Web Development', category: 'domain' },
  ],
  Swift: [
    { skill: 'Swift', category: 'language' },
    { skill: 'iOS Development', category: 'domain' },
  ],
  Kotlin: [
    { skill: 'Kotlin', category: 'language' },
    { skill: 'Android Development', category: 'domain' },
  ],
  'C++': [
    { skill: 'C++', category: 'language' },
    { skill: 'Systems Programming', category: 'domain' },
  ],
  PHP: [
    { skill: 'PHP', category: 'language' },
    { skill: 'Web Development', category: 'domain' },
  ],
  Shell: [
    { skill: 'Shell Scripting', category: 'tool' },
    { skill: 'DevOps', category: 'domain' },
  ],
  Dockerfile: [
    { skill: 'Docker', category: 'tool' },
    { skill: 'DevOps', category: 'domain' },
  ],
  HCL: [
    { skill: 'Terraform', category: 'tool' },
    { skill: 'Infrastructure', category: 'domain' },
  ],
};

// Topic to skill mapping
export const TOPIC_SKILL_MAPPING: Record<string, { skill: string; category: string }> = {
  'machine-learning': { skill: 'Machine Learning', category: 'domain' },
  'deep-learning': { skill: 'Deep Learning', category: 'domain' },
  'artificial-intelligence': { skill: 'AI', category: 'domain' },
  react: { skill: 'React', category: 'framework' },
  nextjs: { skill: 'Next.js', category: 'framework' },
  angular: { skill: 'Angular', category: 'framework' },
  vue: { skill: 'Vue.js', category: 'framework' },
  svelte: { skill: 'Svelte', category: 'framework' },
  nodejs: { skill: 'Node.js', category: 'framework' },
  django: { skill: 'Django', category: 'framework' },
  flask: { skill: 'Flask', category: 'framework' },
  fastapi: { skill: 'FastAPI', category: 'framework' },
  'spring-boot': { skill: 'Spring Boot', category: 'framework' },
  docker: { skill: 'Docker', category: 'tool' },
  kubernetes: { skill: 'Kubernetes', category: 'tool' },
  terraform: { skill: 'Terraform', category: 'tool' },
  aws: { skill: 'AWS', category: 'tool' },
  gcp: { skill: 'Google Cloud', category: 'tool' },
  azure: { skill: 'Azure', category: 'tool' },
  graphql: { skill: 'GraphQL', category: 'tool' },
  postgresql: { skill: 'PostgreSQL', category: 'tool' },
  mongodb: { skill: 'MongoDB', category: 'tool' },
  redis: { skill: 'Redis', category: 'tool' },
  'ci-cd': { skill: 'CI/CD', category: 'practice' },
  testing: { skill: 'Testing', category: 'practice' },
  'test-driven-development': { skill: 'TDD', category: 'practice' },
  devops: { skill: 'DevOps', category: 'domain' },
  blockchain: { skill: 'Blockchain', category: 'domain' },
  security: { skill: 'Security', category: 'domain' },
  'data-science': { skill: 'Data Science', category: 'domain' },
  'data-engineering': { skill: 'Data Engineering', category: 'domain' },
};

// Score thresholds
export const SCORE_LABELS: Record<string, [number, string][]> = {
  activity: [
    [90, 'Exceptional'],
    [75, 'Very Active'],
    [60, 'Active'],
    [40, 'Moderate'],
    [20, 'Low'],
    [0, 'Minimal'],
  ],
  engagement: [
    [90, 'Community Leader'],
    [75, 'Highly Engaged'],
    [60, 'Engaged'],
    [40, 'Moderate'],
    [20, 'Emerging'],
    [0, 'Observer'],
  ],
  quality: [
    [90, 'Exemplary'],
    [75, 'High Quality'],
    [60, 'Good'],
    [40, 'Average'],
    [20, 'Below Average'],
    [0, 'Needs Improvement'],
  ],
};

// Cache TTL (in seconds)
export const CACHE_TTL = {
  PROFILE: 3600,       // 1 hour
  REPOS: 1800,         // 30 minutes
  LANGUAGES: 3600,     // 1 hour
  EVENTS: 600,         // 10 minutes
  ANALYTICS: 3600,     // 1 hour
} as const;

// API rate limit defaults
export const RATE_LIMITS = {
  WINDOW_MS: 15 * 60 * 1000,  // 15 minutes
  MAX_REQUESTS: 100,
  GITHUB_UNAUTHENTICATED: 60,
  GITHUB_AUTHENTICATED: 5000,
} as const;
