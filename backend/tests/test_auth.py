"""Authentication and admin-endpoint security tests.

These run against in-memory SQLite (no PostgreSQL involved). They cover
unauthenticated access, generic login errors, valid login, logout
invalidation, CSRF enforcement, session expiry, and rate limiting.
"""

from datetime import datetime, timedelta, timezone

from app.core.ratelimit import reset_login_limiter
from app.core.security import hash_password, session_expiry, session_token_hash
from app.models.auth import AuthSession, Owner

OWNER_EMAIL = "owner@example.com"
OWNER_PASSWORD = "correct-horse-battery-staple"


def _create_owner(session_factory, email=OWNER_EMAIL, password=OWNER_PASSWORD):
    with session_factory() as db:
        db.add(Owner(email=email, password_hash=hash_password(password)))
        db.commit()


def _login(client, password=OWNER_PASSWORD):
    return client.post(
        "/api/v1/auth/login",
        json={"password": password},
    )


def _csrf_token(client):
    return client.cookies.get("sathvika_csrf")


def test_me_unauthenticated_returns_401(client):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401


def test_login_wrong_password_rejected(client, session_factory):
    _create_owner(session_factory)
    response = _login(client, password="wrong-password")
    assert response.status_code == 401
    assert response.json()["error"]["message"] == "Invalid password"

def test_login_empty_password_rejected(client, session_factory):
    _create_owner(session_factory)
    response = client.post("/api/v1/auth/login", json={"password": ""})
    assert response.status_code == 422


def test_login_valid_sets_cookie_and_me_works(client, session_factory):
    _create_owner(session_factory)
    response = _login(client)
    assert response.status_code == 200
    body = response.json()
    assert body["owner"]["email"] == OWNER_EMAIL
    assert "sathvika_session" in client.cookies
    assert "sathvika_csrf" in client.cookies

    me = client.get("/api/v1/auth/me")
    assert me.status_code == 200
    assert me.json()["email"] == OWNER_EMAIL


def test_logout_invalidates_session(client, session_factory):
    _create_owner(session_factory)
    _login(client)
    response = client.post(
        "/api/v1/auth/logout", headers={"X-CSRF-Token": _csrf_token(client)}
    )
    assert response.status_code == 200

    me = client.get("/api/v1/auth/me")
    assert me.status_code == 401


def test_logout_requires_csrf(client, session_factory):
    _create_owner(session_factory)
    _login(client)
    response = client.post("/api/v1/auth/logout")
    assert response.status_code == 403


def test_admin_ping_requires_auth_and_csrf(client, session_factory):
    _create_owner(session_factory)

    anonymous = client.post("/api/v1/admin/ping")
    assert anonymous.status_code == 403  # CSRF gate first

    _login(client)
    no_csrf = client.post("/api/v1/admin/ping")
    assert no_csrf.status_code == 403

    ok = client.post(
        "/api/v1/admin/ping", headers={"X-CSRF-Token": _csrf_token(client)}
    )
    assert ok.status_code == 200
    assert ok.json() == {"ok": "true", "owner": OWNER_EMAIL}


def test_expired_session_is_rejected(client, session_factory):
    _create_owner(session_factory)
    _login(client)
    with session_factory() as db:
        record = db.query(AuthSession).one()
        record.expires_at = datetime.now(timezone.utc) - timedelta(seconds=1)
        db.commit()

    me = client.get("/api/v1/auth/me")
    assert me.status_code == 401


def test_login_rate_limited_after_max_attempts(client, session_factory):
    reset_login_limiter()
    _create_owner(session_factory)
    for _ in range(5):
        response = _login(client, password="wrong-password")
        assert response.status_code == 401
    response = _login(client)  # correct password, but limiter already exhausted
    assert response.status_code == 429


def test_public_projects_ignores_auth(client, session_factory):
    from app.models.project import Project

    with session_factory() as db:
        db.add(
            Project(
                id="sample",
                title="Published only",
                direction="Public",
                summary="Public summary.",
                stack=["Python"],
                is_published=True,
            )
        )
        db.commit()
    response = client.get("/api/v1/projects")
    assert response.status_code == 200
    assert [p["id"] for p in response.json()] == ["sample"]