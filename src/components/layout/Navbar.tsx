import React from 'react';
import { Shield, Bell, Cpu, Radio, User } from 'lucide-react';
import { useNotifications } from '../../store/NotificationContext';
import { useBackendHealth } from '../../hooks/useBackendHealth';

interface NavbarProps {
  onToggleNotifications: () => void;
  isWsConnected?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleNotifications, isWsConnected = false }) => {
  const { unreadCount } = useNotifications();
  const { isBackendConnected, backendInfo } = useBackendHealth();

  return (
    <header className="h-16 bg-[#0B1120]/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-30 px-4 lg:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3 lg:gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center glow-blue">
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base tracking-wider text-white font-mono-tech uppercase">
                SecureVANET-AI
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 uppercase tracking-widest hidden sm:inline-block">
                SOC Enterprise
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden md:block">
              Transformer Neural Network IDS for Vehicular V2X Telemetry
            </p>
          </div>
        </div>

        <div className="hidden xl:flex items-center gap-2 pl-4 border-l border-slate-800">
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
              isBackendConnected
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-red-500/10 text-red-400 border-red-500/30 animate-pulse'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isBackendConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'
              }`}
            />
            {isBackendConnected ? (
              <span>Backend Online ({backendInfo?.version || 'v1.0'})</span>
            ) : (
              <span>Backend Disconnected</span>
            )}
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Cpu className="w-3.5 h-3.5" />
            <span>Transformer IDS</span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
              isWsConnected
                ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>SocketCAN {isWsConnected ? 'Active' : 'Standby'}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onToggleNotifications}
          className="relative p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
          title="SOC Event Stream & Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-extrabold flex items-center justify-center animate-bounce shadow-md">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 p-0.5 flex items-center justify-center text-white shadow-inner">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-200">SOC Lead Analyst</p>
            <p className="text-[10px] text-blue-400 font-mono-tech">tier-3-cybersec</p>
          </div>
        </div>
      </div>
    </header>
  );
};

