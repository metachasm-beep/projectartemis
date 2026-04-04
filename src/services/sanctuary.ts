import { turso } from '@/lib/turso';
import type { MatriarchProfile, Role } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const SanctuaryService = {
  /**
   * 🏹 Discovery Feed: Curated Resonance Rails.
   */
  getRailFeed: async (womanId: string, type: 'imperial' | 'truth' | 'rising' | 'nearby' | 'shortlist', city?: string) => {
    let sql = "";
    let args: any[] = [];

    if (type === 'imperial') {
       sql = "SELECT * FROM profiles WHERE role = 'man' AND is_verified = 1 ORDER BY rank_boost_count DESC LIMIT 10";
    } else if (type === 'truth') {
       sql = "SELECT * FROM profiles WHERE role = 'man' AND is_verified = 1 ORDER BY created_at DESC LIMIT 10";
    } else if (type === 'rising') {
       sql = "SELECT * FROM profiles WHERE role = 'man' ORDER BY created_at DESC LIMIT 10";
    } else if (type === 'nearby' && city) {
       sql = "SELECT * FROM profiles WHERE role = 'man' AND city = ? ORDER BY rank_boost_count DESC LIMIT 10";
       args = [city];
    } else if (type === 'shortlist') {
       sql = "SELECT p.* FROM profiles p JOIN shortlists s ON p.user_id = s.man_user_id WHERE s.woman_user_id = ? ORDER BY s.created_at DESC";
       args = [womanId];
    }
    
    if (!sql) return [];
    const r = await turso.execute({ sql, args });
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
    // Trigger signal
    await SanctuaryService.trackSignal(manId, 'save', womanId);
    return true;
  },

  unshortlist: async (womanId: string, manId: string) => {
    await turso.execute({
      sql: "DELETE FROM shortlists WHERE woman_user_id = ? AND man_user_id = ?",
      args: [womanId, manId]
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
  },

  /**
   * 📉 Sanctuary Signals: The Feedback Loop.
   */
  trackSignal: async (manId: string, type: 'impression' | 'visit' | 'save', womanId?: string) => {
    const id = `sig_${uuidv4()}`;
    // We use a silent execute here to not block the UI
    turso.execute({
      sql: "INSERT INTO profile_analytics (id, man_user_id, woman_user_id, metric_type) VALUES (?, ?, ?, ?)",
      args: [id, manId, womanId || null, type]
    }).catch(e => console.warn("Signal Silent Failure:", e));
  },

  getSignalMetrics: async (userId: string) => {
    const r = await turso.execute({
      sql: `
        SELECT 
          metric_type, 
          COUNT(*) as count,
          COUNT(DISTINCT DATE(created_at)) as days_active
        FROM profile_analytics 
        WHERE man_user_id = ? 
        AND created_at >= date('now', '-30 days')
        GROUP BY metric_type
      `,
      args: [userId]
    });
    
    // Group return data
    const metrics: Record<string, number> = { impression: 0, visit: 0, save: 0 };
    r.rows.forEach((row: any) => {
       metrics[row.metric_type] = row.count;
    });
    return metrics;
  }
};
