"""Email provider abstraction (mockable)."""
from abc import ABC, abstractmethod

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


def _build_provider(settings: Settings) -> EmailProvider:
    provider = settings.contact_provider.strip().lower() or "mock"
    if provider == "mock":
        return MockEmailProvider()
    # No real free-tier provider implemented in this short timebox; treat as unconfigured
    # unless explicitly set to mock. This keeps behavior honest and testable via mocks.
    return MissingConfigEmailProvider()


_email_provider: EmailProvider | None = None


def get_email_provider() -> EmailProvider:
    global _email_provider
    if _email_provider is None:
        _email_provider = _build_provider(get_settings())
    return _email_provider


def set_email_provider(provider: EmailProvider) -> None:
    global _email_provider
    _email_provider = provider