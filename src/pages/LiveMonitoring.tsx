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
         <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10">
           <Activity className="h-7 w-7 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-semibold text-white">
                Live CAN Monitor
              </h2>
            </div>
           <p className="mt-1 text-sm text-slate-500">
            AI-powered intrusion detection for vehicular CAN networks.
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
            Simulation 
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
            Live Data

            
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">

  {/* Status */}

  <div className="glass-panel rounded-2xl border border-slate-800 p-5">

    <p className="text-sm text-slate-400">
      System Status
    </p>

    <div className="mt-4 flex items-center gap-3">

      <span
        className={`h-3 w-3 rounded-full ${
          mode === "real"
            ? isWsConnected
              ? "bg-green-500 animate-pulse"
              : "bg-red-500"
            : "bg-blue-500"
        }`}
      />

      <span className="text-2xl font-semibold text-white">
        {mode === "real"
          ? isWsConnected
            ? "Online"
            : "Offline"
          : "Simulation"}
      </span>

    </div>

  </div>

  {/* Packets */}

  <div className="glass-panel rounded-2xl border border-slate-800 p-5">

    <p className="text-sm text-slate-400">
      Packets / sec
    </p>

    <h2 className="mt-4 text-3xl font-bold text-blue-400">
      {packetsPerSec.toLocaleString()}
    </h2>

  </div>

  {/* Threat */}

  <div className="glass-panel rounded-2xl border border-slate-800 p-5">

    <p className="text-sm text-slate-400">
      Threat Level
    </p>

    <div className="mt-4">

      <Badge severity={currentThreatLevel}>
        {currentThreatLevel}
      </Badge>

    </div>

  </div>

  {/* Latency */}

  <div className="glass-panel rounded-2xl border border-slate-800 p-5">

    <p className="text-sm text-slate-400">
      Detection Latency
    </p>

    <h2 className="mt-4 text-3xl font-bold text-amber-400">
      {modelLatencyMs} ms
    </h2>

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

