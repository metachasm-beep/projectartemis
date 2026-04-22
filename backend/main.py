from app.main import app as fastapi_app

# Vercel looks for a top-level "app" variable
app = fastapi_app

@app.get("/")
async def vercel_root():
    return {"status": "online", "message": "MATRIARCH API (Vercel Runtime)"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
