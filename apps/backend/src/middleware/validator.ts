// ============================================
// DevScope — Zod Validation Middleware
// ============================================

import type { Request, Response, NextFunction } from 'express';
import { z, type ZodSchema } from 'zod';
import { AppError } from '../types/index.js';

interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

/**
 * Creates Express middleware that validates request body, query, and/or params
 * against Zod schemas. On failure, throws AppError.badRequest with field-level details.
 *
 * Usage:
 *   router.post('/foo', validate({ body: myBodySchema }), handler);
 */
export function validate(schemas: ValidationSchemas) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const errors: Record<string, string[]> = {};

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        for (const issue of result.error.issues) {
          const path = issue.path.join('.') || 'body';
          if (!errors[path]) errors[path] = [];
          errors[path]!.push(issue.message);
        }
      } else {
        req.body = result.data;
      }
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        for (const issue of result.error.issues) {
          const path = `query.${issue.path.join('.')}`;
          if (!errors[path]) errors[path] = [];
          errors[path]!.push(issue.message);
        }
      } else {
        (req as unknown as Record<string, unknown>).query = result.data;
      }
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        for (const issue of result.error.issues) {
          const path = `params.${issue.path.join('.')}`;
          if (!errors[path]) errors[path] = [];
          errors[path]!.push(issue.message);
        }
      } else {
        (req as unknown as Record<string, unknown>).params = result.data;
      }
    }

    if (Object.keys(errors).length > 0) {
      throw AppError.badRequest('Validation failed', errors);
    }

    next();
  };
}

// ── Common Zod schemas used across routes ───────────────────────

export const usernameParamSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .max(39, 'GitHub usernames are max 39 characters')
    .regex(/^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/, 'Invalid GitHub username format'),
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const registerBodySchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters'),
});

export const loginBodySchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const idParamSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});
