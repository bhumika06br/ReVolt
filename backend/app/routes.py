from flask import Blueprint, request, jsonify
import pandas as pd

from app.model import (
    load_dataset,
    get_battery_records,
    predict_battery_cycle
)

main_routes = Blueprint("main", __name__)

# Stores the latest predictions during the current server session.
prediction_history = {}


def error_response(message, status_code):
    return jsonify({"error": message}), status_code


def get_battery_prediction(battery_id, cycle=None):
    result = predict_battery_cycle(battery_id, cycle)
    prediction_history[battery_id] = result
    return result


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


# List all batteries
@main_routes.route("/api/batteries", methods=["GET"])
def batteries():
    try:
        df = load_dataset()

        result = []
        for battery_id, group in df.groupby("battery_id"):
            group = group.sort_values("cycle")

            result.append({
                "battery_id": str(battery_id),
                "total_cycles": int(len(group)),
                "first_cycle": int(group["cycle"].min()),
                "last_cycle": int(group["cycle"].max())
            })

        return jsonify({
            "total_batteries": len(result),
            "batteries": result
        }), 200

    except Exception as e:
        return error_response(str(e), 500)


# Details of one battery
@main_routes.route("/api/batteries/<battery_id>", methods=["GET"])
def battery_details(battery_id):
    try:
        records = get_battery_records(battery_id)

        return jsonify({
            "battery_id": battery_id,
            "total_cycles": int(len(records)),
            "first_cycle": int(records["cycle"].min()),
            "last_cycle": int(records["cycle"].max()),
            "first_recorded_capacity_ah": round(
                float(records.iloc[0]["capacity"]), 3
            ),
            "latest_recorded_capacity_ah": round(
                float(records.iloc[-1]["capacity"]), 3
            )
        }), 200

    except KeyError as e:
        return error_response(str(e), 404)
    except Exception as e:
        return error_response(str(e), 500)


# List available cycles
@main_routes.route("/api/batteries/<battery_id>/cycles", methods=["GET"])
def battery_cycles(battery_id):
    try:
        records = get_battery_records(battery_id)

        cycles = [
            int(value) for value in records["cycle"].tolist()
        ]

        return jsonify({
            "battery_id": battery_id,
            "total_cycles": len(cycles),
            "cycles": cycles
        }), 200

    except KeyError as e:
        return error_response(str(e), 404)
    except Exception as e:
        return error_response(str(e), 500)


# Chart-friendly battery data
@main_routes.route("/api/batteries/<battery_id>/data", methods=["GET"])
def battery_data(battery_id):
    try:
        records = get_battery_records(battery_id)

        cycle = request.args.get("cycle")
        if cycle is not None:
            try:
                cycle = float(cycle)
            except ValueError:
                return error_response("Cycle must be a number", 400)

            records = records[records["cycle"] == cycle]

        if records.empty:
            return error_response("No records found for the requested cycle", 404)

        limit = request.args.get("limit", default=200, type=int)
        if limit is None or limit < 1:
            return error_response("Limit must be a positive number", 400)

        records = records.tail(min(limit, 500))

        chart_columns = [
            "cycle",
            "capacity",
            "voltage_mean",
            "voltage_min",
            "voltage_max",
            "current_mean",
            "temperature_mean",
            "temperature_max",
            "discharge_duration"
        ]

        chart_data = records[chart_columns].to_json(orient="records")
        import json

        return jsonify({
            "battery_id": battery_id,
            "records": json.loads(chart_data)
        }), 200

    except KeyError as e:
        return error_response(str(e), 404)
    except Exception as e:
        return error_response(str(e), 500)


# Actual ML prediction
@main_routes.route("/api/batteries/<battery_id>/predict", methods=["POST"])
def predict(battery_id):
    data = request.get_json(silent=True)

    if data is not None and not isinstance(data, dict):
        return error_response("Request body must be a JSON object", 400)

    data = data or {}
    cycle = data.get("cycle")

    try:
        result = get_battery_prediction(battery_id, cycle)

        return jsonify({
            "message": "Battery prediction completed successfully",
            "prediction": result,
            "note": "This is an ML-based estimate using recorded discharge-test data, not a live sensor reading or safety certification."
        }), 200

    except KeyError as e:
        return error_response(str(e), 404)
    except ValueError as e:
        return error_response(str(e), 400)
    except Exception as e:
        return error_response(f"Prediction failed: {str(e)}", 500)


# Second-life assessment
@main_routes.route("/api/batteries/<battery_id>/assessment", methods=["GET"])
def battery_assessment(battery_id):
    try:
        result = get_battery_prediction(battery_id)

        status = result["health_status"]

        if status == "Healthy":
            recommendation = (
                "Candidate for further evaluation for residential solar storage."
            )
        elif status == "Degraded":
            recommendation = (
                "May be evaluated for low-demand stationary storage applications."
            )
        else:
            recommendation = (
                "Not recommended for second-life use without professional assessment."
            )

        return jsonify({
            "battery_id": battery_id,
            "predicted_soh_percent": result["soh_percent"],
            "health_status": status,
            "second_life_screening": result["second_life_screening"],
            "recommendation": recommendation,
            "note": "Preliminary software screening only. Professional testing is required before reuse."
        }), 200

    except KeyError as e:
        return error_response(str(e), 404)
    except ValueError as e:
        return error_response(str(e), 400)
    except Exception as e:
        return error_response(str(e), 500)


