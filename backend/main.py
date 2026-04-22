import sys
import os
import traceback
from fastapi import FastAPI
from fastapi.responses import JSONResponse

# Ensure the current directory is in the path for Vercel
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Create a failsafe wrapper app so Vercel always finds a valid ASGI handler
app = FastAPI()

try:
    # Attempt to load the real application
    from app.main import app as real_app
    # Mount the real app at the root
    app.mount("/", real_app)
except Exception as e:
    # If the real app crashes on import, capture the traceback
    err_traceback = traceback.format_exc()
    print("CRITICAL STARTUP ERROR:")
    print(err_traceback)
    
    # Define a catch-all route that returns the exact error
    @app.api_route("/{path_name:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"])
    async def catch_all(path_name: str):
        return JSONResponse(
            status_code=500,
            content={
                "error": "MATRIARCH_STARTUP_CRASH",
                "message": str(e),
                "traceback": err_traceback.split("\n")
            }
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
