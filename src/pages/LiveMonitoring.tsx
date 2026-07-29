import React from 'react';
import {
  Activity,
  Radio,
  Pause,
  Play,
  Cpu,
  BarChart2
} from 'lucide-react';
import { useCANStream } from '../hooks/useCANStream';
import { AlertBanner } from '../components/can/AlertBanner';
import { LiveTerminalConsole } from '../components/can/LiveTerminalConsole';
import { AttackInjector } from '../components/can/AttackInjector';
import { VehicleStatusGrid } from '../components/can/VehicleStatusGrid';
import { RealtimePacketsChart } from '../components/charts/RealtimePacketsChart';
import { AttackDistributionPie } from '../components/charts/AttackDistributionPie';
import { Badge } from '../components/ui/Badge';
import { formatPercent } from '../utils/formatters';

export const LiveMonitoring: React.FC = () => {
  const {
    mode,
    setMode,
    isPaused,
    togglePause,
    packets,
    vehicle,
    totalPacketsCount,
    packetsPerSec,
    currentThreatLevel,
    activeAttackType,
    modelLatencyMs,
    isWsConnected,
    terminalLogs,
    injectAttack,
    clearAttack,
    clearTerminalLogs,
  } = useCANStream();

  return (
    <div className="space-y-6 pb-12">
      <AlertBanner
        threatLevel={currentThreatLevel}
        attackType={activeAttackType}
        onClear={clearAttack}
      />

      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 glow-red">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider font-mono-tech">
                Live CAN Telemetry Stream
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-extrabold rounded bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
                REALTIME IDS
              </span>
            </div>
            <p className="text-xs text-slate-400">
              High-throughput vehicular CAN bus frame evaluation powered by SocketCAN & Transformer AI.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setMode('simulation')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono-tech transition-all flex items-center gap-2 ${
              mode === 'simulation'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-4 h-4" />
            Simulation Mode
          </button>

          <button
            onClick={() => setMode('real')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono-tech transition-all flex items-center gap-2 ${
              mode === 'real'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4" />
            Real Mode (WebSocket /ws/live)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">CAN Interface</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-base font-bold font-mono-tech text-white">can0: ACTIVE</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            {mode === 'real' ? (isWsConnected ? 'SocketCAN /ws/live Connected' : 'Connecting WS...') : 'Simulator Engine'}
          </p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Packets / Sec</p>
          <div className="mt-2 text-xl font-black font-mono-tech text-blue-400">
            {packetsPerSec.toLocaleString()} <span className="text-xs text-slate-400 font-normal">pkts/s</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Bus Utilization 500 kbps</p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Packets Streamed</p>
          <div className="mt-2 text-xl font-black font-mono-tech text-white">
            {totalPacketsCount.toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Evaluated by Transformer</p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Current Threat Status</p>
          <div className="mt-2">
            <Badge severity={currentThreatLevel}>{currentThreatLevel}</Badge>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">{activeAttackType}</p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Model Latency</p>
          <div className="mt-2 text-xl font-black font-mono-tech text-amber-400">
            {modelLatencyMs} <span className="text-xs text-slate-400 font-normal">ms</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Sub-millisecond inference</p>
        </div>
      </div>

      <VehicleStatusGrid vehicle={vehicle} />

      <AttackInjector
        onInject={injectAttack}
        onClear={clearAttack}
        activeAttack={activeAttackType}
      />

      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono-tech flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-blue-400" />
              <span>Live CAN Bus Frames Inspection Stream</span>
            </h3>
            <p className="text-xs text-slate-400">Real-time classification per frame</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={togglePause}
              className={`px-3 py-1.5 rounded-lg border font-mono-tech text-xs font-bold flex items-center gap-1.5 transition-all ${
                isPaused
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              {isPaused ? 'Resume Stream' : 'Pause Stream'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[360px] overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-mono-tech border-b border-slate-800 sticky top-0 z-10">
              <tr>
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3">CAN ID</th>
                <th className="py-2.5 px-3">DLC</th>
                <th className="py-2.5 px-3">Payload (HEX)</th>
                <th className="py-2.5 px-3">Prediction</th>
                <th className="py-2.5 px-3">Attack Type</th>
                <th className="py-2.5 px-3">Threat Severity</th>
                <th className="py-2.5 px-3 text-right">Confidence</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/40 text-slate-300 font-mono-tech">
              {packets.map((pkt) => {
                const isAttack = pkt.prediction === 'Attack' || pkt.severity === 'Critical' || pkt.severity === 'High';
                const isSuspicious = pkt.prediction === 'Suspicious';
                return (
                  <tr
                    key={pkt.id}
                    className={`transition-colors ${
                      isAttack
                        ? 'bg-red-950/40 hover:bg-red-900/60 text-red-200'
                        : isSuspicious
                        ? 'bg-amber-950/30 hover:bg-amber-900/50 text-amber-200'
                        : 'hover:bg-slate-900/60'
                    }`}
                  >
                    <td className="py-2 px-3 text-slate-400 text-[11px]">
                      {pkt.timestamp.split('T')[1]?.slice(0, 8) || pkt.timestamp}
                    </td>
                    <td className="py-2 px-3 font-bold text-cyan-400">{pkt.can_id}</td>
                    <td className="py-2 px-3 text-slate-400">{pkt.dlc}</td>
                    <td className="py-2 px-3 font-mono text-slate-200 tracking-wider">
                      {pkt.payload}
                    </td>
                    <td className="py-2 px-3">
                      <Badge status={pkt.prediction}>{pkt.prediction}</Badge>
                    </td>
                    <td className="py-2 px-3 font-semibold">{pkt.attack_type}</td>
                    <td className="py-2 px-3">
                      <Badge severity={pkt.severity}>{pkt.severity}</Badge>
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-blue-400">
                      {formatPercent(pkt.confidence)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="mb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono-tech">
                Packets per Second Live Timeline
              </h3>
              <p className="text-xs text-slate-400">Real-time CAN bus telemetry frequency (1-second window)</p>
            </div>
            <RealtimePacketsChart packetsPerSec={packetsPerSec} />
          </div>

          <LiveTerminalConsole logs={terminalLogs} onClear={clearTerminalLogs} />
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono-tech">
              Stream Attack Distribution
            </h3>
            <p className="text-xs text-slate-400">Classification share across active stream</p>
          </div>
          <AttackDistributionPie />
        </div>
      </div>
    </div>
  );
};

