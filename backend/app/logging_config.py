"""Structured logging setup. No secrets or connection strings are logged."""

import logging


def configure_logging(level: str = "INFO") -> None:
    logging.basicConfig(
        level=level.upper(),
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )
    # Keep noisy third-party loggers at a sane default.
    logging.getLogger("uvicorn.access").setLevel(logging.INFO)
