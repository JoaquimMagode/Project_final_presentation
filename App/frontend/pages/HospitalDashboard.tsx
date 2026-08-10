import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Search, Bell, User, Calendar, Phone, Users, Activity as ActivityIcon, 
  TrendingUp, TrendingDown, MoreHorizontal, Plus, HelpCircle,
  BarChart3, Home, FileText, CreditCard, UserCheck, 
  Building2, Clock, DollarSign, Eye, Bed, ChevronDown, LogOut, Menu,
  Settings, AlertTriangle, Globe
} from 'lucide-react';
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
        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <input type="text" placeholder="Search patients, appointments..." className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder-gray-400" />
      </div>

      <div className="flex items-center gap-3">
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
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
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
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mock hospital data - in real app, this would come from user context or API
  const hospitalData = {
    name: user?.name || 'Apollo Hospitals Mumbai',
    logo: 'https://picsum.photos/seed/hospital1/100/100', // In real app, this would be the actual hospital logo
    location: 'Mumbai, India',
    type: 'Multi-Specialty Hospital',
    adminName: user?.name || 'Dr. Rajesh Kumar', // Hospital admin name
    adminRole: 'Hospital Administrator'
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    
    const handleNavigatePage = (e: Event) => {
      const page = (e as CustomEvent).detail;
      if (page) setActivePage(page);
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('navigateHospitalPage', handleNavigatePage);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('navigateHospitalPage', handleNavigatePage);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/hospital-dashboard/appointments?status=pending', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setPendingCount(data?.data?.appointments?.length || 0))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (activePage === 'dashboard') {
      fetchDashboardStats();
    }
  }, [activePage]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/hospital-dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const sidebarItems = [
    { icon: Home, label: 'Dashboard', active: activePage === 'dashboard', page: 'dashboard' },
    { icon: Users, label: 'Patients', active: activePage === 'patients', page: 'patients' },
    { icon: Calendar, label: 'Appointment', active: activePage === 'appointments', page: 'appointments' },
    { icon: FileText, label: 'Report', active: activePage === 'report', page: 'report' },
    { icon: CreditCard, label: 'Payments', active: activePage === 'payments', page: 'payments' },
    { icon: UserCheck, label: 'Employee', active: activePage === 'employee', page: 'employee' },
    { icon: ActivityIcon, label: 'Activity', active: activePage === 'activity', page: 'activity' },
    { icon: BarChart3, label: 'Statistic', active: activePage === 'statistic', page: 'statistic' },
    { icon: HelpCircle, label: 'Help & Center', active: activePage === 'help', page: 'help' },
  ];

  const appointments = [
    { time: '09:00', title: 'Dentist meeting', duration: '09:00am - 10:00am' },
    { time: '11:00', title: 'Procedures', duration: '11:00am - 12:00pm' }
  ];

  const reports = [
    { title: 'A Dental Division in room 123...', time: '1 minute ago', type: 'View report' },
    { title: 'A Dental Division in room 123...', time: '1 minute ago', type: 'View report' }
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
            {changeType === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {change}
          </div>
        </div>
      </div>
      <div className="text-gray-600 text-sm font-medium">{title}</div>
    </div>
  );

  const currentYear = new Date().getFullYear();
  const PERIODS = ['Week', 'Month', `Year-${currentYear}`];

  const CHART_DATA: Record<string, { labels: string[]; newPatients: number[]; returning: number[] }> = {
    Week: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      newPatients: [12, 19, 14, 22, 18, 9, 7],
      returning:   [8,  14, 10, 16, 12, 6, 4],
    },
    Month: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      newPatients: [55, 72, 63, 80],
      returning:   [38, 50, 44, 58],
    },
    [`Year-${currentYear}`]: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      newPatients: [30, 45, 38, 60, 55, 72, 65, 80, 75, 90, 85, 95],
      returning:   [20, 30, 25, 40, 35, 50, 45, 55, 50, 60, 58, 65],
    },
  };

  const PatientChart = () => {
    const d = CHART_DATA[selectedPeriod] || CHART_DATA[`Year-${currentYear}`];
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
            <Menu className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-4 px-3">
          <div className="space-y-1">
            {sidebarItems.map((item, index) => (
              <div key={index} className="relative group">
                <button
                  onClick={() => setActivePage(item.page)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  } ${!sidebarOpen ? 'justify-center' : ''}`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="flex-1 text-left">{item.label}</span>}
                  {item.page === 'appointments' && pendingCount > 0 && sidebarOpen && (
                    <span className="bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                      {pendingCount}
                    </span>
                  )}
                  {item.page === 'appointments' && pendingCount > 0 && !sidebarOpen && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </button>
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
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Welcome back, {hospitalData.adminName} 👋</h1>
                    <p className="text-gray-600 text-sm">Here's the latest update for {hospitalData.name}</p>
                  </div>
                  <div className="bg-white rounded-lg px-3 py-2 border border-gray-200 flex items-center gap-2 self-start sm:self-auto">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium">Monday, 4th September</span>
                  </div>
                </div>
              </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
            <StatCard
              icon={Calendar}
              title="Appointments"
              value={loading ? "..." : (dashboardStats?.total_appointments || "0")}
              change="4.8% from last week"
              changeType="up"
              color="bg-blue-500"
            />
            <StatCard
              icon={Phone}
              title="Total Patients"
              value={loading ? "..." : (dashboardStats?.total_patients || "0")}
              change="6.0% from last week"
              changeType="up"
              color="bg-green-500"
            />
            <StatCard
              icon={Users}
              title="Completed"
              value={loading ? "..." : (dashboardStats?.completed_appointments || "0")}
              change="2.5% from last week"
              changeType="up"
              color="bg-teal-500"
            />
            <StatCard
              icon={DollarSign}
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
                  <h3 className="font-semibold text-gray-900">Today 4th Sep 2023</h3>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {appointments.map((apt, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{apt.title}</div>
                        <div className="text-sm text-gray-500">{apt.duration}</div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reports */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Reports</h3>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {reports.map((report, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 mb-1">{report.title}</div>
                        <div className="text-xs text-gray-500">{report.time}</div>
                      </div>
                      <button className="text-teal-600 text-xs font-medium hover:text-teal-700">
                        {report.type} →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mt-4 md:mt-6">
            {/* Balance */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Balance</h3>
                <button className="text-gray-400 hover:text-gray-600">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center justify-center mb-4">
                <CircularProgress percentage={89} color="#10b981" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Revenue</span>
                  <span className="font-semibold">$8,135,450</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Transaction Revenue</span>
                  <span className="font-semibold">$7,999,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Net Revenue</span>
                  <span className="font-semibold text-green-600">$136,450</span>
                </div>
              </div>
            </div>

            {/* Room Occupancy */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Room occupancy</h3>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-1">52</div>
                <div className="text-sm text-gray-500">ADT</div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">General room</span>
                  </div>
                  <span className="font-semibold">124</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Private room</span>
                  </div>
                  <span className="font-semibold">52</span>
                </div>
              </div>
            </div>

            {/* Reports Summary */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Reports</h3>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 mb-1">A Dental Division in room 123...</div>
                    <div className="text-xs text-gray-500">1 minute ago</div>
                  </div>
                  <button className="text-teal-600 text-xs font-medium hover:text-teal-700">
                    View report →
                  </button>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 mb-1">A Dental Division in room 123...</div>
                    <div className="text-xs text-gray-500">1 minute ago</div>
                  </div>
                  <button className="text-teal-600 text-xs font-medium hover:text-teal-700">
                    View report →
                  </button>
                </div>
              </div>
            </div>
          </div>
            </>
          )}
          
          {/* Other Pages */}
          {activePage === 'patients' && <Patients />}
          {activePage === 'appointments' && <Appointments />}
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