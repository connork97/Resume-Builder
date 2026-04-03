from flask import Blueprint, request, jsonify, session
from models import Column, Field, Section, Subsection, db, Resume

resume_bp = Blueprint("resume", __name__, url_prefix="/resumes")


DEFAULT_FIELDS_DICT = {
    "header": ["Name", "Title"],
    "workHistory": [
        "Job Title",
        "Company",
        "Location",
        "Start/End Dates",
        "Description",
    ],
    "education": [
        "School",
        "Degree",
        "Field of Study",
        "Location",
        "Start/End Dates",
        "Description",
    ],
    "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
    "contact": ["Email", "Phone", "Location", "Website", "LinkedIn"],
    "summary": ["Summary"],
    "default": ["Field"],
}


@resume_bp.route("", methods=["POST"])
def create_resume():
    form_data = request.get_json() or {}
    print(f"Received POST request for /resumes with form_data: {form_data}")
    try:
        new_resume = Resume(title=form_data["title"], user_id=form_data["userId"])

        db.session.add(new_resume)
        db.session.flush()  # Flush to assign an ID to new_resume before commit

        new_column = Column(resume_id=new_resume.id, position=0, width="100%")
        db.session.add(new_column)
        db.session.flush()

        sections_data = form_data.get("sections", {})
        section_position = 0
        for section_type, should_create in sections_data.items():
            if not should_create:
                continue
            new_section = Section(
                column_id=new_column.id,
                label=section_type,
                type=section_type,
                position=section_position,
            )
            db.session.add(new_section)
            db.session.flush()
            new_subsection = Subsection(
                section_id=new_section.id,
                label=f"{section_type} Subsection",
                type=new_section.type,
                position=0,
            )
            db.session.add(new_subsection)
            db.session.flush()

            default_fields = DEFAULT_FIELDS_DICT.get(
                section_type, DEFAULT_FIELDS_DICT["default"]
            )
            for idx, field_label in enumerate(default_fields):
                new_field = Field(
                    subsection_id=new_subsection.id,
                    label=field_label,
                    position=idx,
                    value=[
                        {
                            "type": "paragraph",
                            "label": field_label,
                            "children": [{"text": ""}],
                        }
                    ],
                )
                db.session.add(new_field)
            section_position += 1

        db.session.commit()

        print("SUCCESS. Created new resume:", new_resume.to_dict())
        return jsonify(new_resume.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        print("ERROR creating resume:", e)

        return jsonify({"error": "Failed to create resume"}), 400


@resume_bp.route("/<int:resume_id>", methods=["GET", "DELETE"])
def resume(resume_id):
    if request.method == "GET":
        print(f"Received GET request for /resumes/{resume_id}")
        resume = Resume.query.filter(Resume.id == resume_id).one_or_none()
        if not resume:
            error = jsonify({"error": "Resume not found"}), 404
            return error

        print(f"SUCCESS. Found resume: {resume.to_dict()}")
        response = jsonify(resume.to_dict()), 200
        return response

    if request.method == "DELETE":
        print(f"Received DELETE request for /resumes/{resume_id}")
        resume = Resume.query.filter(Resume.id == resume_id).one_or_none()

        if not resume:
            response = jsonify({"error": "Resume not found"}), 404
        elif resume:
            db.session.delete(resume)
            db.session.commit()
            print(f"SUCCESS. Deleted resume: {resume.to_dict()}")
            response = jsonify({"message": "Resume deleted successfully"}), 200

        return response
