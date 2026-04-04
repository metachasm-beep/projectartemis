from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import cloudinary
import cloudinary.uploader
from app.core.config import settings

router = APIRouter()

# Configure Cloudinary
if settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY and settings.CLOUDINARY_API_SECRET:
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
        secure=True
    )

class DeleteMediaRequest(BaseModel):
    public_id: str

@router.post("/delete")
async def delete_media(request: DeleteMediaRequest):
    """
    Securely deletes a resource from Cloudinary via Public ID.
    Requires backend API credentials.
    """
    if not settings.CLOUDINARY_API_SECRET:
        raise HTTPException(status_code=500, detail="Cloudinary credentials not configured on server.")

    try:
        # Use cloudinary.uploader.destroy for secure deletion
        result = cloudinary.uploader.destroy(request.public_id)
        
        if result.get("result") == "ok":
            return {"status": "success", "message": f"Resource {request.public_id} purged."}
        else:
            return {"status": "error", "message": result.get("result", "Unknown error during deletion.")}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
