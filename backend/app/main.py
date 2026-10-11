"""FastAPI application factory and ASGI entrypoint (`app.main:app`)."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.v1.router import api_router
from .config import get_settings
from .core.errors import register_exception_handlers
from .logging_config import configure_logging


def create_app() -> FastAPI:
    settings = get_settings()
    configure_logging(settings.log_level)

    app = FastAPI(
        title=settings.app_name,
        version=settings.version,
        docs_url="/docs",
        redoc_url=None,
        openapi_url="/openapi.json",
    )

    origins = settings.cors_origin_list
    # Explicit, environment-driven allowlist. Credentials are only enabled when
    # the allowlist is non-empty and does not use a wildcard.
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=bool(origins) and "*" not in origins,
        allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )

    register_exception_handlers(app)
    app.include_router(api_router, prefix=settings.api_v1_prefix)

    @app.get("/", include_in_schema=False)
    def root() -> dict[str, str]:
        return {
            "service": settings.app_name,
            "version": settings.version,
            "api": settings.api_v1_prefix,
            "docs": "/docs",
        }

    return app


app = create_app()
