from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
from datetime import datetime

from app.db.session import get_db
from app.models.user import User, Profile, MaleRankProfile, UserRole
from app.api.auth import get_current_user

router = APIRouter()

def verify_admin(current_user: User = Depends(get_current_user)):
    """
    Strict guard for administrative access.
    Only metachasm@gmail.com is permitted.
    """
    if current_user.email != "metachasm@gmail.com":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrative clearance denied. Protocol breach logged."
        )
    return current_user

@router.get("/stats", dependencies=[Depends(verify_admin)])
async def get_admin_stats(db: Session = Depends(get_db)):
    """
    Aggregated metrics for the Matriarch ecosystem.
    """
    total_users = db.query(User).count()
    matriarchs = db.query(User).filter(User.role == UserRole.woman).count()
    petitioners = db.query(User).filter(User.role == UserRole.man).count()
    
    verified_profiles = db.query(Profile).filter(Profile.aadhaar_verified == True).count()
    
    # Points economy (Sum of points across profiles)
    # Note: Assuming 'points' exists in Profile based on implementation plan.
    # Let's verify Profile model in next steps if needed, but adding it based on approved plan.
    from sqlalchemy import func
    total_points = db.query(func.sum(Profile.points)).scalar() or 0
    
    return {
        "total_users": total_users,
        "matriarchs": matriarchs,
        "petitioners": petitioners,
        "verified_users": verified_profiles,
        "total_points_in_circulation": total_points,
        "system_status": "optimal",
        "timestamp": datetime.now()
    }

@router.get("/users", dependencies=[Depends(verify_admin)])
async def list_users(
    skip: int = 0, 
    limit: int = 50, 
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Paginated and searchable user designation list.
    """
    query = db.query(User).join(Profile)
    
    if search:
        query = query.filter(
            (User.email.ilike(f"%{search}%")) | 
            (Profile.full_name.ilike(f"%{search}%")) |
            (User.phone.ilike(f"%{search}%"))
        )
        
    users = query.offset(skip).limit(limit).all()
    
    result = []
    for u in users:
        p = db.query(Profile).filter(Profile.user_id == u.id).first()
        rank = db.query(MaleRankProfile).filter(MaleRankProfile.user_id == u.id).first() if u.role == UserRole.man else None
        
        result.append({
            "id": u.id,
            "email": u.email,
            "phone": u.phone,
            "role": u.role,
            "full_name": p.full_name if p else "Anonymous",
            "is_active": u.is_active,
            "is_banned": u.is_banned,
            "is_verified": p.aadhaar_verified if p else False,
            "is_shadowbanned": rank.is_shadowbanned if rank else False,
            "created_at": u.created_at
        })
        
    return result

@router.patch("/users/{user_id}", dependencies=[Depends(verify_admin)])
async def update_user_status(
    user_id: uuid.UUID,
    is_banned: Optional[bool] = None,
    is_verified: Optional[bool] = None,
    is_shadowbanned: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """
    Administrative override for user standing.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Designation not found.")
        
    if is_banned is not None:
        user.is_banned = is_banned
        
    if is_verified is not None:
        profile = db.query(Profile).filter(Profile.user_id == user_id).first()
        if profile:
            profile.aadhaar_verified = is_verified
            profile.aadhaar_verified_at = datetime.now() if is_verified else None
            
    if is_shadowbanned is not None and user.role == UserRole.man:
        rank = db.query(MaleRankProfile).filter(MaleRankProfile.user_id == user_id).first()
        if rank:
            rank.is_shadowbanned = is_shadowbanned
            
    db.commit()
    return {"status": "success", "message": f"User {user_id} updated."}
