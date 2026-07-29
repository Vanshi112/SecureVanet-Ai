import React from 'react';
import { Zap, RotateCcw, ShieldCheck } from 'lucide-react';
import { AttackType } from '../../types';

interface AttackInjectorProps {
  onInject: (attackType: AttackType) => void;
  onClear: () => void;
  activeAttack: AttackType;
}

export const AttackInjector: React.FC<AttackInjectorProps> = ({
  onInject,
  onClear,
  activeAttack,
}) => {
  const attackList: { name: AttackType; desc: string; color: string }[] = [
    { name: 'DoS', desc: 'Bus Flood 0x0000', color: 'bg-red-500/20 text-red-400 border-red-500/40 hover:bg-red-500/30' },
    { name: 'Fuzzy', desc: 'Random Hex Payload', color: 'bg-orange-500/20 text-orange-400 border-orange-500/40 hover:bg-orange-500/30' },
    { name: 'Gear', desc: 'Gear Impersonation', color: 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30' },
    { name: 'RPM', desc: 'Engine RPM Spoofing', color: 'bg-purple-500/20 text-purple-400 border-purple-500/40 hover:bg-purple-500/30' },
  ];

  return (
    <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-extrabold text-white uppercase tracking-wider font-mono-tech">
            SOC Attack Simulator & Injection Panel
          </h4>
          <p className="text-[11px] text-slate-400">
            Inject synthetic CAN attack vectors to evaluate real-time Transformer IDS detection performance.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {attackList.map((item) => (
          <button
            key={item.name}
            onClick={() => onInject(item.name)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold font-mono-tech transition-all ${item.color} ${
              activeAttack === item.name ? 'ring-2 ring-white shadow-lg' : ''
            }`}
          >
            {item.name} Attack
          </button>
        ))}

        <button
          onClick={onClear}
          className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30 text-xs font-bold font-mono-tech flex items-center gap-1 transition-all"
        >
          <ShieldCheck className="w-4 h-4" />
          Nominal Reset
        </button>
      </div>
    </div>
  );
};

