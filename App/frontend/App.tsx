
import React, { useState, createContext, useContext, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Language, UserRole } from './types';
import { LANGUAGES, APP_ICONS } from './constants';
import Home from './pages/Home';
import Hospitals from './pages/Hospitals';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Login from './pages/Login';
import VisaGuidance from './pages/VisaGuidance';
import DoctorProfile from './pages/DoctorProfile';
import Services from './pages/Services';
import Footer from './components/Footer';
import { Menu, X, User as UserIcon, LogOut } from 'lucide-react';

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
  const { lang, setLang } = useLang();
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: APP_ICONS.Health },
    { path: '/hospitals', label: 'Hospitals', icon: APP_ICONS.Hospital },
    { path: '/visa', label: 'Visa Info', icon: APP_ICONS.Visa },
    { path: '/services', label: 'Assistance', icon: APP_ICONS.Hotel },
  ];

  if (user) {
    navItems.push({ path: '/dashboard', label: 'Dashboard', icon: APP_ICONS.Dashboard });
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-emerald-600 p-1.5 rounded-lg text-white group-hover:scale-105 transition-transform">
            {APP_ICONS.Health}
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900">AfriHealth</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`text-sm font-medium transition-colors ${location.pathname === item.path ? 'text-emerald-600' : 'text-slate-500 hover:text-emerald-500'}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={lang}
            onChange={(e) => setLang(e.target.value as Language)}
            className="text-xs font-semibold bg-slate-100 border-none rounded-full px-2 py-1 outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.code}</option>)}
          </select>
          
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden lg:block text-xs font-bold text-slate-500">{user.name}</span>
              <button onClick={logout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-emerald-600 hidden md:block">Login</Link>
              <Link to="/register" className="hidden md:block px-4 py-2 bg-emerald-600 text-white rounded-full text-sm font-bold hover:bg-emerald-700 shadow-sm transition-all active:scale-95">
                Join
              </Link>
            </>
          )}

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-slate-500 md:hidden"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        </div>
      </header>

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
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 mb-20 md:mb-0">
        {children}
      </main>

      <Footer />

      {/* Mobile Bottom Nav */}
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
              <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/visa" element={<VisaGuidance />} />
              <Route path="/services" element={<Services />} />
              <Route path="/doctors/:id" element={<DoctorProfile />} />
            </Routes>
          </Layout>
        </HashRouter>
      </LangContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
