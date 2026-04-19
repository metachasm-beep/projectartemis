import axios from 'axios';
import { Platform } from 'react-native';

// Set this to true to test against the live site during development integration
const USE_LIVE_SITE = true; 

const LIVE_URL = 'https://www.matriarchindia.com/api/v1';
const LOCAL_URL = Platform.select({
  android: 'http://10.0.2.2:8000/api/v1',
  default: 'http://localhost:8000/api/v1',
});

const API_URL = USE_LIVE_SITE ? LIVE_URL : LOCAL_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true, // Crucial for httpOnly cookie persistence (PWA mode)
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Auth & Session
  establishSession: async (accessToken: string) => {
    // This hardens the session by setting an httpOnly cookie via the backend
    const response = await apiClient.post('/auth/session', { access_token: accessToken });
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    // Clear local storage if any
    return response.data;
  },

  // Discovery (Women)
  getDiscoveryFeed: async (params?: any) => {
    const response = await apiClient.get('/discovery/feed', { params });
    return response.data;
  },
  
  selectProfile: async (id: string) => {
    const response = await apiClient.post(`/discovery/select/${id}`);
    return response.data;
  },

  // Rank (Men)
  getRankStatus: async (userId: string) => {
    const response = await apiClient.get(`/rank/status/${userId}`);
    return response.data;
  },

  // Verification
  verifyAadhaar: async (aadhaarNumber: string, otp?: string) => {
    // This now hits the live verification endpoint during development
    const response = await apiClient.post('/verification/aadhaar', {
      aadhaar_number: aadhaarNumber,
      otp: otp,
    });
    return response.data;
  },

  // Matches & Monetization (Men)
  getMatches: async () => {
    // Mocking match data for the demo
    return [
      { id: 'm1', name: 'Ishani K.', age: 24, rank: 'Elite', location: 'Delhi', bio: 'Art curator, loves classical music.', image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=254', blurred: true },
      { id: 'm2', name: 'Zoya R.', age: 26, rank: 'High', location: 'Pune', bio: 'Philosophy student. Deep conversations only.', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=254', blurred: true },
    ];
  },

  unlockMatch: async (matchId: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, matchId };
  },

  purchaseTokens: async (packageId: string) => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    const packages: Record<string, number> = { 'p1': 199, 'p3': 299, 'p10': 699 };
    return { success: true, amount: packages[packageId] || 0 };
  },

  // Health
  checkHealth: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  }
};

export default api;
