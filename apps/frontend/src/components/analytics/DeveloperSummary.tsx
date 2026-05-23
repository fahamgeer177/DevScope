'use client';

import { motion } from 'framer-motion';

interface DeveloperSummaryProps {
  summary: string;
  username: any;
}

export function DeveloperSummary({ summary, username }: DeveloperSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
    >
      {/* Decorative gradient */}
      <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-blue-500/5 to-violet-500/5 blur-3xl" />
      <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 blur-3xl" />

      <div className="relative">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 dark:from-blue-500/20 dark:to-violet-500/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="url(#aiGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
              <defs>
                <linearGradient id="aiGradient" x1="2" y1="2" x2="22" y2="22">
                  <stop stopColor="#3b82f6" />
                  <stop offset="1" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Developer Intelligence Summary
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              AI-generated analysis for @{username}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 p-4 dark:from-gray-800/50 dark:to-gray-800/30">
          <p className="leading-relaxed text-gray-700 dark:text-gray-300">
            {summary}
          </p>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-xs text-gray-400">
            Generated from public GitHub data analysis
          </span>
        </div>
      </div>
    </motion.div>
  );
}
