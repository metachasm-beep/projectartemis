import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { supabase } from '@/lib/supabase';
import { auth as firebaseAuth } from '@/lib/firebase';

interface RetryConfig extends AxiosRequestConfig {
  _retryCount?: number;
}

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

const _isLocalDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const _envBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Force relative URLs in production because VITE_API_URL points to a dead Vercel deployment.
const cleanBaseURL = _isLocalDev 
  ? (_envBaseUrl.replace(/\/$/, '') + '/api/v1') 
  : '/api/v1';

export const API = axios.create({
  baseURL: cleanBaseURL,
  withCredentials: true,
  timeout: 10000
});

// Request Interceptor: Attach Active Identity Token (Firebase or Supabase)
API.interceptors.request.use(async (config) => {
  try {
    // 1. Try Firebase Token (Phone Auth)
    const firebaseUser = firebaseAuth.currentUser;
    if (firebaseUser) {
      const token = await firebaseUser.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    }

    // 2. Try Supabase Token (Google Auth)
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch (err) {
    console.warn("API_AUTH_SILENT_FAILURE: Could not attach identity token.", err);
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
