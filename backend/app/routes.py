
from flask import Blueprint, request, jsonify

main_routes = Blueprint("main", __name__)


# Home API
@main_routes.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Welcome to ReVolt Backend!",
        "status": "Running"
    }), 200


# Health Check API
@main_routes.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "project": "ReVolt",
        "message": "Backend is working successfully"
    }), 200


# Battery Prediction API
@main_routes.route("/api/predict", methods=["POST"])
def predict():

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "error": "Please provide valid JSON data"
        }), 400

    battery_data = data.get("battery_data")

    if not isinstance(battery_data, dict) or not battery_data:
        return jsonify({
            "error": "Battery data is required"
        }), 400

    return jsonify({
        "message": "Battery data received successfully",
        "model_status": "Not connected yet",
        "received_data": battery_data
    }), 200
