
import { useState } from "react";

import BatteryTable from "../components/BatteryTable";
import BatteryVisualization from "../components/BatteryVisualization";
import EnergyFlow from "../components/EnergyFlow";

export default function Dashboard({
  batteries = [],
  energyData = {},
}) {
  const [selectedBattery, setSelectedBattery] = useState(null);

  const activeBattery =
    selectedBattery || batteries[0] || {};

  return (
    <div className="dashboard-page">

      {/* Dashboard Heading */}
      <div className="dashboard-heading">
        <div>
          <h1>ReVolt Dashboard</h1>
          <p>
            Battery intelligence and second-life assessment
          </p>
        </div>

        <span className="dashboard-status">
          System Overview
        </span>
      </div>

      {/* Energy Flow */}
      <div className="dashboard-section">
        <EnergyFlow
          solarPower={energyData.solarPower}
          batteryPower={energyData.batteryPower}
          loadPower={energyData.loadPower}
          gridPower={energyData.gridPower}
        />
      </div>

      {/* Battery Visualization */}
      <div className="dashboard-section">
        <BatteryVisualization
          battery={activeBattery}
        />
      </div>

      {/* Battery Assessment Table */}
      <div className="dashboard-section">
        <BatteryTable
          batteries={batteries}
          onSelectBattery={setSelectedBattery}
        />
      </div>

    </div>
  );
}
