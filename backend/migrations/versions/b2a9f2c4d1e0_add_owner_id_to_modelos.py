"""add owner_id to modelos

Revision ID: b2a9f2c4d1e0
Revises: 9f3c1b2d4e8a
Create Date: 2026-03-10 12:40:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "b2a9f2c4d1e0"
down_revision = "9f3c1b2d4e8a"
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    existing_tables = set(inspector.get_table_names())

    if "modelos" not in existing_tables or "users" not in existing_tables:
        return

    existing_columns = {column["name"] for column in inspector.get_columns("modelos")}
    if "owner_id" not in existing_columns:
        with op.batch_alter_table("modelos", schema=None) as batch_op:
            batch_op.add_column(sa.Column("owner_id", sa.Integer(), nullable=True))

    inspector = sa.inspect(bind)
    existing_indexes = {index["name"] for index in inspector.get_indexes("modelos")}
    fk_names = {fk["name"] for fk in inspector.get_foreign_keys("modelos")}

    with op.batch_alter_table("modelos", schema=None) as batch_op:
        if "ix_modelos_owner_id" not in existing_indexes:
            batch_op.create_index("ix_modelos_owner_id", ["owner_id"], unique=False)
        if "fk_modelos_owner_id_users" not in fk_names:
            batch_op.create_foreign_key(
                "fk_modelos_owner_id_users", "users", ["owner_id"], ["id"], ondelete="SET NULL"
            )


def downgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    existing_tables = set(inspector.get_table_names())

    if "modelos" not in existing_tables:
        return

    existing_columns = {column["name"] for column in inspector.get_columns("modelos")}
    if "owner_id" not in existing_columns:
        return

    existing_indexes = {index["name"] for index in inspector.get_indexes("modelos")}
    fk_names = {fk["name"] for fk in inspector.get_foreign_keys("modelos")}

    with op.batch_alter_table("modelos", schema=None) as batch_op:
        if "fk_modelos_owner_id_users" in fk_names:
            batch_op.drop_constraint("fk_modelos_owner_id_users", type_="foreignkey")
        if "ix_modelos_owner_id" in existing_indexes:
            batch_op.drop_index("ix_modelos_owner_id")
        batch_op.drop_column("owner_id")
