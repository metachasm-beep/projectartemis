from app.db.supabase import supabase_client
from app.services.rank_service import rank_service
import asyncio
import logging

logger = logging.getLogger(__name__)

class BackfillService:
    def __init__(self):
        self.is_running = False

    async def run_elite_backfill(self):
        """
        Ongoing background service to re-calculate ranks for all men.
        In a production environment, this could be triggered by a CRON job.
        For Vercel, we can run it as a BackgroundTask on specific events.
        """
        if self.is_running:
            logger.info("Backfill already in progress.")
            return
        
        self.is_running = True
        try:
            logger.info("Starting Elite Backfill process...")
            
            # Fetch all active men
            # Using pagination for scale
            limit = 100
            offset = 0
            
            while True:
                response = supabase_client.table("users") \
                    .select("id") \
                    .eq("role", "man") \
                    .eq("is_active", True) \
                    .range(offset, offset + limit - 1) \
                    .execute()
                
                users = response.data
                if not users:
                    break
                
                for user in users:
                    await rank_service.calculate_man_rank(user["id"])
                    # Small sleep to prevent rate limiting Supabase
                    await asyncio.sleep(0.1)
                
                offset += limit
                
            logger.info("Elite Backfill completed successfully.")
        except Exception as e:
            logger.error(f"Error during backfill: {str(e)}")
        finally:
            self.is_running = False

backfill_service = BackfillService()
