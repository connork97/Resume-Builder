from flask import Blueprint, request, jsonify, session
from models import db, Resume

from services.resume_builder import build_resume_with_defaults
from services.resume_updater import update_resume_with_form_data

from utils.responses import generate_error, generate_success

resume_bp = Blueprint("resume", __name__, url_prefix="/resumes")


@resume_bp.route("", methods=["POST"])
def create_resume():
    form_data = request.get_json() or {}
    print(f"Received POST request for /resumes with form_data: {form_data}")

    try:
        title = form_data.get('title')
        if not title:
            return generate_error(error_type='BAD_REQUEST', message='Required resume data is incomplete.')
        
        user_id = form_data['userId']
        if not user_id:
            return generate_error(error_type='UNAUTHORIZED')
        
        new_resume = build_resume_with_defaults(
            title=title,
            user_id=user_id,
            sections_data=form_data.get("sections", {}),
        )

        db.session.commit()

        print("SUCCESS. Created new resume:", new_resume.to_dict())
        return jsonify(new_resume.to_dict()), 201

    except Exception as e:
        db.session.rollback()
        print("ERROR creating resume:", e)
        return generate_error(error_type='BAD_REQUEST', message='Failed to create resume.')
    

@resume_bp.route("/<int:resume_id>", methods=["GET"])
def resume(resume_id):
    print(f"Received GET request for /resumes/{resume_id}")
    resume = Resume.query.filter(Resume.id == resume_id).one_or_none()
    if not resume:
        return generate_error(error_type='NOT_FOUND', message=f'Resume of id {resume_id} not found.')

    print(f"SUCCESS. Found resume: {resume.to_dict()}")
    response = jsonify(resume.to_dict()), 200
    return response


@resume_bp.route('/<int:resume_id>', methods=['DELETE'])
def delete_resume(resume_id):
    print(f"Received DELETE request for /resumes/{resume_id}")
    resume = Resume.query.filter(Resume.id == resume_id).one_or_none()

    if not resume:
        return generate_error(error_type='NOT_FOUND', message=f'Resume of id {resume_id} not found.')
    
    elif resume:
        db.session.delete(resume)
        db.session.commit()
        print(f"SUCCESS. Deleted resume of id: {resume_id}")
        return generate_success(success_type='OK', resource=f'Resume of id {resume_id}')

@resume_bp.route("/<int:resume_id>", methods=["PUT"])
def update_resume(resume_id):
    print(f"Received PUT request for /resumes/{resume_id}")

    form_data = request.get_json() or {}

    try:
        updated_resume = update_resume_with_form_data(resume_id, form_data)
        db.session.commit()
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
        print(f"Error updating resume of ID {resume_id}: ", e)

        return generate_error(
            error_type="SERVER_ERROR",
            code="COULD_NOT_UPDATE_RESUME",
            message=f"Failed to update resume of ID {resume_id}.",
        )
        
        
# @resume_bp.route('/<int:resume_id>', methods=['PUT'])
# def update_resume(resume_id):
#     print(f'Received PUT request for /resumes/{resume_id}')
    
#     form_data = request.get_json() or {}
    
#     try:
#         updated_resume = update_resume_with_form_data(resume_id, form_data)
#         db.session.commit()
#         return jsonify(updated_resume.to_dict()), 200
    
#     except ValueError as e:
#         db.session.rollback()
#         error = {'error': str(e)}
#         return jsonify(error), 404
    
#     except Exception as e:
#         db.session.rollback()
#         print(f'Error updating resume of ID {resume_id}: ', e)
#         error = {
#             'code': 'COULD_NOT_UPDATE_RESUME',
#             'message': f'Failed to update resume of ID {resume_id}'
#         }
#         return jsonify(error), 400