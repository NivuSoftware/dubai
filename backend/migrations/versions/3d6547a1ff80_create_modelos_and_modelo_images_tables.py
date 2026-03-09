"""create modelos and modelo_images tables

Revision ID: 3d6547a1ff80
Revises: 
Create Date: 2026-03-07 01:45:14.261599

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3d6547a1ff80'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    existing_tables = set(inspector.get_table_names())

    if 'users' not in existing_tables:
        op.create_table(
            'users',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('email', sa.String(length=255), nullable=False),
            sa.Column('password_hash', sa.String(length=255), nullable=False),
            sa.Column('role', sa.String(length=50), nullable=False),
            sa.Column('created_at', sa.DateTime(), nullable=False),
            sa.PrimaryKeyConstraint('id'),
        )
        with op.batch_alter_table('users', schema=None) as batch_op:
            batch_op.create_index(batch_op.f('ix_users_email'), ['email'], unique=True)

    if 'modelos' not in existing_tables:
        op.create_table(
            'modelos',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('nombre', sa.String(length=120), nullable=False),
            sa.Column('edad', sa.Integer(), nullable=False),
            sa.Column('descripcion', sa.Text(), nullable=False),
            sa.Column('disponibilidad', sa.String(length=120), nullable=False),
            sa.Column('ubicacion', sa.String(length=150), nullable=False),
            sa.Column('categoria', sa.String(length=120), nullable=False),
            sa.Column('created_at', sa.DateTime(), nullable=False),
            sa.Column('updated_at', sa.DateTime(), nullable=False),
            sa.PrimaryKeyConstraint('id'),
        )
        with op.batch_alter_table('modelos', schema=None) as batch_op:
            batch_op.create_index(batch_op.f('ix_modelos_nombre'), ['nombre'], unique=False)

    if 'modelo_images' not in existing_tables:
        op.create_table(
            'modelo_images',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('modelo_id', sa.Integer(), nullable=False),
            sa.Column('path', sa.String(length=500), nullable=False),
            sa.Column('created_at', sa.DateTime(), nullable=False),
            sa.ForeignKeyConstraint(['modelo_id'], ['modelos.id'], ondelete='CASCADE'),
            sa.PrimaryKeyConstraint('id'),
        )
        with op.batch_alter_table('modelo_images', schema=None) as batch_op:
            batch_op.create_index(batch_op.f('ix_modelo_images_modelo_id'), ['modelo_id'], unique=False)


def downgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    existing_tables = set(inspector.get_table_names())

    if 'modelo_images' in existing_tables:
        with op.batch_alter_table('modelo_images', schema=None) as batch_op:
            batch_op.drop_index(batch_op.f('ix_modelo_images_modelo_id'))
        op.drop_table('modelo_images')

    if 'modelos' in existing_tables:
        with op.batch_alter_table('modelos', schema=None) as batch_op:
            batch_op.drop_index(batch_op.f('ix_modelos_nombre'))
        op.drop_table('modelos')
