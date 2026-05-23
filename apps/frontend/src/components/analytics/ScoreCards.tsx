'use client';

import { motion } from 'framer-motion';
import type { DeveloperScores } from '@/lib/types';

interface ScoreCardsProps {
  scores: DeveloperScores;
}

const SCORE_CONFIG = [
  {
    key: 'overallScore' as const,
    label: 'Overall',
    icon: '🏆',
    gradient: 'from-amber-500 to-orange-500',
    glow: 'shadow-amber-500/20',
  },
  {
    key: 'activityScore' as const,
    label: 'Activity',
    icon: '⚡',
    gradient: 'from-blue-500 to-cyan-500',
    glow: 'shadow-blue-500/20',
  },
  {
    key: 'engagementScore' as const,
    label: 'Engagement',
    icon: '🤝',
    gradient: 'from-violet-500 to-purple-500',
    glow: 'shadow-violet-500/20',
  },
  {
    key: 'consistencyScore' as const,
    label: 'Consistency',
    icon: '📊',
    gradient: 'from-emerald-500 to-green-500',
    glow: 'shadow-emerald-500/20',
  },
  {
    key: 'qualityScore' as const,
    label: 'Quality',
    icon: '✨',
    gradient: 'from-pink-500 to-rose-500',
    glow: 'shadow-pink-500/20',
  },
];

function getScoreLabel(score: number): string {
  if (score >= 90) return 'Exceptional';
  if (score >= 75) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Moderate';
  if (score >= 20) return 'Emerging';
  return 'Starting';
}

export function ScoreCards({ scores }: ScoreCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      {SCORE_CONFIG.map((config, i) => {
        const score = scores[config.key];
        return (
          <motion.div
            key={config.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className={`group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-lg transition-all hover:scale-[1.02] hover:${config.glow} dark:border-gray-800 dark:bg-gray-900`}
          >
            {/* Background glow */}
            <div className={`absolute -right-4 -top-4 h-16 w-16 rounded-full bg-gradient-to-br ${config.gradient} opacity-10 blur-2xl transition-opacity group-hover:opacity-20`} />

            <div className="relative">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {config.label}
                </span>
                <span className="text-lg">{config.icon}</span>
              </div>

              <div className="mt-2 flex items-end gap-1">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.08 + 0.3 }}
                  className={`bg-gradient-to-r ${config.gradient} bg-clip-text text-3xl font-bold text-transparent`}
                >
                  {Math.round(score)}
                </motion.span>
                <span className="mb-1 text-xs text-gray-400">/100</span>
              </div>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {getScoreLabel(score)}
              </p>

              {/* Progress bar */}
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                  className={`h-full rounded-full bg-gradient-to-r ${config.gradient}`}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
