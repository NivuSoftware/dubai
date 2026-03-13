"""add is_verification_rejected to users

Revision ID: f3a8c7d1b2e4
Revises: e1a7c5d3f9b2
Create Date: 2026-03-11 15:05:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "f3a8c7d1b2e4"
down_revision = "e1a7c5d3f9b2"
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    existing_tables = set(inspector.get_table_names())

    if "users" not in existing_tables:
        return

    existing_columns = {column["name"] for column in inspector.get_columns("users")}
    if "is_verification_rejected" in existing_columns:
        return

    with op.batch_alter_table("users", schema=None) as batch_op:
        batch_op.add_column(
            sa.Column(
                "is_verification_rejected",
                sa.Boolean(),
                nullable=False,
                server_default=sa.false(),
            )
        )
        batch_op.alter_column("is_verification_rejected", server_default=None)


def downgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    existing_tables = set(inspector.get_table_names())

    if "users" not in existing_tables:
        return

    existing_columns = {column["name"] for column in inspector.get_columns("users")}
    if "is_verification_rejected" not in existing_columns:
        return

    with op.batch_alter_table("users", schema=None) as batch_op:
        batch_op.drop_column("is_verification_rejected")
