import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../App';
import { Mail, Lock, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff, Home } from 'lucide-react';
import { authAPI } from '../services/api';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

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

        const roleMap: Record<string, string> = {
          super_admin: 'superadmin',
          hospital_admin: 'hospital',
          patient: 'patient',
        };
        const role = roleMap[user.role] ?? 'patient';

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ 
          name: user.name, 
          role,
          ...(role === 'hospital' && user.hospital_id ? { hospital_id: user.hospital_id } : {})
        }));

        login(user.name, role as any);

        if (from) {
          navigate(from, { replace: true });
        } else if (role === 'superadmin') {
          navigate('/superadmin', { replace: true });
        } else if (role === 'hospital') {
          navigate('/hospital', { replace: true });
        } else {
          navigate('/patient', { replace: true });
        }
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full py-12 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-end">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-emerald-600 font-bold text-sm hover:text-emerald-700 transition-colors">
            <Home className="w-4 h-4" /> Home
          </button>
        </div>
        
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
            <div className="relative">
              <input 
                required 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 pr-12 outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
                placeholder="••••••••" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
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
    </div>
  );
};

export default Login;
