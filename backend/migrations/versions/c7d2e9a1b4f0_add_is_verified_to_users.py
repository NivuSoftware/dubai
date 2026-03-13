"""add is_verified to users

Revision ID: c7d2e9a1b4f0
Revises: b2a9f2c4d1e0
Create Date: 2026-03-11 12:20:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "c7d2e9a1b4f0"
down_revision = "b2a9f2c4d1e0"
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    existing_tables = set(inspector.get_table_names())

    if "users" not in existing_tables:
        return

    existing_columns = {column["name"] for column in inspector.get_columns("users")}
    if "is_verified" in existing_columns:
        return

    with op.batch_alter_table("users", schema=None) as batch_op:
        batch_op.add_column(
            sa.Column("is_verified", sa.Boolean(), nullable=False, server_default=sa.false())
        )
        batch_op.alter_column("is_verified", server_default=None)


def downgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    existing_tables = set(inspector.get_table_names())

    if "users" not in existing_tables:
        return

    existing_columns = {column["name"] for column in inspector.get_columns("users")}
    if "is_verified" not in existing_columns:
        return

    with op.batch_alter_table("users", schema=None) as batch_op:
        batch_op.drop_column("is_verified")
