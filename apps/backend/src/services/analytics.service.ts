// ============================================
// DevScope — Developer Analytics Intelligence Engine
// ============================================
// THE CORE DIFFERENTIATOR. This module transforms raw GitHub API data
// into actionable developer intelligence through:
//
//   1. Language distribution analysis with weighted byte counts
//   2. Activity Score (0-100) — commit frequency, repo creation cadence, event volume
//   3. Engagement Score (0-100) — stars, forks, followers, community impact
//   4. Consistency Score (0-100) — contribution patterns, temporal distribution
//   5. Quality Score (0-100) — repo health (README, license, description, topics)
//   6. Skill detection — languages → skills + topic → skills mapping
//   7. Per-repo health scores
//   8. Contribution trend analysis over time
//   9. Natural language developer summary (rule-based, no external AI)

import type {
  GitHubUser,
  GitHubRepo,
  GitHubEvent,
  GitHubLanguages,
  DeveloperAnalytics,
  DeveloperScores,
  LanguageDistribution,
  SkillScore,
  SkillCategory,
  RepoHealthScore,
  ContributionTrend,
  TopRepo,
} from '@devscope/shared';

import {
  LANGUAGE_COLORS,
  SKILL_MAPPING,
  TOPIC_SKILL_MAPPING,
  SCORE_LABELS,
} from '@devscope/shared';

import {
  clamp,
  round,
  getAccountAge,
  daysSince,
  logScale,
  linearScale,
  groupBy,
  getScoreLabel,
} from '../utils/helpers.js';

// ── Main entry point ────────────────────────────────────────────

export function generateFullAnalytics(
  user: GitHubUser,
  repos: GitHubRepo[],
  languages: GitHubLanguages,
  events: GitHubEvent[],
): DeveloperAnalytics {
  // Filter out forks for primary analysis (keep them available for some metrics)
  const ownRepos = repos.filter((r) => !r.fork);
  const activeRepos = ownRepos.filter((r) => !r.archived);

  // ── Compute all sub-analyses ──────────────────────────────────
  const languageDist = computeLanguageDistribution(languages);
  const skills = detectSkills(languages, repos);
  const repoHealthScores = computeRepoHealthScores(activeRepos);
  const contributionTrends = computeContributionTrends(events);

  // ── Compute scores ────────────────────────────────────────────
  const activityScore = computeActivityScore(user, ownRepos, events);
  const engagementScore = computeEngagementScore(user, ownRepos);
  const consistencyScore = computeConsistencyScore(events, user);
  const qualityScore = computeQualityScore(repoHealthScores);

  // Overall = weighted blend of all four scores
  const overallScore = clamp(
    Math.round(
      activityScore * 0.25 +
      engagementScore * 0.25 +
      consistencyScore * 0.25 +
      qualityScore * 0.25,
    ),
    0,
    100,
  );

  const scores: DeveloperScores = {
    activityScore,
    engagementScore,
    consistencyScore,
    qualityScore,
    overallScore,
  };

  // ── Top repos ─────────────────────────────────────────────────
  const topRepos = computeTopRepos(ownRepos, repoHealthScores);

  // ── Natural language summary ──────────────────────────────────
  const summary = generateDeveloperSummary(user, scores, languageDist, skills, ownRepos, topRepos);

  return {
    username: user.login,
    avatarUrl: user.avatar_url,
    profileUrl: user.html_url,
    name: user.name,
    bio: user.bio,
    company: user.company,
    location: user.location,
    blog: user.blog,
    twitterUsername: user.twitter_username,
    publicRepos: user.public_repos,
    publicGists: user.public_gists,
    followers: user.followers,
    following: user.following,
    accountAge: getAccountAge(user.created_at),
    accountCreated: user.created_at,
    languages: languageDist,
    skills,
    scores,
    repoHealthScores,
    contributionTrends,
    topRepos,
    summary,
    generatedAt: new Date().toISOString(),
  };
}

// ====================================================================
// 1. LANGUAGE DISTRIBUTION
// ====================================================================

