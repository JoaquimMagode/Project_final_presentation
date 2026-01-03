import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';
import { APP_ICONS, MOCK_APPOINTMENTS, MOCK_VISA_APPS, MOCK_DOCTORS } from '../constants';
import { FileText, MessageCircle, Clock, CheckCircle2, AlertCircle, Plane, User, Calendar, Plus, Settings, ChevronRight, Upload, Heart, Activity, Droplets, Thermometer } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'OVERVIEW' | 'APPOINTMENT' | 'HEALTH_REPORTS' | 'MEDICAL_HISTORY' | 'UPCOMING_TEST' | 'DOCTOR_NOTES' | 'DOCTORS' | 'REQUESTS' | 'AVAILABILITY'>(
    user?.role === 'PATIENT' ? 'DASHBOARD' : 'DOCTORS'
  );

  const PatientDashboard = () => (
    <div className="flex">
      <div className="w-64 bg-white border-r border-slate-200 min-h-screen p-4">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-teal-700">AfriHealth</h2>
        </div>
        
        <nav className="space-y-2">
          {[
            { id: 'DASHBOARD', label: 'Dashboard', icon: '📊' },
            { id: 'OVERVIEW', label: 'Overview', icon: '👁️' },
            { id: 'APPOINTMENT', label: 'Appointment', icon: '📅' },
            { id: 'HEALTH_REPORTS', label: 'Health Reports', icon: '📋' },
            { id: 'MEDICAL_HISTORY', label: 'Medical History', icon: '🏥' },
            { id: 'UPCOMING_TEST', label: 'Upcoming Test', icon: '🧪' },
            { id: 'DOCTOR_NOTES', label: 'Doctor Notes', icon: '📝' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === item.id ? 'bg-teal-700 text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 p-6 bg-slate-50">
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-slate-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
                  <p className="text-slate-500">28 year | male</p>
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex gap-4">
                      <span className="text-slate-600">Patient ID: AF-2023-9021</span>
                      <span className="text-slate-600">Blood Group: O+</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-slate-600">BMI: 24.5</span>
                      <span className="text-slate-600">Height: 5.8 ft</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-slate-600">Weight: 75 kg</span>
                      <span className="text-slate-600">Contact: +234-803-456-7890</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-orange-500">Vital Signs</h3>
                <select className="text-sm border border-slate-200 rounded-lg px-3 py-1">
                  <option>Jan 2024</option>
                </select>
              </div>
              
              <div className="grid grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Droplets className="w-4 h-4 text-orange-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-600">Blood Sugar</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">80 <span className="text-sm text-slate-500">mg / dL</span></div>
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">Normal</span>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                      <Heart className="w-4 h-4 text-pink-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-600">Heart rate</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">98 <span className="text-sm text-slate-500">BPM</span></div>
                  <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">Normal</span>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                      <Activity className="w-4 h-4 text-teal-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-600">Blood Pressure</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">90 <span className="text-sm text-slate-500">/ 72 mmhg</span></div>
                  <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded">Normal</span>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <Droplets className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-600">Hemoglobin</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">14 <span className="text-sm text-slate-500">g/d</span></div>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Normal</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-orange-500">Health Reports</h3>
                  <button className="text-sm text-blue-600 hover:underline">View All</button>
                </div>
                <p className="text-xs text-slate-500 mb-4">1-7 March 2024</p>
                
                <div className="space-y-3">
                  {[
                    { name: 'Medical Check Up Report.pdf', size: '2 MB', icon: '📄' },
                    { name: 'Blood Count Report.docx', size: '1 MB', icon: '📄' },
                    { name: 'Heart ECG Report.docx', size: '1 MB', icon: '📄' },
                    { name: 'MRI of brain Report.png', size: '25.8 MB', icon: '🖼️' }
                  ].map((report, i) => (
                    <div key={i} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded">
                      <div className="flex items-center gap-2">
                        <span>{report.icon}</span>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{report.name}</p>
                          <p className="text-xs text-slate-500">{report.size}</p>
                        </div>
                      </div>
                      <button className="text-slate-400 hover:text-slate-600">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-orange-500">Medical History</h3>
                  <button className="text-sm text-blue-600 hover:underline">View All</button>
                </div>
                <p className="text-xs text-slate-500 mb-4">1-7 March 2024</p>
                
                <div className="space-y-3">
                  {[
                    { condition: 'Covid-19', doctor: 'Dr. Arjun Sharma', icon: '🦠' },
                    { condition: 'Surgery for Appendicitis', doctor: 'Dr. Sushant Seth', icon: '🏥' },
                    { condition: 'Pranine Inspection', doctor: 'Dr. Nitin Kumawat', icon: '🔍' },
                    { condition: 'Ankle Fracture', doctor: 'Dr. Vasishta Gupta', icon: '🦴' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded">
                      <div className="flex items-center gap-2">
                        <span>{item.icon}</span>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{item.condition}</p>
                          <p className="text-xs text-slate-500">{item.doctor}</p>
                        </div>
                      </div>
                      <button className="text-slate-400 hover:text-slate-600">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-orange-500">Upcoming Test</h3>
                  <button className="text-sm text-blue-600 hover:underline">View All</button>
                </div>
                
                <div className="space-y-3">
                  {[
                    { test: 'ECG Test', frequency: 'Every Month', date: '20/04/24', color: 'bg-green-100 text-green-700' },
                    { test: 'Blood Test', frequency: 'Every Month', date: '20/04/24', color: 'bg-red-100 text-red-700' },
                    { test: 'Diagnosis Test', frequency: 'Every Month', date: '20/04/24', color: 'bg-green-100 text-green-700' },
                    { test: 'Urine Test', frequency: 'Every Month', date: '20/04/24', color: 'bg-yellow-100 text-yellow-700' }
                  ].map((test, i) => (
                    <div key={i} className="flex items-center justify-between p-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${test.color}`}>
                          <span className="text-sm">🧪</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{test.test}</p>
                          <p className="text-xs text-slate-500">{test.frequency}</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-slate-900">{test.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'HEALTH_REPORTS' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-orange-500 mb-4">Health Reports</h3>
            <div className="space-y-4">
              {[
                { name: 'Medical Check Up Report.pdf', size: '2 MB', date: '1-7 March 2024' },
                { name: 'Blood Count Report.docx', size: '1 MB', date: '1-7 March 2024' },
                { name: 'Heart ECG Report.docx', size: '1 MB', date: '1-7 March 2024' },
                { name: 'MRI of brain Report.png', size: '25.8 MB', date: '1-7 March 2024' }
              ].map((report, i) => (
                <div key={i} className="p-4 border border-slate-200 rounded-lg">
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
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-orange-500 mb-4">Appointments</h3>
            <div className="space-y-4">
              {MOCK_APPOINTMENTS.map(app => (
                <div key={app.id} className="p-4 border border-slate-200 rounded-lg">
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