"""Public API mapping + seeding tests.

Verifies the public project endpoint returns the exact summarized schema the
frontend maps to (and never leaks drafts), and that seeding is safe/repeatable.
Uses in-memory SQLite; no PostgreSQL involved.
"""

import app.database as database
import app.scripts.seed_projects as seed_module
from app.database import Base
from app.models.project import Project
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool


def _make_session_factory():
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    Base.metadata.create_all(bind=engine)
    return sessionmaker(bind=engine, autoflush=False, autocommit=False, expire_on_commit=False)


def test_public_response_maps_only_summary_fields_and_excludes_drafts(client, session_factory):
    with session_factory() as db:
        db.add(
            Project(
                id="live",
                title="Live",
                direction="Public",
                summary="S.",
                stack=["A"],
                is_published=True,
            )
        )
        db.add(
            Project(
                id="secret-draft",
                title="Draft",
                direction="Private",
                summary="Never visible.",
                stack=[],
                is_published=False,
            )
        )
        db.commit()

    response = client.get("/api/v1/projects")
    assert response.status_code == 200
    items = response.json()
    assert [p["id"] for p in items] == ["live"]
    assert set(items[0].keys()) == {
        "id",
        "title",
        "direction",
        "summary",
        "stack",
        "is_published",
        "updated_at",
        "problem",
        "users",
        "solution",
        "my_contribution",
        "stack_detail",
        "architecture",
        "challenges",
        "outcomes",
        "links",
    }
    assert items[0]["is_published"] is True
    assert items[0]["problem"] == []
    assert items[0]["links"] == []


def test_seed_projects_is_safe_and_repeatable():
    factory = _make_session_factory()
    database.SessionLocal = factory
    seed_module.SessionLocal = factory

    first = seed_module.seed_projects()
    assert first == {"created": 2, "filled": 0, "skipped": 0}

    with factory() as db:
        owner_edit = db.get(Project, "skillforge")
        owner_edit.title = "SkillForge (Owner Edited)"
        db.commit()

    second = seed_module.seed_projects()
    assert second == {"created": 0, "filled": 0, "skipped": 2}

    with factory() as db:
        row = db.get(Project, "skillforge")
    assert row.title == "SkillForge (Owner Edited)", "seed must not overwrite owner edits"
    assert len(row.problem) > 0, "seeded case-study sections were populated on create"

    public_ids = sorted(row.id for row in _published(_db_get_all(factory)))
    assert public_ids == ["accessguard", "skillforge"]


def test_seed_backfills_empty_sections_but_never_overwrites_content():
    factory = _make_session_factory()
    database.SessionLocal = factory
    seed_module.SessionLocal = factory

    with factory() as db:
        db.add(
            Project(
                id="accessguard",
                title="AccessGuard (Owner Kept)",
                direction="Web accessibility auditing",
                summary="Owner-written summary that must survive.",
                stack=["Accessibility"],
                is_published=True,
                problem=["Owner-verified problem statement."],
                challenges=[],
            )
        )
        db.commit()

    result = seed_module.seed_projects()
    assert result["created"] == 1  # skillforge not present → created
    assert result["filled"] == 1  # accessguard: empty sections backfilled
    assert result["skipped"] == 0

    with factory() as db:
        row = db.get(Project, "accessguard")
        assert row.title == "AccessGuard (Owner Kept)"
        assert row.summary == "Owner-written summary that must survive."
        assert row.problem == ["Owner-verified problem statement."]
        assert row.challenges, "empty section should be backfilled from verified seed"
        assert row.architecture, "empty section should be backfilled from verified seed"
        assert row.solution, "empty section should be backfilled from verified seed"


def _db_get_all(factory):
    with factory() as db:
        return list(db.query(Project).all())


def _published(rows):
    return [row for row in rows if row.is_published]