function computeLanguageDistribution(languages: GitHubLanguages): LanguageDistribution[] {
  const entries = Object.entries(languages);
  if (entries.length === 0) return [];

  const totalBytes = entries.reduce((sum, [, bytes]) => sum + bytes, 0);
  if (totalBytes === 0) return [];

  return entries
    .map(([language, bytes]) => ({
      language,
      bytes,
      percentage: round((bytes / totalBytes) * 100, 1),
      color: LANGUAGE_COLORS[language] ?? '#8b8b8b',
    }))
    .sort((a, b) => b.bytes - a.bytes);
}

// ====================================================================
// 2. ACTIVITY SCORE (0-100)
// ====================================================================
// Components:
//   A. Repo creation cadence (repos per year of account age)
//   B. Recent push activity (how many repos pushed to in last 90 days)
//   C. Event volume (total events, weighted by recency)
//   D. Commit event density (PushEvents in recent events)

function computeActivityScore(
  user: GitHubUser,
  ownRepos: GitHubRepo[],
  events: GitHubEvent[],
): number {
  const accountDays = Math.max(daysSince(user.created_at), 1);
  const accountYears = accountDays / 365;

  // A. Repo creation cadence: repos per year (ceil=15 repos/year → 100)
  const reposPerYear = ownRepos.length / accountYears;
  const cadenceScore = logScale(reposPerYear, 15);

  // B. Recent push activity: repos pushed to in last 90 days
  const now = Date.now();
  const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;
  const recentlyPushed = ownRepos.filter(
    (r) => r.pushed_at && now - new Date(r.pushed_at).getTime() < ninetyDaysMs,
  ).length;
  const pushScore = logScale(recentlyPushed, 15);

  // C. Event volume (total events, log-scaled)
  const eventVolumeScore = logScale(events.length, 200);

  // D. Commit density: fraction of events that are PushEvents
  const pushEvents = events.filter((e) => e.type === 'PushEvent').length;
  const commitDensity = events.length > 0 ? pushEvents / events.length : 0;
  const commitDensityScore = linearScale(commitDensity * 100, 60); // 60% push events → 100

  // Weighted blend
  const raw =
    cadenceScore * 0.2 +
    pushScore * 0.35 +
    eventVolumeScore * 0.25 +
    commitDensityScore * 0.2;

  return clamp(Math.round(raw), 0, 100);
}

// ====================================================================
// 3. ENGAGEMENT SCORE (0-100)
// ====================================================================
// Components:
//   A. Total stars received across all repos
//   B. Total forks received
//   C. Follower count
//   D. Follower-to-following ratio (community influence)
//   E. Repos with 5+ stars (popular projects)

function computeEngagementScore(
  user: GitHubUser,
  ownRepos: GitHubRepo[],
): number {
  const totalStars = ownRepos.reduce((s, r) => s + r.stargazers_count, 0);
  const totalForks = ownRepos.reduce((s, r) => s + r.forks_count, 0);

  // A. Stars (log-scaled, ceiling=500)
  const starsScore = logScale(totalStars, 500);

  // B. Forks (log-scaled, ceiling=100)
  const forksScore = logScale(totalForks, 100);

  // C. Followers (log-scaled, ceiling=1000)
  const followersScore = logScale(user.followers, 1000);

  // D. Follower-to-following ratio
  const ratio = user.following > 0 ? user.followers / user.following : user.followers;
  const ratioScore = logScale(ratio, 10);

  // E. Popular repos (repos with 5+ stars)
  const popularRepos = ownRepos.filter((r) => r.stargazers_count >= 5).length;
  const popularScore = logScale(popularRepos, 10);

  const raw =
    starsScore * 0.3 +
    forksScore * 0.15 +
    followersScore * 0.25 +
    ratioScore * 0.15 +
    popularScore * 0.15;

  return clamp(Math.round(raw), 0, 100);
}

