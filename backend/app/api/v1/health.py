"""Health endpoint — liveness only. Reports no secrets or config values."""

from fastapi import APIRouter, Depends

from ...config import Settings, get_settings
from ...schemas.health import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse, summary="Service health")
def health(settings: Settings = Depends(get_settings)) -> HealthResponse:
    return HealthResponse(
        status="ok",
        service=settings.app_name,
        version=settings.version,
        environment=settings.app_env,
    )
