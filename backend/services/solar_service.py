def simulate_solar_storage(
    solar_generation_kwh,
    daily_demand_kwh,
    battery_capacity_kwh,
    initial_soc_percent,
    charging_efficiency=0.95,
    discharging_efficiency=0.95
):
    # Validate inputs
    if solar_generation_kwh < 0 or daily_demand_kwh < 0:
        raise ValueError("Solar generation and demand cannot be negative.")

    if battery_capacity_kwh <= 0:
        raise ValueError("Battery capacity must be greater than zero.")

    if not 0 <= initial_soc_percent <= 100:
        raise ValueError("Initial SOC must be between 0 and 100.")

    if not 0 < charging_efficiency <= 1:
        raise ValueError("Charging efficiency must be between 0 and 1.")

    if not 0 < discharging_efficiency <= 1:
        raise ValueError("Discharging efficiency must be between 0 and 1.")

    # Initial battery energy
    initial_battery_energy = (
        battery_capacity_kwh * initial_soc_percent / 100
    )

    # 1. Solar supplies the demand directly
    solar_used_directly = min(
        solar_generation_kwh,
        daily_demand_kwh
    )

    remaining_demand = daily_demand_kwh - solar_used_directly
    excess_solar = solar_generation_kwh - solar_used_directly

    # 2. Store excess solar in the battery
    available_battery_space = (
        battery_capacity_kwh - initial_battery_energy
    )

    max_charge_input = (
        available_battery_space / charging_efficiency
    )

    solar_energy_used_for_charging = min(
        excess_solar,
        max_charge_input
    )

    energy_added_to_battery = (
        solar_energy_used_for_charging * charging_efficiency
    )

    battery_energy_after_charging = (
        initial_battery_energy + energy_added_to_battery
    )

    unused_solar = excess_solar - solar_energy_used_for_charging

    # 3. Battery supplies remaining demand
    available_energy_for_load = (
        battery_energy_after_charging * discharging_efficiency
    )

    battery_energy_supplied_to_load = min(
        remaining_demand,
        available_energy_for_load
    )

    battery_energy_removed = (
        battery_energy_supplied_to_load / discharging_efficiency
    )

    remaining_battery_energy = (
        battery_energy_after_charging - battery_energy_removed
    )

    # 4. Grid supplies whatever is still needed
    grid_energy_required = (
        remaining_demand - battery_energy_supplied_to_load
    )

    final_soc_percent = (
        remaining_battery_energy / battery_capacity_kwh
    ) * 100

    # 5. Solar utilization
    solar_utilization_percent = (
        (solar_used_directly + solar_energy_used_for_charging)
        / solar_generation_kwh * 100
        if solar_generation_kwh > 0
        else 0
    )

    return {
        "solar_generation_kwh": round(solar_generation_kwh, 3),
        "daily_demand_kwh": round(daily_demand_kwh, 3),
        "solar_used_directly_kwh": round(solar_used_directly, 3),
        "solar_used_for_charging_kwh": round(
            solar_energy_used_for_charging, 3
        ),
        "battery_energy_added_kwh": round(
            energy_added_to_battery, 3
        ),
        "battery_energy_supplied_kwh": round(
            battery_energy_supplied_to_load, 3
        ),
        "grid_energy_required_kwh": round(
            max(0, grid_energy_required), 3
        ),
        "unused_solar_kwh": round(max(0, unused_solar), 3),
        "initial_battery_energy_kwh": round(
            initial_battery_energy, 3
        ),
        "remaining_battery_energy_kwh": round(
            remaining_battery_energy, 3
        ),
        "initial_soc_percent": round(initial_soc_percent, 2),
        "final_soc_percent": round(final_soc_percent, 2),
        "solar_utilization_percent": round(
            solar_utilization_percent, 2
        )
    }