// ====================================================================
// 4. CONSISTENCY SCORE (0-100)
// ====================================================================
// Measures how evenly distributed contributions are over time.
// Components:
//   A. Day-of-week spread (coding across multiple days vs. only weekends)
//   B. Weekly streak — consecutive weeks with at least one event
//   C. Event recency — how recent the latest activity is
//   D. Month coverage — unique months with activity in the past year

function computeConsistencyScore(
  events: GitHubEvent[],
  user: GitHubUser,
): number {
  if (events.length === 0) {
    // No events — use account age and repo recency as proxy
    const accountDays = daysSince(user.created_at);
    return accountDays > 365 ? 15 : 5;
  }

  // A. Day-of-week spread
  //    Count unique days of the week with events. 7/7 = perfect spread.
  const daysOfWeek = new Set(events.map((e) => new Date(e.created_at).getDay()));
  const daySpreadScore = linearScale(daysOfWeek.size, 7) * 100 / 100;

  // B. Weekly streak
  //    Group events by ISO week, count consecutive weeks
  const weekSet = new Set<string>();
  for (const event of events) {
    const d = new Date(event.created_at);
    const year = d.getFullYear();
    const weekNum = getISOWeek(d);
    weekSet.add(`${year}-W${weekNum}`);
  }

  // Calculate longest consecutive week streak
  const weeks = Array.from(weekSet).sort();
  let longestStreak = 1;
  let currentStreak = 1;
  for (let i = 1; i < weeks.length; i++) {
    if (areConsecutiveWeeks(weeks[i - 1]!, weeks[i]!)) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }
  const streakScore = logScale(longestStreak, 12); // 12-week streak → 100

  // C. Event recency
  const latestEvent = events.reduce((latest, e) =>
    new Date(e.created_at) > new Date(latest.created_at) ? e : latest,
  );
  const daysSinceLatest = daysSince(latestEvent.created_at);
  const recencyScore = daysSinceLatest <= 1 ? 100
    : daysSinceLatest <= 7 ? 85
    : daysSinceLatest <= 14 ? 70
    : daysSinceLatest <= 30 ? 55
    : daysSinceLatest <= 60 ? 35
    : daysSinceLatest <= 90 ? 20
    : 5;

  // D. Month coverage (past 12 months)
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
  const recentEvents = events.filter((e) => new Date(e.created_at) > twelveMonthsAgo);
  const months = new Set(recentEvents.map((e) => {
    const d = new Date(e.created_at);
    return `${d.getFullYear()}-${d.getMonth()}`;
  }));
  const monthCoverageScore = linearScale(months.size, 12) * 100 / 100;

  const raw =
    daySpreadScore * 0.2 * 100 +
    streakScore * 0.3 +
    recencyScore * 0.3 +
    monthCoverageScore * 0.2 * 100;

  // Normalize: the above can sum up to ~100 when all sub-scores are 100
  return clamp(Math.round(raw / 1), 0, 100);
}

// ====================================================================
// 5. QUALITY SCORE (0-100)
// ====================================================================
// Average of all individual repo health scores.

function computeQualityScore(repoHealthScores: RepoHealthScore[]): number {
  if (repoHealthScores.length === 0) return 0;

  const total = repoHealthScores.reduce((sum, r) => sum + r.healthScore, 0);
  return clamp(Math.round(total / repoHealthScores.length), 0, 100);
}

// ====================================================================
// 6. REPO HEALTH SCORES
// ====================================================================

