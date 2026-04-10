import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Search, Bell, User, Calendar, Phone, Users, Activity as ActivityIcon, 
  TrendingUp, TrendingDown, MoreHorizontal, Plus, HelpCircle,
  BarChart3, Home, FileText, CreditCard, UserCheck, 
  Building2, Clock, DollarSign, Eye, Bed, ChevronDown, LogOut
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';
import UserAvatar from '../components/UserAvatar';

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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-100 transition-all duration-300 flex flex-col relative flex-shrink-0 py-6 px-3 gap-1`}>
        {/* Toggle button */}
        <button
          onClick={() => setSidebarOpen(o => !o)}
          className="absolute -right-3 top-6 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors z-10"
        >
          <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-300 ${sidebarOpen ? '-rotate-90' : 'rotate-90'}`} />
        </button>

        {/* Menu Items */}
        <nav className="flex-1">
          <div className="space-y-1">
            {sidebarItems.map((item, index) => (
              <div key={index} className="relative group">
                <button
                  onClick={() => setActivePage(item.page)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
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
        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Render different pages based on activePage */}
          {activePage === 'dashboard' && (
            <>
              {/* Welcome Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back, {hospitalData.adminName} 👋</h1>
                    <p className="text-gray-600">Here's the latest update for {hospitalData.name} - last 7 days overview</p>
                  </div>
                  <div className="bg-white rounded-lg px-4 py-2 border border-gray-200 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium">Monday, 4th September</span>
                  </div>
                </div>
              </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
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
    </div>
  );
};

export default HospitalDashboard;