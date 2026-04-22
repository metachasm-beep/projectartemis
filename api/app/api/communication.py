from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from pydantic import BaseModel
from app.db.turso import turso_client
from app.core.security import auth_bearer
from datetime import datetime
import json

router = APIRouter(prefix="/comm", tags=["communication"])

class CommModeRequest(BaseModel):
    mode: str # 'none', 'chat', 'voice_request', etc.

class MessageRequest(BaseModel):
    content: str
    message_type: str = "text"

@router.post("/resonances/{resonance_id}/mode")
async def set_communication_mode(
    resonance_id: str, 
    request: CommModeRequest, 
    user: dict = Depends(auth_bearer)
):
    """Sets the communication mode. Only the Matriarch (woman) can do this."""
    
    # 1. Verify resonance and woman_id
    res = await turso_client.execute("SELECT * FROM resonances WHERE id = ?", [resonance_id])
    if not res.rows:
        raise HTTPException(status_code=404, detail="Resonance connection not found")
    
    resonance = res.rows[0]
    # Check if the authenticated user is the Matriarch of this resonance
    if resonance["woman_id"] != user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Only the Matriarch can govern communication modes within this resonance."
        )

    # 2. Update Registry
    await turso_client.execute(
        "UPDATE resonances SET comm_mode = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [request.mode, resonance_id]
    )

    return {"status": "success", "mode": request.mode, "governed_by": user["id"]}

@router.post("/resonances/{resonance_id}/messages")
async def send_message(
    resonance_id: str, 
    request: MessageRequest, 
    user: dict = Depends(auth_bearer)
):
    """Sends a message, enforcing Matriarchal protocols."""
    
    # 1. Fetch resonance state
    res = await turso_client.execute("SELECT * FROM resonances WHERE id = ?", [resonance_id])
    if not res.rows:
        raise HTTPException(status_code=404, detail="Resonance connection not found")
    
    resonance = res.rows[0]
    comm_mode = resonance["comm_mode"]
    
    # 2. Protocol Enforcement
    is_woman = (user["id"] == resonance["woman_id"])
    is_man = (user["id"] == resonance["man_id"])

    if not is_woman and not is_man:
         raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Identity not associated with this resonance path.")

    # "Her Terms": If communication is 'none', Aspirants cannot transmit.
    if not is_woman and comm_mode == "none":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Communication is currently on HOLD by the Matriarch. Transmission blocked."
        )

    # 3. Insert into Registry
    msg_id = f"msg_{int(datetime.now().timestamp())}_{user['id'][:4]}"
    await turso_client.execute(
        "INSERT INTO messages (id, resonance_id, sender_id, content, message_type) VALUES (?, ?, ?, ?, ?)",
        [msg_id, resonance_id, user["id"], request.content, request.message_type]
    )

    # 4. Update Heartbeat
    await turso_client.execute(
        "UPDATE resonances SET updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [resonance_id]
    )

    return {"status": "transmitted", "message_id": msg_id, "mode": comm_mode}

@router.get("/resonances/{resonance_id}/history")
async def get_message_history(resonance_id: str, user: dict = Depends(auth_bearer)):
    """Fetches full dialogue history for a resonance. Gated by identity."""
    
    # Check if user belongs to this resonance
    res = await turso_client.execute("SELECT * FROM resonances WHERE id = ?", [resonance_id])
    if not res.rows:
        raise HTTPException(status_code=404, detail="Resonance connection not found")
    
    resonance = res.rows[0]
    if user["id"] not in [resonance["woman_id"], resonance["man_id"]]:
        raise HTTPException(status_code=403, detail="Dialogue history is sovereign and restricted.")

    messages = await turso_client.execute(
        "SELECT * FROM messages WHERE resonance_id = ? ORDER BY created_at ASC",
        [resonance_id]
    )
    return messages.rows
