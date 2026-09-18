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
from services.resume_sorting import apply_resume_sort

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
    try:
        template_count = int(request.args.get("templateCount", 10))
        offset = int(request.args.get("offset", 0))
    except (TypeError, ValueError):
        return generate_error(
            error_type="BAD_REQUEST",
            code="INVALID_PAGINATION",
            message="templateCount and offset must be integers.",
        )

    if not 1 <= template_count <= 100 or offset < 0:
        return generate_error(
            error_type="BAD_REQUEST",
            code="INVALID_PAGINATION",
            message="templateCount must be between 1 and 100, and offset must be nonnegative.",
        )

    order_by = request.args.get("orderBy")
    query = Resume.query.filter_by(is_official_template=True)
    total_count = query.count()

    query = apply_resume_sort(query, order_by)

    official_resume_templates = query.offset(offset).limit(template_count).all()

    print_successful_request(f"Fetched {len(official_resume_templates)} official resume templates.")
    return jsonify({
        "templates": [template.to_dict() for template in official_resume_templates],
        "totalCount": total_count,
    }), 200

@resume_bp.route("/search", methods=["GET"])
def search_resumes():
    print_pending_request("GET", "/resumes/search")

    # * An empty/missing query matches all accessible resumes, rather than being an error
    search_term = (request.args.get("query") or "").strip()

    try:
        result_count = int(request.args.get("count", 10))
        offset = int(request.args.get("offset", 0))
        
    except (TypeError, ValueError):
        return generate_error(
            error_type="BAD_REQUEST",
            code="INVALID_PAGINATION",
            message="count and offset must be integers.",
        )

    if not 1 <= result_count <= 100 or offset < 0:
        return generate_error(
            error_type="BAD_REQUEST",
            code="INVALID_PAGINATION",
            message="count must be between 1 and 100, and offset must be nonnegative.",
        )
        
    # * resumeTypes accepts none, one, or multiple repeated params (?resumeTypes=personal&resumeTypes=officialTemplate);
    # * defaults to the user's personal resumes
    requested_resume_types = [
        resume_type.strip()
        for resume_type in request.args.getlist("resumeTypes")
        if resume_type.strip()
    ] or ["personal"]

    valid_resume_types = {"personal", "officialTemplate"}
    invalid_resume_types = [
        resume_type
        for resume_type in requested_resume_types
        if resume_type not in valid_resume_types
    ]
    if invalid_resume_types:
        return generate_error(
            error_type="BAD_REQUEST",
            code="INVALID_RESUME_TYPE",
            message=(
                f"Invalid resumeTypes: {', '.join(invalid_resume_types)}. "
                f"Valid options are: {', '.join(valid_resume_types)}."
            ),
        )

    print_pending_request("GET", f"/resumes/search?query={search_term}&count={result_count}&offset={offset}&resumeTypes={'&resumeTypes='.join(requested_resume_types)}")

    # * Search only resumes the requester is allowed to view, based on the requested resume type(s)
    user_id = session.get("user_id")
    resume_type_filters = []
    if "personal" in requested_resume_types:
        resume_type_filters.append(Resume.user_id == user_id if user_id is not None else False)
    if "officialTemplate" in requested_resume_types:
        resume_type_filters.append(Resume.is_official_template == True)

    accessible_resumes_filter = db.or_(*resume_type_filters)

    query = Resume.query.filter(accessible_resumes_filter)
    if search_term:
        search_term_pattern = f"%{search_term.lower()}%"
        query = query.filter(db.func.lower(Resume.plain_text).like(search_term_pattern))

    total_count = query.count()

    sort_by = request.args.get("sortBy")
    query = apply_resume_sort(
        query, sort_by, default_order_by=[Resume.updated_at.desc(), Resume.id.asc()]
    )

    matching_resumes = query.offset(offset).limit(result_count).all()

    print_successful_request(f"Found {len(matching_resumes)} resumes matching search term.")
    return jsonify({
        "results": [resume.to_dict() for resume in matching_resumes],
        "totalCount": total_count,
    }), 200


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
