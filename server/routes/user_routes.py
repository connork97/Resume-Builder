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
    # session['user_id'] = user.id
    user_dict = user.to_dict()
    response = jsonify(user_dict), 200
    return response


@user_bp.route("/<int:user_id>", methods=['PUT'])
def edit_user_by_id(user_id):
    form_data = request.get_json() or {}
    
    print_pending_request('PUT', f'/users/{user_id}')

    if session.get("user_id") is None:
        return generate_error(error_type="UNAUTHORIZED", code="LOGIN_REQUIRED",
                              message="You must be logged in to update your account.")
    if session.get("user_id") != user_id:
        return generate_error(error_type="FORBIDDEN", code="ACCOUNT_EDIT_FORBIDDEN",
                              message="You can only update your own account.")
    
    user = User.query.filter(User.id == user_id).one_or_none()
    
    if not user:
        return generate_error(
            error_type='NOT_FOUND',
            message=f'User of id {user_id} not found.'
        )
    
    email = user.email
    if "email" in form_data:
        if not isinstance(form_data["email"], str) or not form_data["email"].strip():
            return generate_error(error_type="BAD_REQUEST", code="INVALID_EMAIL",
                                  message="Email cannot be empty.")
        email = form_data["email"].strip().lower()

    new_password = form_data.get("password")
    if new_password is not None and not isinstance(new_password, str):
        return generate_error(error_type="BAD_REQUEST", code="INVALID_PASSWORD",
                              message="Password must be a string.")
    if email != user.email or new_password:
        current_password = form_data.get("currentPassword")
        if not isinstance(current_password, str) or not user.check_password(current_password):
            return generate_error(error_type="FORBIDDEN", code="CURRENT_PASSWORD_REQUIRED",
                                  message="Enter your current password to change your email or password.")
    
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
    
    user.first_name = form_data.get("firstName", user.first_name)
    user.last_name = form_data.get("lastName", user.last_name)
    if new_password:
        user.set_password(new_password)
    
    db.session.commit()
    
    print_successful_request('Updated user of ID:', user_id)
    
    response = jsonify(user.to_dict()), 200
    return response
