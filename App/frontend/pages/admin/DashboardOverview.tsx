import React, { useMemo } from 'react';
import {
  BuildingOffice2Icon, UsersIcon, CurrencyDollarIcon, CheckCircleIcon,
  ClockIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, ReceiptPercentIcon,
  MapPinIcon, HeartIcon,
} from '@heroicons/react/24/outline';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Tooltip, Legend, Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Tooltip, Legend, Filler,
);

interface HospitalRow {
  id: number; name: string; state: string; city: string;
  specialties: string[]; commissionRate: number; status: string; patients: number;
}

const AVG_TICKET = 520;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmt = (n: number) => `$${n.toLocaleString('en-US')}`;
const shortName = (n: string) => n.split(' ').slice(0, 2).join(' ');

const EMERALD = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5', '#047857', '#065f46'];

const DashboardOverview: React.FC<{ hospitals: HospitalRow[] }> = ({ hospitals }) => {
  /* ── Derived metrics ─────────────────────────────────────────── */
  const totalPatients = hospitals.reduce((s, h) => s + h.patients, 0);
  const totalRevenue = hospitals.reduce((s, h) => s + h.patients * AVG_TICKET, 0);
  const totalCommission = hospitals.reduce(
    (s, h) => s + Math.round(h.patients * AVG_TICKET * (h.commissionRate / 100)), 0);
  const activeHospitals = hospitals.filter(h => h.status === 'Active').length;
  const pendingApprovals = hospitals.filter(h => h.status === 'Pending Approval').length;
  const avgRate = hospitals.length
    ? (hospitals.reduce((s, h) => s + h.commissionRate, 0) / hospitals.length) : 0;

  // Status distribution
  const statusCounts = useMemo(() => {
    const m: Record<string, number> = {};
    hospitals.forEach(h => { m[h.status] = (m[h.status] || 0) + 1; });
    return m;
  }, [hospitals]);

  // Patients per hospital (top, descending)
  const topHospitals = useMemo(
    () => [...hospitals].sort((a, b) => b.patients - a.patients).slice(0, 6),
    [hospitals]);

  // Patients by state
  const patientsByState = useMemo(() => {
    const m: Record<string, number> = {};
    hospitals.forEach(h => { m[h.state] = (m[h.state] || 0) + h.patients; });
    return Object.entries(m).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
  }, [hospitals]);

  // Specialty distribution
  const specialtyCounts = useMemo(() => {
    const m: Record<string, number> = {};
    hospitals.forEach(h => h.specialties.forEach(s => { m[s] = (m[s] || 0) + 1; }));
    return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [hospitals]);

  // Revenue trend (6 months, plausible curve)
  const monthNow = new Date().getMonth();
  const trendLabels = Array.from({ length: 6 }, (_, i) => MONTHS[(monthNow - 5 + i + 12) % 12]);
  const base = totalRevenue / 6 || 1;
  const trendRevenue = trendLabels.map((_, i) => Math.round(base * (0.68 + i * 0.11)));
  const trendPatients = trendLabels.map((_, i) => Math.round((totalPatients / 6) * (0.7 + i * 0.1)));

  /* ── Chart datasets ──────────────────────────────────────────── */
  const revenueTrend = {
    labels: trendLabels,
    datasets: [{
      label: 'Revenue', data: trendRevenue,
      borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.12)',
      borderWidth: 2.5, pointRadius: 3, pointBackgroundColor: '#10b981', tension: 0.4, fill: true,
    }],
  };
  const revenueTrendOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (c: any) => ` ${fmt(c.parsed.y)}` } },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      y: { grid: { color: '#f1f5f9' }, beginAtZero: true, ticks: { callback: (v: any) => `$${(v / 1000)}k` } },
    },
  };

  const patientGrowth = {
    labels: trendLabels,
    datasets: [{
      label: 'New Patients', data: trendPatients,
      backgroundColor: '#10b981', borderRadius: 6, maxBarThickness: 38,
    }],
  };
  const barPatientsOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      y: { grid: { color: '#f1f5f9' }, beginAtZero: true },
    },
  };

  const topHospitalsBar = {
    labels: topHospitals.map(h => shortName(h.name)),
    datasets: [{
      label: 'Patients', data: topHospitals.map(h => h.patients),
      backgroundColor: '#34d399', borderRadius: 6, maxBarThickness: 42,
    }],
  };
  const horizBarOpts = {
    indexAxis: 'y' as const,
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: '#f1f5f9' }, beginAtZero: true },
      y: { grid: { display: false }, ticks: { font: { size: 11 } } },
    },
  };

  const statusPie = {
    labels: Object.keys(statusCounts),
    datasets: [{
      data: Object.values(statusCounts),
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#94a3b8'],
      borderWidth: 2, borderColor: '#fff',
    }],
  };
  const specialtyDonut = {
    labels: specialtyCounts.map(([s]) => s),
    datasets: [{
      data: specialtyCounts.map(([, v]) => v),
      backgroundColor: EMERALD, borderWidth: 2, borderColor: '#fff',
    }],
  };
  const stateDonut = {
    labels: patientsByState.slice(0, 6).map(([s]) => s),
    datasets: [{
      data: patientsByState.slice(0, 6).map(([, v]) => v),
      backgroundColor: EMERALD, borderWidth: 2, borderColor: '#fff',
    }],
  };
  const pieOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' as const, labels: { boxWidth: 10, font: { size: 11 }, padding: 12 } } },
  };
  const donutOpts = { ...pieOpts, cutout: '60%' };

  /* ── Small presentational helpers ────────────────────────────── */
  const StatCard = ({ icon: Icon, label, value, delta, up = true, tone = 'emerald' }: any) => {
    const tones: Record<string, string> = {
      emerald: 'bg-emerald-50 text-emerald-600',
      blue: 'bg-blue-50 text-blue-600',
      amber: 'bg-amber-50 text-amber-600',
      green: 'bg-green-50 text-green-600',
      violet: 'bg-violet-50 text-violet-600',
    };
    return (
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">{label}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            {delta && (
              <p className={`text-xs flex items-center gap-1 mt-1.5 ${up ? 'text-emerald-600' : 'text-red-500'}`}>
                {up ? <ArrowTrendingUpIcon className="w-3.5 h-3.5" /> : <ArrowTrendingDownIcon className="w-3.5 h-3.5" />}
                {delta}
              </p>
            )}
          </div>
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${tones[tone] || tones.emerald}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
    );
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending Approval': return 'bg-yellow-100 text-yellow-800';
      case 'Suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const maxPatients = Math.max(1, ...topHospitals.map(h => h.patients));

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-sm text-slate-500 mt-0.5">System-wide analytics across the IMAP Solution network</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-5">
        <StatCard icon={BuildingOffice2Icon} label="Total Hospitals" value={hospitals.length} delta="2 this month" tone="emerald" />
        <StatCard icon={CheckCircleIcon} label="Active" value={activeHospitals} delta="operational" tone="green" />
        <StatCard icon={UsersIcon} label="Total Patients" value={totalPatients.toLocaleString()} delta="12.5% growth" tone="blue" />
        <StatCard icon={CurrencyDollarIcon} label="Total Revenue" value={fmt(totalRevenue)} delta="8.4% vs last" tone="emerald" />
        <StatCard icon={ReceiptPercentIcon} label="Commission" value={fmt(totalCommission)} delta={`${avgRate.toFixed(1)}% avg rate`} tone="violet" />
        <StatCard icon={ClockIcon} label="Pending" value={pendingApprovals} delta="awaiting review" up={false} tone="amber" />
      </div>

      {/* Row 1: revenue trend (line) + hospital status (pie) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Revenue Trend</h3>
              <p className="text-xs text-slate-400">Last 6 months</p>
            </div>
            <span className="text-xs font-medium bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full">
              {fmt(totalRevenue)} total
            </span>
          </div>
          <div className="h-64"><Line data={revenueTrend} options={revenueTrendOpts} /></div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-base font-semibold text-slate-900 mb-1">Hospitals by Status</h3>
          <p className="text-xs text-slate-400 mb-3">Network distribution</p>
          <div className="h-60 flex items-center justify-center">
            <Pie data={statusPie} options={pieOpts} />
          </div>
        </div>
      </div>

      {/* Row 2: patient growth (bar) + top hospitals (horizontal bar) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-base font-semibold text-slate-900 mb-1">Monthly Patient Growth</h3>
          <p className="text-xs text-slate-400 mb-3">New patient intake trend</p>
          <div className="h-64"><Bar data={patientGrowth} options={barPatientsOpts} /></div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-base font-semibold text-slate-900 mb-1">Top Hospitals by Patients</h3>
          <p className="text-xs text-slate-400 mb-3">Highest volume partners</p>
          <div className="h-64"><Bar data={topHospitalsBar} options={horizBarOpts} /></div>
        </div>
      </div>

      {/* Row 3: specialties (donut) + patients by state (donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <HeartIcon className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-semibold text-slate-900">Specialties Distribution</h3>
          </div>
          <div className="h-64 flex items-center justify-center">
            {specialtyCounts.length ? <Doughnut data={specialtyDonut} options={donutOpts} /> : <p className="text-sm text-slate-400">No data</p>}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <MapPinIcon className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-semibold text-slate-900">Patients by State</h3>
          </div>
          <div className="h-64 flex items-center justify-center">
            {patientsByState.length ? <Doughnut data={stateDonut} options={donutOpts} /> : <p className="text-sm text-slate-400">No data</p>}
          </div>
        </div>
      </div>

      {/* Row 4: hospital performance table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Hospital Performance</h3>
            <p className="text-xs text-slate-400 mt-0.5">Patient volume, revenue and commission by partner</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Hospital</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase w-48">Patient Volume</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Revenue</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Commission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[...hospitals].sort((a, b) => b.patients - a.patients).map(h => {
                const rev = h.patients * AVG_TICKET;
                const comm = Math.round(rev * (h.commissionRate / 100));
                return (
                  <tr key={h.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{h.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{h.city}, {h.state}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusBadge(h.status)}`}>{h.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(h.patients / maxPatients) * 100}%` }} />
                        </div>
                        <span className="text-xs text-slate-500 w-8 text-right">{h.patients}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900 text-right">{fmt(rev)}</td>
                    <td className="px-6 py-4 text-sm font-bold text-emerald-600 text-right">{fmt(comm)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-slate-50 border-t border-slate-100">
              <tr>
                <td className="px-6 py-3 text-sm font-bold text-slate-900" colSpan={4}>Total</td>
                <td className="px-6 py-3 text-sm font-bold text-slate-900 text-right">{fmt(totalRevenue)}</td>
                <td className="px-6 py-3 text-sm font-bold text-emerald-600 text-right">{fmt(totalCommission)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
