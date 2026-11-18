import joblib
import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "capacity_model.pkl"

# Load model once
bundle = joblib.load(MODEL_PATH)
model = bundle["model"]
features = bundle["features"]


def predict_battery(input_data, reference_capacity):
    """
    input_data: dictionary containing model input features
    reference_capacity: initial/reference battery capacity in Ah
    """

    X = pd.DataFrame([input_data])[features]

    predicted_capacity = float(model.predict(X)[0])
    soh = (predicted_capacity / reference_capacity) * 100

    if soh >= 80:
        status = "Healthy"
    elif soh >= 60:
        status = "Degraded"
    else:
        status = "Poor"

    return {
        "predicted_capacity_ah": round(predicted_capacity, 3),
        "soh_percent": round(soh, 2),
        "health_status": status,
        "second_life_screening": soh >= 60
    }