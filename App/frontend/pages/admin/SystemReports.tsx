import React, { useMemo } from 'react';
import {
  BuildingOffice2Icon, UsersIcon, CheckCircleIcon, ClockIcon,
} from '@heroicons/react/24/outline';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, Tooltip, Legend,
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

interface HospitalRow {
  id: number; name: string; state: string; city: string;
  specialties: string[]; commissionRate: number; status: string; patients: number;
}

const shortName = (n: string) => n.split(' ').slice(0, 2).join(' ');

const SystemReports: React.FC<{ hospitals: HospitalRow[] }> = ({ hospitals }) => {
  const totalPatients = hospitals.reduce((s, h) => s + h.patients, 0);

  // Hospitals by status
  const statusCounts = useMemo(() => {
    const m: Record<string, number> = {};
    hospitals.forEach(h => { m[h.status] = (m[h.status] || 0) + 1; });
    return m;
  }, [hospitals]);

  // Patients per hospital (bar)
  const patientsByHospital = useMemo(
    () => [...hospitals].sort((a, b) => b.patients - a.patients),
    [hospitals]
  );

  // Specialty distribution
  const specialtyCounts = useMemo(() => {
    const m: Record<string, number> = {};
    hospitals.forEach(h => h.specialties.forEach(s => { m[s] = (m[s] || 0) + 1; }));
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [hospitals]);

  // Patients by state
  const patientsByState = useMemo(() => {
    const m: Record<string, number> = {};
    hospitals.forEach(h => { m[h.state] = (m[h.state] || 0) + h.patients; });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [hospitals]);

  const barPatients = {
    labels: patientsByHospital.map(h => shortName(h.name)),
    datasets: [{ label: 'Patients', data: patientsByHospital.map(h => h.patients), backgroundColor: '#10b981', borderRadius: 6, maxBarThickness: 42 }],
  };
  const barState = {
    labels: patientsByState.map(([s]) => s),
    datasets: [{ label: 'Patients', data: patientsByState.map(([, v]) => v), backgroundColor: '#34d399', borderRadius: 6, maxBarThickness: 42 }],
  };
  const barOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { grid: { display: false }, ticks: { font: { size: 11 } } }, y: { grid: { color: '#f1f5f9' }, beginAtZero: true } },
  };

  const statusDonut = {
    labels: Object.keys(statusCounts),
    datasets: [{
      data: Object.values(statusCounts),
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#94a3b8'],
      borderWidth: 0,
    }],
  };
  const specialtyDonut = {
    labels: specialtyCounts.map(([s]) => s),
    datasets: [{
      data: specialtyCounts.map(([, v]) => v),
      backgroundColor: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#059669', '#047857', '#065f46', '#d1fae5'],
      borderWidth: 0,
    }],
  };
  const donutOpts = {
    responsive: true, maintainAspectRatio: false, cutout: '60%',
    plugins: { legend: { position: 'bottom' as const, labels: { boxWidth: 10, font: { size: 11 } } } },
  };

  const TONES: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
  };
  const StatCard = ({ icon: Icon, label, value, tone = 'emerald' }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${TONES[tone] || TONES.emerald}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">System Reports &amp; Analytics</h1>
        <p className="text-sm text-slate-500 mt-0.5">Platform-wide analysis across all hospitals</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard icon={BuildingOffice2Icon} label="Total Hospitals" value={hospitals.length} />
        <StatCard icon={CheckCircleIcon} label="Active" value={statusCounts['Active'] || 0} tone="green" />
        <StatCard icon={ClockIcon} label="Pending Approval" value={statusCounts['Pending Approval'] || 0} tone="amber" />
        <StatCard icon={UsersIcon} label="Total Patients" value={totalPatients} />
      </div>

      {/* Row 1: patients per hospital (bar) + status (donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Patients per Hospital</h3>
          <div className="h-64"><Bar data={barPatients} options={barOpts} /></div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Hospitals by Status</h3>
          <div className="h-64 flex items-center justify-center"><Doughnut data={statusDonut} options={donutOpts} /></div>
        </div>
      </div>

      {/* Row 2: patients by state (bar) + specialties (donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Patients by State</h3>
          <div className="h-64"><Bar data={barState} options={barOpts} /></div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Specialties Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            {specialtyCounts.length ? <Doughnut data={specialtyDonut} options={donutOpts} /> : <p className="text-sm text-slate-400">No data</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemReports;
