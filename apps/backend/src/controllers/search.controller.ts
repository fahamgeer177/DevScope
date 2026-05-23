// ============================================
// DevScope — Search History Controller
// ============================================

import type { Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { AppError } from '../types/index.js';
import type { AuthenticatedRequest } from '../types/index.js';
import type { SearchHistoryItem } from '@devscope/shared';

/**
 * GET /api/search/history
 * Returns paginated search history for the authenticated user.
 */
export async function getHistory(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) throw AppError.unauthorized();

    const { page, limit } = req.query as unknown as { page: number; limit: number };
    const skip = (page - 1) * limit;

    const [searches, total] = await Promise.all([
      prisma.search.findMany({
        where: { userId: req.user.userId },
        orderBy: { searchedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.search.count({
        where: { userId: req.user.userId },
      }),
    ]);

    const data: SearchHistoryItem[] = searches.map((s) => ({
      id: s.id,
      githubUsername: s.githubUsername,
      searchedAt: s.searchedAt.toISOString(),
      resultSnapshot: s.resultSnapshot as SearchHistoryItem['resultSnapshot'],
    }));

    res.status(200).json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/search/history/:id
 * Delete a specific search history entry.
 */
export async function deleteHistoryItem(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) throw AppError.unauthorized();

    const { id } = req.params as { id: string };

    // Verify ownership
    const search = await prisma.search.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!search) {
      throw AppError.notFound('Search history entry not found');
    }

    if (search.userId !== req.user.userId) {
      throw AppError.forbidden('You can only delete your own search history');
    }

    await prisma.search.delete({ where: { id } });

    res.status(200).json({
      success: true,
      data: null,
      message: 'Search history entry deleted',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/search/history
 * Clear all search history for the authenticated user.
 */
export async function clearHistory(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) throw AppError.unauthorized();

    const result = await prisma.search.deleteMany({
      where: { userId: req.user.userId },
    });

    res.status(200).json({
      success: true,
      data: { deletedCount: result.count },
      message: `Cleared ${result.count} search history entries`,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
}
