import React from 'react';
import { Shield, Bell, User } from 'lucide-react';
import { useNotifications } from '../../store/NotificationContext';


interface NavbarProps {
  onToggleNotifications: () => void;
  isWsConnected?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleNotifications, isWsConnected = false }) => {
  const { unreadCount } = useNotifications();

  return (
    <header className="h-16 bg-[#0B1120]/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-30 px-4 lg:px-6 flex items-center justify-between">
      <div className="flex flex-1 items-center gap-3 lg:gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center glow-blue">
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white">
                SecureVANET-AI
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden md:block">
                Real-time Intrusion Detection System
            </p>
          </div>
        </div>
        </div>

       

      <div className="flex items-center gap-3 ml-auto">
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
            <p className="text-xs font-bold text-slate-200">Security Analyst</p>
            <p className="text-[10px] text-blue-400 font-mono-tech"> SOC Operator</p>
          </div>
        </div>
        
        </div>
  
    </header>
  );
};

