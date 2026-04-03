from flask import Blueprint, request, jsonify, session
from models import db, Resume

auth_bp = Blueprint('auth', __name__, url_prefix='/resumes')

@auth_bp.route("", methods=["GET", "POST"])
def resumes():
    if request.method == "GET":
        print("Received GET request for /resumes")
        resumes = Resume.query.all()
        print(f"Found {len(resumes)} resumes")
        response = jsonify([resume.to_dict() for resume in resumes]), 200
        return response

    if request.method == "POST":
        print("Received POST request for /resumes")
        form_data = request.get_json()
        print("Received form_data: ", form_data)

        new_resume = Resume(title=form_data["title"], user_id=form_data["userId"])
        
        if new_resume:
            db.session.add(new_resume)
            db.session.commit()
            print("SUCCESS. Created new resume: ", new_resume.to_dict())
            response = jsonify(new_resume.to_dict()), 201
        elif not new_resume:
            response = jsonify({"error": "Failed to create resume"}), 400
            
        return response


@auth_bp.route("/<int:resume_id>", methods=["GET", "DELETE"])
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