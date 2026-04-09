import { v4 as uuidv4 } from 'uuid';
import { turso } from './turso';
import { supabase } from './supabase';
import type { MatriarchProfile } from '@/types';

/**
 * Validates the caller is an authenticated female user. 
 * This is crucial since LibSQL doesn't inherit Supabase RLS implicitly.
 */
async function verifyFemaleAuthorization(): Promise<MatriarchProfile> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Unauthorized: Invalid Session.");

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (profileError || !profile || (profile.role !== 'woman' && profile.role !== 'admin')) {
    throw new Error("Unauthorized: Access restricted to Sovereign (Female) or Administrative protocol.");
  }

  return profile as MatriarchProfile;
}

export const ForumService = {
  // Topics Cache for fast re-validation
  async getTopics(category?: string, circleId?: string) {
    await verifyFemaleAuthorization();
    
    let query = `
      SELECT t.*, 
             p.role as author_role,
             (SELECT COUNT(*) FROM forum_topics_likes WHERE topic_id = t.id) as real_likes,
             (SELECT COUNT(*) FROM forum_replies WHERE topic_id = t.id) as real_replies,
             t.total_aura_earned
      FROM forum_topics t
      JOIN profiles p ON t.author_id = p.user_id
      WHERE t.is_flagged = FALSE
    `;
    const args: any[] = [];
    
    if (circleId) {
       query += ` AND t.circle_id = ?`;
       args.push(circleId);
    } else {
       query += ` AND t.circle_id IS NULL`;
       if (category) {
          query += ` AND t.category = ?`;
          args.push(category);
       }
    }
    
    query += ` ORDER BY t.created_at DESC LIMIT 50`;

    const { rows } = await turso.execute({ sql: query, args });
    return rows;
  },

  async createTopic(category: string, title: string, content: string, circleId: string | null = null) {
    const profile = await verifyFemaleAuthorization();
    const topicId = uuidv4();
    
    await turso.execute({
       sql: `INSERT INTO forum_topics (id, category, circle_id, title, content, author_id, author_name, author_avatar) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
       args: [
         topicId, 
         category, 
         circleId, 
         title, 
         content, 
         profile.user_id, 
         profile.full_name, 
         profile.photos?.[0] || ''
       ]
    });
    
    return topicId;
  },

  async getReplies(topicId: string) {
    await verifyFemaleAuthorization();
    const { rows } = await turso.execute({
       sql: `SELECT r.*, p.role as author_role 
             FROM forum_replies r 
             JOIN profiles p ON r.author_id = p.user_id 
             WHERE r.topic_id = ? 
             ORDER BY r.created_at ASC`,
       args: [topicId]
    });
    return rows;
  },

  async createReply(topicId: string, content: string) {
    const profile = await verifyFemaleAuthorization();
    const replyId = uuidv4();
    
    await turso.execute({
       sql: `INSERT INTO forum_replies (id, topic_id, content, author_id, author_name, author_avatar)
             VALUES (?, ?, ?, ?, ?, ?)`,
       args: [
          replyId,
          topicId,
          content,
          profile.user_id,
          profile.full_name,
          profile.photos?.[0] || ''
       ]
    });
    
    await turso.execute({
       sql: `UPDATE forum_topics SET replies_count = replies_count + 1 WHERE id = ?`,
       args: [topicId]
    });
    
    return replyId;
  },

  async toggleLike(topicId: string) {
    const profile = await verifyFemaleAuthorization();
    
    const { rows } = await turso.execute({
       sql: `SELECT 1 FROM forum_topics_likes WHERE topic_id = ? AND user_id = ?`,
       args: [topicId, profile.user_id]
    });
    
    if (rows.length > 0) {
       await turso.execute({ sql: `DELETE FROM forum_topics_likes WHERE topic_id = ? AND user_id = ?`, args: [topicId, profile.user_id] });
       return false; // unliked
    } else {
       await turso.execute({ sql: `INSERT INTO forum_topics_likes (topic_id, user_id) VALUES (?, ?)`, args: [topicId, profile.user_id] });
       return true; // liked
    }
  },

  async tipTopic(topicId: string, receiverId: string, amount: number) {
    const senderProfile = await verifyFemaleAuthorization();
    const tipId = uuidv4();

    // Enforce atomic transfer. We batch updates so it all passes or none passes.
    // If the first UPDATE fails (e.g. sender doesn't have balance), Turso handles it conceptually if framed right,
    // but without native distributed transaction rollback across Supabase/Turso, we rely on the LibSQL condition.
    // LibSQL batch will only affect rows that match the WHERE clause. 
    
    // Safety check first: (Requires one round-trip, but prevents negative balances)
    const { rows: balRows } = await turso.execute({
       sql: `SELECT aura_balance FROM users WHERE id = ?`,
       args: [senderProfile.user_id]
    });
    
    if (balRows.length === 0 || Number(balRows[0].aura_balance) < amount) {
       throw new Error("Insufficient Aura Balance.");
    }

    await turso.batch([
      {
        sql: `UPDATE users SET aura_balance = aura_balance - ? WHERE id = ?`,
        args: [amount, senderProfile.user_id]
      },
      {
        sql: `UPDATE users SET aura_balance = aura_balance + ? WHERE id = ?`,
        args: [amount, receiverId]
      },
      {
        sql: `UPDATE forum_topics SET total_aura_earned = total_aura_earned + ? WHERE id = ?`,
        args: [amount, topicId]
      },
      {
        sql: `INSERT INTO forum_tips (id, topic_id, sender_id, receiver_id, amount) VALUES (?, ?, ?, ?, ?)`,
        args: [tipId, topicId, senderProfile.user_id, receiverId, amount]
      }
    ], 'write');

    return true;
  },

  async getCircles() {
    await verifyFemaleAuthorization();
    const { rows } = await turso.execute(`SELECT * FROM forum_circles ORDER BY created_at DESC`);
    return rows;
  },

  async createCircle(name: string, description: string) {
    const profile = await verifyFemaleAuthorization();
    const circleId = uuidv4();
    
    await turso.execute({
       sql: `INSERT INTO forum_circles (id, name, description, created_by) VALUES (?, ?, ?, ?)`,
       args: [circleId, name, description, profile.user_id]
    });
    
    // Auto join the creator
    await turso.execute({
       sql: `INSERT INTO forum_circle_members (circle_id, user_id) VALUES (?, ?)`,
       args: [circleId, profile.user_id]
    });
    
    return circleId;
  }
};
