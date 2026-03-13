"""update anuncio plans and fecha_hasta to datetime

Revision ID: f5b7d9e2c1a4
Revises: aa12b3c4d5e6
Create Date: 2026-03-13 12:30:00.000000
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "f5b7d9e2c1a4"
down_revision = "aa12b3c4d5e6"
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table("anuncios") as batch_op:
        batch_op.alter_column(
            "fecha_hasta",
            existing_type=sa.Date(),
            type_=sa.DateTime(),
            existing_nullable=False,
        )


def downgrade():
    with op.batch_alter_table("anuncios") as batch_op:
        batch_op.alter_column(
            "fecha_hasta",
            existing_type=sa.DateTime(),
            type_=sa.Date(),
            existing_nullable=False,
        )
