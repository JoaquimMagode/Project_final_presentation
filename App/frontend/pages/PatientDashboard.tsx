import React, { useState, useEffect, useRef } from 'react';
import {
  Home, Calendar, FileText,
  HelpCircle, Phone, Upload, ChevronRight,
  CheckCircle, Clock, AlertCircle, CreditCard, Building2, MapPin,
  Menu, Search, Bell, Globe, ChevronDown, LogOut, User, AlertTriangle, Hospital
} from 'lucide-react';
import { useAuth, useLang } from '../App';
import { LANGUAGES } from '../constants';
import { Language } from '../types';
import { useNavigate } from 'react-router-dom';
import PatientRegistration from './patient/PatientRegistration';
import MedicalReports from './patient/MedicalReports';
import AppointmentRequests from './patient/AppointmentRequests';
import PatientSettings from './patient/PatientSettings';
import PatientHelp from './patient/PatientHelp';
import Billing from './patient/Billing';
import FindHospitals from './patient/FindHospitals';

type Page = 'dashboard' | 'registration' | 'reports' | 'appointments' | 'billing' | 'settings' | 'help' | 'find-hospitals';

const NAV = [
  { page: 'dashboard' as Page,       icon: Home,        label: 'Dashboard' },
  { page: 'appointments' as Page,    icon: Calendar,    label: 'Appointments' },
  { page: 'billing' as Page,         icon: CreditCard,  label: 'Records & Billing' },
  { page: 'reports' as Page,         icon: FileText,    label: 'My Reports' },
  { page: 'help' as Page,            icon: HelpCircle,  label: 'Help' },
];

const QUICK_ACTIONS = [
  { page: 'appointments' as Page,   icon: Calendar,  label: 'My Appointments',    desc: 'View or book appointments',   color: 'bg-blue-50 text-blue-600' },
  { page: 'find-hospitals' as Page, icon: Hospital,  label: 'Find Hospitals',     desc: 'Search & book hospitals',     color: 'bg-emerald-50 text-emerald-600' },
  { page: 'reports' as Page,        icon: FileText,  label: 'Medical Reports',    desc: 'View your test results',      color: 'bg-violet-50 text-violet-600' },
  { page: 'billing' as Page,        icon: Upload,    label: 'Records & Billing',  desc: 'View billing history',        color: 'bg-orange-50 text-orange-600' },
];

const STATUS_CONFIG: Record<string, { color: string; icon: React.FC<any> }> = {
  confirmed: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle },
  pending:   { color: 'bg-amber-50 text-amber-700 border-amber-200',       icon: Clock },
  cancelled: { color: 'bg-red-50 text-red-600 border-red-200',             icon: AlertCircle },
  completed: { color: 'bg-blue-50 text-blue-700 border-blue-200',          icon: CheckCircle },
};

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'Appointment confirmed', desc: 'Your appointment at Apollo Mumbai is confirmed', time: '5 min ago', unread: true },
  { id: 2, title: 'Report ready', desc: 'Your lab results are now available', time: '1 hr ago', unread: true },
  { id: 3, title: 'Reminder', desc: 'Appointment tomorrow at 10:00 AM', time: '3 hr ago', unread: false },
];

