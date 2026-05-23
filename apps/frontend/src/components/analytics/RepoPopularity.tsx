'use client';

import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { TopRepo } from '@/lib/types';
import { formatNumber } from '@/lib/utils';

interface RepoPopularityProps {
  data: TopRepo[];
}

const BAR_COLORS = [
  '#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd',
  '#818cf8', '#6d28d9', '#7c3aed', '#9333ea',
  '#a855f7', '#b47bff',
];

export function RepoPopularity({ data }: RepoPopularityProps) {
  const topRepos = data.slice(0, 10).map((r) => ({
    name: r.name.length > 18 ? r.name.substring(0, 16) + '…' : r.name,
    fullName: r.name,
    stars: r.stars,
    forks: r.forks,
  }));

  if (topRepos.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
        <p className="text-sm text-gray-400">No repository data available</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
    >
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        Top Repositories
      </h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topRepos} margin={{ top: 5, right: 5, left: -20, bottom: 5 }} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: 'rgba(148,163,184,0.7)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fill: 'rgba(148,163,184,0.7)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '13px',
              }}
              formatter={(value: any, name: any) => [formatNumber(value), name === 'stars' ? '⭐ Stars' : '🍴 Forks']}
            />
            <Bar dataKey="stars" name="stars" radius={[0, 6, 6, 0]} barSize={16}>
              {topRepos.map((_, index) => (
                <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
