from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return jsonify({"message": "Flask backend is running"})

@app.route("/api/test")
def test():
    return jsonify({"message": "API works"})

if __name__ == "__main__":
    app.run(debug=True, port=5000)