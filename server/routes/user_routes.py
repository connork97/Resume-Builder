from flask import Blueprint, request, jsonify, session
from models import db, User

from utils.responses import generate_error, generate_success, print_pending_request, print_successful_request

user_bp = Blueprint('users', __name__, url_prefix='/users')

@user_bp.route("/<int:user_id>", methods=['GET'])
def get_user_by_id(user_id):
    print_pending_request('GET', f'/users/{user_id}')

    user = User.query.filter(User.id == user_id).one_or_none()
    
    if not user:
        return generate_error(
            error_type='NOT_FOUND',
            message=f'User of id {user_id} not found.'
        )

    print_successful_request('Found user with ID:', user.id)    
    print(f"SUCCESS. Found user: {user} with id {user.id}")
    # session['user_id'] = user.id
    user_dict = user.to_dict()
    response = jsonify(user_dict), 200
    return response


@user_bp.route("/<int:user_id>", methods=['PUT'])
def edit_user_by_id(user_id):
    form_data = request.get_json()
    
    print_pending_request('PUT', f'/users/{user_id}', 'with form_data:', form_data)
    
    user = User.query.filter(User.id == user_id).one_or_none()
    
    if not user:
        return generate_error(
            error_type='NOT_FOUND',
            message=f'User of id {user_id} not found.'
        )
    
    user.first_name = form_data.get("firstName", user.first_name)
    user.last_name = form_data.get("lastName", user.last_name)
    email = (form_data.get("email") or '').strip().lower()
    
    if email != user.email:
        new_email_in_use = User.query.filter(
            User.email == email,
            User.id != user_id
        ).one_or_none()
        if new_email_in_use:
            return generate_error(
                error_type='CONFLICT',
                message=f'Email of {email} already in use.'
            )
        user.email = email
    
    if form_data.get("password"):
        user.set_password(form_data["password"])
    
    db.session.commit()
    
    print_successful_request('Updated user of ID:', user_id)
    
    response = jsonify(user.to_dict()), 200
    return response