"""add contact fields to anuncios

Revision ID: aa12b3c4d5e6
Revises: f3a8c7d1b2e4
Create Date: 2026-03-12 22:35:00.000000
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "aa12b3c4d5e6"
down_revision = "a4d9c2f7b1e3"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("anuncios", sa.Column("contact_country_code", sa.String(length=8), nullable=True))
    op.add_column("anuncios", sa.Column("contact_number", sa.String(length=20), nullable=True))


def downgrade():
    op.drop_column("anuncios", "contact_number")
    op.drop_column("anuncios", "contact_country_code")
