import pandas as pd
import numpy as np
from pathlib import Path

BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "dataset" / "raw" / "cleaned_dataset"
OUTPUT_DIR = DATA_DIR.parent / "processed"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

metadata = pd.read_csv(DATA_DIR / "metadata.csv")

# Keep only discharge experiments
discharges = metadata[metadata["type"] == "discharge"].copy()

# Convert capacity into numeric values
discharges["Capacity"] = pd.to_numeric(
    discharges["Capacity"], errors="coerce"
)

# Remove records without capacity
discharges = discharges.dropna(subset=["Capacity"])

features = []

for _, row in discharges.iterrows():

    file_path = DATA_DIR / "data" / row["filename"]

    if not file_path.exists():
        continue

    df = pd.read_csv(file_path)

    # Convert columns to numeric
    cols = [
        "Voltage_measured",
        "Current_measured",
        "Temperature_measured",
        "Current_load",
        "Voltage_load",
        "Time"
    ]

    df[cols] = df[cols].apply(pd.to_numeric, errors="coerce")
    df = df.dropna(subset=cols)

    if df.empty:
        continue

    # Extract features from each discharge
    record = {
        "battery_id": row["battery_id"],
        "cycle": row["test_id"],
        "ambient_temperature": row["ambient_temperature"],

        "voltage_mean": df["Voltage_measured"].mean(),
        "voltage_min": df["Voltage_measured"].min(),
        "voltage_max": df["Voltage_measured"].max(),
        "voltage_std": df["Voltage_measured"].std(),

        "current_mean": df["Current_measured"].mean(),
        "current_std": df["Current_measured"].std(),

        "temperature_mean": df["Temperature_measured"].mean(),
        "temperature_max": df["Temperature_measured"].max(),

        "current_load_mean": df["Current_load"].mean(),
        "voltage_load_mean": df["Voltage_load"].mean(),

        "discharge_duration": df["Time"].max() - df["Time"].min(),

        # Target
        "capacity": row["Capacity"]
    }

    features.append(record)

# Create final dataset
dataset = pd.DataFrame(features)

# Clean any remaining missing values
dataset = dataset.replace([np.inf, -np.inf], np.nan)
dataset = dataset.dropna()

# Save dataset
output_path = OUTPUT_DIR / "battery_features.csv"
dataset.to_csv(output_path, index=False)

print("Preprocessing completed!")
print("Total samples:", len(dataset))
print("Total features:", len(dataset.columns))
print("Saved to:", output_path)

print("\nPreview:")
print(dataset.head())

print("\nCapacity statistics:")
print(dataset["capacity"].describe())