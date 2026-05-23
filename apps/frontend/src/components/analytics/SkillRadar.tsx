'use client';

import { motion } from 'framer-motion';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { SkillScore } from '@/lib/types';

interface SkillRadarProps {
  data: SkillScore[];
}

export function SkillRadar({ data }: SkillRadarProps) {
  // Take top 8 skills for radar
  const topSkills = data.slice(0, 8).map((s) => ({
    skill: s.skill,
    score: s.score,
    fullMark: 100,
  }));

  if (topSkills.length < 3) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
        <p className="text-sm text-gray-400">Not enough skills detected for radar visualization</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
    >
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        Skill Radar
      </h3>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={topSkills}>
            <PolarGrid
              stroke="rgba(148, 163, 184, 0.2)"
              strokeDasharray="3 3"
            />
            <PolarAngleAxis
              dataKey="skill"
              tick={{
                fill: 'rgba(148, 163, 184, 0.8)',
                fontSize: 11,
              }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />
            <Radar
              name="Skill Level"
              dataKey="score"
              stroke="#6366f1"
              fill="url(#radarGradient)"
              fillOpacity={0.5}
              strokeWidth={2}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '13px',
              }}
              formatter={(value: any) => [`${value}/100`, 'Skill Level']}
            />
            <defs>
              <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.3} />
              </linearGradient>
            </defs>
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
