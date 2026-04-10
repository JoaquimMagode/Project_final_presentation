import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../App';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck, Home } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      if (response.success) {
        const { user, token } = response.data;
        const roleMap: Record<string, string> = { super_admin: 'superadmin', hospital_admin: 'hospital', patient: 'patient' };
        const role = roleMap[user.role] ?? 'patient';
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ name: user.name, role, ...(role === 'hospital' && user.hospital_id ? { hospital_id: user.hospital_id } : {}) }));
        if (role === 'hospital') {
          user.employee_position ? localStorage.setItem('employee_role', user.employee_position) : localStorage.removeItem('employee_role');
        } else {
          localStorage.removeItem('employee_role');
        }
        login(user.name, role as any);
        if (from) navigate(from, { replace: true });
        else if (role === 'superadmin') navigate('/superadmin', { replace: true });
        else if (role === 'hospital') navigate('/hospital', { replace: true });
        else navigate('/patient', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:border-transparent transition-all placeholder-gray-400';

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 flex-col justify-between p-10 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full" />
          <div className="absolute top-1/3 -right-20 w-72 h-72 bg-white/5 rounded-full" />
          <div className="absolute -bottom-16 left-1/4 w-64 h-64 bg-white/5 rounded-full" />
        </div>

        {/* Logo */}
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">IMAP Solution</span>
          </div>
        </div>

        {/* Center content */}
        <div className="relative space-y-6">
          <div className="space-y-3">
            <h2 className="text-4xl font-black text-white leading-tight">
              Your Health,<br />Our Priority
            </h2>
            <p className="text-emerald-100 text-base leading-relaxed max-w-xs">
              Connect directly with India's top hospitals. No intermediaries, transparent pricing, world-class care.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            {[
              { value: '23+', label: 'Hospitals' },
              { value: '10K+', label: 'Patients' },
              { value: '15+', label: 'Cities' },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="text-xs text-emerald-200 mt-0.5 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative">
          <p className="text-emerald-200 text-xs">© 2025 IMAP Solution. All rights reserved.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2 lg:hidden">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-gray-900 text-sm">IMAP Solution</span>
          </div>
          <div className="ml-auto">
            <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 font-medium transition-colors">
              <Home className="w-4 h-4" /> Home
            </button>
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 overflow-y-auto">
          <div className="w-full max-w-sm space-y-4 py-4">
            {/* Heading */}
            <div>
              <h1 className="text-xl font-black text-gray-900">Welcome back</h1>
              <p className="text-xs text-gray-500 mt-0.5">Sign in to your account to continue</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    required type="email" value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={`${inputCls} pl-9`}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    required type={showPassword ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)}
                    className={`${inputCls} pl-9 pr-9`}
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{error}
                </div>
              )}

              <button
                type="submit" disabled={loading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50 active:scale-[0.98]"
              >
                {loading ? 'Signing in...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <p className="text-center text-xs text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-emerald-600 font-bold hover:underline">Sign up</Link>
            </p>

            <div className="flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-gray-300" />
              <span className="text-[10px] text-gray-300 font-semibold uppercase tracking-widest">256-bit Secure Encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
