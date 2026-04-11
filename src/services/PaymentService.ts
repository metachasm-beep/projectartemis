import { turso } from '@/lib/turso';

/**
 * 💳 Matriarch Payment Service
 * Handles the submission of sovereign tributes (UTR) for identity verification.
 */

export const PaymentService = {
  /**
   * Submits a UTR for admin review.
   */
  submitUTR: async (userId: string, utr: string) => {
    if (!userId || !utr.trim()) throw new Error("Missing identity or transaction proof.");
    
    console.log(`💳 PAYMENT_SERVICE: Submitting UTR ${utr} for user ${userId}`);
    
    try {
      const res = await turso.execute({
        sql: "UPDATE profiles SET payment_utr = ?, payment_status = 'PENDING' WHERE user_id = ?",
        args: [utr.trim(), userId]
      });
      
      return res.rowsAffected > 0;
    } catch (err) {
      console.error("💳 PAYMENT_SERVICE_ERROR:", err);
      throw err;
    }
  }
};
