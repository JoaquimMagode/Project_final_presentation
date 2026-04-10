import React, { useState, useEffect } from 'react';
import {
  HiOutlineSignal, HiOutlineCalendarDays, HiOutlineUser, HiOutlineCreditCard,
  HiOutlineClock, HiOutlineArrowPath,
} from 'react-icons/hi2';

interface ActivityLog { type: string; reference_id: number; description: string; activity_date: string; patient_name: string; }

const iconMap: Record<string, any> = { appointment: HiOutlineCalendarDays, payment: HiOutlineCreditCard };
const colorMap: Record<string, string> = { appointment: 'bg-blue-50 text-blue-600', payment: 'bg-green-50 text-green-600' };

const relTime = (d: string) => {
  const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
  if (mins < 10080) return `${Math.floor(mins / 1440)}d ago`;
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const ActivityPage: React.FC = () => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => { fetchActivities(); }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/hospital-dashboard/activity', {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (res.ok) { const data = await res.json(); setActivities(data.data.activities); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const filtered = typeFilter ? activities.filter(a => a.type === typeFilter) : activities;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayCount = activities.filter(a => new Date(a.activity_date) >= today).length;
  const apptCount = activities.filter(a => a.type === 'appointment').length;
  const payCount = activities.filter(a => a.type === 'payment').length;

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div></div>;

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Activity Log</h1>
          <p className="text-xs text-gray-500">Track all hospital activities and events</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5">
            <HiOutlineSignal className="w-3.5 h-3.5 text-gray-400" />
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
              className="bg-transparent text-xs font-medium text-gray-600 outline-none cursor-pointer pr-1">
              <option value="">All Activities</option>
              <option value="appointment">Appointments</option>
              <option value="payment">Payments</option>
            </select>
          </div>
          <button onClick={fetchActivities}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-md hover:bg-emerald-700">
            <HiOutlineArrowPath className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {([
          { label: 'Total Activities', value: activities.length, accent: 'bg-slate-500' },
          { label: "Today's Activities", value: todayCount, accent: 'bg-blue-500' },
          { label: 'Appointments', value: apptCount, accent: 'bg-violet-500' },
          { label: 'Payments', value: payCount, accent: 'bg-emerald-500' },
        ] as const).map(s => (
          <div key={s.label} className="bg-white rounded-lg px-4 py-3.5 border border-gray-200 flex items-center gap-3">
            <div className={`w-2 h-8 rounded-full ${s.accent}`}></div>
            <div>
              <p className="text-[11px] text-gray-500">{s.label}</p>
              <p className="text-lg font-bold text-gray-900 leading-tight">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Recent Activities</h3>
          <span className="text-[10px] text-gray-400 flex items-center gap-1"><HiOutlineClock className="w-3 h-3" /> Real-time</span>
        </div>
        <div className="p-5">
          {filtered.length > 0 ? (
            <div className="space-y-3">
              {filtered.map((a, i) => {
                const Icon = iconMap[a.type] || HiOutlineSignal;
                const color = colorMap[a.type] || 'bg-gray-100 text-gray-600';
                return (
                  <div key={`${a.type}-${a.reference_id}-${i}`} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-gray-900 truncate">{a.description}</p>
                        <span className="text-[10px] text-gray-400 shrink-0 ml-2">{relTime(a.activity_date)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <HiOutlineUser className="w-3 h-3 text-gray-400" />
                        <span className="text-[11px] text-gray-500">{a.patient_name}</span>
                        <span className="text-[11px] text-gray-300">·</span>
                        <span className="text-[11px] text-gray-400 capitalize">{a.type}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <HiOutlineSignal className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No activities found</p>
              {typeFilter && <button onClick={() => setTypeFilter('')} className="mt-1 text-xs text-emerald-600 hover:text-emerald-700 font-medium">Clear filter</button>}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Activity Types</h3>
          <div className="space-y-2">
            {[{ label: 'Appointments', value: apptCount, color: 'bg-blue-500' }, { label: 'Payments', value: payCount, color: 'bg-emerald-500' }].map(t => (
              <div key={t.label} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs text-gray-600"><span className={`w-2 h-2 rounded-full ${t.color}`}></span>{t.label}</span>
                <span className="text-xs font-semibold text-gray-900">{t.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
          <div className="space-y-1">
            {['Export activity log', 'Filter by date range', 'Set up notifications'].map(a => (
              <button key={a} className="w-full text-left px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 rounded-md">{a}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;
