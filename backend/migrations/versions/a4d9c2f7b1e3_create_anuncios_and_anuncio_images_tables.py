"""create anuncios and anuncio_images tables

Revision ID: a4d9c2f7b1e3
Revises: f3a8c7d1b2e4
Create Date: 2026-03-12 11:30:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "a4d9c2f7b1e3"
down_revision = "f3a8c7d1b2e4"
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    existing_tables = set(inspector.get_table_names())

    if "anuncios" not in existing_tables and "users" in existing_tables:
        op.create_table(
            "anuncios",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("owner_id", sa.Integer(), nullable=False),
            sa.Column("titulo", sa.String(length=180), nullable=False),
            sa.Column("descripcion", sa.Text(), nullable=False),
            sa.Column("precio", sa.Numeric(precision=10, scale=2), nullable=False),
            sa.Column("ubicacion", sa.String(length=150), nullable=False),
            sa.Column("estado", sa.String(length=30), nullable=False),
            sa.Column("pago", sa.String(length=30), nullable=False),
            sa.Column("plan", sa.String(length=20), nullable=False),
            sa.Column("imagen_comprobante_pago", sa.String(length=500), nullable=False),
            sa.Column("fecha_hasta", sa.Date(), nullable=False),
            sa.Column("created_at", sa.DateTime(), nullable=False),
            sa.Column("updated_at", sa.DateTime(), nullable=False),
            sa.ForeignKeyConstraint(["owner_id"], ["users.id"], ondelete="CASCADE"),
            sa.PrimaryKeyConstraint("id"),
        )
        with op.batch_alter_table("anuncios", schema=None) as batch_op:
            batch_op.create_index("ix_anuncios_owner_id", ["owner_id"], unique=False)
            batch_op.create_index("ix_anuncios_titulo", ["titulo"], unique=False)
            batch_op.create_index("ix_anuncios_estado", ["estado"], unique=False)
            batch_op.create_index("ix_anuncios_pago", ["pago"], unique=False)
            batch_op.create_index("ix_anuncios_fecha_hasta", ["fecha_hasta"], unique=False)

    inspector = sa.inspect(bind)
    existing_tables = set(inspector.get_table_names())
    if "anuncio_images" not in existing_tables and "anuncios" in existing_tables:
        op.create_table(
            "anuncio_images",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("anuncio_id", sa.Integer(), nullable=False),
            sa.Column("path", sa.String(length=500), nullable=False),
            sa.Column("created_at", sa.DateTime(), nullable=False),
            sa.ForeignKeyConstraint(["anuncio_id"], ["anuncios.id"], ondelete="CASCADE"),
            sa.PrimaryKeyConstraint("id"),
        )
        with op.batch_alter_table("anuncio_images", schema=None) as batch_op:
            batch_op.create_index("ix_anuncio_images_anuncio_id", ["anuncio_id"], unique=False)


def downgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    existing_tables = set(inspector.get_table_names())

    if "anuncio_images" in existing_tables:
        with op.batch_alter_table("anuncio_images", schema=None) as batch_op:
            batch_op.drop_index("ix_anuncio_images_anuncio_id")
        op.drop_table("anuncio_images")

    if "anuncios" in existing_tables:
        with op.batch_alter_table("anuncios", schema=None) as batch_op:
            batch_op.drop_index("ix_anuncios_fecha_hasta")
            batch_op.drop_index("ix_anuncios_pago")
            batch_op.drop_index("ix_anuncios_estado")
            batch_op.drop_index("ix_anuncios_titulo")
            batch_op.drop_index("ix_anuncios_owner_id")
        op.drop_table("anuncios")
