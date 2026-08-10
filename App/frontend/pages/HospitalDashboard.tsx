import React, { useState, useEffect, useRef } from 'react';
import {
  MagnifyingGlassIcon, BellIcon, UserIcon, CalendarIcon, PhoneIcon, UsersIcon,
  BoltIcon as ActivityIcon,
  ArrowTrendingUpIcon, ArrowTrendingDownIcon, EllipsisHorizontalIcon, QuestionMarkCircleIcon,
  ChartBarIcon, Squares2X2Icon, DocumentTextIcon, CreditCardIcon, UserPlusIcon,
  ClockIcon, CurrencyDollarIcon, EyeIcon, ChevronDownIcon, ArrowRightOnRectangleIcon,
  ExclamationTriangleIcon, GlobeAltIcon
} from '@heroicons/react/24/outline';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);
import { useAuth, useLang } from '../App';
import { useNavigate } from 'react-router-dom';
import UserAvatar from '../components/UserAvatar';
import { LANGUAGES } from '../constants';
import { Language } from '../types';

// ── Dashboard Header ──────────────────────────────────────────────────────────
const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'New appointment request', desc: 'Patient John Doe – Cardiology', time: '2 min ago', unread: true },
  { id: 2, title: 'Appointment confirmed', desc: 'Dr. Smith confirmed slot at 10:00', time: '15 min ago', unread: true },
  { id: 3, title: 'Payment received', desc: '₹12,500 from patient #4821', time: '1 hr ago', unread: false },
  { id: 4, title: 'Report uploaded', desc: 'Lab report for patient #3310', time: '3 hr ago', unread: false },
];

