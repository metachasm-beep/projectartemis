from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
from app.db.turso import turso_client
from app.core.security import auth_bearer
from datetime import datetime, date, timedelta
import uuid

router = APIRouter(prefix="/quests", tags=["quests"])

class QuestResponse(BaseModel):
    id: str
    title: str
    description: str
    objective_type: str
    aura_reward: int
    rank_reward: float
    is_daily: bool
    status: str # 'available', 'in_progress', 'completed'
    progress_pct: float

# 🏆 SEED QUESTS (Internal helper to ensure Registry has merits)
async def ensure_base_quests():
    """Ensures foundational merits exist in the Registry."""
    base_quests = [
        ("q_journal_entry", "The Scholar's Path", "Share a 'Journal' entry about your recent growth.", "journal", 25, 15.0, 1),
        ("q_profile_elite", "Dossier Excellence", "Reach 100% profile completeness.", "profile", 50, 30.0, 0),
        ("q_daily_login", "The Dedicated", "Confirm your presence in the Sanctuary today.", "daily_login", 10, 5.0, 1)
    ]
    
    for q_id, title, desc, q_type, aura, rank, is_daily in base_quests:
        await turso_client.execute(
            "INSERT OR IGNORE INTO quests (id, title, description, objective_type, aura_reward, rank_reward, is_daily) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [q_id, title, desc, q_type, aura, rank, is_daily]
        )

@router.get("")
async def get_merit_board(user: dict = Depends(auth_bearer)):
    """Fetches all merits and their current standing for the user."""
    user_id = user["id"]
    await ensure_base_quests()

    # 1. Sync / Calculate dynamic progress
    await sync_user_merits(user_id)

    # 2. Fetch Quest State
    sql = """
    SELECT q.*, COALESCE(uq.status, 'available') as status, COALESCE(uq.progress_pct, 0.0) as progress_pct
    FROM quests q
    LEFT JOIN user_quests uq ON q.id = uq.quest_id AND uq.user_id = ?
    """
    res = await turso_client.execute(sql, [user_id])
    
    return [QuestResponse(**row) for row in res.rows]

async def sync_user_merits(user_id: str):
    """
    Calculates progress for active quests based on Registry state.
    Includes 'In Progress' draft logic for journal entries.
    """
    now = datetime.now()
    today_start = datetime.combine(date.today(), datetime.min.time()).isoformat()

    # A. JOURNAL PROGRESS: Check blog_submissions for drafts (pending) or approved entries
    # Draft = 50% if pending, 100% if approved today
    blog_res = await turso_client.execute(
        "SELECT status, created_at FROM blog_submissions WHERE author_id = ? ORDER BY created_at DESC LIMIT 1",
        [user_id]
    )
    
    journal_progress = 0.0
    if blog_res.rows:
        latest = blog_res.rows[0]
        if latest["status"] == "approved" and latest["created_at"] >= today_start:
            journal_progress = 100.0
        elif latest["status"] == "pending":
            journal_progress = 50.0

    # B. PROFILE PROGRESS: Direct pull from male_rank_profiles
    prof_res = await turso_client.execute("SELECT profile_completeness FROM male_rank_profiles WHERE user_id = ?", [user_id])
    profile_progress = prof_res.rows[0].get("profile_completeness", 0.0) if prof_res.rows else 0.0

    # C. DAILY LOGIN PROGRESS: Handled by heartbeat usually, but we sync here
    # We update user_quests if not already completed today
    
    quests_to_update = [
        ("q_journal_entry", journal_progress),
        ("q_profile_elite", profile_progress),
        ("q_daily_login", 100.0) # Assume completed if they hit this sync endpoint
    ]

    for q_id, progress in quests_to_update:
        status_str = "completed" if progress >= 100.0 else ("in_progress" if progress > 0 else "available")
        
        # Upsert user_quest
        # For daily quests, we handle refresh logic
        await turso_client.execute(
            """
            INSERT INTO user_quests (user_id, quest_id, status, progress_pct, last_synced_at)
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(user_id, quest_id) DO UPDATE SET
            progress_pct = CASE WHEN status = 'completed' THEN 100.0 ELSE EXCLUDED.progress_pct END,
            status = CASE WHEN status = 'completed' THEN 'completed' ELSE EXCLUDED.status END,
            last_synced_at = CURRENT_TIMESTAMP
            """,
            [user_id, q_id, status_str, progress]
        )

@router.post("/claim/{quest_id}")
async def claim_merit_reward(quest_id: str, user: dict = Depends(auth_bearer)):
    """
    Validates achievement and awards 🟡 Aura tokens and Standing points.
    """
    user_id = user["id"]
    
    # 1. Verify achievement state
    res = await turso_client.execute(
        "SELECT uq.*, q.aura_reward, q.rank_reward, q.is_daily FROM user_quests uq JOIN quests q ON uq.quest_id = q.id WHERE uq.user_id = ? AND uq.quest_id = ?",
        [user_id, quest_id]
    )
    
    if not res.rows:
        raise HTTPException(status_code=404, detail="Merit achievement not found.")
    
    record = res.rows[0]
    if record["status"] != "in_progress" and record["progress_pct"] < 100:
         raise HTTPException(status_code=400, detail="Merit requirements not yet satisfied.")
    
    if record["status"] == "completed":
        raise HTTPException(status_code=400, detail="Reward already claimed into your Registry.")

    # 2. ATOMIC DISBURSEMENT: Award 🟡 Tokens and Rank points
    tx_id = f"merit_{int(datetime.now().timestamp())}"
    now = datetime.now()
    refresh_at = (now + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0).isoformat() if record["is_daily"] else None

    try:
        await turso_client.batch([
            # Update user_quest status
            f"UPDATE user_quests SET status = 'completed', progress_pct = 100.0, completed_at = CURRENT_TIMESTAMP, refresh_at = '{refresh_at}' WHERE user_id = '{user_id}' AND quest_id = '{quest_id}'",
            # Update Profile Balances
            f"UPDATE profiles SET tokens = tokens + {record['aura_reward']}, rank_score = rank_score + {record['rank_reward']} WHERE user_id = '{user_id}'",
            # Log Transaction
            f"INSERT INTO point_transactions (id, user_id, delta, transaction_type, notes) VALUES ('{tx_id}', '{user_id}', {record['aura_reward']}, 'merit_reward', 'Completed merit: {quest_id}')"
        ])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registry disbursement failure: {str(e)}")

    return {
        "status": "success",
        "awarded_aura": record["aura_reward"],
        "awarded_rank": record["rank_reward"],
        "message": "Protocol rewards sealed."
    }
