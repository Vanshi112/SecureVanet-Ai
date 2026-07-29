import React from 'react';
import { ThreatSeverity } from '../../types';
import { getSeverityColors } from '../../utils/threats';

interface BadgeProps {
  severity?: ThreatSeverity;
  status?: string;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  severity,
  status,
  children,
  size = 'md',
  className = '',
}) => {
  let colors = {
    badgeBg: 'bg-blue-500/10',
    badgeText: 'text-blue-400 border-blue-500/30',
    hex: '#3B82F6',
    pulse: '',
  };

  if (severity) {
    colors = getSeverityColors(severity);
  } else if (status) {
    const s = status.toLowerCase();
    if (s === 'normal' || s === 'safe' || s === 'green') {
      colors = getSeverityColors('Normal');
    } else if (s === 'attack' || s === 'malicious' || s === 'red') {
      colors = getSeverityColors('High');
    } else if (s === 'warning' || s === 'yellow') {
      colors = getSeverityColors('Medium');
    }
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-sm font-bold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border backdrop-blur-md transition-all ${colors.badgeBg} ${colors.badgeText} ${sizeClasses[size]} ${className}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full animate-pulse"
        style={{ backgroundColor: colors.hex }}
      />
      {children || severity || status}
    </span>
  );
};

