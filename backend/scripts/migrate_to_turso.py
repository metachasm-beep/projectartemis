import asyncio
import os
import sys
import json

# Add parent directory to path to import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.supabase import supabase_client
from app.db.turso import turso_client

async def migrate():
    print("MATRIARCH_MIGRATION: Starting Supabase -> Turso data transfer...")

    # 1. Fetch Profiles
    print("Fetching profiles from Supabase...")
    profiles_res = supabase_client.table("profiles").select("*").execute()
    profiles = profiles_res.data
    print(f"Found {len(profiles)} profiles.")

    # 2. Fetch Male Rank Profiles
    print("Fetching rank profiles from Supabase...")
    rank_res = supabase_client.table("male_rank_profiles").select("*").execute()
    ranks = {r["user_id"]: r for r in rank_res.data}
    print(f"Found {len(ranks)} rank profiles.")

    # 3. Prepare Batch Inserts for Turso
    print("Migrating to Turso Registry...")
    
    for p in profiles:
        user_id = p.get("user_id")
        if not user_id: continue
        
        # Merge rank data if available
        r = ranks.get(user_id, {})
        
        # Profile data
        profile_sql = """
        INSERT OR REPLACE INTO profiles (
            user_id, full_name, city, bio, photos, role, 
            is_verified, aadhaar_verified, points, tokens, 
            rank_score, rank_tier, occupation, height, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        
        # Convert photos to JSON string if it's a list
        photos = p.get("photos", "[]")
        if isinstance(photos, list):
            photos = json.dumps(photos)
            
        role = p.get("role") or p.get("user_role") or "man"
        
        profile_params = [
            user_id,
            p.get("full_name"),
            p.get("city"),
            p.get("bio"),
            photos,
            role,
            1 if p.get("is_verified") else 0,
            1 if p.get("aadhaar_verified") else 0,
            p.get("points", 0),
            p.get("tokens", 0),
            p.get("rank_score", 0.0) or r.get("rank_score", 0.0),
            p.get("rank_tier") or r.get("rank_tier") or "Aspirant",
            p.get("occupation"),
            p.get("height"),
            p.get("created_at")
        ]
        
        await turso_client.execute(profile_sql, profile_params)

        # If it's a man, also populate male_rank_profiles
        if role == "man":
            rank_sql = """
            INSERT OR REPLACE INTO male_rank_profiles (
                user_id, rank_score, rank_tier, profile_completeness, 
                referral_count, last_active, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            """
            rank_params = [
                user_id,
                r.get("rank_score") or p.get("rank_score", 0.0),
                r.get("rank_tier") or p.get("rank_tier") or "Aspirant",
                p.get("completeness_score", 0.0),
                r.get("referral_count", 0),
                r.get("last_active"),
                r.get("updated_at")
            ]
            await turso_client.execute(rank_sql, rank_params)

    print("MATRIARCH_MIGRATION: Data transfer complete.")

if __name__ == "__main__":
    asyncio.run(migrate())
