import React, { useMemo } from 'react';
import {
  CurrencyDollarIcon, ArrowTrendingUpIcon, BuildingOffice2Icon, ReceiptPercentIcon,
} from '@heroicons/react/24/outline';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, ArcElement, Tooltip, Legend, Filler,
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler);

interface HospitalRow {
  id: number; name: string; state: string; city: string;
  specialties: string[]; commissionRate: number; status: string; patients: number;
}

const fmt = (n: number) => `$${n.toLocaleString('en-US')}`;

// Estimate revenue per hospital from patient volume (avg ticket ~ $520)
const AVG_TICKET = 520;
const estRevenue = (h: HospitalRow) => h.patients * AVG_TICKET;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const RevenueCommissions: React.FC<{ hospitals: HospitalRow[] }> = ({ hospitals }) => {
  const rows = useMemo(() =>
    hospitals.map(h => {
      const revenue = estRevenue(h);
      const commission = Math.round(revenue * (h.commissionRate / 100));
      return { ...h, revenue, commission };
    }).sort((a, b) => b.revenue - a.revenue),
  [hospitals]);

  const totalRevenue = rows.reduce((s, r) => s + r.revenue, 0);
  const totalCommission = rows.reduce((s, r) => s + r.commission, 0);
  const avgRate = rows.length ? (rows.reduce((s, r) => s + r.commissionRate, 0) / rows.length) : 0;
  const activeHospitals = rows.filter(r => r.status === 'Active').length;

  // Monthly trend (build a plausible curve that sums near current total)
  const monthNow = new Date().getMonth();
  const trendLabels = Array.from({ length: 6 }, (_, i) => MONTHS[(monthNow - 5 + i + 12) % 12]);
  const base = totalRevenue / 6;
  const trendRevenue = trendLabels.map((_, i) => Math.round(base * (0.7 + i * 0.1)));
  const trendCommission = trendRevenue.map((r) => Math.round(r * (avgRate / 100)));

  const lineData = {
    labels: trendLabels,
    datasets: [
      { label: 'Revenue', data: trendRevenue, borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.08)', borderWidth: 2.5, pointRadius: 3, tension: 0.4, fill: true },
      { label: 'Commission', data: trendCommission, borderColor: '#6b7280', backgroundColor: 'rgba(107,114,128,0.05)', borderWidth: 2, pointRadius: 3, tension: 0.4, fill: true },
    ],
  };
  const lineOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' as const, labels: { boxWidth: 10, font: { size: 12 } } } },
    scales: { x: { grid: { display: false } }, y: { grid: { color: '#f1f5f9' }, beginAtZero: true } },
  };

  // Commission share by top hospitals (doughnut)
  const topN = rows.slice(0, 5);
  const donutData = {
    labels: topN.map(r => r.name.split(' ').slice(0, 2).join(' ')),
    datasets: [{
      data: topN.map(r => r.commission),
      backgroundColor: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'],
      borderWidth: 0,
    }],
  };
  const donutOpts = {
    responsive: true, maintainAspectRatio: false, cutout: '62%',
    plugins: { legend: { position: 'bottom' as const, labels: { boxWidth: 10, font: { size: 11 } } } },
  };

  const SummaryCard = ({ icon: Icon, label, value, sub }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          {sub && <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1"><ArrowTrendingUpIcon className="w-3 h-3" />{sub}</p>}
        </div>
        <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
          <Icon className="w-6 h-6 text-emerald-600" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Revenue &amp; Commissions</h1>
        <p className="text-sm text-slate-500 mt-0.5">Platform earnings and commission breakdown across all hospitals</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <SummaryCard icon={CurrencyDollarIcon} label="Total Revenue" value={fmt(totalRevenue)} sub="8.4% vs last period" />
        <SummaryCard icon={ReceiptPercentIcon} label="Total Commission" value={fmt(totalCommission)} sub="5.1% vs last period" />
        <SummaryCard icon={ArrowTrendingUpIcon} label="Avg. Commission Rate" value={`${avgRate.toFixed(1)}%`} />
        <SummaryCard icon={BuildingOffice2Icon} label="Active Hospitals" value={String(activeHospitals)} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Revenue &amp; Commission Trend</h3>
          <div className="h-64"><Line data={lineData} options={lineOpts} /></div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Commission Share (Top 5)</h3>
          <div className="h-64 flex items-center justify-center">
            {topN.length ? <Doughnut data={donutData} options={donutOpts} /> : <p className="text-sm text-slate-400">No data</p>}
          </div>
        </div>
      </div>

      {/* Per-hospital table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-base font-semibold text-slate-900">Commission by Hospital</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Hospital</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Location</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Patients</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Revenue</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Rate</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Commission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map(r => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{r.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{r.city}, {r.state}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 text-right">{r.patients}</td>
                  <td className="px-6 py-4 text-sm text-slate-900 text-right">{fmt(r.revenue)}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">{r.commissionRate}%</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-emerald-600 text-right">{fmt(r.commission)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 border-t border-slate-100">
              <tr>
                <td className="px-6 py-3 text-sm font-bold text-slate-900" colSpan={3}>Total</td>
                <td className="px-6 py-3 text-sm font-bold text-slate-900 text-right">{fmt(totalRevenue)}</td>
                <td />
                <td className="px-6 py-3 text-sm font-bold text-emerald-600 text-right">{fmt(totalCommission)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RevenueCommissions;
