import datetime

from flask import Blueprint, request, jsonify, session
from pytz import timezone
from models import db, Resume, Column, Section, Subsection, Field

from services.builders import (
    build_resume_with_defaults,
    build_resume_copy,
    add_column,
    add_section,
    add_subsection,
    add_field,
    add_default_fields,
)
from services.resume_updater import update_resume_with_form_data

from utils.authorization import check_resume_access
from utils.responses import (
    generate_error,
    generate_success,
    print_pending_request,
    print_successful_request,
    COLORS,
)

resume_bp = Blueprint("resume", __name__, url_prefix="/resumes")


@resume_bp.route("", methods=["POST"])
def create_resume():
    form_data = request.get_json() or {}
    print_pending_request("POST", "/resumes")

    try:
        title = form_data.get("title")
        if not title:
            return generate_error(
                error_type="BAD_REQUEST",
                code="MISSING_TITLE",
                message="Resume titles are required.",
            )

        user_id = session.get("user_id")
        if user_id is None:
            return generate_error(
                error_type="UNAUTHORIZED",
                code="NO_USER_ID",
                message="You must be logged in to create a resume.",
            )

        new_resume = build_resume_with_defaults(
            title=title,
            user_id=user_id,
            sections_data=form_data.get("sections", {}),
        )

        db.session.commit()

        print_successful_request("Created new resume.")
        return jsonify(new_resume.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        print("ERROR creating resume:", e)
        return generate_error(
            error_type="BAD_REQUEST",
            code="ERROR_CREATING_RESUME",
            message="Failed to create resume.",
        )


@resume_bp.route("/<int:resume_id>/copy", methods=["POST"])
def copy_resume(resume_id):
    print_pending_request(
        "POST",
        f"/resumes/{resume_id}/copy",
        "to create a copy of resume of ID:",
        resume_id,
    )

    user_id = session.get("user_id")
    if user_id is None:
        return generate_error(
            error_type="UNAUTHORIZED",
            code="LOGIN_REQUIRED",
            message="You must be logged in to copy a resume.",
        )

    error = check_resume_access(user_id, resume_id, "GET")
    if error is not None:
        return error

    try:
        copied_resume = build_resume_copy(resume_id, user_id=user_id)

    except Exception as e:
        db.session.rollback()
        return generate_error(
            message=f"Could not make copy of resume of ID: {resume_id}"
        )

    print_successful_request("Created copy of resume of ID:", resume_id)
    return jsonify(copied_resume.to_dict()), 200


@resume_bp.route("/<int:resume_id>", methods=["GET"])
def resume(resume_id):
    print_pending_request("GET", f"/resumes/{resume_id}")

    error = check_resume_access(
        session.get("user_id"), resume_id, request.method
    )
    if error is not None:
        return error

    resume = Resume.query.filter_by(id=resume_id).one_or_none()

    print_successful_request("Found resume of ID:", resume_id)
    response = jsonify(resume.to_dict()), 200
    return response

@resume_bp.route("/templates/official", methods=["GET"])
def get_official_resume_templates():
    print_pending_request("GET", "/resumes/templates")
    template_count = request.args.get("templateCount", 10, type=int)

    official_resume_templates = Resume.query.filter_by(
        is_official_template=True
    ).limit(template_count).all()

    if len(official_resume_templates) == 0:
        return generate_error(
            error_type="NOT_FOUND",
            code="NO_OFFICIAL_TEMPLATES",
            message="No official resume templates found.",
        )
        
    print_successful_request(f"Fetched {len(official_resume_templates)} official resume templates.")
    return jsonify([template.to_dict() for template in official_resume_templates]), 200

@resume_bp.route("/<int:resume_id>", methods=["DELETE"])
def delete_resume(resume_id):
    print_pending_request("DELETE", f"/resumes/{resume_id}")
    error = check_resume_access(session.get("user_id"), resume_id, request.method)
    if error is not None:
        return error

    resume = Resume.query.filter_by(id=resume_id).one_or_none()
    db.session.delete(resume)
    db.session.commit()
    print_successful_request("Deleted resume of id:", resume_id)
    return generate_success(
        success_type="DELETE", resource=f"Resume of ID {resume_id}"
    )


@resume_bp.route("/<int:resume_id>", methods=["PUT"])
def update_resume(resume_id):
    print_pending_request("PUT", f"/resumes/{resume_id}")

    form_data = request.get_json() or {}

    error = check_resume_access(session.get("user_id"), resume_id, request.method)
    if error is not None:
        return error

    try:
        updated_resume = update_resume_with_form_data(resume_id, form_data)
        updated_resume.updated_at = db.func.now()
        db.session.commit()
        print_successful_request("Updated resume of ID:", resume_id)
        return jsonify(updated_resume.to_dict()), 200

    except ValueError as e:
        db.session.rollback()
        return generate_error(
            error_type="NOT_FOUND",
            code="RESUME_NOT_FOUND",
            message=str(e),
        )

    except Exception as e:
        db.session.rollback()
        # print(f"Error updating resume of ID {resume_id}: ", e)

        return generate_error(
            error_type="SERVER_ERROR",
            code="ERROR_UPDATING_RESUME",
            message=f"Failed to update resume of ID {resume_id}.",
        )
