'use client';

import { motion } from 'framer-motion';

export function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      {/* Profile Card Skeleton */}
      <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="h-24 w-24 rounded-2xl bg-gray-200 dark:bg-gray-800" />
          <div className="flex-1 space-y-3 text-center sm:text-left">
            <div className="mx-auto h-7 w-48 rounded-lg bg-gray-200 sm:mx-0 dark:bg-gray-800" />
            <div className="mx-auto h-4 w-72 rounded-lg bg-gray-200 sm:mx-0 dark:bg-gray-800" />
            <div className="flex justify-center gap-3 sm:justify-start">
              <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-28 rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center rounded-xl border border-gray-100 bg-gray-50/50 p-3 dark:border-gray-800 dark:bg-gray-800/50">
              <div className="mb-1 h-4 w-4 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-6 w-12 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="mt-1 h-3 w-16 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
        </div>
      </div>

      {/* Summary Skeleton */}
      <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 h-5 w-40 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-4/6 rounded bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>

      {/* Score Cards Skeleton */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="animate-pulse rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="mb-2 h-4 w-20 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-8 w-16 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800" />
          </motion.div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-4 h-5 w-32 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-64 rounded-xl bg-gray-100 dark:bg-gray-800/50" />
          </div>
        ))}
      </div>
    </div>
  );
}
