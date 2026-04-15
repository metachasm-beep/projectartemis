import { api } from './api';

export interface QueueStatus {
  count: number;
}

export const DiscoveryService = {
  recordAction: async (manId: string, action: 'match' | 'skip' | 'save' | 'view') => {
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
  }
};
