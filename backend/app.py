from flask import Flask, jsonify
from flask_cors import CORS

from routes.simulator_routes import simulator_bp

app = Flask(__name__)

CORS(app)

app.register_blueprint(
    simulator_bp,
    url_prefix="/api/simulator"
)


@app.route("/")
def home():
    return jsonify({
        "project": "ReVolt",
        "message": "ReVolt backend is running"
    })


@app.route("/api/health")
def health():
    return jsonify({
        "status": "healthy"
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)