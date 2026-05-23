// ============================================
// DevScope — Global Error Handler Middleware
// ============================================

import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../types/index.js';
import { isDev } from '../config/index.js';

/**
 * Global error handler — must be the LAST middleware registered.
 * Catches AppError (operational) vs unexpected errors and returns
 * a consistent JSON envelope.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // ── Operational (expected) errors ─────────────────────────────
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // ── Prisma known errors ───────────────────────────────────────
  if (err.constructor?.name === 'PrismaClientKnownRequestError') {
    const prismaErr = err as unknown as { code: string; meta?: Record<string, unknown> };

    if (prismaErr.code === 'P2002') {
      res.status(409).json({
        success: false,
        error: {
          code: 'CONFLICT',
          message: 'A record with this value already exists',
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (prismaErr.code === 'P2025') {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Record not found',
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }
  }

  // ── JSON parse errors ─────────────────────────────────────────
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message: 'Invalid JSON in request body',
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // ── Unexpected errors ─────────────────────────────────────────
  console.error('💥 Unhandled error:', err);

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: isDev ? err.message : 'An unexpected error occurred',
      ...(isDev ? { stack: err.stack } : {}),
    },
    timestamp: new Date().toISOString(),
  });
}

/**
 * 404 catch-all — registered AFTER all routes.
 */
export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route not found: ${_req.method} ${_req.originalUrl}`,
    },
    timestamp: new Date().toISOString(),
  });
}
