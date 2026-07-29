import { useState, useEffect, useCallback } from 'react';
import { predictionService } from '../services/predictionService';
import { useNotifications } from '../store/NotificationContext';

export interface BackendHealthState {
  isBackendConnected: boolean;
  isChecking: boolean;
  backendInfo: { status: string; model: string; version: string } | null;
  lastChecked: Date | null;
  error: string | null;
}

export function useBackendHealth(pollIntervalMs = 15000) {
  const [state, setState] = useState<BackendHealthState>({
    isBackendConnected: false,
    isChecking: true,
    backendInfo: null,
    lastChecked: null,
    error: null,
  });

  const { addNotification } = useNotifications();

  const checkHealth = useCallback(async () => {
    setState(prev => ({ ...prev, isChecking: true }));
    try {
      const res = await predictionService.getHealth();
      setState(prev => {
        if (!prev.isBackendConnected) {
          addNotification('Backend Connected', `SecureVANET-AI server online (${res.model} v${res.version})`, 'success', 'backend');
        }
        return {
          isBackendConnected: true,
          isChecking: false,
          backendInfo: res,
          lastChecked: new Date(),
          error: null,
        };
      });
    } catch (err: any) {
      setState(prev => {
        if (prev.isBackendConnected) {
          addNotification('Backend Disconnected', 'Lost connection to FastAPI server. Retrying...', 'error', 'backend');
        }
        return {
          isBackendConnected: false,
          isChecking: false,
          backendInfo: null,
          lastChecked: new Date(),
          error: err?.message || 'Server unreachable',
        };
      });
    }
  }, [addNotification]);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, pollIntervalMs);
    return () => clearInterval(interval);
  }, [checkHealth, pollIntervalMs]);

  return {
    ...state,
    checkHealth,
  };
}

