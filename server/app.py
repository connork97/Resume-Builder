from flask import jsonify

from config import app


from models import *

@app.route("/")
def home():
    return jsonify({"message": "Resume Builder Flask backend is running"})

@app.route("/health")
def health():
    return {"status": "ok"}, 200

if __name__ == "__main__":
    app.run(debug=True, port=5555)