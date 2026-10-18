
"""Email provider abstraction (mockable)."""
from __future__ import annotations

import logging
import smtplib
import socket
import ssl
from abc import ABC, abstractmethod
from email.message import EmailMessage
from email.utils import formataddr

from app.config import Settings, get_settings

logger = logging.getLogger(__name__)


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
        """Send a contact message or raise EmailProviderError."""


class MockEmailProvider(EmailProvider):
    def send_contact(
        self,
        *,
        sender_name: str,
        sender_email: str,
        subject: str,
        message: str,
    ) -> None:
        # Intentionally performs no external I/O.
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
        _ = sender_name, sender_email, subject, message
        raise EmailProviderError("Email delivery is not configured.")


class SmtpEmailProvider(EmailProvider):
    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    def _validate_config(self) -> tuple[int, int, str]:
        if not self.settings.smtp_host.strip():
            raise EmailProviderError("Email delivery is not configured.")

        if (
            not self.settings.smtp_username.strip()
            or not self.settings.smtp_password
        ):
            raise EmailProviderError("Email delivery is not configured.")

        if (
            not self.settings.contact_from_email.strip()
            or not self.settings.contact_to_email.strip()
        ):
            raise EmailProviderError("Email delivery is not configured.")

        try:
            port = int(self.settings.smtp_port)
            timeout = int(self.settings.smtp_timeout_seconds)
        except (TypeError, ValueError):
            raise EmailProviderError(
                "Email delivery configuration is invalid."
            ) from None

        if not 1 <= port <= 65535 or timeout < 1:
            raise EmailProviderError(
                "Email delivery configuration is invalid."
            )

        tls_mode = (self.settings.smtp_tls_mode or "").strip().lower()
        if tls_mode not in {"starttls", "ssl", "none"}:
            raise EmailProviderError(
                "Email delivery TLS configuration is invalid."
            )

        return port, timeout, tls_mode

    def send_contact(
        self,
        *,
        sender_name: str,
        sender_email: str,
        subject: str,
        message: str,
    ) -> None:
        port, timeout, tls_mode = self._validate_config()

        logger.info("smtp delivery started")

        msg = EmailMessage()
        from_name = (
            self.settings.contact_from_name.strip()
            or self.settings.contact_from_email
        )
        to_name = (
            self.settings.contact_to_name.strip()
            or self.settings.contact_to_email
        )

        msg["From"] = formataddr(
            (from_name, self.settings.contact_from_email)
        )
        msg["To"] = formataddr(
            (to_name, self.settings.contact_to_email)
        )
        msg["Reply-To"] = formataddr((sender_name, sender_email))
        msg["Subject"] = subject
        msg.set_content(
            f"Name: {sender_name}\n"
            f"Email: {sender_email}\n\n"
            f"{message}"
        )

        try:
            if tls_mode == "ssl":
                context = ssl.create_default_context()
                with smtplib.SMTP_SSL(
                    self.settings.smtp_host,
                    port,
                    timeout=timeout,
                    context=context,
                ) as server:
                    server.login(
                        self.settings.smtp_username,
                        self.settings.smtp_password,
                    )
                    server.send_message(msg)

            elif tls_mode == "starttls":
                with smtplib.SMTP(
                    self.settings.smtp_host,
                    port,
                    timeout=timeout,
                ) as server:
                    server.ehlo()
                    context = ssl.create_default_context()
                    server.starttls(context=context)
                    server.ehlo()
                    server.login(
                        self.settings.smtp_username,
                        self.settings.smtp_password,
                    )
                    server.send_message(msg)

            else:  # tls_mode == "none"
                with smtplib.SMTP(
                    self.settings.smtp_host,
                    port,
                    timeout=timeout,
                ) as server:
                    server.login(
                        self.settings.smtp_username,
                        self.settings.smtp_password,
                    )
                    server.send_message(msg)

        # Catch timeout/TLS errors before OSError because some inherit from it.
        except (socket.timeout, TimeoutError):
            logger.warning("smtp delivery failed: category=timeout")
            raise EmailProviderError("Email delivery failed.") from None

        except ssl.SSLError:
            logger.warning("smtp delivery failed: category=tls")
            raise EmailProviderError("Email delivery failed.") from None

        except smtplib.SMTPAuthenticationError:
            logger.warning(
                "smtp delivery failed: category=authentication"
            )
            raise EmailProviderError("Email delivery failed.") from None

        except smtplib.SMTPConnectError:
            logger.warning(
                "smtp delivery failed: category=connection_rejected"
            )
            raise EmailProviderError("Email delivery failed.") from None

        except smtplib.SMTPServerDisconnected:
            logger.warning(
                "smtp delivery failed: category=server_disconnected"
            )
            raise EmailProviderError("Email delivery failed.") from None

        except (socket.gaierror, ConnectionError, OSError):
            logger.warning(
                "smtp delivery failed: category=connection"
            )
            raise EmailProviderError("Email delivery failed.") from None

        except smtplib.SMTPException:
            logger.warning(
                "smtp delivery failed: category=smtp_rejected"
            )
            raise EmailProviderError("Email delivery failed.") from None

        except Exception:
            # Do not log exception text: it may contain sensitive details.
            logger.error(
                "smtp delivery failed: category=unexpected"
            )
            raise EmailProviderError("Email delivery failed.") from None

        logger.info("smtp delivery accepted")


def _build_provider(settings: Settings) -> EmailProvider:
    provider = settings.contact_provider.strip().lower() or "mock"

    if provider == "mock":
        logger.info("email provider selected: mock")
        return MockEmailProvider()

    if provider == "smtp":
        logger.info("email provider selected: smtp")
        return SmtpEmailProvider(settings)

    # Unknown provider values must never silently simulate delivery.
    logger.warning(
        "email provider selected: unconfigured"
    )
    return MissingConfigEmailProvider()


_email_provider: EmailProvider | None = None
_email_provider_overridden = False


def get_email_provider() -> EmailProvider:
    global _email_provider

    if _email_provider_overridden and _email_provider is not None:
        return _email_provider

    return _build_provider(get_settings())


def set_email_provider(provider: EmailProvider) -> None:
    global _email_provider, _email_provider_overridden
    _email_provider = provider
    _email_provider_overridden = True


def reset_email_provider() -> None:
    global _email_provider, _email_provider_overridden
    _email_provider = None
    _email_provider_overridden = False
