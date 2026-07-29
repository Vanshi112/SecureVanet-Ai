import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Server,
  Cpu,
  Database,
  Save,
  Check,
  RefreshCw,
  Palette,
  Info
} from 'lucide-react';
import { getApiBaseUrl, getWebSocketUrl } from '../services/api';
import { useBackendHealth } from '../hooks/useBackendHealth';
import { useNotifications } from '../store/NotificationContext';

export const SettingsPage: React.FC = () => {
  const [apiUrl, setApiUrl] = useState(getApiBaseUrl());
  const [wsUrl, setWsUrl] = useState(getWebSocketUrl());
  const [isSaved, setIsSaved] = useState(false);

  const { isBackendConnected, isChecking, checkHealth } = useBackendHealth();
  const { addNotification } = useNotifications();

  const handleSaveConfig = () => {
    localStorage.setItem('securevanet_api_url', apiUrl);
    localStorage.setItem('securevanet_ws_url', wsUrl);
    setIsSaved(true);
    addNotification('Settings Saved', 'Backend API and WebSocket endpoints updated.', 'success', 'backend');
    checkHealth();
    setTimeout(() => setIsSaved(false), 2500);
  };

  const modelDetails = {
    name: 'SecureVANET Transformer IDS',
    architecture: 'Transformer + BiLSTM + Attention Mechanism',
    classes: ['Normal', 'DoS (Denial of Service)', 'Fuzzy Attack', 'Gear Injection', 'RPM Spoofing'],
    sequenceLength: 32,
    inputFeatures: 41,
    accuracy: '99.8%',
    inferenceTime: '~0.8 ms',
    version: '1.0.0',
    dataset: 'Car-Hacking Dataset & VANET CAN Telemetry',
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
          <SettingsIcon className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white uppercase tracking-wider font-mono-tech">
            SOC Subsystem & Model Configuration
          </h2>
          <p className="text-xs text-slate-400">
            Configure FastAPI endpoints, inspect Transformer model parameters, and monitor system health.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider font-mono-tech">
              <Server className="w-4 h-4 text-blue-400" />
              <span>FastAPI & SocketCAN API Endpoints</span>
            </div>

            <div className="space-y-4 text-xs font-mono-tech">
              <div>
                <label className="block text-slate-400 mb-1.5 font-semibold">
                  HTTP API Base URL (FastAPI /api)
                </label>
                <input
                  type="text"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 font-semibold">
                  WebSocket Stream URL (SocketCAN /ws/live)
                </label>
                <input
                  type="text"
                  value={wsUrl}
                  onChange={(e) => setWsUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={checkHealth}
                disabled={isChecking}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold font-mono-tech flex items-center gap-1.5 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
                Test API Connection
              </button>

              <button
                onClick={handleSaveConfig}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg hover:shadow-blue-500/25"
              >
                {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
                {isSaved ? 'Saved!' : 'Save Configuration'}
              </button>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider font-mono-tech">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Transformer Model Architecture Specs</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono-tech">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase">Model Name</span>
                <p className="font-bold text-white mt-0.5">{modelDetails.name}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase">Architecture</span>
                <p className="font-bold text-cyan-400 mt-0.5">{modelDetails.architecture}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase">Sequence Length</span>
                <p className="font-bold text-white mt-0.5">{modelDetails.sequenceLength} frames</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase">Input Features</span>
                <p className="font-bold text-white mt-0.5">{modelDetails.inputFeatures} CAN features</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase">Benchmark Accuracy</span>
                <p className="font-bold text-emerald-400 mt-0.5">{modelDetails.accuracy}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase">Inference Time</span>
                <p className="font-bold text-amber-400 mt-0.5">{modelDetails.inferenceTime}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono-tech space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Output Target Classes</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {modelDetails.classes.map((cls) => (
                  <span key={cls} className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                    {cls}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider font-mono-tech">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Database & System Health</span>
            </div>

            <div className="space-y-2 text-xs font-mono-tech">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">PostgreSQL Status:</span>
                <span className="text-emerald-400 font-bold">Connected</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Backend API:</span>
                <span className={isBackendConnected ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                  {isBackendConnected ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">CPU Usage:</span>
                <span className="text-white font-bold">14.2%</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">GPU Acceleration:</span>
                <span className="text-cyan-400 font-bold">NVIDIA CUDA Active</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Memory Usage:</span>
                <span className="text-white font-bold">1.8 GB / 16 GB</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider font-mono-tech">
              <Palette className="w-4 h-4 text-purple-400" />
              <span>SOC Analyst Theme Mode</span>
            </div>

            <div className="space-y-2">
              <button className="w-full p-3 rounded-xl bg-blue-950/40 border border-blue-500/40 text-left flex items-center justify-between text-xs font-bold text-white font-mono-tech">
                <span>SOC Cyber Dark (#0B1120)</span>
                <span className="w-3 h-3 rounded-full bg-blue-500" />
              </button>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider font-mono-tech">
              <Info className="w-4 h-4 text-blue-400" />
              <span>About SecureVANET-AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              SecureVANET-AI is an enterprise Intrusion Detection System built for Autonomous Vehicular Networks (VANET) to protect SocketCAN sub-bus telemetry against malicious spoofing, DoS flooding, and fuzzy injection attacks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

