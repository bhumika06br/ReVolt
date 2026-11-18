
import {
  Sun,
  Zap,
  BatteryCharging,
  Home,
  ArrowRight,
} from "lucide-react";

export default function EnergyFlow({
  solarPower,
  batteryPower,
  loadPower,
  gridPower,
}) {
  const formatPower = (value) =>
    value != null ? `${value} kW` : "—";

  const energyNodes = [
    {
      title: "Solar Generation",
      subtitle: "Renewable input",
      value: solarPower,
      icon: Sun,
      className: "flow-solar",
      display: formatPower(solarPower),
    },
    {
      title: "Energy Management",
      subtitle: "Power distribution",
      value: null,
      icon: Zap,
      className: "flow-ems",
      display: "EMS",
    },
    {
      title: "Battery Storage",
      subtitle: "Energy reserve",
      value: batteryPower,
      icon: BatteryCharging,
      className: "flow-battery",
      display: formatPower(batteryPower),
    },
    {
      title: "Load Consumption",
      subtitle: "Power utilization",
      value: loadPower,
      icon: Home,
      className: "flow-load",
      display: formatPower(loadPower),
    },
  ];

  return (
    <section className="energy-flow-card">

      {/* Header */}
      <div className="energy-flow-header">
        <div>
          <h2>Energy Flow Overview</h2>
          <p>
            Real-time energy distribution across the system
          </p>
        </div>

        <span className="flow-live-indicator">
          System Flow
        </span>
      </div>

      {/* Energy Nodes */}
      <div className="energy-flow-container">

        {energyNodes.map((node, index) => {
          const Icon = node.icon;

          return (
            <div
              className="energy-flow-group"
              key={node.title}
            >
              <div className={`energy-flow-node ${node.className}`}>

                <div className="flow-icon">
                  <Icon size={25} />
                </div>

                <h3>{node.title}</h3>

                <p>{node.subtitle}</p>

                <strong>{node.display}</strong>

              </div>
            </div>
          );
        })}

      </div>

      {/* Grid Power Information */}
      <div className="grid-power-info">
        <Zap size={17} />

        <span>Grid Power</span>

        <strong>
          {formatPower(gridPower)}
        </strong>
      </div>

    </section>
  );
}
