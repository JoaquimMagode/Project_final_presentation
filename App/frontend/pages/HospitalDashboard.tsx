import React, { useState, useEffect, useRef } from 'react';
import {
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineCalendarDays,
  HiOutlineCreditCard,
  HiOutlineUserGroup,
  HiOutlineChartBar,
  HiOutlineQuestionMarkCircle,
  HiOutlineCog6Tooth,
  HiOutlineDocumentText,
  HiOutlineUser,
  HiOutlineBell,
  HiOutlineMagnifyingGlass,
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
  HiOutlineClock,
  HiOutlineEye,
  HiOutlineEllipsisHorizontal,
  HiOutlineArrowRightOnRectangle,
  HiOutlineChevronDown,
  HiOutlineSignal,
  HiOutlineCurrencyDollar,
} from 'react-icons/hi2';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';
import { HeartPulse } from 'lucide-react';

// Import hospital pages
import Patients from './hospital/Patients';
import Appointments from './hospital/Appointments';
import Payments from './hospital/Payments';
import Employee from './hospital/Employee';
import ActivityPage from './hospital/Activity';
import Statistic from './hospital/Statistic';
import HelpCenter from './hospital/HelpCenter';
import Setting from './hospital/Setting';
import Report from './hospital/Report';
import HospitalProfile from './hospital/HospitalProfile';

// --- Chart data ---
const patientChartData = [
  { month: 'Jan', newPatients: 400, oldPatients: 240 },
  { month: 'Feb', newPatients: 300, oldPatients: 260 },
  { month: 'Mar', newPatients: 520, oldPatients: 300 },
  { month: 'Apr', newPatients: 480, oldPatients: 320 },
  { month: 'May', newPatients: 600, oldPatients: 350 },
  { month: 'Jun', newPatients: 750, oldPatients: 380 },
  { month: 'Jul', newPatients: 680, oldPatients: 400 },
  { month: 'Aug', newPatients: 890, oldPatients: 420 },
  { month: 'Sep', newPatients: 1856, oldPatients: 500 },
  { month: 'Oct', newPatients: 950, oldPatients: 480 },
  { month: 'Nov', newPatients: 1100, oldPatients: 520 },
  { month: 'Dec', newPatients: 1300, oldPatients: 560 },
];

const occupancyData = [
  { name: 'General', value: 124, color: '#10b981' },
  { name: 'Private', value: 52, color: '#6366f1' },
  { name: 'Available', value: 24, color: '#e5e7eb' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white px-3 py-2 rounded-md text-xs shadow-lg">
        <p className="font-medium mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {p.value.toLocaleString()}</p>
        ))}
      </div>
    );
  }
  return null;
};

