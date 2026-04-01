from flask import jsonify, request, make_response, session

from config import app, db

from models import User, Resume, Column, Section, Subsection, Field


@app.route("/")
def home():
    response = make_response(
        jsonify({"message": "Resume Builder Flask backend is running"}), 200
    )
    return response


@app.route("/users", methods=["POST"])
def users():
    if request.method == "POST":
        print("Received POST request for /users")
        form_data = request.get_json()
        print("Received form_data: ", form_data)

        new_user = User(
            first_name=form_data["firstName"],
            last_name=form_data["lastName"],
            username=form_data["username"],
            email=form_data["email"],
            password_hash=form_data["password"],  # Will hash the password later
        )

        db.session.add(new_user)
        db.session.commit()

        print("CREATED NEW USER:", new_user.to_dict())
        response = make_response(jsonify(new_user.to_dict()), 201)
        return response


@app.route("/users/<int:user_id>", methods=["GET"])
def user(user_id):
    if request.method == "GET":
        print(f"Received GET request for /users/{user_id}")
        user = User.query.filter(User.id == user_id).one_or_none()
        if user:
            user_dict = user.to_dict(
                condense_relationship_data=True
                # exclude=["createdAt", "updatedAt"]
            )
            response = make_response(jsonify(user_dict), 200)
            return response

        if not user:
            return make_response(jsonify({"error": "User not found"}), 404)


@app.route("/resumes", methods=["GET", "POST"])
def resumes():
    if request.method == "GET":
        print("Received GET request for /resumes")
        resumes = Resume.query.all()
        print(f"Found {len(resumes)} resumes")
        response = make_response(jsonify([resume.to_dict() for resume in resumes]), 200)
        return response

    if request.method == "POST":
        print("Received POST request for /resumes")
        form_data = request.get_json()
        print("Received form_data: ", form_data)

        new_resume = Resume(title=form_data["title"], user_id=form_data["userId"])
        
        if new_resume:
            db.session.add(new_resume)
            db.session.commit()
            print("CREATED NEW RESUME:", new_resume.to_dict())
            response = make_response(jsonify(new_resume.to_dict()), 201)
        elif not new_resume:
            response = make_response(jsonify({"error": "Failed to create resume"}), 400)
            
        return response


@app.route("/resumes/<int:resume_id>", methods=["GET", "DELETE"])
def resume(resume_id):
    if request.method == "GET":
        print(f"Received GET request for /resumes/{resume_id}")
        resume = Resume.query.filter(Resume.id == resume_id).one_or_none()
        if not resume:
            return make_response(jsonify({"error": "Resume not found"}), 404)
        print(f"Found resume: {resume.to_dict()}")
        response = make_response(jsonify(resume.to_dict()), 200)
        return response

    if request.method == "DELETE":
        print(f"Received DELETE request for /resumes/{resume_id}")
        resume = Resume.query.filter(Resume.id == resume_id).one_or_none()
        if not resume:
            response = make_response(jsonify({"error": "Resume not found"}), 404)
        elif resume:
            db.session.delete(resume)
            db.session.commit()
            response = make_response(
                jsonify({"message": "Resume deleted successfully"}), 200
            )
        return response


@app.route("/health")
def health():
    return {"status": "ok"}, 200


if __name__ == "__main__":
    app.run(debug=True, port=5555)
