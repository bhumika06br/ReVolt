
import { useState } from 'react'
import {
  Sun,
  Zap,
  BatteryCharging,
  Home,
  Gauge,
} from 'lucide-react'

export default function SolarSimulator() {
  const [solar, setSolar] = useState(5)
  const [sunHours, setSunHours] = useState(5)
  const [consumption, setConsumption] = useState(15)

  const generation = solar * sunHours
  const surplus = generation - consumption
  const coverage = consumption > 0
    ? Math.min((generation / consumption) * 100, 100)
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Solar Energy Simulator
        </h1>
        <p className="mt-2 text-sm text-[#8B98A7]">
          Simulate solar generation and household energy requirements.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Inputs */}
        <div className="rounded-2xl border border-white/10 bg-[#151B23] p-6">
          <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold">
            <Sun className="text-[#B6F36A]" />
            Simulation Parameters
          </h3>

          <div className="mb-7">
            <div className="mb-3 flex justify-between">
              <label className="text-sm text-[#8B98A7]">
                Solar Panel Capacity
              </label>
              <strong>{solar} kW</strong>
            </div>

            <input
              type="range"
              min="1"
              max="20"
              value={solar}
              onChange={(e) => setSolar(Number(e.target.value))}
              className="w-full accent-[#B6F36A]"
            />
          </div>

          <div className="mb-7">
            <div className="mb-3 flex justify-between">
              <label className="text-sm text-[#8B98A7]">
                Sunlight Hours
              </label>
              <strong>{sunHours} hours</strong>
            </div>

            <input
              type="range"
              min="1"
              max="12"
              value={sunHours}
              onChange={(e) => setSunHours(Number(e.target.value))}
              className="w-full accent-[#B6F36A]"
            />
          </div>

          <div>
            <div className="mb-3 flex justify-between">
              <label className="text-sm text-[#8B98A7]">
                Daily Energy Consumption
              </label>
              <strong>{consumption} kWh</strong>
            </div>

            <input
              type="range"
              min="1"
              max="50"
              value={consumption}
              onChange={(e) => setConsumption(Number(e.target.value))}
              className="w-full accent-[#B6F36A]"
            />
          </div>
        </div>

        {/* Results */}
        <div className="rounded-2xl border border-white/10 bg-[#151B23] p-6">
          <h3 className="mb-6 text-lg font-semibold">
            Simulation Results
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-[#1C2430] p-4">
              <Sun className="mb-3 text-[#B6F36A]" />
              <p className="text-xs text-[#8B98A7]">
                Solar Generation
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                {generation} kWh
              </h2>
            </div>

            <div className="rounded-xl bg-[#1C2430] p-4">
              <Home className="mb-3 text-[#B6F36A]" />
              <p className="text-xs text-[#8B98A7]">
                Consumption
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                {consumption} kWh
              </h2>
            </div>

            <div className="rounded-xl bg-[#1C2430] p-4">
              <Zap className="mb-3 text-[#B6F36A]" />
              <p className="text-xs text-[#8B98A7]">
                Energy Difference
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                {surplus.toFixed(1)} kWh
              </h2>
            </div>

            <div className="rounded-xl bg-[#1C2430] p-4">
              <BatteryCharging className="mb-3 text-[#B6F36A]" />
              <p className="text-xs text-[#8B98A7]">
                Energy Coverage
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                {coverage.toFixed(1)}%
              </h2>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-[#1C2430] p-4">
            <div className="mb-3 flex items-center gap-2">
              <Gauge className="text-[#B6F36A]" />
              <span className="font-medium">
                Energy Balance
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-[#303A35]">
              <div
                className="h-full rounded-full bg-[#B6F36A]"
                style={{ width: `${coverage}%` }}
              />
            </div>

            <p className="mt-3 text-sm text-[#8B98A7]">
              {surplus >= 0
                ? `${surplus.toFixed(1)} kWh potential surplus energy.`
                : `${Math.abs(surplus).toFixed(1)} kWh additional energy required.`}
            </p>
          </div>
        </div>
      </div>

      <p className="text-xs text-[#8B98A7]">
        Estimate only: generation is calculated as panel capacity multiplied by sunlight hours. Actual output depends on weather, orientation, shading and system losses.
      </p>
    </div>
  )
}
