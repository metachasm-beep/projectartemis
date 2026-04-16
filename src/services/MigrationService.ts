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
      await MigrationService.migrateSystemTables();
      await silentAlter("ALTER TABLE pending_claims ADD COLUMN metadata TEXT;", 'pending_claims.metadata');
      localStorage.setItem(flag, 'COMPLETED');
      console.log('💳 CLAIMS_META: metadata column manifested.');
    } catch (err) {
      console.error('💳 CLAIMS_META_FAILURE:', err);
    }
  },

  /**
   * v4 — System Infrastructure: Creates all secondary protocol tables.
   */
  migrateSystemTables: async () => {
    const flag = 'matriarch_migration_system_v1';
    if (localStorage.getItem(flag)) return;
    console.log('🛠️ SYSTEM_MANIFEST: Manifesting secondary protocols...');
    try {
      await turso.batch([
        { sql: "CREATE TABLE IF NOT EXISTS pending_claims (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, submitted_utr TEXT NOT NULL, status TEXT DEFAULT 'pending', metadata TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)" },
        { sql: "CREATE TABLE IF NOT EXISTS received_payments (utr TEXT PRIMARY KEY, amount INTEGER NOT NULL, is_claimed INTEGER DEFAULT 0, sender_info TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)" },
        { sql: "CREATE TABLE IF NOT EXISTS profile_analytics (id TEXT PRIMARY KEY, man_user_id TEXT, woman_user_id TEXT, metric_type TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)" },
        { sql: "CREATE TABLE IF NOT EXISTS rank_logs (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, delta INTEGER NOT NULL, reason TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)" },
        { sql: "CREATE TABLE IF NOT EXISTS shortlists (id TEXT PRIMARY KEY, woman_user_id TEXT NOT NULL, man_user_id TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)" },
        { sql: "CREATE TABLE IF NOT EXISTS user_interactions (id TEXT PRIMARY KEY, actor_id TEXT NOT NULL, target_id TEXT NOT NULL, interaction_type TEXT NOT NULL, reason TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)" }
      ], 'write');
      localStorage.setItem(flag, 'COMPLETED');
      console.log('🛠️ SYSTEM_MANIFEST: Secondary infrastructure complete.');
    } catch (err) {
      console.error('🛠️ SYSTEM_MANIFEST_FAILURE:', err);
    }
  },

  /**
   * v5 — Interaction & Retention: Adds streak and session tracking to profiles.
   */
  migrateStreakSchema: async () => {
    const flag = 'matriarch_migration_streak_v2';
    if (localStorage.getItem(flag)) return;
    try {
      await silentAlter("ALTER TABLE profiles ADD COLUMN consecutive_days INTEGER DEFAULT 0;", 'consecutive_days');
      await silentAlter("ALTER TABLE profiles ADD COLUMN last_login_at TEXT;", 'last_login_at');
      await silentAlter("ALTER TABLE profiles ADD COLUMN last_streak_at TEXT;", 'last_streak_at');
      await silentAlter("ALTER TABLE profiles ADD COLUMN total_session_seconds INTEGER DEFAULT 0;", 'total_session_seconds');
      localStorage.setItem(flag, 'COMPLETED');
      console.log('🔥 STREAK_SCHEMA_V2: Retention indices manifested.');
    } catch (err) {
      console.error('🔥 STREAK_SCHEMA_FAILURE:', err);
    }
  },

  /**
   * v6 — Profile Dossier: Adds legacy/missing columns required for leaderboard and discovery.
   */
  migrateProfileDossier: async () => {
    const flag = 'matriarch_migration_dossier_v1';
    if (localStorage.getItem(flag)) return;
    try {
      await silentAlter("ALTER TABLE profiles ADD COLUMN full_name TEXT;", 'full_name');
      await silentAlter("ALTER TABLE profiles ADD COLUMN age INTEGER;", 'age');
      await silentAlter("ALTER TABLE profiles ADD COLUMN city TEXT;", 'city');
      localStorage.setItem(flag, 'COMPLETED');
      console.log('🏛️ DOSSIER_MIGRATION: age/city/full_name manifested.');
    } catch (err) {
      console.error('🏛️ DOSSIER_MIGRATION_FAILURE:', err);
    }
  },

  /**
   * runAll — Execute all migrations in a single batched transaction to prevent request chaining.
   */
  runAll: async () => {
    // 🛡️ SANCTUARY SCHEMA REGISTRY
    const flags = {
      payment: 'matriarch_migration_payment_v1',
      audit: 'matriarch_migration_audit_v1',
      claims: 'matriarch_migration_claims_meta_v1',
      system: 'matriarch_migration_system_v1',
      streak: 'matriarch_migration_streak_v2',
      dossier: 'matriarch_migration_dossier_v1'
    };

    const pendingQueries: { sql: string }[] = [];

    // 1. Payment Schema (v1)
    if (!localStorage.getItem(flags.payment)) {
      pendingQueries.push({ sql: "ALTER TABLE profiles ADD COLUMN payment_utr TEXT" });
      pendingQueries.push({ sql: "ALTER TABLE profiles ADD COLUMN payment_status TEXT DEFAULT 'NONE'" });
    }

    // 2. Audit Protocol (v2)
    if (!localStorage.getItem(flags.audit)) {
      pendingQueries.push({ sql: `
        CREATE TABLE IF NOT EXISTS protocol_audits (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          action TEXT NOT NULL,
          status TEXT DEFAULT 'PENDING',
          metadata TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `});
    }

    // 3. System Tables (v4 - required by claims)
    if (!localStorage.getItem(flags.system)) {
      pendingQueries.push({ sql: "CREATE TABLE IF NOT EXISTS pending_claims (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, submitted_utr TEXT NOT NULL, status TEXT DEFAULT 'pending', metadata TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)" });
      pendingQueries.push({ sql: "CREATE TABLE IF NOT EXISTS received_payments (utr TEXT PRIMARY KEY, amount INTEGER NOT NULL, is_claimed INTEGER DEFAULT 0, sender_info TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)" });
      pendingQueries.push({ sql: "CREATE TABLE IF NOT EXISTS profile_analytics (id TEXT PRIMARY KEY, man_user_id TEXT, woman_user_id TEXT, metric_type TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)" });
      pendingQueries.push({ sql: "CREATE TABLE IF NOT EXISTS rank_logs (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, delta INTEGER NOT NULL, reason TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)" });
      pendingQueries.push({ sql: "CREATE TABLE IF NOT EXISTS shortlists (id TEXT PRIMARY KEY, woman_user_id TEXT NOT NULL, man_user_id TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)" });
      pendingQueries.push({ sql: "CREATE TABLE IF NOT EXISTS user_interactions (id TEXT PRIMARY KEY, actor_id TEXT NOT NULL, target_id TEXT NOT NULL, interaction_type TEXT NOT NULL, reason TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)" });
    }

    // 4. Claims Metadata (v3)
    if (!localStorage.getItem(flags.claims)) {
      pendingQueries.push({ sql: "ALTER TABLE pending_claims ADD COLUMN metadata TEXT" });
    }

    // 5. Streak & Retention (v5)
    if (!localStorage.getItem(flags.streak)) {
      pendingQueries.push({ sql: "ALTER TABLE profiles ADD COLUMN consecutive_days INTEGER DEFAULT 0" });
      pendingQueries.push({ sql: "ALTER TABLE profiles ADD COLUMN last_login_at TEXT" });
      pendingQueries.push({ sql: "ALTER TABLE profiles ADD COLUMN last_streak_at TEXT" });
      pendingQueries.push({ sql: "ALTER TABLE profiles ADD COLUMN total_session_seconds INTEGER DEFAULT 0" });
    }

    // 6. Profile Dossier (v6)
    if (!localStorage.getItem(flags.dossier)) {
      pendingQueries.push({ sql: "ALTER TABLE profiles ADD COLUMN full_name TEXT" });
      pendingQueries.push({ sql: "ALTER TABLE profiles ADD COLUMN age INTEGER" });
      pendingQueries.push({ sql: "ALTER TABLE profiles ADD COLUMN city TEXT" });
    }

    if (pendingQueries.length === 0) return;

    console.log(`🛠️ SANCTUARY_SYNC: Commencing batch update of ${pendingQueries.length} protocols...`);
    
    try {
      // Execute as a single transaction (batch)
      // Note: We use silent-fail behavior by checking column existence inside individual try/catches 
      // is hard in batch, so we rely on the localStorage flags to ensure we never run a query twice.
      await turso.batch(pendingQueries, 'write');
      
      // Mark all as completed
      Object.values(flags).forEach(f => localStorage.setItem(f, 'COMPLETED'));
      console.log('🛠️ SANCTUARY_SYNC: Database integrity confirmed.');
    } catch (err: any) {
      // If batch fails (e.g. one column exists), we try to fall back or just log
      // In production, the localStorage flags prevent this.
      console.error('🛠️ SANCTUARY_SYNC_ERROR:', err);
    }
  }
};

