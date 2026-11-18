from backend.services.solar_service import simulate_solar_storage

result = simulate_solar_storage(
    solar_generation_kwh=10,
    daily_demand_kwh=7,
    battery_capacity_kwh=5,
    initial_soc_percent=20,
    charging_efficiency=0.95,
    discharging_efficiency=0.95
)

print("\n===== ReVolt Solar Simulation =====")

for key, value in result.items():
    print(f"{key}: {value}")