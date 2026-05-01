from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import health, legal, verification, discovery, rank, auth, communication, safety, admin, quests, agentic, influencer, payments
from app.core.config import settings
from app.services.backfill_service import backfill_service
from app.db.turso import turso_client
from fastapi import BackgroundTasks
import os

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

app = FastAPI(
    title="MATRIARCH API",
    description="High-tech, women-first dating platform backend",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

CORS_ALLOWED_ORIGINS = [
    "https://www.matriarchindia.com",
    "https://matriarchindia.com",
    "https://matriarch-pwa.vercel.app",
    "https://matriarch-api.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
]

def _is_allowed_origin(origin: str | None) -> bool:
    if not origin:
        return False
    if origin in CORS_ALLOWED_ORIGINS:
        return True
    return origin.endswith(".vercel.app") or origin.endswith("matriarchindia.com")

class SafetyCORSMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        origin = request.headers.get("origin", "")

        # ✅ Short-circuit all CORS preflight (OPTIONS) requests immediately.
        # Forwarding them downstream causes a 405 from the router, which strips headers.
        if request.method == "OPTIONS":
            response = Response(status_code=200)
            if _is_allowed_origin(origin):
                response.headers["Access-Control-Allow-Origin"] = origin
                response.headers["Access-Control-Allow-Credentials"] = "true"
                response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
                response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, Accept, X-Requested-With, X-CSRF-Token"
                response.headers["Access-Control-Max-Age"] = "86400"
            return response

        # For normal requests, proceed then inject headers
        response = await call_next(request)
        if _is_allowed_origin(origin):
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
            response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, Accept, X-Requested-With, X-CSRF-Token"
        return response

app.add_middleware(SafetyCORSMiddleware)

from fastapi.responses import JSONResponse

@app.exception_handler(ValueError)
async def value_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"error": "CONFIGURATION_ERROR", "message": str(exc)},
    )

# Core routes
app.include_router(health.router, prefix="/api/v1", tags=["Health"])
app.include_router(legal.router, prefix="/api/v1", tags=["Legal"])
app.include_router(verification.router, prefix="/api/v1", tags=["Verification"])
app.include_router(discovery.router, prefix="/api/v1", tags=["Discovery"])
app.include_router(rank.router, prefix="/api/v1", tags=["Rank"])
app.include_router(auth.router, prefix="/api/v1", tags=["Auth"])
app.include_router(communication.router, prefix="/api/v1", tags=["Communication"])
app.include_router(admin.router, prefix="/api/v1", tags=["Admin"])
app.include_router(safety.router, prefix="/api/v1", tags=["Safety"])
app.include_router(quests.router, prefix="/api/v1", tags=["Quests"])
app.include_router(agentic.router, prefix="/api/v1", tags=["Agentic"])
app.include_router(influencer.router, prefix="/api/v1", tags=["Influencer"])
app.include_router(payments.router, prefix="/api/v1", tags=["Payments"])


@app.post("/api/v1/admin/trigger-backfill", tags=["Admin"])
async def trigger_backfill(background_tasks: BackgroundTasks):
    """
    Triggers the Elite Backfill process in the background.
    """
    background_tasks.add_task(backfill_service.run_elite_backfill)
    return {"message": "Elite Backfill started in background."}


@app.get("/")
async def root():
    return {
        "message": "MATRIARCH API — Women-First Selection Platform",
        "status": "active",
        "docs": "/api/docs",
        "version": "1.0.0",
    }
