import React from 'react';
import { ServerOff, RefreshCw, AlertOctagon, Terminal, X, Eye } from 'lucide-react';
import { getApiBaseUrl } from '../../services/api';

interface BackendOfflineModalProps {
  onRetry: () => void;
  isChecking: boolean;
  error?: string | null;
  onDismiss?: () => void;
}

export const BackendOfflineModal: React.FC<BackendOfflineModalProps> = ({
  onRetry,
  isChecking,
  error,
  onDismiss,
}) => {
  const backendUrl = getApiBaseUrl();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="max-w-md w-full glass-panel rounded-2xl p-6 border border-red-500/40 glow-red text-center relative overflow-hidden">
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-all"
            title="Dismiss & Explore UI"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 mx-auto flex items-center justify-center mb-4">
          <ServerOff className="w-8 h-8 animate-pulse" />
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight uppercase font-mono-tech">
          Backend Service Offline
        </h3>

        <p className="mt-2 text-xs text-slate-300 leading-relaxed">
          The SecureVANET-AI FastAPI backend server at{' '}
          <code className="px-1.5 py-0.5 rounded bg-slate-900 text-blue-400 font-mono-tech border border-slate-800">
            {backendUrl}
          </code>{' '}
          is currently unreachable.
        </p>

        {error && (
          <div className="mt-3 p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-left text-xs font-mono-tech text-red-300 flex items-start gap-2">
            <AlertOctagon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="break-all">{error}</span>
          </div>
        )}

        <div className="mt-4 p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-left text-[11px] text-slate-400 font-mono-tech space-y-1">
          <div className="text-slate-300 font-semibold flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            To start backend server run in terminal:
          </div>
          <div className="text-emerald-400 selection:bg-emerald-900">
            cd backend && uvicorn app.main:app --reload --port 8000
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onRetry}
            disabled={isChecking}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-500/25 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? 'Reconnecting to API...' : 'Retry Connection'}
          </button>

          {onDismiss && (
            <button
              onClick={onDismiss}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              <Eye className="w-4 h-4 text-cyan-400" />
              Explore UI Demo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

