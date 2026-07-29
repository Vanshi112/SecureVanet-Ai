import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { SlideoverNotifications } from './components/layout/SlideoverNotifications';
import { BackendOfflineModal } from './components/modals/BackendOfflineModal';
import { Dashboard } from './pages/Dashboard';
import { UploadDataset } from './pages/UploadDataset';
import { HistoryPage } from './pages/History';
import { LiveMonitoring } from './pages/LiveMonitoring';
import { SettingsPage } from './pages/Settings';
import { NotificationProvider, useNotifications } from './store/NotificationContext';
import { useBackendHealth } from './hooks/useBackendHealth';
import { ShieldAlert, CheckCircle } from 'lucide-react';

const AppContent: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isModalDismissed, setIsModalDismissed] = useState(false);

  const { isBackendConnected, isChecking, error, checkHealth } = useBackendHealth();
  const { toast } = useNotifications();

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar
        onToggleNotifications={() => setIsNotificationsOpen(!isNotificationsOpen)}
        isWsConnected={true}
      />

      <div className="flex flex-1 pt-16">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <main
          className={`flex-1 transition-all duration-300 p-4 lg:p-8 min-h-[calc(100vh-4rem)] ${
            isSidebarCollapsed ? 'ml-16' : 'ml-64'
          }`}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<UploadDataset />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/live" element={<LiveMonitoring />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      <SlideoverNotifications
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom duration-300">
          <div
            className={`px-4 py-3 rounded-xl border shadow-2xl flex items-center gap-3 backdrop-blur-md ${
              toast.type === 'critical' || toast.type === 'error'
                ? 'bg-red-950/90 border-red-500/50 text-red-200 glow-red'
                : toast.type === 'warning'
                ? 'bg-amber-950/90 border-amber-500/50 text-amber-200'
                : 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200 glow-green'
            }`}
          >
            {toast.type === 'critical' || toast.type === 'error' ? (
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
            ) : (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
            <div className="text-xs">
              <p className="font-bold">{toast.title}</p>
              <p className="opacity-90">{toast.message}</p>
            </div>
          </div>
        </div>
      )}

      {!isBackendConnected && !isModalDismissed && (
        <BackendOfflineModal
          onRetry={checkHealth}
          isChecking={isChecking}
          error={error}
          onDismiss={() => setIsModalDismissed(true)}
        />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </Router>
  );
};

export default App;