// --- Stat Card ---
const StatCard = ({ icon: Icon, title, value, change, changeType, accent }: {
  icon: any; title: string; value: string; change: string; changeType: 'up' | 'down'; accent: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-lg px-4 py-3.5 border border-gray-200 hover:border-gray-300 transition-all"
  >
    <div className="flex items-center gap-3">
      <div className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${accent}`}>
        <Icon className="w-[18px] h-[18px] text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-gray-500 leading-none">{title}</p>
        <p className="text-lg font-bold text-gray-900 leading-tight mt-0.5">{value}</p>
      </div>
      <div className={`flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-md shrink-0 ${
        changeType === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
      }`}>
        {changeType === 'up' ? <HiOutlineArrowTrendingUp className="w-3 h-3" /> : <HiOutlineArrowTrendingDown className="w-3 h-3" />}
        {change}
      </div>
    </div>
  </motion.div>
);

// --- Circular Progress (SVG) ---
const CircularProgress = ({ percentage, color, size = 100 }: { percentage: number; color: string; size?: number }) => {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percentage / 100) * circ;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#f1f5f9" strokeWidth="7" fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth="7" fill="none"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-gray-900">{percentage}%</span>
      </div>
    </div>
  );
};

// --- Main Component ---
const HospitalDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('Week');
  const [activePage, setActivePage] = useState('dashboard');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const hospitalData = {
    name: user?.name || 'Apollo Hospitals Mumbai',
    location: 'Mumbai, India',
    adminName: user?.name || 'Dr. Rajesh Kumar',
    adminRole: 'Hospital Administrator',
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    const handleToggleSidebar = () => setSidebarOpen(prev => !prev);
    const handleNavigatePage = (e: Event) => {
      const page = (e as CustomEvent).detail;
      if (page) setActivePage(page);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('toggleSidebar', handleToggleSidebar);
    window.addEventListener('navigateHospitalPage', handleNavigatePage);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('toggleSidebar', handleToggleSidebar);
      window.removeEventListener('navigateHospitalPage', handleNavigatePage);
    };
  }, []);

  useEffect(() => {
    if (activePage === 'dashboard') fetchDashboardStats();
  }, [activePage]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/hospital-dashboard/stats', {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
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

  const sidebarGroups = [
    {
      label: 'Main',
      items: [
        { icon: HiOutlineHome, label: 'Dashboard', page: 'dashboard' },
        { icon: HiOutlineUsers, label: 'Patients', page: 'patients' },
        { icon: HiOutlineCalendarDays, label: 'Appointments', page: 'appointments' },
        { icon: HiOutlineCreditCard, label: 'Payments', page: 'payments' },
        { icon: HiOutlineUserGroup, label: 'Employees', page: 'employee' },
      ],
    },
    {
      label: 'Analytics',
      items: [
        { icon: HiOutlineSignal, label: 'Activity', page: 'activity' },
        { icon: HiOutlineChartBar, label: 'Statistics', page: 'statistic' },
        { icon: HiOutlineDocumentText, label: 'Reports', page: 'report' },
      ],
    },
    {
      label: 'Other',
      items: [
        { icon: HiOutlineQuestionMarkCircle, label: 'Help Center', page: 'help' },
        { icon: HiOutlineCog6Tooth, label: 'Settings', page: 'setting' },
        { icon: HiOutlineUser, label: 'Profile', page: 'profile' },
      ],
    },
  ];

  const appointments = [
    { time: '09:00', title: 'Dentist Consultation', duration: '09:00 – 10:00 AM', tag: 'Urgent', tagColor: 'bg-red-50 text-red-600' },
    { time: '11:00', title: 'Cardiology Review', duration: '11:00 – 12:00 PM', tag: 'Routine', tagColor: 'bg-blue-50 text-blue-600' },
    { time: '14:00', title: 'Post-Op Follow-up', duration: '02:00 – 02:30 PM', tag: 'Follow-up', tagColor: 'bg-amber-50 text-amber-600' },
  ];

  const reports = [
    { title: 'Dental Division – Room 123 discharge summary', time: '1 min ago' },
    { title: 'Cardiology Lab – ECG report for patient #4521', time: '12 min ago' },
    { title: 'Radiology – MRI scan results uploaded', time: '34 min ago' },
  ];

  return (
    <div className="flex h-screen bg-gray-50/80">
      {/* ── Sidebar ── */}
      <motion.aside
        animate={{ width: sidebarOpen ? 248 : 68 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="bg-slate-900 flex flex-col overflow-hidden shrink-0 border-r border-slate-800"
      >
        {/* Logo area */}
        <div className="h-14 flex items-center gap-3 px-4 border-b border-slate-800/60">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm shadow-emerald-500/20">
            <HeartPulse className="w-4 h-4" />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -4 }}
                className="min-w-0">
                <p className="text-white font-semibold text-sm leading-tight truncate">Hospital</p>
                <p className="text-slate-500 text-[10px] leading-tight">Management Panel</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav groups */}
        <nav className="flex-1 py-3 px-3 overflow-y-auto space-y-5">
          {sidebarGroups.map((group) => (
            <div key={group.label}>
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 px-3 mb-2">
                    {group.label}
                  </motion.p>
                )}
              </AnimatePresence>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = activePage === item.page;
                  return (
                    <button
                      key={item.page}
                      onClick={() => setActivePage(item.page)}
                      className={`relative w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] transition-all ${
                        isActive
                          ? 'bg-slate-800 text-white font-medium'
                          : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-300'
                      }`}
                    >
                      {isActive && (
                        <motion.div layoutId="activeIndicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-emerald-400 rounded-r-full"
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}
                      <item.icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-emerald-400' : ''}`} />
                      <AnimatePresence>
                        {sidebarOpen && (
                          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="truncate">{item.label}</motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-slate-800/60 p-3">
          <div className={`flex items-center ${sidebarOpen ? 'gap-3' : 'justify-center'}`}>
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-[11px] text-slate-200 font-semibold shrink-0">
              {hospitalData.adminName.charAt(0)}
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-200 truncate">{hospitalData.adminName}</p>
                  <p className="text-[10px] text-slate-500 truncate">{hospitalData.adminRole}</p>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => { logout(); navigate('/login'); }}
                  className="p-1.5 rounded-md hover:bg-slate-800 text-slate-500 hover:text-red-400 transition-colors shrink-0"
                  title="Logout">
                  <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-5 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(p => !p)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-gray-50 rounded-md px-3 py-2 w-64 border border-gray-200">
              <HiOutlineMagnifyingGlass className="w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search anything…"
                className="bg-transparent text-sm outline-none w-full text-gray-600 placeholder-gray-400" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
              <HiOutlineBell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-semibold">
                  {hospitalData.adminName.charAt(0)}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-medium text-gray-800 leading-tight">{hospitalData.adminName}</p>
                  <p className="text-[10px] text-gray-400">{hospitalData.adminRole}</p>
                </div>
                <HiOutlineChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1.5 z-50">
                  <button onClick={() => { setActivePage('profile'); setProfileDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                    <HiOutlineUser className="w-4 h-4" /> Profile
                  </button>
                  <button onClick={() => { setActivePage('setting'); setProfileDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                    <HiOutlineCog6Tooth className="w-4 h-4" /> Settings
                  </button>
                  <hr className="my-1 border-gray-100" />
                  <button onClick={() => { logout(); navigate('/login'); }}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2">
                    <HiOutlineArrowRightOnRectangle className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {activePage === 'dashboard' && (
            <div className="p-6 max-w-[1400px] mx-auto space-y-6">
              {/* Welcome */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Welcome back, {hospitalData.adminName} 👋
                  </h1>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Here's the latest update for {hospitalData.name}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5">
                  <HiOutlineCalendarDays className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs font-medium text-gray-600">{new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                </div>
              </motion.div>

              {/* Stat cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={HiOutlineCalendarDays} title="Appointments"
                  value={loading ? '—' : String(dashboardStats?.total_appointments || '0')}
                  change="4.8%" changeType="up" accent="bg-blue-500" />
                <StatCard icon={HiOutlineUsers} title="Total Patients"
                  value={loading ? '—' : String(dashboardStats?.total_patients || '0')}
                  change="6.0%" changeType="up" accent="bg-emerald-500" />
                <StatCard icon={HiOutlineChartBar} title="Completed"
                  value={loading ? '—' : String(dashboardStats?.completed_appointments || '0')}
                  change="2.5%" changeType="up" accent="bg-violet-500" />
                <StatCard icon={HiOutlineCurrencyDollar} title="Total Revenue"
                  value={loading ? '—' : `₹${(dashboardStats?.total_revenue || 0).toLocaleString()}`}
                  change="2.1%" changeType="up" accent="bg-amber-500" />
              </div>

              {/* Chart + Schedule row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Patient Statistics Chart */}
                <div className="lg:col-span-2 bg-white rounded-lg p-5 border border-gray-200">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-sm font-semibold text-gray-900">Patient Statistics</h3>
                    <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
                      {['Week', 'Month', 'Year'].map((p) => (
                        <button key={p} onClick={() => setSelectedPeriod(p)}
                          className={`px-3 py-1 text-xs rounded-md transition-all ${
                            selectedPeriod === p ? 'bg-white text-gray-900 shadow-sm font-medium' : 'text-gray-500 hover:text-gray-700'
                          }`}>{p}</button>
                      ))}
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={patientChartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gradNew" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={0.15} />
                          <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradOld" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity={0.1} />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="newPatients" name="New Patients" stroke="#10b981" strokeWidth={2} fill="url(#gradNew)" />
                      <Area type="monotone" dataKey="oldPatients" name="Returning" stroke="#6366f1" strokeWidth={2} fill="url(#gradOld)" />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="flex gap-5 mt-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> New Patients
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Returning
                    </div>
                  </div>
                </div>

                {/* Today's Schedule */}
                <div className="bg-white rounded-lg p-5 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900">Today's Schedule</h3>
                    <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                      {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {appointments.map((apt, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-center gap-3 p-3 rounded-md bg-gray-50/80 hover:bg-gray-100/80 transition-colors">
                        <div className="w-9 h-9 rounded-md bg-white border border-gray-200 flex items-center justify-center shrink-0">
                          <HiOutlineClock className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-800 truncate">{apt.title}</p>
                          <p className="text-[10px] text-gray-400">{apt.duration}</p>
                        </div>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${apt.tagColor}`}>
                          {apt.tag}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Balance */}
                <div className="bg-white rounded-lg p-5 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900">Revenue Balance</h3>
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                      <HiOutlineEye className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex justify-center mb-4">
                    <CircularProgress percentage={89} color="#10b981" />
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { label: 'Total Revenue', val: '$8,135,450', color: 'text-gray-900' },
                      { label: 'Transaction Revenue', val: '$7,999,000', color: 'text-gray-900' },
                      { label: 'Net Revenue', val: '$136,450', color: 'text-emerald-600' },
                    ].map((r, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">{r.label}</span>
                        <span className={`text-xs font-semibold ${r.color}`}>{r.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Room Occupancy */}
                <div className="bg-white rounded-lg p-5 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-900">Room Occupancy</h3>
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                      <HiOutlineEllipsisHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <ResponsiveContainer width={160} height={160}>
                      <PieChart>
                        <Pie data={occupancyData} cx="50%" cy="50%" innerRadius={45} outerRadius={65}
                          paddingAngle={3} dataKey="value" strokeWidth={0}>
                          {occupancyData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-center mb-3">
                    <span className="text-2xl font-bold text-gray-900">200</span>
                    <span className="text-xs text-gray-400 ml-1">total beds</span>
                  </div>
                  <div className="space-y-2">
                    {occupancyData.map((d, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></span>
                          <span className="text-xs text-gray-500">{d.name}</span>
                        </div>
                        <span className="text-xs font-semibold text-gray-700">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Reports */}
                <div className="bg-white rounded-lg p-5 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900">Recent Reports</h3>
                    <button onClick={() => setActivePage('report')}
                      className="text-[10px] font-medium text-emerald-600 hover:text-emerald-700">View all →</button>
                  </div>
                  <div className="space-y-3">
                    {reports.map((r, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="flex items-start gap-3 p-3 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="w-8 h-8 rounded-md bg-emerald-50 flex items-center justify-center shrink-0">
                          <HiOutlineDocumentText className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-800 leading-snug line-clamp-2">{r.title}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{r.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-pages */}
          {activePage === 'patients' && <Patients />}
          {activePage === 'appointments' && <Appointments />}
          {activePage === 'payments' && <Payments />}
          {activePage === 'employee' && <Employee />}
          {activePage === 'activity' && <ActivityPage />}
          {activePage === 'statistic' && <Statistic />}
          {activePage === 'help' && <HelpCenter />}
          {activePage === 'setting' && <Setting />}
          {activePage === 'report' && <Report />}
          {activePage === 'profile' && <HospitalProfile />}
        </main>
      </div>
    </div>
  );
};

export default HospitalDashboard;
