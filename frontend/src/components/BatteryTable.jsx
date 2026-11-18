
import { useState } from "react";
import {
  Search,
  ChevronRight,
  Battery,
  Filter,
} from "lucide-react";

export default function BatteryTable({
  batteries = [],
  onSelectBattery,
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // Search and filter batteries
  const filteredBatteries = batteries.filter((battery) => {
    const batteryId = String(battery.batteryId || "");

    const matchesSearch = batteryId
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    const matchesFilter =
      filter === "All" ||
      battery.healthStatus === filter;

    return matchesSearch && matchesFilter;
  });

  // Health status styling
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

  return (
    <section className="battery-table-card">

      {/* Table Header */}
      <div className="battery-table-header">
        <div>
          <h2>Recent Battery Assessments</h2>

          <p>
            ML-estimated results from recorded discharge data
          </p>
        </div>

        <span className="dashboard-status">
          {filteredBatteries.length} records
        </span>
      </div>

      {/* Search and Filter */}
      <div className="battery-table-controls">

        <div className="table-search">
          <Search size={17} />

          <input
            type="search"
            placeholder="Search battery ID..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <select
          value={filter}
          onChange={(event) =>
            setFilter(event.target.value)
          }
          aria-label="Filter batteries by health status"
        >
          <option value="All">All statuses</option>
          <option value="Healthy">Healthy</option>
          <option value="Degraded">Degraded</option>
          <option value="Poor">Poor</option>
          <option value="Pending">Pending</option>
        </select>

      </div>

      {/* Battery Assessment Table */}
      <div className="battery-table-wrapper">

        <table className="battery-table">

          <thead>
            <tr>
              <th>Battery ID</th>
              <th>Reference (Ah)</th>
              <th>Predicted (Ah)</th>
              <th>SOH</th>
              <th>Health</th>
              <th>Second-Life Screening</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {filteredBatteries.map((battery, index) => (
              <tr
                key={battery.batteryId || index}
              >

                {/* Battery ID */}
                <td>
                  <div className="battery-id">
                    <Battery size={17} />

                    <strong>
                      {battery.batteryId || "Unknown"}
                    </strong>
                  </div>
                </td>

                {/* Reference Capacity */}
                <td>
                  {battery.referenceCapacityAh ?? "—"}
                </td>

                {/* Predicted Capacity */}
                <td>
                  {battery.predictedCapacityAh ?? "—"}
                </td>

                {/* State of Health */}
                <td>
                  {battery.sohPercent != null
                    ? `${battery.sohPercent}%`
                    : "—"}
                </td>

                {/* Health Status */}
                <td>
                  <span
                    className={`health-badge ${getHealthClass(
                      battery.healthStatus
                    )}`}
                  >
                    {battery.healthStatus || "Pending"}
                  </span>
                </td>

                {/* Second-Life Screening */}
                <td>
                  <span
                    className={`health-badge ${getHealthClass(
                      battery.secondLifeScreening?.status
                    )}`}
                  >
                    {battery.secondLifeScreening?.status || "Pending"}
                  </span>
                </td>

                {/* View Battery */}
                <td>
                  <button
                    className="table-action"
                    onClick={() =>
                      onSelectBattery?.(battery)
                    }
                    aria-label={`View ${
                      battery.batteryId || "battery"
                    }`}
                    title="View battery details"
                  >
                    <ChevronRight size={18} />
                  </button>
                </td>

              </tr>
            ))}

            {/* Empty State */}
            {filteredBatteries.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="battery-table-empty"
                >

                  <div className="empty-table-content">
                    <Battery size={30} />

                    <h3>
                      {batteries.length === 0
                        ? "No Battery Data Available"
                        : "No Matching Batteries"}
                    </h3>

                    <p>
                      {batteries.length === 0
                        ? "Battery assessment results will appear here once backend data is connected."
                        : "Try changing your search or health status filter."}
                    </p>
                  </div>

                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

    </section>
  );
}
