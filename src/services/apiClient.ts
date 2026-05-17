import axios, { AxiosError, AxiosRequestConfig } from 'axios';

interface RetryConfig extends AxiosRequestConfig {
  _retryCount?: number;
}

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

const rawApiUrl = import.meta.env.VITE_API_URL || '/api/v1';
const cleanBaseURL = rawApiUrl.endsWith('/api/v1') 
  ? rawApiUrl 
  : `${rawApiUrl.replace(/\/$/, '')}/api/v1`;

export const API = axios.create({
  baseURL: cleanBaseURL,
  withCredentials: true,
  timeout: 10000
});

// Request Interceptor: Attach JWT Token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response Interceptor: Offline Queue & Retry Mechanism
API.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryConfig;
    
    // If config does not exist or retry count exceeds maximum, reject
    if (!config || (config._retryCount || 0) >= MAX_RETRIES) {
      return Promise.reject(error);
    }

    // Check if error is network related (offline or 5xx server error)
    const isNetworkError = !error.response || error.response.status >= 500;
    if (isNetworkError) {
      config._retryCount = (config._retryCount || 0) + 1;
      console.warn(`[API Client] Network failure detected. Retrying request (${config._retryCount}/${MAX_RETRIES}) in ${RETRY_DELAY_MS}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * config._retryCount));
      return API(config);
    }

    return Promise.reject(error);
  }
);
