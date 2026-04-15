import { turso } from '../_lib/turso.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * 🛡️ VERIFICATION GATE:: Claim a verification access via UTR
 * POST /api/payments/verify-claim
 * Body: { user_id, utr, city }
 */

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { user_id, utr, city = 'Delhi' } = req.body || {};

    if (!user_id || !utr) {
      return res.status(400).json({ error: 'user_id and utr are required.' });
    }
    if (utr.length < 12 || !/^\d+$/.test(utr)) {
      return res.status(400).json({ error: 'UTR must be a 12-digit numeric string.' });
    }

    // ── Rate limiting ──
    const rateLimitRes = await turso.execute({
      sql: `SELECT COUNT(*) as count FROM pending_claims WHERE user_id = ? AND status = 'pending' AND created_at > datetime('now', '-2 minutes')`,
      args: [user_id]
    });
    if (Number(rateLimitRes.rows[0].count) >= 3) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please wait before retrying.' });
    }

    // ── Ensure no duplicate UTR ──
    const dupCheck = await turso.execute({
      sql: `SELECT id FROM pending_claims WHERE user_id = ? AND submitted_utr = ?`,
      args: [user_id, utr]
    });
    
    if (dupCheck.rows.length === 0) {
      // Create metadata specifically for verification workflow
      const metadataStr = JSON.stringify({ type: 'verification', city, amount: 49 });
      
      await turso.execute({
        sql: `INSERT INTO pending_claims (id, user_id, submitted_utr, status, metadata) VALUES (?, ?, ?, 'pending', ?)`,
        args: [uuidv4(), user_id, utr, metadataStr]
      });
    }

    return res.status(202).json({
      status: 'pending',
      message: 'Verification payment logged. Your Sanctuary Access link will be delivered via Inbox once the admin approves your UTR.'
    });

  } catch (error) {
    console.error('VERIFY_CLAIM_ERROR:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
