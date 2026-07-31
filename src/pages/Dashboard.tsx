import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Activity,
  Zap,
  Eye,
  FileText,
} from "lucide-react";

import { StatCard } from "../components/ui/StatCard";
import { VehicleStatusGrid } from "../components/can/VehicleStatusGrid";
import { AttackDistributionPie } from "../components/charts/AttackDistributionPie";
import { DetectionTrendLine } from "../components/charts/DetectionTrendLine";
import { TrafficStatusDonut } from "../components/charts/TrafficStatusDonut";
import { Badge } from "../components/ui/Badge";
import { PredictionDetailModal } from "../components/modals/PredictionDetailModal";

import { predictionService } from "../services/predictionService";

import { HistoryRecord } from "../types";
import { getSeverityFromAttack } from "../utils/threats";
import { formatDate, formatPercent } from "../utils/formatters";

export const Dashboard: React.FC = () => {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] =
    useState<HistoryRecord | null>(null);

  useEffect(() => {
    async function fetchRecentHistory() {
      try {
        const data = await predictionService.getHistory();
        setHistory(data.slice(0, 5));
      } catch (err) {
        console.warn(
          "Could not fetch dashboard history:",
          err
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecentHistory();
  }, []);

  return (
    <div className="space-y-8 pb-12">

    
      {/* ================= KPI ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatCard
          title="Packets / Sec"
          value="1,420"
          subtitle="Current throughput"
          icon={Activity}
          accentColor="blue"
          trend={{
            value: "+12%",
            isPositive: true,
          }}
        />

        <StatCard
          title="Threat Status"
          value="Normal"
          subtitle="No active attacks"
          icon={ShieldCheck}
          accentColor="green"
          badge={
            <Badge severity="Normal">
              Normal
            </Badge>
          }
        />

        <StatCard
          title="Detections Today"
          value="1,240"
          subtitle="Processed events"
          icon={ShieldAlert}
          accentColor="red"
          trend={{
            value: "-4.2%",
            isPositive: true,
          }}
        />

        <StatCard
          title="Inference Latency"
          value="0.8 ms"
          subtitle="Average prediction time"
          icon={Zap}
          accentColor="amber"
        />

      </div>

      {/* ========= VEHICLE TELEMETRY STARTS BELOW ========= */}
            {/* ================= Vehicle Telemetry ================= */}

      <div className="space-y-4">

        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-xl font-semibold text-white">
              Vehicle Telemetry
            </h2>

            <p className="text-slate-400 text-sm mt-1">
              Live CAN bus metrics
            </p>
          </div>

          <Badge status="Normal">
            Vehicle Online
          </Badge>

        </div>

        <VehicleStatusGrid
          vehicle={{
            speed: 78.4,
            rpm: 2450,
            brake: false,
            gear: "D",
            steeringAngle: 1.2,
            busLoad: 28.5,
            lastUpdated: new Date().toISOString(),
          }}
        />

      </div>

      {/* ================= Charts ================= */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Traffic Overview */}

        <div className="xl:col-span-2 glass-panel rounded-2xl border border-slate-800 p-6">

          <div className="mb-6">

            <h2 className="text-xl font-semibold text-white">
              Traffic Overview
            </h2>

            <p className="text-slate-400 text-sm mt-1">
              Real-time CAN traffic analysis
            </p>

          </div>

          <DetectionTrendLine />

        </div>

        {/* Threat Distribution */}

        <div className="glass-panel rounded-2xl border border-slate-800 p-6">

          <div className="mb-6">

            <h2 className="text-xl font-semibold text-white">
              Threat Distribution
            </h2>

            <p className="text-slate-400 text-sm mt-1">
              Detected attack categories
            </p>

          </div>

          <AttackDistributionPie />

        </div>

      </div>

      {/* ================= Traffic Summary ================= */}

      <div className="glass-panel rounded-2xl border border-slate-800 p-6">

        <div className="mb-6">

          <h2 className="text-xl font-semibold text-white">
            Traffic Summary
          </h2>

          <p className="text-slate-400 text-sm mt-1">
            Overall network health
          </p>

        </div>

        <TrafficStatusDonut />

      </div>

      {/* ================= Recent Analyses ================= */}
            {/* ================= Recent Analyses ================= */}

      <div className="glass-panel rounded-2xl border border-slate-800 p-6">

        <div className="flex items-center justify-between mb-6">

          <div>
            <h2 className="text-xl font-semibold text-white">
              Recent Analyses
            </h2>

            <p className="text-slate-400 text-sm mt-1">
              Latest intrusion detection results
            </p>
          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-slate-800 text-slate-400 text-sm">

                <th className="text-left py-3">Dataset</th>

                <th className="text-left py-3">Status</th>

                <th className="text-left py-3">Threat</th>

                <th className="text-left py-3">Confidence</th>

                <th className="text-left py-3">Analyzed At</th>

                <th className="text-right py-3">View</th>

              </tr>

            </thead>

            <tbody>

              {isLoading ? (

                <tr>

                  <td
                    colSpan={6}
                    className="text-center py-12 text-slate-500"
                  >
                    Loading analyses...
                  </td>

                </tr>

              ) : history.length === 0 ? (

                <tr>

                  <td
                    colSpan={6}
                    className="text-center py-12 text-slate-500"
                  >
                    No analyses available.
                  </td>

                </tr>

              ) : (

                history.map((record) => {

                  const severity = getSeverityFromAttack(
                    record.attack_type,
                    record.confidence
                  );

                  return (

                    <tr
                      key={record.id}
                      className="border-b border-slate-800 hover:bg-slate-900/40 transition"
                    >

                      <td className="py-4 font-medium text-white">

                        <div className="flex items-center gap-2">

                          <FileText className="w-4 h-4 text-blue-400" />

                          <span className="truncate max-w-[170px]">
                            {record.filename}
                          </span>

                        </div>

                      </td>

                      <td className="py-4">

                        <Badge status={record.status}>
                          {record.status}
                        </Badge>

                      </td>

                      <td className="py-4">

                        <Badge severity={severity}>
                          {record.attack_type}
                        </Badge>

                      </td>

                      <td className="py-4 font-semibold text-blue-400">

                        {formatPercent(record.confidence)}

                      </td>

                      <td className="py-4 text-slate-400 text-sm">

                        {formatDate(record.created_at)}

                      </td>

                      <td className="py-4 text-right">

                        <button
                          onClick={() => setSelectedRecord(record)}
                          className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-blue-600 transition"
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

      <PredictionDetailModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />

    </div>

  );

};

export default Dashboard;