
import { useState } from 'react'
import {
  Activity,
  BatteryCharging,
  Gauge,
  Thermometer,
  Zap,
  Search,
  TrendingUp,
} from 'lucide-react'

const demoBattery = {
  batteryId: 'BAT-001',
  soh: 92,
  voltage: 3.72,
  current: 2.4,
  temperature: 28,
  capacity: 45.8,
}

export default function BatteryDiagnostics() {
  const [batteryId, setBatteryId] = useState('BAT-001')
  const [battery, setBattery] = useState(demoBattery)

  const metrics = [
    { label: 'State of Health', value: `${battery.soh}%`, icon: Activity },
    { label: 'Voltage', value: `${battery.voltage} V`, icon: Zap },
    { label: 'Current', value: `${battery.current} A`, icon: BatteryCharging },
    { label: 'Temperature', value: `${battery.temperature} °C`, icon: Thermometer },
    { label: 'Capacity', value: `${battery.capacity} Ah`, icon: Gauge },
  ]

  const healthStatus =
    battery.soh >= 80 ? 'Healthy' :
    battery.soh >= 60 ? 'Moderate' : 'Poor'

  const handleSearch = () => {
    const id = batteryId.trim()
    if (!id) return

    setBattery({
      ...demoBattery,
      batteryId: id,
    })
  }

  return (
    <div className="diagnostics-page">

      {/* Page Heading */}
      <div className="diagnostics-heading">
        <div>
          <h1>Battery Diagnostics</h1>
          <p>Monitor battery health and electrical performance.</p>
        </div>

        <span className="diagnostics-status">
          <span className="status-dot" />
          Diagnostic Center
        </span>
      </div>

      {/* Search */}
      <div className="diagnostics-search">
        <Search size={20} />

        <input
          type="text"
          value={batteryId}
          onChange={(e) => setBatteryId(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch()
          }}
          placeholder="Enter Battery ID..."
        />

        <button onClick={handleSearch}>
          Search Battery
        </button>
      </div>

      {/* Metrics */}
      <div className="diagnostics-grid">
        {metrics.map(({ label, value, icon: Icon }) => (
          <div className="diagnostic-card" key={label}>
            <div className="diagnostic-icon">
              <Icon size={23} />
            </div>

            <p>{label}</p>
            <h2>{value}</h2>
          </div>
        ))}
      </div>

      {/* Details */}
      <div className="diagnostic-details">

        <div className="diagnostic-overview">
          <div className="diagnostic-section-heading">
            <div>
              <h3>Battery Performance Overview</h3>
              <p>Selected battery: {battery.batteryId}</p>
            </div>

            <Activity size={22} />
          </div>

          <div className="soh-heading">
            <span>State of Health</span>
            <strong>{battery.soh}%</strong>
          </div>

          <div className="diagnostic-progress">
            <div style={{ width: `${battery.soh}%` }} />
          </div>

          <div className="diagnostic-footer">
            <span>Battery health</span>
            <span>100%</span>
          </div>
        </div>

        <div className="diagnostic-status-card">
          <div className="diagnostic-icon">
            <TrendingUp size={23} />
          </div>

          <h3>Battery Condition</h3>

          <span className={`health-badge ${
            healthStatus === 'Healthy'
              ? 'status-healthy'
              : 'status-warning'
          }`}>
            {healthStatus}
          </span>

          <p>
            Current battery health assessment based on illustrative demo data.
          </p>
        </div>
      </div>

      <p className="diagnostic-note">
        Demo environment · Actual battery readings will be connected to the backend.
      </p>
    </div>
  )
}