function computeRepoHealthScores(repos: GitHubRepo[]): RepoHealthScore[] {
  return repos.map((repo) => {
    const hasDescription = !!repo.description && repo.description.length > 10;
    const hasTopics = repo.topics.length > 0;
    const hasLicense = !!repo.license;
    const hasHomepage = !!repo.homepage;
    const isActive = repo.pushed_at ? daysSince(repo.pushed_at) < 180 : false;

    // We infer README presence from repo size (>0) + description.
    // GitHub API doesn't directly expose README presence without extra call.
    const hasReadme = repo.size > 0;

    // ── Score breakdown ─────────────────────────────────────────
    let score = 0;

    // Documentation (40 points)
    if (hasReadme) score += 15;
    if (hasDescription) score += 15;
    if (hasHomepage) score += 10;

    // Best practices (30 points)
    if (hasLicense) score += 15;
    if (hasTopics) score += 15;

    // Activity & popularity (30 points)
    if (isActive) score += 10;
    score += Math.min(logScale(repo.stargazers_count, 50), 10);
    score += Math.min(logScale(repo.forks_count, 20), 10);

    return {
      repoName: repo.name,
      hasReadme,
      hasLicense,
      hasDescription,
      hasTopics,
      hasHomepage,
      isActive,
      starsCount: repo.stargazers_count,
      forksCount: repo.forks_count,
      issuesCount: repo.open_issues_count,
      healthScore: clamp(score, 0, 100),
    };
  });
}

// ====================================================================
// 7. SKILL DETECTION
// ====================================================================

function detectSkills(
  languages: GitHubLanguages,
  repos: GitHubRepo[],
): SkillScore[] {
  const skillMap = new Map<string, { score: number; category: SkillCategory }>();

  const totalBytes = Object.values(languages).reduce((s, b) => s + b, 0);

  // ── From languages ────────────────────────────────────────────
  for (const [lang, bytes] of Object.entries(languages)) {
    const percentage = totalBytes > 0 ? (bytes / totalBytes) * 100 : 0;

    // Score based on percentage: primary language gets higher score
    const langScore = clamp(Math.round(percentage * 1.2), 10, 100);

    // Map language to skills
    const mappings = SKILL_MAPPING[lang];
    if (mappings) {
      for (const mapping of mappings) {
        const existing = skillMap.get(mapping.skill);
        const newScore = Math.max(existing?.score ?? 0, langScore);
        skillMap.set(mapping.skill, {
          score: newScore,
          category: mapping.category as SkillCategory,
        });
      }
    } else {
      // Language not in mapping — add it as a language skill
      const existing = skillMap.get(lang);
      if (!existing || existing.score < langScore) {
        skillMap.set(lang, { score: langScore, category: 'language' });
      }
    }
  }

  // ── From repo topics ──────────────────────────────────────────
  const topicCounts: Record<string, number> = {};
  for (const repo of repos) {
    for (const topic of repo.topics) {
      const normalized = topic.toLowerCase();
      topicCounts[normalized] = (topicCounts[normalized] ?? 0) + 1;
    }
  }

  for (const [topic, count] of Object.entries(topicCounts)) {
    const mapping = TOPIC_SKILL_MAPPING[topic];
    if (mapping) {
      // Score based on how many repos use this topic
      const topicScore = clamp(Math.round(logScale(count, 5) * 0.9), 15, 90);
      const existing = skillMap.get(mapping.skill);
      const newScore = Math.max(existing?.score ?? 0, topicScore);
      skillMap.set(mapping.skill, {
        score: newScore,
        category: mapping.category as SkillCategory,
      });
    }
  }

  // Convert to sorted array
  return Array.from(skillMap.entries())
    .map(([skill, data]) => ({
      skill,
      score: data.score,
      category: data.category,
    }))
    .sort((a, b) => b.score - a.score);
}

// ====================================================================
// 8. CONTRIBUTION TRENDS
// ====================================================================

function computeContributionTrends(events: GitHubEvent[]): ContributionTrend[] {
  if (events.length === 0) return [];

  // Group events by date (YYYY-MM-DD)
  const grouped = groupBy(events, (e) => e.created_at.slice(0, 10));

  const trends: ContributionTrend[] = [];

  for (const [date, dayEvents] of Object.entries(grouped)) {
    if (!dayEvents) continue;

    const commits = dayEvents
      .filter((e) => e.type === 'PushEvent')
      .reduce((sum, e) => {
        const size = (e.payload as { size?: number }).size ?? 1;
        return sum + size;
      }, 0);

    const repos = new Set(dayEvents.map((e) => e.repo.name)).size;

    trends.push({
      date: date!,
      commits,
      repos,
      events: dayEvents.length,
    });
  }

  return trends.sort((a, b) => a.date.localeCompare(b.date));
}

