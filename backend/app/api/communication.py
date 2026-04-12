from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from pydantic import BaseModel
from app.db.turso import turso_client
from datetime import datetime
import json

router = APIRouter(prefix="/comm", tags=["communication"])

class CommModeRequest(BaseModel):
    mode: str # 'none', 'chat', 'voice_request', etc.

class MessageRequest(BaseModel):
    content: str
    message_type: str = "text"

@router.post("/resonances/{resonance_id}/mode")
async def set_communication_mode(resonance_id: str, request: CommModeRequest, user_id: str):
    """Sets the communication mode. Only the Matriarch (woman) can do this."""
    
    # 1. Verify resonance and woman_id
    res = await turso_client.execute("SELECT * FROM resonances WHERE id = ?", [resonance_id])
    if not res:
        raise HTTPException(status_code=404, detail="Resonance connection not found")
    
    resonance = res[0]
    if resonance["woman_id"] != user_id:
        raise HTTPException(status_code=403, detail="Only the Matriarch can govern communication modes")

    # 2. Update Registry
    await turso_client.execute(
        "UPDATE resonances SET comm_mode = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [request.mode, resonance_id]
    )

    return {"status": "success", "mode": request.mode}

@router.post("/resonances/{resonance_id}/messages")
async def send_message(resonance_id: str, request: MessageRequest, sender_id: str):
    """Sends a message, enforcing Matriarchal protocols."""
    
    # 1. Fetch resonance state
    res = await turso_client.execute("SELECT * FROM resonances WHERE id = ?", [resonance_id])
    if not res:
        raise HTTPException(status_code=404, detail="Resonance connection not found")
    
    resonance = res[0]
    comm_mode = resonance["comm_mode"]
    
    # 2. Protocol Enforcement
    is_woman = (sender_id == resonance["woman_id"])
    if not is_woman and comm_mode == "none":
        raise HTTPException(status_code=403, detail="Communication is currently on HOLD by the Matriarch")

    # 3. Insert into Registry
    msg_id = f"msg_{int(datetime.now().timestamp())}"
    await turso_client.execute(
        "INSERT INTO messages (id, resonance_id, sender_id, content, message_type) VALUES (?, ?, ?, ?, ?)",
        [msg_id, resonance_id, sender_id, request.content, request.message_type]
    )

    # 4. Update Heartbeat
    await turso_client.execute(
        "UPDATE resonances SET updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [resonance_id]
    )

    return {"status": "sent", "message_id": msg_id}

@router.get("/resonances/{resonance_id}/history")
async def get_message_history(resonance_id: str):
    """Fetches full dialogue history for a resonance."""
    messages = await turso_client.execute(
        "SELECT * FROM messages WHERE resonance_id = ? ORDER BY created_at ASC",
        [resonance_id]
    )
    return messages
