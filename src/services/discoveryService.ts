import { api } from './api';

export interface QueueStatus {
  count: number;
}

export const DiscoveryService = {
  recordAction: async (manId: string, action: 'match' | 'skip' | 'save' | 'view' | 'block' | 'report') => {
    try {
      const res = await api.post('/discovery/select', {
        man_id: manId,
        action: action
      });
      return res.data;
    } catch (err) {
      console.error("DISCOVERY_ACTION_ERROR:", err);
      return null;
    }
  },

  getQueueStatus: async (): Promise<QueueStatus> => {
    try {
      const res = await api.get('/discovery/queue-status');
      return res.data;
    } catch (err) {
      console.error("QUEUE_STATUS_ERROR:", err);
      return { count: 0 };
    }
  },

  getGazeCount: async (): Promise<number> => {
    try {
      const res = await api.get('/discovery/gaze-count');
      return res.data?.count ?? 0;
    } catch (err) {
      console.error("GAZE_COUNT_ERROR:", err);
      return 0;
    }
  },

  // --- 🛡️ Safety Protocols ---
  blockUser: async (targetId: string) => {
    try {
      const res = await api.post('/safety/block', { blocked_id: targetId });
      return res.data;
    } catch (err) {
      console.error("BLOCK_PROTOCOL_ERROR:", err);
      throw err;
    }
  },

  reportUser: async (targetId: string, reason: string, evidenceUrl?: string) => {
    try {
      const res = await api.post('/safety/report', {
        reported_id: targetId,
        reason: reason,
        evidence_url: evidenceUrl
      });
      return res.data;
    } catch (err) {
      console.error("REPORT_PROTOCOL_ERROR:", err);
      throw err;
    }
  }
};
