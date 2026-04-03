from app.db.supabase import supabase_client
import uuid
from datetime import datetime, timezone

class RankService:
    @staticmethod
    async def calculate_man_rank(user_id: uuid.UUID):
        """
        Calculates and updates the rank for a male user.
        Factors:
        - Profile Completeness (up to 40 points)
        - Aadhaar Verification (+30 points)
        - Referral Count (+10 per verified referral, max 50)
        - Activity (Participation in safe communication)
        """
        # Fetch profile
        profile_res = supabase_client.table("profiles").select("*").eq("user_id", str(user_id)).execute()
        if not profile_res.data:
            return None
        
        profile = profile_res.data[0]
        score = 0.0
        
        # 1. Completeness
        completeness = profile.get("completeness_score", 0)
        score += (completeness / 100.0) * 40.0
        
        # 2. Aadhaar
        if profile.get("aadhaar_verified"):
            score += 30.0
            
        # 3. Referrals (Count verified users they invited)
        referral_res = supabase_client.table("invite_codes") \
            .select("id") \
            .eq("creator_id", str(user_id)) \
            .eq("is_used", True) \
            .execute()
        
        referral_count = len(referral_res.data) if referral_res.data else 0
        score += min(referral_count * 10.0, 50.0)
        
        # Determine Tier
        tier = "BRONZE"
        if score >= 90:
            tier = "SOVEREIGN_ELITE"
        elif score >= 70:
            tier = "GOLD"
        elif score >= 40:
            tier = "SILVER"
            
        # Update MaleRankProfile (or Profile if merged)
        # Assuming we update the MaleRankProfile table
        update_data = {
            "rank_score": score,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        supabase_client.table("male_rank_profiles").update(update_data).eq("user_id", str(user_id)).execute()
        
        # Also update the profile's cached tier for quick discovery
        supabase_client.table("profiles").update({"rank_tier": tier, "rank_score": score}).eq("user_id", str(user_id)).execute()
        
        return score, tier

rank_service = RankService()
