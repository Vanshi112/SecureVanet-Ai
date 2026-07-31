import React, { useRef, useEffect } from 'react';
import { Terminal, Trash2 } from 'lucide-react';

interface LiveTerminalConsoleProps {
  logs: string[];
  onClear: () => void;
}

export const LiveTerminalConsole: React.FC<LiveTerminalConsoleProps> = ({ logs, onClear }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="glass-panel rounded-xl border border-slate-800 overflow-hidden flex flex-col h-[240px]">
      <div className="bg-[#0B1120] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800 text-sm font-mono-tech font-bold text-slate-300">
            <Terminal className="w-4 h-4 text-blue-400" />
            <span>System Logs</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClear}
            className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
            title="Clear Logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 bg-slate-950 p-4 font-mono text-sm text-slate-300 overflow-y-auto space-y-2 selection:bg-blue-900 selection:text-white"
      >
        {logs.map((log, idx) => {
          const isAlert = log.includes('[ALERT]') || log.includes('ATTACK');
          return (
            <div
              key={idx}
              className={`leading-relaxed ${
                isAlert ? 'text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20' : 'text-slate-300'
              }`}
            >
              {log}
            </div>
          );
        })}
      </div>
    </div>
  );
};

