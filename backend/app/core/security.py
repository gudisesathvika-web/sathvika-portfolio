"""Security primitives: password hashing, opaque session tokens, cookies.

Passwords are hashed with bcrypt via pwdlib. Session identifiers are opaque
(`secrets.token_urlsafe`) and only their SHA-256 hashes are persisted. No
plaintext tokens are stored anywhere.
"""

import hashlib
import secrets
from datetime import datetime, timedelta, timezone

from fastapi import Response
from pwdlib import PasswordHash
from pwdlib.hashers.bcrypt import BcryptHasher

from ..config import get_settings

_password_hash = PasswordHash([BcryptHasher()])


def hash_password(password: str) -> str:
    return _password_hash.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return _password_hash.verify(password, password_hash)
    except Exception:
        return False


def create_session_token() -> str:
    return secrets.token_urlsafe(32)


def create_csrf_token() -> str:
    return secrets.token_urlsafe(32)


def session_token_hash(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def session_expiry() -> datetime:
    settings = get_settings()
    return datetime.now(timezone.utc) + timedelta(seconds=settings.session_max_age_seconds)


def _cookie_kwargs(settings) -> dict[str, object]:
    return {
        "path": "/",
        "secure": settings.cookie_secure,
        "samesite": settings.cookie_samesite,
    }


def set_auth_cookies(response: Response, session_token: str) -> None:
    settings = get_settings()
    response.set_cookie(
        key=settings.session_cookie_name,
        value=session_token,
        max_age=settings.session_max_age_seconds,
        httponly=True,
        **_cookie_kwargs(settings),
    )


def set_csrf_cookie(response: Response, csrf_token: str) -> None:
    settings = get_settings()
    response.set_cookie(
        key=settings.csrf_cookie_name,
        value=csrf_token,
        max_age=settings.session_max_age_seconds,
        httponly=False,
        **_cookie_kwargs(settings),
    )


def clear_auth_cookies(response: Response) -> None:
    settings = get_settings()
    for key in (settings.session_cookie_name, settings.csrf_cookie_name):
        response.delete_cookie(key=key, path="/")