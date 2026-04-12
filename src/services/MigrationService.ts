import { turso } from '@/lib/turso';

/**
 * 🛠️ Matriarch Database Migration Service
 * Handles one-time structural upgrades to the Sanctuary Registry.
 * Each migration is idempotent — tracked via localStorage flags.
 */

const silentAlter = async (sql: string, flag: string) => {
  try {
    await turso.execute(sql);
    console.log(`🛠️ MIGRATION: '${flag}' column manifested.`);
  } catch (err: any) {
    if (err?.message?.includes('duplicate column') || err?.message?.includes('already exists')) {
      console.log(`🛠️ MIGRATION: '${flag}' already exists — skipping.`);
    } else {
      throw err;
    }
  }
};

export const MigrationService = {
  /**
   * v1 — Payment schema: adds payment_utr and payment_status to profiles.
   */
  migratePaymentSchema: async () => {
    const flag = 'matriarch_migration_payment_v1';
    if (localStorage.getItem(flag)) return;
    console.log('🛠️ SANCTUARY_UPGRADE: Commencing payment schema evolution...');
    try {
      await silentAlter("ALTER TABLE profiles ADD COLUMN payment_utr TEXT;", 'payment_utr');
      await silentAlter("ALTER TABLE profiles ADD COLUMN payment_status TEXT DEFAULT 'NONE';", 'payment_status');
      localStorage.setItem(flag, 'COMPLETED');
      console.log('🛠️ SANCTUARY_UPGRADE: Payment schema complete.');
    } catch (err) {
      console.error('🛠️ SANCTUARY_UPGRADE_FAILURE:', err);
    }
  },

  /**
   * v2 — Biometric Audit Ledger: creates protocol_audits table for verification tracking.
   */
  migrateAuditProtocol: async () => {
    const flag = 'matriarch_migration_audit_v1';
    if (localStorage.getItem(flag)) return;
    try {
      await turso.execute(`
        CREATE TABLE IF NOT EXISTS protocol_audits (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          action TEXT NOT NULL,
          status TEXT DEFAULT 'PENDING',
          metadata TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      localStorage.setItem(flag, 'COMPLETED');
      console.log('🛡️ PROTOCOL_AUDIT: Ledger manifested.');
    } catch (err) {
      console.error('🛡️ PROTOCOL_AUDIT_FAILURE:', err);
    }
  },

  /**
   * v3 — Claims metadata: adds metadata column to pending_claims
   *      for jump_type and city tracking (required by tecno-bridge webhook).
   */
  migrateClaimsMetadata: async () => {
    const flag = 'matriarch_migration_claims_meta_v1';
    if (localStorage.getItem(flag)) return;
    try {
      await silentAlter("ALTER TABLE pending_claims ADD COLUMN metadata TEXT;", 'pending_claims.metadata');
      localStorage.setItem(flag, 'COMPLETED');
      console.log('💳 CLAIMS_META: metadata column manifested.');
    } catch (err) {
      console.error('💳 CLAIMS_META_FAILURE:', err);
    }
  },

  /**
   * runAll — Execute all migrations in dependency order.
   */
  runAll: async () => {
    await MigrationService.migratePaymentSchema();
    await MigrationService.migrateAuditProtocol();
    await MigrationService.migrateClaimsMetadata();
  }
};
