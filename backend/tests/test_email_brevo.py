from unittest.mock import MagicMock, patch

import httpx
import pytest

from app.config import Settings
from app.services import email as email_module
from app.services.email import (
    BrevoEmailProvider,
    EmailProviderError,
    get_email_provider,
    reset_email_provider,
    set_email_provider,
)


def _settings(**overrides):
    base = {
        "contact_provider": "brevo",
        "contact_api_key": "test-key",
        "contact_from_email": "from@example.com",
        "contact_from_name": "Sender",
        "contact_to_email": "to@example.com",
        "contact_to_name": "Recipient",
        "smtp_timeout_seconds": 5,
    }
    base.update(overrides)
    return Settings(**base)


def test_brevo_provider_missing_config_raises():
    settings = _settings(contact_api_key="")
    provider = BrevoEmailProvider(settings)
    with pytest.raises(EmailProviderError):
        provider.send_contact(sender_name="Alice", sender_email="alice@example.com", subject="Hello", message="Hi")


def test_brevo_provider_success():
    settings = _settings()
    provider = BrevoEmailProvider(settings)
    response = MagicMock()
    response.status_code = 201
    response.json.return_value = {"messageId": "msg_123"}
    with patch("app.services.email.httpx.Client") as client_cls:
        client = client_cls.return_value.__enter__.return_value
        client.post.return_value = response
        provider.send_contact(sender_name="Alice", sender_email="alice@example.com", subject="Hello", message="Hi")
    request = client.post.call_args
    payload = request.kwargs["json"]
    assert payload["sender"]["email"] == "from@example.com"
    assert payload["to"][0]["email"] == "to@example.com"
    assert payload["replyTo"]["email"] == "alice@example.com"
    assert payload["subject"] == "Hello"
    assert "<br>" not in payload["htmlContent"] or "Hi" in payload["htmlContent"]
    assert request.kwargs["headers"]["api-key"] == "test-key"


def test_brevo_provider_invalid_request():
    settings = _settings()
    provider = BrevoEmailProvider(settings)
    response = MagicMock()
    response.status_code = 400
    with patch("app.services.email.httpx.Client") as client_cls:
        client = client_cls.return_value.__enter__.return_value
        client.post.return_value = response
        with pytest.raises(EmailProviderError):
            provider.send_contact(sender_name="Alice", sender_email="alice@example.com", subject="Hello", message="Hi")


def test_brevo_provider_auth_failure():
    settings = _settings()
    provider = BrevoEmailProvider(settings)
    response = MagicMock()
    response.status_code = 401
    with patch("app.services.email.httpx.Client") as client_cls:
        client = client_cls.return_value.__enter__.return_value
        client.post.return_value = response
        with pytest.raises(EmailProviderError):
            provider.send_contact(sender_name="Alice", sender_email="alice@example.com", subject="Hello", message="Hi")


def test_brevo_provider_rate_limited():
    settings = _settings()
    provider = BrevoEmailProvider(settings)
    response = MagicMock()
    response.status_code = 429
    with patch("app.services.email.httpx.Client") as client_cls:
        client = client_cls.return_value.__enter__.return_value
        client.post.return_value = response
        with pytest.raises(EmailProviderError):
            provider.send_contact(sender_name="Alice", sender_email="alice@example.com", subject="Hello", message="Hi")


def test_brevo_provider_server_error():
    settings = _settings()
    provider = BrevoEmailProvider(settings)
    response = MagicMock()
    response.status_code = 500
    with patch("app.services.email.httpx.Client") as client_cls:
        client = client_cls.return_value.__enter__.return_value
        client.post.return_value = response
        with pytest.raises(EmailProviderError):
            provider.send_contact(sender_name="Alice", sender_email="alice@example.com", subject="Hello", message="Hi")


def test_brevo_provider_timeout():
    settings = _settings()
    provider = BrevoEmailProvider(settings)
    with patch("app.services.email.httpx.Client") as client_cls:
        client = client_cls.return_value.__enter__.return_value
        client.post.side_effect = httpx.TimeoutException("timed out")
        with pytest.raises(EmailProviderError):
            provider.send_contact(sender_name="Alice", sender_email="alice@example.com", subject="Hello", message="Hi")


def test_brevo_provider_connection_failure():
    settings = _settings()
    provider = BrevoEmailProvider(settings)
    with patch("app.services.email.httpx.Client") as client_cls:
        client = client_cls.return_value.__enter__.return_value
        client.post.side_effect = httpx.ConnectError("connection failed")
        with pytest.raises(EmailProviderError):
            provider.send_contact(sender_name="Alice", sender_email="alice@example.com", subject="Hello", message="Hi")


def test_brevo_provider_html_escaping():
    settings = _settings()
    provider = BrevoEmailProvider(settings)
    response = MagicMock()
    response.status_code = 201
    response.json.return_value = {"messageId": "msg_123"}
    with patch("app.services.email.httpx.Client") as client_cls:
        client = client_cls.return_value.__enter__.return_value
        client.post.return_value = response
        provider.send_contact(sender_name="<Alice>", sender_email="alice@example.com", subject="Hello", message="<script>alert(1)</script>")
    payload = client.post.call_args.kwargs["json"]
    assert "&lt;script&gt;" in payload["htmlContent"]
    assert "<script>" not in payload["htmlContent"]


def test_brevo_provider_selection():
    settings = _settings(contact_provider="brevo")
    email_module._email_provider = None
    email_module._email_provider_overridden = False
    with patch("app.services.email.get_settings", return_value=settings):
        provider = get_email_provider()
    assert type(provider).__name__ == "BrevoEmailProvider"


def test_contact_endpoint_brevo_success(client, monkeypatch):
    from app.config import Settings
    from app.services.email import BrevoEmailProvider, set_email_provider, reset_email_provider

    settings = _settings(contact_provider="brevo")
    monkeypatch.setattr("app.api.v1.contact.get_settings", lambda: settings)
    reset_email_provider()
    provider = BrevoEmailProvider(settings)
    spy = __import__("unittest.mock", fromlist=["MagicMock"]).MagicMock(wraps=provider)
    set_email_provider(spy)

    with patch("app.services.email.httpx.Client") as client_cls:
        fake_client = client_cls.return_value.__enter__.return_value
        response = MagicMock()
        response.status_code = 201
        response.json.return_value = {"messageId": "msg_123"}
        fake_client.post.return_value = response
        r = client.post(
            "/api/v1/contact",
            json={"name": "Alice", "email": "alice@example.com", "subject": "Hello", "message": "Hi"},
        )
    assert r.status_code == 200
    spy.send_contact.assert_called_once()
    reset_email_provider()


def test_contact_endpoint_brevo_failure(client, monkeypatch):
    from app.config import Settings
    from app.services.email import BrevoEmailProvider, set_email_provider, reset_email_provider
    from unittest.mock import MagicMock

    settings = _settings(contact_provider="brevo")
    monkeypatch.setattr("app.api.v1.contact.get_settings", lambda: settings)
    reset_email_provider()
    provider = BrevoEmailProvider(settings)
    provider.send_contact = MagicMock(side_effect=Exception("secret failure"))
    set_email_provider(provider)

    r = client.post(
        "/api/v1/contact",
        json={"name": "Alice", "email": "alice@example.com", "subject": "Hello", "message": "Hi"},
    )
    assert r.status_code == 502
    assert "secret" not in r.text
    reset_email_provider()