// ============================================
// DevScope — JWT Authentication Middleware
// ============================================

import type { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { AppError } from '../types/index.js';
import type { AuthenticatedRequest, JwtPayload } from '../types/index.js';

/**
 * Required auth — rejects with 401 if no valid token.
 */
export function requireAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const token = extractToken(req);

  if (!token) {
    throw AppError.unauthorized('Missing authentication token');
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw AppError.unauthorized('Token has expired');
    }
    if (err instanceof jwt.JsonWebTokenError) {
      throw AppError.unauthorized('Invalid token');
    }
    throw AppError.unauthorized('Authentication failed');
  }
}

/**
 * Optional auth — attaches user if token present, but does not reject.
 */
export function optionalAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const token = extractToken(req);

  if (!token) {
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
    req.user = decoded;
  } catch {
    // Token invalid/expired — just continue without user
  }

  next();
}

/**
 * Extract Bearer token from Authorization header or cookie.
 */
function extractToken(req: AuthenticatedRequest): string | null {
  // 1. Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  // 2. Check cookie
  const cookieToken = (req.cookies as Record<string, string | undefined>)?.accessToken;
  if (cookieToken) {
    return cookieToken;
  }

  return null;
}
