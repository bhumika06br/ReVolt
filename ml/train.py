import pandas as pd
import joblib

from pathlib import Path
from sklearn.model_selection import GroupShuffleSplit
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

BASE_DIR = Path(__file__).parent
DATA_PATH = BASE_DIR / "dataset" / "raw" / "processed" / "battery_features.csv"
MODEL_DIR = BASE_DIR / "models"
MODEL_DIR.mkdir(exist_ok=True)

# Load processed dataset
df = pd.read_csv(DATA_PATH)

# Remove invalid capacity values
df = df[df["capacity"] > 0].copy()

# Target
y = df["capacity"]

# Exclude battery ID and target from features
X = df.drop(columns=["capacity", "battery_id"])

# Battery IDs for group splitting
groups = df["battery_id"]

# Split by battery, not by random rows
splitter = GroupShuffleSplit(
    n_splits=1,
    test_size=0.20,
    random_state=42
)

train_idx, test_idx = next(splitter.split(X, y, groups))

X_train, X_test = X.iloc[train_idx], X.iloc[test_idx]
y_train, y_test = y.iloc[train_idx], y.iloc[test]

print("Training samples:", len(X_train))
print("Testing samples:", len(X_test))

print("Train batteries:", sorted(groups.iloc[train_idx].unique()))
print("Test batteries:", sorted(groups.iloc[test_idx].unique()))

# Models to compare
models = {
    "Linear Regression": LinearRegression(),

    "Random Forest": RandomForestRegressor(
        n_estimators=200,
        max_depth=12,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    ),

    "Gradient Boosting": GradientBoostingRegressor(
        n_estimators=150,
        learning_rate=0.05,
        max_depth=3,
        random_state=42
    )
}

results = []
trained_models = {}

for name, model in models.items():

    print(f"\nTraining {name}...")

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    mae = mean_absolute_error(y_test, predictions)
    rmse = mean_squared_error(y_test, predictions) ** 0.5
    r2 = r2_score(y_test, predictions)

    results.append({
        "Model": name,
        "MAE": mae,
        "RMSE": rmse,
        "R2": r2
    })

    trained_models[name] = model

    print(f"MAE  : {mae:.4f} Ah")
    print(f"RMSE : {rmse:.4f} Ah")
    print(f"R2   : {r2:.4f}")

# Compare models
results_df = pd.DataFrame(results).sort_values("MAE")

print("\n========== MODEL COMPARISON ==========")
print(results_df.to_string(index=False))

# Select best model by MAE
best_name = results_df.iloc[0]["Model"]
best_model = trained_models[best_name]

print("\nBest model:", best_name)

# Save model and metadata
model_bundle = {
    "model": best_model,
    "model_name": best_name,
    "features": list(X.columns),
    "target": "capacity",
    "test_batteries": sorted(groups.iloc[test_idx].unique().tolist()),
    "mae": float(results_df.iloc[0]["MAE"]),
    "rmse": float(results_df.iloc[0]["RMSE"]),
    "r2": float(results_df.iloc[0]["R2"])
}

model_path = MODEL_DIR / "capacity_model.pkl"

joblib.dump(model_bundle, model_path)

# Save comparison report
results_df.to_csv(MODEL_DIR / "model_comparison.csv", index=False)

print("\nModel saved to:", model_path)
print("Comparison saved to:", MODEL_DIR / "model_comparison.csv")