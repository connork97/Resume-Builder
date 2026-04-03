from flask import Blueprint, request, jsonify, session
from models import db, User

user_bp = Blueprint('users', __name__, url_prefix='/users')

@user_bp.route("", methods=["POST"])
def users():
    if request.method == "POST":
        form_data = request.get_json()
        print("Received POST request for /users with form_data: ", form_data)
        
        email = (form_data.get('email') or '').strip().lower()
        existing_email = User.query.filter_by(email=email).one_or_none()
        
        if existing_email:
            error = jsonify({
                'error': {
                    'message': f'Email {email} already in use.',
                    'code': 'EMAIL_IN_USE'
                }
            }), 409
            return error
        
        new_user = User(
            first_name=form_data["firstName"],
            last_name=form_data["lastName"],
            email=form_data["email"],
        )
        
        new_user.set_password(form_data['password'])
        db.session.add(new_user)
        db.session.commit()

        print("SUCCESS. Created new user: ", new_user.to_dict())
        response = jsonify(new_user.to_dict()), 201
        return response


@user_bp.route("/<int:user_id>", methods=['GET', 'PUT'])
def users_by_id(user_id):
    if request.method == "GET":
        print(f"Received GET request for /users/{user_id}")
        user = User.query.filter(User.id == user_id).one_or_none()
        if user:
            print(f"SUCCESS. Found user: {user} and setting session[user_id] to {user.id}")
            session['user_id'] = user.id
            user_dict = user.to_dict(
                # condense_relationship_data=True
                # exclude=["createdAt", "updatedAt"]
            )
            response = jsonify(user_dict), 200
            return response

        if not user:
            error = jsonify({"error": "User not found"}), 404
            return error
    
    if request.method == "PUT":
        form_data = request.get_json()
        print(f"Received PUT request for /users/{user_id} with form_data: ", form_data)
        
        user = User.query.filter(User.id == user_id).one_or_none()
        
        if not user:
            error = jsonify({"error": "User not found"}), 404
            return error
        
        user.first_name = form_data.get("firstName", user.first_name)
        user.last_name = form_data.get("lastName", user.last_name)
        email = (form_data.get("email") or '').strip().lower()
        if email != user.email:
            new_email_in_use = User.query.filter(User.email == email, User.id != user_id).one_or_none()
            if new_email_in_use:
                error = jsonify({
                    'error': {
                        'message': f'Email {email} already in use.',
                        'code': 'EMAIL_IN_USE'
                    }
                }), 409
                return error
            user.email = email
        
        if form_data.get("password"):
            user.set_password(form_data["password"])
        
        db.session.commit()
        
        print(f"SUCCESS. Updated user: {user.to_dict()}")
        response = jsonify(user.to_dict()), 200
        return response