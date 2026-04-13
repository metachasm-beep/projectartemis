# ARCHITECTURE: MATRIARCH

**Status**: DRAFT
**System**: Distributed Monolith (Backend) + Mobile Client (Expo)

## 1. System Overview
MATRIARCH follows a client-server architecture with a clear separation between the selector interface (Women) and the dashboard interface (Men).

## 2. Infrastructure Layer
- **Storage**: Supabase Postgres for relational data.
- **Cache**: Redis for ranking cache, session tracking, and rate limiting.
- **Files**: S3-compatible storage for profile media (with moderation hooks).
- **Compute**: FastAPI (Uvicorn), Background Workers (Arq/Celery).

## 3. Application Components
### A. Ranking Service
- Weighted score calculation.
- Decay functions for inactivity.
- Penalty application for negative reports.
- Real-time rank monitoring for men.

### B. Selection Engine
- Compatibility filter (Age, Location, Interests).
- Ranked Feed generation.
- No-rewind selection mode.

### C. Trust & Safety Firewall
- Device fingerprinting (Abuse prevention).
- Identity Verification service integration.
- Moderation Queue (Report -> Review -> Action).

### D. Legal Compliance Module
- Acceptance logs for TOS/Privacy updates.
- Data export/deletion handlers.
- Grievance ticket tracking.

## 4. Integration Map
- **Auth**: OTP Service (SMS/Email).
- **Payments**: Gateway for boosts & subscriptions (GST-ready).
- **Notifications**: Push (Expo Notifications), SMS fallback.
