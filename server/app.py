from flask import jsonify, request, make_response, session

from config import app, db

from models import User, Resume, Column, Section, Subsection, Field

from routes.user_routes import user_bp
from routes.auth_routes import auth_bp
from routes.resume_routes import resume_bp
from routes.section_routes import section_bp
from routes.subsection_routes import subsection_bp

app.register_blueprint(user_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(resume_bp)
app.register_blueprint(section_bp)
app.register_blueprint(subsection_bp)

@app.route("/")
def home():
    response = jsonify({"message": "Resume Builder Flask backend is running"}), 200
    return response


@app.route("/health")
def health():
    return {"status": "ok"}, 200


if __name__ == "__main__":
    app.run(debug=True, port=5555)
