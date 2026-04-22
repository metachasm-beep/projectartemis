import sys
import os
import traceback
from fastapi import FastAPI
from fastapi.responses import JSONResponse

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Define app at the absolute top level so Vercel's AST parser finds it immediately
app = FastAPI()

startup_error = None

try:
    from app.main import app as real_app
    app.mount("/", real_app)
except Exception as e:
    startup_error = traceback.format_exc()
    print("MATRIARCH_CRITICAL_STARTUP_ERROR:", startup_error)

@app.api_route("/{path_name:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"])
async def catch_all(path_name: str):
    if startup_error:
        return JSONResponse(
            status_code=500,
            content={
                "error": "MATRIARCH_STARTUP_CRASH",
                "message": "The backend failed to initialize on Vercel.",
                "traceback": startup_error.split("\n")
            }
        )
    return JSONResponse(status_code=404, content={"error": "Not Found"})
