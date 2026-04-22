import sys
import os
import traceback
from fastapi import FastAPI
from fastapi.responses import JSONResponse

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

app = FastAPI()
startup_error = None

try:
    from app.main import app as real_app
    app.mount("/", real_app)
except Exception:
    startup_error = traceback.format_exc()

@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
async def catch_all(path: str):
    if startup_error:
        # Also list installed packages to debug environment
        try:
            import pkg_resources
            installed = [f"{d.project_name}=={d.version}" for d in pkg_resources.working_set]
        except:
            installed = ["Could not list packages"]
            
        return JSONResponse(
            status_code=500,
            content={
                "error": "STARTUP_FAILED",
                "traceback": startup_error.split("\n"),
                "installed_packages": installed
            }
        )
    return JSONResponse(status_code=404, content={"error": "Not Found"})