# Solar and battery energy simulator
@main_routes.route("/api/simulator/solar", methods=["POST"])
def solar_simulator():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return error_response("Please provide valid JSON data", 400)

    required = [
        "solar_generation_kwh",
        "load_demand_kwh",
        "battery_capacity_kwh",
        "battery_soc_percent",
        "charging_efficiency",
        "discharging_efficiency"
    ]

    missing = [key for key in required if key not in data]
    if missing:
        return error_response(
            f"Missing required fields: {', '.join(missing)}", 400
        )

    try:
        solar = float(data["solar_generation_kwh"])
        load = float(data["load_demand_kwh"])
        capacity = float(data["battery_capacity_kwh"])
        soc = float(data["battery_soc_percent"])
        charge_eff = float(data["charging_efficiency"])
        discharge_eff = float(data["discharging_efficiency"])

        if solar < 0 or load < 0:
            return error_response("Solar generation and load cannot be negative", 400)

        if capacity <= 0:
            return error_response("Battery capacity must be greater than zero", 400)

        if not 0 <= soc <= 100:
            return error_response("Battery SOC must be between 0 and 100", 400)

        if not 0 < charge_eff <= 1 or not 0 < discharge_eff <= 1:
            return error_response("Efficiencies must be greater than 0 and at most 1", 400)

        initial_energy = capacity * soc / 100
        available_solar = max(solar - load, 0)
        energy_deficit = max(load - solar, 0)

        energy_charged = 0
        energy_discharged = 0
        battery_supply = 0
        grid_requirement = 0
        unused_solar = 0

        if available_solar > 0:
            # Charge the battery using excess solar.
            free_capacity = capacity - initial_energy
            energy_charged = min(
                available_solar * charge_eff,
                free_capacity
            )

            solar_used_for_charging = energy_charged / charge_eff
            unused_solar = max(
                available_solar - solar_used_for_charging, 0
            )

        elif energy_deficit > 0:
            # Discharge the battery when solar is insufficient.
            battery_supply = min(
                energy_deficit,
                initial_energy * discharge_eff
            )

            energy_discharged = battery_supply / discharge_eff
            grid_requirement = max(
                energy_deficit - battery_supply, 0
            )

        final_energy = initial_energy + energy_charged - energy_discharged
        final_energy = min(max(final_energy, 0), capacity)
        final_soc = (final_energy / capacity) * 100

        if energy_charged > 0:
            status = "Charging"
        elif energy_discharged > 0:
            status = "Discharging"
        else:
            status = "Idle"

        return jsonify({
            "simulation": True,
            "battery_status": status,
            "initial_battery_energy_kwh": round(initial_energy, 3),
            "energy_charged_kwh": round(energy_charged, 3),
            "energy_discharged_kwh": round(energy_discharged, 3),
            "energy_supplied_by_battery_kwh": round(battery_supply, 3),
            "grid_energy_required_kwh": round(grid_requirement, 3),
            "unused_solar_energy_kwh": round(unused_solar, 3),
            "final_battery_energy_kwh": round(final_energy, 3),
            "final_battery_soc_percent": round(final_soc, 2),
            "note": "This is a simplified energy simulation, not a real-time grid prediction."
        }), 200

    except (TypeError, ValueError):
        return error_response("All simulator inputs must be valid numbers", 400)


# Dashboard summary
@main_routes.route("/api/dashboard/summary", methods=["GET"])
def dashboard_summary():
    try:
        df = load_dataset()
        total_batteries = int(df["battery_id"].nunique())

        predictions = list(prediction_history.values())

        healthy = sum(
            1 for p in predictions if p["health_status"] == "Healthy"
        )
        degraded = sum(
            1 for p in predictions if p["health_status"] == "Degraded"
        )
        poor = sum(
            1 for p in predictions if p["health_status"] == "Poor"
        )

        average_soh = (
            round(
                sum(p["soh_percent"] for p in predictions) / len(predictions),
                2
            )
            if predictions else None
        )

        return jsonify({
            "total_batteries": total_batteries,
            "batteries_assessed_this_session": len(predictions),
            "average_soh_percent": average_soh,
            "healthy_count": healthy,
            "degraded_count": degraded,
            "poor_count": poor,
            "second_life_candidates": sum(
                1 for p in predictions if p["second_life_screening"]
            ),
            "note": "Dashboard health statistics include only batteries assessed during the current backend session."
        }), 200

    except Exception as e:
        return error_response(str(e), 500)
