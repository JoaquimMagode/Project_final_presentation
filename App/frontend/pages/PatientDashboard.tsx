import React, { useState, useEffect } from 'react';
import {
  Home, Calendar, FileText,
  HelpCircle, Phone, Upload, ChevronRight,
  CheckCircle, Clock, AlertCircle, CreditCard, Building2, MapPin
} from 'lucide-react';
import { useAuth } from '../App';
import PatientRegistration from './patient/PatientRegistration';
import MedicalReports from './patient/MedicalReports';
import AppointmentRequests from './patient/AppointmentRequests';
import PatientSettings from './patient/PatientSettings';
import PatientHelp from './patient/PatientHelp';
import Billing from './patient/Billing';

type Page = 'dashboard' | 'registration' | 'reports' | 'appointments' | 'billing' | 'settings' | 'help';

const NAV = [
  { page: 'dashboard' as Page,     icon: Home,        label: 'Home' },
  { page: 'appointments' as Page,  icon: Calendar,    label: 'Appointments' },
  { page: 'billing' as Page,       icon: CreditCard,  label: 'Records & Billing' },
  { page: 'reports' as Page,       icon: FileText,    label: 'My Reports' },
  { page: 'help' as Page,          icon: HelpCircle,  label: 'Help' },
];

const QUICK_ACTIONS = [
  { page: 'appointments' as Page, icon: Calendar,  label: 'My Appointments',    desc: 'View or book appointments',   color: 'bg-blue-50 text-blue-600' },
  { page: 'reports' as Page,      icon: FileText,  label: 'Medical Reports',    desc: 'View your test results',      color: 'bg-violet-50 text-violet-600' },
  { page: 'billing' as Page,      icon: Upload,    label: 'Records & Billing',  desc: 'View billing history',        color: 'bg-orange-50 text-orange-600' },
];

const STATUS_CONFIG: Record<string, { color: string; icon: React.FC<any> }> = {
  confirmed: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle },
  pending:   { color: 'bg-amber-50 text-amber-700 border-amber-200',       icon: Clock },
  cancelled: { color: 'bg-red-50 text-red-600 border-red-200',             icon: AlertCircle },
  completed: { color: 'bg-blue-50 text-blue-700 border-blue-200',          icon: CheckCircle },
};

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [stats, setStats] = useState({ pending: 0, confirmed: 0, completed: 0 });

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/appointments', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        const all = data?.data?.appointments || [];
        const pending   = all.filter((a: any) => a.status === 'pending').length;
        const confirmed = all.filter((a: any) => a.status === 'confirmed').length;
        const completed = all.filter((a: any) => a.status === 'completed').length;
        setAppointmentCount(pending);
        setStats({ pending, confirmed, completed });
        const upcoming = all
          .filter((a: any) => ['pending', 'confirmed'].includes(a.status))
          .slice(0, 3);
        setUpcomingAppointments(upcoming);
      })
      .catch(() => {});
  }, []);

  const firstName = user?.name?.split(' ')[0] ?? 'Patient';

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ── Sidebar ── */}
      <aside className={`hidden md:flex flex-col ${sidebarOpen ? 'w-56' : 'w-16'} bg-white border-r border-gray-100 py-6 px-3 gap-1 transition-all duration-300 relative flex-shrink-0`}>
        {/* Toggle button */}
        <button
          onClick={() => setSidebarOpen(o => !o)}
          className="absolute -right-3 top-6 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors z-10"
        >
          <ChevronRight className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-300 ${sidebarOpen ? 'rotate-180' : ''}`} />
        </button>

        {NAV.map(({ page, icon: Icon, label }) => (
          <div key={page} className="relative group">
            <button
              onClick={() => setActivePage(page)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors w-full text-left
                ${activePage === page
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="flex-1">{label}</span>}
              {sidebarOpen && page === 'appointments' && appointmentCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {appointmentCount}
                </span>
              )}
              {!sidebarOpen && page === 'appointments' && appointmentCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            {/* Tooltip when collapsed */}
            {!sidebarOpen && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50">
                {label}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
              </div>
            )}
          </div>
        ))}
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-auto">

        {/* ── Bottom nav (mobile) ── */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 flex justify-around py-2">
          {NAV.slice(0, 5).map(({ page, icon: Icon, label }) => (
            <button
              key={page}
              onClick={() => setActivePage(page)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-xs relative
                ${activePage === page ? 'text-emerald-600' : 'text-gray-500'}`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {page === 'appointments' && appointmentCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-0.5">
                    {appointmentCount}
                  </span>
                )}
              </div>
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 md:p-8 pb-24 md:pb-8">

          {/* ── Dashboard Home ── */}
          {activePage === 'dashboard' && (
            <div className="max-w-3xl space-y-6">

              {/* Greeting */}
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl p-6 text-white">
                <p className="text-emerald-100 text-sm mb-1">Welcome back 👋</p>
                <h1 className="text-2xl font-bold">{firstName}</h1>
                <p className="text-emerald-100 text-sm mt-1">Here's your health overview</p>
              </div>

              {/* Stats Strip */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Pending',   value: stats.pending,   color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-100' },
                  { label: 'Confirmed', value: stats.confirmed, color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-100' },
                  { label: 'Completed', value: stats.completed, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                ].map(({ label, value, color, bg, border }) => (
                  <div key={label} className={`${bg} border ${border} rounded-xl p-4 text-center`}>
                    <p className={`text-2xl font-black ${color}`}>{value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <section>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Actions</h2>
                <div className="grid grid-cols-3 gap-3">
                  {QUICK_ACTIONS.map(({ page, icon: Icon, label, desc, color }) => (
                    <button
                      key={page}
                      onClick={() => setActivePage(page)}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left flex flex-col gap-3"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Upcoming Appointments */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Upcoming Appointments</h2>
                  <button
                    onClick={() => setActivePage('appointments')}
                    className="text-emerald-600 text-sm font-medium flex items-center gap-1 hover:underline"
                  >
                    See all <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {upcomingAppointments.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-gray-200">
                    <Calendar className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm text-gray-400 mb-3">No upcoming appointments</p>
                    <button
                      onClick={() => setActivePage('appointments')}
                      className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Book Appointment
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingAppointments.map((apt: any, i: number) => {
                      const cfg = STATUS_CONFIG[apt.status] || STATUS_CONFIG.pending;
                      const Icon = cfg.icon;
                      return (
                        <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                          <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm truncate">{apt.hospital_name}</p>
                            <p className="text-xs text-gray-500 truncate">{apt.reason}</p>
                            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />{apt.hospital_city}
                              <span className="mx-1">·</span>
                              <Clock className="w-3 h-3" />
                              {new Date(apt.appointment_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </p>
                          </div>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border flex-shrink-0 ${cfg.color}`}>
                            <Icon className="w-3 h-3" />
                            {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Need Help */}
              <button
                onClick={() => setActivePage('help')}
                className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Phone className="w-5 h-5 text-gray-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 text-sm">Need Help?</p>
                  <p className="text-xs text-gray-400">Contact our support team anytime</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
              </button>

            </div>
          )}

          {activePage === 'registration' && <PatientRegistration />}
          {activePage === 'reports'      && <MedicalReports />}
          {activePage === 'appointments' && <AppointmentRequests />}
          {activePage === 'billing'      && <Billing />}
          {activePage === 'settings'     && <PatientSettings />}
          {activePage === 'help'         && <PatientHelp />}

        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
