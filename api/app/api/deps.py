from app.repositories.turso_impl import (
    TursoProfileRepository,
    TursoCouponRepository,
    TursoPaymentClaimRepository,
    TursoReportRepository,
    TursoSanctuaryRepository
)
from app.services.sanctuary_service import SanctuaryService
from app.services.influencer_service import InfluencerService
from app.services.payment_service import PaymentService

# Global singletons for concrete repositories and services
profile_repo = TursoProfileRepository()
coupon_repo = TursoCouponRepository()
claim_repo = TursoPaymentClaimRepository()
report_repo = TursoReportRepository()
sanctuary_repo = TursoSanctuaryRepository()

sanctuary_service = SanctuaryService(profile_repo, sanctuary_repo, report_repo)
influencer_service = InfluencerService(coupon_repo, profile_repo)
payment_service = PaymentService(claim_repo, profile_repo, influencer_service, sanctuary_service)

def get_sanctuary_service() -> SanctuaryService:
    return sanctuary_service

def get_influencer_service() -> InfluencerService:
    return influencer_service

def get_payment_service() -> PaymentService:
    return payment_service

def get_profile_repo() -> TursoProfileRepository:
    return profile_repo
