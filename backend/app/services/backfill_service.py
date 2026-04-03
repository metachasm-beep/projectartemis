from app.db.supabase import supabase_client
from app.services.rank_service import rank_service
import asyncio
import logging

logger = logging.getLogger(__name__)

class BackfillService:
    def __init__(self):
        self.is_running = False

    async def start_service(self):
        """
        Starts the continuous background loop for ranking.
        """
        if self.is_running:
            return
        
        self.is_running = True
        logger.info("Elite Backfill Service STARTED.")
        
        while self.is_running:
            try:
                await self.run_cycle()
                # Run every 5 minutes
                await asyncio.sleep(300)
            except Exception as e:
                logger.error(f"Backfill loop error: {e}")
                await asyncio.sleep(60)

    async def run_cycle(self):
        """
        Single cycle of rank recalculation.
        """
        logger.info("Executing Rank Calculation Cycle...")
        # Fetch all active men
        limit = 100
        offset = 0
        
        while True:
            response = supabase_client.table("users") \
                .select("id") \
                .eq("role", "man") \
                .range(offset, offset + limit - 1) \
                .execute()
            
            users = response.data
            if not users:
                break
            
            for user in users:
                try:
                    await rank_service.calculate_man_rank(user["id"])
                    await asyncio.sleep(0.05) # Throttle
                except Exception as e:
                    logger.error(f"Failed to rank user {user['id']}: {e}")
            
            offset += limit
        logger.info("Cycle complete.")

    def stop_service(self):
        self.is_running = False
        logger.info("Elite Backfill Service STOPPED.")

backfill_service = BackfillService()
