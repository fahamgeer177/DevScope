'use client';

import { motion } from 'framer-motion';
import { SearchBar } from '@/components/search/SearchBar';

export default function HomePage() {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-blue-500/5 blur-[100px]" />
        <div className="absolute -right-40 top-40 h-80 w-80 rounded-full bg-violet-500/5 blur-[100px]" />
        <div className="absolute bottom-20 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-emerald-500/5 blur-[80px]" />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      {/* Hero Section */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-1.5 text-sm font-medium text-blue-700 backdrop-blur-sm dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
          </span>
          Powered by GitHub API Intelligence
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl dark:text-white"
        >
          Discover developer
          <span className="relative">
            <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 bg-clip-text text-transparent"> intelligence </span>
            <svg
              className="absolute -bottom-2 left-0 w-full"
              viewBox="0 0 300 12"
              fill="none"
            >
              <path
                d="M2 8.5C50 2 100 2 150 6C200 10 250 4 298 8.5"
                stroke="url(#underlineGrad)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="underlineGrad" x1="0" y1="0" x2="300" y2="0">
                  <stop stopColor="#3b82f6" />
                  <stop offset="0.5" stopColor="#8b5cf6" />
                  <stop offset="1" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          beyond the profile
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl dark:text-gray-400"
        >
          Transform any GitHub profile into actionable insights. Analyze skills,
          activity patterns, code quality, and generate AI-powered developer summaries.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 w-full max-w-xl"
        >
          <SearchBar size="large" />
        </motion.div>

        {/* Quick examples */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm"
        >
          <span className="text-gray-400">Try:</span>
          {['torvalds', 'gaearon', 'sindresorhus', 'tj'].map((name) => (
            <a
              key={name}
              href={`/dashboard/${name}`}
              className="rounded-lg border border-gray-200 bg-white/80 px-3 py-1 text-gray-600 transition-all hover:border-blue-300 hover:text-blue-600 dark:border-gray-800 dark:bg-gray-900/80 dark:text-gray-400 dark:hover:border-blue-700 dark:hover:text-blue-400"
            >
              @{name}
            </a>
          ))}
        </motion.div>
      </div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="relative border-t border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/50"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
              More than a profile viewer
            </h2>
            <p className="mt-3 text-gray-500 dark:text-gray-400">
              Unlock deep insights that GitHub profiles don&apos;t show
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-800"
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg`}>
                  <span className="text-xl">{feature.icon}</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <div className="relative border-t border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Ready to explore?
          </h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400">
            Start analyzing any GitHub developer profile in seconds.
          </p>
          <div className="mt-8 flex justify-center">
            <SearchBar />
          </div>
        </div>
      </div>
    </div>
  );
}

const FEATURES = [
  {
    icon: '🔍',
    title: 'Deep Profile Analysis',
    description: 'Go beyond basic stats. Understand a developer\'s specializations, strengths, and contribution patterns with intelligent analysis.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: '📊',
    title: 'Visual Analytics',
    description: 'Beautiful charts and visualizations for language distribution, activity trends, skill radar, and repository popularity.',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: '🧠',
    title: 'AI-Powered Summaries',
    description: 'Get intelligent, natural language summaries of developer profiles generated from their actual GitHub activity and code.',
    gradient: 'from-emerald-500 to-green-500',
  },
  {
    icon: '⚡',
    title: 'Developer Scoring',
    description: 'Multi-dimensional scoring across activity, engagement, consistency, and code quality metrics with detailed breakdowns.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: '🏥',
    title: 'Repo Health Scores',
    description: 'Evaluate repository quality with health scores based on documentation, licensing, activity, and community engagement.',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: '🚀',
    title: 'Smart Caching',
    description: 'Lightning-fast results with intelligent Redis caching. Previously analyzed profiles load instantly from our cache layer.',
    gradient: 'from-indigo-500 to-blue-500',
  },
];
