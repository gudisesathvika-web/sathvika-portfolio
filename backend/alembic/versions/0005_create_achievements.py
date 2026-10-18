"""create achievements table

Revision ID: 0005_create_achievements
Revises: 0004_create_about_content
Create Date: 2026-10-18
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0005_create_achievements"
down_revision: str | None = "0004_create_about_content"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "achievements",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("category", sa.String(length=100), nullable=False, server_default="Achievement"),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("detail", sa.Text(), nullable=False, server_default=""),
        sa.Column("achieved_on", sa.String(length=100), nullable=False, server_default=""),
        sa.Column("link_label", sa.String(length=100), nullable=False, server_default=""),
        sa.Column("link_url", sa.String(length=500), nullable=False, server_default=""),
        sa.Column("display_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("is_published", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("achievements")