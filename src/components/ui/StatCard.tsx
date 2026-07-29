import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
  };
  accentColor?: 'blue' | 'cyan' | 'green' | 'red' | 'amber' | 'purple';
  badge?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor = 'blue',
  badge,
}) => {
  const accentStyles = {
    blue: {
      iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      glow: 'hover:border-blue-500/40 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]',
    },
    cyan: {
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      glow: 'hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]',
    },
    green: {
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      glow: 'hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]',
    },
    red: {
      iconBg: 'bg-red-500/10 text-red-400 border-red-500/20',
      glow: 'hover:border-red-500/40 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]',
    },
    amber: {
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      glow: 'hover:border-amber-500/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]',
    },
    purple: {
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      glow: 'hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]',
    },
  }[accentColor];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`glass-panel rounded-xl p-5 border transition-all duration-300 relative overflow-hidden ${accentStyles.glow}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-white tracking-tight font-mono-tech">
              {value}
            </h3>
            {badge && <div>{badge}</div>}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
          )}
        </div>

        <div className={`p-3 rounded-lg border ${accentStyles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center gap-2 text-xs">
          <span
            className={`font-semibold ${
              trend.isNeutral
                ? 'text-slate-400'
                : trend.isPositive
                ? 'text-emerald-400'
                : 'text-red-400'
            }`}
          >
            {trend.value}
          </span>
          <span className="text-slate-500">vs last 24h</span>
        </div>
      )}
    </motion.div>
  );
};

