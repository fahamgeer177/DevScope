// ============================================
// DevScope — Rate Limiter Middleware
// ============================================

import rateLimit from 'express-rate-limit';
import { config } from '../config/index.js';

/**
 * General API rate limiter.
 */
export const apiLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many requests, please try again later',
    },
    timestamp: new Date().toISOString(),
  },
});

/**
 * Stricter rate limiter for auth endpoints (login/register).
 * 10 attempts per 15-minute window.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many authentication attempts, please try again later',
    },
    timestamp: new Date().toISOString(),
  },
});

/**
 * Rate limiter for GitHub analysis endpoints — heavier operations.
 * 30 requests per 15-minute window.
 */
export const analysisLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many analysis requests, please try again later',
    },
    timestamp: new Date().toISOString(),
  },
});
