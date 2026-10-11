"""Test fixtures.

Tests run against an in-memory SQLite database so they need no PostgreSQL
server. The app's `get_db` dependency is overridden with the test session.
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.ratelimit import reset_login_limiter
from app.database import Base, get_db
from app.main import create_app

# Importing models registers their tables on Base.metadata.
from app import models  # noqa: F401


@pytest.fixture(autouse=True)
def _reset_global_state():
    """Isolate the in-memory login rate limiter between tests."""
    reset_login_limiter()
    yield


@pytest.fixture()
def session_factory():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(
        bind=engine, autoflush=False, autocommit=False, expire_on_commit=False
    )
    try:
        yield TestingSessionLocal
    finally:
        Base.metadata.drop_all(bind=engine)
        engine.dispose()


@pytest.fixture()
def client(session_factory):
    app = create_app()

    def override_get_db():
        db = session_factory()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
