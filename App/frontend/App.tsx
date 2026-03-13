import React, { useState, createContext, useContext, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Language, UserRole } from './types';
import { LANGUAGES, APP_ICONS } from './constants';
import Home from './pages/Home';
import Hospitals from './pages/Hospitals';
import HospitalsAdvanced from './pages/HospitalsAdvanced';
import HospitalDetail from './pages/HospitalDetail';
import Payment from './pages/Payment';
import Feedback from './pages/Feedback';

import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import PatientDashboard from './pages/PatientDashboard';
import Register from './pages/Register';
import PatientRegistration from './pages/PatientRegistration';
import Login from './pages/Login';
import VisaGuidance from './pages/VisaGuidance';
import DoctorProfile from './pages/DoctorProfile';
import Services from './pages/Services';
import Footer from './components/Footer';
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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  
  const isHospitalDashboard = location.pathname === '/hospital-dashboard';
  const isPatientDashboard = location.pathname === '/patient-dashboard';
  const isDashboardPage = isHospitalDashboard || isPatientDashboard;

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
    navItems.push({ path: '/dashboard', label: 'Dashboard', icon: APP_ICONS.Dashboard });
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
      {!isDashboardPage && (
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        {/* Top Navigation Bar */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="bg-emerald-600 p-1 rounded-lg text-white group-hover:scale-105 transition-transform">
                  {APP_ICONS.Health}
                </div>
                <span className="font-bold text-sm tracking-tight text-black">AfriHealth</span>
              </Link>
              
              <div className="hidden lg:flex items-center gap-4">
                <button className="text-black hover:text-slate-700 font-normal text-xs pb-1 border-b-2 border-transparent hover:border-emerald-600 transition-colors">For Patients</button>
                <Link to="/hospital-dashboard" className="text-black hover:text-slate-700 font-normal text-xs pb-1 border-b-2 border-transparent hover:border-emerald-600 transition-colors">For Hospitals</Link>
                <Link to="/patient-dashboard" className="text-black hover:text-slate-700 font-normal text-xs pb-1 border-b-2 border-transparent hover:border-emerald-600 transition-colors">Patient Portal</Link>
                <button className="text-black hover:text-slate-700 font-normal text-xs pb-1 border-b-2 border-transparent hover:border-emerald-600 transition-colors">Health Sciences University</button>
              </div>
            </div>

            <div className="flex items-center gap-4">
                           <Link to="/login" className="text-black hover:text-slate-700 font-normal text-sm pb-1 border-b-2 border-transparent hover:border-emerald-600 transition-colors">Sign In</Link>
              <div className="flex items-center gap-1 text-black text-xs">
                <Phone className="w-3 h-3" />
                <span className="font-normal">1-800-CEDARS-1</span>
              </div>
              <select 
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
                className="text-xs font-normal bg-transparent border-none outline-none cursor-pointer text-black"
              >
                {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.code}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="hidden md:flex items-center gap-6">
              <Link to="/services" className="text-black hover:text-slate-700 font-normal text-sm pb-1 border-b-2 border-transparent hover:border-emerald-600 transition-colors">Get Care</Link>
              <Link to="/hospitals" className="text-black hover:text-slate-700 font-normal text-sm pb-1 border-b-2 border-transparent hover:border-emerald-600 transition-colors">Find a Hospitals</Link>
              <Link to="/hospitals" className="text-black hover:text-slate-700 font-normal text-sm pb-1 border-b-2 border-transparent hover:border-emerald-600 transition-colors">Locations</Link>
              <Link to="/hospitals" className="text-black hover:text-slate-700 font-normal text-sm pb-1 border-b-2 border-transparent hover:border-emerald-600 transition-colors">Specialties</Link>
              <Link to="/payment" className="text-black hover:text-slate-700 font-normal text-sm pb-1 border-b-2 border-transparent hover:border-emerald-600 transition-colors">Records & Billing</Link>
            </div>

            <div className="flex items-center gap-4 ml-auto">
              <button className="hidden md:block px-5 py-2 bg-black text-white rounded text-sm font-bold hover:bg-slate-800 transition-colors">
                Make an Appointment
              </button>
              
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
      <main className={`flex-1 w-full ${!isDashboardPage ? 'mb-20 md:mb-0' : ''}`}>
        {children}
      </main>

      {!isDashboardPage && <Footer />}

      {/* Mobile Bottom Nav */}
      {!isDashboardPage && (
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
            to="/dashboard"
            className={`flex flex-col items-center gap-1 p-2 transition-all ${location.pathname === '/dashboard' ? 'text-emerald-600' : 'text-slate-400'}`}
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

  const login = (name: string, role: UserRole) => setUser({ name, role });
  const logout = () => setUser(null);

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
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
              <Route path="/patient-dashboard" element={<PatientDashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </Layout>
        </HashRouter>
      </LangContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
