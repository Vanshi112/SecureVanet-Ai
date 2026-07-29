import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Activity,
  Cpu,
  Zap,
  Clock,
  Eye,
  Radio,
  FileText
} from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { VehicleStatusGrid } from '../components/can/VehicleStatusGrid';
import { AttackDistributionPie } from '../components/charts/AttackDistributionPie';
import { DetectionTrendLine } from '../components/charts/DetectionTrendLine';
import { TrafficStatusDonut } from '../components/charts/TrafficStatusDonut';
import { Badge } from '../components/ui/Badge';
import { PredictionDetailModal } from '../components/modals/PredictionDetailModal';
import { predictionService } from '../services/predictionService';
import { HistoryRecord } from '../types';
import { getSeverityFromAttack } from '../utils/threats';
import { formatDate, formatPercent } from '../utils/formatters';

export const Dashboard: React.FC = () => {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);

  useEffect(() => {
    async function fetchRecentHistory() {
      try {
        const data = await predictionService.getHistory();
        setHistory(data.slice(0, 5));
      } catch (err) {
        console.warn('Could not fetch history for dashboard table:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRecentHistory();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div className="glass-panel p-5 rounded-2xl border border-blue-500/20 glow-blue flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 text-[10px] font-extrabold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 uppercase tracking-widest">
              SOC Mission Control
            </span>
            <span className="text-xs text-slate-400 font-mono-tech">Autonomous Vehicle V2X Subsystem</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mt-1 font-mono-tech">
            SecureVANET-AI Threat Telemetry
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono-tech">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-slate-300">can0 Interface:</span>
            <span className="text-emerald-400 font-bold">500 kbps</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono-tech">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-300">Transformer:</span>
            <span className="text-cyan-400 font-bold">99.8% Acc</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard
          title="Packets / Sec"
          value="1,420"
          subtitle="Real-time throughput"
          icon={Activity}
          accentColor="blue"
          trend={{ value: "+12%", isPositive: true }}
        />
        <StatCard
          title="Current Threat"
          value="NOMINAL"
          subtitle="Zero critical alerts"
          icon={ShieldCheck}
          accentColor="green"
          badge={<Badge severity="Normal">Normal</Badge>}
        />
        <StatCard
          title="Attacks Detected"
          value="1,240"
          subtitle="Total threat vectors"
          icon={ShieldAlert}
          accentColor="red"
          trend={{ value: "-4.2%", isPositive: true }}
        />
        <StatCard
          title="Model Latency"
          value="0.8 ms"
          subtitle="Sub-millisecond inference"
          icon={Zap}
          accentColor="amber"
        />
        <StatCard
          title="Detection Accuracy"
          value="99.8%"
          subtitle="Transformer + BiLSTM"
          icon={Cpu}
          accentColor="cyan"
          trend={{ value: "99.8%", isNeutral: true }}
        />
        <StatCard
          title="Last Scan Time"
          value="Just Now"
          subtitle="Continuous evaluation"
          icon={Clock}
          accentColor="purple"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono-tech flex items-center gap-2">
            <Radio className="w-4 h-4 text-blue-400" />
            <span>Live Vehicle Subsystem Telemetry (CAN ID Stream)</span>
          </h3>
          <span className="text-[11px] text-emerald-400 font-mono-tech font-semibold">● Vehicle-Node-09 Synchronized</span>
        </div>
        <VehicleStatusGrid
          vehicle={{
            speed: 78.4,
            rpm: 2450,
            brake: false,
            gear: 'D',
            steeringAngle: 1.2,
            busLoad: 28.5,
            lastUpdated: new Date().toISOString(),
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono-tech">
                CAN Traffic & Threat Detection Trend
              </h3>
              <p className="text-xs text-slate-400">Normal vs Anomalous Packets over 24 hours</p>
            </div>
            <Badge status="Normal">Nominal</Badge>
          </div>
          <DetectionTrendLine />
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono-tech">
              Attack Distribution
            </h3>
            <p className="text-xs text-slate-400">Intrusion vectors identified by Transformer</p>
          </div>
          <AttackDistributionPie />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono-tech">
              Traffic Composition
            </h3>
            <p className="text-xs text-slate-400">Overall CAN telemetry health</p>
          </div>
          <TrafficStatusDonut />
        </div>

        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono-tech">
                  Recent Neural Predictions
                </h3>
                <p className="text-xs text-slate-400">Latest dataset evaluation logs from backend</p>
              </div>
              <span className="text-xs text-blue-400 font-semibold">GET /api/history</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-mono-tech border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-3">Filename</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Attack Type</th>
                    <th className="py-3 px-3">Confidence</th>
                    <th className="py-3 px-3">Timestamp</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono-tech">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        Loading backend prediction logs...
                      </td>
                    </tr>
                  ) : history.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        No prediction records found in database
                      </td>
                    </tr>
                  ) : (
                    history.map((record) => {
                      const severity = getSeverityFromAttack(record.attack_type, record.confidence);
                      return (
                        <tr key={record.id} className="hover:bg-slate-900/60 transition-colors">
                          <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-400" />
                            <span className="truncate max-w-[140px]">{record.filename}</span>
                          </td>
                          <td className="py-3 px-3">
                            <Badge status={record.status}>{record.status}</Badge>
                          </td>
                          <td className="py-3 px-3 font-semibold text-slate-200">
                            {record.attack_type}
                          </td>
                          <td className="py-3 px-3 font-bold text-blue-400">
                            {formatPercent(record.confidence)}
                          </td>
                          <td className="py-3 px-3 text-slate-400 text-[11px]">
                            {formatDate(record.created_at)}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => setSelectedRecord(record)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 transition-all"
                              title="Inspect Deep Packet Prediction"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <PredictionDetailModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </div>
  );
};

