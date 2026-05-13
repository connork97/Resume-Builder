"""backfill column and section layouts

Revision ID: 284a77b0e055
Revises: d214adcbd22f
Create Date: 2026-05-12 18:38:27.671353

"""
from alembic import op
import sqlalchemy as sa
import json


# revision identifiers, used by Alembic.
revision = '284a77b0e055'
down_revision = 'd214adcbd22f'
branch_labels = None
depends_on = None



def load_layout(raw):
    if not raw:
        return {}

    if isinstance(raw, str):
        return json.loads(raw)

    return raw


def upgrade():
    connection = op.get_bind()

    columns = connection.execute(sa.text("""
        SELECT id, layout
        FROM columns
    """)).fetchall()

    for column in columns:
        layout = load_layout(column.layout)

        layout.setdefault("padding", {
            "top": "0.5rem",
            "bottom": "0.5rem",
            "left": "1rem",
            "right": "1rem",
        })

        connection.execute(
            sa.text("""
                UPDATE columns
                SET layout = :layout
                WHERE id = :id
            """),
            {
                "id": column.id,
                "layout": json.dumps(layout),
            },
        )


def downgrade():
    connection = op.get_bind()

    columns = connection.execute(sa.text("""
        SELECT id, layout
        FROM columns
    """)).fetchall()

    for column in columns:
        layout = load_layout(column.layout)

        layout.pop("padding", None)

        connection.execute(
            sa.text("""
                UPDATE columns
                SET layout = :layout
                WHERE id = :id
            """),
            {
                "id": column.id,
                "layout": json.dumps(layout),
            },
        )