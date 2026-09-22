import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../App';
import {
  Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight,
  HeartPulse, Home, ShieldCheck,
} from 'lucide-react';
import { authAPI } from '../services/api';

/* ── Social proof avatars (Unsplash stock portraits) ── */
const PROOF = [
  { initials: 'AO', src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&q=80' },
  { initials: 'MK', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=96&q=80' },
  { initials: 'JD', src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=96&q=80' },
];

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38Z" />
    </svg>
  );
}

const Login: React.FC = () => {
  const { login }   = useAuth();
  const navigate    = useNavigate();
  const location    = useLocation();
  const from        = (location.state as any)?.from;

  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 sm:p-6">
      <div className="w-full max-w-4xl">

        {/* top bar (mobile brand + home) */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 lg:opacity-0">
            <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center">
              <HeartPulse className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-sm">IMAP Solution</span>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-emerald-600 font-medium transition-colors"
          >
            <Home className="w-4 h-4" /> Home
          </button>
        </div>

        {/* ── Split card ── */}
        <div className="grid md:grid-cols-2 rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">

          {/* Brand panel */}
          <div className="relative hidden md:flex flex-col justify-between p-10 overflow-hidden
                          bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 -left-20 w-56 h-56 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Logo */}
            <div className="relative flex items-center gap-2.5">
              <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <HeartPulse className="w-5 h-5 text-white" />
              </div>
              <span className="text-base font-bold tracking-tight">
                IMAP <span className="text-emerald-400">Solution</span>
              </span>
            </div>

            <h2 className="relative mt-auto max-w-[16ch] text-[26px] leading-[1.15] font-bold tracking-tight">
              Your health, <span className="text-emerald-400">our priority.</span>
            </h2>

            <p className="relative mt-3 text-sm text-slate-400 leading-relaxed max-w-xs">
              Connect directly with India's top hospitals. Transparent pricing, no intermediaries, world-class care.
            </p>

            {/* Social proof */}
            <div className="relative mt-8 flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {PROOF.map(p => (
                  <div key={p.initials} className="w-7 h-7 rounded-full ring-2 ring-emerald-500/60 overflow-hidden bg-emerald-900">
                    <img src={p.src} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <span className="text-xs text-slate-400">Join 40,000+ patients on IMAP</span>
            </div>
          </div>

          {/* Form panel */}
          <div className="flex flex-col justify-center gap-5 p-8 sm:p-10">
            <div className="flex flex-col gap-1">
              <span className="text-xl font-bold text-slate-900">Welcome back</span>
              <span className="text-sm text-slate-500">Sign in to your IMAP Solution account.</span>
            </div>

            {/* Google */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-slate-200
                         text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            {/* divider */}
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-slate-200" />
              <span className="text-[11px] uppercase text-slate-400 tracking-wide">or</span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="ss-email" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="ss-email"
                    required type="email" value={email}
                    onChange={e => { setEmail(e.target.value); if (error) setError(''); }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-3 py-2.5 text-sm text-slate-900
                               placeholder-slate-400 outline-none transition-all focus:ring-2 focus:ring-emerald-400 focus:border-transparent focus:bg-white"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="ss-password" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Password
                  </label>
                  <button type="button" className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="ss-password"
                    required type={showPassword ? 'text' : 'password'} value={password}
                    onChange={e => { setPassword(e.target.value); if (error) setError(''); }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-10 py-2.5 text-sm text-slate-900
                               placeholder-slate-400 outline-none transition-all focus:ring-2 focus:ring-emerald-400 focus:border-transparent focus:bg-white"
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
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg
                           flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md
                           disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>Sign in <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500">
              No account?{' '}
              <Link to="/register" className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors">
                Start free
              </Link>
            </p>

            <div className="flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-300" />
              <span className="text-[11px] text-slate-400 font-medium">256-bit encrypted · HIPAA &amp; GDPR compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
