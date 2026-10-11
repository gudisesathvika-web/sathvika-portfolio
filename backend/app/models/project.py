"""Project content model.

Mirrors the fields the front-end `Project` schema exposes (`src/data/content.ts`)
so the API can serve published projects without the front-end changing shape.
Only a small, read-oriented subset is stored here for now. Publishing state is
a simple `is_published` flag (published / draft).
"""

from datetime import datetime

from sqlalchemy import Boolean, DateTime, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import JSON

from ..database import Base

# JSONB on PostgreSQL, plain JSON on other backends (e.g. SQLite in tests).
# Used for `list[str]` case-study sections and `links`. Column defaults are
# safe for existing rows (migration backfills without touching current data).
ListSectionType = JSON().with_variant(JSONB, "postgresql")


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    direction: Mapped[str] = mapped_column(String(200), nullable=False)
    summary: Mapped[str] = mapped_column(Text, nullable=False)
    stack: Mapped[list[str]] = mapped_column(ListSectionType, nullable=False, default=list, server_default="[]")

    # Structured, optional case-study sections (verified content only).
    problem: Mapped[list[str]] = mapped_column(ListSectionType, nullable=False, default=list, server_default="[]")
    users: Mapped[str] = mapped_column(Text, nullable=False, default="", server_default="")
    solution: Mapped[list[str]] = mapped_column(ListSectionType, nullable=False, default=list, server_default="[]")
    my_contribution: Mapped[list[str]] = mapped_column(ListSectionType, nullable=False, default=list, server_default="[]")
    stack_detail: Mapped[list[str]] = mapped_column(ListSectionType, nullable=False, default=list, server_default="[]")
    architecture: Mapped[list[str]] = mapped_column(ListSectionType, nullable=False, default=list, server_default="[]")
    challenges: Mapped[list[str]] = mapped_column(ListSectionType, nullable=False, default=list, server_default="[]")
    outcomes: Mapped[list[str]] = mapped_column(ListSectionType, nullable=False, default=list, server_default="[]")
    links: Mapped[list[dict]] = mapped_column(ListSectionType, nullable=False, default=list, server_default="[]")

    is_published: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False, index=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    def __repr__(self) -> str:  # pragma: no cover - debugging aid only
        state = "published" if self.is_published else "draft"
        return f"<Project id={self.id!r} status={state}>"
