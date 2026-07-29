import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UploadCloud,
  History,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
  Car
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
  const navItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: 'Upload Dataset',
      path: '/upload',
      icon: UploadCloud,
      badge: 'CSV',
    },
    {
      name: 'Prediction History',
      path: '/history',
      icon: History,
      badge: null,
    },
    {
      name: 'Live CAN Monitor',
      path: '/live',
      icon: Activity,
      badge: 'LIVE',
      badgeColor: 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse',
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside
      className={`fixed top-16 left-0 bottom-0 z-20 bg-[#0B1120] border-r border-slate-800/80 transition-all duration-300 flex flex-col justify-between ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="p-3 space-y-1.5">
        <div className="mb-4 px-2 pt-2">
          {!isCollapsed ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <Car className="w-4 h-4 text-blue-400" />
              <span>SOC Operations</span>
            </div>
          ) : (
            <div className="flex justify-center text-blue-400">
              <Car className="w-5 h-5" />
            </div>
          )}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`
              }
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />

              {!isCollapsed && (
                <div className="flex items-center justify-between w-full">
                  <span className="truncate">{item.name}</span>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 text-[9px] font-bold rounded border ${
                        item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </div>

      <div className="p-3 border-t border-slate-800/80">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-all border border-slate-800"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          {!isCollapsed && <span className="ml-2 text-xs font-semibold">Collapse Menu</span>}
        </button>
      </div>
    </aside>
  );
};

