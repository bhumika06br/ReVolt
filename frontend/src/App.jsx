
import { useState } from 'react'
import {
  Zap,
  LayoutDashboard,
  BatteryCharging,
  Activity,
  Sun,
  FileText,
  Bell,
  Search,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react'

import Dashboard from './pages/Dashboard'
import BatteryDiagnostics from './pages/Diagnostics'
import SecondLifeAssessment from './pages/SecondLifeAssessment'
import SolarSimulator from './pages/SolarSimulator'
import Reports from './pages/Reports'

const navigation = [
  { name: 'Overview', icon: LayoutDashboard },
  { name: 'Battery Diagnostics', icon: Activity },
  { name: 'Second-Life Assessment', icon: BatteryCharging },
  { name: 'Solar Simulator', icon: Sun },
  { name: 'Reports', icon: FileText },
]

const metrics = [
  {
    title: 'Batteries Analyzed',
    value: '—',
    change: 'Awaiting backend data',
    icon: BatteryCharging,
  },
  {
    title: 'Average SOH',
    value: '—',
    change: 'Awaiting ML predictions',
    icon: Activity,
  },
  {
    title: 'Second-Life Candidates',
    value: '—',
    change: 'Awaiting screening results',
    icon: Zap,
  },
  {
    title: 'Energy Capacity',
    value: '—',
    change: 'Awaiting assessment data',
    icon: Sun,
  },
]

function App() {
  const [activePage, setActivePage] = useState('Overview')
  const [menuOpen, setMenuOpen] = useState(false)

  const renderPage = () => {
    switch (activePage) {
      case 'Overview':
        return (
          <>
            <section className="mb-8">
              <p className="text-sm text-[#8B98A7]">
                Battery intelligence platform
              </p>

              <h3 className="mt-2 text-2xl font-semibold">
                Welcome to{' '}
                <span className="text-[#B6F36A]">
                  ReVolt.
                </span>
              </h3>

              <p className="mt-2 text-sm text-[#8B98A7]">
                Monitor battery health and explore second-life energy opportunities.
              </p>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map(({ title, value, change, icon: Icon }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/10 bg-[#151B23] p-5"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <p className="text-sm text-[#8B98A7]">
                      {title}
                    </p>

                    <Icon
                      size={20}
                      className="text-[#B6F36A]"
                    />
                  </div>

                  <h4 className="text-3xl font-semibold">
                    {value}
                  </h4>

                  <p className="mt-2 text-xs text-[#8B98A7]">
                    {change}
                  </p>
                </div>
              ))}
            </section>

            <section className="mt-8">
              <Dashboard
                batteries={[]}
                energyData={{}}
              />
            </section>
          </>
        )

      case 'Battery Diagnostics':
        return <BatteryDiagnostics />

      case 'Second-Life Assessment':
        return <SecondLifeAssessment />

      case 'Solar Simulator':
        return <SolarSimulator />

      case 'Reports':
        return <Reports />

      default:
        return <Dashboard batteries={[]} energyData={{}} />
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#F2F5F7] md:flex">

      {/* Sidebar */}
      <aside
        className={`${
          menuOpen ? 'flex' : 'hidden'
        } md:flex fixed md:sticky top-0 z-20 h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-[#111720] p-5`}
      >
        {/* Logo */}
        <div className="mb-10 flex items-center gap-3">
          <div className="rounded-xl bg-[#B6F36A] p-2 text-[#0B0F14]">
            <Zap size={23} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-wide">
              ReVolt
            </h1>
            <p className="text-xs text-[#8B98A7]">
              Battery Intelligence
            </p>
          </div>

          <button
            className="ml-auto md:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#647181]">
          Workspace
        </p>

        <nav className="space-y-2">
          {navigation.map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => {
                setActivePage(name)
                setMenuOpen(false)
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${
                activePage === name
                  ? 'bg-[#B6F36A]/10 text-[#B6F36A]'
                  : 'text-[#8B98A7] hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={19} />
              {name}
            </button>
          ))}
        </nav>

        {/* System Status */}
        <div className="mt-auto rounded-xl border border-white/10 bg-[#1C2430] p-4">
          <div className="mb-2 flex items-center gap-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-[#B6F36A]" />
            System Status
          </div>

          <p className="text-xs text-[#8B98A7]">
            Frontend demo environment
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 p-5 md:p-8">

        {/* Header */}
        <header className="mb-9 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden"
              onClick={() => setMenuOpen(true)}
            >
              <Menu />
            </button>

            <div>
              <p className="text-sm text-[#8B98A7]">
                ReVolt / Workspace
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                {activePage}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-xl border border-white/10 p-3 text-[#8B98A7] hover:text-white">
              <Search size={19} />
            </button>

            <button className="rounded-xl border border-white/10 p-3 text-[#8B98A7] hover:text-white">
              <Bell size={19} />
            </button>

            <div className="hidden items-center gap-2 rounded-xl border border-white/10 p-2 sm:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1C2430] text-sm font-semibold text-[#B6F36A]">
                A
              </div>

              <span className="text-sm">Analyst</span>

              <ChevronDown
                size={15}
                className="text-[#8B98A7]"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        {renderPage()}

      </main>
    </div>
  )
}

export default App
