"""Application configuration, loaded from environment variables.

No credentials are hardcoded: `DATABASE_URL`, session/cookie settings, and the
CORS allowlist are read from the environment (or a local `.env` file). Nothing
here is logged.
"""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    app_name: str = "Sathvika Portfolio API"
    app_env: str = "development"
    api_v1_prefix: str = "/api/v1"
    version: str = "0.1.0"
    log_level: str = "INFO"

    # PostgreSQL-compatible SQLAlchemy URL. psycopg (v3) driver.
    database_url: str = (
        "postgresql+psycopg://portfolio:portfolio@localhost:5432/portfolio"
    )

    # Comma-separated allowlist of front-end origins.
    cors_origins: str = "http://127.0.0.1:5173,http://localhost:5173"

    # --- Authentication / session ---
    # Opaque session token cookie. The token itself is never stored; only its
    # SHA-256 hash is persisted. The CSRF cookie is not HttpOnly by design so
    # the frontend can echo it back in the X-CSRF-Token header.
    session_cookie_name: str = "sathvika_session"
    csrf_cookie_name: str = "sathvika_csrf"
    session_max_age_seconds: int = 60 * 60 * 12  # 12 hours

    # Cookie flags. Production (frontend + backend on separate origins,
    # served over HTTPS) must set COOKIE_SECURE=true and COOKIE_SAMESITE=none.
    cookie_secure: bool = False
    cookie_samesite: str = "lax"

    # Login rate limiting (in-memory, per process).
    login_rate_limit_max_attempts: int = 5
    login_rate_limit_window_seconds: int = 60 * 15  # 15 minutes

    # --- Contact form ---
    contact_rate_limit_max_attempts: int = 10
    contact_rate_limit_window_seconds: int = 60 * 60  # 1 hour (per IP)
    # Optional: outbound email provider (leave empty to return 503 in non-test?)
    # For a realistic free-tier approach without hardcoding secrets, we expect:
    #  - CONTACT_PROVIDER: e.g. "resend" | "brevo" | "sendgrid" (or "mock" for tests)
    #  - CONTACT_API_KEY: secret key (do NOT commit; read from env)
    #  - CONTACT_FROM_EMAIL / CONTACT_FROM_NAME: sender shown to provider
    #  - CONTACT_TO_EMAIL / CONTACT_TO_NAME: recipient
    contact_provider: str = "mock"
    contact_api_key: str = ""
    contact_from_email: str = ""
    contact_from_name: str = ""
    contact_to_email: str = ""
    contact_to_name: str = ""
    contact_endpoint_url: str = ""  # provider-specific HTTPS endpoint if needed

    @property
    def cors_origin_list(self) -> list[str]:
        """CORS allowlist as a list. Empty entries are dropped."""
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()