import sys
import os
from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI()

@app.get("/api/v1/audit")
async def audit():
    try:
        import httpx
        httpx_version = httpx.__version__
    except ImportError:
        httpx_version = "NOT INSTALLED"
        
    try:
        import fastapi
        fastapi_version = fastapi.__version__
    except ImportError:
        fastapi_version = "NOT INSTALLED"

    return {
        "python_version": sys.version,
        "cwd": os.getcwd(),
        "ls_root": os.listdir('.'),
        "ls_api": os.listdir('api') if os.path.exists('api') else "API FOLDER MISSING",
        "httpx": httpx_version,
        "fastapi": fastapi_version,
        "requirements_exists": os.path.exists('requirements.txt'),
        "backend_exists": os.path.exists('backend')
    }
