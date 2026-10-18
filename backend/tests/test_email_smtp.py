import socket
import ssl
from unittest.mock import MagicMock, patch

import pytest

from app.config import Settings
from app.services import email as email_module
from app.services.email import (
    EmailProviderError,
    SmtpEmailProvider,
    get_email_provider,
    set_email_provider,
)


def _settings(**overrides):
    base = {
        "contact_provider": "smtp",
        "contact_from_email": "from@example.com",
        "contact_from_name": "Sender",
        "contact_to_email": "to@example.com",
        "contact_to_name": "Recipient",
        "smtp_host": "smtp.gmail.com",
        "smtp_port": 587,
        "smtp_username": "user@gmail.com",
        "smtp_password": "secret",
        "smtp_tls_mode": "starttls",
        "smtp_timeout_seconds": 5,
    }
    base.update(overrides)
    return Settings(**base)


def test_smtp_provider_missing_config_raises():
    settings = _settings(smtp_password="")
    provider = SmtpEmailProvider(settings)
    with pytest.raises(EmailProviderError):
        provider.send_contact(
            sender_name="Alice",
            sender_email="alice@example.com",
            subject="Hello",
            message="Hi",
        )


def test_smtp_provider_success_starttls():
    settings = _settings()
    provider = SmtpEmailProvider(settings)
    fake_server = MagicMock()
    with patch("app.services.email.smtplib.SMTP", return_value=fake_server) as smtp_cls:
        fake_server.__enter__.return_value = fake_server
        provider.send_contact(
            sender_name="Alice",
            sender_email="alice@example.com",
            subject="Hello",
            message="Hi",
        )
    smtp_cls.assert_called_once()
    fake_server.starttls.assert_called_once()
    fake_server.login.assert_called_once_with("user@gmail.com", "secret")
    fake_server.send_message.assert_called_once()
    sent = fake_server.send_message.call_args[0][0]
    assert sent["Reply-To"] == "Alice <alice@example.com>"
    assert sent["From"] == "Sender <from@example.com>"
    assert sent["To"] == "Recipient <to@example.com>"


def test_smtp_provider_auth_failure_safe_error():
    settings = _settings()
    provider = SmtpEmailProvider(settings)
    fake_server = MagicMock()
    fake_server.login.side_effect = Exception("auth failed secret")
    with patch("app.services.email.smtplib.SMTP", return_value=fake_server):
        fake_server.__enter__.return_value = fake_server
        with pytest.raises(EmailProviderError) as exc:
            provider.send_contact(
                sender_name="Alice",
                sender_email="alice@example.com",
                subject="Hello",
                message="Hi",
            )
    assert "secret" not in str(exc.value)
    assert str(exc.value) == "Email delivery failed."


def test_smtp_provider_selection():
    settings = _settings(contact_provider="smtp")
    email_module._email_provider = None
    with patch("app.services.email.get_settings", return_value=settings):
        provider = get_email_provider()
    assert isinstance(provider, SmtpEmailProvider)


def test_smtp_tls_ssl_mode():
    settings = _settings(smtp_tls_mode="ssl", smtp_port=465)
    provider = SmtpEmailProvider(settings)
    fake_server = MagicMock()
    with patch("app.services.email.smtplib.SMTP_SSL", return_value=fake_server) as ssl_cls:
        fake_server.__enter__.return_value = fake_server
        provider.send_contact(
            sender_name="Alice",
            sender_email="alice@example.com",
            subject="Hello",
            message="Hi",
        )
    ssl_cls.assert_called_once()
    fake_server.starttls.assert_not_called()


def test_smtp_timeout_handled():
    settings = _settings()
    provider = SmtpEmailProvider(settings)
    fake_server = MagicMock()
    fake_server.send_message.side_effect = socket.timeout("timed out")
    with patch("app.services.email.smtplib.SMTP", return_value=fake_server):
        fake_server.__enter__.return_value = fake_server
        with pytest.raises(EmailProviderError):
            provider.send_contact(
                sender_name="Alice",
                sender_email="alice@example.com",
                subject="Hello",
                message="Hi",
            )


def test_contact_endpoint_invokes_smtp_provider(client, monkeypatch):
    from app.config import Settings
    from app.services.email import SmtpEmailProvider, set_email_provider, reset_email_provider

    settings = _settings(contact_provider="smtp")
    monkeypatch.setattr("app.api.v1.contact.get_settings", lambda: settings)
    reset_email_provider()
    provider = SmtpEmailProvider(settings)
    spy = MagicMock(wraps=provider)
    set_email_provider(spy)

    with patch("app.services.email.smtplib.SMTP") as smtp_cls:
        fake_server = MagicMock()
        smtp_cls.return_value = fake_server
        fake_server.__enter__.return_value = fake_server
        r = client.post(
            "/api/v1/contact",
            json={
                "name": "Alice",
                "email": "alice@example.com",
                "subject": "Hello",
                "message": "Hi",
            },
        )
    assert r.status_code == 200
    spy.send_contact.assert_called_once()

    reset_email_provider()


def test_contact_endpoint_does_not_false_success_on_smtp_failure(client, monkeypatch):
    from app.config import Settings
    from app.services.email import SmtpEmailProvider, set_email_provider, reset_email_provider

    settings = _settings(contact_provider="smtp")
    monkeypatch.setattr("app.api.v1.contact.get_settings", lambda: settings)
    reset_email_provider()
    provider = SmtpEmailProvider(settings)
    provider.send_contact = MagicMock(side_effect=Exception("secret failure"))
    set_email_provider(provider)

    r = client.post(
        "/api/v1/contact",
        json={
            "name": "Alice",
            "email": "alice@example.com",
            "subject": "Hello",
            "message": "Hi",
        },
    )
    assert r.status_code == 502
    assert "secret" not in r.text

    reset_email_provider()
