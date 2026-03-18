"""add has_used_free_trial to users

Revision ID: a9b8c7d6e5f4
Revises: c4d1e8b7a2f9
Create Date: 2026-03-15 18:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "a9b8c7d6e5f4"
down_revision = "c4d1e8b7a2f9"
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    existing_tables = set(inspector.get_table_names())

    if "users" not in existing_tables:
        return

    existing_columns = {column["name"] for column in inspector.get_columns("users")}
    if "has_used_free_trial" not in existing_columns:
        with op.batch_alter_table("users", schema=None) as batch_op:
            batch_op.add_column(
                sa.Column(
                    "has_used_free_trial",
                    sa.Boolean(),
                    nullable=False,
                    server_default=sa.false(),
                )
            )
            batch_op.alter_column("has_used_free_trial", server_default=None)

    inspector = sa.inspect(bind)
    existing_tables = set(inspector.get_table_names())
    if "anuncios" in existing_tables:
        bind.execute(
            sa.text(
                """
                UPDATE users
                SET has_used_free_trial = TRUE
                WHERE id IN (
                    SELECT owner_id
                    FROM anuncios
                    WHERE plan = 'trial'
                )
                """
            )
        )


def downgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    existing_tables = set(inspector.get_table_names())

    if "users" not in existing_tables:
        return

    existing_columns = {column["name"] for column in inspector.get_columns("users")}
    if "has_used_free_trial" not in existing_columns:
        return

    with op.batch_alter_table("users", schema=None) as batch_op:
        batch_op.drop_column("has_used_free_trial")
