from pathlib import Path
import sys
import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATASET_PATH = PROJECT_ROOT.parent / "ml" / "dataset" / "raw" / "processed" / "battery_features.csv"

FEATURES = [
    "cycle",
    "ambient_temperature",
    "voltage_mean",
    "voltage_min",
    "voltage_max",
    "voltage_std",
    "current_mean",
    "current_std",
    "temperature_mean",
    "temperature_max",
    "current_load_mean",
    "voltage_load_mean",
    "discharge_duration"
]

REQUIRED_COLUMNS = ["battery_id", "capacity"] + FEATURES


def load_dataset():
    if not DATASET_PATH.exists():
        raise FileNotFoundError(
            f"Battery dataset not found: {DATASET_PATH}"
        )

    df = pd.read_csv(DATASET_PATH)

    missing = [col for col in REQUIRED_COLUMNS if col not in df.columns]
    if missing:
        raise ValueError(f"Dataset is missing columns: {missing}")

    df["battery_id"] = df["battery_id"].astype(str)
    return df


def get_battery_records(battery_id):
    df = load_dataset()

    records = df[df["battery_id"] == battery_id].copy()
    records = records.sort_values("cycle")

    if records.empty:
        raise KeyError(f"Battery {battery_id} was not found")

    return records


def get_reference_capacity(records):
    # Ignore zero and negative capacity records.
    valid = records[records["capacity"] > 0].sort_values("cycle")

    if valid.empty:
        raise ValueError("No valid positive capacity records for this battery")

    # Use the median of the first five valid records to reduce the
    # effect of one unusual initial measurement.
    reference = float(valid.head(5)["capacity"].median())

    if reference <= 0:
        raise ValueError("Invalid reference capacity")

    return reference


def predict_battery_cycle(battery_id, cycle=None):
    records = get_battery_records(battery_id)

    if cycle is None:
        selected = records.iloc[-1]
    else:
        try:
            cycle = float(cycle)
        except (TypeError, ValueError):
            raise ValueError("Cycle must be a valid number")

        matching = records[records["cycle"] == cycle]

        if matching.empty:
            raise KeyError(
                f"Cycle {cycle:g} was not found for battery {battery_id}"
            )

        selected = matching.iloc[0]

    reference_capacity = get_reference_capacity(records)

    input_data = {
        feature: float(selected[feature])
        for feature in FEATURES
    }

    # Import the teammate's existing prediction function.
    if str(PROJECT_ROOT) not in sys.path:
        sys.path.insert(0, str(PROJECT_ROOT))

    from ml.predict import predict_battery

    result = predict_battery(input_data, reference_capacity)

    result["battery_id"] = battery_id
    result["cycle"] = int(selected["cycle"])
    result["reference_capacity_ah"] = round(reference_capacity, 3)
    result["reference_method"] = "Median of first five valid positive capacity records"
    result["actual_recorded_capacity_ah"] = round(
        float(selected["capacity"]), 3
    )

    return result
