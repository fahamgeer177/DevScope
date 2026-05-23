'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface SearchBarProps {
  size?: 'default' | 'large';
  className?: string;
}

export function SearchBar({ size = 'default', className = '' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = query.trim();
    if (!trimmed) {
      setError('Please enter a GitHub username');
      return;
    }

    // GitHub username validation: alphanumeric + hyphens, 1-39 chars
    const usernameRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
    if (!usernameRegex.test(trimmed)) {
      setError('Invalid GitHub username format. Use letters, numbers, and hyphens.');
      return;
    }

    router.push(`/dashboard/${trimmed}`);
  };

  const isLarge = size === 'large';

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <div className="relative">
        <div className={`relative flex items-center overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg shadow-gray-200/50 transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none dark:focus-within:border-blue-500 dark:focus-within:ring-blue-500/20 ${isLarge ? 'h-16' : 'h-12'}`}>
          {/* Search Icon */}
          <div className={`flex items-center justify-center text-gray-400 ${isLarge ? 'pl-5' : 'pl-4'}`}>
            <svg width={isLarge ? 22 : 18} height={isLarge ? 22 : 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setError(null); }}
            placeholder="Search any GitHub username..."
            className={`flex-1 border-0 bg-transparent outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-gray-500 ${isLarge ? 'px-4 text-lg' : 'px-3 text-sm'}`}
            id="github-search-input"
            autoComplete="off"
            spellCheck={false}
          />

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`mr-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 font-medium text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 ${isLarge ? 'px-6 py-2.5 text-base' : 'px-4 py-2 text-sm'}`}
            id="search-btn"
          >
            Analyze
          </motion.button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-500 dark:text-red-400"
        >
          {error}
        </motion.p>
      )}
    </form>
  );
}
