import { turso } from '@/lib/turso';

/**
 * 🛠️ Matriarch Database Migration Service
 * Handles one-time structural upgrades to the Sanctuary Registry.
 */

export const MigrationService = {
  /**
   * Performs the manual payment schema upgrade.
   * Adds payment_utr and payment_status to the profiles table.
   */
  migratePaymentSchema: async () => {
    const migrationFlag = 'matriarch_migration_payment_v1';
    
    // Check if migration has already run locally to avoid unnecessary network calls
    if (localStorage.getItem(migrationFlag)) {
       return;
    }

    console.log("🛠️ SANCTUARY_UPGRADE: Commencing structural evolution...");

    try {
      // 🛡️ ALTER TABLE ADD COLUMN does not support IF NOT EXISTS in SQLite.
      // We execute them sequentially and catch "duplicate column" errors.
      
      try {
        await turso.execute("ALTER TABLE profiles ADD COLUMN payment_utr TEXT;");
        console.log("🛠️ SANCTUARY_UPGRADE: 'payment_utr' column manifested.");
      } catch (err: any) {
        if (err?.message?.includes('duplicate column')) {
          console.log("🛠️ SANCTUARY_UPGRADE: 'payment_utr' already exists.");
        } else {
          throw err;
        }
      }

      try {
        await turso.execute("ALTER TABLE profiles ADD COLUMN payment_status TEXT DEFAULT 'NONE';");
        console.log("🛠️ SANCTUARY_UPGRADE: 'payment_status' column manifested.");
      } catch (err: any) {
        if (err?.message?.includes('duplicate column')) {
          console.log("🛠️ SANCTUARY_UPGRADE: 'payment_status' already exists.");
        } else {
          throw err;
        }
      }

      // Mark migration as successful
      localStorage.setItem(migrationFlag, 'COMPLETED');
      console.log("🛠️ SANCTUARY_UPGRADE: Schema evolution complete.");
    } catch (err) {
      console.error("🛠️ SANCTUARY_UPGRADE_FAILURE:", err);
      // We don't set localStorage here so it can retry next time
    }
  }
};
