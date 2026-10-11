"""add structured case-study sections to projects

Revision ID: 0003_project_case_studies
Revises: 0002
Create Date: 2026-10-11

Preserves existing records: every new column is nullable=False with an
in-database server default (empty list / empty string), so existing rows keep
their current content intact and read back as empty sections until edited.
No migration history is rewritten.
"""
from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0003_project_case_studies"
down_revision: str | None = "0002_owners_sessions"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

em_json = postgresql.JSONB(astext_type=sa.Text())


def _add_json_section(name: str) -> None:
    op.add_column(
        "projects",
        sa.Column(name, em_json, nullable=False, server_default="[]"),
    )


def upgrade() -> None:
    for name in (
        "problem",
        "solution",
        "my_contribution",
        "stack_detail",
        "architecture",
        "challenges",
        "outcomes",
        "links",
    ):
        _add_json_section(name)
    op.add_column(
        "projects",
        sa.Column("users", sa.Text(), nullable=False, server_default=""),
    )


def downgrade() -> None:
    for name in (
        "problem",
        "solution",
        "my_contribution",
        "stack_detail",
        "architecture",
        "challenges",
        "outcomes",
        "links",
        "users",
    ):
        op.drop_column("projects", name)