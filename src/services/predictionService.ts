import { api } from './api';
import { PredictionResponse, HistoryRecord } from '../types';

export const predictionService = {
  async uploadAndPredict(file: File, onUploadProgress?: (progressEvent: any) => void): Promise<PredictionResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<PredictionResponse>('/api/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });

    return response.data;
  },

  async getHistory(): Promise<HistoryRecord[]> {
    const response = await api.get<HistoryRecord[]>('/api/history');
    return response.data;
  },

  async getHealth(): Promise<{ status: string; model: string; version: string }> {
    const response = await api.get<{ status: string; model: string; version: string }>('/api/health');
    return response.data;
  },
};

