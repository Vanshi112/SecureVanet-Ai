import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  AlertCircle,
  RefreshCw,
  Download,
  Cpu,
  Zap
} from 'lucide-react';
import { predictionService } from '../services/predictionService';
import { PredictionResponse } from '../types';
import { Badge } from '../components/ui/Badge';
import { formatBytes, formatPercent } from '../utils/formatters';
import { useNotifications } from '../store/NotificationContext';
import { getSeverityFromAttack } from '../utils/threats';

export const UploadDataset: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addNotification } = useNotifications();

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.csv')) {
      setError('Invalid file format. Please upload a valid CAN bus CSV dataset (.csv).');
      return;
    }
    setError(null);
    setFile(selectedFile);
    setResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleUploadAndRun = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setUploadProgress(15);
    setProcessingStage('Uploading dataset...');

    try {
      const data = await predictionService.uploadAndPredict(file, (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 50) / (progressEvent.total || file.size));
        setUploadProgress(percent);
      });

      setUploadProgress(70);
      setProcessingStage('Preparing data...');
      await new Promise(r => setTimeout(r, 600));

      setUploadProgress(90);
      setProcessingStage('Analyzing dataset...');
      await new Promise(r => setTimeout(r, 400));

      setUploadProgress(100);
      setProcessingStage('Inference complete!');
      setResult(data);

      addNotification(
        'CSV Inference Complete',
        `Successfully processed ${file.name}. Result: ${data.status} (${data.attack_type})`,
        data.status === 'Normal' ? 'success' : 'warning',
        'csv'
      );
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Failed to process dataset on backend.');
      addNotification('Upload Failed', 'Unable to analyze the uploaded dataset', 'error', 'backend');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setUploadProgress(0);
    setProcessingStage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownloadReport = () => {
    if (!result || !file) return;
    const reportData = {
      filename: file.name,
      evaluatedAt: new Date().toISOString(),
      status: result.status,
      attackType: result.attack_type,
      attackPercentage: result.attack_percentage,
      confidence: result.confidence,
      packetCounts: result.counts,
      transformerArchitecture: 'Transformer + BiLSTM + Attention (32-seq, 41-feature)',
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SecureVANET-AI_Report_${file.name.replace('.csv', '')}.json`;
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="text-center space-y-2">
      <h2 className="text-3xl font-bold text-white tracking-tight">
        Upload Dataset
      </h2>

      <p className="text-sm text-slate-400 max-w-xl mx-auto">
        Upload a CAN bus telemetry dataset (.csv)
      </p>
    </div>

      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
        {!result && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
              isDragOver
                ? 'border-blue-500 bg-blue-500/10 scale-[1.01]'
                : file
                ? 'border-emerald-500/50 bg-emerald-500/5'
                : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/80'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
            />

            <div className="w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 mx-auto flex items-center justify-center mb-4">
              <UploadCloud className="w-8 h-8" />
            </div>

            {file ? (
              <div className="space-y-1">
                <p className="text-sm font-bold text-white font-mono-tech">{file.name}</p>
                <p className="text-xs text-slate-400">{formatBytes(file.size)} • Click or drag to replace</p>
              </div>
            ) : (
              <div className="space-y-2">
             
              <div className="space-y-3">
              <p className="text-lg font-semibold text-slate-200">
                Drag & drop your CSV file here
              </p>

              <p className="text-sm text-slate-400">
                or
                <span className="ml-1 text-blue-400 hover:text-blue-300 underline cursor-pointer">
                  browse your computer
                </span>
              </p>

              <p className="text-xs text-slate-500">
                Supported format: CSV • Maximum size: 100 MB
              </p>
            </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono-tech flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <div>
              <p className="font-bold uppercase">Evaluation Error</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="space-y-3 p-5 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono-tech">
              <span className="text-blue-400 font-bold flex items-center gap-2">
                <Cpu className="w-4 h-4 animate-spin" />
                {processingStage}
              </span>
              <span className="text-slate-300 font-extrabold">{uploadProgress}%</span>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-mono-tech">Analysis Results</span>
                    <Badge status={result.status}>{result.status}</Badge>
                    <Badge severity={getSeverityFromAttack(result.attack_type, result.confidence)}>
                      {getSeverityFromAttack(result.attack_type, result.confidence)}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-white mt-1 font-mono-tech">
                    Primary Signature: {result.attack_type}
                  </h3>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-400">Prediction Confidence</p>
                  <p className="text-2xl font-black text-blue-400 font-mono-tech">
                    {formatPercent(result.confidence)}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono-tech">
                  Packet Categorization Breakdown
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {Object.entries(result.counts || {}).map(([key, count]) => {
                    const isNormal = key.toLowerCase() === 'normal';
                    return (
                      <div
                        key={key}
                        className={`p-3 rounded-xl border text-center font-mono-tech ${
                          isNormal
                            ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                            : 'bg-red-950/30 border-red-500/30 text-red-300'
                        }`}
                      >
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">{key}</p>
                        <p className="text-lg font-bold mt-0.5">{count.toLocaleString()}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          {file && !result && (
            <button
              onClick={handleUploadAndRun}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg hover:shadow-blue-500/25 disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              Analyze Dataset
            </button>
          )}

          {result && (
            <>
              <button
                onClick={handleDownloadReport}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
              >
                <Download className="w-4 h-4" />
                Download Report
              </button>

              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Reset & Upload New
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

