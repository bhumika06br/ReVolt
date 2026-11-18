import { useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:5000/api/simulator/solar";

function App() {
  const [inputs, setInputs] = useState({
    solar_generation_kwh: 10,
    daily_demand_kwh: 7,
    battery_capacity_kwh: 5,
    initial_soc_percent: 20,
    charging_efficiency: 0.95,
    discharging_efficiency: 0.95,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateInput = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: Number(value) }));
  };

  const simulate = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Simulation failed");
      }

      setResult(data);
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to ReVolt API. Make sure Flask is running on port 5000."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setInputs({
      solar_generation_kwh: 10,
      daily_demand_kwh: 7,
      battery_capacity_kwh: 5,
      initial_soc_percent: 20,
      charging_efficiency: 0.95,
      discharging_efficiency: 0.95,
    });
    setResult(null);
    setError("");
  };

  const fields = [
    {
      key: "solar_generation_kwh",
      label: "Solar generation",
      unit: "kWh/day",
      min: 0,
      max: 50,
      step: 0.5,
    },
    {
      key: "daily_demand_kwh",
      label: "Daily energy demand",
      unit: "kWh/day",
      min: 0,
      max: 50,
      step: 0.5,
    },
    {
      key: "battery_capacity_kwh",
      label: "Battery capacity",
      unit: "kWh",
      min: 0.1,
      max: 50,
      step: 0.5,
    },
    {
      key: "initial_soc_percent",
      label: "Initial battery charge",
      unit: "%",
      min: 0,
      max: 100,
      step: 1,
    },
  ];

  const metrics = result
    ? [
        {
          label: "Solar utilized",
          value: `${result.solar_utilization_percent}%`,
          sub: "Solar energy utilization",
        },
        {
          label: "Energy stored",
          value: `${result.battery_energy_added_kwh} kWh`,
          sub: "After charging losses",
        },
        {
          label: "Battery to load",
          value: `${result.battery_energy_supplied_kwh} kWh`,
          sub: "Battery contribution",
        },
        {
          label: "Grid requirement",
          value: `${result.grid_energy_required_kwh} kWh`,
          sub: "Energy still required",
        },
        {
          label: "Unused solar",
          value: `${result.unused_solar_kwh} kWh`,
          sub: "Surplus not stored",
        },
        {
          label: "Final battery charge",
          value: `${result.final_soc_percent}%`,
          sub: "End-of-simulation SOC",
        },
      ]
    : [];

  return (
    <div className="app">
      <nav className="navbar">
        <div className="brand">
          <div className="brand-icon">↯</div>
          <span>ReVolt</span>
        </div>
        <div className="nav-label">
          ENERGY INTELLIGENCE PLATFORM
        </div>
        <div className="status">
          <span className="status-dot"></span>
          SOLAR SIMULATOR
        </div>
      </nav>

      <main className="main">
        <section className="hero">
          <div className="eyebrow">SECOND-LIFE ENERGY LAB</div>
          <h1>
            Power a new future
            <br />
            <span>with stored energy.</span>
          </h1>
          <p>
            Explore how solar energy, battery storage and daily demand
            work together. Simulate energy flow and discover the
            potential of second-life battery storage.
          </p>
        </section>

        <div className="dashboard">
          <section className="panel input-panel">
            <div className="panel-heading">
              <div>
                <div className="eyebrow">CONFIGURATION</div>
                <h2>Simulation inputs</h2>
              </div>
              <button className="reset-btn" onClick={reset}>
                Reset
              </button>
            </div>

            {fields.map((field) => (
              <div className="field" key={field.key}>
                <div className="field-top">
                  <label>{field.label}</label>
                  <div className="field-value">
                    {inputs[field.key]}{" "}
                    <span>{field.unit}</span>
                  </div>
                </div>

                <input
                  type="range"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={inputs[field.key]}
                  onChange={(e) =>
                    updateInput(field.key, e.target.value)
                  }
                />
                <div className="range-labels">
                  <span>{field.min}</span>
                  <span>{field.max}</span>
                </div>
              </div>
            ))}

            <div className="efficiency-grid">
              <div className="efficiency-field">
                <label>Charging efficiency</label>
                <select
                  value={inputs.charging_efficiency}
                  onChange={(e) =>
                    updateInput("charging_efficiency", e.target.value)
                  }
                >
                  <option value={0.8}>80%</option>
                  <option value={0.85}>85%</option>
                  <option value={0.9}>90%</option>
                  <option value={0.95}>95%</option>
                  <option value={1}>100%</option>
                </select>
              </div>

              <div className="efficiency-field">
                <label>Discharging efficiency</label>
                <select
                  value={inputs.discharging_efficiency}
                  onChange={(e) =>
                    updateInput("discharging_efficiency", e.target.value)
                  }
                >
                  <option value={0.8}>80%</option>
                  <option value={0.85}>85%</option>
                  <option value={0.9}>90%</option>
                  <option value={0.95}>95%</option>
                  <option value={1}>100%</option>
                </select>
              </div>
            </div>

            <button
              className="simulate-btn"
              onClick={simulate}
              disabled={loading}
            >
              {loading ? "Calculating..." : "Run simulation  →"}
            </button>

            <p className="input-note">
              Adjust the parameters to explore different energy scenarios.
            </p>
          </section>

          <section className="panel results-panel">
            <div className="panel-heading">
              <div>
                <div className="eyebrow">SIMULATION OUTPUT</div>
                <h2>Energy overview</h2>
              </div>
              <div className="live-tag">
                <span></span>
                LIVE CALCULATION
              </div>
            </div>

            {!result && !error && (
              <div className="empty-state">
                <div className="empty-icon">⚡</div>
                <h3>Ready to simulate</h3>
                <p>
                  Configure your energy system and run the simulation
                  to see how energy flows between solar, battery,
                  demand and grid.
                </p>
              </div>
            )}

            {error && (
              <div className="error-state">
                <h3>Simulation unavailable</h3>
                <p>{error}</p>
              </div>
            )}

            {result && (
              <>
                <div className="primary-result">
                  <div className="eyebrow">SOLAR UTILIZATION</div>
                  <div className="big-number">
                    {result.solar_utilization_percent}
                    <span>%</span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${Math.min(
                          result.solar_utilization_percent,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <p>
                    of generated solar energy was directly used or
                    stored in the battery.
                  </p>
                </div>

                <div className="battery-card">
                  <div className="battery-visual">
                    <div className="battery-shell">
                      <div
                        className="battery-fill"
                        style={{
                          height: `${result.final_soc_percent}%`,
                        }}
                      />
                      <div className="battery-percent">
                        {result.final_soc_percent}%
                      </div>
                    </div>
                    <div className="battery-cap"></div>
                  </div>
                  <div className="battery-info">
                    <div className="eyebrow">BATTERY STATUS</div>
                    <h3>
                      {result.remaining_battery_energy_kwh}{" "}
                      <span>kWh remaining</span>
                    </h3>
                    <p>
                      Initial charge: {result.initial_soc_percent}%
                    </p>
                  </div>
                </div>

                <div className="metrics-grid">
                  {metrics.map((metric) => (
                    <div className="metric-card" key={metric.label}>
                      <div className="metric-label">{metric.label}</div>
                      <div className="metric-value">{metric.value}</div>
                      <div className="metric-sub">{metric.sub}</div>
                    </div>
                  ))}
                </div>

                <div className="energy-flow">
                  <div className="eyebrow">DAILY ENERGY BALANCE</div>
                  <div className="flow-row">
                    <div className="flow-item solar">
                      <span>☀</span>
                      <strong>{result.solar_generation_kwh}</strong>
                      <small>Solar generated</small>
                    </div>
                    <div className="flow-arrow">→</div>
                    <div className="flow-item load">
                      <span>⌂</span>
                      <strong>{result.solar_used_directly_kwh}</strong>
                      <small>Direct solar use</small>
                    </div>
                  </div>
                  <div className="flow-row">
                    <div className="flow-item battery">
                      <span>▣</span>
                      <strong>{result.solar_used_for_charging_kwh}</strong>
                      <small>Solar input to battery</small>
                    </div>
                    <div className="flow-arrow">→</div>
                    <div className="flow-item grid">
                      <span>ϟ</span>
                      <strong>{result.grid_energy_required_kwh}</strong>
                      <small>Grid energy</small>
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>

        <footer>
          ReVolt · Battery Intelligence & Second-Life Energy Simulation
          <span>
            Simplified daily energy-balance model · Not real-time grid data
          </span>
        </footer>
      </main>
    </div>
  );
}

export default App;