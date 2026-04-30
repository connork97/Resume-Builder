from flask import Blueprint, request, jsonify, session
from sqlalchemy import func

from models import db, Resume, Column, Section, Subsection, Field

from services.builders import build_resume_with_defaults, add_column, add_section, add_subsection, add_field, add_default_fields
from services.resume_updater import update_resume_with_form_data

from utils.responses import generate_error, generate_success

subsection_bp = Blueprint("subsection", __name__, url_prefix="/subsections")

@subsection_bp.route('/<int:section_id>', methods=['POST'])
def add_subsection_to_resume(section_id):
   print(f'Received POST request to add a subsection to section of ID {section_id}')
   
   try:
      section = Section.query.get(section_id)
      if not section:
         return generate_error(
            error_type='NOT_FOUND',
            code='SECTION_NOT_FOUND',
            message=f'Could not find section of ID {section_id} to add a subsection to.'
         )
      
      resume = section.column.resume
      
      max_position = (
         db.session.query(func.max(Subsection.position))
         .filter(Subsection.section_id == section_id)
         .scalar()
      )
      
      if max_position is not None:
         position = max_position + 1
      else:
         position = 0

               
      add_subsection(
         section_id = section_id,
         section_type = section.type,
         position = position
      )
      
      db.session.commit()
      
      return jsonify(resume.to_dict()), 200
   
   except Exception as e:
      db.session.rollback()
      print('ERROR_ADDING_SUBSECTION: ', e)
      
      return generate_error(
         error_type='SERVER_ERROR',
         code="ERROR_ADDING_SUBSECTION",
         message=f"Failed to add subsection to section of ID {section_id}.",
      )
      
      
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
      section_id = subsection_to_delete.section_id
      deleted_position = subsection_to_delete.position
      
      db.session.delete(subsection_to_delete)
      
      Subsection.query.filter(
         Subsection.section_id == section_id,
         Subsection.position > deleted_position
      ).update(
         {Subsection.position: Subsection.position - 1},
         synchronize_session=False,
      )
      
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