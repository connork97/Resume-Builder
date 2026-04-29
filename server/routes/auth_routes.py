from flask import Blueprint, request, jsonify, session
from models import db, User

from utils.responses import generate_error, generate_success

auth_bp = Blueprint('auth', __name__, url_prefix='')

@auth_bp.route('/checksession', methods=['GET'])
def check_session():
    user_id = session.get('user_id')
    print(f"Received GET request for /checksession with session[user_id]: {user_id}")
    
    if not user_id:
        error = jsonify({
            'error': {
                'message': 'No active session found.',
                'code': 'NO_ACTIVE_SESSION'
            }
        }), 401
        return error
    
    user = db.session.get(User, user_id)
    
    if not user:
        return generate_error(error_type='UNAUTHORIZED', code='USER_NOT_LOGGED_IN', message='No active session.  Please log in.')
    
    print(f"SUCCESS. Active session found for user: {user.email} (ID: {user.id})")
    response = jsonify(user.to_dict(exclude=['resumes'])), 200
    return response

@auth_bp.route("/signup", methods=["POST"])
def signup():
    form_data = request.get_json()
    print("Received POST request for /users with form_data: ", form_data)
    
    try:
        email = (form_data.get('email') or '').strip().lower()
        existing_email = User.query.filter_by(email=email).one_or_none()

        if existing_email:
            return generate_error(
                error_type='CONFLICT',
                code='EMAIL_IN_USE',
                message=f'Email of {email} already in use.'
            )
        
        new_user = User(
            first_name=form_data["firstName"],
            last_name=form_data["lastName"],
            email=form_data["email"],
        )
        
        new_user.set_password(form_data['password'])
        session['user_id'] = new_user.id
        db.session.add(new_user)
        db.session.commit()

        print("SUCCESS. Created new user: ", new_user.to_dict())
        print(f"Setting session['user_id'] to {new_user.id}")
        response = jsonify(new_user.to_dict()), 201
        return response
    
    except Exception as e:
        db.session.rollback()
        print("ERROR creating resume:", e)
        return generate_error(error_type='SERVER_ERROR', code='BAD_SIGNUP', message='Could not create new user.')

@auth_bp.route('/login', methods=['POST'])
def login():
    form_data = request.get_json() or {}
    email = (form_data.get('email') or '').strip().lower()
    password = form_data.get('password') or ''
    
    user = User.query.filter_by(email=email).one_or_none()
    
    if not user:
        return generate_error(
            error_type='UNAUTHORIZED',
            code='INVALID_EMAIL',
            message='Email does not match any user account.'
        )
        
    if not user.check_password(password):
        return generate_error(
            error_type='UNAUTHORIZED',
            code='INVALID_PASSWORD',
            message='Password does not match email.'
        )
    
    session['user_id'] = user.id
    
    print(f"SUCCESS. User {email} logged in successfully. Session set with user_id: {user.id}")
    response = jsonify(user.to_dict()), 200
    return response

@auth_bp.route('/logout', methods=['DELETE'])
def logout():
    session.pop('user_id', None)
    return generate_success(
        success_type='OK',
        code='SUCCESSFUL_LOGOUT',
        message=f'Logged out sucessfully.'
    )