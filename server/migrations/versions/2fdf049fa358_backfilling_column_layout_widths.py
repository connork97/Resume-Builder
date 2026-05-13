"""backfilling column layout widths

Revision ID: 2fdf049fa358
Revises: 544029a4ec0c
Create Date: 2026-05-12 17:11:29.916437

"""

from alembic import op
import json
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "2fdf049fa358"
down_revision = "544029a4ec0c"
branch_labels = None
depends_on = None


def upgrade():
    connection = op.get_bind()

    rows = connection.execute(sa.text("""
        SELECT id, width, auto_width, layout
        FROM columns
    """)).fetchall()

    for row in rows:
        layout = row.layout or {}

        if isinstance(layout, str):
            layout = json.loads(layout)

        layout["width"] = {
            "value": row.width or "100%",
            "auto": bool(row.auto_width),
        }

        connection.execute(
            sa.text("""
                UPDATE columns
                SET layout = :layout
                WHERE id = :id
            """),
            {
                "id": row.id,
                "layout": json.dumps(layout),
            },
        )


def downgrade():
    connection = op.get_bind()

    rows = connection.execute(sa.text("""
        SELECT id, layout
        FROM columns
    """)).fetchall()

    for row in rows:
        layout = row.layout or {}

        if isinstance(layout, str):
            layout = json.loads(layout)

        width = layout.get("width", {})

        connection.execute(
            sa.text("""
                UPDATE columns
                SET width = :width,
                    auto_width = :auto_width
                WHERE id = :id
            """),
            {
                "id": row.id,
                "width": width.get("value", "100%"),
                "auto_width": width.get("auto", True),
            },
        )
