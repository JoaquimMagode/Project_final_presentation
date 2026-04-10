import React, { useState } from 'react';
import {
  HiOutlineDocumentText, HiOutlineArrowDownTray, HiOutlineCalendarDays,
  HiOutlineChartBar, HiOutlineArrowTrendingUp, HiOutlineUsers,
  HiOutlineCurrencyDollar, HiOutlineEye, HiOutlineShare,
} from 'react-icons/hi2';

const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const Report: React.FC = () => {
  const [selected, setSelected] = useState('overview');
  const [dateRange, setDateRange] = useState('last30days');
  const [format, setFormat] = useState('pdf');

  const types = [
    { id: 'overview', name: 'Hospital Overview', desc: 'Complete performance summary', icon: HiOutlineChartBar },
    { id: 'appointments', name: 'Appointments', desc: 'Appointment analytics', icon: HiOutlineCalendarDays },
    { id: 'revenue', name: 'Revenue', desc: 'Financial analysis', icon: HiOutlineCurrencyDollar },
    { id: 'patients', name: 'Patient Analytics', desc: 'Demographics & stats', icon: HiOutlineUsers },
  ];

  const recent = [
    { id: 1, name: 'Monthly Revenue – Dec 2023', type: 'Revenue', date: '2024-01-01', size: '2.4 MB', fmt: 'PDF' },
    { id: 2, name: 'Patient Analytics – Q4 2023', type: 'Patients', date: '2023-12-31', size: '1.8 MB', fmt: 'Excel' },
    { id: 3, name: 'Appointment Summary – Dec 2023', type: 'Appointments', date: '2023-12-30', size: '1.2 MB', fmt: 'PDF' },
    { id: 4, name: 'Hospital Overview – Dec 2023', type: 'Overview', date: '2023-12-29', size: '3.1 MB', fmt: 'PDF' },
  ];

  const inputCls = "w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500";

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-lg font-bold text-gray-900">Reports</h1><p className="text-xs text-gray-500">Generate and manage hospital reports</p></div>
        <button className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white text-xs font-medium rounded-md hover:bg-emerald-700">
          <HiOutlineDocumentText className="w-3.5 h-3.5" /> Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {([
          { label: 'Total Reports', value: '156', sub: '+12%', icon: HiOutlineDocumentText, accent: 'bg-blue-500' },
          { label: 'This Month', value: '24', sub: '+8%', icon: HiOutlineCalendarDays, accent: 'bg-emerald-500' },
          { label: 'Most Downloaded', value: 'Revenue', sub: '45%', icon: HiOutlineArrowTrendingUp, accent: 'bg-violet-500' },
          { label: 'Avg Gen Time', value: '2.3s', sub: '-15%', icon: HiOutlineChartBar, accent: 'bg-amber-500' },
        ] as const).map(s => (
          <div key={s.label} className="bg-white rounded-lg px-4 py-3.5 border border-gray-200 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${s.accent}`}>
              <s.icon className="w-[18px] h-[18px] text-white" />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 leading-none">{s.label}</p>
              <p className="text-lg font-bold text-gray-900 leading-tight mt-0.5">{s.value}</p>
              <p className="text-[10px] text-emerald-600">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200">
          <div className="px-5 py-3.5 border-b border-gray-200"><h3 className="text-sm font-semibold text-gray-900">Generate New Report</h3></div>
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Report Type</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {types.map(t => (
                  <button key={t.id} onClick={() => setSelected(t.id)}
                    className={`p-3 border rounded-md text-left transition-colors ${selected === t.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <t.icon className={`w-4 h-4 ${selected === t.id ? 'text-emerald-600' : 'text-gray-400'}`} />
                      <span className="text-xs font-medium text-gray-900">{t.name}</span>
                    </div>
                    <p className="text-[11px] text-gray-500">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div><label className="block text-xs font-medium text-gray-600 mb-1">Date Range</label>
                <select value={dateRange} onChange={e => setDateRange(e.target.value)} className={inputCls}>
                  <option value="last7days">Last 7 Days</option><option value="last30days">Last 30 Days</option>
                  <option value="last3months">Last 3 Months</option><option value="lastyear">Last Year</option>
                </select>
              </div>
              <div><label className="block text-xs font-medium text-gray-600 mb-1">Format</label>
                <select value={format} onChange={e => setFormat(e.target.value)} className={inputCls}>
                  <option value="pdf">PDF</option><option value="excel">Excel</option><option value="csv">CSV</option>
                </select>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-md text-[11px] text-gray-600 space-y-0.5">
              <p><span className="font-medium">Type:</span> {types.find(t => t.id === selected)?.name}</p>
              <p><span className="font-medium">Format:</span> {format.toUpperCase()} · ~2.5 MB · ~3-5s</p>
            </div>
            <button className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 text-white text-xs font-medium rounded-md hover:bg-emerald-700">
              <HiOutlineDocumentText className="w-3.5 h-3.5" /> Generate Report
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-5 py-3.5 border-b border-gray-200"><h3 className="text-sm font-semibold text-gray-900">Recent Reports</h3></div>
          <div className="p-4 space-y-3">
            {recent.map(r => (
              <div key={r.id} className="p-3 border border-gray-200 rounded-md hover:border-gray-300 transition-colors">
                <h4 className="text-xs font-medium text-gray-900 truncate mb-1">{r.name}</h4>
                <p className="text-[10px] text-gray-400">{r.type} · {fmtDate(r.date)}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-gray-400">{r.size} · {r.fmt}</span>
                  <div className="flex items-center gap-1">
                    <button className="p-1 text-gray-400 hover:text-gray-600"><HiOutlineEye className="w-3.5 h-3.5" /></button>
                    <button className="p-1 text-gray-400 hover:text-gray-600"><HiOutlineArrowDownTray className="w-3.5 h-3.5" /></button>
                    <button className="p-1 text-gray-400 hover:text-gray-600"><HiOutlineShare className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-5 py-3.5 border-b border-gray-200"><h3 className="text-sm font-semibold text-gray-900">Templates</h3></div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { name: 'Monthly Summary', desc: 'Comprehensive monthly report', icon: HiOutlineChartBar, bg: 'bg-blue-50', fg: 'text-blue-600' },
            { name: 'Financial Report', desc: 'Revenue & expense analysis', icon: HiOutlineCurrencyDollar, bg: 'bg-green-50', fg: 'text-green-600' },
            { name: 'Patient Report', desc: 'Demographics & satisfaction', icon: HiOutlineUsers, bg: 'bg-violet-50', fg: 'text-violet-600' },
          ].map(t => (
            <div key={t.name} className="p-3 border border-gray-200 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-7 h-7 rounded-md flex items-center justify-center ${t.bg}`}><t.icon className={`w-3.5 h-3.5 ${t.fg}`} /></div>
                <h4 className="text-xs font-medium text-gray-900">{t.name}</h4>
              </div>
              <p className="text-[11px] text-gray-500 mb-2">{t.desc}</p>
              <button className="text-[11px] text-emerald-600 hover:text-emerald-700 font-medium">Use Template</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Report;
