import React from 'react';
import { X, Cpu, FileText } from 'lucide-react';
import { HistoryRecord, PredictionResponse } from '../../types';
import { Badge } from '../ui/Badge';
import { formatDate, formatPercent } from '../../utils/formatters';
import { getSeverityFromAttack } from '../../utils/threats';

interface PredictionDetailModalProps {
  record: HistoryRecord | PredictionResponse | null;
  onClose: () => void;
}

export const PredictionDetailModal: React.FC<PredictionDetailModalProps> = ({ record, onClose }) => {
  if (!record) return null;

  const isHistory = 'filename' in record;
  const filename = isHistory ? (record as HistoryRecord).filename : 'Uploaded Dataset';
  const status = record.status;
  const attackType = record.attack_type;
  const confidence = record.confidence;
  const attackPercentage = record.attack_percentage;
  const createdAt = isHistory ? (record as HistoryRecord).created_at : new Date().toISOString();
  const severity = getSeverityFromAttack(attackType, confidence);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="max-w-2xl w-full glass-panel rounded-2xl border border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-[#111827] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono-tech">
                Deep Inspection: {filename}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono-tech">
                Recorded: {formatDate(createdAt)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <p className="text-[10px] font-semibold uppercase text-slate-400">Status</p>
              <div className="mt-1">
                <Badge status={status}>{status}</Badge>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <p className="text-[10px] font-semibold uppercase text-slate-400">Threat Severity</p>
              <div className="mt-1">
                <Badge severity={severity}>{severity}</Badge>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <p className="text-[10px] font-semibold uppercase text-slate-400">Attack Type</p>
              <p className="mt-1 text-sm font-extrabold text-white font-mono-tech">{attackType}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <p className="text-[10px] font-semibold uppercase text-slate-400">AI Confidence</p>
              <p className="mt-1 text-sm font-extrabold text-blue-400 font-mono-tech">
                {formatPercent(confidence)}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>Transformer Model Inference Analysis</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Anomalous Packet Volume:</span>
                <span className="font-bold font-mono-tech text-red-400">
                  {formatPercent(attackPercentage)} of dataset
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Feature Dimensions Extracted:</span>
                <span className="font-bold font-mono-tech text-white">41 CAN Bus Features</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Temporal Sequence Window:</span>
                <span className="font-bold font-mono-tech text-white">32 Frames</span>
              </div>

              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Neural Network Model:</span>
                <span className="font-bold font-mono-tech text-cyan-400">
                  Transformer + BiLSTM + Attention (v1.0)
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

