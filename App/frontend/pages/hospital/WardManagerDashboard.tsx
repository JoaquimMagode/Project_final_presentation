import React, { useState, useEffect } from 'react';
import { Home, Bed, Users, Activity, HelpCircle, LogOut, TrendingUp } from 'lucide-react';
import { useAuth } from '../../App';
import Patients from './Patients';
import ActivityPage from './Activity';
import HelpCenter from './HelpCenter';

type Page = 'dashboard' | 'patients' | 'activity' | 'help';

const NAV: { page: Page; icon: typeof Home; label: string }[] = [
  { page: 'dashboard', icon: Home,     label: 'Home' },
  { page: 'patients',  icon: Users,    label: 'Patient Admissions' },
  { page: 'activity',  icon: Activity, label: 'Ward Activity' },
  { page: 'help',      icon: HelpCircle, label: 'Help' },
];

const WardManagerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/hospital-dashboard/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setStats(data?.data))
      .catch(() => {});
  }, []);

  const bedData = [
    { label: 'General Ward', total: 80, occupied: 62, color: 'bg-blue-500' },
    { label: 'Private Rooms', total: 40, occupied: 28, color: 'bg-purple-500' },
    { label: 'ICU', total: 20, occupied: 14, color: 'bg-red-500' },
    { label: 'Emergency', total: 15, occupied: 8, color: 'bg-orange-500' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-orange-800 flex flex-col">
        <div className="p-5 border-b border-orange-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
              <Bed className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-orange-300 text-xs">Ward Manager</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ page, icon: Icon, label }) => (
            <button
              key={page}
              onClick={() => setActivePage(page)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                activePage === page ? 'bg-orange-700 text-white' : 'text-orange-100 hover:bg-orange-700'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-left">{label}</span>
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-orange-700">
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-orange-100 hover:bg-orange-700 text-sm">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">{activePage === 'dashboard' ? 'Ward Manager Dashboard' : activePage}</h2>
          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">Ward Manager / Bed Manager</span>
        </div>

        <div className="p-6">
          {activePage === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-orange-700 rounded-2xl p-6 text-white">
                <p className="text-orange-200 text-sm">Welcome back 👋</p>
                <h1 className="text-2xl font-bold mt-1">{user?.name}</h1>
                <p className="text-orange-200 text-sm mt-1">Ward Manager / Bed Manager</p>
              </div>

              {/* Bed Occupancy */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <p className="text-base font-semibold text-gray-900 mb-4">Bed Occupancy Overview</p>
                <div className="grid grid-cols-2 gap-4">
                  {bedData.map(({ label, total, occupied, color }) => {
                    const pct = Math.round((occupied / total) * 100);
                    return (
                      <div key={label} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-700">{label}</span>
                          <span className="text-gray-500">{occupied}/{total}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                        </div>
                        <p className="text-xs text-gray-400">{pct}% occupied</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Access */}
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setActivePage('patients')}
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mb-3">
                    <Users className="w-5 h-5 text-orange-600" />
                  </div>
                  <p className="font-semibold text-gray-900">Patient Admissions</p>
                  <p className="text-xs text-gray-500 mt-0.5">Track admissions & discharges</p>
                </button>
                <button onClick={() => setActivePage('activity')}
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                    <Activity className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="font-semibold text-gray-900">Ward Activity</p>
                  <p className="text-xs text-gray-500 mt-0.5">Monitor ward operations</p>
                </button>
              </div>

              {/* Permissions */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <p className="text-sm font-semibold text-gray-700 mb-3">Your Permissions</p>
                <ul className="space-y-2">
                  {['Access to bed and ward management modules', 'Manage bed allocation and availability', 'Track patient admissions, transfers, and discharges', 'Coordinate with nursing staff'].map(p => (
                    <li key={p} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0" />{p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {activePage === 'patients'  && <Patients />}
          {activePage === 'activity'  && <ActivityPage />}
          {activePage === 'help'      && <HelpCenter />}
        </div>
      </main>
    </div>
  );
};

export default WardManagerDashboard;
