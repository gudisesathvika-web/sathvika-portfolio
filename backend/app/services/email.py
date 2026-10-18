"""Email provider abstraction (mockable)."""
from __future__ import annotations

import logging
import smtplib
import socket
import ssl
from abc import ABC, abstractmethod
from email.message import EmailMessage

logger = logging.getLogger(__name__)

from app.config import Settings, get_settings


class EmailProviderError(Exception):
    """Raised when an email provider cannot send a message."""

    def __init__(self, detail: str) -> None:
        super().__init__(detail)
        self.detail = detail


class EmailProvider(ABC):
    @abstractmethod
    def send_contact(
        self,
        *,
        sender_name: str,
        sender_email: str,
        subject: str,
        message: str,
    ) -> None:
        """Send a contact message. Raise EmailProviderError on failure."""


class MockEmailProvider(EmailProvider):
    def send_contact(
        self,
        *,
        sender_name: str,
        sender_email: str,
        subject: str,
        message: str,
    ) -> None:
        # No external I/O; for tests and local dev with no credentials.
        _ = sender_name, sender_email, subject, message


class MissingConfigEmailProvider(EmailProvider):
    def send_contact(
        self,
        *,
        sender_name: str,
        sender_email: str,
        subject: str,
        message: str,
    ) -> None:
        raise EmailProviderError("Email delivery is not configured.")


class SmtpEmailProvider(EmailProvider):
    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    def _validate_config(self) -> None:
        if not self.settings.smtp_host.strip():
            raise EmailProviderError("Email delivery is not configured.")
        if not self.settings.smtp_username.strip() or not self.settings.smtp_password:
            raise EmailProviderError("Email delivery is not configured.")
        if not self.settings.contact_from_email.strip() or not self.settings.contact_to_email.strip():
            raise EmailProviderError("Email delivery is not configured.")

    def send_contact(
        self,
        *,
        sender_name: str,
        sender_email: str,
        subject: str,
        message: str,
    ) -> None:
        self._validate_config()
        logger.info("smtp delivery started")

        msg = EmailMessage()
        from_name = self.settings.contact_from_name.strip() or self.settings.contact_from_email
        to_name = self.settings.contact_to_name.strip() or self.settings.contact_to_email
        msg["From"] = f"{from_name} <{self.settings.contact_from_email}>"
        msg["To"] = f"{to_name} <{self.settings.contact_to_email}>"
        msg["Reply-To"] = f"{sender_name} <{sender_email}>"
        msg["Subject"] = subject
        msg.set_content(
            f"Name: {sender_name}\\nEmail: {sender_email}\\n\\n{message}"
        )

        timeout = max(1, int(self.settings.smtp_timeout_seconds))
        tls_mode = (self.settings.smtp_tls_mode or "starttls").strip().lower()

        try:
            if tls_mode == "ssl":
                context = ssl.create_default_context()
                with smtplib.SMTP_SSL(
                    self.settings.smtp_host,
                    self.settings.smtp_port,
                    timeout=timeout,
                    context=context,
                ) as server:
                    server.login(self.settings.smtp_username, self.settings.smtp_password)
                    server.send_message(msg)
            elif tls_mode == "none":
                with smtplib.SMTP(
                    self.settings.smtp_host,
                    self.settings.smtp_port,
                    timeout=timeout,
                ) as server:
                    server.login(self.settings.smtp_username, self.settings.smtp_password)
                    server.send_message(msg)
            else:
                with smtplib.SMTP(
                    self.settings.smtp_host,
                    self.settings.smtp_port,
                    timeout=timeout,
                ) as server:
                    server.ehlo()
                    context = ssl.create_default_context()
                    server.starttls(context=context)
                    server.ehlo()
                    server.login(self.settings.smtp_username, self.settings.smtp_password)
                    server.send_message(msg)
        except Exception:
            logger.warning("smtp delivery failed")
            raise EmailProviderError("Email delivery failed.")
        logger.info("smtp delivery accepted")


def _build_provider(settings: Settings) -> EmailProvider:
    provider = settings.contact_provider.strip().lower() or "mock"
    if provider == "mock":
        logger.info("email provider selected: mock")
        return MockEmailProvider()
    if provider == "smtp":
        logger.info("email provider selected: smtp")
        return SmtpEmailProvider(settings)
    logger.warning("email provider selected: unconfigured (%s)", provider)
    # No real free-tier provider implemented for this value; treat as unconfigured.
    return MissingConfigEmailProvider()


_email_provider: EmailProvider | None = None
_email_provider_overridden: bool = False


def get_email_provider() -> EmailProvider:
    global _email_provider
    if _email_provider_overridden and _email_provider is not None:
        return _email_provider
    provider = _build_provider(get_settings())
    _email_provider = provider
    return provider


def set_email_provider(provider: EmailProvider) -> None:
    global _email_provider, _email_provider_overridden
    _email_provider = provider
    _email_provider_overridden = True


def reset_email_provider() -> None:
    global _email_provider, _email_provider_overridden
    _email_provider = None
    _email_provider_overridden = False