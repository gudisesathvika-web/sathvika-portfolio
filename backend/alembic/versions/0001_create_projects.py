"""create projects table

Revision ID: 0001_create_projects
Revises:
Create Date: 2026-10-11

"""
from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0001_create_projects"


def _json_type():
    bind = op.get_bind()
    if bind.dialect.name == "mysql":
        return sa.JSON()
    return postgresql.JSONB(astext_type=sa.Text())
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "projects",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("direction", sa.String(length=200), nullable=False),
        sa.Column("summary", sa.Text(), nullable=False),
        sa.Column(
            "stack",
            _json_type(),
            nullable=False,
            server_default="[]",
        ),
        sa.Column(
            "is_published",
            sa.Boolean(),
            nullable=False,
            server_default=sa.false(),
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
    op.create_index(
        "ix_projects_is_published", "projects", ["is_published"], unique=False
    )


def downgrade() -> None:
    op.drop_index("ix_projects_is_published", table_name="projects")
    op.drop_table("projects")
