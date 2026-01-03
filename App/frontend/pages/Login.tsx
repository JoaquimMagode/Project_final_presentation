
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../App';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock logic: if email contains 'hospital', log in as hospital
    const role = email.includes('hospital') ? 'HOSPITAL' : 'PATIENT';
    const name = role === 'HOSPITAL' ? 'Admin Hospital' : 'Samuel Mensah';
    login(name, role);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto py-12 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-slate-900">Welcome Back</h1>
        <p className="text-slate-500 font-medium">Log in to your AfriHealth secure portal.</p>
      </div>

      <form onSubmit={handleLogin} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Mail className="w-3 h-3" /> Email Address
            </label>
            <input 
              required 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
              placeholder="user@example.com" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Lock className="w-3 h-3" /> Password
            </label>
            <input 
              required 
              type="password" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
              placeholder="••••••••" 
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          Sign In <ArrowRight className="w-5 h-5" />
        </button>

        <div className="text-center">
          <p className="text-sm text-slate-500">
            Don't have an account? <Link to="/register" className="text-emerald-600 font-bold hover:underline">Sign up</Link>
          </p>
        </div>

        <div className="pt-4 border-t border-slate-50 flex items-center gap-2 justify-center">
          <ShieldCheck className="w-4 h-4 text-slate-300" />
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Secure 256-bit Encryption</span>
        </div>
      </form>
      
      <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-xs text-emerald-800 font-medium">
        <strong>Demo Note:</strong> Use an email containing 'hospital' to log in as a Hospital Admin.
      </div>
    </div>
  );
};

export default Login;
