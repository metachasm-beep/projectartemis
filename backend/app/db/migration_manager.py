import os
import logging
from typing import List
from app.db.turso import turso_client

logger = logging.getLogger(__name__)

class MigrationManager:
    def __init__(self, migrations_dir: str):
        self.migrations_dir = migrations_dir

    async def init_migration_table(self):
        """Ensures the _migrations table exists."""
        sql = """
        CREATE TABLE IF NOT EXISTS _migrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        """
        await turso_client.execute(sql)

    async def get_applied_migrations(self) -> List[str]:
        """Returns a list of names of applied migrations."""
        res = await turso_client.execute("SELECT name FROM _migrations")
        return [row["name"] for row in res.rows]

    async def run_migrations(self):
        """Scans the migrations directory and applies pending migrations."""
        logger.info("🛠️ MIGRATION_MANAGER: Starting migration check...")
        await self.init_migration_table()
        
        applied = await self.get_applied_migrations()
        
        # Get all .sql files in the migrations directory, sorted
        all_files = sorted([f for f in os.listdir(self.migrations_dir) if f.endswith(".sql")])
        
        for filename in all_files:
            if filename not in applied:
                logger.info(f"🚀 MIGRATION_MANAGER: Applying {filename}...")
                filepath = os.path.join(self.migrations_dir, filename)
                
                with open(filepath, "r") as f:
                    sql_content = f.read()
                
                # Split by semicolon to execute individual statements
                # Simple parser for initial implementation
                statements = [s.strip() for s in sql_content.split(";") if s.strip()]
                
                try:
                    # In Turso/libsql, batch can handle multiple statements in a transaction
                    # However, batch expects a list of strings.
                    await turso_client.batch(statements)
                    
                    # Record the migration as applied
                    await turso_client.execute(
                        "INSERT INTO _migrations (name) VALUES (?)",
                        [filename]
                    )
                    logger.info(f"✅ MIGRATION_MANAGER: {filename} applied successfully.")
                except Exception as e:
                    logger.error(f"❌ MIGRATION_MANAGER: Error applying {filename}: {str(e)}")
                    # Stop if a migration fails
                    raise e
        
        logger.info("🏁 MIGRATION_MANAGER: Migration process completed.")

# Singleton instance for the app
MIGRATIONS_DIR = os.path.join(os.path.dirname(__file__), "migrations")
migration_manager = MigrationManager(MIGRATIONS_DIR)
