import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';
import { APP_ICONS, MOCK_APPOINTMENTS, MOCK_VISA_APPS, MOCK_DOCTORS } from '../constants';
import { FileText, MessageCircle, Clock, CheckCircle2, AlertCircle, Plane, User, Calendar, Plus, Settings, ChevronRight, Upload, Heart, Activity, Droplets, Thermometer, Bell, Search, Filter, Download, Eye, TrendingUp, BarChart3 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'OVERVIEW' | 'APPOINTMENT' | 'HEALTH_REPORTS' | 'MEDICAL_HISTORY' | 'UPCOMING_TEST' | 'DOCTOR_NOTES' | 'DOCTORS' | 'REQUESTS' | 'AVAILABILITY'>(
    user?.role === 'PATIENT' ? 'DASHBOARD' : 'DOCTORS'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3);

  const PatientDashboard = () => (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Sidebar */}
      <div className="w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200/50 shadow-xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">AfriHealth</h2>
              <p className="text-xs text-slate-500">Patient Portal</p>
            </div>
          </div>
          
          {/* User Profile Card */}
          <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-2xl p-4 mb-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">{user?.name}</h3>
                <p className="text-xs text-white/80">ID: AF-2023-9021</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-white/80">Health Score</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-white rounded-full"></div>
                </div>
                <span className="text-xs font-semibold">85%</span>
              </div>
            </div>
          </div>
        </div>
        
        <nav className="px-4 space-y-1">
          {[
            { id: 'DASHBOARD', label: 'Dashboard', icon: BarChart3, color: 'text-blue-600' },
            { id: 'OVERVIEW', label: 'Overview', icon: Eye, color: 'text-emerald-600' },
            { id: 'APPOINTMENT', label: 'Appointments', icon: Calendar, color: 'text-purple-600' },
            { id: 'HEALTH_REPORTS', label: 'Health Reports', icon: FileText, color: 'text-orange-600' },
            { id: 'MEDICAL_HISTORY', label: 'Medical History', icon: Clock, color: 'text-red-600' },
            { id: 'UPCOMING_TEST', label: 'Upcoming Tests', icon: Activity, color: 'text-pink-600' },
            { id: 'DOCTOR_NOTES', label: 'Doctor Notes', icon: MessageCircle, color: 'text-indigo-600' },
          ].map(item => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 group hover:bg-white hover:shadow-md ${
                  activeTab === item.id 
                    ? 'bg-white shadow-lg scale-105 border border-slate-200' 
                    : 'hover:translate-x-1'
                }`}
              >
                <div className={`p-2 rounded-lg transition-colors ${
                  activeTab === item.id 
                    ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg' 
                    : `bg-slate-100 ${item.color} group-hover:bg-slate-200`
                }`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <span className={`text-sm font-medium transition-colors ${
                  activeTab === item.id ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'
                }`}>{item.label}</span>
                {activeTab === item.id && (
                  <div className="ml-auto w-2 h-2 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full animate-pulse"></div>
                )}
              </button>
            );
          })}
        </nav>
        
        {/* Quick Actions */}
        <div className="p-4 mt-6">
          <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-4 border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-semibold text-orange-800">Emergency</span>
            </div>
            <p className="text-xs text-orange-700 mb-3">24/7 medical assistance available</p>
            <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              Contact Now
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Good morning, {user?.name?.split(' ')[0]} 👋</h1>
              <p className="text-slate-600">Here's your health overview for today</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-100 border-0 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all duration-300"
                />
              </div>
              <button className="relative p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
                <Bell className="w-5 h-5 text-slate-600" />
                {notifications > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-bounce">
                    {notifications}
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto h-full">
          {activeTab === 'DASHBOARD' && (
            <div className="space-y-6 animate-in fade-in duration-700">
              {/* Vital Signs Cards */}
              <div className="grid grid-cols-4 gap-6">
                {[
                  { label: 'Blood Sugar', value: '80', unit: 'mg/dL', icon: Droplets, color: 'from-orange-400 to-orange-600', bg: 'from-orange-50 to-orange-100', status: 'Normal', trend: '+2%' },
                  { label: 'Heart Rate', value: '98', unit: 'BPM', icon: Heart, color: 'from-pink-400 to-pink-600', bg: 'from-pink-50 to-pink-100', status: 'Normal', trend: '-1%' },
                  { label: 'Blood Pressure', value: '90/72', unit: 'mmHg', icon: Activity, color: 'from-teal-400 to-teal-600', bg: 'from-teal-50 to-teal-100', status: 'Normal', trend: '+0%' },
                  { label: 'Hemoglobin', value: '14', unit: 'g/dL', icon: Droplets, color: 'from-red-400 to-red-600', bg: 'from-red-50 to-red-100', status: 'Normal', trend: '+3%' }
                ].map((vital, i) => {
                  const IconComponent = vital.icon;
                  return (
                    <div key={i} className={`bg-gradient-to-br ${vital.bg} rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 group`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 bg-gradient-to-r ${vital.color} rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                          <TrendingUp className="w-3 h-3" />
                          {vital.trend}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-600">{vital.label}</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-slate-900">{vital.value}</span>
                          <span className="text-sm text-slate-500">{vital.unit}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">{vital.status}</span>
                          <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
                            <div className="w-3/4 h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Main Dashboard Grid */}
              <div className="grid grid-cols-3 gap-6">
                {/* Health Reports */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">Health Reports</h3>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors">
                      View All
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { name: 'Medical Check Up Report.pdf', size: '2 MB', icon: '📄', date: 'Today' },
                      { name: 'Blood Count Report.docx', size: '1 MB', icon: '📄', date: '2 days ago' },
                      { name: 'Heart ECG Report.docx', size: '1 MB', icon: '📄', date: '1 week ago' },
                      { name: 'MRI Brain Scan.png', size: '25.8 MB', icon: '🖼️', date: '2 weeks ago' }
                    ].map((report, i) => (
                      <div key={i} className="group flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-all duration-300 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{report.icon}</span>
                          <div>
                            <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{report.name}</p>
                            <p className="text-xs text-slate-500">{report.size} • {report.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1 hover:bg-blue-100 rounded-lg transition-colors">
                            <Eye className="w-4 h-4 text-blue-600" />
                          </button>
                          <button className="p-1 hover:bg-green-100 rounded-lg transition-colors">
                            <Download className="w-4 h-4 text-green-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Medical History */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">Medical History</h3>
                    </div>
                    <button className="text-sm text-purple-600 hover:text-purple-700 font-semibold hover:underline transition-colors">
                      View All
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { condition: 'Covid-19', doctor: 'Dr. Arjun Sharma', icon: '🦠', status: 'Recovered', date: 'Mar 2024' },
                      { condition: 'Appendicitis Surgery', doctor: 'Dr. Sushant Seth', icon: '🏥', status: 'Completed', date: 'Feb 2024' },
                      { condition: 'Routine Checkup', doctor: 'Dr. Nitin Kumawat', icon: '🔍', status: 'Normal', date: 'Jan 2024' },
                      { condition: 'Ankle Fracture', doctor: 'Dr. Vasishta Gupta', icon: '🦴', status: 'Healed', date: 'Dec 2023' }
                    ].map((item, i) => (
                      <div key={i} className="group flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-all duration-300">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{item.icon}</span>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{item.condition}</p>
                            <p className="text-xs text-slate-500">{item.doctor} • {item.date}</p>
                          </div>
                        </div>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Tests */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
                        <Activity className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">Upcoming Tests</h3>
                    </div>
                    <button className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold hover:underline transition-colors">
                      Schedule
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { test: 'ECG Test', frequency: 'Monthly', date: '20/04/24', time: '10:00 AM', color: 'from-green-400 to-emerald-500' },
                      { test: 'Blood Test', frequency: 'Monthly', date: '20/04/24', time: '11:30 AM', color: 'from-red-400 to-pink-500' },
                      { test: 'Diagnosis Test', frequency: 'Quarterly', date: '20/04/24', time: '2:00 PM', color: 'from-blue-400 to-indigo-500' },
                      { test: 'Urine Test', frequency: 'Monthly', date: '20/04/24', time: '3:30 PM', color: 'from-yellow-400 to-orange-500' }
                    ].map((test, i) => (
                      <div key={i} className="group flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-all duration-300">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 bg-gradient-to-r ${test.color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                            <span className="text-white text-sm">🧪</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{test.test}</p>
                            <p className="text-xs text-slate-500">{test.frequency} • {test.time}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-slate-900">{test.date}</p>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                            Scheduled
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
                <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: 'Book Appointment', icon: Calendar, action: () => {} },
                    { label: 'Upload Report', icon: Upload, action: () => {} },
                    { label: 'Message Doctor', icon: MessageCircle, action: () => {} },
                    { label: 'Emergency Help', icon: AlertCircle, action: () => {} }
                  ].map((action, i) => {
                    const IconComponent = action.icon;
                    return (
                      <button 
                        key={i}
                        onClick={action.action}
                        className="flex flex-col items-center gap-2 p-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                      >
                        <IconComponent className="w-6 h-6" />
                        <span className="text-sm font-medium">{action.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'HEALTH_REPORTS' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg animate-in fade-in duration-500">
              <h3 className="text-lg font-bold text-orange-500 mb-4">Health Reports</h3>
              <div className="space-y-4">
                {[
                  { name: 'Medical Check Up Report.pdf', size: '2 MB', date: '1-7 March 2024' },
                  { name: 'Blood Count Report.docx', size: '1 MB', date: '1-7 March 2024' },
                  { name: 'Heart ECG Report.docx', size: '1 MB', date: '1-7 March 2024' },
                  { name: 'MRI of brain Report.png', size: '25.8 MB', date: '1-7 March 2024' }
                ].map((report, i) => (
                  <div key={i} className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-slate-900">{report.name}</p>
                        <p className="text-sm text-slate-500">{report.size} • {report.date}</p>
                      </div>
                      <button className="text-blue-600 hover:underline text-sm">Download</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'APPOINTMENT' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg animate-in fade-in duration-500">
              <h3 className="text-lg font-bold text-orange-500 mb-4">Appointments</h3>
              <div className="space-y-4">
                {MOCK_APPOINTMENTS.map(app => (
                  <div key={app.id} className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-slate-900">{app.doctorName}</h4>
                        <p className="text-sm text-slate-600">{app.hospitalName}</p>
                        <p className="text-sm text-slate-500">{app.date}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        app.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const HospitalDashboard = () => (
    <div className="space-y-8 pb-20">
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black">{user?.name}</h1>
              <p className="text-slate-400 text-sm font-medium">Hospital Management Dashboard</p>
            </div>
          </div>
          <button className="p-2 bg-white/10 rounded-xl hover:bg-white/20">
            <Settings className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
            <p className="text-[10px] font-black uppercase text-slate-400">Total Doctors</p>
            <p className="text-xl font-black">42</p>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
            <p className="text-[10px] font-black uppercase text-slate-400">Requests</p>
            <p className="text-xl font-black text-amber-400">12</p>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
            <p className="text-[10px] font-black uppercase text-slate-400">Confirmed</p>
            <p className="text-xl font-black text-emerald-400">128</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {['DOCTORS', 'REQUESTS', 'AVAILABILITY'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-white border border-slate-200 text-slate-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'DOCTORS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-900">Medical Staff</h3>
            <button className="flex items-center gap-1 text-xs font-black text-emerald-600 uppercase">
              <Plus className="w-4 h-4" /> Add Doctor
            </button>
          </div>
          {MOCK_DOCTORS.map(doc => (
            <div key={doc.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={doc.photo} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h4 className="font-bold text-slate-900">{doc.name}</h4>
                  <p className="text-[10px] font-medium text-slate-500 uppercase">{doc.specialization} • {doc.experience}</p>
                </div>
              </div>
              <div className={`w-3 h-3 rounded-full ${doc.available ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`} title={doc.available ? 'Available' : 'On Leave'} />
            </div>
          ))}
        </div>
      )}

      {activeTab === 'REQUESTS' && (
        <div className="space-y-4">
          {[
            { id: 'r1', patient: 'Samuel Mensah', country: 'Nigeria', case: 'Knee Surgery', date: '2 hours ago' },
            { id: 'r2', patient: 'Lindiwe D.', country: 'S. Africa', case: 'Cardiac Consult', date: '5 hours ago' },
          ].map(req => (
            <div key={req.id} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-900">{req.patient}</h4>
                  <p className="text-[10px] font-medium text-slate-500 uppercase tracking-tighter">{req.country} • {req.case}</p>
                </div>
                <span className="text-[10px] text-slate-400 font-bold">{req.date}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button className="py-2 bg-emerald-600 text-white text-[10px] font-black uppercase rounded-lg">Response</button>
                <button className="py-2 bg-slate-100 text-slate-600 text-[10px] font-black uppercase rounded-lg">View Reports</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500">
      {user?.role === 'PATIENT' ? <PatientDashboard /> : <HospitalDashboard />}
    </div>
  );
};

const Building2 = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>
  </svg>
);

export default Dashboard;