"""Authentication endpoints: login, logout, and current-session check.

No public registration exists. Login responses are generic so they never
reveal whether an email address is registered. Logout invalidates the session
server-side and clears cookies.
"""

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ...api.deps import csrf_protect, get_current_owner, get_db
from ...config import get_settings
from ...core.ratelimit import get_login_limiter
from ...core.security import (
    clear_auth_cookies,
    create_csrf_token,
    create_session_token,
    hash_password,
    session_expiry,
    session_token_hash,
    set_auth_cookies,
    set_csrf_cookie,
    verify_password,
)
from ...models.auth import AuthSession, Owner
from ...schemas.auth import LoginRequest, LoginResponse, LogoutResponse, OwnerPublic

router = APIRouter(prefix="/auth", tags=["auth"])

# Precomputed dummy hash so a login for an unknown email still performs a
# password-hash verification, avoiding a username-enumeration timing signal.
_DUMMY_HASH = hash_password("generate-a-dummy-bcrypt-hash-at-import-time")


@router.post("/login", response_model=LoginResponse, summary="Owner login")
def login(
    payload: LoginRequest,
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
) -> LoginResponse:
    ip = request.client.host if request.client else "unknown"
    if not get_login_limiter().allow(ip):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many login attempts. Try again later.",
        )

    email = payload.email.lower().strip()
    owner = db.scalar(select(Owner).where(Owner.email == email))

    if owner is None:
        # Same hashing cost as a real account lookup: generic 401.
        verify_password(payload.password, _DUMMY_HASH)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password"
        )

    if not verify_password(payload.password, owner.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password"
        )

    session_token = create_session_token()
    db.add(
        AuthSession(
            token_hash=session_token_hash(session_token),
            owner_id=owner.id,
            expires_at=session_expiry(),
        )
    )
    db.commit()

    set_auth_cookies(response, session_token)
    set_csrf_cookie(response, create_csrf_token())
    return LoginResponse(owner=OwnerPublic.model_validate(owner))


@router.get("/me", response_model=OwnerPublic, summary="Current owner")
def me(owner: Owner = Depends(get_current_owner)) -> Owner:
    return owner


@router.post(
    "/logout",
    response_model=LogoutResponse,
    summary="Owner logout",
    dependencies=[Depends(csrf_protect)],
)
def logout(
    request: Request, response: Response, db: Session = Depends(get_db)
) -> LogoutResponse:
    token = request.cookies.get(get_settings().session_cookie_name)
    if token:
        record = db.get(AuthSession, session_token_hash(token))
        if record is not None:
            db.delete(record)
            db.commit()
    clear_auth_cookies(response)
    return LogoutResponse()