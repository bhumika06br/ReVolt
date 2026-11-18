
export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accent = "lime",
}) {
  return (
    <div className={`metric-card metric-${accent}`}>
      <div className="metric-card-top">
        <span className="metric-title">{title}</span>

        {Icon && (
          <div className="metric-icon">
            <Icon size={19} strokeWidth={1.8} />
          </div>
        )}
      </div>

      <div className="metric-value">
        {value ?? "—"}
      </div>

      <div className="metric-card-bottom">
        <span className="metric-subtitle">
          {subtitle}
        </span>

        {trend && (
          <span className="metric-trend">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
