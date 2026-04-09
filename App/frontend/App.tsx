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
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { Menu, X, User as UserIcon, LogOut, Settings, AlertTriangle, ChevronDown, Phone, Search } from 'lucide-react';

// Auth & Language Context
interface AuthContextType {
  user: { name: string; role: UserRole } | null;
  login: (name: string, role: UserRole) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType>({ user: null, login: () => {}, logout: () => {} });
export const useAuth = () => useContext(AuthContext);

interface LangContextType {
  lang: Language;
  setLang: (l: Language) => void;
}
const LangContext = createContext<LangContextType>({ lang: 'EN', setLang: () => {} });
export const useLang = () => useContext(LangContext);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { lang, setLang } = useLang();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  
  const isDashboardPage = ['/superadmin', '/hospital', '/patient'].includes(location.pathname);
  const hideHeaderFooter = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/patient-registration';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isSearchOpen]);

  const navItems = [
    { path: '/', label: 'Home', icon: APP_ICONS.Health },
    { path: '/hospitals', label: 'Hospitals', icon: APP_ICONS.Hospital },
    { path: '/visa', label: 'Visa Info', icon: APP_ICONS.Visa },
    { path: '/services', label: 'Assistance', icon: APP_ICONS.Hotel },
  ];

  if (user) {
    const dashPath = user.role === 'superadmin' ? '/superadmin' : user.role === 'hospital' ? '/hospital' : '/patient';
    navItems.push({ path: dashPath, label: 'Dashboard', icon: APP_ICONS.Dashboard });
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Header - Cedars-Sinai Style */}
      {!hideHeaderFooter && (
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        {/* Top Navigation Bar */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="bg-emerald-600 p-1 rounded-lg text-white group-hover:scale-105 transition-transform">
                  {APP_ICONS.Health}
                </div>
                <span className="font-bold text-sm tracking-tight text-black">IMAP Solution</span>
              </Link>
              
              <div className="hidden lg:flex items-center gap-4">
                <Link to="/hospital" className="text-black hover:text-slate-700 font-normal text-xs pb-1 border-b-2 border-transparent hover:border-emerald-600 transition-colors">For Hospitals</Link>
                <Link to="/patient" className="text-black hover:text-slate-700 font-normal text-xs pb-1 border-b-2 border-transparent hover:border-emerald-600 transition-colors">Patient Portal</Link>
                <Link to="/superadmin" className="text-black hover:text-slate-700 font-normal text-xs pb-1 border-b-2 border-transparent hover:border-emerald-600 transition-colors">Super Admin</Link>
              </div>
            </div>

            

            <div className="flex items-center gap-4">

                 <select 
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
                className="text-xs font-normal bg-transparent border-none outline-none cursor-pointer text-black"
              >
                {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.code}</option>)}
              </select>

              <div className="flex items-center gap-1 text-black text-xs">
                <Phone className="w-3 h-3" />
                <span className="font-normal">1-800-CEDARS-1</span>
              </div>
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-black hover:text-slate-700 font-normal border-b-2 border-transparent hover:border-emerald-600 transition-colors"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>{user.name}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <Link 
                        to={user.role === 'superadmin' ? '/superadmin' : user.role === 'hospital' ? '/hospital' : '/patient'}
                        onClick={() => setIsDropdownOpen(false)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <button 
                        onClick={() => setIsDropdownOpen(false)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        Support
                      </button>
                      <hr className="my-1" />
                      <button 
                        onClick={() => {
                          logout();
                          setIsDropdownOpen(false);
                          navigate('/login');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="text-black hover:text-slate-700 font-normal text-sm pb-1 border-b-2 border-transparent hover:border-emerald-600 transition-colors">Sign In</Link>
              )}
             
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-6">
              {isDashboardPage && user && (
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('toggleSidebar'))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Menu className="w-5 h-5 text-gray-600" />
                </button>
              )}
              {!isDashboardPage && (
                <div className="hidden md:flex items-center gap-6">
                  <Link to="/services" className="text-black hover:text-slate-700 font-normal text-sm pb-1 border-b-2 border-transparent hover:border-emerald-600 transition-colors">Get Care</Link>
                  <Link to="/hospitals" className="text-black hover:text-slate-700 font-normal text-sm pb-1 border-b-2 border-transparent hover:border-emerald-600 transition-colors">Find a Hospitals</Link>
                  <Link to="/locations" className="text-black hover:text-slate-700 font-normal text-sm pb-1 border-b-2 border-transparent hover:border-emerald-600 transition-colors">Locations</Link>
                  <Link to="/specialties" className="text-black hover:text-slate-700 font-normal text-sm pb-1 border-b-2 border-transparent hover:border-emerald-600 transition-colors">Specialties</Link>
                  <Link to="/payment" className="text-black hover:text-slate-700 font-normal text-sm pb-1 border-b-2 border-transparent hover:border-emerald-600 transition-colors">Records & Billing</Link>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 ml-auto">
              {!isDashboardPage && (
                <button className="hidden md:block px-5 py-2 bg-black text-white rounded text-sm font-bold hover:bg-slate-800 transition-colors">
                  Make an Appointment
                </button>
              )}
              
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="px-3 py-2 border border-slate-300 rounded text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                  />
                  <button type="submit" className="p-2 text-black hover:text-slate-700">
                    <Search className="w-4 h-4" />
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="p-2 text-black hover:text-slate-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-black hover:text-slate-700"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
              
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-black md:hidden"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>
      )}

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white md:hidden pt-20">
          <nav className="flex flex-col p-6 gap-6">
            {navItems.map(item => (
              <Link 
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-4 text-xl font-semibold text-slate-800 border-b border-slate-50 pb-4"
              >
                <span className="text-emerald-600">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            {!user && (
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-xl font-semibold text-emerald-600">Login</Link>
            )}
          </nav>
        </div>
      )}

      {/* Content Area */}
      <main className={`flex-1 w-full ${!hideHeaderFooter ? 'mb-20 md:mb-0' : ''}`}>
        {children}
      </main>

      {!hideHeaderFooter && <Footer />}

      {/* Mobile Bottom Nav */}
      {!hideHeaderFooter && (
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 flex justify-around items-center py-2 md:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        {navItems.slice(0, 4).map(item => (
          <Link 
            key={item.path} 
            to={item.path}
            className={`flex flex-col items-center gap-1 p-2 transition-all ${location.pathname === item.path ? 'text-emerald-600 scale-105' : 'text-slate-400'}`}
          >
            {item.icon}
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
          </Link>
        ))}
        {user ? (
          <Link
            to={user.role === 'superadmin' ? '/superadmin' : user.role === 'hospital' ? '/hospital' : '/patient'}
            className={`flex flex-col items-center gap-1 p-2 transition-all ${isDashboardPage ? 'text-emerald-600' : 'text-slate-400'}`}
          >
            {APP_ICONS.Dashboard}
            <span className="text-[10px] font-bold uppercase tracking-wider">Profile</span>
          </Link>
        ) : (
          <Link 
            to="/register"
            className="flex flex-col items-center gap-1 p-2 text-slate-400"
          >
            <UserIcon className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Join</span>
          </Link>
        )}
      </nav>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('EN');
  const [user, setUser] = useState<{ name: string; role: UserRole } | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authAPI.getProfile();
          if (response.success) {
            const roleMap: Record<string, string> = {
              super_admin: 'superadmin',
              hospital_admin: 'hospital',
              patient: 'patient',
            };
            const frontendRole = roleMap[response.data.user.role] ?? 'patient';
            
            setUser({
              name: response.data.user.name,
              role: frontendRole as UserRole
            });
          }
        } catch (error) {
          // Token is invalid, remove it
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = (name: string, role: UserRole) => setUser({ name, role });
  
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Ignore logout errors
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <LangContext.Provider value={{ lang, setLang }}>
        <HashRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/hospitals" element={<Hospitals />} />
              <Route path="/hospitals-search" element={<HospitalsAdvanced />} />
              <Route path="/hospital/:id" element={<HospitalDetail />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/register" element={<Register />} />
              <Route path="/patient-registration" element={<PatientRegistration />} />
              <Route path="/login" element={<Login />} />
              <Route path="/visa" element={<VisaGuidance />} />
              <Route path="/services" element={<Services />} />
              <Route path="/quote" element={<QuoteWizard />} />
              <Route path="/quote/extras" element={<QuoteExtras />} />
              <Route path="/locations" element={<Locations />} />
              <Route path="/locations/:city" element={<LocationDetail />} />
              <Route path="/specialties" element={<Specialties />} />
              <Route path="/specialties/:type" element={<SpecialtyDetail />} />
              <Route element={<ProtectedRoute role="superadmin" />}>
                <Route path="/superadmin" element={<SuperAdminDashboard />} />
              </Route>
              <Route element={<ProtectedRoute role="hospital" />}>
                <Route path="/hospital" element={<HospitalDashboard />} />
              </Route>
              <Route element={<ProtectedRoute role="patient" />}>
                <Route path="/patient" element={<PatientDashboard />} />
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
