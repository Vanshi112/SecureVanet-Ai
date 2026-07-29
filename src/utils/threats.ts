import { ThreatSeverity } from '../types';

export function getSeverityFromAttack(attackType: string, confidence: number): ThreatSeverity {
  const normalized = (attackType || '').toLowerCase();
  if (normalized === 'normal' || normalized === 'none') {
    return 'Normal';
  }
  if (normalized.includes('dos') || normalized.includes('denial')) {
    return confidence > 90 ? 'Critical' : 'High';
  }
  if (normalized.includes('fuzzy')) {
    return confidence > 85 ? 'High' : 'Medium';
  }
  if (normalized.includes('gear') || normalized.includes('rpm')) {
    return confidence > 80 ? 'Medium' : 'Low';
  }
  if (normalized.includes('spoof') || normalized.includes('impersonation')) {
    return 'Critical';
  }
  return 'Medium';
}

export function getSeverityColors(severity: ThreatSeverity = 'Normal') {
  switch (severity) {
    case 'Critical':
      return {
        bg: 'bg-purple-950/60',
        border: 'border-purple-500/50',
        text: 'text-purple-400',
        badgeBg: 'bg-purple-500/10',
        badgeText: 'text-purple-400 border-purple-500/30',
        hex: '#A855F7',
        pulse: 'shadow-[0_0_15px_rgba(168,85,247,0.4)]',
      };
    case 'High':
      return {
        bg: 'bg-red-950/60',
        border: 'border-red-500/50',
        text: 'text-red-400',
        badgeBg: 'bg-red-500/10',
        badgeText: 'text-red-400 border-red-500/30',
        hex: '#EF4444',
        pulse: 'shadow-[0_0_15px_rgba(239,68,68,0.4)]',
      };
    case 'Medium':
      return {
        bg: 'bg-orange-950/60',
        border: 'border-orange-500/50',
        text: 'text-orange-400',
        badgeBg: 'bg-orange-500/10',
        badgeText: 'text-orange-400 border-orange-500/30',
        hex: '#F97316',
        pulse: 'shadow-[0_0_15px_rgba(249,115,22,0.3)]',
      };
    case 'Low':
      return {
        bg: 'bg-amber-950/60',
        border: 'border-amber-500/50',
        text: 'text-amber-400',
        badgeBg: 'bg-amber-500/10',
        badgeText: 'text-amber-400 border-amber-500/30',
        hex: '#EAB308',
        pulse: '',
      };
    case 'Normal':
    default:
      return {
        bg: 'bg-emerald-950/40',
        border: 'border-emerald-500/30',
        text: 'text-emerald-400',
        badgeBg: 'bg-emerald-500/10',
        badgeText: 'text-emerald-400 border-emerald-500/30',
        hex: '#10B981',
        pulse: '',
      };
  }
}

export function getStatusBadge(status: string) {
  const s = (status || '').toLowerCase();
  if (s === 'normal' || s === 'safe' || s === 'clean') {
    return { label: 'Normal', color: 'emerald' };
  }
  if (s === 'attack' || s === 'malicious' || s === 'anomaly') {
    return { label: 'Attack', color: 'red' };
  }
  return { label: 'Warning', color: 'amber' };
}

