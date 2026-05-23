'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { api, ApiRequestError } from '@/lib/api';
import type { SearchHistoryItem } from '@/lib/types';
import { timeAgo, formatNumber } from '@/lib/utils';

export default function HistoryPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      // Load from localStorage for unauthenticated users
      const stored = localStorage.getItem('devscope_search_history');
      if (stored) {
        try {
          setHistory(JSON.parse(stored));
        } catch { /* ignore */ }
      }
      setIsLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        const response = await api.getSearchHistory();
        if (response.success && response.data) {
          setHistory(response.data);
        }
      } catch (err) {
        if (err instanceof ApiRequestError) {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [isAuthenticated, authLoading]);

  const handleClear = async () => {
    if (!confirm('Clear all search history?')) return;

    if (isAuthenticated) {
      try {
        await api.clearSearchHistory();
        setHistory([]);
      } catch (err) {
        if (err instanceof ApiRequestError) setError(err.message);
      }
    } else {
      localStorage.removeItem('devscope_search_history');
      setHistory([]);
    }
  };

  const handleDelete = async (id: string) => {
    if (isAuthenticated) {
      try {
        await api.deleteSearchEntry(id);
        setHistory((prev) => prev.filter((h) => h.id !== id));
      } catch (err) {
        if (err instanceof ApiRequestError) setError(err.message);
      }
    } else {
      const updated = history.filter((h) => h.id !== id);
      setHistory(updated);
      localStorage.setItem('devscope_search_history', JSON.stringify(updated));
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Search History</h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Your recently analyzed profiles</p>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClear}
              className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-50 dark:border-red-500/20 dark:text-red-400 dark:hover:bg-red-500/10"
              id="clear-history-btn"
            >
              Clear All
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-gray-200 dark:bg-gray-800" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="h-3 w-48 rounded bg-gray-200 dark:bg-gray-800" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-500/20 dark:bg-red-500/10">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-gray-400">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No searches yet</h3>
            <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
              Start by analyzing a GitHub profile on the home page
            </p>
            <Link href="/" className="mt-4 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40">
              Analyze a Profile
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-blue-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-800"
              >
                <Link href={`/dashboard/${item.githubUsername}`} className="flex flex-1 items-center gap-4">
                  {item.resultSnapshot?.avatarUrl ? (
                    <img src={item.resultSnapshot.avatarUrl} alt="" className="h-10 w-10 rounded-xl" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-400 dark:bg-gray-800">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">@{item.githubUsername}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span>{timeAgo(item.searchedAt)}</span>
                      {item.resultSnapshot && (
                        <>
                          <span>•</span>
                          <span>{formatNumber(item.resultSnapshot.publicRepos)} repos</span>
                          <span>•</span>
                          <span>Score: {Math.round(item.resultSnapshot.overallScore)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-500/10"
                  aria-label="Delete"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
