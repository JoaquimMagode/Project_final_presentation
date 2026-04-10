import React, { useState, useEffect } from 'react';
import {
  HiOutlineChartBar, HiOutlineArrowTrendingUp, HiOutlineUsers,
  HiOutlineCalendarDays, HiOutlineCurrencyDollar, HiOutlineArrowDownTray,
} from 'react-icons/hi2';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StatisticsData {
  monthlyRevenue: { month: string; revenue: number; transactions: number }[];
  appointmentStats: { status: string; count: number }[];
  patientDemographics: { age_group: string; count: number }[];
}

const fmtCurrency = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(n || 0);
const fmtMonth = (m: string) => { const [y, mo] = m.split('-'); return new Date(+y, +mo - 1).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }); };
const statusColors: Record<string, string> = { completed: 'bg-emerald-500', confirmed: 'bg-blue-500', pending: 'bg-yellow-500', cancelled: 'bg-red-500', no_show: 'bg-gray-400' };
const ageColors: Record<string, string> = { 'Under 18': 'bg-violet-500', '18-35': 'bg-blue-500', '36-55': 'bg-emerald-500', 'Over 55': 'bg-amber-500' };

const ChartTip = ({ active, payload, label }: any) => {
  if (active && payload?.length) return (
    <div className="bg-gray-900 text-white px-3 py-2 rounded-md text-xs shadow-lg">
      <p className="font-medium mb-1">{label}</p>
      {payload.map((p: any, i: number) => <p key={i} style={{ color: p.color }}>{p.name}: {fmtCurrency(p.value)}</p>)}
    </div>
  );
  return null;
};

const Statistic: React.FC = () => {
  const [stats, setStats] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('12months');

  useEffect(() => { fetchStats(); }, []);
  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/hospital-dashboard/statistics', {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (res.ok) { const data = await res.json(); setStats(data.data); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const totalRev = stats?.monthlyRevenue?.reduce((s, m) => s + m.revenue, 0) || 0;
  const totalTx = stats?.monthlyRevenue?.reduce((s, m) => s + m.transactions, 0) || 0;
  const totalAppt = stats?.appointmentStats?.reduce((s, a) => s + a.count, 0) || 0;
  const totalPat = stats?.patientDemographics?.reduce((s, d) => s + d.count, 0) || 0;
  const chartData = stats?.monthlyRevenue?.map(m => ({ month: fmtMonth(m.month), Revenue: m.revenue })) || [];

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div></div>;

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Statistics</h1>
          <p className="text-xs text-gray-500">Hospital performance analytics</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5">
            <HiOutlineChartBar className="w-3.5 h-3.5 text-gray-400" />
            <select value={period} onChange={e => setPeriod(e.target.value)}
              className="bg-transparent text-xs font-medium text-gray-600 outline-none cursor-pointer pr-1">
              <option value="12months">Last 12 Months</option><option value="6months">Last 6 Months</option><option value="3months">Last 3 Months</option>
            </select>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-md hover:bg-emerald-700">
            <HiOutlineArrowDownTray className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {([
          { label: 'Total Revenue', value: fmtCurrency(totalRev), sub: '+15.3%', icon: HiOutlineCurrencyDollar, accent: 'bg-emerald-500' },
          { label: 'Total Appointments', value: String(totalAppt), sub: '+8.2%', icon: HiOutlineCalendarDays, accent: 'bg-blue-500' },
          { label: 'Total Patients', value: String(totalPat), sub: '+12.1%', icon: HiOutlineUsers, accent: 'bg-violet-500' },
          { label: 'Avg Revenue/Mo', value: fmtCurrency(totalRev / (stats?.monthlyRevenue?.length || 1)), sub: '+5.7%', icon: HiOutlineChartBar, accent: 'bg-amber-500' },
        ] as const).map(s => (
          <div key={s.label} className="bg-white rounded-lg px-4 py-3.5 border border-gray-200 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${s.accent}`}>
              <s.icon className="w-[18px] h-[18px] text-white" />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 leading-none">{s.label}</p>
              <p className="text-lg font-bold text-gray-900 leading-tight mt-0.5">{s.value}</p>
              <p className="text-[10px] text-emerald-600 flex items-center gap-0.5"><HiOutlineArrowTrendingUp className="w-3 h-3" />{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} />
                <Bar dataKey="Revenue" fill="#10b981" radius={[3, 3, 0, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="h-48 flex items-center justify-center text-sm text-gray-400">No data</div>}
        </div>

        {/* Appointment Status */}
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Appointment Status</h3>
          <div className="space-y-3">
            {stats?.appointmentStats?.map(s => {
              const pct = totalAppt > 0 ? (s.count / totalAppt) * 100 : 0;
              return (
                <div key={s.status}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600 capitalize flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${statusColors[s.status] || 'bg-gray-400'}`}></span>
                      {s.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-semibold text-gray-900">{s.count} <span className="text-gray-400 font-normal">({pct.toFixed(1)}%)</span></span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${statusColors[s.status] || 'bg-gray-400'}`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Demographics */}
      <div className="bg-white rounded-lg p-5 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Patient Demographics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats?.patientDemographics?.map(d => {
            const pct = totalPat > 0 ? (d.count / totalPat) * 100 : 0;
            return (
              <div key={d.age_group} className="text-center">
                <div className={`w-12 h-12 rounded-md ${ageColors[d.age_group] || 'bg-gray-400'} mx-auto mb-2 flex items-center justify-center`}>
                  <span className="text-white font-bold text-sm">{d.count}</span>
                </div>
                <p className="text-xs font-medium text-gray-900">{d.age_group}</p>
                <p className="text-[10px] text-gray-400">{pct.toFixed(1)}%</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Key Insights</h3>
          <div className="space-y-2.5">
            {[
              { color: 'bg-emerald-500', title: 'Revenue Growth', desc: 'Monthly revenue increased by 15.3%' },
              { color: 'bg-blue-500', title: 'Patient Satisfaction', desc: 'Completion rate 85.2%, above average' },
              { color: 'bg-yellow-500', title: 'Peak Hours', desc: 'Most appointments 10 AM – 2 PM' },
            ].map(i => (
              <div key={i.title} className="flex items-start gap-2.5">
                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${i.color}`}></span>
                <div><p className="text-xs font-medium text-gray-900">{i.title}</p><p className="text-[11px] text-gray-500">{i.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Recommendations</h3>
          <div className="space-y-2">
            {[
              { bg: 'bg-blue-50', fg: 'text-blue-800', sub: 'text-blue-600', title: 'Optimize Scheduling', desc: 'Add more slots during peak hours' },
              { bg: 'bg-green-50', fg: 'text-green-800', sub: 'text-green-600', title: 'Revenue Opportunity', desc: 'Focus on high-margin services' },
              { bg: 'bg-amber-50', fg: 'text-amber-800', sub: 'text-amber-600', title: 'Patient Retention', desc: 'Implement follow-up programs' },
            ].map(r => (
              <div key={r.title} className={`p-3 rounded-md ${r.bg}`}>
                <p className={`text-xs font-medium ${r.fg}`}>{r.title}</p>
                <p className={`text-[11px] ${r.sub}`}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistic;
