from flask import Blueprint, request, jsonify, session
from models import db, User

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
        error = jsonify({
            'error': {
                'message': 'User associated with session not found.',
                'code': 'USER_NOT_FOUND'
            }
        }), 404
        return error
    
    print(f"SUCCESS. Active session found for user: {user.email} (ID: {user.id})")
    response = jsonify(user.to_dict(exclude=['resumes'])), 200
    return response

@auth_bp.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        form_data = request.get_json() or {}
        email = (form_data.get('email') or '').strip().lower()
        password = form_data.get('password') or ''
        
        user = User.query.filter_by(email=email).one_or_none()
        
        if not user:
            error = jsonify({
                'error': {
                    'message': f'Email of {email} not found.',
                    'code': 'EMAIL_NOT_FOUND'
                }
            }), 401
            return error
            
        if not user.check_password(password):
            error = jsonify({
                'error': {
                    'message': 'Password does not match email.',
                    'code': 'WRONG_PASSWORD'
                }
            }), 401
            return error
        
        session['user_id'] = user.id
        
        print(f"SUCCESS. User {email} logged in successfully. Session set with user_id: {user.id}")
        response = jsonify(user.to_dict()), 200
        return response

@auth_bp.route('/logout', methods=['DELETE'])
def logout():
    session.pop('user_id', None)
    response = jsonify({
        'message': 'Logged out successfully.'
    }), 200
    return response