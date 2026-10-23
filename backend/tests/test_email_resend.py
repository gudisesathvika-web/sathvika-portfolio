from unittest.mock import MagicMock, patch

import httpx
import pytest

from app.config import Settings
from app.services import email as email_module
from app.services.email import (
    EmailProviderError,
    ResendEmailProvider,
    get_email_provider,
    reset_email_provider,
    set_email_provider,
)


def _settings(**overrides):
    base = {
        "contact_provider": "resend",
        "contact_api_key": "test-key",
        "contact_from_email": "from@example.com",
        "contact_from_name": "Sender",
        "contact_to_email": "to@example.com",
        "contact_to_name": "Recipient",
        "smtp_timeout_seconds": 5,
    }
    base.update(overrides)
    return Settings(**base)


def test_resend_provider_missing_config_raises():
    settings = _settings(contact_api_key="")
    provider = ResendEmailProvider(settings)
    with pytest.raises(EmailProviderError):
        provider.send_contact(sender_name="Alice", sender_email="alice@example.com", subject="Hello", message="Hi")


def test_resend_provider_success():
    settings = _settings()
    provider = ResendEmailProvider(settings)
    response = MagicMock()
    response.status_code = 200
    response.json.return_value = {"id": "email_123"}
    with patch("app.services.email.httpx.Client") as client_cls:
        client = client_cls.return_value.__enter__.return_value
        client.post.return_value = response
        provider.send_contact(sender_name="Alice", sender_email="alice@example.com", subject="Hello", message="Hi")
    request = client.post.call_args
    assert request.kwargs["json"]["reply_to"] == "alice@example.com"
    assert request.kwargs["json"]["subject"] == "Hello"


def test_resend_provider_http_failure():
    settings = _settings()
    provider = ResendEmailProvider(settings)
    response = MagicMock()
    response.status_code = 422
    with patch("app.services.email.httpx.Client") as client_cls:
        client = client_cls.return_value.__enter__.return_value
        client.post.return_value = response
        with pytest.raises(EmailProviderError) as exc:
            provider.send_contact(sender_name="Alice", sender_email="alice@example.com", subject="Hello", message="Hi")
    assert str(exc.value) == "Email delivery failed."


def test_resend_provider_auth_failure():
    settings = _settings()
    provider = ResendEmailProvider(settings)
    response = MagicMock()
    response.status_code = 401
    with patch("app.services.email.httpx.Client") as client_cls:
        client = client_cls.return_value.__enter__.return_value
        client.post.return_value = response
        with pytest.raises(EmailProviderError):
            provider.send_contact(sender_name="Alice", sender_email="alice@example.com", subject="Hello", message="Hi")


def test_resend_provider_timeout():
    settings = _settings()
    provider = ResendEmailProvider(settings)
    with patch("app.services.email.httpx.Client") as client_cls:
        client = client_cls.return_value.__enter__.return_value
        client.post.side_effect = httpx.TimeoutException("timed out")
        with pytest.raises(EmailProviderError):
            provider.send_contact(sender_name="Alice", sender_email="alice@example.com", subject="Hello", message="Hi")


def test_resend_provider_selection():
    settings = _settings(contact_provider="resend")
    email_module._email_provider = None
    email_module._email_provider_overridden = False
    with patch("app.services.email.get_settings", return_value=settings):
        provider = get_email_provider()
    assert type(provider).__name__ == "ResendEmailProvider"


def test_contact_endpoint_resend_success(client, monkeypatch):
    from app.config import Settings
    from app.services.email import ResendEmailProvider, set_email_provider, reset_email_provider

    settings = _settings(contact_provider="resend")
    monkeypatch.setattr("app.api.v1.contact.get_settings", lambda: settings)
    reset_email_provider()
    provider = ResendEmailProvider(settings)
    spy = __import__("unittest.mock", fromlist=["MagicMock"]).MagicMock(wraps=provider)
    set_email_provider(spy)

    with patch("app.services.email.httpx.Client") as client_cls:
        fake_client = client_cls.return_value.__enter__.return_value
        response = MagicMock()
        response.status_code = 200
        response.json.return_value = {"id": "email_123"}
        fake_client.post.return_value = response
        r = client.post(
            "/api/v1/contact",
            json={"name": "Alice", "email": "alice@example.com", "subject": "Hello", "message": "Hi"},
        )
    assert r.status_code == 200
    spy.send_contact.assert_called_once()
    reset_email_provider()


def test_contact_endpoint_resend_failure(client, monkeypatch):
    from app.config import Settings
    from app.services.email import ResendEmailProvider, set_email_provider, reset_email_provider
    from unittest.mock import MagicMock

    settings = _settings(contact_provider="resend")
    monkeypatch.setattr("app.api.v1.contact.get_settings", lambda: settings)
    reset_email_provider()
    provider = ResendEmailProvider(settings)
    provider.send_contact = MagicMock(side_effect=Exception("secret failure"))
    set_email_provider(provider)

    r = client.post(
        "/api/v1/contact",
        json={"name": "Alice", "email": "alice@example.com", "subject": "Hello", "message": "Hi"},
    )
    assert r.status_code == 502
    assert "secret" not in r.text
    reset_email_provider()