import axios from 'axios';
import { supabase } from '@/lib/supabase';

const _isLocalDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const _envBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Force relative URLs in production because VITE_API_URL points to a dead Vercel deployment.
const API_BASE_URL = _isLocalDev 
  ? (_envBaseUrl.replace(/\/$/, '') + '/api/v1') 
  : '/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

import { auth as firebaseAuth } from '@/lib/firebase';

// 🛡️ AUTH_INTERCEPTOR: Automatically inject the active Identity Token (Firebase or Supabase)
apiClient.interceptors.request.use(async (config) => {
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
});

export const api = {
  // 🛠️ AXIOS PROXY: Support for services that use the api object as a raw axios client
  get: (url: string, config?: any) => apiClient.get(url, config),
  post: (url: string, data?: any, config?: any) => apiClient.post(url, data, config),
  put: (url: string, data?: any, config?: any) => apiClient.put(url, data, config),
  delete: (url: string, config?: any) => apiClient.delete(url, config),

  getRankStatus: async (userId: string) => {
    try {
      const response = await apiClient.get(`/rank/${userId}/status`);
      return response.data;
    } catch (error) {
      console.error('Error fetching rank status:', error);
      return null;
    }
  },
  
  getDiscoveryProfiles: async (verifiedOnly: boolean = false) => {
    try {
      const response = await apiClient.get('/discovery/potential-matches', {
        params: { verified_only: verifiedOnly }
      });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching discovery feed:', error);
      return [];
    }
  },

  selectAction: async (manId: string, action: 'match' | 'skip' | 'save') => {
    try {
      const response = await apiClient.post('/discovery/select', {
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
      const response = await apiClient.post('/verification/finalize', {});
      return response.data;
    } catch (error) {
      console.error('Error finalizing verification:', error);
      return { success: false, message: 'Finalization failed' };
    }
  },

  // ─── Influencer System ─────────────────────────────────────────────────────

  validateCoupon: async (code: string) => {
    const response = await apiClient.post('/influencer/coupon/validate', { code });
    return response.data;
  },

  getInfluencerDashboard: async () => {
    const response = await apiClient.get('/influencer/dashboard');
    return response.data;
  },

  // ─── Admin Influencer Management ───────────────────────────────────────────

  adminListInfluencers: async () => {
    const response = await apiClient.get('/admin/influencer/list');
    return response.data;
  },

  adminCreateCoupon: async (payload: { influencer_user_id: string, code: string, discount_pct: number }) => {
    const response = await apiClient.post('/admin/influencer/create-coupon', payload);
    return response.data;
  },

  adminToggleCoupon: async (code: string, isActive: boolean) => {
    const response = await apiClient.post('/admin/influencer/toggle-coupon', { code, is_active: isActive });
    return response.data;
  },

  adminSearchProfiles: async (query: string) => {
    const response = await apiClient.get('/admin/profiles', { params: { query } });
    return response.data;
  },
};

export { API_BASE_URL }; // Export for use in fetch if needed
export default api;
