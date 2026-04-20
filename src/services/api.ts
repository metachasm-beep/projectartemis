import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
  }
};

export default api;
