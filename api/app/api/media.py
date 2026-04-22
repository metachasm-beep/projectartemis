from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.core.config import settings

router = APIRouter()

def _get_cloudinary_uploader():
    """Lazy-load cloudinary to prevent startup crash if not configured."""
    import cloudinary
    import cloudinary.uploader
    cloud_name = settings.CLOUDINARY_CLOUD_NAME or settings.VITE_CLOUDINARY_CLOUD_NAME
    if cloud_name and settings.CLOUDINARY_API_KEY and settings.CLOUDINARY_API_SECRET:
        cloudinary.config(
            cloud_name=cloud_name,
            api_key=settings.CLOUDINARY_API_KEY,
            api_secret=settings.CLOUDINARY_API_SECRET,
            secure=True
        )
    return cloudinary.uploader

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
        uploader = _get_cloudinary_uploader()
        result = uploader.destroy(request.public_id)
        
        if result.get("result") == "ok":
            return {"status": "success", "message": f"Resource {request.public_id} purged."}
        else:
            return {"status": "error", "message": result.get("result", "Unknown error during deletion.")}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