const DashboardHeader: React.FC<{
  user: { name: string } | null;
  logout: () => void;
  navigate: (path: string) => void;
  pendingCount: number;
  setActivePage: (page: string) => void;
}> = ({ user, logout, navigate, pendingCount, setActivePage }) => {
  const { lang, setLang } = useLang();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen]   = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef   = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => n.unread).length + pendingCount;

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
        <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <input type="text" placeholder="Search patients, appointments..." className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder-gray-400" />
      </div>

      <div className="flex items-center gap-3">
        {/* Language */}
        <div className="flex items-center gap-1.5 text-gray-600">
          <GlobeAltIcon className="w-4 h-4" />
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
            <BellIcon className="w-5 h-5 text-gray-600" />
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
                {pendingCount > 0 && (
                  <button
                    onClick={() => { setActivePage('appointments'); setNotifOpen(false); }}
                    className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 text-left border-b border-gray-50"
                  >
                    <span className="w-2 h-2 mt-1.5 rounded-full bg-red-500 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{pendingCount} pending appointment{pendingCount > 1 ? 's' : ''}</div>
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
              {(user?.name || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="leading-tight text-left">
              <div className="text-sm font-semibold text-gray-900">{user?.name || 'Admin'}</div>
              <div className="text-xs text-gray-500">Hospital Admin</div>
            </div>
            <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-50">
              <div className="px-4 py-2.5 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white font-semibold">
                    {(user?.name || 'A').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900 truncate max-w-[130px]">{user?.name || 'Admin'}</div>
                    <div className="text-xs text-gray-500">Hospital Admin</div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => { setActivePage('profile'); setProfileOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <UserIcon className="w-4 h-4 text-gray-500" />
                Profile Settings
              </button>
              <button
                onClick={() => { setActivePage('help'); setProfileOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <QuestionMarkCircleIcon className="w-4 h-4 text-gray-500" />
                FAQ
              </button>
              <button
                onClick={() => setProfileOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <ExclamationTriangleIcon className="w-4 h-4" />
                Report Emergency
              </button>
              <div className="border-t border-gray-100 mt-1" />
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4 text-gray-500" />
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

// Import hospital pages
import Patients from './hospital/Patients';
import Appointments from './hospital/Appointments';
import Payments from './hospital/Payments';
import Employee from './hospital/Employee';
import ActivityPage from './hospital/Activity';
import Statistic from './hospital/Statistic';
import HelpCenter from './hospital/HelpCenter';
import Report from './hospital/Report';
import HospitalProfile from './hospital/HospitalProfile';
import ReceptionistDashboard from './hospital/ReceptionistDashboard';
import AccountantDashboard from './hospital/AccountantDashboard';
import WardManagerDashboard from './hospital/WardManagerDashboard';

const HospitalDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  // Check if logged-in user is an employee with a specific role
  const employeeRole = localStorage.getItem('employee_role');
  if (employeeRole === 'Receptionist') return <ReceptionistDashboard />;
  if (employeeRole === 'Accountant')   return <AccountantDashboard />;
  if (employeeRole === 'Ward Manager') return <WardManagerDashboard />;
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('Week');
  const [activePage, setActivePage] = useState('dashboard');
  const [appointmentFilter, setAppointmentFilter] = useState('');
  const [appointmentsDropdownOpen, setAppointmentsDropdownOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [hospitalInfo, setHospitalInfo]     = useState<any>(null);
  const [chartData, setChartData]           = useState<any>(null);
  const [todaySchedule, setTodaySchedule]   = useState<any[]>([]);
  const [recentReports, setRecentReports]   = useState<any[]>([]);
  const [loading, setLoading]               = useState(true);
  const [chartLoading, setChartLoading]     = useState(true);
  const [pendingCount, setPendingCount]     = useState(0);

  useEffect(() => {
    const handleNavigatePage = (e: Event) => {
      const page = (e as CustomEvent).detail;
      if (page) setActivePage(page);
    };
    
    window.addEventListener('navigateHospitalPage', handleNavigatePage);
    
    return () => {
      window.removeEventListener('navigateHospitalPage', handleNavigatePage);
    };
  }, []);

  const fetchPendingCount = () => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/hospital-dashboard/appointments?status=pending', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setPendingCount(data?.data?.appointments?.length || 0))
      .catch(() => {});
  };

  useEffect(() => {
    fetchPendingCount();
  }, []);

  useEffect(() => {
    if (activePage === 'dashboard') {
      fetchPendingCount();
      fetchDashboard();
      fetchChartData(selectedPeriod);
    }
  }, [activePage]);

  useEffect(() => {
    if (activePage === 'dashboard') fetchChartData(selectedPeriod);
  }, [selectedPeriod]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
      const base = 'http://localhost:5000/api/hospital-dashboard';

      const [statsRes, infoRes, scheduleRes, reportsRes] = await Promise.all([
        fetch(`${base}/stats`,          { headers }),
        fetch(`${base}/hospital-info`,  { headers }),
        fetch(`${base}/today-schedule`, { headers }),
        fetch(`${base}/recent-reports`, { headers }),
      ]);

      if (statsRes.ok)    { const d = await statsRes.json();    setDashboardStats(d.data); }
      if (infoRes.ok)     { const d = await infoRes.json();     setHospitalInfo(d.data); }
      if (scheduleRes.ok) { const d = await scheduleRes.json(); setTodaySchedule(d.data?.schedule || []); }
      if (reportsRes.ok)  { const d = await reportsRes.json();  setRecentReports(d.data?.reports || []); }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async (period: string) => {
    try {
      setChartLoading(true);
      const token = localStorage.getItem('token');
      const apiPeriod = period === 'Week' ? 'week' : period === 'Month' ? 'month' : 'year';
      const res = await fetch(
        `http://localhost:5000/api/hospital-dashboard/chart-data?period=${apiPeriod}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (res.ok) {
        const d = await res.json();
        setChartData(d.data);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setChartLoading(false);
    }
  };
  
  const sidebarItems = [
    { icon: Squares2X2Icon,   label: 'Dashboard',   active: activePage === 'dashboard',    page: 'dashboard' },
    { icon: UsersIcon,      label: 'Patients',    active: activePage === 'patients',     page: 'patients' },
    { icon: CalendarIcon,   label: 'Appointment', active: activePage === 'appointments', page: 'appointments', hasDropdown: true },
    { icon: DocumentTextIcon, label: 'Report',    active: activePage === 'report',       page: 'report' },
    { icon: CreditCardIcon, label: 'Payments',    active: activePage === 'payments',     page: 'payments' },
    { icon: UserPlusIcon,   label: 'Employee',    active: activePage === 'employee',     page: 'employee' },
    { icon: ActivityIcon,   label: 'Activity',    active: activePage === 'activity',     page: 'activity' },
    { icon: ChartBarIcon,   label: 'Statistic',   active: activePage === 'statistic',    page: 'statistic' },
    { icon: QuestionMarkCircleIcon, label: 'Help & Center', active: activePage === 'help', page: 'help' },
  ];

  const StatCard = ({ icon: Icon, title, value, change, changeType, color }: any) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className={`text-sm flex items-center gap-1 ${changeType === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {changeType === 'up' ? <ArrowTrendingUpIcon className="w-4 h-4" /> : <ArrowTrendingDownIcon className="w-4 h-4" />}
            {change}
          </div>
        </div>
      </div>
      <div className="text-gray-600 text-sm font-medium">{title}</div>
    </div>
  );

  const currentYear = new Date().getFullYear();
  const PERIODS = ['Week', 'Month', `Year-${currentYear}`];

  const PatientChart = () => {
    const d = chartData || { labels: [], newPatients: [], returning: [] };
    const data = {
      labels: d.labels,
      datasets: [
        {
          label: 'New patients',
          data: d.newPatients,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16,185,129,0.08)',
          borderWidth: 2.5,
          pointBackgroundColor: '#10b981',
          pointRadius: 3,
          pointHoverRadius: 5,
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Returning patients',
          data: d.returning,
          borderColor: '#6b7280',
          backgroundColor: 'rgba(107,114,128,0.05)',
          borderWidth: 2,
          pointBackgroundColor: '#6b7280',
          pointRadius: 3,
          pointHoverRadius: 5,
          tension: 0.4,
          fill: true,
        },
      ],
    };
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' as const, labels: { boxWidth: 10, font: { size: 12 } } },
        tooltip: { mode: 'index' as const, intersect: false },
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: { grid: { color: '#f1f5f9' }, ticks: { font: { size: 11 } }, beginAtZero: true },
      },
    };
    if (chartLoading) {
      return (
        <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
          Loading chart...
        </div>
      );
    }
    if (!d.labels.length) {
      return (
        <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
          No appointment data for this period
        </div>
      );
    }
    return <div className="h-64"><Line data={data} options={options} /></div>;
  };

  const CircularProgress = ({ percentage, color, size = 120 }: any) => {
    const radius = (size - 20) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#f1f5f9"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{percentage}%</span>
        </div>
      </div>
    );
  };

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative z-40 md:z-auto h-full
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        ${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-100 transition-all duration-300 flex flex-col flex-shrink-0
      `}>
        {/* Logo area — matches global header height */}
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
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="2" y="3" width="20" height="18" rx="2" strokeWidth="2"/>
              <line x1="8" y1="3" x2="8" y2="21" strokeWidth="2"/>
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-4 px-3">
          <div className="space-y-1">
            {sidebarItems.map((item, index) => (
              <div key={index} className="relative group">
                <button
                  onClick={() => {
                    if (item.hasDropdown) {
                      if (sidebarOpen) setAppointmentsDropdownOpen(o => !o);
                      else { setActivePage('appointments'); setAppointmentFilter(''); }
                    } else {
                      setActivePage(item.page);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  } ${!sidebarOpen ? 'justify-center' : ''}`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="flex-1 text-left">{item.label}</span>}
                  {item.hasDropdown && sidebarOpen && (
                    <ChevronDownIcon className={`w-4 h-4 flex-shrink-0 transition-transform ${appointmentsDropdownOpen ? 'rotate-180' : ''}`} />
                  )}
                  {item.page === 'appointments' && pendingCount > 0 && !item.hasDropdown && sidebarOpen && (
                    <span className="bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                      {pendingCount}
                    </span>
                  )}
                  {item.page === 'appointments' && pendingCount > 0 && !sidebarOpen && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </button>

                {/* Appointment sub-menu */}
                {item.hasDropdown && sidebarOpen && appointmentsDropdownOpen && (
                  <div className="ml-4 mt-0.5 space-y-0.5">
                    {[
                      { label: 'All Appointments', filter: '' },
                      { label: 'Pending', filter: 'pending' },
                      { label: 'Completed', filter: 'completed' },
                      { label: 'History', filter: 'history' },
                    ].map(sub => (
                      <button
                        key={sub.filter}
                        onClick={() => { setActivePage('appointments'); setAppointmentFilter(sub.filter); }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          activePage === 'appointments' && appointmentFilter === sub.filter
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        {sub.label}
                        {sub.filter === 'pending' && pendingCount > 0 && (
                          <span className="ml-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full px-1">{pendingCount}</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Tooltip when collapsed */}
                {!sidebarOpen && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50">
                    {item.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100">
          <button onClick={() => setMobileSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <span className="font-semibold text-gray-900 text-sm">Hospital Dashboard</span>
        </div>

        {/* Dashboard Header */}
        <DashboardHeader
          user={user}
          logout={logout}
          navigate={navigate}
          pendingCount={pendingCount}
          setActivePage={setActivePage}
        />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 pb-20 md:pb-6">
          {/* Render different pages based on activePage */}
          {activePage === 'dashboard' && (
            <>
              {/* Welcome Section */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                      Welcome back, {hospitalInfo?.admin_name || user?.name || 'Admin'} 👋
                    </h1>
                    <p className="text-gray-600 text-sm">
                      Here's the latest update for {hospitalInfo?.name || 'your hospital'}
                      {hospitalInfo?.city ? ` · ${hospitalInfo.city}${hospitalInfo.state ? `, ${hospitalInfo.state}` : ''}` : ''}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-gray-200 flex items-center gap-2 self-start sm:self-auto">
                    <CalendarIcon className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium">
                      {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
            <StatCard
              icon={CalendarIcon}
              title="Appointments"
            value={loading ? "..." : (dashboardStats?.total_appointments || "0")}
              change="4.8% from last week"
              changeType="up"
              color="bg-blue-500"
            />
            <StatCard
              icon={PhoneIcon}
              title="Total Patients"
            value={loading ? "..." : (dashboardStats?.total_patients || "0")}
              change="6.0% from last week"
              changeType="up"
              color="bg-green-500"
            />
            <StatCard
              icon={UsersIcon}
              title="Completed"
            value={loading ? "..." : (dashboardStats?.completed_appointments || "0")}
              change="2.5% from last week"
              changeType="up"
              color="bg-teal-500"
            />
            <StatCard
              icon={CurrencyDollarIcon}
              title="Total Revenue"
            value={loading ? "..." : `₹${(dashboardStats?.total_revenue || 0).toLocaleString()}`}
              change="2.1% from last week"
              changeType="up"
              color="bg-blue-400"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Patient Statistics Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Patient statistics</h3>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    {PERIODS.map((period) => (
                      <button
                        key={period}
                        onClick={() => setSelectedPeriod(period)}
                        className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                          selectedPeriod === period
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <PatientChart />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Today's Schedule */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">
                    Today – {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </h3>
                  <button
                    onClick={() => setActivePage('appointments')}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    View all →
                  </button>
                </div>

                {loading ? (
                  <div className="text-sm text-gray-400 py-4 text-center">Loading...</div>
                ) : todaySchedule.length === 0 ? (
                  <div className="text-sm text-gray-400 py-4 text-center">No appointments scheduled for today</div>
                ) : (
                  <div className="space-y-4">
                    {todaySchedule.slice(0, 4).map((apt) => (
                      <div key={apt.id} className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          apt.status === 'confirmed' ? 'bg-emerald-100' : 'bg-amber-50'
                        }`}>
                          <ClockIcon className={`w-5 h-5 ${apt.status === 'confirmed' ? 'text-emerald-600' : 'text-amber-500'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 text-sm truncate">{apt.title}</div>
                          <div className="text-xs text-gray-500">{apt.duration}</div>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                          apt.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Reports */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Recent Reports</h3>
                  <button
                    onClick={() => setActivePage('report')}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    View all →
                  </button>
                </div>

                {loading ? (
                  <div className="text-sm text-gray-400 py-4 text-center">Loading...</div>
                ) : recentReports.length === 0 ? (
                  <div className="text-sm text-gray-400 py-4 text-center">No reports yet</div>
                ) : (
                  <div className="space-y-4">
                    {recentReports.slice(0, 3).map((report) => (
                      <div key={report.id} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <DocumentTextIcon className="w-4 h-4 text-teal-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{report.title}</div>
                          <div className="text-xs text-gray-500 truncate">{report.patient_name}</div>
                          <div className="text-xs text-gray-400">
                            {report.created_at
                              ? new Date(report.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
                              : ''}
                          </div>
                        </div>
                        {report.file_url && (
                          <a
                            href={report.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-600 text-xs font-medium hover:text-teal-700 flex-shrink-0"
                          >
                            View →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mt-4 md:mt-6">
            {/* Balance / Revenue */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Revenue</h3>
                <button
                  onClick={() => setActivePage('payments')}
                  className="text-gray-400 hover:text-gray-600"
                  title="View payments"
                >
                  <EyeIcon className="w-4 h-4" />
                </button>
              </div>

              {(() => {
                const totalRev   = Number(dashboardStats?.total_revenue || 0);
                const avgFee     = Number(dashboardStats?.avg_consultation_fee || 0);
                const totalAppts = dashboardStats?.total_appointments || 0;
                const completedPct = totalAppts > 0
                  ? Math.round((dashboardStats?.completed_appointments / totalAppts) * 100)
                  : 0;
                return (
                  <>
                    <div className="flex items-center justify-center mb-4">
                      <CircularProgress percentage={completedPct} color="#10b981" />
                    </div>
                    <p className="text-xs text-center text-gray-400 mb-4">Completed appointments</p>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Revenue</span>
                        <span className="font-semibold">
                          {loading ? '...' : `₹${totalRev.toLocaleString('en-IN')}`}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Avg. Consultation Fee</span>
                        <span className="font-semibold">
                          {loading ? '...' : `₹${Math.round(avgFee).toLocaleString('en-IN')}`}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Completed Appointments</span>
                        <span className="font-semibold text-green-600">
                          {loading ? '...' : dashboardStats?.completed_appointments || 0}
                        </span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Appointment Status Breakdown */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Appointment Status</h3>
                <button
                  onClick={() => setActivePage('appointments')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <EllipsisHorizontalIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {loading ? '...' : dashboardStats?.total_appointments || 0}
                </div>
                <div className="text-sm text-gray-500">Total Appointments</div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-400 rounded-full" />
                    <span className="text-sm text-gray-600">Pending</span>
                  </div>
                  <span className="font-semibold">{loading ? '...' : dashboardStats?.pending_appointments || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span className="text-sm text-gray-600">Confirmed</span>
                  </div>
                  <span className="font-semibold">{loading ? '...' : dashboardStats?.confirmed_appointments || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="text-sm text-gray-600">Completed</span>
                  </div>
                  <span className="font-semibold">{loading ? '...' : dashboardStats?.completed_appointments || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full" />
                    <span className="text-sm text-gray-600">Cancelled</span>
                  </div>
                  <span className="font-semibold">{loading ? '...' : dashboardStats?.cancelled_appointments || 0}</span>
                </div>
              </div>
            </div>

            {/* Team / Employees Summary */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Staff & Patients</h3>
                <button
                  onClick={() => setActivePage('employee')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <EllipsisHorizontalIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-emerald-50 rounded-xl">
                  <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <UserPlusIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {loading ? '...' : dashboardStats?.total_employees || 0}
                    </div>
                    <div className="text-xs text-gray-500">Active Employees</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <UsersIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {loading ? '...' : dashboardStats?.total_patients || 0}
                    </div>
                    <div className="text-xs text-gray-500">Total Patients Seen</div>
                  </div>
                </div>

                <button
                  onClick={() => setActivePage('employee')}
                  className="w-full text-center text-sm text-emerald-600 hover:text-emerald-700 font-medium pt-1"
                >
                  Manage employees →
                </button>
              </div>
            </div>
          </div>
            </>
          )}
          
          {/* Other Pages */}
          {activePage === 'patients' && <Patients />}
          {activePage === 'appointments' && <Appointments initialFilter={appointmentFilter} />}
          {activePage === 'payments' && <Payments />}
          {activePage === 'employee' && <Employee />}
          {activePage === 'activity' && <ActivityPage />}
          {activePage === 'statistic' && <Statistic />}
          {activePage === 'help' && <HelpCenter />}
          {activePage === 'report' && <Report />}
          {activePage === 'profile' && <HospitalProfile />}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 flex justify-around py-2">
        {sidebarItems.slice(0, 5).map((item) => (
          <button
            key={item.page}
            onClick={() => setActivePage(item.page)}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-xs relative
              ${activePage === item.page ? 'text-emerald-600' : 'text-gray-500'}`}
          >
            <div className="relative">
              <item.icon className="w-5 h-5" />
              {item.page === 'appointments' && pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-0.5">
                  {pendingCount}
                </span>
              )}
            </div>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default HospitalDashboard;