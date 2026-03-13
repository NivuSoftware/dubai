"""add is_draft to anuncios

Revision ID: c4d1e8b7a2f9
Revises: f5b7d9e2c1a4
Create Date: 2026-03-13 14:10:00.000000
"""

from alembic import op
import sqlalchemy as sa


revision = "c4d1e8b7a2f9"
down_revision = "f5b7d9e2c1a4"
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table("anuncios") as batch_op:
        batch_op.add_column(sa.Column("is_draft", sa.Boolean(), nullable=False, server_default=sa.false()))
        batch_op.create_index("ix_anuncios_is_draft", ["is_draft"], unique=False)


def downgrade():
    with op.batch_alter_table("anuncios") as batch_op:
        batch_op.drop_index("ix_anuncios_is_draft")
        batch_op.drop_column("is_draft")
