from flask import jsonify, request, make_response

from config import app, db


from models import Resume, Column, Section, Subsection, Field

@app.route("/")
def home():
    response = make_response(jsonify({"message": "Resume Builder Flask backend is running"}), 200)
    return response
    # return jsonify({"message": "Resume Builder Flask backend is running"})

@app.route("/resumes/", methods=['GET', 'POST'])
def resumes():
    if request.method == 'GET':
        print("Received GET request for /resumes")
        resumes = Resume.query.all()
        print(f"Found {len(resumes)} resumes")
        response = make_response(jsonify([resume.to_dict() for resume in resumes]), 200)
        return response
    
    if request.method == 'POST':
        print("Received POST request for /resumes")
        form_data = request.get_json()
        print("Received form_data: ", form_data)        
        
        new_resume = Resume(title=form_data['title'])
        
        db.session.add(new_resume)
        db.session.commit()
        
        print('CREATED NEW RESUME:', new_resume.to_dict())
        response = make_response(jsonify(new_resume.to_dict()), 201)
        return response

@app.route("/resumes/<int:resume_id>", methods=['GET'])
def resume(resume_id):
    if request.method == 'GET':
        print(f"Received GET request for /resumes/{resume_id}")
        resume = Resume.query.filter(Resume.id == resume_id).one_or_none()
        if not resume:
            return make_response(jsonify({"error": "Resume not found"}), 404)
        print(f"Found resume: {resume.to_dict()}")
        response = make_response(jsonify(resume.to_dict()), 200)
        return response

@app.route("/health")
def health():
    return {"status": "ok"}, 200

if __name__ == "__main__":
    app.run(debug=True, port=5555)