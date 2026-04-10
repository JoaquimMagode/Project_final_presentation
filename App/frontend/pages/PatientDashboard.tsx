import React, { useState, useEffect, useRef } from 'react';
import {
  HiOutlineHome, HiOutlineCalendarDays, HiOutlineCreditCard, HiOutlineDocumentText,
  HiOutlineCog6Tooth, HiOutlineQuestionMarkCircle, HiOutlinePhone,
  HiOutlineChevronRight, HiOutlineCheckCircle, HiOutlineClock,
  HiOutlineExclamationCircle, HiOutlineMagnifyingGlass, HiOutlineBell,
  HiOutlineChevronDown, HiOutlineUser, HiOutlineArrowRightOnRectangle,
  HiOutlineCloudArrowUp,
} from 'react-icons/hi2';
import { HeartPulse } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';
import PatientRegistration from './patient/PatientRegistration';
import MedicalReports from './patient/MedicalReports';
import AppointmentRequests from './patient/AppointmentRequests';
import PatientSettings from './patient/PatientSettings';
import PatientHelp from './patient/PatientHelp';
import Billing from './patient/Billing';

type Page = 'dashboard' | 'registration' | 'reports' | 'appointments' | 'billing' | 'settings' | 'help';

const sidebarGroups = [
  {
    label: 'Main',
    items: [
      { page: 'dashboard' as Page, icon: HiOutlineHome, label: 'Home' },
      { page: 'appointments' as Page, icon: HiOutlineCalendarDays, label: 'Appointments' },
      { page: 'billing' as Page, icon: HiOutlineCreditCard, label: 'Records & Billing' },
      { page: 'reports' as Page, icon: HiOutlineDocumentText, label: 'My Reports' },
    ],
  },
  {
    label: 'Other',
    items: [
      { page: 'settings' as Page, icon: HiOutlineCog6Tooth, label: 'Settings' },
      { page: 'help' as Page, icon: HiOutlineQuestionMarkCircle, label: 'Help' },
    ],
  },
];

const upcomingAppointments = [
  { hospital: 'Apollo Hospital Mumbai', type: 'Cardiology Consultation', date: 'Jan 20, 2024', time: '10:00 AM', status: 'confirmed' },
  { hospital: 'Fortis Delhi', type: 'General Check-up', date: 'Jan 22, 2024', time: '2:30 PM', status: 'pending' },
];

const PatientDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const firstName = user?.name?.split(' ')[0] ?? 'Patient';
  const fullName = user?.name ?? 'Patient';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    const handleToggle = () => setSidebarOpen(p => !p);
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('toggleSidebar', handleToggle);
    return () => { document.removeEventListener('mousedown', handleClickOutside); window.removeEventListener('toggleSidebar', handleToggle); };
  }, []);

  return (
    <div className="flex h-screen bg-gray-50/80">
      {/* ── Sidebar ── */}
      <motion.aside
        animate={{ width: sidebarOpen ? 248 : 68 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="bg-emerald-700 flex flex-col overflow-hidden shrink-0"
      >
        <div className="h-14 flex items-center gap-3 px-4 border-b border-emerald-600/40">
          <div className="w-8 h-8 rounded-md bg-white/20 flex items-center justify-center text-white shrink-0">
            <HeartPulse className="w-4 h-4" />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -4 }} className="min-w-0">
                <p className="text-white font-semibold text-sm leading-tight truncate">Patient</p>
                <p className="text-emerald-200/60 text-[10px] leading-tight">Portal</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 py-3 px-3 overflow-y-auto space-y-5">
          {sidebarGroups.map(g => (
            <div key={g.label}>
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-[10px] font-semibold uppercase tracking-widest text-emerald-300/50 px-3 mb-2">{g.label}</motion.p>
                )}
              </AnimatePresence>
              <div className="space-y-0.5">
                {g.items.map(item => {
                  const isActive = activePage === item.page;
                  return (
                    <button key={item.page} onClick={() => setActivePage(item.page)}
                      className={`relative w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] transition-all ${isActive ? 'bg-white/15 text-white font-medium' : 'text-emerald-100/70 hover:bg-white/10 hover:text-white'}`}>
                      {isActive && (
                        <motion.div layoutId="patientActiveIndicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-white rounded-r-full"
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }} />
                      )}
                      <item.icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-white' : ''}`} />
                      <AnimatePresence>
                        {sidebarOpen && (
                          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="truncate">{item.label}</motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-emerald-600/40 p-3">
          <div className={`flex items-center ${sidebarOpen ? 'gap-3' : 'justify-center'}`}>
            <div className="w-8 h-8 rounded-md bg-white/15 flex items-center justify-center text-[11px] text-white font-semibold shrink-0">
              {firstName.charAt(0)}
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">{fullName}</p>
                  <p className="text-[10px] text-emerald-200/50 truncate">Patient</p>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => { logout(); navigate('/login'); }}
                  className="p-1.5 rounded-md hover:bg-white/10 text-emerald-200/50 hover:text-red-300 transition-colors shrink-0" title="Logout">
                  <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-5 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(p => !p)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-gray-50 rounded-md px-3 py-2 w-56 border border-gray-200">
              <HiOutlineMagnifyingGlass className="w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search…" className="bg-transparent text-sm outline-none w-full text-gray-600 placeholder-gray-400" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
              <HiOutlineBell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-semibold">
                  {firstName.charAt(0)}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-medium text-gray-800 leading-tight">{fullName}</p>
                  <p className="text-[10px] text-gray-400">Patient</p>
                </div>
                <HiOutlineChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1.5 z-50">
                  <button onClick={() => { setActivePage('settings'); setProfileOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                    <HiOutlineUser className="w-4 h-4" /> Profile
                  </button>
                  <button onClick={() => { setActivePage('settings'); setProfileOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                    <HiOutlineCog6Tooth className="w-4 h-4" /> Settings
                  </button>
                  <hr className="my-1 border-gray-100" />
                  <button onClick={() => { logout(); navigate('/login'); }}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2">
                    <HiOutlineArrowRightOnRectangle className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {activePage === 'dashboard' && (
            <div className="space-y-5">
              {/* Greeting — full bleed */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-6 text-white">
                <div className="max-w-[1400px] mx-auto">
                  <p className="text-emerald-100 text-xs mb-0.5">Welcome back 👋</p>
                  <h1 className="text-lg font-bold">{firstName}</h1>
                  <p className="text-emerald-100 text-xs mt-0.5">How can we help you today?</p>
                </div>
              </motion.div>

              <div className="px-6 max-w-[1400px] mx-auto space-y-5">

              {/* Quick Actions */}
              <section>
                <h2 className="text-sm font-semibold text-gray-700 mb-3">What would you like to do?</h2>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {([
                    { page: 'appointments' as Page, icon: HiOutlineCalendarDays, label: 'My Appointments', desc: 'View or book appointments', iconBg: 'bg-blue-50', iconFg: 'text-blue-600', ring: 'border-blue-400' },
                    { page: 'reports' as Page, icon: HiOutlineDocumentText, label: 'Medical Reports', desc: 'View your test results', iconBg: 'bg-violet-50', iconFg: 'text-violet-600', ring: 'border-violet-400' },
                    { page: 'billing' as Page, icon: HiOutlineCloudArrowUp, label: 'Records & Billing', desc: 'View billing history', iconBg: 'bg-amber-50', iconFg: 'text-amber-600', ring: 'border-amber-400' },
                  ]).map(a => (
                    <button key={a.page} onClick={() => setActivePage(a.page)}
                      className={`bg-white rounded-lg p-4 border-[1.5px] ${a.ring} hover:bg-gray-50/80 hover:shadow active:scale-[0.98] transition-all duration-150 text-left flex items-start gap-3 group`}>
                      <div className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${a.iconBg}`}>
                        <a.icon className={`w-[18px] h-[18px] ${a.iconFg}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-xs group-hover:text-emerald-700 transition-colors">{a.label}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">{a.desc}</p>
                      </div>
                      <HiOutlineChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 shrink-0 mt-0.5 ml-auto transition-all duration-150" />
                    </button>
                  ))}
                </div>
              </section>

              {/* Upcoming Appointments */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-gray-700">Upcoming Appointments</h2>
                  <button onClick={() => setActivePage('appointments')}
                    className="text-emerald-600 text-[11px] font-medium flex items-center gap-0.5 hover:text-emerald-700">
                    See all <HiOutlineChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                {upcomingAppointments.length === 0 ? (
                  <div className="bg-white rounded-lg p-6 text-center text-gray-400 border border-dashed border-gray-200">
                    <HiOutlineCalendarDays className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-xs">No upcoming appointments</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {upcomingAppointments.map((apt, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                        className="bg-white rounded-lg px-4 py-3 border border-gray-200 flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-50 rounded-md flex items-center justify-center shrink-0">
                          <HiOutlineCalendarDays className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-xs truncate">{apt.hospital}</p>
                          <p className="text-[11px] text-gray-500">{apt.type}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{apt.date} · {apt.time}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {apt.status === 'confirmed'
                            ? <HiOutlineCheckCircle className="w-4 h-4 text-emerald-500" />
                            : <HiOutlineClock className="w-4 h-4 text-amber-500" />}
                          <span className={`text-[11px] font-medium ${apt.status === 'confirmed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {apt.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </section>

              {/* Need Help */}
              <button onClick={() => setActivePage('help')}
                className="w-full bg-white rounded-lg px-4 py-3 border border-gray-200 hover:border-gray-300 transition-colors flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-100 rounded-md flex items-center justify-center">
                  <HiOutlinePhone className="w-4 h-4 text-gray-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 text-xs">Need Help?</p>
                  <p className="text-[11px] text-gray-500">Contact our support team anytime</p>
                </div>
                <HiOutlineChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
              </button>
              </div>
            </div>
          )}

          {activePage === 'registration' && <PatientRegistration />}
          {activePage === 'reports' && <MedicalReports />}
          {activePage === 'appointments' && <AppointmentRequests />}
          {activePage === 'billing' && <Billing />}
          {activePage === 'settings' && <PatientSettings />}
          {activePage === 'help' && <PatientHelp />}
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;
