from flask import jsonify, request, make_response, session

from config import app, db

from models import User, Resume, Column, Section, Subsection, Field


@app.route("/")
def home():
    response = jsonify({"message": "Resume Builder Flask backend is running"}), 200
    return response


@app.route("/users", methods=["POST"])
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


@app.route("/user/<int:user_id>", methods=['GET', 'PUT'])
def user(user_id):
    if request.method == "GET":
        print(f"Received GET request for /user/{user_id}")
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
        print(f"Received PUT request for /user/{user_id} with form_data: ", form_data)
        
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

@app.route('/checksession', methods=['GET'])
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
    response = jsonify(user.to_dict()), 200
    return response

@app.route('/login', methods=['POST'])
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

@app.route('/logout', methods=['DELETE'])
def logout():
    session.pop('user_id', None)
    response = jsonify({
        'message': 'Logged out successfully.'
    }), 200
    return response

@app.route("/resumes", methods=["GET", "POST"])
def resumes():
    if request.method == "GET":
        print("Received GET request for /resumes")
        resumes = Resume.query.all()
        print(f"Found {len(resumes)} resumes")
        response = jsonify([resume.to_dict() for resume in resumes]), 200
        return response

    if request.method == "POST":
        print("Received POST request for /resumes")
        form_data = request.get_json()
        print("Received form_data: ", form_data)

        new_resume = Resume(title=form_data["title"], user_id=form_data["userId"])
        
        if new_resume:
            db.session.add(new_resume)
            db.session.commit()
            print("SUCCESS. Created new resume: ", new_resume.to_dict())
            response = jsonify(new_resume.to_dict()), 201
        elif not new_resume:
            response = jsonify({"error": "Failed to create resume"}), 400
            
        return response


@app.route("/resume/<int:resume_id>", methods=["GET", "DELETE"])
def resume(resume_id):
    if request.method == "GET":
        print(f"Received GET request for /resume/{resume_id}")
        resume = Resume.query.filter(Resume.id == resume_id).one_or_none()
        if not resume:
            error = jsonify({"error": "Resume not found"}), 404
            return error
        
        print(f"SUCCESS. Found resume: {resume.to_dict()}")
        response = jsonify(resume.to_dict()), 200
        return response

    if request.method == "DELETE":
        print(f"Received DELETE request for /resume/{resume_id}")
        resume = Resume.query.filter(Resume.id == resume_id).one_or_none()
        
        if not resume:
            response = jsonify({"error": "Resume not found"}), 404
        elif resume:
            db.session.delete(resume)
            db.session.commit()
            print(f"SUCCESS. Deleted resume: {resume.to_dict()}")
            response = jsonify({"message": "Resume deleted successfully"}), 200
            
        return response


@app.route("/health")
def health():
    return {"status": "ok"}, 200


if __name__ == "__main__":
    app.run(debug=True, port=5555)
