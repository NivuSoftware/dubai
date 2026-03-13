"""create verification_requests table

Revision ID: e1a7c5d3f9b2
Revises: d9f4c2a8e6b1
Create Date: 2026-03-11 13:40:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "e1a7c5d3f9b2"
down_revision = "d9f4c2a8e6b1"
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    existing_tables = set(inspector.get_table_names())

    if "verification_requests" in existing_tables or "users" not in existing_tables:
        return

    op.create_table(
        "verification_requests",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("full_name", sa.String(length=255), nullable=False),
        sa.Column("document_number", sa.String(length=50), nullable=False),
        sa.Column("birth_date", sa.Date(), nullable=False),
        sa.Column("document_image_path", sa.String(length=500), nullable=False),
        sa.Column("portrait_image_path", sa.String(length=500), nullable=False),
        sa.Column("status", sa.String(length=30), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )

    with op.batch_alter_table("verification_requests", schema=None) as batch_op:
        batch_op.create_index("ix_verification_requests_user_id", ["user_id"], unique=False)
        batch_op.create_index(
            "ix_verification_requests_document_number", ["document_number"], unique=False
        )
        batch_op.create_index("ix_verification_requests_status", ["status"], unique=False)


def downgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    existing_tables = set(inspector.get_table_names())

    if "verification_requests" not in existing_tables:
        return

    with op.batch_alter_table("verification_requests", schema=None) as batch_op:
        batch_op.drop_index("ix_verification_requests_status")
        batch_op.drop_index("ix_verification_requests_document_number")
        batch_op.drop_index("ix_verification_requests_user_id")

    op.drop_table("verification_requests")
