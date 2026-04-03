from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from pydantic import BaseModel
from app.supabase import supabase_client
from app.models.user import UserRole
import uuid
from datetime import datetime, timezone

router = APIRouter(prefix="/comm", tags=["communication"])

class CommModeRequest(BaseModel):
    mode: str # 'none', 'chat', 'voice_request', 'video_request', 'delayed_unlock', 'qa_mode', 'prompt_intro'

class MessageRequest(BaseModel):
    content: str
    message_type: str = "text" # 'text', 'voice', 'intro_response'

@router.post("/matches/{match_id}/mode")
async def set_communication_mode(match_id: uuid.UUID, request: CommModeRequest, user_id: uuid.UUID):
    """
    Sets the communication mode for a match. Only the Matriarch can do this.
    """
    # 1. Verify match and Matriarch role
    match_res = supabase_client.table("matches").select("*").eq("id", str(match_id)).execute()
    if not match_res.data:
        raise HTTPException(status_code=404, detail="Match not found")
    
    match = match_res.data[0]
    if str(match["woman_id"]) != str(user_id):
        raise HTTPException(status_code=403, detail="Only the Matriarch can set communication modes")

    # 2. Update match mode
    supabase_client.table("matches").update({
        "comm_mode": request.mode,
        "comm_mode_set_at": datetime.now(timezone.utc).isoformat(),
        "comm_mode_unlocked": True if request.mode != 'none' else False
    }).eq("id", str(match_id)).execute()

    return {"status": "success", "mode": request.mode}

@router.post("/conversations/{conversation_id}/messages")
async def send_message(conversation_id: uuid.UUID, request: MessageRequest, sender_id: uuid.UUID):
    """
    Sends a message in a conversation, enforcing the Matriarch's chosen communication mode.
    """
    # 1. Fetch conversation and associated match
    conv_res = supabase_client.table("conversations").select("*, matches(*)").eq("id", str(conversation_id)).execute()
    if not conv_res.data:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    conversation = conv_res.data[0]
    match = conversation["matches"]
    comm_mode = match["comm_mode"]
    
    # 2. Verify sender is part of the match
    if str(sender_id) not in [str(match["woman_id"]), str(match["man_id"])]:
        raise HTTPException(status_code=403, detail="Not authorized to send messages in this conversation")

    # 3. Enforce Communication Mode
    is_woman = str(sender_id) == str(match["woman_id"])
    
    if not is_woman: # Petitioner (Man) enforcement
        if comm_mode == "none":
            raise HTTPException(status_code=403, detail="Communication is currently on HOLD by the Matriarch")
        
        if comm_mode == "prompt_intro" and request.message_type != "intro_response":
             raise HTTPException(status_code=403, detail="Matriarch requires a directed intro response first")

    # 4. Insert message
    message_res = supabase_client.table("messages").insert({
        "conversation_id": str(conversation_id),
        "sender_id": str(sender_id),
        "content": request.content,
        "message_type": request.message_type
    }).execute()

    # 5. Update conversation timestamp
    supabase_client.table("conversations").update({
        "last_message_at": datetime.now(timezone.utc).isoformat()
    }).eq("id", str(conversation_id)).execute()

    return {"status": "sent", "message_id": message_res.data[0]["id"] if message_res.data else None}
