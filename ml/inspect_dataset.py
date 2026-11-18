import pandas as pd
from pathlib import Path

# Dataset paths
BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "dataset" / "raw" / "cleaned_dataset"

metadata_path = DATA_DIR / "metadata.csv"

# Load metadata
df = pd.read_csv(metadata_path)

print("\n========== DATASET OVERVIEW ==========")

print("Total experiments:", len(df))

print("\nExperiment types:")
print(df["type"].value_counts())

print("\nUnique batteries:")
print(df["battery_id"].nunique())

print("\nBatteries:")
print(df["battery_id"].unique())

print("\nDischarge experiments:")
discharge_df = df[df["type"] == "discharge"]

print("Count:", len(discharge_df))

print("\nCapacity statistics:")
print(discharge_df["Capacity"].describe())

print("\nFirst 5 discharge records:")
print(discharge_df[
    ["battery_id", "test_id", "filename", "Capacity", "ambient_temperature"]
].head())