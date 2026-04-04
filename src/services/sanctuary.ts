import { turso } from '@/lib/turso';
import { MatriarchProfile, Role } from '@/types';
import { MessagingService } from '@/lib/messaging';
import { v4 as uuidv4 } from 'uuid';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const SanctuaryService = {
  /**
   * 🏹 Discovery Feed: Curated Resonance Rails.
   */
  getRailFeed: async (womanId: string, type: 'imperial' | 'truth' | 'rising') => {
    let sql = "";
    if (type === 'imperial') {
       sql = "SELECT * FROM profiles WHERE role = 'man' AND is_verified = 1 ORDER BY rank_boost_count DESC LIMIT 10";
    } else if (type === 'truth') {
       sql = "SELECT * FROM profiles WHERE role = 'man' AND is_verified = 1 ORDER BY created_at DESC LIMIT 10";
    } else {
       sql = "SELECT * FROM profiles WHERE role = 'man' ORDER BY created_at DESC LIMIT 10";
    }
    
    const r = await turso.execute({ sql, args: [] });
    return r.rows;
  },

  /**
   * 📔 Shortlist Protocol: Save for intentional connection.
   */
  saveToShortlist: async (womanId: string, manId: string) => {
    const id = `short_${uuidv4()}`;
    await turso.execute({
      sql: "INSERT INTO shortlists (id, woman_user_id, man_user_id) VALUES (?, ?, ?)",
      args: [id, womanId, manId]
    });
    return true;
  },

  /**
   * 📈 High-Integrity Rank Reward: The Ledger Protocol.
   */
  rewardRank: async (userId: string, delta: number, reason: string) => {
    const logId = `rank_log_${uuidv4()}`;
    await turso.batch([
      {
        sql: "INSERT INTO rank_logs (id, user_id, delta, reason) VALUES (?, ?, ?, ?)",
        args: [logId, userId, delta, reason]
      },
      {
        sql: "UPDATE profiles SET rank_boost_count = rank_boost_count + ? WHERE user_id = ?",
        args: [delta, userId]
      }
    ], "write");
    return true;
  },

  getRankHistory: async (userId: string) => {
    const r = await turso.execute({
      sql: "SELECT * FROM rank_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 20",
      args: [userId]
    });
    return r.rows;
  }
};
