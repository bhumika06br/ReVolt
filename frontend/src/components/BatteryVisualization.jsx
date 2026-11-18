
import {
  BatteryFull,
  Activity,
  Gauge,
  Zap,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export default function BatteryVisualization({ battery = {} }) {
  const soh = Number(battery.sohPercent);

  const hasSoh =
    battery.sohPercent != null &&
    Number.isFinite(soh);

  const healthStatus = battery.healthStatus || "Pending";

  const getHealthClass = (status) => {
    switch (status) {
      case "Healthy":
        return "status-healthy";
      case "Degraded":
        return "status-degraded";
      case "Poor":
        return "status-poor";
      default:
        return "status-unknown";
    }
  };

  const metrics = [
    {
      label: "State of Health",
      value: hasSoh ? `${soh}%` : "—",
      icon: Activity,
    },
    {
      label: "Predicted Capacity",
      value:
        battery.predictedCapacityAh != null
          ? `${battery.predictedCapacityAh} Ah`
          : "—",
      icon: BatteryFull,
    },
    {
      label: "Reference Capacity",
      value:
        battery.referenceCapacityAh != null
          ? `${battery.referenceCapacityAh} Ah`
          : "—",
      icon: Gauge,
    },
    {
      label: "Health Status",
      value: healthStatus,
      icon: Zap,
    },
  ];

  const batteryLevel = hasSoh
    ? Math.max(0, Math.min(100, soh))
    : 0;

  const screeningStatus =
    battery.secondLifeScreening?.status || "Pending";

  return (
    <section className="battery-visualization-card">

      {/* Header */}
      <div className="battery-visualization-header">
        <div>
          <h2>Battery Visualization</h2>
          <p>Battery condition and performance overview</p>
        </div>

        <span className="battery-visualization-id">
          {battery.batteryId || "No Battery Selected"}
        </span>
      </div>

      {/* Main Battery Display */}
      <div className="battery-visual-main">

        <div className="battery-graphic">
          <div className="battery-terminal"></div>

          <div className="battery-body">
            <div
              className="battery-level"
              style={{
                width: `${batteryLevel}%`,
              }}
            />

            <div className="battery-level-text">
              {hasSoh ? `${soh}%` : "—"}
            </div>
          </div>
        </div>

        <div className="battery-health-info">

          <span className="battery-health-label">
            STATE OF HEALTH
          </span>

          <strong>
            {hasSoh ? `${soh}%` : "—"}
          </strong>

          <span
            className={`health-badge ${getHealthClass(
              healthStatus
            )}`}
          >
            {healthStatus}
          </span>

          <p>
            {hasSoh
              ? "ML-estimated battery health"
              : "Waiting for assessment data"}
          </p>

        </div>
      </div>

      {/* Battery Metrics */}
      <div className="battery-metrics-grid">

        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <div className="battery-metric" key={metric.label}>

              <div className="battery-metric-icon">
                <Icon size={19} />
                <span>{metric.label}</span>
              </div>

              <strong>{metric.value}</strong>

            </div>
          );
        })}

      </div>

      {/* Second Life Screening */}
      <div className="battery-screening">

        <div className="battery-screening-heading">
          <div className="battery-metric-icon">
            <ShieldCheck size={19} />
            <span>Second-Life Screening</span>
          </div>

          <span
            className={`health-badge ${getHealthClass(
              screeningStatus
            )}`}
          >
            {screeningStatus}
          </span>
        </div>

        <p>
          {battery.secondLifeScreening?.recommendation ||
            "Assessment results will appear once battery analysis is complete."}
        </p>

      </div>

    </section>
  );
}
