import { API } from './apiClient';
import { v4 as uuidv4 } from 'uuid';

export const SanctuaryService = {
  /**
   * 🏹 Discovery Feed: Curated Resonance Rails.
   */
  getRailFeed: async (womanId: string, type: 'imperial' | 'truth' | 'rising' | 'nearby' | 'shortlist', city?: string) => {
    try {
      const res = await API.get('/discovery/rail', { params: { womanId, type, city } });
      return res.data.profiles || [];
    } catch (err) {
      console.warn("getRailFeed fallback:", err);
      return [];
    }
  },

  getGazeCarouselProfiles: async () => {
    try {
      const res = await API.get('/discovery/gaze-carousel');
      let profiles = res.data?.profiles || [];
      if (profiles.length < 15) {
        try {
          const { AdminService } = await import('./admin');
          const allWomen = await AdminService.searchProfiles({ role: 'woman', limit: 200 });
          if (allWomen && allWomen.length > 0) {
            profiles = [...profiles, ...allWomen];
            const seen = new Set();
            profiles = profiles.filter(p => {
              const id = p.user_id || p.id;
              if (seen.has(id)) return false;
              seen.add(id);
              return true;
            });
          }
        } catch(e) { console.warn("Turso gaze expansion fallback failed:", e); }
      }
      return profiles;
    } catch (err) {
      console.warn("getGazeCarouselProfiles fallback:", err);
      try {
        const { AdminService } = await import('./admin');
        const allWomen = await AdminService.searchProfiles({ role: 'woman', limit: 200 });
        if (allWomen && allWomen.length > 0) return allWomen;
      } catch(e) {}
      return [];
    }
  },

  getStandingRanks: async (city?: string, absoluteRank?: number) => {
    try {
      const res = await API.get('/rank/standing', { params: { city, absoluteRank } });
      return res.data || { totalMen: 1, cityRank: 1 };
    } catch (err) {
      console.warn("getStandingRanks fallback:", err);
      return { totalMen: 1, cityRank: 1 };
    }
  },

  /**
   * 📔 Shortlist Protocol: Save for intentional connection.
   */
  saveToShortlist: async (womanId: string, manId: string) => {
    try {
      await API.post('/discovery/shortlist', { womanId, manId });
      await SanctuaryService.trackSignal(manId, 'save', womanId);
      return true;
    } catch (err) {
      console.warn("saveToShortlist error:", err);
      return false;
    }
  },

  unshortlist: async (womanId: string, manId: string) => {
    try {
      await API.delete('/discovery/shortlist', { params: { womanId, manId } });
      return true;
    } catch (err) {
      console.warn("unshortlist error:", err);
      return false;
    }
  },

  /**
   * 📉 Sanctuary Signals: The Feedback Loop.
   */
  trackSignal: async (manId: string, type: 'impression' | 'visit' | 'save', womanId?: string) => {
    try {
      await API.post('/sanctuary/signals', { man_id: manId, metric_type: type, woman_id: womanId || null });
    } catch (e) {
      console.warn("Signal Silent Failure:", e);
    }
  },

  getSignalMetrics: async (userId: string) => {
    try {
      const res = await API.get(`/sanctuary/metrics/${userId}`);
      return res.data.metrics || { impression: 0, visit: 0, save: 0 };
    } catch (err) {
      console.warn("getSignalMetrics fallback:", err);
      return { impression: 0, visit: 0, save: 0 };
    }
  },

  /**
   * 👑 Sovereign Metrics: For Women's Dashboard only.
   */
  getSovereignMetrics: async (womanId: string) => {
    try {
      const res = await API.get(`/discovery/sovereign-metrics/${womanId}`);
      return res.data || {
        matches: 0, sessionSeconds: 0, activeStreak: 0, profileViews: 0, profilesEngaged: 0, saves: 0, profileCompleteness: 94
      };
    } catch (err) {
      console.warn("getSovereignMetrics fallback:", err);
      return { matches: 0, sessionSeconds: 0, activeStreak: 0, profileViews: 0, profilesEngaged: 0, saves: 0, profileCompleteness: 94 };
    }
  },

  trackSessionTime: async (userId: string, deltaSeconds: number) => {
    try {
      await API.post('/auth/session-time', { userId, deltaSeconds });
    } catch (err) {
      console.warn("trackSessionTime error:", err);
    }
  },

  /**
   * 📈 High-Integrity Rank Reward: The Ledger Protocol.
   */
  rewardRank: async (userId: string, delta: number, reason: string) => {
    try {
      await API.post('/rank/reward', { userId, delta, reason });
      return true;
    } catch (err) {
      console.warn("rewardRank error:", err);
      return false;
    }
  },

  getRankHistory: async (userId: string) => {
    try {
      const res = await API.get(`/rank/history/${userId}`);
      return res.data.history || [];
    } catch (err) {
      console.warn("getRankHistory fallback:", err);
      return [];
    }
  },

  /**
   * 💎 AURA Tokenomics: Percentile Leap Protocol.
   */
  purchaseJump: async (userId: string, jumpPercent: number) => {
    try {
      const res = await API.post('/sanctuary/jump', { user_id: userId, jump_percent: jumpPercent });
      return res.data.points_awarded || 0;
    } catch (err) {
      console.warn("purchaseJump error:", err);
      return 0;
    }
  },

  purchaseSealOfExcellence: async (userId: string) => {
    try {
      await API.post('/sanctuary/seal', { user_id: userId });
      return true;
    } catch (err) {
      console.warn("purchaseSealOfExcellence error:", err);
      return false;
    }
  },

  /**
   * 🏆 Global Leaderboard: Fetch the rooted ascent of men.
   */
  getLeaderboard: async (limit: number = 100) => {
    try {
      const res = await API.get('/rank/leaderboard', { params: { limit } });
      return res.data.leaderboard || [];
    } catch (err) {
      console.warn("getLeaderboard fallback:", err);
      return [];
    }
  },

  /**
   * 🌊 Global Rank Reflow: Ensures absolute exclusivity (Only 1 profile per rank).
   */
  recalculateGlobalRanks: async () => {
    try {
      await API.post('/sanctuary/recalculate-ranks');
    } catch (err) {
      console.error("RANK_REFLOW_CRITICAL_FAILURE:", err);
    }
  },

  /**
   * 🛡️ Biometric Ledger: Seal the verification into the database.
   */
  verifyProfile: async (userId: string) => {
    try {
      await API.post('/verification/verify', { userId });
      return true;
    } catch (err) {
      console.warn("verifyProfile error:", err);
      return false;
    }
  },

  uploadVerificationEvidence: async (userId: string, evidence: Blob | string) => {
    try {
      const formData = new FormData();
      formData.append('userId', userId);
      if (typeof evidence === 'string') {
        formData.append('payload_hash', evidence);
      } else {
        formData.append('evidence', evidence);
      }
      await API.post('/verification/evidence', formData);
      return true;
    } catch (err) {
      console.warn("uploadVerificationEvidence error:", err);
      return false;
    }
  },

  /**
   * 📉 Resonance Decay Protocol:
   */
  applyRankDecay: async (userId: string, totalInactivityDays: number) => {
    try {
      const res = await API.post('/rank/decay', { userId, totalInactivityDays });
      return res.data.penalty || 0;
    } catch (err) {
      console.warn("applyRankDecay error:", err);
      return 0;
    }
  },

  /**
   * 📑 Dossier Resonance Sync:
   */
  syncIntegrityBonus: async (userId: string, integrityScore: number) => {
    try {
      const res = await API.post('/sanctuary/integrity-bonus', { user_id: userId, integrity_score: integrityScore });
      return res.data.bonus_awarded || 0;
    } catch (err) {
      console.warn("syncIntegrityBonus error:", err);
      return 0;
    }
  },

  /**
   * 👑 Tier Brackets (Absolute Population Based):
   */
  getTierFromRank: (rank: number, total: number) => {
    if (rank <= 10) return { id: 'choice', name: 'The Choice', color: 'mat-gold-foil' };
    
    const percentile = (rank / total) * 100;
    
    if (percentile <= 5) return { id: 'ascendant', name: 'Ascendant', color: 'mat-gold' };
    if (percentile <= 15) return { id: 'paragon', name: 'Paragon', color: 'mat-wine-soft' };
    if (percentile <= 30) return { id: 'noble', name: 'Noble', color: 'mat-wine' };
    if (percentile <= 60) return { id: 'vanguard', name: 'Vanguard', color: 'mat-rose' };
    return { id: 'aspirant', name: 'Aspirant', color: 'mat-slate' };
  },

  /**
   * 🛡️ Sovereign Protection: Report, Block, and Filter.
   */
  reportUser: async (actorId: string, targetId: string, reason: string) => {
    try {
      await API.post('/safety/report', { actorId, targetId, reason });
      return true;
    } catch (err) {
      console.warn("reportUser error:", err);
      return false;
    }
  },

  blockUser: async (actorId: string, targetId: string) => {
    try {
      await API.post('/safety/block', { actorId, targetId });
      return true;
    } catch (err) {
      console.warn("blockUser error:", err);
      return false;
    }
  },

  setNeverShow: async (actorId: string, targetId: string) => {
    try {
      await API.post('/safety/never-show', { actorId, targetId });
      return true;
    } catch (err) {
      console.warn("setNeverShow error:", err);
      return false;
    }
  },

  /**
   * 🗺️ Proximity Protocol:
   */
  updateLocation: async (userId: string, latitude: number, longitude: number) => {
    try {
      await API.post('/auth/location', { userId, latitude, longitude });
      return true;
    } catch (err) {
      console.warn("updateLocation error:", err);
      return false;
    }
  },

  updateMeasurementUnit: async (userId: string, unit: 'km' | 'mi') => {
    try {
      await API.post('/auth/measurement-unit', { userId, unit });
      return true;
    } catch (err) {
      console.warn("updateMeasurementUnit error:", err);
      return false;
    }
  },

  /**
   * 📐 Haversine Formula:
   */
  calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number, unit: 'km' | 'mi' = 'km') => {
    const R = unit === 'km' ? 6371 : 3958.8;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  }
};
