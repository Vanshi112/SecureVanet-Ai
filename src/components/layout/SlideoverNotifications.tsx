import React, { useState } from 'react';
import { X, CheckCheck, Trash2, Bell, ShieldAlert, Cpu, Database, Radio, FileSpreadsheet } from 'lucide-react';
import { useNotifications } from '../../store/NotificationContext';
import { formatDate } from '../../utils/formatters';
import { NotificationCategory } from '../../types';

interface SlideoverNotificationsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SlideoverNotifications: React.FC<SlideoverNotificationsProps> = ({ isOpen, onClose }) => {
  const { notifications, markAsRead, markAllAsRead, clearNotifications } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'critical' | 'attacks'>('all');

  if (!isOpen) return null;

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'attack':
        return <ShieldAlert className="w-4 h-4 text-red-400" />;
      case 'model':
        return <Cpu className="w-4 h-4 text-cyan-400" />;
      case 'database':
        return <Database className="w-4 h-4 text-emerald-400" />;
      case 'can':
        return <Radio className="w-4 h-4 text-purple-400" />;
      case 'csv':
        return <FileSpreadsheet className="w-4 h-4 text-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-blue-400" />;
    }
  };

  const filtered = notifications.filter(n => {
    if (filter === 'critical') return n.type === 'critical' || n.type === 'error';
    if (filter === 'attacks') return n.category === 'attack';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-[#0B1120] border-l border-slate-800 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#111827]">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-400" />
            <h2 className="font-bold text-sm text-white uppercase tracking-wider">
              SOC Event Audit Stream
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 border-b border-slate-800/80 bg-slate-950 flex items-center justify-between">
          <div className="flex gap-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 text-xs font-semibold rounded ${
                filter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-900'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('attacks')}
              className={`px-2.5 py-1 text-xs font-semibold rounded ${
                filter === 'attacks' ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-slate-900'
              }`}
            >
              Attacks
            </button>
            <button
              onClick={() => setFilter('critical')}
              className={`px-2.5 py-1 text-xs font-semibold rounded ${
                filter === 'critical' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-slate-900'
              }`}
            >
              Critical
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={markAllAsRead}
              className="text-slate-400 hover:text-emerald-400 flex items-center gap-1"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={clearNotifications}
              className="text-slate-400 hover:text-red-400 flex items-center gap-1"
              title="Clear all logs"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-xs font-semibold">No SOC event logs recorded</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => markAsRead(item.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  item.read
                    ? 'bg-slate-900/40 border-slate-800/60 opacity-75'
                    : 'bg-slate-900 border-slate-700/80 shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-2 rounded-lg bg-slate-800 border border-slate-700">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                      <span className="text-[10px] text-slate-500 font-mono-tech whitespace-nowrap">
                        {formatDate(item.timestamp)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-300 leading-relaxed">{item.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

