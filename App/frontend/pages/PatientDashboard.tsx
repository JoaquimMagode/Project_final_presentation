import React, { useState } from 'react';
import { 
  Menu, X, Search, Bell, User, Calendar, Phone, Users, Activity as ActivityIcon, 
  TrendingUp, TrendingDown, MoreHorizontal, Plus, Settings, HelpCircle,
  BarChart3, PieChart, Home, FileText, CreditCard, UserCheck, 
  Building2, Stethoscope, Clock, DollarSign, Eye, Bed, ChevronDown,
  Upload, Heart, Shield
} from 'lucide-react';

// Import patient pages
import PatientRegistration from './patient/PatientRegistration';
import PatientProfile from './patient/PatientProfile';
import MedicalReports from './patient/MedicalReports';
import AppointmentRequests from './patient/AppointmentRequests';
import PatientSettings from './patient/PatientSettings';
import PatientHelp from './patient/PatientHelp';

const PatientDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('Week');
  const [activePage, setActivePage] = useState('dashboard');
  
  const sidebarItems = [
    { icon: Home, label: 'Dashboard', active: activePage === 'dashboard', page: 'dashboard' },
    { icon: UserCheck, label: 'Registration', active: activePage === 'registration', page: 'registration' },
    { icon: User, label: 'My Profile', active: activePage === 'profile', page: 'profile' },
    { icon: FileText, label: 'Medical Reports', active: activePage === 'reports', page: 'reports' },
    { icon: Calendar, label: 'Appointments', active: activePage === 'appointments', page: 'appointments' },
    { icon: Settings, label: 'Settings', active: activePage === 'settings', page: 'settings' },
    { icon: HelpCircle, label: 'Help & Support', active: activePage === 'help', page: 'help' }
  ];

  const upcomingAppointments = [
    { time: '10:00', doctor: 'Dr. Sarah Wilson', specialty: 'Cardiology', date: '2024-01-20' },
    { time: '14:30', doctor: 'Dr. Michael Brown', specialty: 'General Medicine', date: '2024-01-22' }
  ];

  const recentReports = [
    { title: 'Blood Test Results', date: '2024-01-15', status: 'Available', doctor: 'Dr. Emily Davis' },
    { title: 'X-Ray Report', date: '2024-01-10', status: 'Available', doctor: 'Dr. James Miller' }
  ];

  const StatCard = ({ icon: Icon, title, value, subtitle, color }: any) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-gray-600 text-sm font-medium">{title}</div>
      {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
    </div>
  );

  const HealthChart = () => (
    <div className="relative h-64">
      <svg className="w-full h-full" viewBox="0 0 400 200">
        {/* Grid lines */}
        <defs>
          <pattern id="healthGrid" width="40" height="20" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#healthGrid)" />
        
        {/* Health trend line */}
        <path
          d="M 20 150 Q 60 140 100 130 T 180 120 T 260 110 T 340 100 T 380 95"
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          className="drop-shadow-sm"
        />
        
        {/* Highlight circle */}
        <circle cx="340" cy="100" r="8" fill="#10b981" className="drop-shadow-sm" />
        <circle cx="340" cy="100" r="4" fill="white" />
        
        {/* Month labels */}
        {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'].map((month, i) => (
          <text key={month} x={20 + i * 60} y="190" textAnchor="middle" fill="#6b7280" fontSize="10">
            {month}
          </text>
        ))}
      </svg>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-xs text-gray-600">Health Score</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-blue-800 transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-6 border-b border-blue-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-blue-800" />
            </div>
            {sidebarOpen && <span className="text-white font-bold text-lg">HealthCare</span>}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {sidebarItems.map((item, index) => (
              <button
                key={index}
                onClick={() => setActivePage(item.page)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  item.active 
                    ? 'bg-blue-700 text-white' 
                    : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            ))}
          </div>
        </nav>

        {/* Patient Menu */}
        {sidebarOpen && (
          <div className="p-4 border-t border-blue-700">
            <div className="text-blue-300 text-xs font-semibold mb-3 uppercase tracking-wider">Patient Portal</div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search doctors, appointments..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Book Appointment
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-2">
                <img
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Render different pages based on activePage */}
          {activePage === 'dashboard' && (
            <>
              {/* Welcome Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back, Sarah! 👋</h1>
                    <p className="text-gray-600">Here's your health overview and upcoming appointments</p>
                  </div>
                  <div className="bg-white rounded-lg px-4 py-2 border border-gray-200 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium">Today, January 15th</span>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  icon={Calendar}
                  title="Next Appointment"
                  value="Jan 20"
                  subtitle="Dr. Sarah Wilson - Cardiology"
                  color="bg-blue-500"
                />
                <StatCard
                  icon={FileText}
                  title="Medical Reports"
                  value="8"
                  subtitle="2 new reports available"
                  color="bg-green-500"
                />
                <StatCard
                  icon={Heart}
                  title="Health Score"
                  value="85%"
                  subtitle="Good overall health"
                  color="bg-red-500"
                />
                <StatCard
                  icon={Shield}
                  title="Insurance"
                  value="Active"
                  subtitle="Premium Plan - Expires Dec 2024"
                  color="bg-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Health Trends Chart */}
                <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Health Trends</h3>
                    <div className="flex gap-2">
                      {['Week', 'Month', 'Year'].map((period) => (
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
                  <HealthChart />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Upcoming Appointments */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Upcoming Appointments</h3>
                      <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                        View All
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {upcomingAppointments.map((apt, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{apt.doctor}</div>
                            <div className="text-sm text-gray-600">{apt.specialty}</div>
                            <div className="text-xs text-gray-500">{apt.date} at {apt.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Reports */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Recent Reports</h3>
                      <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                        View All
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {recentReports.map((report, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900 mb-1">{report.title}</div>
                            <div className="text-xs text-gray-500">By {report.doctor}</div>
                            <div className="text-xs text-gray-500">{report.date}</div>
                          </div>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            {report.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Book Appointment</h4>
                      <p className="text-sm text-gray-600">Schedule with your preferred doctor</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Upload className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Upload Reports</h4>
                      <p className="text-sm text-gray-600">Share your medical documents</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Telemedicine</h4>
                      <p className="text-sm text-gray-600">Consult doctors online</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {/* Other Pages */}
          {activePage === 'registration' && <PatientRegistration />}
          {activePage === 'profile' && <PatientProfile />}
          {activePage === 'reports' && <MedicalReports />}
          {activePage === 'appointments' && <AppointmentRequests />}
          {activePage === 'settings' && <PatientSettings />}
          {activePage === 'help' && <PatientHelp />}
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;