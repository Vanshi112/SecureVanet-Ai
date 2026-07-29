import React, { useState, useEffect } from 'react';
import {
  Search,
  Download,
  Filter,
  ArrowUpDown,
  Eye,
  History as HistoryIcon,
  FileText,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { predictionService } from '../services/predictionService';
import { HistoryRecord } from '../types';
import { Badge } from '../components/ui/Badge';
import { PredictionDetailModal } from '../components/modals/PredictionDetailModal';
import { formatDate, formatPercent, exportToCSV } from '../utils/formatters';
import { getSeverityFromAttack } from '../utils/threats';

export const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'created_at' | 'confidence' | 'filename'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);

  const itemsPerPage = 8;

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const data = await predictionService.getHistory();
      setHistory(data);
    } catch (err) {
      console.warn('History request error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredRecords = history.filter((item) => {
    const matchesSearch =
      item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.attack_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || item.status.toUpperCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'created_at') {
      comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    } else if (sortField === 'confidence') {
      comparison = a.confidence - b.confidence;
    } else if (sortField === 'filename') {
      comparison = a.filename.localeCompare(b.filename);
    }
    return sortOrder === 'desc' ? -comparison : comparison;
  });

  const totalPages = Math.max(1, Math.ceil(sortedRecords.length / itemsPerPage));
  const paginatedRecords = sortedRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExportCSV = () => {
    const exportData = sortedRecords.map(item => ({
      ID: item.id,
      Filename: item.filename,
      Status: item.status,
      AttackType: item.attack_type,
      Confidence: `${item.confidence}%`,
      AttackPercentage: `${item.attack_percentage}%`,
      CreatedAt: item.created_at,
    }));
    exportToCSV(`SecureVANET-AI_History_${Date.now()}.csv`, exportData);
  };

  const toggleSort = (field: 'created_at' | 'confidence' | 'filename') => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <HistoryIcon className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white uppercase tracking-wider font-mono-tech">
              Prediction Audit History
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Historical log of all neural network predictions and uploaded CAN telemetry datasets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchHistory}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all text-xs font-semibold flex items-center gap-1.5"
            title="Refresh History Logs"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            disabled={sortedRecords.length === 0}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-800 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search filename or attack type..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              {['ALL', 'NORMAL', 'ATTACK', 'WARNING'].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1 rounded-lg font-semibold uppercase tracking-wider transition-all ${
                    statusFilter === status
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-mono-tech border-b border-slate-800">
              <tr>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-white"
                  onClick={() => toggleSort('filename')}
                >
                  <div className="flex items-center gap-1">
                    <span>Filename</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Attack Type</th>
                <th className="py-3 px-4">Threat Level</th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-white"
                  onClick={() => toggleSort('confidence')}
                >
                  <div className="flex items-center gap-1">
                    <span>Confidence</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="py-3 px-4 cursor-pointer hover:text-white"
                  onClick={() => toggleSort('created_at')}
                >
                  <div className="flex items-center gap-1">
                    <span>Created Time</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono-tech">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    Fetching evaluation log history from backend database...
                  </td>
                </tr>
              ) : paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No prediction history matches your search query or filter.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((record) => {
                  const severity = getSeverityFromAttack(record.attack_type, record.confidence);
                  return (
                    <tr key={record.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                        <span className="truncate max-w-[180px]">{record.filename}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge status={record.status}>{record.status}</Badge>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-200">
                        {record.attack_type}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge severity={severity}>{severity}</Badge>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-blue-400">
                        {formatPercent(record.confidence)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {formatDate(record.created_at)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedRecord(record)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-all"
                          title="Inspect Deep Prediction Record"
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

        <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
          <div>
            Showing {paginatedRecords.length} of {sortedRecords.length} records
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono-tech">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
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

