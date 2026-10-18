"""About content model.

Stores the public About section as a single editable record. Publishing state
keeps draft edits private until the owner explicitly publishes them.
"""

from datetime import datetime

from sqlalchemy import Boolean, DateTime, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import JSON

from ..database import Base

ListSectionType = JSON().with_variant(JSONB, "postgresql")


class AboutContent(Base):
    __tablename__ = "about_content"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    paragraphs: Mapped[list[str]] = mapped_column(
        ListSectionType, nullable=False, default=list, server_default="[]"
    )
    facts: Mapped[list[dict]] = mapped_column(
        ListSectionType, nullable=False, default=list, server_default="[]"
    )
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