// ── Patient Dashboard Header ──────────────────────────────────────────────────
const PatientHeader: React.FC<{
  user: { name: string } | null;
  logout: () => void;
  navigate: (path: string) => void;
  appointmentCount: number;
  setActivePage: (page: Page) => void;
}> = ({ user, logout, navigate, appointmentCount, setActivePage }) => {
  const { lang, setLang } = useLang();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen]     = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef   = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => n.unread).length + appointmentCount;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (notifRef.current   && !notifRef.current.contains(e.target as Node))   setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, unread: false })));

  return (
    <header className="hidden md:flex items-center justify-between h-[73px] px-6 bg-white border-b border-gray-100 flex-shrink-0 gap-4">
      {/* Search */}
      <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex-1">
        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <input type="text" placeholder="Search appointments, reports..." className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder-gray-400" />
      </div>

      <div className="flex items-center gap-3">
        {/* Find Hospitals */}
        <button
          onClick={() => setActivePage('find-hospitals')}
          className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors flex-shrink-0"
        >
          <Hospital className="w-4 h-4" />
          Find Hospitals
        </button>

        {/* Language */}
        <div className="flex items-center gap-1.5 text-gray-600">
          <Globe className="w-4 h-4" />
          <select
            value={lang}
            onChange={e => setLang(e.target.value as Language)}
            className="text-sm bg-transparent border-none outline-none cursor-pointer text-gray-700 font-medium"
          >
            {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.code}</option>)}
          </select>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); }}
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="font-semibold text-gray-900 text-sm">Notifications</span>
                <button onClick={markAllRead} className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">Mark all read</button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {appointmentCount > 0 && (
                  <button
                    onClick={() => { setActivePage('appointments'); setNotifOpen(false); }}
                    className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 text-left border-b border-gray-50"
                  >
                    <span className="w-2 h-2 mt-1.5 rounded-full bg-red-500 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{appointmentCount} pending appointment{appointmentCount > 1 ? 's' : ''}</div>
                      <div className="text-xs text-gray-500">Tap to review</div>
                    </div>
                  </button>
                )}
                {notifications.map(n => (
                  <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0">
                    <span className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${n.unread ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{n.title}</div>
                      <div className="text-xs text-gray-500 truncate">{n.desc}</div>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); }}
            className="flex items-center gap-2.5 pl-3 border-l border-gray-200 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
              {(user?.name || 'P').charAt(0).toUpperCase()}
            </div>
            <div className="leading-tight text-left">
              <div className="text-sm font-semibold text-gray-900">{user?.name || 'Patient'}</div>
              <div className="text-xs text-gray-500">Patient</div>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-50">
              <div className="px-4 py-2.5 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-semibold">
                    {(user?.name || 'P').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900 truncate max-w-[130px]">{user?.name || 'Patient'}</div>
                    <div className="text-xs text-gray-500">Patient</div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => { setActivePage('settings'); setProfileOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <User className="w-4 h-4 text-gray-500" />
                Profile Settings
              </button>
              <button
                onClick={() => { setActivePage('help'); setProfileOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-gray-500" />
                FAQ
              </button>
              <button
                onClick={() => setProfileOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <AlertTriangle className="w-4 h-4" />
                Report Emergency
              </button>
              <div className="border-t border-gray-100 mt-1" />
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <LogOut className="w-4 h-4 text-gray-500" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
// ─────────────────────────────────────────────────────────────────────────────

const PatientDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [stats, setStats] = useState({ pending: 0, confirmed: 0, completed: 0 });
  const [patientProfile, setPatientProfile] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Fetch appointments
    fetch('http://localhost:5000/api/patients/appointments', {
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
        setUpcomingAppointments(all.filter((a: any) => ['pending', 'confirmed'].includes(a.status)).slice(0, 3));
      })
      .catch(() => {});

    // Fetch patient profile so we have the real DB record (id, member since, etc.)
    fetch('http://localhost:5000/api/patients/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        if (data?.success) setPatientProfile(data.data.patient);
      })
      .catch(() => {});
  }, []);

  const firstName = (patientProfile?.name ?? user?.name)?.split(' ')[0] ?? 'Patient';

  return (
    <div className="flex h-screen bg-gray-50">

      {/* ── Sidebar ── */}
      <aside className={`hidden md:flex flex-col ${sidebarOpen ? 'w-56' : 'w-16'} bg-white border-r border-gray-100 transition-all duration-300 flex-shrink-0`}>
        {/* Logo bar */}
        <div className={`flex items-center border-b border-gray-100 h-[73px] px-3 flex-shrink-0 ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
          {sidebarOpen && (
            <div className="flex items-center gap-2 min-w-0">
              <div className="bg-emerald-600 p-1.5 rounded-lg flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="font-bold text-sm text-gray-900 truncate">IMAP Solution</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <Menu className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 px-3">
          {NAV.map(({ page, icon: Icon, label }) => (
            <div key={page} className="relative group mb-1">
              <button
                onClick={() => setActivePage(page)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors w-full text-left
                  ${activePage === page ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}
                  ${!sidebarOpen ? 'justify-center' : ''}`}
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
              {!sidebarOpen && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50">
                  {label}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100">
          <span className="font-semibold text-gray-900 text-sm">Patient Dashboard</span>
        </div>

        {/* Dashboard Header */}
        <PatientHeader
          user={user}
          logout={logout}
          navigate={navigate}
          appointmentCount={appointmentCount}
          setActivePage={setActivePage}
        />

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8 pb-24 md:pb-8">

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

          {/* ── Dashboard Home ── */}
          {activePage === 'dashboard' && (
            <div className="space-y-6">

              {/* Greeting */}
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl p-6 text-white">
                <p className="text-emerald-100 text-sm mb-1">Welcome back 👋</p>
                <h1 className="text-2xl font-bold">{firstName}</h1>
                <p className="text-emerald-100 text-sm mt-1">
                  {patientProfile?.email || user?.name ? (
                    <>Patient ID: <span className="font-semibold">PT-{String(patientProfile?.id ?? '').padStart(6, '0')}</span></>
                  ) : 'Here\'s your health overview'}
                </p>
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

          {activePage === 'registration'   && <PatientRegistration />}
          {activePage === 'reports'         && <MedicalReports />}
          {activePage === 'appointments'    && <AppointmentRequests />}
          {activePage === 'find-hospitals'  && <FindHospitals />}
          {activePage === 'billing'         && <Billing />}
          {activePage === 'settings'        && <PatientSettings />}
          {activePage === 'help'            && <PatientHelp />}

        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;
