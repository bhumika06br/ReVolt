from flask import Blueprint, request, jsonify
from services.solar_service import simulate_solar_storage

simulator_bp = Blueprint("simulator", __name__)


@simulator_bp.route("/solar", methods=["POST"])
def solar_simulation():

    try:
        data = request.get_json(silent=True)

        if not data:
            return jsonify({"error": "JSON request body is required"}), 400

        required_fields = [
            "solar_generation_kwh",
            "daily_demand_kwh",
            "battery_capacity_kwh",
            "initial_soc_percent"
        ]

        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        result = simulate_solar_storage(
            solar_generation_kwh=float(data["solar_generation_kwh"]),
            daily_demand_kwh=float(data["daily_demand_kwh"]),
            battery_capacity_kwh=float(data["battery_capacity_kwh"]),
            initial_soc_percent=float(data["initial_soc_percent"]),
            charging_efficiency=float(data.get("charging_efficiency", 0.95)),
            discharging_efficiency=float(data.get("discharging_efficiency", 0.95))
        )

        return jsonify(result), 200

    except (TypeError, ValueError) as e:
        return jsonify({"error": str(e)}), 400

    except Exception as e:
        print("Solar simulation error:", e)
        return jsonify({"error": "Solar simulation failed"}), 500