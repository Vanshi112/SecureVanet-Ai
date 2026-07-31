import React, { useState } from "react";
import {
  Settings,
  Server,
  Database,
  Save,
  Check,
  RefreshCw,
  Shield,
  Download,
} from "lucide-react";

import { getApiBaseUrl, getWebSocketUrl } from "../services/api";
import { useBackendHealth } from "../hooks/useBackendHealth";
import { useNotifications } from "../store/NotificationContext";

const Toggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative h-6 w-11 rounded-full transition ${
      checked ? "bg-blue-600" : "bg-slate-700"
    }`}
  >
    <span
      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
        checked ? "left-5" : "left-0.5"
      }`}
    />
  </button>
);

export const SettingsPage: React.FC = () => {
  const [apiUrl, setApiUrl] = useState(getApiBaseUrl());
  const [wsUrl, setWsUrl] = useState(getWebSocketUrl());

  const [confidence, setConfidence] = useState(90);
  const [desktopAlerts, setDesktopAlerts] = useState(true);
  const [autoMonitor, setAutoMonitor] = useState(true);

  const [historyLimit, setHistoryLimit] = useState(1000);
  const [saveHistory, setSaveHistory] = useState(true);
  const [exportFormat, setExportFormat] = useState("CSV");

  const [isSaved, setIsSaved] = useState(false);

  const { isBackendConnected, isChecking, checkHealth } =
    useBackendHealth();
  const { addNotification } = useNotifications();

  const handleSaveConfig = () => {
    localStorage.setItem("securevanet_api_url", apiUrl);
    localStorage.setItem("securevanet_ws_url", wsUrl);

    addNotification(
      "Settings Saved",
      "Configuration updated successfully.",
      "success",
      "settings"
    );

    setIsSaved(true);
    checkHealth();
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <Settings className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-slate-400">
            Manage application preferences and IDS behaviour.
          </p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Backend Connection</h2>
        </div>

        <div>
          <label className="text-sm text-slate-400">API URL</label>
          <input value={apiUrl} onChange={(e)=>setApiUrl(e.target.value)}
            className="mt-2 w-full rounded-xl bg-slate-900 border border-slate-800 p-3 text-white"/>
        </div>

        <div>
          <label className="text-sm text-slate-400">WebSocket URL</label>
          <input value={wsUrl} onChange={(e)=>setWsUrl(e.target.value)}
            className="mt-2 w-full rounded-xl bg-slate-900 border border-slate-800 p-3 text-white"/>
        </div>

        <div className="flex justify-between items-center">
          <button onClick={checkHealth}
            className="px-4 py-2 rounded-xl border border-slate-700 flex items-center gap-2">
            <RefreshCw className={`w-4 h-4 ${isChecking ? "animate-spin":""}`}/>
            Test Connection
          </button>

          <span className={isBackendConnected?"text-emerald-400":"text-red-400"}>
            {isBackendConnected?"Backend Online":"Backend Offline"}
          </span>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-400"/>
          <h2 className="text-lg font-semibold text-white">Detection Settings</h2>
        </div>

        <div>
          <div className="flex justify-between">
            <span>Confidence Threshold</span>
            <span>{confidence}%</span>
          </div>
          <input type="range" min={50} max={100} value={confidence}
            onChange={(e)=>setConfidence(Number(e.target.value))}
            className="w-full"/>
        </div>

        <div className="flex justify-between items-center">
          <span>Desktop Notifications</span>
          <Toggle checked={desktopAlerts} onChange={()=>setDesktopAlerts(!desktopAlerts)}/>
        </div>

        <div className="flex justify-between items-center">
          <span>Auto Start Live Monitor</span>
          <Toggle checked={autoMonitor} onChange={()=>setAutoMonitor(!autoMonitor)}/>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Download className="w-5 h-5 text-cyan-400"/>
          <h2 className="text-lg font-semibold text-white">Export Preferences</h2>
        </div>

        <select value={exportFormat} onChange={(e)=>setExportFormat(e.target.value)}
          className="w-full rounded-xl bg-slate-900 border border-slate-800 p-3 text-white">
          <option>CSV</option>
          <option>JSON</option>
        </select>

        <input type="number" value={historyLimit}
          onChange={(e)=>setHistoryLimit(Number(e.target.value))}
          className="w-full rounded-xl bg-slate-900 border border-slate-800 p-3 text-white"/>

        <div className="flex justify-between items-center">
          <span>Save Prediction History</span>
          <Toggle checked={saveHistory} onChange={()=>setSaveHistory(!saveHistory)}/>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-emerald-400"/>
          <h2 className="text-lg font-semibold text-white">System Information</h2>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between"><span>Backend</span><span>{isBackendConnected?"Online":"Offline"}</span></div>
          <div className="flex justify-between"><span>Database</span><span>Connected</span></div>
          <div className="flex justify-between"><span>Model Version</span><span>v1.0.0</span></div>
          <div className="flex justify-between"><span>Last Updated</span><span>July 2026</span></div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSaveConfig}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2">
          {isSaved ? <Check className="w-5 h-5"/> : <Save className="w-5 h-5"/>}
          {isSaved ? "Saved" : "Save Settings"}
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
