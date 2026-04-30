from flask import Blueprint, request, jsonify, session
from sqlalchemy import func

from models import db, Resume, Column, Section, Subsection, Field

from services.builders import build_resume_with_defaults, add_column, add_section, add_subsection, add_field, add_default_fields
from services.resume_updater import update_resume_with_form_data

from utils.responses import generate_error, generate_success

field_bp = Blueprint("fields", __name__, url_prefix="/fields")

@field_bp.route('/<int:subsection_id>', methods=['POST'])
def add_field_to_resume(subsection_id):
   print(f'Received POST request to add a field to subsection of ID {subsection_id}')
   
   try:
      subsection = Subsection.query.get(subsection_id)
      if not subsection:
         return generate_error(
            error_type='NOT_FOUND',
            code='SUBSECTION_NOT_FOUND',
            message=f'Could not find subsection of ID {subsection_id} to add a field to.'
         )
      
      resume = subsection.section.column.resume
      
      max_position = (
         db.session.query(func.max(Field.position))
         .filter(Field.subsection_id == subsection_id)
         .scalar()
      )
      
      if max_position is not None:
         position = max_position + 1
      else:
         position = 0
         
      add_field(
         subsection_id = subsection_id,
         label = f'{subsection.section.type} Field',
         position = position
      )
      
      db.session.commit()
      
      return jsonify(resume.to_dict()), 200
   
   except Exception as e:
      db.session.rollback()
      print('ERROR_ADDING_FIELD: ', e)
      
      return generate_error(
         error_type='SERVER_ERROR',
         code="ERROR_ADDING_FIELD",
         message=f"Failed to add field to subsection of ID {subsection_id}.",
      )
      

@field_bp.route('/<int:field_id>', methods=['DELETE'])
def delete_field_from_resume(field_id):
   print(f'Recieved DELETE request for field of ID {field_id}.')
   
   try:
      field_to_delete = Field.query.get(field_id)
      if not field_to_delete:
         return generate_error(
            error_type='NOT_FOUND',
            code='FIELD_NOT_FOUND',
            message=f'Field of ID {field_id} not found.'
         )
         
      resume = field_to_delete.subsection.section.column.resume
      subsection_id = field_to_delete.subsection_id
      deleted_position = field_to_delete.position
      
      db.session.delete(field_to_delete)
      
      Field.query.filter(
         Field.subsection_id == subsection_id,
         Field.position > deleted_position
      ).update(
         {Field.position: Field.position - 1},
         synchronize_session=False,
      )
      
      db.session.commit()
      
      return jsonify(resume.to_dict()), 200
      
      
   except Exception as e:
      db.session.rollback()
      print('ERROR_DELETING_FIELD: ', e)
      
      return generate_error(
         error_type='SERVER_ERROR',
         code="ERROR_DELETING_FIELD",
         message=f"Failed to delete field of ID {field_id}.",
      )