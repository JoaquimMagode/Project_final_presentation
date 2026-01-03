
import React, { useState } from 'react';
// Added missing Link import from react-router-dom
import { Link } from 'react-router-dom';
import { useAuth } from '../App';
import { APP_ICONS, MOCK_APPOINTMENTS, MOCK_VISA_APPS, MOCK_DOCTORS } from '../constants';
import { FileText, MessageCircle, Clock, CheckCircle2, AlertCircle, Plane, User, Calendar, Plus, Settings, ChevronRight, Upload } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  // Updated activeTab type to include 'REQUESTS' and 'AVAILABILITY' to fix comparison errors
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'REPORTS' | 'APPOINTMENTS' | 'VISA' | 'DOCTORS' | 'REQUESTS' | 'AVAILABILITY'>(
    user?.role === 'PATIENT' ? 'OVERVIEW' : 'DOCTORS'
  );

  const PatientDashboard = () => (
    <div className="space-y-8 pb-20">
      {/* Welcome Header */}
      <div className="bg-emerald-600 rounded-3xl p-6 text-white shadow-xl shadow-emerald-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Hello, {user?.name}</h1>
            <p className="text-emerald-100 text-sm font-medium">Patient ID: AF-2023-9021</p>
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Profile Status</span>
            <span className="text-sm font-black">85% Complete</span>
          </div>
          <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
            <div className="bg-white h-full w-[85%]" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {[
          { id: 'OVERVIEW', label: 'Overview', icon: APP_ICONS.Dashboard },
          { id: 'REPORTS', label: 'Reports', icon: APP_ICONS.Report },
          { id: 'APPOINTMENTS', label: 'Appointments', icon: APP_ICONS.Calendar },
          { id: 'VISA', label: 'Visa Status', icon: APP_ICONS.Visa },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-500'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center justify-between">
                Upcoming Appointment
                <Link to="/hospitals" className="text-emerald-600 text-[10px] font-black uppercase">Schedule New</Link>
              </h3>
              {MOCK_APPOINTMENTS.filter(a => a.status === 'Confirmed').map(app => (
                <div key={app.id} className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{app.doctorName}</p>
                    <p className="text-[10px] font-medium text-slate-500">{app.hospitalName} • {app.date}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center justify-between">
                Visa Application
                <span className="text-amber-600 text-[10px] font-black uppercase">In Progress</span>
              </h3>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                  <Plane className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Medical e-Visa</p>
                  <p className="text-[10px] font-medium text-slate-500">Submitted on {MOCK_VISA_APPS[0].submissionDate}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
            <Upload className="w-8 h-8 text-slate-300 mx-auto" />
            <div>
              <p className="font-bold text-slate-900">Medical Report Upload</p>
              <p className="text-xs text-slate-500">Upload your latest MRI/CT scan for doctor review.</p>
            </div>
            <button className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:border-emerald-500 transition-colors">Select Files</button>
          </div>
        </div>
      )}

      {activeTab === 'APPOINTMENTS' && (
        <div className="space-y-4">
          {MOCK_APPOINTMENTS.map(app => (
            <div key={app.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${app.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{app.doctorName}</h4>
                  <p className="text-xs text-slate-500">{app.hospitalName} • {app.date}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${app.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {app.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'VISA' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Application Journey</h3>
            <button className="text-emerald-600 text-xs font-bold">Need Help?</button>
          </div>
          
          <div className="space-y-6 relative">
            <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-100" />
            {[
              { label: 'Documents Uploaded', status: 'Completed', date: 'Oct 20' },
              { label: 'Hospital Invitation Letter Received', status: 'Completed', date: 'Oct 24' },
              { label: 'Visa Fees Paid', status: 'Completed', date: 'Oct 25' },
              { label: 'Indian Embassy Review', status: 'Processing', date: 'Expected Nov 05' },
              { label: 'Visa Grant', status: 'Pending', date: '-' },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-4 relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${
                  step.status === 'Completed' ? 'bg-emerald-500 text-white' : 
                  step.status === 'Processing' ? 'bg-amber-500 text-white animate-pulse' : 'bg-slate-200 text-slate-400'
                }`}>
                  {step.status === 'Completed' ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                </div>
                <div>
                  <p className={`text-sm font-bold ${step.status === 'Pending' ? 'text-slate-400' : 'text-slate-900'}`}>{step.label}</p>
                  <p className="text-[10px] font-medium text-slate-500 uppercase">{step.status} • {step.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'REPORTS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['ECG_October.pdf', 'Blood_Work.pdf', 'MRI_Brain_Scan.zip'].map((file, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between group hover:border-emerald-500 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-emerald-50">
                  <FileText className="w-5 h-5 text-slate-400 group-hover:text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700">{file}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-black">2.4 MB • Oct 12</p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-emerald-600 transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button className="col-span-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold text-sm flex items-center justify-center gap-2 hover:border-emerald-300 hover:text-emerald-600 transition-all">
            <Plus className="w-4 h-4" /> Upload New Report
          </button>
        </div>
      )}
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
              <h1 className="text-2xl font-black">Fortis Memorial</h1>
              <p className="text-slate-400 text-sm font-medium">Verified Medical Partner</p>
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
