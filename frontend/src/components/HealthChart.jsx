
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = {
  Healthy: "#B6F36A",
  Degraded: "#E9B45A",
  Poor: "#E47777",
};

export default function HealthChart({ data = [] }) {
  const chartData = data.filter(
    (item) => Number(item.value) > 0
  );

  const total = chartData.reduce(
    (sum, item) => sum + Number(item.value),
    0
  );

  return (
    <div className="chart-card health-chart-card">
      <div className="chart-heading">
        <div>
          <h3>Battery Health Distribution</h3>
          <p>Classification across assessed batteries</p>
        </div>

        <span className="chart-total">{total}</span>
      </div>

      {chartData.length === 0 ? (
        <div className="chart-empty">
          <p>No battery assessment data available yet.</p>
        </div>
      ) : (
        <>
          <div className="donut-wrapper">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={88}
                  paddingAngle={4}
                  stroke="none"
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[entry.name] || "#57C7D4"}
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    background: "#1C2430",
                    border: "1px solid #303B49",
                    borderRadius: "8px",
                    color: "#F2F5F7",
                  }}
                  formatter={(value, name) => [
                    `${value} batteries`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="donut-center">
              <strong>{total}</strong>
              <span>Assessed</span>
            </div>
          </div>

          <div className="health-legend">
            {chartData.map((item) => (
              <div className="legend-item" key={item.name}>
                <span
                  className="legend-dot"
                  style={{
                    backgroundColor:
                      COLORS[item.name] || "#57C7D4",
                  }}
                />

                <span>{item.name}</span>

                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
