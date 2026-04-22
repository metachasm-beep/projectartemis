from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
from app.core.config import settings
from typing import Optional
import logging
import firebase_admin
from firebase_admin import auth as firebase_auth

# Lazy initialization for Supabase client
_supabase: Optional[Client] = None

def get_supabase() -> Client:
    global _supabase
    if _supabase is None:
        url = settings.SUPABASE_URL
        key = settings.SUPABASE_ANON_KEY  # matches Vercel env var name
        if not url or not key:
            raise ValueError("SUPABASE_CONFIG_ERROR: Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment.")
        _supabase = create_client(url, key)
    return _supabase

logger = logging.getLogger(__name__)

# Initialize Firebase Admin for token verification
if not firebase_admin._apps:
    try:
        # For simple JWT verification, only the projectId is required
        # Extract project ID from env if possible, else fallback
        import os
        project_id = os.environ.get("VITE_FIREBASE_PROJECT_ID", "vetta-b7fc4")
        firebase_admin.initialize_app(options={'projectId': project_id})
    except Exception as e:
        logger.error(f"Failed to initialize Firebase Admin: {e}")

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
            token = request.cookies.get("access_token")
            
        if not token:
            if self.auto_error:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Authentication token required.")
            return None

        # Dual Verification Strategy
        try:
            user_data = None
            provider = None

            # Try Supabase Verification
            try:
                user_res = get_supabase().auth.get_user(token)
                if user_res and user_res.user:
                    user_data = {
                        "id": user_res.user.id,
                        "email": user_res.user.email,
                    }
                    provider = "supabase"
            except:
                pass

            # Try Firebase Verification if Supabase failed
            if not user_data:
                try:
                    decoded_token = firebase_auth.verify_id_token(token)
                    user_data = {
                        "id": decoded_token.get("uid"),
                        "email": decoded_token.get("email"),
                        "phone_number": decoded_token.get("phone_number"),
                    }
                    provider = "firebase"
                except Exception as e:
                    logger.error(f"FIREBASE_VERIFY_ERROR: {e}")
            
            if not user_data:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

            # 🏛️ REGISTRY SYNC: Fetch the authoritative role from Turso
            from app.db.turso import turso_client
            res = await turso_client.execute(
                "SELECT role FROM profiles WHERE user_id = ?", 
                [user_data["id"]]
            )
            
            # Default to aspirant if no profile found yet
            db_role = res.rows[0]["role"] if res.rows else "aspirant"

            return {
                **user_data,
                "role": db_role,
                "provider": provider
            }

        except Exception as e:
            logger.error(f"JWT_VERIFICATION_FAILED: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Authentication failed: Invalid identity token."
            )

        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

# Dependency for routes
auth_bearer = JWTBearer()
