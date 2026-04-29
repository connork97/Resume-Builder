from flask import Blueprint, request, jsonify, session
from models import db, Resume, Column, Section, Subsection, Field

from services.builders import build_resume_with_defaults, add_column, add_section, add_subsection, add_field, add_default_fields
from services.resume_updater import update_resume_with_form_data

from utils.responses import generate_error, generate_success

subsection_bp = Blueprint("subsection", __name__, url_prefix="/subsections")

@subsection_bp.route('<int:subsection_id>', methods=['DELETE'])
def delete_subsection_from_resume(subsection_id):
   print(f'Received DELETE request for subsection of ID {subsection_id}')
   
   try:
      subsection_to_delete = Subsection.query.get(subsection_id)
      if not subsection_to_delete:
         return generate_error(
            error_type='NOT_FOUND',
            code='SUBSECTION_NOT_FOUND',
            message=f'Subsection of ID {subsection_id} not found.'
         )
      
      resume = subsection_to_delete.section.column.resume
      
      db.session.delete(subsection_to_delete)
      db.session.commit()
      
      return jsonify(resume.to_dict()), 200
   
   except Exception as e:
      db.session.rollback()
      print(f"ERROR_DELETING_SUBSECTION: {e}")

      return generate_error(
         error_type="SERVER_ERROR",
         code="ERROR_DELETING_SUBSECTION",
         message=f"Failed to delete subsection of ID {subsection_id}.",
      )