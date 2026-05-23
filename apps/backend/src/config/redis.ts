// ============================================
// DevScope — Redis Client Connection
// ============================================
// ioredis client with reconnection strategy and graceful fallback.

import Redis from 'ioredis';
import { config, isDev } from './index.js';

let redis: Redis | null = null;
let redisAvailable = false;

export function getRedis(): Redis | null {
  return redisAvailable ? redis : null;
}

export function isRedisAvailable(): boolean {
  return redisAvailable;
}

export async function connectRedis(): Promise<void> {
  try {
    redis = new Redis({
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
      password: config.REDIS_PASSWORD || undefined,
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 10) {
          console.warn('⚠️  Redis max retries reached, operating without cache');
          return null; // stop retrying
        }
        return Math.min(times * 200, 5000);
      },
      lazyConnect: true,
    });

    redis.on('connect', () => {
      redisAvailable = true;
      console.log('✅ Redis connected');
    });

    redis.on('error', (err) => {
      if (isDev) {
        console.warn('⚠️  Redis error:', err.message);
      }
      redisAvailable = false;
    });

    redis.on('close', () => {
      redisAvailable = false;
    });

    await redis.connect();
  } catch (error) {
    console.warn('⚠️  Redis connection failed, running without cache:', (error as Error).message);
    redisAvailable = false;
  }
}

export async function disconnectRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
    redisAvailable = false;
    console.log('🔌 Redis disconnected');
  }
}
