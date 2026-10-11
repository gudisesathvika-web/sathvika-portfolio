"""Contact endpoint: validate, rate-limit, and deliver via configured email provider."""
from fastapi import APIRouter, Depends, HTTPException, Request, status

from app.api.deps import get_db  # noqa: F401 (not needed for contact, but keep consistent)
from app.config import get_settings
from app.core.ratelimit import SlidingWindowLimiter
from app.schemas.contact import ContactRequest
from app.services.email import EmailProviderError, get_email_provider

router = APIRouter(prefix="/contact", tags=["contact"])

_contact_limiter: SlidingWindowLimiter | None = None


def _get_contact_limiter() -> SlidingWindowLimiter:
    global _contact_limiter
    if _contact_limiter is None:
        settings = get_settings()
        _contact_limiter = SlidingWindowLimiter(
            settings.contact_rate_limit_max_attempts,
            settings.contact_rate_limit_window_seconds,
        )
    return _contact_limiter


@router.post(
    "",
    status_code=status.HTTP_200_OK,
    summary="Send contact message",
    response_model=dict[str, str],
)
def send_contact(payload: ContactRequest, request: Request) -> dict[str, str]:
    ip = request.client.host if request.client else "unknown"
    if not _get_contact_limiter().allow(ip):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many contact submissions. Try again later.",
        )

    provider = get_email_provider()
    try:
        provider.send_contact(
            sender_name=payload.name,
            sender_email=str(payload.email),
            subject=payload.subject,
            message=payload.message,
        )
    except EmailProviderError as e:
        # Provider failed or not configured; return safe error (no body logged)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=e.detail,
        )
    except Exception:
        # Unexpected error; do not leak details
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Email delivery failed.",
        )

    return {"status": "accepted"}