import React, { useState, createContext, useContext, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { Language, UserRole } from './types';
import { LANGUAGES, APP_ICONS } from './constants';
import { authAPI } from './services/api';
import Home from './pages/Home';
import Hospitals from './pages/Hospitals';
import HospitalsAdvanced from './pages/HospitalsAdvanced';
import HospitalDetail from './pages/HospitalDetail';
import Payment from './pages/Payment';
import Feedback from './pages/Feedback';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import Dashboard from './pages/Dashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import PatientDashboard from './pages/PatientDashboard';
import PatientProfile from './pages/patient/PatientProfile';
import Register from './pages/Register';
import PatientRegistration from './pages/PatientRegistration';
import Login from './pages/Login';
import VisaGuidance from './pages/VisaGuidance';
import DoctorProfile from './pages/DoctorProfile';
import Services from './pages/Services';
import QuoteWizard from './pages/QuoteWizard';
import QuoteExtras from './pages/QuoteExtras';
import Locations from './pages/Locations';
import LocationDetail from './pages/LocationDetail';
import Specialties from './pages/Specialties';
import SpecialtyDetail from './pages/SpecialtyDetail';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import {
  Menu, X, User as UserIcon, LogOut, Settings,
  ChevronDown, Phone, Search, Headphones, HeartPulse,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Contexts
───────────────────────────────────────────── */
interface AuthContextType {
  user: { name: string; role: UserRole } | null;
  login: (name: string, role: UserRole) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType>({ user: null, login: () => {}, logout: () => {} });
export const useAuth = () => useContext(AuthContext);

interface LangContextType { lang: Language; setLang: (l: Language) => void; }
const LangContext = createContext<LangContextType>({ lang: 'EN', setLang: () => {} });
export const useLang = () => useContext(LangContext);

/* ─────────────────────────────────────────────
   ScrollToTop
───────────────────────────────────────────── */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

/* ─────────────────────────────────────────────
   NavLink helper – active underline indicator
───────────────────────────────────────────── */
const NavLink: React.FC<{ to: string; children: React.ReactNode; onClick?: () => void }> = ({ to, children, onClick }) => {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`relative text-sm font-medium transition-colors duration-150 pb-0.5
        ${active ? 'text-emerald-600' : 'text-slate-600 hover:text-slate-900'}
        after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full after:bg-emerald-500
        after:transition-all after:duration-200
        ${active ? 'after:w-full' : 'after:w-0 hover:after:w-full'}`}
    >
      {children}
    </Link>
  );
};

/* ─────────────────────────────────────────────
   Layout
───────────────────────────────────────────── */
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen]       = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen]   = useState(false);
  const [searchQuery, setSearchQuery]     = useState('');
  const [scrolled, setScrolled]           = useState(false);
  const { lang, setLang } = useLang();
  const { user, logout }  = useAuth();
  const location  = useLocation();
  const navigate  = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef   = useRef<HTMLInputElement>(null);

  const isDashboardPage   = ['/superadmin', '/hospital', '/patient'].some(p => location.pathname.startsWith(p));
  const hideHeaderFooter  = ['/login', '/register', '/patient-registration', '/hospital', '/patient'].includes(location.pathname)
    || location.pathname.startsWith('/hospital/')
    || location.pathname.startsWith('/patient/');

  /* scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* close dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* focus search input when opened */
  useEffect(() => {
    if (isSearchOpen && searchRef.current) searchRef.current.focus();
  }, [isSearchOpen]);

  /* close menu on route change */
  useEffect(() => { setIsMenuOpen(false); }, [location.pathname]);

  const mainNavLinks = [
    { path: '/',           label: 'Home' },
    { path: '/hospitals',  label: 'Hospitals' },
    { path: '/specialties',label: 'Treatments' },
    { path: '/visa',       label: 'Visa & Travel' },
    { path: '/services',   label: 'Assistance' },
    { path: '/about',      label: 'About' },
  ];

  const mobileNavItems = [
    { path: '/',          label: 'Home',      icon: APP_ICONS.Health },
    { path: '/hospitals', label: 'Hospitals', icon: APP_ICONS.Hospital },
    { path: '/visa',      label: 'Visa',      icon: APP_ICONS.Visa },
    { path: '/services',  label: 'Support',   icon: APP_ICONS.Hotel },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/hospitals?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const dashPath = user
    ? user.role === 'superadmin' ? '/superadmin' : user.role === 'hospital' ? '/hospital' : '/patient'
    : '/login';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">

      {/* ── Header ── */}
      {!hideHeaderFooter && (
        <header className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${scrolled ? 'shadow-md' : 'border-b border-slate-100'}`}>

          {/* ─ Top utility bar ─ */}
          <div className="border-b border-slate-100 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-9 flex items-center justify-between">

              {/* Brand */}
              <Link to="/" className="flex items-center gap-2 group shrink-0">
                <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center text-white
                                group-hover:bg-emerald-700 transition-colors duration-150 shadow-sm">
                  <HeartPulse className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm tracking-tight text-slate-900 hidden sm:block">
                  IMAP <span className="text-emerald-600">Solution</span>
                </span>
              </Link>

              {/* Right cluster */}
              <div className="flex items-center gap-3 text-xs text-slate-500">
                {/* Phone */}
                <a href="tel:+18005001234" className="hidden sm:flex items-center gap-1.5 hover:text-slate-800 transition-colors">
                  <Phone className="w-3 h-3 text-emerald-500" />
                  <span className="font-medium">+1-800-500-1234</span>
                </a>

                <span className="hidden sm:block text-slate-200">|</span>

                {/* Language */}
                <select
                  value={lang}
                  onChange={e => setLang(e.target.value as Language)}
                  className="bg-transparent border-none outline-none cursor-pointer text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  aria-label="Language"
                >
                  {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                </select>

                <span className="text-slate-200">|</span>

                {/* Auth */}
                {user ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(v => !v)}
                      className="flex items-center gap-1.5 font-semibold text-slate-700 hover:text-emerald-600 transition-colors"
                      aria-expanded={isDropdownOpen}
                      aria-haspopup="true"
                    >
                      {/* Avatar initials */}
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center justify-center select-none">
                        {user.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                      </span>
                      <span className="hidden sm:block max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in">
                        {/* User info header */}
                        <div className="px-4 py-2.5 border-b border-slate-100">
                          <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                          <p className="text-xs text-slate-400 capitalize mt-0.5">{user.role === 'superadmin' ? 'Super Admin' : user.role}</p>
                        </div>
                        <Link
                          to={user.role === 'patient' ? '/patient/profile' : dashPath}
                          onClick={() => {
                            setIsDropdownOpen(false);
                            if (user.role === 'hospital') window.dispatchEvent(new CustomEvent('navigateHospitalPage', { detail: 'profile' }));
                          }}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                        >
                          <UserIcon className="w-3.5 h-3.5 text-slate-400" /> My Profile
                        </Link>
                        <Link
                          to={dashPath}
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                        >
                          <Settings className="w-3.5 h-3.5 text-slate-400" /> Dashboard
                        </Link>
                        <div className="border-t border-slate-100 mt-1 pt-1">
                          <button
                            onClick={() => { logout(); setIsDropdownOpen(false); navigate('/login'); }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <LogOut className="w-3.5 h-3.5" /> Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link to="/login" className="font-semibold text-slate-700 hover:text-emerald-600 transition-colors">
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="px-3 py-1 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition-colors shadow-sm text-[11px] hidden sm:inline-flex"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ─ Main nav bar ─ */}
          <div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

              {/* Desktop nav links */}
              {!isDashboardPage && (
                <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
                  {mainNavLinks.map(l => (
                    <NavLink key={l.path} to={l.path}>{l.label}</NavLink>
                  ))}
                </nav>
              )}

              {/* Right actions */}
              <div className="flex items-center gap-2 ml-auto">

                {/* Search bar */}
                {isSearchOpen ? (
                  <form onSubmit={handleSearch} className="flex items-center gap-1.5 animate-in">
                    <input
                      ref={searchRef}
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search hospitals..."
                      className="w-48 px-3 py-1.5 text-sm border border-slate-200 rounded-lg bg-slate-50
                                 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                    />
                    <button type="submit" className="p-1.5 text-slate-500 hover:text-emerald-600 transition-colors">
                      <Search className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="hidden md:flex p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                    aria-label="Open search"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                )}

                {/* CTA buttons — desktop only, not on dashboard */}
                {!isDashboardPage && (
                  <>
                    <Link
                      to="/hospitals"
                      className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold
                                 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm hover:shadow-md"
                    >
                      <Search className="w-3.5 h-3.5" />
                      Find Hospitals
                    </Link>
                    <Link
                      to="/contact"
                      className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-sm font-semibold
                                 rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      <Headphones className="w-3.5 h-3.5" />
                      Support
                    </Link>
                  </>
                )}

                {/* Hamburger — mobile */}
                <button
                  onClick={() => setIsMenuOpen(v => !v)}
                  className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                  aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={isMenuOpen}
                >
                  {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* ── Mobile drawer ── */}
      {isMenuOpen && !hideHeaderFooter && (
        <div className="fixed inset-0 z-40 md:hidden" aria-modal="true" role="dialog">
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          {/* panel */}
          <div className="absolute top-0 right-0 h-full w-72 bg-white shadow-2xl flex flex-col animate-in">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <span className="font-bold text-slate-900">Menu</span>
              <button onClick={() => setIsMenuOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
              {mainNavLinks.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${location.pathname === item.path
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  {item.label}
                </Link>
              ))}
              {user && (
                <Link
                  to={dashPath}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Dashboard
                </Link>
              )}
            </nav>
            <div className="p-4 border-t border-slate-100 space-y-2">
              {user ? (
                <button
                  onClick={() => { logout(); setIsMenuOpen(false); navigate('/login'); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 text-red-600 font-semibold text-sm"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block text-center w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block text-center w-full px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700">
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Page content ── */}
      <main className={`flex-1 w-full ${!hideHeaderFooter ? 'pb-16 md:pb-0' : ''}`}>
        {children}
      </main>

      {!hideHeaderFooter && <Footer />}

      {/* ── Mobile bottom nav ── */}
      {!hideHeaderFooter && (
        <nav
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-slate-100
                     flex justify-around items-center px-2 py-1 safe-area-pb"
          style={{ boxShadow: '0 -4px 20px rgb(0 0 0 / .06)' }}
          aria-label="Mobile navigation"
        >
          {mobileNavItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all
                  ${active ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-700'}`}
              >
                <span className={`transition-transform duration-150 ${active ? 'scale-110' : ''}`}>
                  {item.icon}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider">{item.label}</span>
              </Link>
            );
          })}
          {user ? (
            <Link
              to={dashPath}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all
                ${isDashboardPage ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-700'}`}
            >
              <span className={`w-5 h-5 rounded-full bg-current/10 flex items-center justify-center text-[9px] font-black transition-transform duration-150 ${isDashboardPage ? 'scale-110' : ''}`}>
                {APP_ICONS.Dashboard}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider">Me</span>
            </Link>
          ) : (
            <Link to="/register" className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-slate-400 hover:text-slate-700">
              <UserIcon className="w-5 h-5" />
              <span className="text-[9px] font-bold uppercase tracking-wider">Join</span>
            </Link>
          )}
        </nav>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   App root
───────────────────────────────────────────── */
const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('EN');
  const [user, setUser] = useState<{ name: string; role: UserRole } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await authAPI.getProfile();
          if (res.success) {
            const roleMap: Record<string, string> = { super_admin: 'superadmin', hospital_admin: 'hospital', patient: 'patient' };
            const frontendRole = roleMap[res.data.user.role] ?? 'patient';
            if (frontendRole === 'hospital' && res.data.user.employee_position) {
              localStorage.setItem('employee_role', res.data.user.employee_position);
            } else if (frontendRole !== 'hospital') {
              localStorage.removeItem('employee_role');
            }
            setUser({ name: res.data.user.name, role: frontendRole as UserRole });
          }
        } catch {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login  = (name: string, role: UserRole) => setUser({ name, role });
  const logout = async () => {
    try { await authAPI.logout(); } catch { /* ignore */ }
    finally {
      ['token', 'user', 'employee_role'].forEach(k => localStorage.removeItem(k));
      setUser(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-md">
            <HeartPulse className="w-5 h-5 text-white" />
          </div>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <LangContext.Provider value={{ lang, setLang }}>
        <HashRouter>
          <ScrollToTop />
          <Layout>
            <Routes>
              <Route path="/"                    element={<Home />} />
              <Route path="/hospitals"           element={<Hospitals />} />
              <Route path="/hospitals-search"    element={<HospitalsAdvanced />} />
              <Route path="/hospital/:id"        element={<HospitalDetail />} />
              <Route path="/payment"             element={<Payment />} />
              <Route path="/feedback"            element={<Feedback />} />
              <Route path="/register"            element={<Register />} />
              <Route path="/patient-registration" element={<PatientRegistration />} />
              <Route path="/login"               element={<Login />} />
              <Route path="/visa"                element={<VisaGuidance />} />
              <Route path="/services"            element={<Services />} />
              <Route path="/quote"               element={<QuoteWizard />} />
              <Route path="/quote/extras"        element={<QuoteExtras />} />
              <Route path="/locations"           element={<Locations />} />
              <Route path="/locations/:city"     element={<LocationDetail />} />
              <Route path="/about"               element={<AboutUs />} />
              <Route path="/contact"             element={<Contact />} />
              <Route path="/specialties"         element={<Specialties />} />
              <Route path="/specialties/:type"   element={<SpecialtyDetail />} />
              <Route element={<ProtectedRoute role="superadmin" />}>
                <Route path="/superadmin" element={<SuperAdminDashboard />} />
              </Route>
              <Route element={<ProtectedRoute role="hospital" />}>
                <Route path="/hospital" element={<HospitalDashboard />} />
              </Route>
              <Route element={<ProtectedRoute role="patient" />}>
                <Route path="/patient"         element={<PatientDashboard />} />
                <Route path="/patient/profile" element={<PatientProfile />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </HashRouter>
      </LangContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
