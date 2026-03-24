import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../App';
import { Mail, Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { authAPI } from '../services/api';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await authAPI.login(email, password);
      
      if (response.success) {
        const { user, token } = response.data;
        
        // Store token in localStorage
        localStorage.setItem('token', token);
        
        // Update auth context
        login(user.name, user.role.toUpperCase());
        
        // Navigate to appropriate dashboard based on role
        if (user.role === 'patient') {
          navigate('/patient-dashboard', { replace: true });
        } else if (user.role === 'hospital_admin') {
          navigate('/hospital-dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-slate-900">Welcome Back</h1>
        <p className="text-slate-500 font-medium">Log in to your IMAP Solution secure portal.</p>
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
              placeholder="••••••••" 
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing In...' : 'Sign In'} <ArrowRight className="w-5 h-5" />
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
        <strong>Demo Credentials:</strong><br/>
        <button 
          type="button"
          onClick={() => handleDemoLogin('patient@demo.com', 'password')}
          className="text-emerald-700 hover:text-emerald-900 underline hover:no-underline transition-colors mr-4"
        >
          Patient: patient@demo.com
        </button>
        <button 
          type="button"
          onClick={() => handleDemoLogin('hospital@demo.com', 'password')}
          className="text-emerald-700 hover:text-emerald-900 underline hover:no-underline transition-colors mr-4"
        >
          Hospital: hospital@demo.com
        </button>
        <button 
          type="button"
          onClick={() => handleDemoLogin('admin@imapsolution.com', 'password')}
          className="text-emerald-700 hover:text-emerald-900 underline hover:no-underline transition-colors"
        >
          Admin: admin@imapsolution.com
        </button>
      </div>
    </div>
  );
};

export default Login;
