import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../App';
import {
  Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight,
  HeartPulse, Home, ShieldCheck, Users, Building2, Globe2,
} from 'lucide-react';
import { authAPI } from '../services/api';

/* ─── Left panel stat tiles ─── */
const STATS = [
  { value: '50+',  label: 'Verified Hospitals', icon: <Building2 className="w-4 h-4" /> },
  { value: '10K+', label: 'Patients Helped',    icon: <Users className="w-4 h-4" />     },
  { value: '30+',  label: 'Countries',          icon: <Globe2 className="w-4 h-4" />    },
];

const Login: React.FC = () => {
  const { login }   = useAuth();
  const navigate    = useNavigate();
  const location    = useLocation();
  const from        = (location.state as any)?.from;

  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      if (response.success) {
        const { user, token } = response.data;
        const roleMap: Record<string, string> = {
          super_admin: 'superadmin', hospital_admin: 'hospital', patient: 'patient',
        };
        const role = roleMap[user.role] ?? 'patient';
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({
          name: user.name, role,
          ...(role === 'hospital' && user.hospital_id ? { hospital_id: user.hospital_id } : {}),
        }));
        if (role === 'hospital') {
          user.employee_position
            ? localStorage.setItem('employee_role', user.employee_position)
            : localStorage.removeItem('employee_role');
        } else {
          localStorage.removeItem('employee_role');
        }
        login(user.name, role as any);
        if (from)             navigate(from,          { replace: true });
        else if (role === 'superadmin') navigate('/superadmin', { replace: true });
        else if (role === 'hospital')   navigate('/hospital',   { replace: true });
        else                            navigate('/patient',    { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const inputBase = `w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm
    text-slate-900 placeholder-slate-400 outline-none transition-all
    focus:ring-2 focus:ring-emerald-400 focus:border-transparent focus:bg-white`;

  return (
    <div className="h-screen flex overflow-hidden">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-[45%] flex-col justify-between p-10 relative overflow-hidden
                      bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950">
        {/* decorative blobs */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-5 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <HeartPulse className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">
            IMAP <span className="text-emerald-400">Solution</span>
          </span>
        </div>

        {/* Center content */}
        <div className="relative space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-xs font-semibold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Trusted by patients across Africa
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight">
              Your Health,<br />
              <span className="text-emerald-400">Our Priority.</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Connect directly with India's top hospitals. Transparent pricing, no intermediaries, world-class care.
            </p>
          </div>

          {/* Stat tiles */}
          <div className="grid grid-cols-3 gap-3">
            {STATS.map(s => (
              <div key={s.label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center space-y-1">
                <div className="flex justify-center text-emerald-400">{s.icon}</div>
                <p className="text-xl font-black text-white">{s.value}</p>
                <p className="text-[10px] text-slate-500 font-medium leading-tight">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Testimonial snippet */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-sm text-slate-300 leading-relaxed italic">
              "IMAP connected me directly to Apollo Hospital. No stress, no agents — just care."
            </p>
            <p className="text-xs text-slate-500 mt-2 font-medium">— Obinna K., Lagos</p>
          </div>
        </div>

        <p className="relative text-slate-600 text-xs">© {new Date().getFullYear()} IMAP Solution. All rights reserved.</p>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* top bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 flex-shrink-0">
          {/* mobile brand */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center">
              <HeartPulse className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-sm">IMAP Solution</span>
          </div>
          <div className="ml-auto">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-emerald-600 font-medium transition-colors"
            >
              <Home className="w-4 h-4" /> Home
            </button>
          </div>
        </div>

        {/* form area */}
        <div className="flex-1 flex items-center justify-center px-6 overflow-y-auto">
          <div className="w-full max-w-sm space-y-5 py-6">

            {/* heading */}
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
              <p className="text-sm text-slate-500 mt-1">Sign in to your IMAP Solution account</p>
            </div>

            {/* form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    required type="email" value={email}
                    onChange={e => { setEmail(e.target.value); if (error) setError(''); }}
                    className={`${inputBase} pl-10`}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Password
                  </label>
                  <button type="button" className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    required type={showPassword ? 'text' : 'password'} value={password}
                    onChange={e => { setPassword(e.target.value); if (error) setError(''); }}
                    className={`${inputBase} pl-10 pr-10`}
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl
                           flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md
                           disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>Sign In <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            {/* divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100" /></div>
              <div className="relative flex justify-center text-xs text-slate-400 bg-white px-3">or</div>
            </div>

            <p className="text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors">
                Sign up free
              </Link>
            </p>

            {/* trust note */}
            <div className="flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-300" />
              <span className="text-[11px] text-slate-400 font-medium">256-bit encrypted · HIPAA & GDPR compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
