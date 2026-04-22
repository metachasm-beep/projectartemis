import axios from 'axios';
import { supabase } from '@/lib/supabase';

let rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
if (!rawBaseUrl.endsWith('/api/v1')) {
  rawBaseUrl = rawBaseUrl.replace(/\/$/, '') + '/api/v1';
}
const API_BASE_URL = rawBaseUrl;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🛡️ AUTH_INTERCEPTOR: Automatically inject the Supabase token into all backend requests
apiClient.interceptors.request.use(async (config) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch (err) {
    console.warn("API_AUTH_SILENT_FAILURE: Could not attach session token.", err);
  }
  return config;
});

export const api = {
  getRankStatus: async (userId: string) => {
    try {
      const response = await apiClient.get(`/rank/${userId}/status`);
      return response.data;
    } catch (error) {
      console.error('Error fetching rank status:', error);
      return null;
    }
  },
  
  getDiscoveryProfiles: async (womanId: string) => {
    try {
      // POST based on the new backend spec
      const response = await apiClient.post('/discovery/feed', {
        woman_id: womanId
      });
      return response.data.feed || [];
    } catch (error) {
      console.error('Error fetching discovery feed:', error);
      return [];
    }
  },

  selectAction: async (womanId: string, manId: string, action: 'match' | 'skip' | 'save') => {
    try {
      const response = await apiClient.post('/discovery/select', {
        woman_id: womanId,
        man_id: manId,
        action: action
      });
      return response.data;
    } catch (error) {
      console.error('Error recording selection:', error);
      return { status: 'error' };
    }
  },

  requestAadhaarOtp: async (userId: string, aadhaarNumber: string) => {
    try {
      const response = await apiClient.post('/verification/otp/request', {
        user_id: userId,
        aadhaar_number: aadhaarNumber
      });
      return response.data;
    } catch (error) {
      console.error('Error requesting Aadhaar OTP:', error);
      return { success: false, message: 'OTP Request failed' };
    }
  },

  verifyIdentity: async (userId: string, aadhaarNumber: string, otp: string) => {
    try {
      const response = await apiClient.post('/verification/verify', {
        user_id: userId,
        aadhaar_number: aadhaarNumber,
        otp: otp
      });
      return response.data;
    } catch (error) {
      console.error('Error verifying identity:', error);
      return { success: false, message: 'Verification failed' };
    }
  },
  
  finalizeVerification: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await apiClient.post('/verification/finalize', {}, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error finalizing verification:', error);
      return { success: false, message: 'Finalization failed' };
    }
  },

  // 🛠️ AXIOS PROXY: Support for services that use the api object as a raw axios client
  get: (url: string, config?: any) => apiClient.get(url, config),
  post: (url: string, data?: any, config?: any) => apiClient.post(url, data, config),
  put: (url: string, data?: any, config?: any) => apiClient.put(url, data, config),
  delete: (url: string, config?: any) => apiClient.delete(url, config),
};

export default api;
