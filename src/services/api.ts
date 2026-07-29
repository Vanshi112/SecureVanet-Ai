import axios from 'axios';

export const getApiBaseUrl = (): string => {
  return localStorage.getItem('securevanet_api_url') || 'http://localhost:8000';
};

export const getWebSocketUrl = (): string => {
  const customWs = localStorage.getItem('securevanet_ws_url');
  if (customWs) return customWs;

  const baseUrl = getApiBaseUrl();
  if (baseUrl.startsWith('https://')) {
    return baseUrl.replace('https://', 'wss://') + '/ws/live';
  }
  return baseUrl.replace('http://', 'ws://') + '/ws/live';
};

export const api = axios.create({
  headers: {
    'Accept': 'application/json',
  },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  config.baseURL = getApiBaseUrl();
  return config;
});

