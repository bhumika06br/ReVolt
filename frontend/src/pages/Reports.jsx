
import { useState } from 'react'
import {
  FileText,
  Download,
  BatteryCharging,
  Activity,
  Calendar,
  CheckCircle,
} from 'lucide-react'

const reportData = [
  {
    id: 1,
    name: 'Battery Health Summary',
    type: 'Diagnostics',
    date: '18 Nov 2026',
    status: 'Available',
  },
  {
    id: 2,
    name: 'Second-Life Assessment',
    type: 'Assessment',
    date: '18 Nov 2026',
    status: 'Available',
  },
  {
    id: 3,
    name: 'Solar Energy Analysis',
    type: 'Simulation',
    date: '18 Nov 2026',
    status: 'Available',
  },
]

export default function Reports() {
  const [search, setSearch] = useState('')

  const filteredReports = reportData.filter((report) =>
    report.name.toLowerCase().includes(search.toLowerCase())
  )

  const downloadReport = (report) => {
    const content = [
      'ReVolt - Battery Intelligence Platform',
      `Report: ${report.name}`,
      `Category: ${report.type}`,
      `Date: ${report.date}`,
      `Status: ${report.status}`,
      '',
      'This is a sample report generated from frontend demo data.',
    ].join('\n')

    const blob = new Blob([content], {
      type: 'text/plain',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `${report.name.replaceAll(' ', '_')}.txt`
    link.click()

    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Reports
        </h1>
        <p className="mt-2 text-sm text-[#8B98A7]">
          View and download battery intelligence reports.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-[#151B23] p-5">
          <FileText className="mb-4 text-[#B6F36A]" />
          <p className="text-sm text-[#8B98A7]">
            Total Reports
          </p>
          <h2 className="mt-2 text-3xl font-semibold">
            {reportData.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#151B23] p-5">
          <BatteryCharging className="mb-4 text-[#B6F36A]" />
          <p className="text-sm text-[#8B98A7]">
            Battery Reports
          </p>
          <h2 className="mt-2 text-3xl font-semibold">
            1
          </h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#151B23] p-5">
          <Activity className="mb-4 text-[#B6F36A]" />
          <p className="text-sm text-[#8B98A7]">
            Available Reports
          </p>
          <h2 className="mt-2 text-3xl font-semibold">
            {reportData.filter((r) => r.status === 'Available').length}
          </h2>
        </div>
      </div>

      {/* Reports Table */}
      <div className="rounded-2xl border border-white/10 bg-[#151B23] p-6">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-semibold">
              Generated Reports
            </h3>
            <p className="mt-1 text-sm text-[#8B98A7]">
              Your available reports
            </p>
          </div>

          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#1C2430] px-4 py-3 text-sm text-white outline-none focus:border-[#B6F36A]"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase text-[#8B98A7]">
                <th className="pb-4">Report Name</th>
                <th className="pb-4">Category</th>
                <th className="pb-4">Date</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredReports.map((report) => (
                <tr
                  key={report.id}
                  className="border-b border-white/5 text-sm"
                >
                  <td className="py-5 font-medium">
                    {report.name}
                  </td>

                  <td className="py-5 text-[#8B98A7]">
                    {report.type}
                  </td>

                  <td className="py-5 text-[#8B98A7]">
                    <span className="flex items-center gap-2">
                      <Calendar size={15} />
                      {report.date}
                    </span>
                  </td>

                  <td className="py-5">
                    <span className="flex items-center gap-2 text-[#B6F36A]">
                      <CheckCircle size={15} />
                      {report.status}
                    </span>
                  </td>

                  <td className="py-5">
                    <button
                      onClick={() => downloadReport(report)}
                      className="flex items-center gap-2 rounded-lg bg-[#B6F36A]/10 px-3 py-2 text-xs font-medium text-[#B6F36A] hover:bg-[#B6F36A]/20"
                    >
                      <Download size={15} />
                      Download
                    </button>
                  </td>
                </tr>
              ))}

              {filteredReports.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="py-8 text-center text-sm text-[#8B98A7]"
                  >
                    No reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-[#8B98A7]">
        Sample reports use frontend demo data. Actual downloadable reports will be connected to your backend later.
      </p>
    </div>
  )
}
