import { api } from './api';

export interface Quest {
  id: string;
  title: string;
  description: string;
  objective_type: 'journal' | 'profile' | 'discovery' | 'daily_login';
  aura_reward: number;
  rank_reward: number;
  is_daily: boolean;
  status: 'available' | 'in_progress' | 'completed';
  progress_pct: number;
}

export const QuestService = {
  getQuests: async (): Promise<Quest[]> => {
    try {
      const res = await api.get('/quests');
      return res.data;
    } catch (err) {
      console.error("QUEST_FETCH_ERROR:", err);
      return [];
    }
  },

  claimReward: async (questId: string) => {
    try {
      const res = await api.post(`/quests/claim/${questId}`);
      return res.data;
    } catch (err) {
      console.error("QUEST_CLAIM_ERROR:", err);
      throw err;
    }
  }
};
