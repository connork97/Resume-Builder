from copy import deepcopy
from models import Column, Field, Section, Subsection, db, Resume

from utils.formatting import format_label

# ** Helper function to set column widths based on manual and auto width settings **
def update_column_widths(resume_id):
    columns = Column.query.filter_by(resume_id=resume_id).all()

    manual_width_columns = [
        column for column in columns
        if not column.layout.get('width', {}).get('auto', True)
    ]

    auto_width_columns = [
        column for column in columns
        if column.layout.get('width', {}).get('auto', True)
    ]

    manual_width_total = sum(
        float(
            column.layout.get('width', {}).get('value', '0%').strip('%')
        )
        for column in manual_width_columns
    )

    remaining_width = max(0, 100 - manual_width_total)

    new_auto_width = (
        remaining_width / len(auto_width_columns)
        if auto_width_columns
        else 0
    )

    for column in auto_width_columns:
        column.layout['width']['value'] = f"{new_auto_width:.1f}%"

    return columns