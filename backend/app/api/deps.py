"""Shared API dependencies: database session, owner authentication, CSRF.

`get_current_owner` is the authoritative owner gate for all future write
endpoints. It validates the opaque HttpOnly session cookie, checks expiry, and
loads the owner. `csrf_protect` enforces the double-submit cookie pattern for
state-changing requests.
"""

import secrets
from datetime import datetime, timezone

from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from ..config import get_settings
from ..core.security import session_token_hash
from ..database import get_db
from ..models.auth import AuthSession, Owner


def get_current_owner(
    request: Request, db: Session = Depends(get_db)
) -> Owner:
    """Resolve the authenticated owner from the session cookie or raise 401."""
    settings = get_settings()
    token = request.cookies.get(settings.session_cookie_name)
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    record = db.get(AuthSession, session_token_hash(token))
    if record is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    expires = record.expires_at
    if expires.tzinfo is None:
        # SQLite returns naive datetimes; treat them as UTC.
        expires = expires.replace(tzinfo=timezone.utc)
    if expires <= datetime.now(timezone.utc):
        db.delete(record)
        db.commit()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired")

    owner = db.get(Owner, record.owner_id)
    if owner is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    return owner


def csrf_protect(request: Request) -> None:
    """Double-submit cookie CSRF check for cookie-authenticated POST requests."""
    settings = get_settings()
    cookie_token = request.cookies.get(settings.csrf_cookie_name)
    header_token = request.headers.get("X-CSRF-Token")
    if not cookie_token or not header_token or not secrets.compare_digest(cookie_token, header_token):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="CSRF token missing or invalid")