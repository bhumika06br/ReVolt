
import { useState } from 'react'
import {
  Recycle,
  Battery,
  Activity,
  Gauge,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react'

const batteries = [
  { id: 'BAT-001', soh: 92, capacity: 45.8, cycles: 450 },
  { id: 'BAT-002', soh: 76, capacity: 38.2, cycles: 720 },
  { id: 'BAT-003', soh: 58, capacity: 29.1, cycles: 1100 },
]

export default function SecondLifeAssessment() {
  const [selected, setSelected] = useState(batteries[0])

  const eligible = selected.soh >= 70

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Second-Life Assessment
        </h1>
        <p className="mt-2 text-sm text-[#8B98A7]">
          Evaluate battery suitability for second-life applications.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Battery Selection */}
        <div className="rounded-2xl border border-white/10 bg-[#151B23] p-6">
          <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
            <Battery className="text-[#B6F36A]" />
            Select Battery
          </h3>

          <p className="mb-5 text-sm text-[#8B98A7]">
            Choose a battery to assess.
          </p>

          <div className="space-y-3">
            {batteries.map((battery) => (
              <button
                key={battery.id}
                onClick={() => setSelected(battery)}
                className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
                  selected.id === battery.id
                    ? 'border-[#B6F36A] bg-[#B6F36A]/10'
                    : 'border-white/10 bg-[#1C2430] hover:border-white/30'
                }`}
              >
                <span>{battery.id}</span>
                <span className="font-semibold text-[#B6F36A]">
                  {battery.soh}% SOH
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Assessment Result */}
        <div className="rounded-2xl border border-white/10 bg-[#151B23] p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#B6F36A]/10 text-[#B6F36A]">
            <Recycle size={25} />
          </div>

          <h3 className="text-lg font-semibold">
            Assessment Result
          </h3>

          <span className={`mt-3 inline-block rounded-full px-3 py-1 text-sm ${
            eligible
              ? 'bg-[#B6F36A]/10 text-[#B6F36A]'
              : 'bg-orange-500/10 text-orange-400'
          }`}>
            {eligible ? 'Eligible for further evaluation' : 'Further evaluation required'}
          </span>

          <div className="mt-6">
            <p className="text-sm text-[#8B98A7]">
              State of Health
            </p>
            <h2 className="my-2 text-4xl font-bold text-[#B6F36A]">
              {selected.soh}%
            </h2>

            <div className="h-2 overflow-hidden rounded-full bg-[#29332E]">
              <div
                className="h-full rounded-full bg-[#B6F36A]"
                style={{ width: `${selected.soh}%` }}
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-[#1C2430] p-4">
              <Gauge className="mb-2 text-[#B6F36A]" />
              <p className="text-xs text-[#8B98A7]">
                Capacity
              </p>
              <h3 className="mt-1 text-xl font-semibold">
                {selected.capacity} Ah
              </h3>
            </div>

            <div className="rounded-xl bg-[#1C2430] p-4">
              <Activity className="mb-2 text-[#B6F36A]" />
              <p className="text-xs text-[#8B98A7]">
                Charge Cycles
              </p>
              <h3 className="mt-1 text-xl font-semibold">
                {selected.cycles}
              </h3>
            </div>
          </div>

          <div className="mt-5 flex gap-3 rounded-xl bg-[#1C2430] p-4">
            {eligible ? (
              <CheckCircle className="shrink-0 text-[#B6F36A]" />
            ) : (
              <AlertTriangle className="shrink-0 text-orange-400" />
            )}

            <div>
              <p className="font-medium">
                {eligible ? 'Potential second-life candidate' : 'Below screening threshold'}
              </p>
              <p className="mt-1 text-xs text-[#8B98A7]">
                Illustrative screening only. Actual reuse requires validated assessment and safety testing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
