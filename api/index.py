import sys
import os
import traceback
from fastapi import FastAPI
from fastapi.responses import JSONResponse

# Add the backend directory to sys.path so we can import the app
backend_path = os.path.join(os.path.dirname(__file__), '..', 'backend')
sys.path.append(backend_path)

app = FastAPI()
startup_error = None

try:
    from app.main import app as real_app
    app.mount("/", real_app)
except Exception:
    startup_error = traceback.format_exc()

@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"])
async def catch_all(path: str):
    if startup_error:
        return JSONResponse(
            status_code=500,
            content={
                "error": "BACKEND_BRIDGE_FAILED",
                "traceback": startup_error.split("\n"),
                "sys_path": sys.path,
                "backend_path": backend_path,
                "exists": os.path.exists(os.path.join(backend_path, 'app', 'main.py'))
            }
        )
    return JSONResponse(status_code=404, content={"error": "Not Found"})
