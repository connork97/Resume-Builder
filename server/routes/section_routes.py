from flask import Blueprint, request, jsonify, session
from models import db, Resume, Column, Section, Subsection, Field

from services.builders import build_resume_with_defaults, add_column, add_section, add_subsection, add_field, add_default_fields
from services.resume_updater import update_resume_with_form_data

from utils.responses import generate_error, generate_success

section_bp = Blueprint("section", __name__, url_prefix="/sections")

@section_bp.route('<int:section_id>', methods=['DELETE'])
def delete_section_from_resume(section_id):
   print(f'Received DELETE request for section of ID {section_id}')
   
   try:
      section_to_delete = Section.query.get(section_id)
      if not section_to_delete:
         return generate_error(
            error_type='NOT_FOUND',
            code='SECTION_NOT_FOUND',
            message=f'Seciton of ID {section_id} not found.'
         )
      
      resume = section_to_delete.column.resume
      column_id = section_to_delete.column_id
      deleted_position = section_to_delete.position
      
      db.session.delete(section_to_delete)
      
      Section.query.filter(
         Section.column_id == column_id,
         Section.position > deleted_position
      ).update(
         {Section.position: Section.position - 1},
         synchronize_session=False,
      )
      
      db.session.commit()
      return jsonify(resume.to_dict()), 200
      
   except Exception as e:
      db.session.rollback()
      print(f"ERROR_DELETING_SECTION: {e}")

      return generate_error(
         error_type="SERVER_ERROR",
         code="ERROR_DELETING_SECTION",
         message=f"Failed to delete section of ID {section_id}.",
      )