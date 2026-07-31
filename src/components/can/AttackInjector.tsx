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
    <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
          <Zap className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h4 className="text-xs font-extrabold text-white uppercase tracking-wider font-mono-tech">
            Attack Simulation
          </h4>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {attackList.map((item) => (
          <button
            key={item.name}
            onClick={() => onInject(item.name)}
            className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${item.color} ${
              activeAttack === item.name ? 'ring-2 ring-white shadow-lg' : ''
            }`}
          >
            {item.name} 
          </button>
        ))}

        <button
          onClick={onClear}
          className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30 text-xs font-bold font-mono-tech flex items-center gap-1 transition-all"
        >
          <ShieldCheck className="w-4 h-4" />
           Reset
        </button>
      </div>
    </div>
  );
};

