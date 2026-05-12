from flask import Blueprint, request, jsonify, session
from models import db, Resume, Column, Section, Subsection, Field

from services.builders import (
    build_resume_with_defaults,
    add_column,
    add_section,
    add_subsection,
    add_field,
    add_default_fields,
)

from services.updaters import update_column_widths

from services.resume_updater import update_resume_with_form_data

from utils.responses import generate_error, generate_success

column_bp = Blueprint("column", __name__, url_prefix="/columns")


# ** ROUTES ** #

@column_bp.route("/<int:resume_id>", methods=["POST"])
def add_column(resume_id):
    print(f"Received POST request to add column to resume of ID {resume_id}.")

    try:
        resume = Resume.query.filter(Resume.id == resume_id).one_or_none()
        if not resume:
            return generate_error(
                error_type="NOT_FOUND",
                code="RESUME_NOT_FOUND",
                message=f"Could not find resume of ID {resume_id} to add a column to.",
            )

        column_count = len(resume.columns)
        
        new_column = Column(
            resume_id=resume_id,
            position=column_count,
            width=None
        )
        db.session.add(new_column)
        db.session.flush()
        
        update_column_widths(resume_id)

        db.session.commit()

        return jsonify(resume.to_dict()), 201

    except Exception:
        db.session.rollback()
        raise
     
@column_bp.route("/<int:resume_id>", methods=["DELETE"])
def delete_last_column(resume_id):
    print(f"Received DELETE request for the last column of resume of ID {resume_id}.")

    try:
        resume = Resume.query.filter_by(id=resume_id).one_or_none()
        if not resume:
            return generate_error(
                error_type="NOT_FOUND",
                code="RESUME_NOT_FOUND",
                message=f"Could not find resume of ID {resume_id}.",
            )

        column_to_delete = (
            Column.query.filter_by(resume_id=resume_id)
            .order_by(Column.position.desc())
            .first()
        )

        second_to_last_column = (
            Column.query.filter_by(resume_id=resume_id)
            .order_by(Column.position.desc())
            .offset(1)
            .first()
        )

        if not second_to_last_column:
            return generate_error(
                error_type="FORBIDDEN",
                code="INVALID_COLUMN_COUNT",
                message="Resumes require at least one column.",
            )

        if not column_to_delete:
            return generate_error(
                error_type="NOT_FOUND",
                code="COLUMN_NOT_FOUND",
                message="Column to delete not found.",
            )

        max_position = max(
            [section.position for section in second_to_last_column.sections],
            default=-1,
        )

        for section in list(column_to_delete.sections):
            max_position += 1
            section.column = second_to_last_column
            section.position = max_position

        db.session.delete(column_to_delete)
        db.session.flush()

        remaining_columns = (
            Column.query.filter_by(resume_id=resume_id)
            .order_by(Column.position.asc())
            .all()
        )
        
        set_column_widths(resume_id)

        for index, column in enumerate(remaining_columns):
            column.position = index

        db.session.commit()

        return jsonify(resume.to_dict()), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error deleting column for resume of ID {resume_id}: ", e)
        return generate_error(
            error_type="SERVER_ERROR",
            code="ERROR_DELETING_COLUMN",
            message="An unknown error occurred while deleting the column.",
        )
        
        
@column_bp.route("/<int:column_id>", methods=["PUT"])
def update_column(column_id):
    print(f"Received PUT request to update column of ID {column_id}.")

    try:
        column = Column.query.filter_by(id=column_id).one_or_none()
        if not column:
            return generate_error(
                error_type="NOT_FOUND",
                code="COLUMN_NOT_FOUND",
                message=f"Could not find column of ID {column_id}.",
            )

        data = request.get_json() or {}
        if not data:
            return generate_error(
                error_type="BAD_REQUEST",
                code="INVALID_DATA",
                message="No data provided for column update.",
            )

        new_width = data.get("width")
        auto_width = data.get("autoWidth")
        position = data.get("position")

        if new_width is not None:
            column.width = new_width
            column.auto_width = False

        if auto_width is not None:
            column.auto_width = auto_width

            if auto_width:
                column.width = None

        if position is not None:
            column.position = position

        set_column_widths(column.resume_id)

        db.session.commit()

        return jsonify(column.resume.to_dict()), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error updating column of ID {column_id}: ", e)
        return generate_error(
            error_type="SERVER_ERROR",
            code="ERROR_UPDATING_COLUMN",
            message="An unknown error occurred while updating the column.",
        )