"""add precio to modelos

Revision ID: 9f3c1b2d4e8a
Revises: 3d6547a1ff80
Create Date: 2026-03-07 11:45:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "9f3c1b2d4e8a"
down_revision = "3d6547a1ff80"
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    existing_tables = set(inspector.get_table_names())

    if "modelos" not in existing_tables:
        return

    existing_columns = {column["name"] for column in inspector.get_columns("modelos")}
    if "precio" in existing_columns:
        return

    with op.batch_alter_table("modelos", schema=None) as batch_op:
        batch_op.add_column(
            sa.Column("precio", sa.Numeric(precision=10, scale=2), nullable=False, server_default="0")
        )
        batch_op.alter_column("precio", server_default=None)


def downgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    existing_tables = set(inspector.get_table_names())

    if "modelos" not in existing_tables:
        return

    existing_columns = {column["name"] for column in inspector.get_columns("modelos")}
    if "precio" not in existing_columns:
        return

    with op.batch_alter_table("modelos", schema=None) as batch_op:
        batch_op.drop_column("precio")
