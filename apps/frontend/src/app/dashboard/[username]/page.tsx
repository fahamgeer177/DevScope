'use client';

import { useEffect, useState, use } from 'react';
import { motion } from 'motion/react';
import { api, ApiRequestError } from '@/lib/api';
import type { DeveloperAnalytics } from '@/lib/types';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { ProfileSkeleton } from '@/components/profile/ProfileSkeleton';
import { ScoreCards } from '@/components/analytics/ScoreCards';
import { DeveloperSummary } from '@/components/analytics/DeveloperSummary';
import { LanguageChart } from '@/components/analytics/LanguageChart';
import { SkillRadar } from '@/components/analytics/SkillRadar';
import { ActivityChart } from '@/components/analytics/ActivityChart';
import { RepoPopularity } from '@/components/analytics/RepoPopularity';
import { RepoGrid } from '@/components/repos/RepoGrid';
import { SearchBar } from '@/components/search/SearchBar';

interface DashboardPageProps {
  params: Promise<{ username: string }>;
}

export default function DashboardPage({ params }: DashboardPageProps) {
  const { username } = use(params);
  const [data, setData] = useState<DeveloperAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<{ code: string; message: string } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.analyzeProfile(username);
        if (response.success && response.data) {
          setData(response.data);
        }
      } catch (err) {
        if (err instanceof ApiRequestError) {
          setError({ code: err.code, message: err.message });
        } else {
          setError({
            code: 'UNKNOWN',
            message: 'An unexpected error occurred. Please try again.',
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  // Loading State
  if (isLoading) {
    return <ProfileSkeleton />;
  }

  // Error State
  if (error) {
    return <ErrorState error={error} username={username} />;
  }

  // No Data State
  if (!data) {
    return <ErrorState error={{ code: 'NO_DATA', message: 'No data returned for this profile.' }} username={username} />;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Search bar at top */}
      <SearchBar />

      {/* Profile Card */}
      <ProfileCard data={data} />

      {/* Developer Summary */}
      <DeveloperSummary summary={data.summary} username={data.username} />

      {/* Score Cards */}
      <ScoreCards scores={data.scores} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LanguageChart data={data.languages} />
        <SkillRadar data={data.skills} />
        <ActivityChart data={data.contributionTrends} />
        <RepoPopularity data={data.topRepos} />
      </div>

      {/* Repositories Grid */}
      <RepoGrid repos={data.topRepos} />

      {/* Generated timestamp */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pb-8 text-center text-xs text-gray-400 dark:text-gray-500"
      >
        Analysis generated at {new Date(data.generatedAt).toLocaleString()} •
        Data sourced from GitHub public API
      </motion.p>
    </div>
  );
}

function ErrorState({
  error,
  username,
}: {
  error: { code: string; message: string };
  username: string;
}) {
  const isNotFound = error.code === 'USER_NOT_FOUND' || error.code === 'NOT_FOUND';
  const isRateLimited = error.code === 'RATE_LIMITED';

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-500/10"
      >
        <span className="text-4xl">
          {isNotFound ? '🔍' : isRateLimited ? '⏳' : '⚠️'}
        </span>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-2xl font-bold text-gray-900 dark:text-white"
      >
        {isNotFound
          ? `User "${username}" not found`
          : isRateLimited
            ? 'Rate limit reached'
            : 'Something went wrong'}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-3 max-w-md text-gray-500 dark:text-gray-400"
      >
        {error.message}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 w-full max-w-md"
      >
        <SearchBar />
      </motion.div>

      {isRateLimited && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-sm text-amber-600 dark:text-amber-400"
        >
          💡 Tip: Configure a GitHub Personal Access Token to increase your rate limit to 5,000 requests/hour.
        </motion.p>
      )}
    </div>
  );
}
