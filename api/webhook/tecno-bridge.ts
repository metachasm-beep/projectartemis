import { turso } from '../_lib/turso.js';

// MacroDroid webhook POST endpoint
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const { notification_text, notification_title } = req.body || {};

    if (!notification_text) {
      return res.status(200).send('No text provided'); // 200 to save battery even on err
    }

    // Regex 1: Extract 12-digit UTR
    const utrMatch = notification_text.match(/\b\d{12}\b/);
    const utr = utrMatch ? utrMatch[0] : null;

    // Regex 2: Extract amount
    const amountMatch = notification_text.match(/(?:₹|Rs\.?)\s?([\d,.]+)/);
    const amountStr = amountMatch ? amountMatch[1].replace(/,/g, '') : null;
    const amount = amountStr ? parseFloat(amountStr) : null;

    if (!utr || !amount) {
      // Ignored non-payment or malformed notification
      return res.status(200).send('OK'); 
    }

    // 1. Insert into received_payments 
    try {
      await turso.execute({
        sql: `INSERT INTO received_payments (utr, amount, raw_text, is_claimed) VALUES (?, ?, ?, ?)`,
        args: [utr, amount, notification_text, false],
      });
    } catch (e: any) {
      if (e.message && e.message.includes('UNIQUE constraint failed')) {
        // Skip insertion, already processed
        console.log("Already received this UTR:", utr);
      } else {
        throw e;
      }
    }

    // 2. Check pending_claims for this exact UTR
    const pendingRes = await turso.execute({
      sql: `SELECT * FROM pending_claims WHERE submitted_utr = ? AND status = 'pending'`,
      args: [utr],
    });

    if (pendingRes.rows.length > 0) {
      const claim = pendingRes.rows[0];
      const userId = claim.user_id;

      // 3. User is waiting, verify and accept logic directly using a transaction
      // Conversion rate: 1 Aura = 1 INR
      const auraGranted = amount; 

      await turso.batch([
        {
          sql: `UPDATE received_payments SET is_claimed = true WHERE utr = ?`,
          args: [utr],
        },
        {
          sql: `UPDATE pending_claims SET status = 'approved' WHERE id = ?`,
          args: [claim.id],
        },
        {
          sql: `UPDATE users SET aura_balance = aura_balance + ?, last_topup = CURRENT_TIMESTAMP WHERE id = ?`,
          args: [auraGranted, userId],
        }
      ], 'write');
      console.log(`Successfully verified and granted ${auraGranted} aura to ${userId}`);
    }

    return res.status(200).send('200 OK');

  } catch (error) {
    console.error('Webhook Error:', error);
    // Respond 200 OK so MacroDroid doesn't retry infinitely and drain battery on bugs
    return res.status(200).send('OK');
  }
}
