from app.db.turso import turso_client
from app.core.ranking import ranking_engine
import asyncio
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class BackfillService:
    def __init__(self):
        self.is_running = False

    async def start_service(self):
        """Starts the continuous background loop for ranking."""
        if self.is_running:
            return
        
        self.is_running = True
        logger.info("MATRIARCH_BACKFILL: Registry synchronization service STARTED.")
        
        while self.is_running:
            try:
                await self.run_cycle()
                # Run every 10 minutes to maintain Registry freshness
                await asyncio.sleep(600)
            except Exception as e:
                logger.error(f"Backfill loop error: {e}")
                await asyncio.sleep(60)

    async def run_cycle(self):
        """Single cycle of elite rank recalculation across the Registry."""
        logger.info("Executing Sanctuary Registry Sync Cycle...")
        
        # 1. Fetch all men from Turso
        # In a massive database, this should be paginated. 
        # For now, we process the active cadre.
        users = await turso_client.execute("SELECT user_id, profile_completeness, aadhaar_verified FROM profiles WHERE role = 'man'")
        
        if not users:
            logger.info("No aspirants found in Registry. Cycle skipped.")
            return
        
        for user in users:
            try:
                user_id = user["user_id"]
                
                # 2. Recalculate Base Score (Single Source of Truth)
                new_score = ranking_engine.calculate_base_score(
                    user.get("profile_completeness", 0),
                    bool(user.get("aadhaar_verified"))
                )
                
                # 3. Apply persistent boosts (if applicable from transactions or specific fields)
                # In this refactored simple model, we just update the base.
                # If we had a 'persistent_boost' column, we would add it here.
                
                # 4. Update the Registry
                await turso_client.execute(
                    "UPDATE profiles SET rank_score = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?",
                    [new_score, user_id]
                )
                
                # Throttle to avoid LibSQL overhead
                await asyncio.sleep(0.05)
                
            except Exception as e:
                logger.error(f"Registry Sync failed for user {user.get('user_id')}: {e}")
        
        logger.info(f"Registry Sync Cycle complete ({len(users)} profiles processed).")

    def stop_service(self):
        self.is_running = False
        logger.info("MATRIARCH_BACKFILL: Registry synchronization service STOPPED.")

backfill_service = BackfillService()
