// ============================================
// DevScope — Two-Tier Cache Service
// ============================================
// Tier 1: Redis (fast, volatile)
// Tier 2: PostgreSQL CachedProfile table (persistent, slower)
// If Redis is down, falls back to DB cache seamlessly.

import { getRedis, isRedisAvailable } from '../config/redis.js';
import { prisma } from '../config/database.js';
import { CACHE_TTL } from '@devscope/shared';
import type { CacheCategory } from '../types/index.js';

// Map categories to TTLs
const TTL_MAP: Record<CacheCategory, number> = {
  profile: CACHE_TTL.PROFILE,
  repos: CACHE_TTL.REPOS,
  languages: CACHE_TTL.LANGUAGES,
  events: CACHE_TTL.EVENTS,
  analytics: CACHE_TTL.ANALYTICS,
};

// Map categories to DB column names
const DB_COLUMN_MAP: Record<CacheCategory, string> = {
  profile: 'profileData',
  repos: 'reposData',
  languages: 'languagesData',
  events: 'profileData',     // events stored alongside profile
  analytics: 'analyticsData',
};

/**
 * Build a namespaced Redis key.
 */
function buildKey(category: CacheCategory, username: string): string {
  return `devscope:${category}:${username.toLowerCase()}`;
}

/**
 * GET from cache — checks Redis first, then DB.
 * Returns null on cache miss.
 */
export async function cacheGet<T>(category: CacheCategory, username: string): Promise<T | null> {
  const normalizedUsername = username.toLowerCase();

  // ── Tier 1: Redis ─────────────────────────────────────────────
  if (isRedisAvailable()) {
    try {
      const redis = getRedis();
      if (redis) {
        const key = buildKey(category, normalizedUsername);
        const cached = await redis.get(key);
        if (cached) {
          return JSON.parse(cached) as T;
        }
      }
    } catch (err) {
      console.warn('⚠️  Redis GET error:', (err as Error).message);
    }
  }

  // ── Tier 2: DB CachedProfile ──────────────────────────────────
  try {
    const record = await prisma.cachedProfile.findUnique({
      where: { githubUsername: normalizedUsername },
    });

    if (!record) return null;

    // Check expiry
    if (new Date() > record.expiresAt) {
      // Expired — clean up asynchronously
      prisma.cachedProfile.delete({ where: { id: record.id } }).catch(() => {});
      return null;
    }

    const columnName = DB_COLUMN_MAP[category];
    const rawData = (record as unknown as Record<string, string>)[columnName!];

    if (!rawData) return null;

    let data: T;
    try {
      data = JSON.parse(rawData) as T;
    } catch {
      // Fallback for non-JSON strings if any, though everything should be stringified now
      data = rawData as unknown as T;
    }

    // Backfill Redis if available
    if (isRedisAvailable()) {
      const redis = getRedis();
      if (redis) {
        const ttl = TTL_MAP[category];
        const key = buildKey(category, normalizedUsername);
        redis.setex(key, ttl!, rawData).catch(() => {});
      }
    }

    return data;
  } catch (err) {
    console.warn('⚠️  DB cache GET error:', (err as Error).message);
    return null;
  }
}

/**
 * SET into cache — writes to both Redis and DB.
 */
export async function cacheSet<T>(
  category: CacheCategory,
  username: string,
  data: T,
  ttlOverride?: number,
): Promise<void> {
  const normalizedUsername = username.toLowerCase();
  const ttl = ttlOverride ?? TTL_MAP[category]!;

  // ── Tier 1: Redis ─────────────────────────────────────────────
  if (isRedisAvailable()) {
    try {
      const redis = getRedis();
      if (redis) {
        const key = buildKey(category, normalizedUsername);
        await redis.setex(key, ttl, JSON.stringify(data));
      }
    } catch (err) {
      console.warn('⚠️  Redis SET error:', (err as Error).message);
    }
  }

  // ── Tier 2: DB CachedProfile ──────────────────────────────────
  try {
    const columnName = DB_COLUMN_MAP[category]!;
    const expiresAt = new Date(Date.now() + ttl * 1000);
    const dataString = JSON.stringify(data);

    await prisma.cachedProfile.upsert({
      where: { githubUsername: normalizedUsername },
      create: {
        githubUsername: normalizedUsername,
        profileData: category === 'profile' || category === 'events' ? dataString : '{}',
        reposData: category === 'repos' ? dataString : '{}',
        languagesData: category === 'languages' ? dataString : '{}',
        analyticsData: category === 'analytics' ? dataString : '{}',
        expiresAt,
      },
      update: {
        [columnName]: dataString,
        expiresAt,
      },
    });
  } catch (err) {
    console.warn('⚠️  DB cache SET error:', (err as Error).message);
  }
}

/**
 * Invalidate cache for a specific username and category (or all categories).
 */
export async function cacheInvalidate(
  username: string,
  category?: CacheCategory,
): Promise<void> {
  const normalizedUsername = username.toLowerCase();

  // ── Redis ─────────────────────────────────────────────────────
  if (isRedisAvailable()) {
    try {
      const redis = getRedis();
      if (redis) {
        if (category) {
          await redis.del(buildKey(category, normalizedUsername));
        } else {
          // Invalidate all categories
          const categories: CacheCategory[] = ['profile', 'repos', 'languages', 'events', 'analytics'];
          const keys = categories.map((c) => buildKey(c, normalizedUsername));
          await redis.del(...keys);
        }
      }
    } catch (err) {
      console.warn('⚠️  Redis invalidation error:', (err as Error).message);
    }
  }

  // ── DB ────────────────────────────────────────────────────────
  try {
    if (category) {
      const columnName = DB_COLUMN_MAP[category]!;
      await prisma.cachedProfile.update({
        where: { githubUsername: normalizedUsername },
        data: { [columnName]: null },
      }).catch(() => {}); // Ignore if not found
    } else {
      await prisma.cachedProfile.delete({
        where: { githubUsername: normalizedUsername },
      }).catch(() => {});
    }
  } catch (err) {
    console.warn('⚠️  DB cache invalidation error:', (err as Error).message);
  }
}

/**
 * Cleanup expired DB cache entries.
 * Should be called periodically (e.g. cron job).
 */
export async function cacheCleanupExpired(): Promise<number> {
  const result = await prisma.cachedProfile.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
  return result.count;
}
