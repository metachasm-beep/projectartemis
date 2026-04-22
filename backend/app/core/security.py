from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
from app.core.config import settings
from typing import Optional
import logging

# Lazy initialization for Supabase client
_supabase: Optional[Client] = None

def get_supabase() -> Client:
    global _supabase
    if _supabase is None:
        if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
            raise ValueError("SUPABASE_CONFIG_ERROR: Missing SUPABASE_URL or SUPABASE_KEY in environment.")
        _supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    return _supabase

logger = logging.getLogger(__name__)

class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request) -> Optional[dict]:
        credentials: Optional[HTTPAuthorizationCredentials] = await super(JWTBearer, self).__call__(request)
        
        token = None
        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid authentication scheme.")
            token = credentials.credentials
        else:
            # Check for token in cookies if Authorization header is missing
            token = request.cookies.get("access_token")
            
        if not token:
            if self.auto_error:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Authentication token required.")
            return None

        try:
            # This call handles token verification and returns the user object
            user_res = get_supabase().auth.get_user(token)
            if not user_res or not user_res.user:
                 raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
            
            # Return the user object so it can be used in dependencies
            return {
                "id": user_res.user.id,
                "email": user_res.user.email,
                "role": user_res.user.user_metadata.get("role", "aspirant")
            }
        except Exception as e:
            logger.error(f"JWT_VERIFICATION_FAILED: {str(e)}")
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Authentication failed: {str(e)}")

# Dependency for routes
auth_bearer = JWTBearer()
