// ============================================
// DevScope — GitHub API Client Service
// ============================================
// Robust HTTP client for the GitHub REST API with:
//   • Exponential backoff retry (3 attempts)
//   • 15-second timeout per request
//   • Rate limit detection from response headers
//   • Proper error classification
//   • Support for authenticated & unauthenticated requests

import { config } from '../config/index.js';
import { AppError } from '../types/index.js';
import type { GitHubRateLimitInfo } from '../types/index.js';
import type { GitHubUser, GitHubRepo, GitHubEvent, GitHubLanguages } from '@devscope/shared';
import { sleep } from '../utils/helpers.js';
import { cacheGet, cacheSet } from './cache.service.js';

const GITHUB_API_BASE = 'https://api.github.com';
const DEFAULT_TIMEOUT = 15_000; // 15 seconds
const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 500;

// ── Rate limit state ────────────────────────────────────────────
let rateLimitInfo: GitHubRateLimitInfo | null = null;

export function getRateLimitInfo(): GitHubRateLimitInfo | null {
  return rateLimitInfo;
}

// ── Core fetch with retry ───────────────────────────────────────

async function githubFetch<T>(
  path: string,
  options: { retries?: number; timeout?: number } = {},
): Promise<T> {
  const { retries = MAX_RETRIES, timeout = DEFAULT_TIMEOUT } = options;

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'DevScope/1.0',
  };

  if (config.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${config.GITHUB_TOKEN}`;
  }

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${GITHUB_API_BASE}${path}`, {
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // ── Update rate limit info from headers ───────────────────
      updateRateLimitFromHeaders(response.headers);

      // ── Handle HTTP errors ────────────────────────────────────
      if (!response.ok) {
        const errorBody = await response.text().catch(() => '');

        // Rate limited — wait and retry if possible
        if (response.status === 403 || response.status === 429) {
          const resetTime = response.headers.get('x-ratelimit-reset');
          const remaining = response.headers.get('x-ratelimit-remaining');

          if (remaining === '0' || response.status === 429) {
            if (attempt < retries && resetTime) {
              const resetMs = parseInt(resetTime, 10) * 1000 - Date.now();
              const waitTime = Math.min(Math.max(resetMs, 1000), 60_000); // cap at 60s
              console.warn(`⚠️  GitHub rate limited. Waiting ${Math.round(waitTime / 1000)}s (attempt ${attempt}/${retries})`);
              await sleep(waitTime);
              continue;
            }
            throw AppError.tooManyRequests(
              'GitHub API rate limit exceeded. ' +
              (config.GITHUB_TOKEN
                ? 'Please try again later.'
                : 'Set GITHUB_TOKEN to increase rate limit from 60 to 5000 requests/hour.'),
            );
          }
        }

        // Not found
        if (response.status === 404) {
          throw AppError.notFound(`GitHub user or resource not found: ${path}`);
        }

        // Server error — retry with backoff
        if (response.status >= 500 && attempt < retries) {
          const backoff = INITIAL_BACKOFF_MS * Math.pow(2, attempt - 1);
          console.warn(`⚠️  GitHub API 5xx (${response.status}), retrying in ${backoff}ms (attempt ${attempt}/${retries})`);
          await sleep(backoff);
          continue;
        }

        throw new AppError(
          `GitHub API error: ${response.status} — ${errorBody.slice(0, 200)}`,
          response.status >= 500 ? 503 : response.status,
          'GITHUB_API_ERROR',
        );
      }

      // ── Parse JSON ────────────────────────────────────────────
      const data = (await response.json()) as T;
      return data;
    } catch (err) {
      clearTimeout(timeoutId);

      // Abort timeout → classify as timeout error
      if (err instanceof DOMException && err.name === 'AbortError') {
        lastError = new AppError(
          `GitHub API request timed out after ${timeout / 1000}s: ${path}`,
          504,
          'TIMEOUT',
        );

        if (attempt < retries) {
          const backoff = INITIAL_BACKOFF_MS * Math.pow(2, attempt - 1);
          console.warn(`⚠️  GitHub API timeout, retrying in ${backoff}ms (attempt ${attempt}/${retries})`);
          await sleep(backoff);
          continue;
        }

        throw lastError;
      }

      // AppError — re-throw immediately (don't retry 404s etc.)
      if (err instanceof AppError) {
        throw err;
      }

      // Network error — retry with backoff
      lastError = err as Error;
      if (attempt < retries) {
        const backoff = INITIAL_BACKOFF_MS * Math.pow(2, attempt - 1);
        console.warn(`⚠️  GitHub API network error, retrying in ${backoff}ms (attempt ${attempt}/${retries}):`, (err as Error).message);
        await sleep(backoff);
        continue;
      }
    }
  }

  throw lastError ?? AppError.serviceUnavailable('GitHub API is unreachable');
}

