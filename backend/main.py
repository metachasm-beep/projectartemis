try:
    from app.main import app as fastapi_app
    app = fastapi_app
except Exception as e:
    # 🕵️ DIAGNOSTIC_BRIDGE: Capture startup crashes and report them as JSON
    from fastapi import FastAPI
    from fastapi.responses import JSONResponse
    app = FastAPI()
    
    @app.get("/{full_path:path}")
    async def crash_report(full_path: str):
        return JSONResponse(
            status_code=500,
            content={
                "status": "CRASHED_ON_STARTUP",
                "error": str(e),
                "hint": "Check requirements.txt or internal imports."
            }
        )

@app.get("/")
async def vercel_root():
    return {"status": "online", "message": "MATRIARCH API (Vercel Runtime)"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
