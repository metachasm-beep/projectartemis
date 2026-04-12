import { turso } from '../_lib/turso.js';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { user_id, utr } = req.body || {};

    if (!user_id || !utr || utr.length !== 12 || !/^\d{12}$/.test(utr)) {
      return res.status(400).json({ error: 'Valid 12-digit UTR and user_id are required' });
    }

    // Attempt to claim
    // 1. Check if it's already claimed entirely by anyone
    const checkPayment = await turso.execute({
      sql: `SELECT * FROM received_payments WHERE utr = ?`,
      args: [utr]
    });

    if (checkPayment.rows.length > 0) {
      const payment: any = checkPayment.rows[0];

      if (payment.is_claimed) {
        return res.status(400).json({ error: 'This UTR has already been claimed.' });
      }

      // Valid payment found! Credit to this user immediately.
      const amount = payment.amount;
      const auraGranted = amount; // 1 Aura = 1 INR
      
      const claimId = uuidv4();

      await turso.batch([
        // Note: Assuming `users` record exists for user_id. If missing, might fail FK but typically frontend handles it.
        // Let's create an "upsert" or assume user is already initialized. The prompt asks to "increment users.aura_balance".
        {
          sql: `INSERT INTO pending_claims (id, user_id, submitted_utr, status) VALUES (?, ?, ?, 'approved')`,
          args: [claimId, user_id, utr]
        },
        {
          sql: `UPDATE received_payments SET is_claimed = true WHERE utr = ?`,
          args: [utr]
        },
        {
          sql: `UPDATE users SET aura_balance = aura_balance + ?, last_topup = CURRENT_TIMESTAMP WHERE id = ?`,
          args: [auraGranted, user_id]
        }
      ], 'write');

      return res.status(200).json({ status: 'Success', message: `Credit of ${auraGranted} Aura successful!` });
    } else {
      // Payment not received YET by MacroDroid (could be network delay).
      // Save to pending_claims for manual or future automated review.
      
      // Rate limiting / Spam prevention
      const userPendingCountRes = await turso.execute({
        sql: `SELECT count(*) as count FROM pending_claims WHERE user_id = ? AND status = 'pending' AND created_at > datetime('now', '-1 minute')`,
        args: [user_id]
      });

      const count = Number(userPendingCountRes.rows[0].count);
      if (count >= 3) {
        return res.status(429).json({ error: 'Rate limit exceeded. Please wait a moment before trying again.' });
      }

      // Ensure this specific UTR wasn't already tracked as pending by THIS user to prevent duplication
      const existingPending = await turso.execute({
        sql: `SELECT * FROM pending_claims WHERE user_id = ? AND submitted_utr = ?`,
        args: [user_id, utr]
      });

      if (existingPending.rows.length === 0) {
        await turso.execute({
          sql: `INSERT INTO pending_claims (id, user_id, submitted_utr, status) VALUES (?, ?, ?, 'pending')`,
          args: [uuidv4(), user_id, utr]
        });
      }

      return res.status(202).json({ 
        status: 'Pending', 
        message: 'Payment verification pending. Our systems are checking your transaction.' 
      });
    }

  } catch (error) {
    console.error('Claim Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
