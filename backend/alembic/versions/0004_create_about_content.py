"""create about_content table

Revision ID: 0004_create_about_content
Revises: 0003_project_case_studies
Create Date: 2026-10-18
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0004_create_about_content"
down_revision: str | None = "0003_project_case_studies"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "about_content",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("paragraphs", sa.JSON(), nullable=False, server_default="[]"),
        sa.Column("facts", sa.JSON(), nullable=False, server_default="[]"),
        sa.Column("is_published", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("about_content")