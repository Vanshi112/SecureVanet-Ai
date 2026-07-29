import React, { useState } from 'react';
import { AlertTriangle, Volume2, VolumeX, ShieldAlert, X } from 'lucide-react';
import { ThreatSeverity, AttackType } from '../../types';
import { getSeverityColors } from '../../utils/threats';

interface AlertBannerProps {
  threatLevel: ThreatSeverity;
  attackType: AttackType;
  onClear: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ threatLevel, attackType, onClear }) => {
  const [isMuted, setIsMuted] = useState(false);

  if (threatLevel === 'Normal') return null;

  const colors = getSeverityColors(threatLevel);

  return (
    <div
      className={`w-full p-4 rounded-xl border ${colors.bg} ${colors.border} ${colors.pulse} animate-pulse-slow flex items-center justify-between mb-6 transition-all duration-300`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-lg bg-red-500/20 border border-red-500/40 ${colors.text}`}>
          <ShieldAlert className="w-6 h-6 animate-bounce" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-red-400 bg-red-500/20 px-2 py-0.5 rounded border border-red-500/40">
              CRITICAL IDS ALERT
            </span>
            <span className="text-xs font-bold font-mono-tech text-white uppercase">
              THREAT LEVEL: {threatLevel}
            </span>
          </div>
          <h4 className="text-sm font-extrabold text-white mt-1">
            Anomalous {attackType} Intrusion Signature Active on Vehicular CAN Bus!
          </h4>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-all text-xs font-semibold flex items-center gap-1.5"
          title={isMuted ? 'Unmute Threat Alarm' : 'Mute Threat Alarm'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Audio Alert'}</span>
        </button>

        <button
          onClick={onClear}
          className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all"
        >
          <X className="w-4 h-4" />
          Acknowledge Alert
        </button>
      </div>
    </div>
  );
};

