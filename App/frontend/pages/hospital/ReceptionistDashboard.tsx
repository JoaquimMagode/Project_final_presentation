import React, { useState, useEffect } from 'react';
import { Home, Calendar, Users, HelpCircle, LogOut, UserCheck, Bell } from 'lucide-react';
import { useAuth } from '../../App';
import Appointments from './Appointments';
import Patients from './Patients';
import HelpCenter from './HelpCenter';

type Page = 'dashboard' | 'appointments' | 'patients' | 'help';

const NAV: { page: Page; icon: typeof Home; label: string }[] = [
  { page: 'dashboard',     icon: Home,       label: 'Home' },
  { page: 'appointments',  icon: Calendar,   label: 'Appointments' },
  { page: 'patients',      icon: Users,      label: 'Patients' },
  { page: 'help',          icon: HelpCircle, label: 'Help' },
];

const ReceptionistDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/hospital-dashboard/appointments?status=pending', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setPendingCount(data?.data?.appointments?.length || 0))
      .catch(() => {});
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-blue-800 flex flex-col">
        <div className="p-5 border-b border-blue-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <UserCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-blue-300 text-xs">Receptionist</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ page, icon: Icon, label }) => (
            <button
              key={page}
              onClick={() => setActivePage(page)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                activePage === page ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-700'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 text-left">{label}</span>
              {page === 'appointments' && pendingCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-blue-700">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-blue-100 hover:bg-blue-700 text-sm"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800 capitalize">{activePage === 'dashboard' ? 'Receptionist Dashboard' : activePage}</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">Receptionist / Front Desk</span>
          </div>
        </div>

        <div className="p-6">
          {activePage === 'dashboard' && (
            <div className="space-y-6">
              {/* Welcome */}
              <div className="bg-blue-700 rounded-2xl p-6 text-white">
                <p className="text-blue-200 text-sm">Welcome back 👋</p>
                <h1 className="text-2xl font-bold mt-1">{user?.name}</h1>
                <p className="text-blue-200 text-sm mt-1">Receptionist / Front Desk</p>
              </div>

              {/* Quick Access */}
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setActivePage('appointments')}
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="font-semibold text-gray-900">Appointments</p>
                  <p className="text-xs text-gray-500 mt-0.5">Schedule & manage appointments</p>
                  {pendingCount > 0 && (
                    <span className="mt-2 inline-block bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                      {pendingCount} pending
                    </span>
                  )}
                </button>
                <button onClick={() => setActivePage('patients')}
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-3">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="font-semibold text-gray-900">Patients</p>
                  <p className="text-xs text-gray-500 mt-0.5">Register & manage patients</p>
                </button>
              </div>

              {/* Permissions */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <p className="text-sm font-semibold text-gray-700 mb-3">Your Permissions</p>
                <ul className="space-y-2">
                  {['Schedule, reschedule, and cancel appointments', 'Register new patients', 'Manage patient check-in and check-out', 'Access to patient demographic data', 'Handle billing initiation'].map(p => (
                    <li key={p} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />{p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {activePage === 'appointments' && <Appointments />}
          {activePage === 'patients'     && <Patients />}
          {activePage === 'help'         && <HelpCenter />}
        </div>
      </main>
    </div>
  );
};

export default ReceptionistDashboard;