// ====================================================================
// 9. TOP REPOS
// ====================================================================

function computeTopRepos(
  repos: GitHubRepo[],
  healthScores: RepoHealthScore[],
): TopRepo[] {
  const healthMap = new Map(healthScores.map((h) => [h.repoName, h.healthScore]));

  // Score repos by a composite: stars(40%) + forks(20%) + recency(20%) + health(20%)
  const scored = repos.map((repo) => {
    const starScore = logScale(repo.stargazers_count, 100);
    const forkScore = logScale(repo.forks_count, 30);
    const recencyDays = repo.pushed_at ? daysSince(repo.pushed_at) : 365;
    const recencyScore = recencyDays <= 7 ? 100
      : recencyDays <= 30 ? 80
      : recencyDays <= 90 ? 60
      : recencyDays <= 180 ? 40
      : recencyDays <= 365 ? 20
      : 5;
    const health = healthMap.get(repo.name) ?? 0;

    const composite = starScore * 0.4 + forkScore * 0.2 + recencyScore * 0.2 + health * 0.2;

    return { repo, composite, health };
  });

  return scored
    .sort((a, b) => b.composite - a.composite)
    .slice(0, 10)
    .map(({ repo, health }) => ({
      name: repo.name,
      fullName: repo.full_name,
      url: repo.html_url,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      issues: repo.open_issues_count,
      healthScore: health,
      updatedAt: repo.updated_at,
    }));
}

// ====================================================================
// 10. NATURAL LANGUAGE DEVELOPER SUMMARY
// ====================================================================

