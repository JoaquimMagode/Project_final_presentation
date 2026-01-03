
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../App';
import { ShieldCheck, ArrowLeft, Upload, User, Building2 } from 'lucide-react';
import { UserRole } from '../types';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState<UserRole>('PATIENT');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(role === 'PATIENT' ? 'New Patient' : 'New Hospital', role);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 font-bold text-sm hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Go Back
      </button>

      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900">Create Account</h1>
        <p className="text-slate-500 font-medium">Join AfriHealth to start your direct medical journey.</p>
      </div>

      <div className="flex gap-4 p-1 bg-slate-100 rounded-2xl">
        <button 
          onClick={() => setRole('PATIENT')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${role === 'PATIENT' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
        >
          <User className="w-4 h-4" /> I'm a Patient
        </button>
        <button 
          onClick={() => setRole('HOSPITAL')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${role === 'HOSPITAL' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
        >
          <Building2 className="w-4 h-4" /> I'm a Hospital
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500">{role === 'PATIENT' ? 'First Name' : 'Hospital Name'}</label>
              <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all" placeholder={role === 'PATIENT' ? 'John' : 'City General'} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500">{role === 'PATIENT' ? 'Last Name' : 'City'}</label>
              <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all" placeholder={role === 'PATIENT' ? 'Doe' : 'Mumbai'} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500">Email Address</label>
            <input required type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all" placeholder="name@email.com" />
          </div>

          {role === 'PATIENT' && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-500">Country of Residence</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all">
                  <option>Nigeria</option>
                  <option>Mozambique</option>
                  <option>Kenya</option>
                  <option>Ghana</option>
                  <option>South Africa</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-500">WhatsApp Number</label>
                <input required type="tel" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all" placeholder="+234 ..." />
              </div>
            </>
          )}

          {role === 'HOSPITAL' && (
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500">License / Accreditation ID</label>
              <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all" placeholder="JCI-XXXX-XXXX" />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500">Upload Verification Docs</label>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center gap-2 hover:border-emerald-300 transition-colors cursor-pointer bg-slate-50/50">
              <Upload className="w-8 h-8 text-slate-300" />
              <p className="text-xs font-bold text-slate-400">PDF or JPG (ID / Medical Reports)</p>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 active:scale-[0.98] transition-all"
        >
          {role === 'PATIENT' ? 'Register & Submit Case' : 'Register Hospital'}
        </button>

        <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
          <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
            Your data is stored securely and only shared with verified partners. We follow HIPAA and GDPR guidelines for medical data privacy.
          </p>
        </div>

        <div className="text-center text-sm">
          <p className="text-slate-500">Already have an account? <Link to="/login" className="text-emerald-600 font-bold">Log in</Link></p>
        </div>
      </form>
    </div>
  );
};

export default Register;
