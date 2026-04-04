import { turso, tursoHelpers } from './turso';
import { v4 as uuidv4 } from 'uuid';

/**
 * MATRIARCH Messaging Sanctuary - Domain Logic
 * Enforces the asymmetric, women-first communication protocol.
 */

export type CommMode = 'TEXT' | 'DELAYED_TEXT' | 'PROMPT_INTRO' | 'VOICE_REQUEST' | 'VIDEO_REQUEST' | 'HOLD' | 'REVOKED';
export type MatchStatus = 'ACTIVE' | 'ON_HOLD' | 'UNMATCHED' | 'BLOCKED';

export interface MessagingMatch {
  id: string;
  woman_user_id: string;
  man_user_id: string;
  status: MatchStatus;
  current_comm_mode: CommMode;
  selected_at: string;
  prompts_completed: boolean;
  delayed_unlock_at: string | null;
}

export interface MatriarchMessage {
  id: string;
  conversation_id: string;
  sender_user_id: string;
  body: string;
  created_at: string;
  moderation_status: 'PENDING' | 'CLEAR' | 'FLAGGED' | 'REMOVED';
}

export const MessagingService = {
  /**
   * 💜 Selection Protocol: A woman initiates a match by selecting a man.
   */
  async createMatch(womanId: string, manId: string): Promise<string> {
    const matchId = `match_${uuidv4()}`;
    const convId = `conv_${uuidv4()}`;

    // Atomic match creation
    await turso.batch([
      {
        sql: "INSERT INTO matches (id, woman_user_id, man_user_id) VALUES (?, ?, ?)",
        args: [matchId, womanId, manId]
      },
      {
        sql: "INSERT INTO conversations (id, match_id) VALUES (?, ?)",
        args: [convId, matchId]
      },
      {
        sql: "INSERT INTO match_state_history (id, match_id, to_status, changed_by_user_id) VALUES (?, ?, ?, ?)",
        args: [`hist_${uuidv4()}`, matchId, 'ACTIVE', womanId]
      }
    ], "write");

    return matchId;
  },

  /**
   * 🛡️ Resonance Control: Only the woman can switch communication modes.
   */
  async setCommMode(matchId: string, womanId: string, newMode: CommMode): Promise<void> {
    // Audit log
    const histId = `mode_hist_${uuidv4()}`;
    
    // Set 24h delay if needed
    let unlockAt: string | null = null;
    if (newMode === 'DELAYED_TEXT') {
      const date = new Date();
      date.setHours(date.getHours() + 24);
      unlockAt = date.toISOString();
    }

    await turso.batch([
      {
        sql: "UPDATE matches SET current_comm_mode = ?, delayed_unlock_at = ? WHERE id = ? AND woman_user_id = ?",
        args: [newMode, unlockAt, matchId, womanId]
      },
      {
        sql: "INSERT INTO communication_mode_history (id, match_id, mode, changed_by_user_id) VALUES (?, ?, ?, ?)",
        args: [histId, matchId, newMode, womanId]
      }
    ], "write");
  },

  /**
   * 🏹 Message Transmission: Enforces mode-based and safety-based restrictions.
   */
  async sendMessage(convId: string, senderId: string, body: string): Promise<MatriarchMessage> {
    // 1. Resolve Match Context
    const result = await turso.execute({
      sql: `SELECT m.*, c.id as conv_id 
            FROM matches m 
            JOIN conversations c ON c.match_id = m.id 
            WHERE c.id = ? AND (m.woman_user_id = ? OR m.man_user_id = ?)`,
      args: [convId, senderId, senderId]
    });

    if (result.rows.length === 0) throw new Error("Sanctuary Access Denied: No active match found.");
    const match = result.rows[0] as unknown as MessagingMatch;

    // 2. Check for Blocks
    const blockCheck = await turso.execute({
      sql: "SELECT 1 FROM blocks WHERE (blocker_user_id = ? AND blocked_user_id = ?) OR (blocker_user_id = ? AND blocked_user_id = ?)",
      args: [senderId, match.woman_user_id, match.man_user_id, senderId]
    });
    if (blockCheck.rows.length > 0) throw new Error("Communication Severed: A block exists in this resonance.");

    // 3. Mode Enforcement
    const mode = match.current_comm_mode;
    const isWoman = senderId === match.woman_user_id;

    if (mode === 'HOLD' || mode === 'REVOKED') {
      throw new Error("Communication Paused: The woman has suspended this sanctuary.");
    }

    if (mode === 'DELAYED_TEXT') {
      if (match.delayed_unlock_at && new Date(match.delayed_unlock_at) > new Date()) {
        if (!isWoman) throw new Error("Awaiting Gaze: Interaction is restricted for 24 hours.");
      }
    }

    if (mode === 'PROMPT_INTRO' && !isWoman && !match.prompts_completed) {
      // Men can only send prompt responses, not free messages
       throw new Error("Prompt Mandatory: You must complete the woman's introductory story first.");
    }

    // 4. Send Message
    const msgId = `msg_${uuidv4()}`;
    const now = new Date().toISOString();
    
    await turso.execute({
      sql: "INSERT INTO messages (id, conversation_id, sender_user_id, body, created_at) VALUES (?, ?, ?, ?, ?)",
      args: [msgId, convId, senderId, body, now]
    });

    return {
      id: msgId,
      conversation_id: convId,
      sender_user_id: senderId,
      body,
      created_at: now,
      moderation_status: 'PENDING'
    };
  },

  /**
   * 📓 Intro Discovery: Get customizable prompts set by the woman.
   */
  async getPrompts(womanId: string): Promise<any[]> {
    const r = await turso.execute({
      sql: "SELECT * FROM woman_prompts WHERE woman_id = ? ORDER BY display_order ASC",
      args: [womanId]
    });
    return r.rows;
  },

  /**
   * 🏹 Hard Purge: Enforce hard delete policy.
   */
  async purgeMessage(msgId: string, userId: string): Promise<void> {
    await turso.execute({
      sql: "DELETE FROM messages WHERE id = ? AND sender_user_id = ?",
      args: [msgId, userId]
    });
  }
};
