from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import health, legal, verification, discovery, rank, auth, communication, safety, admin, quests
from app.core.config import settings
from app.services.backfill_service import backfill_service
from app.db.turso import turso_client
from fastapi import BackgroundTasks
import os

from contextlib import asynccontextmanager
import asyncio

@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- 1. Automated Turso Registry Migrations ---
    try:
        from app.db.migration_manager import migration_manager
        await migration_manager.run_migrations()
        print("🛠️ MATRIARCH_INIT: Turso Registry Schema verified/migrated.")
    except Exception as e:
        print(f"❌ MATRIARCH_INIT: Migration failure - {e}")

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
    allow_origins=[
        "http://localhost:5173",
        "https://www.matriarchindia.com",
        "https://matriarchindia.com",
        "https://matriarch-api.vercel.app",
        "https://projectartemis-rlah214kw-metachasm-2559s-projects.vercel.app"
    ],
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
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])
app.include_router(quests.router, prefix="/api/v1", tags=["Quests"])


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
