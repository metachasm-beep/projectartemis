from app.main import app

# This exports the FastAPI instance for Vercel's Python runtime
# Vercel looks for a top-level "app", "application", or "handler"
application = app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