function generateDeveloperSummary(
  user: GitHubUser,
  scores: DeveloperScores,
  languages: LanguageDistribution[],
  skills: SkillScore[],
  repos: GitHubRepo[],
  topRepos: TopRepo[],
): string {
  const parts: string[] = [];
  const name = user.name || user.login;
  const accountAge = getAccountAge(user.created_at);

  // ── Opening line ──────────────────────────────────────────────
  const overallLabel = getScoreLabel(scores.overallScore, SCORE_LABELS['activity']!);
  parts.push(
    `${name} is a ${overallLabel.toLowerCase()} developer who has been on GitHub for ${accountAge}, ` +
    `maintaining ${user.public_repos} public ${user.public_repos === 1 ? 'repository' : 'repositories'} ` +
    `with ${user.followers} ${user.followers === 1 ? 'follower' : 'followers'}.`,
  );

  // ── Language expertise ────────────────────────────────────────
  if (languages.length > 0) {
    const topLangs = languages.slice(0, 3);
    const langNames = topLangs.map((l) => `${l.language} (${l.percentage}%)`);

    if (langNames.length === 1) {
      parts.push(`Their primary language is ${langNames[0]}.`);
    } else if (langNames.length === 2) {
      parts.push(`Their primary languages are ${langNames[0]} and ${langNames[1]}.`);
    } else {
      parts.push(
        `Their primary languages are ${langNames.slice(0, -1).join(', ')}, and ${langNames[langNames.length - 1]}.`,
      );
    }

    if (languages.length > 3) {
      parts.push(
        `They also work with ${languages
          .slice(3, 6)
          .map((l) => l.language)
          .join(', ')}, demonstrating ${languages.length > 8 ? 'broad' : 'solid'} language versatility.`,
      );
    }
  }

  // ── Domain expertise (from skills) ────────────────────────────
  const domainSkills = skills.filter((s) => s.category === 'domain' && s.score >= 30);
  const frameworkSkills = skills.filter((s) => s.category === 'framework' && s.score >= 30);
  const toolSkills = skills.filter((s) => s.category === 'tool' && s.score >= 30);

  if (domainSkills.length > 0) {
    const domains = domainSkills.slice(0, 3).map((s) => s.skill);
    parts.push(
      `Their work spans ${domains.join(', ')}${domainSkills.length > 3 ? ' among other domains' : ''}.`,
    );
  }

  if (frameworkSkills.length > 0) {
    const frameworks = frameworkSkills.slice(0, 4).map((s) => s.skill);
    parts.push(`They have experience with ${frameworks.join(', ')}.`);
  }

  if (toolSkills.length > 0) {
    const tools = toolSkills.slice(0, 4).map((s) => s.skill);
    parts.push(`Their toolchain includes ${tools.join(', ')}.`);
  }

  // ── Activity assessment ───────────────────────────────────────
  const actLabel = getScoreLabel(scores.activityScore, SCORE_LABELS['activity']!);
  if (scores.activityScore >= 75) {
    parts.push(
      `With an activity score of ${scores.activityScore}/100 (${actLabel}), they are a highly productive contributor who consistently ships code.`,
    );
  } else if (scores.activityScore >= 40) {
    parts.push(
      `Their activity score of ${scores.activityScore}/100 (${actLabel}) shows a steady development pace.`,
    );
  } else {
    parts.push(
      `Their activity score is ${scores.activityScore}/100 (${actLabel}), suggesting either a focused coding style or reduced recent activity.`,
    );
  }

  // ── Engagement assessment ─────────────────────────────────────
  const engLabel = getScoreLabel(scores.engagementScore, SCORE_LABELS['engagement']!);
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const totalForks = repos.reduce((s, r) => s + r.forks_count, 0);

  if (scores.engagementScore >= 60) {
    parts.push(
      `They have strong community engagement (${engLabel}) with ${totalStars} total stars and ${totalForks} forks across their projects.`,
    );
  } else if (totalStars > 0) {
    parts.push(
      `Their projects have gathered ${totalStars} stars and ${totalForks} forks, ` +
      `with an engagement level rated as ${engLabel.toLowerCase()}.`,
    );
  }

  // ── Quality assessment ────────────────────────────────────────
  const qualLabel = getScoreLabel(scores.qualityScore, SCORE_LABELS['quality']!);
  if (scores.qualityScore >= 60) {
    parts.push(
      `Repository quality is ${qualLabel.toLowerCase()} (${scores.qualityScore}/100), indicating well-documented and properly maintained projects.`,
    );
  } else if (scores.qualityScore >= 40) {
    parts.push(
      `Repository quality scores ${scores.qualityScore}/100 (${qualLabel}), with room to improve documentation and project metadata.`,
    );
  }

  // ── Top project highlight ─────────────────────────────────────
  if (topRepos.length > 0) {
    const best = topRepos[0]!;
    const desc = best.description ? ` — ${best.description}` : '';
    parts.push(
      `Their most notable project is "${best.name}"${desc}` +
      (best.stars > 0 ? `, which has earned ${best.stars} stars.` : '.'),
    );
  }

  // ── Consistency ───────────────────────────────────────────────
  if (scores.consistencyScore >= 70) {
    parts.push('They demonstrate excellent consistency in their contribution patterns.');
  } else if (scores.consistencyScore >= 40) {
    parts.push('They show moderate consistency in their coding habits.');
  }

  // ── Location / Company ────────────────────────────────────────
  const locationParts: string[] = [];
  if (user.company) locationParts.push(`works at ${user.company}`);
  if (user.location) locationParts.push(`based in ${user.location}`);
  if (locationParts.length > 0) {
    parts.push(`${name} ${locationParts.join(' and ')}.`);
  }

  // ── Overall score wrap-up ─────────────────────────────────────
  parts.push(
    `Overall DevScope Score: ${scores.overallScore}/100.`,
  );

  return parts.join(' ');
}

// ====================================================================
// HELPERS
// ====================================================================

function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
}

function areConsecutiveWeeks(w1: string, w2: string): boolean {
  // Format: "YYYY-WNN"
  const [y1, wk1] = w1.split('-W').map(Number) as [number, number];
  const [y2, wk2] = w2.split('-W').map(Number) as [number, number];

  if (y1 === y2) return wk2 - wk1 === 1;
  if (y2 - y1 === 1 && wk1 >= 51 && wk2 === 1) return true;
  return false;
}
