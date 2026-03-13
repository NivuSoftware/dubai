"""add is_verification_requested to users

Revision ID: d9f4c2a8e6b1
Revises: c7d2e9a1b4f0
Create Date: 2026-03-11 13:05:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "d9f4c2a8e6b1"
down_revision = "c7d2e9a1b4f0"
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    existing_tables = set(inspector.get_table_names())

    if "users" not in existing_tables:
        return

    existing_columns = {column["name"] for column in inspector.get_columns("users")}
    if "is_verification_requested" in existing_columns:
        return

    with op.batch_alter_table("users", schema=None) as batch_op:
        batch_op.add_column(
            sa.Column(
                "is_verification_requested",
                sa.Boolean(),
                nullable=False,
                server_default=sa.false(),
            )
        )
        batch_op.alter_column("is_verification_requested", server_default=None)


def downgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    existing_tables = set(inspector.get_table_names())

    if "users" not in existing_tables:
        return

    existing_columns = {column["name"] for column in inspector.get_columns("users")}
    if "is_verification_requested" not in existing_columns:
        return

    with op.batch_alter_table("users", schema=None) as batch_op:
        batch_op.drop_column("is_verification_requested")