function updateRateLimitFromHeaders(headers: Headers): void {
  const limit = headers.get('x-ratelimit-limit');
  const remaining = headers.get('x-ratelimit-remaining');
  const reset = headers.get('x-ratelimit-reset');
  const used = headers.get('x-ratelimit-used');

  if (limit && remaining && reset) {
    rateLimitInfo = {
      limit: parseInt(limit, 10),
      remaining: parseInt(remaining, 10),
      reset: parseInt(reset, 10),
      used: used ? parseInt(used, 10) : 0,
    };
  }
}

// ── Public API Methods ──────────────────────────────────────────

/**
 * Fetch a GitHub user profile.
 */
export async function fetchUser(username: string): Promise<GitHubUser> {
  // Check cache first
  const cached = await cacheGet<GitHubUser>('profile', username);
  if (cached) return cached;

  const user = await githubFetch<GitHubUser>(`/users/${encodeURIComponent(username)}`);

  // Cache result
  await cacheSet('profile', username, user);

  return user;
}

/**
 * Fetch all public repos for a user (paginated, up to 300).
 */
export async function fetchRepos(username: string): Promise<GitHubRepo[]> {
  const cached = await cacheGet<GitHubRepo[]>('repos', username);
  if (cached) return cached;

  const allRepos: GitHubRepo[] = [];
  let page = 1;
  const perPage = 100;
  const maxPages = 3; // Cap at 300 repos

  while (page <= maxPages) {
    const repos = await githubFetch<GitHubRepo[]>(
      `/users/${encodeURIComponent(username)}/repos?per_page=${perPage}&page=${page}&sort=updated&direction=desc`,
    );

    allRepos.push(...repos);

    // If we got fewer than perPage, we've hit the last page
    if (repos.length < perPage) break;
    page++;
  }

  await cacheSet('repos', username, allRepos);

  return allRepos;
}

/**
 * Fetch language breakdown for a specific repo.
 */
export async function fetchRepoLanguages(
  owner: string,
  repo: string,
): Promise<GitHubLanguages> {
  return githubFetch<GitHubLanguages>(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`,
  );
}

/**
 * Fetch aggregated languages across all repos.
 * Fetches individual repo languages and merges them.
 */
export async function fetchUserLanguages(username: string): Promise<GitHubLanguages> {
  const cached = await cacheGet<GitHubLanguages>('languages', username);
  if (cached) return cached;

  const repos = await fetchRepos(username);
  const aggregated: GitHubLanguages = {};

  // Fetch languages for up to 20 most recently updated non-fork repos
  const targetRepos = repos
    .filter((r) => !r.fork && !r.archived)
    .slice(0, 20);

  // Process in parallel batches of 5 to avoid overwhelming the API
  const batchSize = 5;
  for (let i = 0; i < targetRepos.length; i += batchSize) {
    const batch = targetRepos.slice(i, i + batchSize);
    const results = await Promise.allSettled(
      batch.map((repo) => fetchRepoLanguages(username, repo.name)),
    );

    for (const result of results) {
      if (result.status === 'fulfilled') {
        for (const [lang, bytes] of Object.entries(result.value)) {
          aggregated[lang] = (aggregated[lang] ?? 0) + bytes;
        }
      }
    }
  }

  await cacheSet('languages', username, aggregated);

  return aggregated;
}

/**
 * Fetch recent events for a user (up to 300, 10 pages).
 */
export async function fetchEvents(username: string): Promise<GitHubEvent[]> {
  const cached = await cacheGet<GitHubEvent[]>('events', username);
  if (cached) return cached;

  const allEvents: GitHubEvent[] = [];
  let page = 1;
  const perPage = 100;
  const maxPages = 3; // GitHub only returns up to 300 events anyway

  while (page <= maxPages) {
    try {
      const events = await githubFetch<GitHubEvent[]>(
        `/users/${encodeURIComponent(username)}/events/public?per_page=${perPage}&page=${page}`,
      );

      allEvents.push(...events);
      if (events.length < perPage) break;
      page++;
    } catch {
      // Events endpoint can fail for some users — non-critical
      break;
    }
  }

  await cacheSet('events', username, allEvents);

  return allEvents;
}
