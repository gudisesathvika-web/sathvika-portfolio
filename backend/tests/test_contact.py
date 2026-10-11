import pytest

from app.services import email as email_module
from app.services.email import MockEmailProvider, MissingConfigEmailProvider, set_email_provider


def _reset_contact_limiter():
    from app.api.v1 import contact as contact_api
    contact_api._contact_limiter = None  # type: ignore[attr-defined]


@pytest.fixture(autouse=True)
def _reset_state():
    _reset_contact_limiter()
    set_email_provider(MockEmailProvider())
    yield
    _reset_contact_limiter()
    set_email_provider(MockEmailProvider())


def test_contact_success(client):
    r = client.post(
        "/api/v1/contact",
        json={
            "name": "Alice",
            "email": "alice@example.com",
            "subject": "Hello",
            "message": "This is a test message.",
        },
    )
    assert r.status_code == 200
    assert r.json() == {"status": "accepted"}


def test_contact_validation_errors(client):
    r = client.post("/api/v1/contact", json={"name": "", "email": "bad", "subject": "", "message": ""})
    assert r.status_code == 422

    r = client.post(
        "/api/v1/contact",
        json={
            "name": "A",
            "email": "a@b.com",
            "subject": "x",
            "message": "x" * 2001,
        },
    )
    assert r.status_code == 422


def test_contact_missing_config_returns_502(client):
    set_email_provider(MissingConfigEmailProvider())
    r = client.post(
        "/api/v1/contact",
        json={
            "name": "Bob",
            "email": "bob@example.com",
            "subject": "Hi",
            "message": "Hi there",
        },
    )
    assert r.status_code == 502


def test_contact_provider_failure_returns_502(client):
    class FailingProvider(MockEmailProvider):
        def send_contact(self, **kwargs):  # type: ignore[override]
            from app.services.email import EmailProviderError
            raise EmailProviderError("Email delivery failed.")

    set_email_provider(FailingProvider())
    r = client.post(
        "/api/v1/contact",
        json={
            "name": "Carol",
            "email": "carol@example.com",
            "subject": "Hi",
            "message": "Hi there",
        },
    )
    assert r.status_code == 502


def test_contact_rate_limit_returns_429(client):
    _reset_contact_limiter()
    from app.api.v1 import contact as contact_api
    from app.core.ratelimit import SlidingWindowLimiter
    contact_api._contact_limiter = SlidingWindowLimiter(3, 3600)  # type: ignore[attr-defined]
    for _ in range(3):
        r = client.post(
            "/api/v1/contact",
            json={"name": "D", "email": "d@example.com", "subject": "x", "message": "hi"},
        )
        assert r.status_code == 200
    r = client.post(
        "/api/v1/contact",
        json={"name": "D", "email": "d@example.com", "subject": "x", "message": "hi"},
    )
    assert r.status_code == 429
