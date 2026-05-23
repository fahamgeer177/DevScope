'use client';

import { motion } from 'framer-motion';
import type { TopRepo } from '@/lib/types';
import { formatNumber, timeAgo } from '@/lib/utils';

interface RepoCardProps {
  repo: TopRepo;
  index: number;
}

export function RepoCard({ repo, index }: RepoCardProps) {
  return (
    <motion.a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700"
    >
      {/* Health score badge */}
      <div className="absolute right-3 top-3">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
          repo.healthScore >= 80
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
            : repo.healthScore >= 60
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
              : repo.healthScore >= 40
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
        }`}>
          {Math.round(repo.healthScore)}
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600 dark:bg-gray-800 dark:text-gray-400 dark:group-hover:bg-blue-500/10 dark:group-hover:text-blue-400">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="truncate font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
            {repo.name}
          </h4>
          {repo.description && (
            <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
              {repo.description}
            </p>
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {repo.language && (
          <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            {repo.language}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="mt-auto flex items-center gap-4 pt-4 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          {formatNumber(repo.stars)}
        </span>
        <span className="flex items-center gap-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9"/><path d="M12 12v3"/></svg>
          {formatNumber(repo.forks)}
        </span>
        <span className="flex items-center gap-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {repo.issues}
        </span>
        <span className="ml-auto text-gray-400">
          {timeAgo(repo.updatedAt)}
        </span>
      </div>
    </motion.a>
  );
}

interface RepoGridProps {
  repos: TopRepo[];
}

export function RepoGrid({ repos }: RepoGridProps) {
  if (repos.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
        <p className="text-sm text-gray-400">No repositories found</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        Repositories
        <span className="ml-2 text-sm font-normal text-gray-400">({repos.length})</span>
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {repos.map((repo, i) => (
          <RepoCard key={repo.name} repo={repo} index={i} />
        ))}
      </div>
    </motion.div>
  );
}
