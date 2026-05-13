from copy import deepcopy
from models import Column, Field, Section, Subsection, db, Resume

from utils.formatting import format_label

# ** Helper function to set column widths based on manual and auto width settings **
def update_column_widths(resume_id):
    columns = Column.query.filter_by(resume_id=resume_id).all()

    def get_width(column):
        layout = column.layout or {}
        return layout.get("width", {})

    manual_width_columns = [
        column for column in columns
        if not get_width(column).get("auto", True)
    ]

    auto_width_columns = [
        column for column in columns
        if get_width(column).get("auto", True)
    ]

    manual_width_total = sum(
        float(str(get_width(column).get("value", "0%")).strip("%"))
        for column in manual_width_columns
    )

    remaining_width = max(0, 100 - manual_width_total)

    new_auto_width = (
        remaining_width / len(auto_width_columns)
        if auto_width_columns
        else 0
    )

    for column in auto_width_columns:
        layout = column.layout or {}

        layout.setdefault("width", {
            "value": "100%",
            "auto": True,
        })

        layout["width"]["value"] = f"{new_auto_width:.1f}%"
        layout["width"]["auto"] = True

        column.layout = layout

    return columns