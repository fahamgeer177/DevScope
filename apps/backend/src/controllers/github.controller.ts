// ============================================
// DevScope — GitHub Analysis Controller
// ============================================

import type { Request, Response, NextFunction } from 'express';
import {
  fetchUser,
  fetchRepos,
  fetchUserLanguages,
  fetchEvents,
  getRateLimitInfo,
} from '../services/github.service.js';
import { generateFullAnalytics } from '../services/analytics.service.js';
import { cacheGet, cacheSet } from '../services/cache.service.js';
import { prisma } from '../config/database.js';
import type { AuthenticatedRequest } from '../types/index.js';
import type { DeveloperAnalytics } from '@devscope/shared';

/**
 * GET /api/github/profile/:username
 * Full developer analytics — the primary endpoint.
 */
export async function getProfile(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { username } = req.params as { username: string };

    // ── Check analytics cache first ─────────────────────────────
    const cached = await cacheGet<DeveloperAnalytics>('analytics', username);
    if (cached) {
      // Record search if user is authenticated
      if (req.user) {
        recordSearch(req.user.userId, username, cached).catch(() => {});
      }

      res.status(200).json({
        success: true,
        data: cached,
        message: 'Profile analytics retrieved from cache',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // ── Fetch fresh data from GitHub ────────────────────────────
    const [user, repos, languages, events] = await Promise.all([
      fetchUser(username),
      fetchRepos(username),
      fetchUserLanguages(username),
      fetchEvents(username),
    ]);

    // ── Generate analytics ──────────────────────────────────────
    const analytics = generateFullAnalytics(user, repos, languages, events);

    // ── Cache the analytics ─────────────────────────────────────
    await cacheSet('analytics', username, analytics);

    // ── Persist to Analytics table ──────────────────────────────
    prisma.analytics.create({
      data: {
        githubUsername: username.toLowerCase(),
        overallScore: analytics.scores.overallScore,
        activityScore: analytics.scores.activityScore,
        engagementScore: analytics.scores.engagementScore,
        consistencyScore: analytics.scores.consistencyScore,
        qualityScore: analytics.scores.qualityScore,
        languagesString: JSON.stringify(analytics.languages),
        skillsString: JSON.stringify(analytics.skills),
        summary: analytics.summary,
        fullAnalytics: JSON.stringify(analytics),
      },
    }).catch((err: unknown) => {
      console.warn('⚠️  Failed to persist analytics:', (err as Error).message);
    });

    // ── Record search for authenticated users ───────────────────
    if (req.user) {
      recordSearch(req.user.userId, username, analytics).catch(() => {});
    }

    res.status(200).json({
      success: true,
      data: analytics,
      message: 'Profile analytics generated successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/github/repos/:username
 * Returns the user's repos with health scores.
 */
export async function getRepos(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { username } = req.params as { username: string };
    const repos = await fetchRepos(username);

    res.status(200).json({
      success: true,
      data: repos,
      message: `Found ${repos.length} repositories`,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/github/languages/:username
 * Returns aggregated language distribution.
 */
export async function getLanguages(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { username } = req.params as { username: string };
    const languages = await fetchUserLanguages(username);

    // Compute distribution
    const totalBytes = Object.values(languages).reduce((s, b) => s + b, 0);
    const distribution = Object.entries(languages)
      .map(([lang, bytes]) => ({
        language: lang,
        bytes,
        percentage: totalBytes > 0 ? Math.round((bytes / totalBytes) * 1000) / 10 : 0,
      }))
      .sort((a, b) => b.bytes - a.bytes);

    res.status(200).json({
      success: true,
      data: distribution,
      message: `Found ${distribution.length} languages`,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/github/activity/:username
 * Returns recent activity events and rate limit info.
 */
export async function getActivity(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { username } = req.params as { username: string };
    const events = await fetchEvents(username);

    res.status(200).json({
      success: true,
      data: {
        events,
        rateLimit: getRateLimitInfo(),
      },
      message: `Found ${events.length} recent events`,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
}

// ── Helpers ─────────────────────────────────────────────────────

async function recordSearch(
  userId: string,
  githubUsername: string,
  analytics: DeveloperAnalytics,
): Promise<void> {
  await prisma.search.create({
    data: {
      userId,
      githubUsername: githubUsername.toLowerCase(),
      resultSnapshot: JSON.stringify({
        name: analytics.name,
        avatarUrl: analytics.avatarUrl,
        publicRepos: analytics.publicRepos,
        followers: analytics.followers,
        overallScore: analytics.scores.overallScore,
      }),
    },
  });
}
