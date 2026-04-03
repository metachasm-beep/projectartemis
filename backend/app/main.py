from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import health, legal, verification, discovery, rank, auth, communication, safety
from app.core.config import settings
from app.services.backfill_service import backfill_service
from fastapi import BackgroundTasks

from contextlib import asynccontextmanager
import asyncio

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start backfill service in the background
    asyncio.create_task(backfill_service.start_service())
    yield
    # Stop backfill service on shutdown
    backfill_service.stop_service()

app = FastAPI(
    title="MATRIARCH API",
    description="High-tech, women-first dating platform backend",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Core routes
app.include_router(health.router, prefix="/api/v1", tags=["Health"])
app.include_router(legal.router, prefix="/api/v1/legal", tags=["Legal"])
app.include_router(verification.router, prefix="/api/v1/verification", tags=["Verification"])
app.include_router(discovery.router, prefix="/api/v1/discovery", tags=["Discovery"])
app.include_router(rank.router, prefix="/api/v1/rank", tags=["Rank"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(communication.router, prefix="/api/v1/communication", tags=["Communication"])


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
