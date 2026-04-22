from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI()

@app.get("/api/v1/health")
async def health():
    return {"status": "ok", "message": "Bridge is healthy!"}

@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"])
async def catch_all(path: str):
    return JSONResponse(content={"error": "Not Found", "path": path}, status_code=404)

